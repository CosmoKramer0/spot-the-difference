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
        // Get user's phone number for validation
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: { phone: true }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check how many completed games ANY user with this phone number has played
        const completedGames = await prisma_1.default.gameSession.count({
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
        console.log('Request body:', req.body);
        console.log('Request headers:', req.headers);
        // Handle text/plain content-type by parsing manually
        let body = req.body;
        if (!body && req.headers['content-type']?.includes('text/plain')) {
            try {
                // Get raw body and parse as JSON
                const rawBody = req.rawBody || '';
                body = JSON.parse(rawBody);
                console.log('Parsed body from text/plain:', body);
            }
            catch (e) {
                console.log('Failed to parse raw body');
            }
        }
        const userId = req.userId;
        const { sessionId, totalTime } = body;
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
        // Get total count of completed games
        const totalGamesCount = await prisma_1.default.gameSession.count({
            where: {
                completed: true,
                score: { not: null }
            }
        });
        // Get top 10 players
        const topPlayers = await prisma_1.default.gameSession.findMany({
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
        const leaderboard = topPlayers.map((session, index) => ({
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
    }
    catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ message: 'Failed to fetch leaderboard' });
    }
});
// Get leaderboard with user context
router.get('/leaderboard-with-context', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        // Get user's best score
        const userBestSession = await prisma_1.default.gameSession.findFirst({
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
        const totalGamesCount = await prisma_1.default.gameSession.count({
            where: {
                completed: true,
                score: { not: null }
            }
        });
        // Get all players ranked by best score to find user's position
        const allPlayers = await prisma_1.default.gameSession.findMany({
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
            userRank = allPlayers.findIndex((session) => session.userId === userId) + 1;
        }
        // Get top 5 players
        const topPlayers = allPlayers.slice(0, 5);
        // If user is not in top 5, get context around user's position
        let userContext = null;
        if (userRank && userRank > 5) {
            const contextStart = Math.max(0, userRank - 2);
            const contextEnd = Math.min(allPlayers.length, userRank + 1);
            userContext = allPlayers.slice(contextStart, contextEnd).map((session, index) => ({
                rank: contextStart + index + 1,
                name: session.user.name,
                phone: session.user.phone,
                time: session.score,
                completedAt: session.endTime,
                isCurrentUser: session.userId === userId
            }));
        }
        const topLeaderboard = topPlayers.map((session, index) => ({
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
    }
    catch (error) {
        console.error('Leaderboard context error:', error);
        res.status(500).json({ message: 'Failed to fetch leaderboard with context' });
    }
});
exports.default = router;
