import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { MusicComposer } from './audio/MusicComposer.mjs';

export const Game = () => {
  const musicRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    initGame();
    return () => cleanup();
  }, []);

  const initGame = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        shouldDuckAndroid: true,
      });

      // Create meditation track
      musicRef.current = await MusicComposer.createMeditationTrack();
      await musicRef.current.play();
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  };

  const cleanup = async () => {
    if (musicRef.current) {
      await musicRef.current.stop();
    }
  };

  return (
    <View style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
});

export default Game;
