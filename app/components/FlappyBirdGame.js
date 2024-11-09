import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet, Animated, Dimensions } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { Svg, Rect, Circle, LinearGradient, Stop, Path } from 'react-native-svg';
import { SoundEffects } from '../audio/SoundEffects';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const BIRD_SIZE = 30;
const PIPE_WIDTH = 60;
const GAP_SIZE = 200;

const Bird = ({ position, rotation }) => (
  <Svg style={[styles.bird, { top: position.y, left: position.x }]}>
    <Circle cx={BIRD_SIZE / 2} cy={BIRD_SIZE / 2} r={BIRD_SIZE / 2} fill="yellow" />
    <Circle cx={BIRD_SIZE * 0.7} cy={BIRD_SIZE * 0.4} r={BIRD_SIZE * 0.1} fill="black" />
    <Path
      d={`M${BIRD_SIZE * 0.8},${BIRD_SIZE * 0.4} Q${BIRD_SIZE * 0.9},${BIRD_SIZE * 0.5} ${BIRD_SIZE},${BIRD_SIZE * 0.4}`}
      stroke="orange"
      strokeWidth="2"
    />
  </Svg>
);

const Pipe = ({ position, height, isTop }) => (
  <Svg style={[styles.pipe, { top: position.y, left: position.x, height }]}>
    <LinearGradient id="pipeGradient" x1="0" y1="0" x2="1" y2="0">
      <Stop offset="0" stopColor="#228B22" />
      <Stop offset="1" stopColor="#32CD32" />
    </LinearGradient>
    <Rect width={PIPE_WIDTH} height={height} fill="url(#pipeGradient)" />
  </Svg>
);

const Physics = (entities, { touches, time, dispatch }) => {
  const bird = entities.bird;
  const pipes = Object.keys(entities).filter(key => key.startsWith('pipe'));
  const particles = Object.keys(entities).filter(key => key.startsWith('particle'));

  // Bird physics
  bird.velocity += 0.5;
  bird.position.y += bird.velocity;
  bird.rotation = Math.min(Math.max(-20, bird.velocity * 2), 90);

  if (touches.find(t => t.type === 'press')) {
    bird.velocity = -8;
    dispatch({ type: 'flap' });
  }

  // Pipe movement
  pipes.forEach(pipeKey => {
    entities[pipeKey].position.x -= 3;
    if (entities[pipeKey].position.x < -PIPE_WIDTH) {
      delete entities[pipeKey];
      dispatch({ type: 'score' });
    }
  });

  // Particle movement
  particles.forEach(particleKey => {
    const particle = entities[particleKey];
    particle.position.x += particle.velocity.x;
    particle.position.y += particle.velocity.y;
    particle.velocity.y += 0.1;
    particle.size -= 0.2;
    if (particle.size <= 0) {
      delete entities[particleKey];
    }
  });

  // Collision detection
  pipes.forEach(pipeKey => {
    const pipe = entities[pipeKey];
    if (
      bird.position.x < pipe.position.x + PIPE_WIDTH &&
      bird.position.x + BIRD_SIZE > pipe.position.x &&
      (bird.position.y < pipe.height || bird.position.y + BIRD_SIZE > pipe.height + GAP_SIZE)
    ) {
      dispatch({ type: 'game_over' });
    }
  });

  // Add new pipes
  if (time.current % 100 === 0) {
    const pipeHeight = Math.random() * (HEIGHT - GAP_SIZE - 100) + 50;
    const newPipe = {
      position: { x: WIDTH, y: 0 },
      height: pipeHeight,
      renderer: <Pipe height={pipeHeight} />
    };
    entities[`pipe${time.current}`] = newPipe;
    entities[`pipe${time.current}Bottom`] = {
      position: { x: WIDTH, y: pipeHeight + GAP_SIZE },
      height: HEIGHT - pipeHeight - GAP_SIZE,
      renderer: <Pipe height={HEIGHT - pipeHeight - GAP_SIZE} />
    };
  }

  return entities;
};

const FlappyBirdGame = ({ onGameOver }) => {
  const [gameEngine, setGameEngine] = useState(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const backgroundAnimation = useRef(new Animated.Value(0)).current;
  const soundEffects = useRef(new SoundEffects()).current;

  // Initialize game entities
  const [entities, setEntities] = useState(() => ({
    bird: {
      position: { x: WIDTH / 4, y: HEIGHT / 2 },
      velocity: { y: 0 },
      size: BIRD_SIZE,
      renderer: <Bird />
    },
    obstacle1: {
      position: { x: WIDTH, y: 0 },
      size: { width: PIPE_WIDTH, height: HEIGHT / 2 - GAP_SIZE / 2 },
      passed: false,
      renderer: <Pipe />
    },
    // Add more initial entities as needed
  }));

  useEffect(() => {
    // Initialize sound effects
    const initSound = async () => {
      try {
        await soundEffects.engine.init();
      } catch (err) {
        console.warn('Failed to initialize sound effects:', err);
      }
    };
    initSound();

    return () => {
      if (gameEngine) {
        gameEngine.stop();
      }
    };
  }, []);

  const onEvent = useCallback((e) => {
    if (e.type === 'game-over') {
      setRunning(false);
      soundEffects.effects.gameOver();
      onGameOver?.(score);
    } else if (e.type === 'score') {
      setScore(prev => prev + 1);
      soundEffects.effects.collect();
    }
  }, [score, onGameOver]);

  const reset = () => {
    setScore(0);
    setRunning(true);
    setEntities(() => ({
      bird: {
        position: { x: WIDTH / 4, y: HEIGHT / 2 },
        velocity: { y: 0 },
        size: BIRD_SIZE,
        renderer: <Bird />
      },
      obstacle1: {
        position: { x: WIDTH, y: 0 },
        size: { width: PIPE_WIDTH, height: HEIGHT / 2 - GAP_SIZE / 2 },
        passed: false,
        renderer: <Pipe />
      },
      // Add more initial entities as needed
    }));
  };

  // Add useCallback for performance
  const handleGameOver = useCallback(() => {
    if (soundEffects?.current) {
      soundEffects.current.playSound('gameOver');
    }
    onGameOver?.(score);
  }, [score, onGameOver]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.backgroundContainer,
          {
            transform: [
              {
                translateX: backgroundAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -WIDTH],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={WIDTH * 2} height={HEIGHT}>
          <LinearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#87CEEB" />
            <Stop offset="1" stopColor="#E0F6FF" />
          </LinearGradient>
          <Rect width={WIDTH * 2} height={HEIGHT} fill="url(#skyGradient)" />
          {/* Add cloud shapes here */}
        </Svg>
      </Animated.View>
      <GameEngine
        ref={(ref) => setGameEngine(ref)}
        systems={[Physics]}
        entities={entities}
        running={running}
        onEvent={onEvent}
        style={styles.gameContainer}
      >
        {/* Game UI components */}
      </GameEngine>
      <Text style={styles.score}>{score}</Text>
      {!running && (
        <TouchableWithoutFeedback 
          onPress={() => {
            reset();
            playFlapSound();
          }}
        >
          <View style={styles.fullScreenButton}>
            <Text style={styles.gameOverText}>Game Over</Text>
            <Text style={styles.gameOverSubText}>Tap to Play Again</Text>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  bird: {
    position: 'absolute',
  },
  pipe: {
    position: 'absolute',
  },
  score: {
    position: 'absolute',
    top: 50,
    left: WIDTH / 2 - 20,
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  fullScreenButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  gameOverSubText: {
    color: 'white',
    fontSize: 24,
    marginTop: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default FlappyBirdGame;
