import MusicComposer from './MusicComposer';

class GameSoundManager {
  constructor() {
    this.composer = new MusicComposer();
    this.currentRealm = null;
  }

  async init() {
    await this.composer.init();
  }

  async handleGameEvent(event, options = {}) {
    await this.composer.playGameEvent(event, options);
  }

  async transitionToRealm(realm) {
    if (this.currentRealm === realm) return;
    
    await this.composer.stopAll();
    this.currentRealm = realm;
    await this.composer.playRealmAmbience(realm);
  }

  async cleanup() {
    await this.composer.stopAll();
  }
}

export default new GameSoundManager();
