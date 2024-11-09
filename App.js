import React from 'react';
import { View, StyleSheet } from 'react-native';
import { registerRootComponent } from 'expo';
import Game from './app/game.js';

const App = () => {
  return (
    <View style={styles.container}>
      <Game />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

registerRootComponent(App);

export default App;
