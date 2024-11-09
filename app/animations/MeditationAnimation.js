import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const MeditationAnimation = () => {
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(breatheAnim, {
            toValue: 1,
            duration: 4000,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: true,
          }),
          Animated.timing(breatheAnim, {
            toValue: 0,
            duration: 4000,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 20000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const breatheScale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [
              { scale: breatheScale },
              { rotate: rotate },
            ],
          },
        ]}
      >
        <View style={styles.innerCircle} />
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
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default MeditationAnimation;
