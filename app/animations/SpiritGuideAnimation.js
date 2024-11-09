import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const SpiritGuideAnimation = () => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 10000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1500,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spiritGuide,
          {
            transform: [
              { translateY: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -20],
              })},
              { rotate: spin },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <View style={styles.head} />
        <View style={styles.body} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spiritGuide: {
    alignItems: 'center',
  },
  head: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  body: {
    width: 60,
    height: 80,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginTop: -10,
  },
});

export default SpiritGuideAnimation;
