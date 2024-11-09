import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const IntroVideo = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => navigation.replace('LevelSelect'));
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
        Welcome to Spirit Quest
      </Animated.Text>
      <Animated.Text style={[styles.subText, { opacity: fadeAnim }]}>
        Embark on a journey of self-discovery and growth
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e3c72',
  },
  text: {
    fontSize: 32,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  subText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default IntroVideo;
