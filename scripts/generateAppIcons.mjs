import { createCanvas } from 'canvas';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

async function generateAppIcons() {
    console.log('🎨 Generating app icons...');
    
    const sizes = {
        icon: [1024, 1024],
        splash: [2048, 2048],
        adaptive: [432, 432],
    };

    const canvas = createCanvas(sizes.icon[0], sizes.icon[1]);
    const ctx = canvas.getContext('2d');

    // Draw app icon
    const gradient = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
    gradient.addColorStop(0, '#4F46E5');  // Indigo
    gradient.addColorStop(1, '#312E81');  // Dark Indigo
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 1024);

    // Draw sacred geometry symbol
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 8;
    drawSacredGeometry(ctx, 512, 512, 400);

    // Save the original icon
    const iconBuffer = canvas.toBuffer('image/png');
    await fs.mkdir('app/assets/images', { recursive: true });
    await fs.writeFile('app/assets/images/icon.png', iconBuffer);

    // Generate different sizes using sharp
    const resizeConfigs = {
        'icon-ios.png': [180, 180],
        'icon-android.png': [192, 192],
        'icon-web.png': [512, 512],
        'splash.png': [2048, 2048],
        'adaptive-icon.png': [432, 432]
    };

    for (const [filename, [width, height]] of Object.entries(resizeConfigs)) {
        await sharp(iconBuffer)
            .resize(width, height)
            .png()
            .toFile(`app/assets/images/${filename}`);
        console.log(`✓ Generated ${filename}`);
    }
}

function drawSacredGeometry(ctx, x, y, size) {
    // Draw hexagon with inner details
    const points = 6;
    const angleStep = (Math.PI * 2) / points;
    
    // Outer hexagon
    ctx.beginPath();
    for (let i = 0; i < points; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const px = x + Math.cos(angle) * size;
        const py = y + Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();

    // Inner triangles
    for (let i = 0; i < points; i++) {
        const angle = i * angleStep - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
            x + Math.cos(angle) * size,
            y + Math.sin(angle) * size
        );
        ctx.lineTo(
            x + Math.cos(angle + angleStep) * size,
            y + Math.sin(angle + angleStep) * size
        );
        ctx.closePath();
        ctx.stroke();
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    generateAppIcons().catch(console.error);
}

export { generateAppIcons }; 