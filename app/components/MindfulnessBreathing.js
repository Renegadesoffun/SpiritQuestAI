import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateStats } from '../redux/playerSlice';

const MindfulnessBreathing = ({ onComplete }) => {
  const [breathCount, setBreathCount] = useState(0);
  const [phase, setPhase] = useState('inhale');
  const animation = new Animated.Value(0);
  const dispatch = useDispatch();

  useEffect(() => {
    startBreathingAnimation();
  }, []);

  const startBreathingAnimation = () => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 4000,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setBreathCount(prevCount => prevCount + 1);
        setPhase(prevPhase => (prevPhase === 'inhale' ? 'exhale' : 'inhale'));
        if (breathCount < 9) {
          startBreathingAnimation();
        } else {
          dispatch(updateStats({ wisdom: 5, compassion: 3 }));
          onComplete();
        }
      }
    });
  };

  const animatedStyle = {
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, animatedStyle]} />
      <Text style={styles.instructionText}>
        {phase === 'inhale' ? 'Breathe In' : 'Breathe Out'}
      </Text>
      <Text style={styles.countText}>{`Breath ${breathCount + 1} of 10`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#7FB3D5',
  },
  instructionText: {
    fontSize: 24,
    marginTop: 20,
    color: '#2C3E50',
  },
  countText: {
    fontSize: 18,
    marginTop: 10,
    color: '#34495E',
  },
});

export default MindfulnessBreathing;
