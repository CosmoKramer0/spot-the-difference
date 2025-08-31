"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./utils/prisma"));
const sampleIconSets = [
    {
        name: 'Animals',
        description: 'Find the different animal',
        iconUrls: JSON.stringify(['🐶', '🐶', '🐶', '🐶', '🐶', '🐶', '🐱', '🐶']),
        correctIcon: 6,
        difficulty: 1
    },
    {
        name: 'Fruits',
        description: 'Spot the different fruit',
        iconUrls: JSON.stringify(['🍎', '🍎', '🍎', '🍎', '🍎', '🍌', '🍎', '🍎']),
        correctIcon: 5,
        difficulty: 1
    },
    {
        name: 'Transport',
        description: 'Find the odd vehicle',
        iconUrls: JSON.stringify(['🚗', '🚗', '🚗', '🚗', '🚁', '🚗', '🚗', '🚗']),
        correctIcon: 4,
        difficulty: 1
    },
    {
        name: 'Food',
        description: 'Which food is different?',
        iconUrls: JSON.stringify(['🍕', '🍕', '🍕', '🍕', '🍕', '🍕', '🍔', '🍕']),
        correctIcon: 6,
        difficulty: 2
    },
    {
        name: 'Sports',
        description: 'Find the different sport',
        iconUrls: JSON.stringify(['⚽', '⚽', '⚽', '🏀', '⚽', '⚽', '⚽', '⚽']),
        correctIcon: 3,
        difficulty: 2
    },
    {
        name: 'Weather',
        description: 'Spot the weather difference',
        iconUrls: JSON.stringify(['☀️', '☀️', '☀️', '☀️', '☀️', '🌧️', '☀️', '☀️']),
        correctIcon: 5,
        difficulty: 2
    },
    {
        name: 'Faces',
        description: 'Which emoji is different?',
        iconUrls: JSON.stringify(['😊', '😊', '😊', '😊', '😊', '😊', '😊', '😢']),
        correctIcon: 7,
        difficulty: 3
    },
    {
        name: 'Stars',
        description: 'Find the different star',
        iconUrls: JSON.stringify(['⭐', '⭐', '⭐', '⭐', '⭐', '⭐', '🌟', '⭐']),
        correctIcon: 6,
        difficulty: 3
    },
    {
        name: 'Hearts',
        description: 'Spot the different heart',
        iconUrls: JSON.stringify(['❤️', '❤️', '❤️', '❤️', '💙', '❤️', '❤️', '❤️']),
        correctIcon: 4,
        difficulty: 3
    },
    {
        name: 'Hands',
        description: 'Which hand gesture is different?',
        iconUrls: JSON.stringify(['👍', '👍', '👍', '👍', '👍', '👍', '👎', '👍']),
        correctIcon: 6,
        difficulty: 4
    }
];
async function seedIconSets() {
    console.log('🌱 Seeding icon sets...');
    try {
        // Clear existing icon sets
        await prisma_1.default.iconSet.deleteMany();
        // Create new icon sets
        for (const iconSet of sampleIconSets) {
            await prisma_1.default.iconSet.create({
                data: iconSet
            });
            console.log(`✅ Created icon set: ${iconSet.name}`);
        }
        console.log('🎉 Icon sets seeded successfully!');
    }
    catch (error) {
        console.error('❌ Error seeding icon sets:', error);
    }
    finally {
        await prisma_1.default.$disconnect();
    }
}
if (typeof require !== 'undefined' && require.main === module) {
    seedIconSets();
}
exports.default = seedIconSets;
