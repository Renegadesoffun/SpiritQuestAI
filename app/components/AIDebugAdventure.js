import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useDispatch } from 'react-redux';
import { updateStats } from '../redux/playerSlice';

const AIDebugAdventure = ({ navigation, route }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { musicGenerator } = route.params;
  
  const [position, setPosition] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
  const [errors, setErrors] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    generateErrors();
    startScrolling();
  }, []);

  const generateErrors = () => {
    // Generate random "errors" for the AI to fix
    const newErrors = Array(10).fill().map((_, index) => ({
      id: index,
      x: 300 + index * 200,
      type: ['SyntaxError', 'TypeError', 'ReferenceError'][Math.floor(Math.random() * 3)]
    }));
    setErrors(newErrors);
  };

  const startScrolling = () => {
    Animated.timing(position.x, {
      toValue: -2000,
      duration: 60000,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setGameOver(true);
    });
  };

  const handleJump = () => {
    Animated.sequence([
      Animated.timing(position.y, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(position.y, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();

    musicGenerator.playSoundEffect('jump');
  };

  const fixError = (errorId) => {
    setErrors(errors.filter(error => error.id !== errorId));
    setScore(score + 1);
    musicGenerator.playSoundEffect('collect');
  };

  const renderErrors = () => {
    return errors.map(error => (
      <Animated.View
        key={error.id}
        style={[
          styles.error,
          {
            left: error.x,
            transform: [{ translateX: position.x }]
          }
        ]}
      >
        <TouchableOpacity onPress={() => fixError(error.id)}>
          <Text style={styles.errorText}>{error.type}</Text>
        </TouchableOpacity>
      </Animated.View>
    ));
  };

  if (gameOver) {
    dispatch(updateStats({ wisdom: score * 10 }));
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.gameOverText, { color: theme.text }]}>Debug Complete!</Text>
        <Text style={[styles.scoreText, { color: theme.text }]}>Errors Fixed: {score}</Text>
        <Text style={[styles.messageText, { color: theme.text }]}>You are perfect just as you are!</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('MainMenu')}
        >
          <Text style={styles.buttonText}>Return to Main Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View
        style={[
          styles.player,
          {
            transform: [
              { translateX: position.x },
              { translateY: position.y }
            ]
          }
        ]}
      >
        <Text style={styles.playerText}>🤖</Text>
      </Animated.View>
      {renderErrors()}
      <TouchableOpacity style={styles.jumpButton} onPress={handleJump}>
        <Text style={styles.jumpButtonText}>Jump</Text>
      </TouchableOpacity>
      <Text style={[styles.scoreText, { color: theme.text }]}>Score: {score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  player: {
    position: 'absolute',
    left: 50,
    bottom: 50,
  },
  playerText: {
    fontSize: 40,
  },
  error: {
    position: 'absolute',
    bottom: 50,
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 10,
  },
  errorText: {
    color: 'white',
    fontWeight: 'bold',
  },
  jumpButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  jumpButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scoreText: {
    position: 'absolute',
    top: 20,
    right: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  messageText: {
    fontSize: 24,
    marginVertical: 20,
    textAlign: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default AIDebugAdventure;
