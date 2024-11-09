import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { setLevel } from '../store/gameSlice';
import AudioEngine from '../audio/AudioEngine';

const levelData = {
  1: {
    title: "The Awakening",
    story: [
      "In the depths of consciousness, a spark ignites...",
      "You feel the resonance of the universe within",
      "The journey of self-discovery begins"
    ],
    frequency: 'meditation',
    background: require('../assets/images/backgrounds/awakening_bg.png'),
    challenge: 'FlappySpirit'
  },
  2: {
    title: "Spirit Forest",
    story: [
      "Ancient trees whisper timeless wisdom...",
      "Each leaf holds a fragment of universal truth",
      "Nature's rhythm guides your path"
    ],
    frequency: 'forest',
    background: require('../assets/images/backgrounds/forest_bg.png'),
    challenge: 'MeditationRealm'
  },
  3: {
    title: "Crystal Caves",
    story: [
      "Deep within the earth's embrace...",
      "Crystals pulse with sacred geometries",
      "Their frequencies align with your spirit"
    ],
    frequency: 'crystal',
    background: require('../assets/images/backgrounds/caves_bg.png'),
    challenge: 'QuantumSpiritJourney'
  },
  4: {
    title: "Astral Plains",
    story: [
      "Beyond physical form, consciousness expands...",
      "Time and space merge in cosmic dance",
      "Your spirit soars through infinite possibilities"
    ],
    frequency: 'astral',
    background: require('../assets/images/backgrounds/astral_bg.png'),
    challenge: 'CosmicErrorTranscendence'
  }
};

const Level = ({ route, navigation }) => {
  const { levelId } = route.params;
  const dispatch = useDispatch();
  const [storyIndex, setStoryIndex] = useState(0);
  const [textOpacity] = useState(new Animated.Value(0));
  const [imageOpacity] = useState(new Animated.Value(0));
  const level = levelData[levelId];

  useEffect(() => {
    dispatch(setLevel(levelId));
    
    // Fade in background image
    Animated.timing(imageOpacity, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true
    }).start();

    // Play level-specific frequency
    AudioEngine.playSound(
      AudioEngine.frequencies[level.frequency],
      2000,
      0.3
    );

    return () => {
      // Cleanup
    };
  }, [levelId]);

  useEffect(() => {
    if (storyIndex < level.story.length) {
      // Reset opacity for new text
      textOpacity.setValue(0);
      
      // Fade in text gradually
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true
      }).start();

      // Auto-advance text after delay
      const timer = setTimeout(() => {
        setStoryIndex(prev => prev + 1);
      }, 4000);

      return () => clearTimeout(timer);
    } else {
      // Story complete, navigate to challenge
      const timer = setTimeout(() => {
        navigation.navigate(level.challenge);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [storyIndex]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={level.background}
        style={[styles.backgroundImage, { opacity: imageOpacity }]}
      />
      
      <View style={styles.overlay}>
        <Text style={styles.title}>{level.title}</Text>
        
        {storyIndex < level.story.length && (
          <Animated.Text style={[styles.storyText, { opacity: textOpacity }]}>
            {level.story[storyIndex]}
          </Animated.Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c092c',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 9, 44, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  storyText: {
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 36,
    maxWidth: '80%',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  }
});

export default Level;
