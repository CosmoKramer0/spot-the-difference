"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/start', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const gameSession = await prisma_1.default.gameSession.create({
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
    }
    catch (error) {
        console.error('Game start error:', error);
        res.status(500).json({ message: 'Failed to start game session' });
    }
});
router.post('/complete', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { sessionId, totalTime } = req.body;
        if (!sessionId || totalTime === undefined) {
            return res.status(400).json({
                message: 'Session ID and total time are required'
            });
        }
        const gameSession = await prisma_1.default.gameSession.findFirst({
            where: {
                id: sessionId,
                userId,
                completed: false
            }
        });
        if (!gameSession) {
            return res.status(404).json({ message: 'Game session not found' });
        }
        const updatedSession = await prisma_1.default.gameSession.update({
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
    }
    catch (error) {
        console.error('Game completion error:', error);
        res.status(500).json({ message: 'Failed to complete game session' });
    }
});
router.get('/leaderboard', async (req, res) => {
    try {
        const topPlayers = await prisma_1.default.gameSession.findMany({
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
        const leaderboard = topPlayers.map((session, index) => ({
            rank: index + 1,
            name: session.user.name,
            phone: session.user.phone,
            time: session.score,
            completedAt: session.endTime
        }));
        res.json({ leaderboard });
    }
    catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ message: 'Failed to fetch leaderboard' });
    }
});
exports.default = router;
