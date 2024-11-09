export class SpiritGuideSystem {
  constructor() {
    this.energy = 100;
    this.wisdom = 0;
  }

  guide(error) {
    return {
      suggestion: `Meditate on the nature of "${error.message}"`,
      energyCost: 10
    };
  }
}
