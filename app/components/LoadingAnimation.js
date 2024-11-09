import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const LoadingAnimation = ({ onTimeout }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => {
      if (onTimeout) {
        onTimeout();
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, { transform: [{ rotate: spin }] }]}>
        {[...Array(8)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                transform: [
                  { rotate: `${index * 45}deg` },
                  { translateY: -30 },
                ],
                opacity: 1 - index * 0.1,
              },
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
});

export default LoadingAnimation;
