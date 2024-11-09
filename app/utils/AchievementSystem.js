import AsyncStorage from '@react-native-async-storage/async-storage';

const achievements = {
  firstWin: { title: 'First Win', description: 'Complete your first level' },
  perfectRun: { title: 'Perfect Run', description: 'Complete a level without taking damage' },
  // ... more achievements
};

export const unlockAchievement = async (achievementId) => {
  try {
    const unlockedAchievements = JSON.parse(await AsyncStorage.getItem('unlockedAchievements')) || [];
    if (!unlockedAchievements.includes(achievementId)) {
      unlockedAchievements.push(achievementId);
      await AsyncStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
      // Show achievement notification
    }
  } catch (error) {
    console.error('Error unlocking achievement:', error);
  }
};

export const getAchievements = async () => {
  try {
    const unlockedAchievements = JSON.parse(await AsyncStorage.getItem('unlockedAchievements')) || [];
    return Object.entries(achievements).map(([id, achievement]) => ({
      ...achievement,
      unlocked: unlockedAchievements.includes(id),
    }));
  } catch (error) {
    console.error('Error getting achievements:', error);
    return [];
  }
};
