class EnhancedQuestSystem {
  constructor() {
    this.activeQuests = new Map();
    this.completedQuests = new Set();
    
    // Initialize quest types
    this.questTypes = {
      meditation: new MeditationQuests(),
      spirit: new SpiritQuests(),
      wisdom: new WisdomQuests(),
      challenge: new ChallengeQuests()
    };

    // Initialize reward system
    this.rewards = {
      karma: new KarmaRewards(),
      abilities: new AbilityRewards(),
      items: new ItemRewards(),
      enlightenment: new EnlightenmentRewards()
    };
  }

  async startQuest(questId) {
    const quest = await this.generateQuest(questId);
    
    // Initialize quest state
    this.activeQuests.set(questId, {
      progress: 0,
      state: 'active',
      objectives: quest.objectives,
      rewards: quest.rewards
    });

    // Create quest effects
    await this.createQuestEffects(quest);
    
    // Begin quest tracking
    this.startQuestTracking(questId);
  }

  async generateQuest(questId) {
    const questType = this.determineQuestType(questId);
    const quest = await this.questTypes[questType].generate({
      playerLevel: this.getPlayerLevel(),
      karma: this.getPlayerKarma(),
      realm: this.getCurrentRealm()
    });

    return {
      id: questId,
      type: questType,
      objectives: quest.objectives,
      rewards: this.calculateRewards(quest),
      requirements: quest.requirements
    };
  }

  async updateQuestProgress(questId, progress) {
    const quest = this.activeQuests.get(questId);
    if (!quest) return;

    // Update progress
    quest.progress = progress;
    
    // Check objectives
    const completedObjectives = this.checkObjectives(quest);
    
    // Create progress effects
    await this.createProgressEffects(questId, completedObjectives);
    
    // Check completion
    if (this.isQuestComplete(quest)) {
      await this.completeQuest(questId);
    }
  }

  async completeQuest(questId) {
    const quest = this.activeQuests.get(questId);
    
    // Grant rewards
    await this.grantRewards(quest.rewards);
    
    // Create completion effects
    await this.createCompletionEffects(quest);
    
    // Update quest state
    this.activeQuests.delete(questId);
    this.completedQuests.add(questId);
    
    // Check for quest chain updates
    await this.updateQuestChains(questId);
  }

  async createCompletionEffects(quest) {
    // Create visual celebration
    this.particleSystem.emit('quest_complete', {
      type: quest.type,
      position: 'center',
      duration: 3000
    });
    
    // Play completion sound
    this.audioSystem.play('quest_complete', {
      type: quest.type,
      volume: 0.8
    });
    
    // Show floating rewards
    await this.showFloatingRewards(quest.rewards);
  }
}
