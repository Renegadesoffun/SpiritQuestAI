import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

const levels = [
  { id: 'flappySpirit', name: 'Winds of Change', type: 'Flyer', attribute: 'resilience' },
  { id: 'meditationRealm', name: 'Inner Sanctuary', type: 'Rhythm', attribute: 'harmony' },
  { id: 'emotionalLabyrinth', name: 'Heart\'s Journey', type: 'Maze', attribute: 'compassion' },
  { id: 'wisdomLibrary', name: 'Akashic Records', type: 'Puzzle', attribute: 'wisdom' },
  { id: 'creativeCanvas', name: 'Imagination Unleashed', type: 'Drawing', attribute: 'creativity' },
  { id: 'courageousMountain', name: 'Peak of Perseverance', type: 'Climber', attribute: 'courage' },
  { id: 'balanceBeam', name: 'Equilibrium Path', type: 'Balance', attribute: 'harmony' },
  { id: 'soulForge', name: 'Crucible of Self', type: 'Crafter', attribute: 'resilience' },
  { id: 'interconnectedWeb', name: 'Cosmic Tapestry', type: 'Connect', attribute: 'wisdom' },
  { id: 'finalAscension', name: 'Transcendence', type: 'Runner', attribute: 'all' },
  { id: 'wonderlandRealm', name: 'Down the Rabbit Hole', type: 'Reality Bender', attribute: 'imagination' }
];

const LevelSelect = ({ navigation, unlockedLevels }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderLevel = (level, index) => {
    const isUnlocked = unlockedLevels.includes(index);
    const isSelected = selectedLevel === level.id;

    return (
      <Animated.View
        key={level.id}
        style={[
          styles.levelContainer,
          {
            opacity: animation,
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.level,
            isUnlocked ? styles.unlockedLevel : styles.lockedLevel,
            isSelected ? styles.selectedLevel : null,
          ]}
          onPress={() => {
            if (isUnlocked) {
              setSelectedLevel(level.id);
              navigation.navigate('GameScreen', { levelId: level.id });
            }
          }}
          disabled={!isUnlocked}
        >
          <Text style={styles.levelName}>{level.name}</Text>
          <Text style={styles.levelType}>{level.type}</Text>
          <Text style={styles.levelAttribute}>{level.attribute}</Text>
          {!isUnlocked && <LottieView source={require('../assets/lock-animation.json')} autoPlay loop style={styles.lockAnimation} />}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ImageBackground source={require('../assets/map-background.jpg')} style={styles.container}>
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'transparent']}
        style={styles.gradient}
      >
        <Text style={styles.title}>Spirit Quest Map</Text>
        <View style={styles.levelsContainer}>
          {levels.map(renderLevel)}
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  levelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  levelContainer: {
    margin: 10,
  },
  level: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
  },
  unlockedLevel: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  lockedLevel: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  selectedLevel: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  levelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  levelType: {
    fontSize: 12,
    color: '#ddd',
    textAlign: 'center',
  },
  levelAttribute: {
    fontSize: 12,
    color: '#FFD700',
    textAlign: 'center',
  },
  lockAnimation: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: 5,
    right: 5,
  },
});

export default LevelSelect;
