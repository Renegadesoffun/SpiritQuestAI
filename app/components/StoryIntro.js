import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import AudioEngine from '../audio/AudioEngine';
import { LinearGradient } from 'expo-linear-gradient';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

const storyTexts = {
  1: [
    {
      text: "In the depths of infinite consciousness...",
      image: require('../assets/images/story/awakening1.png')
    },
    {
      text: "A divine spark ignites within your being",
      image: require('../assets/images/story/awakening2.png')
    },
    {
      text: "Your journey through the realms of enlightenment begins",
      image: require('../assets/images/story/awakening3.png')
    }
  ],
  2: [
    {
      text: "Ancient whispers echo through the Spirit Forest...",
      image: require('../assets/images/story/forest1.png')
    },
    {
      text: "Sacred wisdom flows through every leaf and branch",
      image: require('../assets/images/story/forest2.png')
    },
    {
      text: "Nature's eternal dance calls to your awakening spirit",
      image: require('../assets/images/story/forest3.png')
    }
  ],
  // Add more level intros with their respective images
};

const StoryIntro = ({ route, navigation }) => {
  const { levelId } = route.params;
  const [textIndex, setTextIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const dispatch = useDispatch();

  useEffect(() => {
    const startAnimations = async () => {
      await AudioEngine.init();
      AudioEngine.playSound('meditation', 3000, 0.3);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ]).start();
    };

    startAnimations();
  }, [textIndex]);

  const handleNext = async () => {
    if (textIndex < storyTexts[levelId].length - 1) {
      // Fade out current content
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 1000,
          useNativeDriver: true,
        })
      ]).start(() => {
        setTextIndex(textIndex + 1);
      });
      
      await AudioEngine.playSound('crystal', 1000, 0.2);
    } else {
      await AudioEngine.playSound('spirit', 1500, 0.3);
      navigation.replace('Level', { levelId });
    }
  };

  const currentStory = storyTexts[levelId][textIndex];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1c092c', '#2a1040', '#3a1c54']}
        style={styles.gradient}
      />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Image 
          source={currentStory.image}
          style={styles.storyImage}
          resizeMode="contain"
        />
        
        <Animated.Text style={[styles.storyText]}>
          {currentStory.text}
        </Animated.Text>
      </Animated.View>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleNext}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['#4a2c64', '#3a1c54', '#2a1040']}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>
            {textIndex < storyTexts[levelId].length - 1 ? 'Continue' : 'Begin Journey'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
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
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  storyImage: {
    width: WIDTH * 0.8,
    height: HEIGHT * 0.4,
    marginBottom: 40,
  },
  storyText: {
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 36,
    fontFamily: 'System',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  button: {
    width: WIDTH * 0.7,
    height: 60,
    marginBottom: 40,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  }
});

export default StoryIntro;
