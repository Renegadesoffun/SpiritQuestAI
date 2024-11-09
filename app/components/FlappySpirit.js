import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, Animated, TouchableOpacity } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import Bird from './Bird';
import Floor from './Floor';
import Obstacle from './Obstacle';
import { generatePipes, resetPipes, movePipes, checkCollision } from '../utils/gameUtils';
import AudioEngine from '../audio/AudioEngine';
import MusicComposer from '../audio/MusicComposer';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

// Add missing constants
const PIPE_WIDTH = 60;
const PIPE_HEIGHT = HEIGHT / 2;
const PIPE_GAP = 200;

// Add spiritual constants
const AURA_COLORS = ['#4fc3f7', '#9c27b0', '#ffd700'];
const MEDITATION_BONUS = 1.5;
const SPIRIT_TRAIL_LENGTH = 8;

const FlappySpirit = ({ navigation }) => {
  const [gameEngine, setGameEngine] = useState(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const backgroundAnimation = useRef(new Animated.Value(0)).current;
  const [auraColor, setAuraColor] = useState(AURA_COLORS[0]);
  const [spiritTrail, setSpiritTrail] = useState([]);
  const [meditationMode, setMeditationMode] = useState(false);

  useEffect(() => {
    setupGame();
    return () => {
      // Cleanup
      if (gameEngine) {
        gameEngine.stop();
      }
    };
  }, []);

  useEffect(() => {
    MusicComposer.playMusic('spirit', {
      variation: 'flight',
      intensity: 0.6
    });
    
    return () => MusicComposer.stop();
  }, []);

  const setupGame = () => {
    const engine = Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;

    // Create bird with proper dimensions
    const bird = Matter.Bodies.rectangle(WIDTH / 4, HEIGHT / 2, 50, 50, {
      label: 'Bird',
      restitution: 0.5,
      friction: 1.0,
    });

    // Create initial pipe positions
    const pipeGap = PIPE_GAP;
    const pipeWidth = PIPE_WIDTH;
    const pipeSeparation = WIDTH + pipeWidth;

    // Create pipes with proper dimensions
    const topPipe = Matter.Bodies.rectangle(
      pipeSeparation,
      0,
      pipeWidth,
      HEIGHT / 2 - pipeGap / 2,
      { isStatic: true, label: 'Pipe' }
    );

    const bottomPipe = Matter.Bodies.rectangle(
      pipeSeparation,
      HEIGHT,
      pipeWidth,
      HEIGHT / 2 - pipeGap / 2,
      { isStatic: true, label: 'Pipe' }
    );

    Matter.World.add(world, [bird, topPipe, bottomPipe]);

    // Add spirit trail effect
    const trail = Array(SPIRIT_TRAIL_LENGTH).fill().map(() => ({
      x: WIDTH / 4,
      y: HEIGHT / 2,
      opacity: 1
    }));
    setSpiritTrail(trail);

    return {
      physics: { engine, world },
      bird: { body: bird, renderer: Bird },
      topPipe: {
        body: topPipe,
        size: [pipeWidth, HEIGHT / 2 - pipeGap / 2],
        renderer: Obstacle
      },
      bottomPipe: {
        body: bottomPipe,
        size: [pipeWidth, HEIGHT / 2 - pipeGap / 2],
        renderer: Obstacle
      },
      spiritTrail: {
        positions: trail,
        renderer: <SpiritTrail color={auraColor} />
      }
    };
  };

  const onEvent = (e) => {
    if (e.type === 'game-over') {
      setRunning(false);
    } else if (e.type === 'score') {
      setScore(prev => prev + 1);
      AudioEngine.playSound('crystal', 500, 0.2);
    }
  };

  const reset = () => {
    if (gameEngine) {
      gameEngine.swap(setupGame());
      setScore(0);
      setRunning(true);
      setGameStarted(true);
      AudioEngine.playSound('spirit', 1000, 0.3);
    }
  };

  const handleScreenPress = () => {
    if (!gameStarted) {
      reset();
    } else if (gameEngine && running) {
      // Enter meditation mode on long press
      if (meditationMode) {
        gameEngine.dispatch({ type: 'meditation_jump' });
        AudioEngine.playSound('meditation', 400, 0.3);
        setAuraColor(AURA_COLORS[Math.floor(Math.random() * AURA_COLORS.length)]);
      } else {
        gameEngine.dispatch({ type: 'jump' });
        AudioEngine.playSound('crystal', 200, 0.1);
      }
    }
  };

  const onScore = () => {
    MusicComposer.playShortMelody('collect', {
      scale: ["C5", "E5", "G5"],
      duration: 500
    });
  };

  return (
    <View style={styles.container}>
      <GameEngine
        ref={(ref) => setGameEngine(ref)}
        systems={[Physics]}
        entities={setupGame()}
        onEvent={onEvent}
        running={running}
        style={styles.gameEngine}
      >
        <Text style={styles.score}>{score}</Text>
      </GameEngine>

      {!gameStarted ? (
        <TouchableWithoutFeedback onPress={handleScreenPress}>
          <View style={styles.fullScreenButton}>
            <Text style={styles.startText}>Tap to Start</Text>
          </View>
        </TouchableWithoutFeedback>
      ) : !running ? (
        <TouchableWithoutFeedback onPress={reset}>
          <View style={styles.fullScreenButton}>
            <Text style={styles.gameOverText}>Game Over</Text>
            <Text style={styles.gameOverSubText}>Score: {score}</Text>
            <Text style={styles.gameOverSubText}>Tap to Play Again</Text>
          </View>
        </TouchableWithoutFeedback>
      ) : null}
      <TouchableOpacity 
        style={styles.meditationButton}
        onPress={() => setMeditationMode(!meditationMode)}
      >
        <Text style={styles.meditationText}>
          {meditationMode ? '🧘‍♂️' : '🏃‍♂️'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c092c',
  },
  gameEngine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  score: {
    position: 'absolute',
    top: 50,
    left: WIDTH / 2 - 20,
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
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
  startText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  gameOverText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ff0000',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  gameOverSubText: {
    fontSize: 24,
    color: '#ffffff',
    marginTop: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  meditationButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  meditationText: {
    fontSize: 24,
  },
});

// Physics system
const Physics = (entities, { time, dispatch }) => {
  const { engine } = entities.physics;
  Matter.Engine.update(engine, time.delta);

  // Move pipes
  const pipes = [entities.topPipe, entities.bottomPipe];
  pipes.forEach(pipe => {
    if (pipe && pipe.body) {
      if (pipe.body.position.x <= -PIPE_WIDTH) {
        Matter.Body.setPosition(pipe.body, {
          x: WIDTH + PIPE_WIDTH,
          y: pipe.body.position.y
        });
      } else {
        Matter.Body.translate(pipe.body, { x: -2, y: 0 });
      }
    }
  });

  return entities;
};

export default FlappySpirit;
