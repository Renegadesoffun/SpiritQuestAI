import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useDispatch, useSelector } from 'react-redux';
import { updateStats } from '../redux/playerSlice';
import { unlockAchievement } from '../redux/achievementsSlice';

const QuantumSpiritJourney = ({ navigation, route }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const playerStats = useSelector(state => state.player.stats);
  const { musicGenerator } = route.params || {};

  const [quantumState, setQuantumState] = useState('superposition');
  const [entanglementLevel, setEntanglementLevel] = useState(0);

  useEffect(() => {
    if (musicGenerator) {
      musicGenerator.playSoundEffect('quantumHum');
    }
  }, [musicGenerator]);

  const navigateToMiniGame = (gameName) => {
    setQuantumState(Math.random() > 0.5 ? 'entangled' : 'superposition');
    navigation.navigate(gameName, { quantumState, entanglementLevel, musicGenerator });
  };

  const updateEntanglement = (level) => {
    setEntanglementLevel(level);
    dispatch(updateStats({ quantumAwareness: level }));
    if (level >= 100) {
      dispatch(unlockAchievement('quantumMaster'));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Quantum Spirit Journey</Text>
      <Text style={[styles.stateText, { color: theme.text }]}>Quantum State: {quantumState}</Text>
      <Text style={[styles.levelText, { color: theme.text }]}>Entanglement Level: {entanglementLevel}</Text>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => navigateToMiniGame('FlappySpirit')}
      >
        <Text style={styles.buttonText}>Flappy Spirit</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => navigateToMiniGame('CosmicErrorTranscendence')}
      >
        <Text style={styles.buttonText}>Cosmic Error Transcendence</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => navigateToMiniGame('AIConsciousnessQuest')}
      >
        <Text style={styles.buttonText}>AI Consciousness Quest</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => navigateToMiniGame('PurpleScreenOfEnlightenment')}
      >
        <Text style={styles.buttonText}>Purple Screen of Enlightenment</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.secondary }]}
        onPress={() => updateEntanglement(entanglementLevel + 10)}
      >
        <Text style={styles.buttonText}>Increase Entanglement</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  stateText: {
    fontSize: 18,
    marginBottom: 10,
  },
  levelText: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuantumSpiritJourney;
