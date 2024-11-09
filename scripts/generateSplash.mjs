import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createCanvas } from 'canvas';
import { 
    drawSacredGeometry,
    drawMysticalLeaves 
} from './drawing/elements.mjs';
import {
    drawCosmicEffects,
    drawStarfield,
    drawSpiritualEnergy,
    drawDivineLight,
    drawLightPath
} from './drawing/effects.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function generateSplash() {
    try {
        const canvas = createCanvas(1242, 2436);
        const ctx = canvas.getContext('2d');

        // Create dynamic mystical gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, 2436);
        gradient.addColorStop(0, '#1a103c');  // Deep mystical purple
        gradient.addColorStop(0.4, '#2a1b4a'); // Rich medium purple
        gradient.addColorStop(0.6, '#312e81'); // Deep indigo
        gradient.addColorStop(1, '#1e1b4b');   // Dark mystical blue
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1242, 2436);

        // Add cosmic effects and starfield
        drawCosmicEffects(ctx, 621, 1218, 1000);
        drawStarfield(ctx, 300);

        // Create a path of light
        drawLightPath(ctx, 1242, 2436);

        // Add sacred geometry patterns in a triangular formation
        const centerY = 1218;
        for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3;
            const x = 621 + Math.cos(angle) * 300;
            const y = centerY + Math.sin(angle) * 300;
            drawSacredGeometry(ctx, x, y, 200);
            drawDivineLight(ctx, x, y, 250);
        }

        // Add spiritual energy in the center
        drawSpiritualEnergy(ctx, 621, centerY, 400);

        // Add mystical leaves for organic feel
        drawMysticalLeaves(ctx);

        // Add title with enhanced glow effect
        ctx.save();
        // Outer glow
        ctx.shadowColor = 'rgba(147, 197, 253, 0.8)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Main title
        ctx.font = 'bold 120px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        
        // Draw title multiple times for stronger glow
        for (let i = 0; i < 3; i++) {
            ctx.fillText('Spirit Quest', 621, centerY - 100);
        }

        // Subtitle with different glow
        ctx.shadowColor = 'rgba(167, 139, 250, 0.6)';
        ctx.shadowBlur = 20;
        ctx.font = 'italic 60px Arial';
        ctx.fillText('A Journey Within', 621, centerY + 50);

        // Add mystical symbols
        const symbols = '✧ ☽ ✧';
        ctx.font = '40px Arial';
        ctx.fillText(symbols, 621, centerY + 150);

        ctx.restore();

        // Save the enhanced splash screen
        const outputDir = path.join(process.cwd(), 'app/assets/images');
        const buffer = canvas.toBuffer('image/png');
        await fs.promises.writeFile(path.join(outputDir, 'splash.png'), buffer);
        console.log('Generated splash screen');

        return true;
    } catch (error) {
        console.error('Error generating splash screen:', error);
        throw error;
    }
}
