import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { checkCollision } from './LevelSystems';

const GRAVITY = 0.5;
const JUMP_FORCE = -10;

const MovingPlatform = ({ position, width, direction }) => {
  const [currentPosition, setCurrentPosition] = useState(position);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPosition(prev => ({
        x: prev.x + direction.x,
        y: prev.y + direction.y,
      }));
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return <Platform position={currentPosition} width={width} />;
};

const Switch = ({ position, isOn, onToggle }) => (
  <TouchableOpacity
    style={[styles.switch, { left: position.x, top: position.y, backgroundColor: isOn ? 'green' : 'red' }]}
    onPress={onToggle}
  />
);

const VerticalPlatformerSystem = (entities, { touches, dispatch }) => {
  const player = entities.player;
  const platforms = Object.keys(entities).filter(key => key.startsWith('platform'));
  const collectibles = Object.keys(entities).filter(key => key.startsWith('collectible'));

  // Handle user input
  touches.filter(t => t.type === 'move').forEach(t => {
    player.position.x = t.event.pageX;
  });

  // Apply gravity
  player.velocity.y += GRAVITY;
  player.position.y += player.velocity.y;

  // Check platform collisions
  platforms.forEach(platformKey => {
    const platform = entities[platformKey];
    if (checkCollision(player, platform)) {
      player.velocity.y = JUMP_FORCE;
    }
  });

  // Check collectible collisions
  collectibles.forEach(collectibleKey => {
    const collectible = entities[collectibleKey];
    if (checkCollision(player, collectible)) {
      delete entities[collectibleKey];
      dispatch({ type: 'collect', collectibleType: 'wisdom' });
    }
  });

  // Handle switches
  Object.keys(entities).filter(key => key.startsWith('switch')).forEach(switchKey => {
    const switchEntity = entities[switchKey];
    if (checkCollision(player, switchEntity)) {
      switchEntity.isOn = !switchEntity.isOn;
      // Activate/deactivate corresponding platform
      const platformKey = switchEntity.controlsPlatform;
      entities[platformKey].isActive = switchEntity.isOn;
    }
  });

  // Update moving platforms
  Object.keys(entities).filter(key => key.startsWith('movingPlatform')).forEach(platformKey => {
    const platform = entities[platformKey];
    if (platform.isActive) {
      platform.position.x += platform.direction.x;
      platform.position.y += platform.direction.y;
      // Reverse direction if platform reaches screen edges
      if (platform.position.x <= 0 || platform.position.x + platform.width >= WIDTH) {
        platform.direction.x *= -1;
      }
      if (platform.position.y <= 0 || platform.position.y + PLATFORM_HEIGHT >= HEIGHT) {
        platform.direction.y *= -1;
      }
    }
  });

  // Check if player has reached the top
  if (player.position.y < 0) {
    dispatch({ type: 'level_complete' });
  }

  // Check if player has fallen off the screen
  if (player.position.y > HEIGHT) {
    dispatch({ type: 'game_over' });
  }

  return entities;
};

const setupEntities = () => ({
  player: {
    position: { x: WIDTH / 2, y: HEIGHT - PLAYER_SIZE },
    velocity: { y: 0 },
    size: PLAYER_SIZE,
    renderer: <Player />
  },
  platform1: {
    position: { x: 0, y: HEIGHT - 100 },
    size: { width: WIDTH / 2, height: PLATFORM_HEIGHT },
    renderer: <Platform />
  },
  platform2: {
    position: { x: WIDTH / 2, y: HEIGHT - 200 },
    size: { width: WIDTH / 2, height: PLATFORM_HEIGHT },
    renderer: <Platform />
  },
  collectible1: {
    position: { x: WIDTH / 4, y: HEIGHT - 300 },
    size: COLLECTIBLE_SIZE,
    renderer: <Collectible type="wisdom" />
  },
  movingPlatform1: {
    position: { x: WIDTH / 4, y: HEIGHT - 300 },
    width: WIDTH / 4,
    direction: { x: 1, y: 0 },
    isActive: true,
    renderer: <MovingPlatform />
  },
  switch1: {
    position: { x: WIDTH / 2, y: HEIGHT - 350 },
    size: { width: 20, height: 20 },
    isOn: false,
    controlsPlatform: 'movingPlatform1',
    renderer: <Switch />
  }
});

const VerticalPlatformerGame = ({ onGameOver, onLevelComplete }) => {
  return (
    <GameEngine
      style={styles.gameEngine}
      systems={[VerticalPlatformerSystem]}
      entities={setupEntities()}
      onEvent={(e) => {
        if (e.type === 'game_over') onGameOver();
        if (e.type === 'level_complete') onLevelComplete();
      }}
    />
  );
};

const styles = StyleSheet.create({
  gameEngine: {
    flex: 1,
  },
});

export { VerticalPlatformerSystem, VerticalPlatformerGame };
