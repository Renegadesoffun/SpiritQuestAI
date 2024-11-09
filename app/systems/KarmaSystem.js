export class KarmaSystem {
  constructor() {
    this.karma = 0;
  }

  evaluate(action) {
    return {
      change: action.positive ? 1 : -1,
      balance: this.karma >= 0
    };
  }
}
