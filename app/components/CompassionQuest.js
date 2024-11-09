import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateStats } from '../redux/playerSlice';
import { unlockAchievement } from '../redux/achievementsSlice';

const scenarios = [
  {
    description: "You see someone struggling with heavy groceries.",
    options: [
      { text: "Offer to help", compassion: 5 },
      { text: "Walk past", compassion: 0 },
    ],
  },
  {
    description: "A friend is going through a tough time.",
    options: [
      { text: "Listen and offer support", compassion: 5 },
      { text: "Tell them to toughen up", compassion: -2 },
    ],
  },
  // Add more scenarios here
];

const CompassionQuest = ({ navigation }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [compassionScore, setCompassionScore] = useState(0);
  const dispatch = useDispatch();
  const playerStats = useSelector(state => state.player.stats);

  const handleChoice = (compassionValue) => {
    setCompassionScore(prevScore => prevScore + compassionValue);
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prevScenario => prevScenario + 1);
    } else {
      dispatch(updateStats({ compassion: compassionScore }));
      if (compassionScore >= 20) {
        dispatch(unlockAchievement('compassionMaster'));
      }
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.scenarioText}>{scenarios[currentScenario].description}</Text>
      {scenarios[currentScenario].options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionButton}
          onPress={() => handleChoice(option.compassion)}
        >
          <Text style={styles.optionText}>{option.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    padding: 20,
  },
  scenarioText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#2C3E50',
  },
  optionButton: {
    backgroundColor: '#3498DB',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
  },
  optionText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default CompassionQuest;
