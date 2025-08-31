import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';

const router = Router();

router.get('/sets', async (req: Request, res: Response) => {
  try {
    const iconSets = await prisma.iconSet.findMany({
      where: { isActive: true },
      orderBy: { difficulty: 'asc' }
    });

    const formattedSets = iconSets.map(set => ({
      id: set.id,
      name: set.name,
      description: set.description,
      icons: JSON.parse(set.iconUrls),
      correctIcon: set.correctIcon,
      difficulty: set.difficulty
    }));

    res.json({ iconSets: formattedSets });
  } catch (error) {
    console.error('Icon sets error:', error);
    res.status(500).json({ message: 'Failed to fetch icon sets' });
  }
});

router.get('/sets/random/:count', async (req: Request, res: Response) => {
  try {
    const count = parseInt(req.params.count) || 10;
    
    const iconSets = await prisma.iconSet.findMany({
      where: { isActive: true }
    });

    // Shuffle and take the requested count
    const shuffled = iconSets.sort(() => 0.5 - Math.random());
    const selectedSets = shuffled.slice(0, Math.min(count, iconSets.length));

    const formattedSets = selectedSets.map(set => ({
      id: set.id,
      name: set.name,
      description: set.description,
      icons: JSON.parse(set.iconUrls),
      correctIcon: set.correctIcon,
      difficulty: set.difficulty
    }));

    res.json({ iconSets: formattedSets });
  } catch (error) {
    console.error('Random icon sets error:', error);
    res.status(500).json({ message: 'Failed to fetch random icon sets' });
  }
});

export default router;