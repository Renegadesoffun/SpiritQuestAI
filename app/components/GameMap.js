import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { Svg, Path, Circle } from 'react-native-svg';
import MapMusic from './MapMusic';
import AudioEngine from '../audio/AudioEngine';
import MusicComposer from '../audio/MusicComposer';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

const getChakraSymbol = (chakra) => {
  const symbols = {
    root: '⚫',
    sacral: '🟠',
    solar: '💛',
    heart: '💚',
    throat: '💙',
    third_eye: '🟣',
    crown: '⚪'
  };
  return symbols[chakra] || '✨';
};

const GameMap = ({ navigation }) => {
  const { currentLevel } = useSelector(state => state.game);
  // Update to track unlocked levels from game state
  const [unlockedLevels, setUnlockedLevels] = useState([1]); // Start with level 1 unlocked

  // Add spiritual progression tracking
  const [chakraLevels, setChakraLevels] = useState({
    root: 0,
    sacral: 0,
    solar: 0,
    heart: 0,
    throat: 0,
    third_eye: 0,
    crown: 0
  });

  useEffect(() => {
    // Update unlocked levels based on current progress
    if (currentLevel > 1) {
      setUnlockedLevels(prev => [...new Set([...prev, currentLevel])]);
    }
  }, [currentLevel]);

  useEffect(() => {
    MusicComposer.playMusic('map', {
      variation: 'explore',
      intensity: 0.7
    });
    
    return () => MusicComposer.stop();
  }, []);

  const levels = [
    { id: 1, name: 'The Awakening', x: WIDTH * 0.2, y: HEIGHT * 0.7 },
    { id: 2, name: 'Spirit Forest', x: WIDTH * 0.4, y: HEIGHT * 0.5, requires: 1 },
    { id: 3, name: 'Crystal Caves', x: WIDTH * 0.6, y: HEIGHT * 0.6, requires: 2 },
    { id: 4, name: 'Astral Plains', x: WIDTH * 0.8, y: HEIGHT * 0.4, requires: 3 },
  ];

  const minigames = [
    { id: 'flappy', name: 'Flappy Spirit', x: WIDTH * 0.3, y: HEIGHT * 0.3 },
    { id: 'meditation', name: 'Meditation Realm', x: WIDTH * 0.7, y: HEIGHT * 0.2 },
  ];

  const renderPath = (start, end, index) => (
    <Path
      key={`path-${index}`}
      d={`M ${start.x} ${start.y} Q ${(start.x + end.x) / 2} ${(start.y + end.y) / 2 - 50} ${end.x} ${end.y}`}
      stroke="#ffffff"
      strokeWidth="4"
      strokeDasharray={[8, 4]}
      opacity={0.6}
    />
  );

  const handleLevelPress = (level) => {
    if (unlockedLevels.includes(level.id)) {
      // Play selection sound
      AudioEngine.playSound('crystal', 1000, 0.2);
      
      // Navigate to StoryIntro with level data
      navigation.navigate('StoryIntro', { 
        levelId: level.id,
        levelName: level.name,
        requires: level.requires
      });
    }
  };

  // Add spiritual challenges
  const challenges = [
    { id: 'meditation', name: 'Deep Meditation', x: WIDTH * 0.5, y: HEIGHT * 0.3 },
    { id: 'astral', name: 'Astral Journey', x: WIDTH * 0.2, y: HEIGHT * 0.4 },
    { id: 'quantum', name: 'Quantum Leap', x: WIDTH * 0.8, y: HEIGHT * 0.6 }
  ];

  const handleChakraProgress = (chakra, amount) => {
    setChakraLevels(prev => ({
      ...prev,
      [chakra]: Math.min(100, prev[chakra] + amount)
    }));
    
    // Check for spiritual achievements
    if (Object.values(chakraLevels).every(level => level >= 100)) {
      AudioEngine.playSound('achievement', 1000, 0.5);
      navigation.navigate('Ascension');
    }
  };

  const handleChakraActivation = async (chakra) => {
    await MusicComposer.playChakraActivation(chakra);
    // ... rest of activation logic
  };

  return (
    <View style={styles.container}>
      <MapMusic />
      <Svg style={StyleSheet.absoluteFill}>
        {/* Draw paths between levels */}
        {levels.map((level, index) => {
          if (index === 0) return null;
          const prevLevel = levels[index - 1];
          return renderPath(prevLevel, level, index);
        })}
      </Svg>

      {/* Render level nodes */}
      {levels.map((level) => (
        <TouchableOpacity
          key={level.id}
          style={[
            styles.levelNode,
            { left: level.x, top: level.y },
            !unlockedLevels.includes(level.id) && styles.lockedNode
          ]}
          onPress={() => handleLevelPress(level)}
          disabled={!unlockedLevels.includes(level.id)}
        >
          <Text style={styles.levelText}>{level.id}</Text>
          <Text style={styles.levelName}>{level.name}</Text>
          {!unlockedLevels.includes(level.id) && (
            <View style={styles.lockIcon}>
              <Text style={styles.lockText}>🔒</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}

      {/* Render minigame nodes */}
      {minigames.map((game) => (
        <TouchableOpacity
          key={game.id}
          style={[styles.minigameNode, { left: game.x, top: game.y }]}
          onPress={() => {
            AudioEngine.playSound('spirit', 1000, 0.2);
            navigation.navigate(game.id === 'flappy' ? 'FlappySpirit' : 'MeditationRealm');
          }}
        >
          <Text style={styles.minigameText}>{game.name}</Text>
        </TouchableOpacity>
      ))}
      
      {/* Add Chakra indicators */}
      <View style={styles.chakraContainer}>
        {Object.entries(chakraLevels).map(([chakra, level]) => (
          <View key={chakra} style={styles.chakraIndicator}>
            <Text style={styles.chakraSymbol}>{getChakraSymbol(chakra)}</Text>
            <View style={[styles.chakraProgress, { width: `${level}%` }]} />
          </View>
        ))}
      </View>

      {/* Add spiritual challenges */}
      {challenges.map(challenge => (
        <TouchableOpacity
          key={challenge.id}
          style={[styles.challengeNode, { left: challenge.x, top: challenge.y }]}
          onPress={() => {
            AudioEngine.playSound('meditation', 800, 0.3);
            navigation.navigate(challenge.id);
          }}
        >
          <Text style={styles.challengeText}>{challenge.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c092c',
  },
  levelNode: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3a1c54',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  lockedNode: {
    backgroundColor: '#2a1440',
    borderColor: '#666666',
    opacity: 0.7,
  },
  levelText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  levelName: {
    position: 'absolute',
    bottom: -25,
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
    width: 100,
  },
  minigameNode: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4a2c64',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  minigameText: {
    position: 'absolute',
    bottom: -20,
    color: '#ffd700',
    fontSize: 10,
    textAlign: 'center',
    width: 80,
  },
  lockIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#2a1440',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#666666',
  },
  lockText: {
    fontSize: 12,
    color: '#ffffff',
  },
  chakraContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    alignItems: 'flex-end',
  },
  chakraIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  chakraSymbol: {
    fontSize: 24,
    marginRight: 8,
  },
  chakraProgress: {
    height: 4,
    backgroundColor: '#ffd700',
    borderRadius: 2,
  },
  challengeNode: {
    // Similar to minigameNode style but with spiritual theme
    backgroundColor: '#9c27b0',
    borderColor: '#ffd700',
  },
  challengeText: {
    fontSize: 12,
    color: '#ffd700',
  }
});

export default GameMap;
