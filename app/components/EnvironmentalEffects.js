import React from 'react';

export const createEnvironmentalEffects = (ctx, canvas) => {
  // Mystical floating orbs
  const orbs = [];
  
  function addOrb() {
    orbs.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      color: `hsla(${Math.random() * 60 + 200}, 70%, 70%, 0.3)`,
      speed: Math.random() * 0.5 + 0.1
    });
  }

  function drawOrbs() {
    orbs.forEach((orb, index) => {
      orb.y -= orb.speed;
      if (orb.y < -10) orb.y = canvas.height + 10;
      
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      ctx.fillStyle = orb.color;
      ctx.fill();
    });
  }

  // Initialize orbs
  for (let i = 0; i < 50; i++) addOrb();

  return { drawOrbs };
};
