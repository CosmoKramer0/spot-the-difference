import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();

interface AuthRequest extends Request {
  userId?: string;
}

router.post('/start', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    // Get user's phone number for validation
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check how many completed games ANY user with this phone number has played
    const completedGames = await prisma.gameSession.count({
      where: {
        user: {
          phone: user.phone
        },
        completed: true
      }
    });

    // Allow maximum 2 games per phone number
    if (completedGames >= 2) {
      return res.status(403).json({ 
        message: 'You have already played the maximum number of games (2). Each phone number is limited to 2 attempts.' 
      });
    }

    const gameSession = await prisma.gameSession.create({
      data: {
        userId,
        startTime: new Date()
      }
    });

    res.json({
      message: 'Game session started',
      sessionId: gameSession.id,
      startTime: gameSession.startTime
    });
  } catch (error) {
    console.error('Game start error:', error);
    res.status(500).json({ message: 'Failed to start game session' });
  }
});

router.post('/complete', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    // Handle text/plain content-type by parsing manually
    let body = req.body;
    if (!body && req.headers['content-type']?.includes('text/plain')) {
      try {
        // Get raw body and parse as JSON
        const rawBody = (req as any).rawBody || '';
        body = JSON.parse(rawBody);
        console.log('Parsed body from text/plain:', body);
      } catch (e) {
        console.log('Failed to parse raw body');
      }
    }
    
    const userId = req.userId!;
    const { sessionId, totalTime } = body;

    if (!sessionId || totalTime === undefined || totalTime === null) {
      return res.status(400).json({
        message: 'Session ID and total time are required'
      });
    }

    // Validate totalTime is a positive number and reasonable
    if (typeof totalTime !== 'number' || totalTime < 0 || totalTime > 3600000) {
      return res.status(400).json({
        message: 'Invalid time value. Time must be between 0 and 3600000 centiseconds (1 hour)'
      });
    }

    const gameSession = await prisma.gameSession.findFirst({
      where: {
        id: sessionId,
        userId,
        completed: false
      }
    });

    if (!gameSession) {
      return res.status(404).json({ message: 'Game session not found' });
    }

    // Calculate server-side time as backup validation
    const endTime = new Date();
    const serverCalculatedTime = Math.floor((endTime.getTime() - gameSession.startTime.getTime()) / 10);

    // Use client time if reasonable, otherwise use server time
    let finalTime = totalTime;
    const timeDifference = Math.abs(serverCalculatedTime - totalTime);

    // If client time differs significantly from server time (more than 30 seconds), use server time
    if (timeDifference > 3000) {
      console.warn(`Client time (${totalTime}) differs significantly from server time (${serverCalculatedTime}), using server time`);
      finalTime = serverCalculatedTime;
    }

    // Final validation: ensure positive and reasonable time
    finalTime = Math.max(1, Math.min(finalTime, 3600000));

    const updatedSession = await prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        endTime,
        score: finalTime,
        completed: true
      }
    });


    res.json({
      message: 'Game completed successfully',
      session: updatedSession
    });
  } catch (error) {
    console.error('Game completion error:', error);
    res.status(500).json({ message: 'Failed to complete game session' });
  }
});

router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    // Get total count of completed games
    const actualCount = await prisma.gameSession.count({
      where: {
        completed: true,
        score: { not: null }
      }
    });
    const totalGamesCount = actualCount + 484; // Add 484 to reach 529+ and increment with new games

    // Get top 10 players
    const topPlayers = await prisma.gameSession.findMany({
      where: {
        completed: true,
        score: { not: null }
      },
      orderBy: {
        score: 'asc'
      },
      take: 10,
      include: {
        user: {
          select: {
            name: true,
            phone: true
          }
        }
      }
    });

    const leaderboard = topPlayers.map((session: any, index: number) => ({
      rank: index + 1,
      name: session.user.name,
      phone: session.user.phone,
      time: session.score,
      completedAt: session.endTime
    }));

    res.json({
      leaderboard,
      totalGames: totalGamesCount
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
});

// Get leaderboard with user context
router.get('/leaderboard-with-context', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    // Get user's best score
    const userBestSession = await prisma.gameSession.findFirst({
      where: {
        userId,
        completed: true,
        score: { not: null }
      },
      orderBy: {
        score: 'asc'
      },
      include: {
        user: {
          select: {
            name: true,
            phone: true
          }
        }
      }
    });

    // Get total count of completed games
    const actualCount = await prisma.gameSession.count({
      where: {
        completed: true,
        score: { not: null }
      }
    });
    const totalGamesCount = actualCount + 484; // Add 484 to reach 529+ and increment with new games

    // Get all players ranked by best score to find user's position
    const allPlayers = await prisma.gameSession.findMany({
      where: {
        completed: true,
        score: { not: null }
      },
      orderBy: {
        score: 'asc'
      },
      include: {
        user: {
          select: {
            name: true,
            phone: true
          }
        }
      },
      distinct: ['userId']
    });

    // Find user's rank
    let userRank = null;
    if (userBestSession) {
      userRank = allPlayers.findIndex((session: any) => session.userId === userId) + 1;
    }

    // Get top 5 players
    const topPlayers = allPlayers.slice(0, 5);

    // If user is not in top 5, get context around user's position
    let userContext = null;
    if (userRank && userRank > 5) {
      const contextStart = Math.max(0, userRank - 2);
      const contextEnd = Math.min(allPlayers.length, userRank + 1);
      userContext = allPlayers.slice(contextStart, contextEnd).map((session: any, index: number) => ({
        rank: contextStart + index + 1,
        name: session.user.name,
        phone: session.user.phone,
        time: session.score,
        completedAt: session.endTime,
        isCurrentUser: session.userId === userId
      }));
    }

    const topLeaderboard = topPlayers.map((session: any, index: number) => ({
      rank: index + 1,
      name: session.user.name,
      phone: session.user.phone,
      time: session.score,
      completedAt: session.endTime,
      isCurrentUser: session.userId === userId
    }));

    res.json({
      topLeaderboard,
      userContext,
      userRank,
      totalGames: totalGamesCount,
      hasUserPlayed: !!userBestSession
    });
  } catch (error) {
    console.error('Leaderboard context error:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard with context' });
  }
});

export default router;