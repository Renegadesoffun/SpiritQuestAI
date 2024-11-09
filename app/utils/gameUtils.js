import Matter from 'matter-js';
import { Dimensions } from 'react-native';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const GAP_SIZE = 200;
const PIPE_WIDTH = 60;

export const generatePipes = () => {
  const topHeight = Math.random() * (HEIGHT - PIPE_GAP - 100) + 50;
  const bottomHeight = HEIGHT - topHeight - PIPE_GAP;

  return {
    topHeight,
    bottomHeight,
    x: WIDTH + PIPE_WIDTH / 2,
    scored: false
  };
};

export const resetPipes = (pipes, world, screenWidth, screenHeight, pipeWidth, pipeGap) => {
  Matter.World.remove(world, [pipes.topPipe, pipes.bottomPipe]);
  return generatePipes(screenWidth, screenHeight, pipeWidth, pipeGap);
};

export const movePipes = (pipes) => {
  Matter.Body.translate(pipes.topPipe, { x: -2, y: 0 });
  Matter.Body.translate(pipes.bottomPipe, { x: -2, y: 0 });
};

export const checkCollision = (bird, pipes) => {
  if (!bird || !pipes.topPipe || !pipes.bottomPipe) return false;
  
  const birdBounds = {
    left: bird.position.x - 25,
    right: bird.position.x + 25,
    top: bird.position.y - 25,
    bottom: bird.position.y + 25
  };

  const topPipeBounds = {
    left: pipes.topPipe.position.x - PIPE_WIDTH / 2,
    right: pipes.topPipe.position.x + PIPE_WIDTH / 2,
    top: 0,
    bottom: pipes.topPipe.position.y + PIPE_HEIGHT / 2
  };

  const bottomPipeBounds = {
    left: pipes.bottomPipe.position.x - PIPE_WIDTH / 2,
    right: pipes.bottomPipe.position.x + PIPE_WIDTH / 2,
    top: pipes.bottomPipe.position.y - PIPE_HEIGHT / 2,
    bottom: HEIGHT
  };

  // Check collision with either pipe
  return (
    (birdBounds.right > topPipeBounds.left && 
     birdBounds.left < topPipeBounds.right && 
     birdBounds.top < topPipeBounds.bottom) ||
    (birdBounds.right > bottomPipeBounds.left && 
     birdBounds.left < bottomPipeBounds.right && 
     birdBounds.bottom > bottomPipeBounds.top)
  );
};
