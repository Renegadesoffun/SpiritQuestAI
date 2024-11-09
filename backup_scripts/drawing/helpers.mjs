// Basic drawing helpers
export function drawStar(ctx, x, y, size) {
    const spikes = 5;
    const outerRadius = size / 2;
    const innerRadius = outerRadius * 0.4;

    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes;
        const pointX = x + Math.cos(angle) * radius;
        const pointY = y + Math.sin(angle) * radius;
        
        if (i === 0) {
            ctx.moveTo(pointX, pointY);
        } else {
            ctx.lineTo(pointX, pointY);
        }
    }
    ctx.closePath();
    ctx.stroke();
}

export function drawBranch(ctx, startX, startY, length, angle, width) {
    if (length < 10) return;
    
    const endX = startX + Math.cos(angle) * length;
    const endY = startY + Math.sin(angle) * length;
    
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Draw smaller branches recursively
    const newLength = length * 0.7;
    const newWidth = width * 0.7;
    drawBranch(ctx, endX, endY, newLength, angle - Math.PI / 4, newWidth);
    drawBranch(ctx, endX, endY, newLength, angle + Math.PI / 4, newWidth);
}

export function drawEnergyStream(ctx, x, y) {
  const gradient = ctx.createLinearGradient(x, y, x + 100, y);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2;
  
  ctx.beginPath();
  ctx.moveTo(x, y);
  
  // Create flowing energy effect
  for (let i = 0; i < 100; i += 5) {
    const wave = Math.sin(i * 0.1) * 20;
    ctx.lineTo(x + i, y + wave);
  }
  ctx.stroke();
}

export function drawGlowingLeaf(ctx, x, y) {
    const size = 20;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, 'rgba(144, 238, 144, 0.8)');
    gradient.addColorStop(1, 'rgba(144, 238, 144, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x, y, size, size/2, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
}

export function drawCircle(ctx, x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

export function drawGlow(ctx, x, y, radius, color) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

export function createGradient(ctx, x1, y1, x2, y2, colors) {
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color);
  });
  return gradient;
}

export function drawSacredGeometry(ctx, x, y, size) {
    // Draw flower of life pattern
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const dx = Math.cos(angle) * size/3;
        const dy = Math.sin(angle) * size/3;
        
        ctx.beginPath();
        ctx.arc(x + dx, y + dy, size/3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.stroke();
    }
    
    // Center circle
    ctx.beginPath();
    ctx.arc(x, y, size/3, 0, Math.PI * 2);
    ctx.stroke();
}

export function createGlow(ctx, x, y, radius, color) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'transparent');
    return gradient;
}
