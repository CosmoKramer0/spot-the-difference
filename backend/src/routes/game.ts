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

    if (!sessionId || totalTime === undefined) {
      return res.status(400).json({ 
        message: 'Session ID and total time are required' 
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

    const updatedSession = await prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        endTime: new Date(),
        score: totalTime,
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
    const topPlayers = await prisma.gameSession.findMany({
      where: {
        completed: true,
        score: { not: null }
      },
      orderBy: {
        score: 'asc'
      },
      take: 5,
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

    res.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
});

export default router;