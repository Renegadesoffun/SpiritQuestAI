import { drawCircle, drawGlow, createGradient } from './helpers.mjs';



export function drawCharacter(ctx, options) {

	const { type, size, colors } = options;

	

	// Base character shape

	ctx.beginPath();

	ctx.arc(size/2, size/2, size/3, 0, Math.PI * 2);

	ctx.fillStyle = colors[0];

	ctx.fill();

	

	// Aura effect

	ctx.beginPath();

	ctx.arc(size/2, size/2, size/2.5, 0, Math.PI * 2);

	ctx.strokeStyle = colors[1];

	ctx.lineWidth = size/20;

	ctx.stroke();

}



function drawSpirit(ctx, size, colors) {

	const centerX = size / 2;

	const centerY = size / 2;

	

	// Draw glow

	drawGlow(ctx, centerX, centerY, size/2, colors[1]);

	

	// Draw core

	drawCircle(ctx, centerX, centerY, size/4, colors[0]);

}



// Add other character drawing functions as needed

function drawMaster(ctx, size, colors) {

	// Similar to drawSpirit but with different patterns

}



function drawGuardian(ctx, size, colors) {

	// Similar to drawSpirit but with different patterns

}



function drawKeeper(ctx, size, colors) {

	// Similar to drawSpirit but with different patterns

}




