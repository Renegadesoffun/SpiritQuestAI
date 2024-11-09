import React from 'react';
import { EventEmitter } from 'events';

class GameStateManager extends EventEmitter {
  constructor() {
    super();
    this.state = {
      score: 0,
      level: 1,
      health: 100,
      errors: [],
      recoveryProgress: 0
    };
  }

  updateState(updates) {
    this.state = { ...this.state, ...updates };
    this.emit('stateChanged', this.state);
  }

  handleError(error) {
    this.state.errors.push(error);
    this.emit('error', error);
  }

  resetState() {
    this.state = {
      score: 0,
      level: 1,
      health: 100,
      errors: [],
      recoveryProgress: 0
    };
    this.emit('stateReset');
  }
}

export default GameStateManager;
