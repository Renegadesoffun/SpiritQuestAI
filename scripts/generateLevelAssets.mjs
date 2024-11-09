import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { 
    drawSacredGeometry, 
    drawEtherealTree,
    drawCrystal
} from './drawing/elements.mjs';
import { 
    drawCosmicEffects, 
    drawStarfield, 
    drawSpiritualEnergy,
    drawEnergyFields,
    drawDivineLight
} from './drawing/effects.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function drawSacredSpirals(ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        drawSacredGeometry(ctx, x, y, 200 + Math.random() * 300);
    }
}

function drawWisdomTrees(ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    for (let i = 0; i < 3; i++) {
        const x = (width / 4) + (i * width / 3);
        const y = height * 0.7;
        drawEtherealTree(ctx, x, y, 400);
    }
}

function drawMysticCrystals(ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    for (let i = 0; i < 7; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = 100 + Math.random() * 200;
        drawCrystal(ctx, x, y, size);
        drawDivineLight(ctx, x, y, size * 1.5);
    }
}

function drawCosmicStars(ctx) {
    drawStarfield(ctx, 200);
    
    // Add nebula effects
    for (let i = 0; i < 3; i++) {
        const x = Math.random() * ctx.canvas.width;
        const y = Math.random() * ctx.canvas.height;
        drawCosmicEffects(ctx, x, y, 400);
    }
}

export async function generateLevelBackgrounds() {
    try {
        const outputDir = path.join(__dirname, '../app/assets/images');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const backgrounds = {
            awakening_bg: {
                colors: ['#1c092c', '#3a1c54'],
                patterns: 'spirals',
                elements: ['lotus', 'energy', 'light']
            },
            forest_bg: {
                colors: ['#0a3200', '#1a5000'],
                patterns: 'trees',
                elements: ['wisps', 'leaves', 'crystals']
            },
            caves_bg: {
                colors: ['#2c0a3a', '#4c1a5a'],
                patterns: 'crystals',
                elements: ['geometry', 'glow', 'mist']
            },
            astral_bg: {
                colors: ['#000033', '#1a1a4c'],
                patterns: 'stars',
                elements: ['nebula', 'cosmos', 'aurora']
            }
        };

        for (const [name, config] of Object.entries(backgrounds)) {
            const canvas = createCanvas(1242, 2436);
            const ctx = canvas.getContext('2d');

            // Create base gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, 2436);
            gradient.addColorStop(0, config.colors[0]);
            gradient.addColorStop(1, config.colors[1]);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1242, 2436);

            // Add patterns
            switch (config.patterns) {
                case 'spirals':
                    drawSacredSpirals(ctx);
                    drawSpiritualEnergy(ctx, 621, 1218, 600);
                    break;
                case 'trees':
                    drawWisdomTrees(ctx);
                    drawEnergyFields(ctx);
                    break;
                case 'crystals':
                    drawMysticCrystals(ctx);
                    break;
                case 'stars':
                    drawCosmicStars(ctx);
                    break;
            }

            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(path.join(outputDir, `${name}.png`), buffer);
            console.log(`Generated ${name}.png`);
        }

        return true; // Add this return statement

    } catch (error) {
        console.error('Error generating level backgrounds:', error);
        throw error;
    }
}

// Helper function to shift color brightness
function shiftColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}
