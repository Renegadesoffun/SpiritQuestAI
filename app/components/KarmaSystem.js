class KarmaSystem {
  constructor() {
    this.karma = 0;
    this.karmaLevels = [
      { level: 'Novice Soul', threshold: 0, color: '#64b5f6' },
      { level: 'Awakening Spirit', threshold: 100, color: '#9575cd' },
      { level: 'Enlightened Being', threshold: 250, color: '#ffd700' },
      { level: 'Cosmic Entity', threshold: 500, color: '#ff4081' }
    ];
    
    this.karmaEffects = {
      healing: (amount) => Math.floor(amount * (1 + this.karma / 1000)),
      wisdom: (amount) => Math.floor(amount * (1 + this.karma / 800)),
      protection: () => this.karma > 200 ? 0.2 : 0
    };
  }

  addKarma(amount, reason) {
    this.karma += amount;
    this.checkKarmaLevel();
    return {
      newTotal: this.karma,
      level: this.getCurrentLevel(),
      effect: this.getKarmaEffect()
    };
  }
}
