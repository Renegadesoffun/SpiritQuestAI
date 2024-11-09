import MusicComposer from './MusicComposer';
import SoundEnhancer from './SoundEnhancer';

class GameAudioManager {
  constructor() {
    this.composer = MusicComposer;
    this.enhancer = SoundEnhancer;
    this.currentTheme = null;
  }

  async playLevelMusic(level) {
    const levelThemes = {
      1: 'meditation',
      2: 'forest',
       3: 'crystal',
      4: 'astral',
      5: 'wonderland'
    };

    if (levelThemes[level]) {
      await this.enhancer.createAmbientPad(levelThemes[level], {
        duration: 0,  // Infinite duration
        volume: 0.4
      });
    }
  }

  async handleGameEvent(event, data = {}) {
    const eventMappings = {
      PLAYER_JUMP: {
        sound: 'jump',
        options: {
          harmonics: [1, 1.5],
          volumes: [0.3, 0.15],
          delays: [0, 50],
          duration: 200
        }
      },
      COLLECT_ITEM: {
        sound: 'collect',
        options: {
          harmonics: [1, 1.2, 1.5],
          volumes: [0.4, 0.2, 0.1],
          delays: [0, 50, 100],
          duration: 500
        }
      },
      LEVEL_COMPLETE: {
        sound: 'levelComplete',
        options: {
          harmonics: [1, 1.2, 1.5, 2],
          volumes: [0.4, 0.3, 0.2, 0.1],
          delays: [0, 100, 200, 300],
          duration: 3000
        }
      }
    };

    const config = eventMappings[event];
    if (config) {
      await this.enhancer.createLayeredSound(
        config.sound,
        { ...config.options, ...data }
      );
    }
  }

  async cleanup() {
    await this.composer.stopAll();
  }
}

export default new GameAudioManager();
