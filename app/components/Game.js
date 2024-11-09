import React from 'react';
import { View, StyleSheet } from 'react-native';
import FlappyBirdGame from './FlappyBirdGame';
import MapMusic from './MapMusic';

const Game = () => {
  return (
    <View style={styles.container}>
      <MapMusic />
      <FlappyBirdGame />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c092c'
  }
});

export default Game;
