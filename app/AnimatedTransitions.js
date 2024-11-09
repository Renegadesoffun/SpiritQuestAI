import React from 'react';
import { Animated, Easing } from 'react-native';

export const FadeTransition = ({ children, visible }) => {
  const [opacity] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View style={{ opacity }}>
      {children}
    </Animated.View>
  );
};

export const SlideTransition = ({ children, visible, direction = 'left' }) => {
  const [translateX] = React.useState(new Animated.Value(direction === 'left' ? -100 : 100));

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : (direction === 'left' ? -100 : 100),
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [visible]);

  return (
    <Animated.View style={{ transform: [{ translateX }] }}>
      {children}
    </Animated.View>
  );
};

export const ScaleTransition = ({ children, visible }) => {
  const [scale] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.spring(scale, {
      toValue: visible ? 1 : 0,
      friction: 5,
      tension: 30,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      {children}
    </Animated.View>
  );
};
