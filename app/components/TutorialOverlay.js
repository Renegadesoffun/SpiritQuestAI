import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TutorialOverlay = ({ onClose }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How to Play</Text>
      <Text style={styles.instruction}>1. Tap the screen to make the bird fly</Text>
      <Text style={styles.instruction}>2. Avoid hitting the pipes</Text>
      <Text style={styles.instruction}>3. Try to get as far as you can!</Text>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close Tutorial</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  instruction: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default TutorialOverlay;
