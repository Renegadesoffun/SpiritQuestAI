class AdvancedProgressionSystem {
  constructor() {
    this.playerLevel = 1;
    this.experience = 0;
    this.skills = new Map();
    this.titles = new Set();
    
    this.progressionPaths = {
      meditation: {
        name: "Path of Inner Peace",
        levels: [
          {
            level: 1,
            title: "Seeker of Calm",
            requirement: 100,
            reward: {
              type: "ability",
              id: "breath_control",
              name: "Breath Control",
              description: "Slow time briefly during meditation"
            }
          },
          {
            level: 5,
            title: "Mind Walker",
            requirement: 500,
            reward: {
              type: "transformation",
              id: "spirit_form",
              name: "Spirit Form",
              description: "Transform into pure energy briefly"
            }
          }
        ]
      },
      wisdom: {
        name: "Path of Ancient Knowledge",
        levels: [
          {
            level: 1,
            title: "Truth Seeker",
            requirement: 100,
            reward: {
              type: "insight",
              id: "cosmic_awareness",
              name: "Cosmic Awareness",
              description: "See hidden spiritual paths"
            }
          }
        ]
      }
    };
  }

  gainExperience(amount, type) {
    this.experience += amount;
    
    // Check for level up
    const newLevel = this.calculateLevel(this.experience);
    if (newLevel > this.playerLevel) {
      this.levelUp(newLevel);
    }
    
    // Update path progression
    this.updatePathProgress(type, amount);
    
    // Check for unlocks
    this.checkUnlocks();
  }

  levelUp(newLevel) {
    // Create epic level up sequence
    this.showLevelUpSequence(newLevel);
    
    // Grant rewards
    this.grantLevelRewards(newLevel);
    
    // Update player stats
    this.updatePlayerStats(newLevel);
  }

  showLevelUpSequence(newLevel) {
    return new Promise(resolve => {
      // Create energy surge effect
      this.particleSystem.emit('level_up_surge', {
        position: 'player',
        duration: 3000
      });
      
      // Show floating orbs with new abilities
      this.showRewardOrbs(this.getLevelRewards(newLevel));
      
      // Play epic sound
      audioManager.playEffect('level_up', {
        volume: 1.0,
        pitch: 1 + (newLevel * 0.05)
      });
      
      setTimeout(resolve, 3000);
    });
  }
}
