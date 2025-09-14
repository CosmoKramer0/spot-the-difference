"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const router = (0, express_1.Router)();
router.get('/sets', async (req, res) => {
    try {
        const iconSets = await prisma_1.default.iconSet.findMany({
            where: { isActive: true },
            orderBy: { difficulty: 'asc' }
        });
        const formattedSets = iconSets.map((set) => ({
            id: set.id,
            name: set.name,
            description: set.description,
            icons: JSON.parse(set.iconUrls),
            correctIcon: set.correctIcon,
            difficulty: set.difficulty
        }));
        res.json({ iconSets: formattedSets });
    }
    catch (error) {
        console.error('Icon sets error:', error);
        res.status(500).json({ message: 'Failed to fetch icon sets' });
    }
});
router.get('/sets/random/:count', async (req, res) => {
    try {
        const count = parseInt(req.params.count) || 10;
        const iconSets = await prisma_1.default.iconSet.findMany({
            where: { isActive: true }
        });
        // Shuffle and take the requested count
        const shuffled = iconSets.sort(() => 0.5 - Math.random());
        const selectedSets = shuffled.slice(0, Math.min(count, iconSets.length));
        const formattedSets = selectedSets.map((set) => {
            // Generate a new random position for the different icon each time
            const newCorrectPosition = Math.floor(Math.random() * 40);
            // Regenerate the icon set with the new random position
            const icons = [];
            const baseIconId = JSON.parse(set.iconUrls)[0].id; // Get the icon ID from the first item
            for (let i = 0; i < 40; i++) {
                icons.push({
                    id: baseIconId,
                    variant: i === newCorrectPosition ? 'different' : 'normal'
                });
            }
            return {
                id: set.id,
                name: set.name,
                description: set.description,
                icons: icons,
                correctIcon: newCorrectPosition,
                difficulty: set.difficulty
            };
        });
        res.json({ iconSets: formattedSets });
    }
    catch (error) {
        console.error('Random icon sets error:', error);
        res.status(500).json({ message: 'Failed to fetch random icon sets' });
    }
});
exports.default = router;
