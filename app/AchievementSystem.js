import AsyncStorage from '@react-native-async-storage/async-storage';

const achievements = [
  { id: 'firstStep', title: 'First Step', description: 'Start your spiritual journey', unlocked: false },
  { id: 'levelComplete', title: 'Level Master', description: 'Complete a level', unlocked: false },
  { id: 'wisdomSeeker', title: 'Wisdom Seeker', description: 'Collect 100 wisdom points', unlocked: false },
  { id: 'dreamWeaver', title: 'Dream Weaver', description: 'Create your first dream', unlocked: false },
  { id: 'astralProjector', title: 'Astral Projector', description: 'Complete the Astral Projection mini-game', unlocked: false },
];

export const unlockAchievement = async (achievementId) => {
  try {
    const currentAchievements = await getAchievements();
    const updatedAchievements = currentAchievements.map(achievement => 
      achievement.id === achievementId ? { ...achievement, unlocked: true } : achievement
    );
    await AsyncStorage.setItem('achievements', JSON.stringify(updatedAchievements));
    return updatedAchievements;
  } catch (error) {
    console.error('Error unlocking achievement:', error);
  }
};

export const getAchievements = async () => {
  try {
    const savedAchievements = await AsyncStorage.getItem('achievements');
    return savedAchievements ? JSON.parse(savedAchievements) : achievements;
  } catch (error) {
    console.error('Error getting achievements:', error);
    return achievements;
  }
};

export const checkAchievements = async (playerStats) => {
  if (playerStats.wisdom >= 100) {
    await unlockAchievement('wisdomSeeker');
  }
  // Add more achievement checks based on player stats or game progress
};
