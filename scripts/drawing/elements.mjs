import { 
    drawCircle, 
    createGradient, 
    drawBranch, 
    drawSacredGeometry as drawBaseSacredGeometry, 
    createGlow,
    drawGlow,
    drawStar,
    drawGlowingLeaf,
    drawEnergyStream
} from './helpers.mjs';

// Define all functions first
function drawElement(ctx, type, x, y, size) {
    switch(type) {
        case 'crystal':
            drawCrystal(ctx, x, y, size);
            break;
        case 'energy':
            drawEnergy(ctx, x, y, size);
            break;
        case 'spirit':
            drawSpirit(ctx, x, y, size);
            break;
    }
}

function drawMysticalLeaves(ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Draw multiple layers of leaves for depth
    for (let layer = 0; layer < 3; layer++) {
        const leafCount = 30 + layer * 10;
        const baseAlpha = 0.8 - layer * 0.2;
        
        for (let i = 0; i < leafCount; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 15 + Math.random() * 10 + layer * 5;
            
            // Create leaf glow
            const glowRadius = size * 2;
            const glowColor = `rgba(144, 238, 144, ${baseAlpha * 0.3})`;
            drawGlow(ctx, x, y, glowRadius, glowColor);
            
            // Draw the leaf
            drawGlowingLeaf(ctx, x, y);
            
            // Add energy streams between some leaves
            if (Math.random() < 0.3) {
                drawEnergyStream(ctx, x, y);
            }
        }
    }
}

function drawEtherealTree(ctx, x, y, size) {
    // Draw trunk with glow effect
    const trunkGradient = ctx.createLinearGradient(x, y, x, y - size);
    trunkGradient.addColorStop(0, 'rgba(139, 92, 246, 0.8)');
    trunkGradient.addColorStop(1, 'rgba(167, 139, 250, 0.5)');
    ctx.strokeStyle = trunkGradient;
    ctx.lineWidth = size / 20;
    
    // Draw main trunk
    drawBranch(ctx, x, y, size * 0.7, -Math.PI / 2, size / 15);
    
    // Add glowing effect around the tree
    const treeGlow = createGlow(ctx, x, y - size/2, size, 'rgba(139, 92, 246, 0.2)');
    ctx.fillStyle = treeGlow;
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
    
    // Add mystical leaves
    for (let i = 0; i < 30; i++) {
        const leafX = x + (Math.random() - 0.5) * size;
        const leafY = y - Math.random() * size * 0.8;
        drawGlowingLeaf(ctx, leafX, leafY);
    }
    
    // Add energy particles
    for (let i = 0; i < 20; i++) {
        const particleX = x + (Math.random() - 0.5) * size;
        const particleY = y - Math.random() * size;
        drawStar(ctx, particleX, particleY, 2 + Math.random() * 3);
    }
}

function drawCrystal(ctx, x, y, size) {
    // Crystal base shape with enhanced glow
    const crystalGradient = ctx.createLinearGradient(x - size/2, y - size/2, x + size/2, y + size/2);
    crystalGradient.addColorStop(0, 'rgba(147, 197, 253, 0.9)');
    crystalGradient.addColorStop(0.5, 'rgba(191, 219, 254, 0.7)');
    crystalGradient.addColorStop(1, 'rgba(147, 197, 253, 0.9)');
    
    // Draw multiple layers for depth
    for (let i = 0; i < 3; i++) {
        const layerSize = size * (1 - i * 0.2);
        
        ctx.beginPath();
        ctx.moveTo(x, y - layerSize/2);
        ctx.lineTo(x + layerSize/3, y);
        ctx.lineTo(x - layerSize/3, y);
        ctx.closePath();
        
        ctx.fillStyle = crystalGradient;
        ctx.fill();
        
        // Add glow effect for each layer
        drawGlow(ctx, x, y, layerSize, `rgba(147, 197, 253, ${0.3 - i * 0.1})`);
    }
    
    // Add energy particles around the crystal
    for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10;
        const particleX = x + Math.cos(angle) * size * 0.6;
        const particleY = y + Math.sin(angle) * size * 0.6;
        drawStar(ctx, particleX, particleY, 2 + Math.random() * 2);
    }
}

function drawSacredGeometry(ctx, x, y, size) {
    // Enhanced sacred geometry with multiple layers
    const layers = 3;
    
    for (let layer = 0; layer < layers; layer++) {
        const layerSize = size * (1 - layer * 0.2);
        const opacity = 0.7 - layer * 0.2;
        
        // Draw base sacred geometry
        drawBaseSacredGeometry(ctx, x, y, layerSize);
        
        // Add connecting lines between circles
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 6; i++) {
            const angle1 = (i * Math.PI) / 3;
            const angle2 = ((i + 1) * Math.PI) / 3;
            
            const x1 = x + Math.cos(angle1) * layerSize/3;
            const y1 = y + Math.sin(angle1) * layerSize/3;
            const x2 = x + Math.cos(angle2) * layerSize/3;
            const y2 = y + Math.sin(angle2) * layerSize/3;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        // Add glow effect
        drawGlow(ctx, x, y, layerSize, `rgba(255, 255, 255, ${opacity * 0.2})`);
    }
}

// Single export statement at the end
export {
    drawElement,
    drawEtherealTree,
    drawCrystal,
    drawSacredGeometry,
    drawMysticalLeaves
};
