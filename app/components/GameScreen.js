import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useQuantum } from './QuantumEntanglement';
import FlappySpirit from './FlappySpirit';
import MeditationRealm from './MeditationRealm';
import EmotionalLabyrinth from './EmotionalLabyrinth';
import WisdomLibrary from './WisdomLibrary';
import CreativeCanvas from './CreativeCanvas';
import WonderlandRealm from './WonderlandRealm';

const GameScreen = ({ route, navigation }) => {
  const { levelId, onLevelChange, onTimeChange, onMoodChange, onTempoChange } = route.params;
  const [score, setScore] = useState(0);
  const { quantumState, updateQuantumState } = useQuantum();
  const [currentLevel, setCurrentLevel] = useState(1);

  const handleScoreUpdate = (newScore) => {
    setScore(newScore);
    updateQuantumState(newScore);
  };

  const renderGame = () => {
    switch (levelId) {
      case 'flappySpirit':
        return <FlappySpirit onScoreUpdate={handleScoreUpdate} />;
      case 'meditationRealm':
        return <MeditationRealm onScoreUpdate={handleScoreUpdate} />;
      case 'emotionalLabyrinth':
        return <EmotionalLabyrinth onScoreUpdate={handleScoreUpdate} />;
      case 'wisdomLibrary':
        return <WisdomLibrary onScoreUpdate={handleScoreUpdate} />;
      case 'creativeCanvas':
        return <CreativeCanvas onScoreUpdate={handleScoreUpdate} />;
      case 'wonderlandRealm':
        return <WonderlandRealm onScoreUpdate={handleScoreUpdate} />;
      default:
        return <Text>Level not found</Text>;
    }
  };

  useEffect(() => {
    onLevelChange(currentLevel);
    // Set up day/night cycle
    const dayNightCycle = setInterval(() => {
      const time = new Date().getHours();
      onTimeChange(time >= 6 && time < 18 ? 'day' : 'night');
    }, 60000); // Check every minute

    return () => clearInterval(dayNightCycle);
  }, [currentLevel]);

  const handleEnemyEncounter = () => {
    onMoodChange('intense');
    onTempoChange('fast');
  };

  const handlePeacefulArea = () => {
    onMoodChange('happy');
    onTempoChange('medium');
  };

  return (
    <View style={styles.container}>
      {renderGame()}
      <Text style={styles.scoreText}>Score: {score}</Text>
      <Text style={styles.quantumText}>Quantum State: {quantumState}</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Menu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c092c',
  },
  scoreText: {
    position: 'absolute',
    top: 20,
    left: 20,
    color: '#fff',
    fontSize: 18,
  },
  quantumText: {
    position: 'absolute',
    top: 20,
    right: 20,
    color: '#fff',
    fontSize: 18,
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#3a1c54',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default GameScreen;
