import React, { useRef, useEffect } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const FadeTransition = ({ children, isVisible }) => {
  const fadeAnim = useRef(new Animated.Value(isVisible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
};

export const SlideTransition = ({ children, isVisible, direction = 'right' }) => {
  const slideAnim = useRef(new Animated.Value(isVisible ? 0 : direction === 'right' ? width : -width)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : direction === 'right' ? width : -width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  return (
    <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
      {children}
    </Animated.View>
  );
};

export const ScaleTransition = ({ children, isVisible }) => {
  const scaleAnim = useRef(new Animated.Value(isVisible ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isVisible ? 1 : 0,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      {children}
    </Animated.View>
  );
};
