import { createCanvas } from 'canvas';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { drawCharacter } from './drawing/characters.mjs';
import { 
    drawSacredGeometry, 
    drawEtherealTree, 
    drawMysticalLeaves 
} from './drawing/elements.mjs';
import {
    drawCosmicEffects,
    drawStarfield,
    drawSpiritualEnergy,
    drawEnergyFields
} from './drawing/effects.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function generateGameAssets() {
    console.log('🎨 Generating game assets...');
    
    const assets = {
        'spirit_player': {
            width: 512,
            height: 512,
            draw: (ctx) => drawCharacter(ctx, {
                type: 'spirit',
                size: 512,
                colors: ['rgba(147, 197, 253, 0.8)', 'rgba(191, 219, 254, 0.6)']
            })
        },
        'meditation_master': {
            width: 512,
            height: 512,
            draw: (ctx) => drawCharacter(ctx, {
                type: 'master',
                size: 512,
                colors: ['rgba(167, 139, 250, 0.8)', 'rgba(196, 181, 253, 0.6)']
            })
        },
        'forest_guardian': {
            width: 512,
            height: 512,
            draw: (ctx) => drawCharacter(ctx, {
                type: 'guardian',
                size: 512,
                colors: ['rgba(110, 231, 183, 0.8)', 'rgba(167, 243, 208, 0.6)']
            })
        },
        'crystal_keeper': {
            width: 512,
            height: 512,
            draw: (ctx) => drawCharacter(ctx, {
                type: 'keeper',
                size: 512,
                colors: ['rgba(147, 197, 253, 0.8)', 'rgba(191, 219, 254, 0.6)']
            })
        },
        'map_bg': {
            width: 1920,
            height: 1080,
            draw: (ctx) => {
                // Draw mystical background
                const gradient = ctx.createLinearGradient(0, 0, 0, 1080);
                gradient.addColorStop(0, '#1a1a2e');
                gradient.addColorStop(1, '#16213e');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 1920, 1080);

                // Add sacred geometry patterns
                drawSacredGeometry(ctx, 960, 540, 400);
                
                // Add ethereal trees
                drawEtherealTree(ctx, 480, 1080, 600);
                drawEtherealTree(ctx, 1440, 1080, 600);
                
                // Add mystical particles
                drawMysticalLeaves(ctx);
            }
        },
        'astral_plane': {
            width: 1920,
            height: 1080,
            draw: (ctx) => {
                const gradient = ctx.createLinearGradient(0, 0, 0, 1080);
                gradient.addColorStop(0, '#0f172a');
                gradient.addColorStop(1, '#1e293b');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 1920, 1080);
                
                // Add cosmic effects
                drawCosmicEffects(ctx, 960, 540, 800);
                drawStarfield(ctx, 200);
                drawEnergyFields(ctx);
            }
        },
        'spirit_realm': {
            width: 1920,
            height: 1080,
            draw: (ctx) => {
                const gradient = ctx.createLinearGradient(0, 0, 0, 1080);
                gradient.addColorStop(0, '#312e81');
                gradient.addColorStop(1, '#4c1d95');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 1920, 1080);
                
                // Add mystical effects
                drawEtherealTree(ctx, 960, 1080, 800);
                drawSpiritualEnergy(ctx, 960, 540, 400);
                drawMysticalLeaves(ctx);
            }
        }
    };

    const outputDir = path.join(process.cwd(), 'app/assets/images/game');
    await fs.mkdir(outputDir, { recursive: true });

    for (const [name, asset] of Object.entries(assets)) {
        const canvas = createCanvas(asset.width, asset.height);
        const ctx = canvas.getContext('2d');
        
        await asset.draw(ctx);
        
        const buffer = canvas.toBuffer('image/png');
        await fs.writeFile(path.join(outputDir, `${name}.png`), buffer);
        console.log(`Generated ${name}.png`);
    }

    return true;
}

// Helper functions for new effects
function drawEtherealMist(ctx) {
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * ctx.canvas.width;
        const y = Math.random() * ctx.canvas.height;
        const radius = Math.random() * 200 + 100;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawFloatingCrystals(ctx) {
    for (let i = 0; i < 15; i++) {
        const x = Math.random() * ctx.canvas.width;
        const y = Math.random() * ctx.canvas.height;
        const size = Math.random() * 50 + 30;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.random() * Math.PI);
        
        // Crystal shape
        ctx.beginPath();
        ctx.moveTo(0, -size/2);
        ctx.lineTo(size/3, 0);
        ctx.lineTo(0, size/2);
        ctx.lineTo(-size/3, 0);
        ctx.closePath();
        
        // Crystal glow
        ctx.shadowColor = 'rgba(147, 197, 253, 0.8)';
        ctx.shadowBlur = 20;
        ctx.fillStyle = 'rgba(191, 219, 254, 0.6)';
        ctx.fill();
        
        ctx.restore();
    }
}

function drawAuroraBorealis(ctx) {
    const height = ctx.canvas.height;
    const width = ctx.canvas.width;
    
    for (let i = 0; i < 3; i++) {
        const y = height * 0.2 + (i * height * 0.15);
        ctx.beginPath();
        ctx.moveTo(0, y);
        
        // Create wavy pattern
        for (let x = 0; x < width; x += 50) {
            const wave = Math.sin(x * 0.01 + i) * 50;
            ctx.lineTo(x, y + wave);
        }
        
        const gradient = ctx.createLinearGradient(0, y - 50, 0, y + 50);
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0)');
        gradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.2)');
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 100;
        ctx.stroke();
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    generateGameAssets().catch(console.error);
}
