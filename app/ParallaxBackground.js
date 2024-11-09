import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const ParallaxBackground = ({ children }) => {
  const translateX = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -100,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.background, { transform: [{ translateX }] }]} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '200%',
    height: '100%',
    backgroundColor: '#1c092c',
    backgroundImage: 'linear-gradient(45deg, #2c0e44 25%, transparent 25%, transparent 75%, #2c0e44 75%, #2c0e44), linear-gradient(45deg, #2c0e44 25%, transparent 25%, transparent 75%, #2c0e44 75%, #2c0e44)',
    backgroundSize: '60px 60px',
    backgroundPosition: '0 0, 30px 30px',
  },
});
