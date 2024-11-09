class EnhancedAchievementSystem {
  constructor() {
    this.achievements = new Map();
    this.unlockedAchievements = new Set();
    
    // Initialize achievement categories
    this.categories = {
      meditation: {
        icon: '🧘',
        color: '#9C27B0',
        sound: 'meditation_complete'
      },
      wisdom: {
        icon: '🌟',
        color: '#FFD700',
        sound: 'wisdom_gained'
      },
      spirit: {
        icon: '👻',
        color: '#4FC3F7',
        sound: 'spirit_ascended'
      },
      mastery: {
        icon: '🎯',
        color: '#F44336',
        sound: 'mastery_achieved'
      }
    };

    // Initialize achievement effects
    this.effects = {
      particles: new ParticleSystem(),
      sound: new SoundManager(),
      visual: new VisualEffects()
    };
  }

  registerAchievement(id, config) {
    this.achievements.set(id, {
      ...config,
      unlocked: false,
      progress: 0,
      timestamp: null
    });
  }

  async updateProgress(id, progress) {
    const achievement = this.achievements.get(id);
    if (!achievement || achievement.unlocked) return;

    // Update progress
    achievement.progress = Math.min(
      progress, 
      achievement.requirement
    );

    // Check for unlock
    if (achievement.progress >= achievement.requirement) {
      await this.unlockAchievement(id);
    }
  }

  async unlockAchievement(id) {
    const achievement = this.achievements.get(id);
    if (!achievement || achievement.unlocked) return;

    // Mark as unlocked
    achievement.unlocked = true;
    achievement.timestamp = Date.now();
    this.unlockedAchievements.add(id);

    // Create unlock effects
    await this.createUnlockEffects(achievement);
    
    // Grant rewards
    await this.grantAchievementRewards(achievement);
    
    // Show notification
    await this.showAchievementNotification(achievement);
  }

  async createUnlockEffects(achievement) {
    const category = this.categories[achievement.category];

    // Create particle burst
    this.effects.particles.emit('achievement_unlock', {
      color: category.color,
      count: 50,
      duration: 2000,
      spread: 360
    });

    // Play unlock sound
    this.effects.sound.play(category.sound, {
      volume: 0.7,
      pitch: 1.2
    });

    // Create visual effects
    this.effects.visual.createAchievementEffect({
      icon: category.icon,
      color: category.color,
      duration: 3000
    });
  }

  async showAchievementNotification(achievement) {
    const category = this.categories[achievement.category];
    
    return new Promise(resolve => {
      // Create floating notification
      const notification = new FloatingNotification({
        title: achievement.title,
        description: achievement.description,
        icon: category.icon,
        color: category.color,
        duration: 5000
      });

      // Show notification with effects
      notification.show().then(resolve);
    });
  }
}
