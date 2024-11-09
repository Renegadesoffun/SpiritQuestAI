import { drawCircle, createGradient, drawGlow, drawStar } from './helpers.mjs';

export function drawCosmicEffects(ctx, x, y, size) {
    // Create cosmic background glow
    const bgGlow = createGradient(ctx, x - size/2, y - size/2, x + size/2, y + size/2, [
        'rgba(76, 29, 149, 0.6)',
        'rgba(124, 58, 237, 0.4)',
        'rgba(167, 139, 250, 0.2)'
    ]);
    
    ctx.fillStyle = bgGlow;
    ctx.fillRect(x - size/2, y - size/2, size, size);
    
    // Add stars
    for (let i = 0; i < 50; i++) {
        const starX = x + (Math.random() - 0.5) * size;
        const starY = y + (Math.random() - 0.5) * size;
        const starSize = Math.random() * 4 + 2;
        drawStar(ctx, starX, starY, starSize);
    }
}

export function drawStarfield(ctx, count = 100) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 3 + 1;
        drawStar(ctx, x, y, size);
    }
}

export function drawSpiritualEnergy(ctx, x, y, radius) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(147, 197, 253, 0.4)');
    gradient.addColorStop(1, 'rgba(147, 197, 253, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

export function drawEnergyFields(ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 200 + 100;
        drawGlow(ctx, x, y, radius, 'rgba(147, 197, 253, 0.2)');
    }
}

export function drawDivineLight(ctx, x, y, size) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
}

export function drawCosmos(ctx, width, height) {
    // Create deep space background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#1e293b');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add stars
    drawStarfield(ctx, 200);
}

export function drawSpiritForm(ctx, x, y, size) {
    // Create ethereal form
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(167, 139, 250, 0.4)');
    gradient.addColorStop(1, 'rgba(167, 139, 250, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
}

export function drawLightPath(ctx, width, height) {
    const pathPoints = [];
    const numPoints = 5;
    
    // Create flowing path points
    for (let i = 0; i < numPoints; i++) {
        pathPoints.push({
            x: Math.random() * width,
            y: (height / numPoints) * i
        });
    }
    
    // Draw glowing path
    ctx.beginPath();
    ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
    
    for (let i = 1; i < pathPoints.length; i++) {
        const xc = (pathPoints[i].x + pathPoints[i - 1].x) / 2;
        const yc = (pathPoints[i].y + pathPoints[i - 1].y) / 2;
        ctx.quadraticCurveTo(pathPoints[i - 1].x, pathPoints[i - 1].y, xc, yc);
    }
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 10;
    ctx.stroke();
}
