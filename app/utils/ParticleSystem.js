import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

const Particle = ({ x, y, color }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const positionAnim = useRef(new Animated.ValueXY({ x, y })).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(positionAnim, {
        toValue: { x: x + Math.random() * 100 - 50, y: y - 100 },
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: color,
        opacity: fadeAnim,
        transform: positionAnim.getTranslateTransform(),
      }}
    />
  );
};

export const createParticles = (x, y, color, count = 10) => {
  return Array.from({ length: count }, (_, i) => (
    <Particle key={i} x={x} y={y} color={color} />
  ));
};
