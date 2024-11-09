import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import MusicComposer from '../audio/MusicComposer';

const MeditationRealm = () => {
  const animation = useRef(null);

  useEffect(() => {
    if (animation.current) {
      animation.current.play();
    }
    
    // Play full meditation music instead of just a tone
    MusicComposer.playMusic('meditation');
    
    return () => {
      MusicComposer.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animation}
        source={require('../assets/animations/meditation.json')}
        style={styles.animation}
        loop
        autoPlay
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c092c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').width * 0.8,
  },
});

export default MeditationRealm;
