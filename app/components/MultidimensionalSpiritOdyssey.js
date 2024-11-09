import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MultidimensionalSpiritOdyssey = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Multidimensional Spirit Odyssey</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3a1c54',
  },
  text: {
    color: '#fff',
    fontSize: 24,
  },
});

export default MultidimensionalSpiritOdyssey;
