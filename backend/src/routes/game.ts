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
    const userId = req.userId!;
    const { sessionId, totalTime } = req.body;

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