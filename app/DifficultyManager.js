export class DifficultyManager {
  constructor() {
    this.currentDifficulty = 1;
  }

  increaseDifficulty() {
    this.currentDifficulty += 0.1;
  }

  decreaseDifficulty() {
    this.currentDifficulty = Math.max(1, this.currentDifficulty - 0.1);
  }

  getDifficulty() {
    return this.currentDifficulty;
  }
}
