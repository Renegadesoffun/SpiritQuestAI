export class DifficultyManager {
  constructor(initialDifficulty = 1) {
    this.difficulty = initialDifficulty;
  }

  adjustDifficulty(playerPerformance) {
    // Adjust difficulty based on player performance
    this.difficulty += playerPerformance * 0.1;
    this.difficulty = Math.max(0.5, Math.min(this.difficulty, 2)); // Clamp between 0.5 and 2
  }

  getDifficulty() {
    return this.difficulty;
  }
}
