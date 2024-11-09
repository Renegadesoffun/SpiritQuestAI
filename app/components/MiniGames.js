import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

const colors = ['red', 'blue', 'green', 'yellow'];

const MemoryGame = ({ onComplete }) => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isShowingSequence, setIsShowingSequence] = useState(true);

  useEffect(() => {
    if (sequence.length === 0) {
      addToSequence();
    } else if (isShowingSequence) {
      showSequence();
    }
  }, [sequence, isShowingSequence]);

  const addToSequence = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence([...sequence, newColor]);
    setIsShowingSequence(true);
  };

  const showSequence = () => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= sequence.length) {
        clearInterval(interval);
        setIsShowingSequence(false);
        setPlayerSequence([]);
        return;
      }
      // Highlight the color
      // You would implement the actual highlighting here
      i++;
    }, 1000);
  };

  const handleColorPress = (color) => {
    if (isShowingSequence) return;

    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      // Player made a mistake
      onComplete(false);
    } else if (newPlayerSequence.length === sequence.length) {
      if (sequence.length === 5) {
        // Player completed the game
        onComplete(true);
      } else {
        // Add to the sequence
        addToSequence();
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Game</Text>
      <View style={styles.grid}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[styles.colorButton, { backgroundColor: color }]}
            onPress={() => handleColorPress(color)}
            disabled={isShowingSequence}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 200,
    height: 200,
  },
  colorButton: {
    width: 100,
    height: 100,
  },
});

export { MemoryGame };
