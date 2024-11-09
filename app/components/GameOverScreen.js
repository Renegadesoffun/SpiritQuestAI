import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';

const GameOverScreen = ({ route, navigation }) => {
  const { restartGame } = route.params;

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/game-over-animation.json')}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.gameOverText}>Game Over</Text>
      <Text style={styles.subText}>Your spirit's journey has come to an end...</Text>
      <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
        <Text style={styles.restartButtonText}>Restart Journey</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c092c',
  },
  animation: {
    width: 200,
    height: 200,
  },
  gameOverText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  subText: {
    fontSize: 18,
    color: '#ddd',
    marginBottom: 40,
    textAlign: 'center',
  },
  restartButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameOverScreen;
