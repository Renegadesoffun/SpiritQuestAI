import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { Svg, Circle, Rect } from 'react-native-svg';
import ProceduralMusicGenerator from '../audio/ProceduralMusicGenerator';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const PLAYER_SIZE = 40;
const BOSS_SIZE = 100;
const PROJECTILE_SIZE = 10;

const Player = ({ position }) => (
  <Svg width={PLAYER_SIZE} height={PLAYER_SIZE} x={position.x} y={position.y}>
    <Circle cx={PLAYER_SIZE / 2} cy={PLAYER_SIZE / 2} r={PLAYER_SIZE / 2} fill="blue" />
  </Svg>
);

const Boss = ({ position }) => (
  <Svg width={BOSS_SIZE} height={BOSS_SIZE} x={position.x} y={position.y}>
    <Rect width={BOSS_SIZE} height={BOSS_SIZE} fill="red" />
  </Svg>
);

const Projectile = ({ position, isPlayerProjectile }) => (
  <Svg width={PROJECTILE_SIZE} height={PROJECTILE_SIZE} x={position.x} y={position.y}>
    <Circle cx={PROJECTILE_SIZE / 2} cy={PROJECTILE_SIZE / 2} r={PROJECTILE_SIZE / 2} fill={isPlayerProjectile ? "blue" : "red"} />
  </Svg>
);

const BossBattleSystem = (entities, { touches, time }) => {
  const player = entities.player;
  const boss = entities.boss;
  const projectiles = Object.keys(entities).filter(key => key.startsWith('projectile'));

  // Handle player movement
  touches.filter(t => t.type === 'move').forEach(t => {
    player.position = { x: t.event.pageX - PLAYER_SIZE / 2, y: t.event.pageY - PLAYER_SIZE / 2 };
  });

  // Boss AI
  if (time.current % 60 === 0) {  // Every second
    const angle = Math.atan2(player.position.y - boss.position.y, player.position.x - boss.position.x);
    const projectileKey = `projectile${Object.keys(entities).length}`;
    entities[projectileKey] = {
      position: { ...boss.position },
      velocity: { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 },
      isPlayerProjectile: false,
      renderer: <Projectile />
    };
  }

  // Update projectiles
  projectiles.forEach(key => {
    const projectile = entities[key];
    projectile.position.x += projectile.velocity.x;
    projectile.position.y += projectile.velocity.y;

    // Remove projectiles that are off-screen
    if (projectile.position.x < 0 || projectile.position.x > WIDTH || 
        projectile.position.y < 0 || projectile.position.y > HEIGHT) {
      delete entities[key];
    }

    // Check for collisions
    if (projectile.isPlayerProjectile) {
      if (checkCollision(projectile, boss)) {
        boss.health -= 10;
        delete entities[key];
        if (boss.health <= 0) {
          // Boss defeated
        }
      }
    } else {
      if (checkCollision(projectile, player)) {
        player.health -= 10;
        delete entities[key];
        if (player.health <= 0) {
          // Game over
        }
      }
    }
  });

  return entities;
};

const checkCollision = (entity1, entity2) => {
  return (entity1.position.x < entity2.position.x + BOSS_SIZE &&
          entity1.position.x + PROJECTILE_SIZE > entity2.position.x &&
          entity1.position.y < entity2.position.y + BOSS_SIZE &&
          entity1.position.y + PROJECTILE_SIZE > entity2.position.y);
};

const setupEntities = () => {
  return {
    player: { 
      position: { x: WIDTH / 2, y: HEIGHT - 100 }, 
      health: 100, 
      renderer: <Player /> 
    },
    boss: { 
      position: { x: WIDTH / 2 - BOSS_SIZE / 2, y: 50 }, 
      health: 1000, 
      renderer: <Boss /> 
    }
  };
};

const BossBattleGame = ({ onGameOver, onLevelComplete }) => {
  const [entities, setEntities] = useState(setupEntities());
  const [gameEngine, setGameEngine] = useState(null);
  const [running, setRunning] = useState(false);
  const [music] = useState(new ProceduralMusicGenerator());
  const [score] = useState(0);

  useEffect(() => {
    if (running) {
      music.playBackgroundMusic(); // Changed from generateBossBattleMusic
    } else {
      music.stopBackgroundMusic();
    }
    return () => music.stopBackgroundMusic();
  }, [running]);

  const onEvent = (e) => {
    if (e.type === 'game_over') onGameOver();
    if (e.type === 'level_complete') onLevelComplete();
  };

  const reset = () => {
    setScore(0);
    setRunning(true);
    if (gameEngine) {
      gameEngine.swap(setupEntities());
    }
  };

  return (
    <View style={styles.container}>
      <GameEngine
        ref={(ref) => setGameEngine(ref)}
        style={styles.gameContainer}
        systems={[BossBattleSystem]}
        entities={entities}
        onEvent={onEvent}
        running={running}
      >
        {/* ... (game components) */}
      </GameEngine>
      {!running && (
        <View style={styles.overlay}>
          <Text style={styles.gameOverText}>Game Over</Text>
          <TouchableOpacity style={styles.button} onPress={reset}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameContainer: {
    flex: 1,
  },
  healthBars: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 30,
    color: 'white',
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: 'black',
  },
});

export default BossBattleGame;
