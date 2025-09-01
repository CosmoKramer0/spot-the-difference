"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./utils/prisma"));
// Function to generate 50 icons with one different
function generateIconSet(iconId, correctPosition) {
    const icons = [];
    for (let i = 0; i < 50; i++) {
        icons.push({
            id: iconId,
            variant: i === correctPosition ? 'different' : 'normal'
        });
    }
    return icons;
}
// Generate sets with consistent correct positions
const elasticsearchCorrect = Math.floor(Math.random() * 50);
const observabilityCorrect = Math.floor(Math.random() * 50);
const securityCorrect = Math.floor(Math.random() * 50);
const elasticLogoCorrect = Math.floor(Math.random() * 50);
const eyeCorrect = Math.floor(Math.random() * 50);
const malwareCorrect = Math.floor(Math.random() * 50);
const sampleIconSets = [
    {
        name: 'Elasticsearch',
        description: 'Find the different Elasticsearch logo',
        iconUrls: JSON.stringify(generateIconSet('elasticsearch', elasticsearchCorrect)),
        correctIcon: elasticsearchCorrect,
        difficulty: 1
    },
    {
        name: 'Observability',
        description: 'Spot the different observability icon',
        iconUrls: JSON.stringify(generateIconSet('observability', observabilityCorrect)),
        correctIcon: observabilityCorrect,
        difficulty: 2
    },
    {
        name: 'Security',
        description: 'Find the different security icon',
        iconUrls: JSON.stringify(generateIconSet('security', securityCorrect)),
        correctIcon: securityCorrect,
        difficulty: 3
    },
    {
        name: 'Elastic Logo',
        description: 'Spot the different Elastic logo',
        iconUrls: JSON.stringify(generateIconSet('elastic-logo', elasticLogoCorrect)),
        correctIcon: elasticLogoCorrect,
        difficulty: 2
    },
    {
        name: 'Eye Symbol',
        description: 'Which eye is different?',
        iconUrls: JSON.stringify(generateIconSet('eye', eyeCorrect)),
        correctIcon: eyeCorrect,
        difficulty: 4
    },
    {
        name: 'Malware',
        description: 'Find the different malware icon',
        iconUrls: JSON.stringify(generateIconSet('malware', malwareCorrect)),
        correctIcon: malwareCorrect,
        difficulty: 5
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
