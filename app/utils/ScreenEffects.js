import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';

export const ScreenShake = ({ children }) => {
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start();
  };

  useEffect(() => {
    startShake();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
      {children}
    </Animated.View>
  );
};

export const FlashEffect = ({ children }) => {
  const flashAnimation = useRef(new Animated.Value(0)).current;

  const startFlash = () => {
    Animated.sequence([
      Animated.timing(flashAnimation, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(flashAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    startFlash();
  }, []);

  return (
    <Animated.View style={[styles.flashOverlay, { opacity: flashAnimation }]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
  },
});
