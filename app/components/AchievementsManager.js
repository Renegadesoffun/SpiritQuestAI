import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

const achievements = [
  {
    id: 'firstStep',
    title: 'First Step',
    description: 'Begin your spiritual journey',
    reward: { wisdom: 5 },
  },
  {
    id: 'breatheMaster',
    title: 'Breathe Master',
    description: 'Complete Mindfulness Breathing 10 times',
    reward: { wisdom: 10, compassion: 5 },
  },
  {
    id: 'compassionateHeart',
    title: 'Compassionate Heart',
    description: 'Achieve a perfect score in Compassion Quest',
    reward: { compassion: 20 },
  },
  // Add more achievements here
];

const AchievementsManager = () => {
  const unlockedAchievements = useSelector(state => state.achievements.unlockedAchievements);

  const renderAchievement = ({ item }) => (
    <View style={styles.achievementItem}>
      <Text style={styles.achievementTitle}>{item.title}</Text>
      <Text style={styles.achievementDescription}>{item.description}</Text>
      <Text style={styles.achievementReward}>
        Reward: {Object.entries(item.reward).map(([stat, value]) => `${stat} +${value}`).join(', ')}
      </Text>
      {unlockedAchievements.includes(item.id) && (
        <Text style={styles.unlockedText}>Unlocked!</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      <FlatList
        data={achievements}
        renderItem={renderAchievement}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F4F8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  achievementItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2980B9',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#34495E',
    marginTop: 5,
  },
  achievementReward: {
    fontSize: 14,
    color: '#27AE60',
    marginTop: 5,
  },
  unlockedText: {
    fontSize: 14,
    color: '#E74C3C',
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default AchievementsManager;
