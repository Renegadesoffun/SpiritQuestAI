import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AudioEngine from '../audio/AudioEngine';

const ErrorDimension = ({ error, errorInfo, onRecover }) => {
  const playErrorSound = async () => {
    try {
      await AudioEngine.playSound('meditation', 500, 0.2);
      setTimeout(async () => {
        await AudioEngine.playSound('forest', 800, 0.3);
      }, 200);
    } catch (err) {
      console.warn('Failed to play error sound:', err);
    }
  };

  React.useEffect(() => {
    playErrorSound();
  }, [error]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spiritual Disturbance Detected</Text>
      <Text style={styles.message}>{error?.message || 'An unknown error occurred'}</Text>
      <TouchableOpacity 
        style={styles.recoverButton}
        onPress={() => {
          AudioEngine.playSound('crystal', 1000, 0.4);
          onRecover();
        }}
      >
        <Text style={styles.buttonText}>Restore Balance</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 30,
    textAlign: 'center',
  },
  recoverButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ErrorDimension;
