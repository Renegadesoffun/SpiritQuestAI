import { AudioManager } from './AudioManager';
import { EventEmitter } from 'events';

class GameSoundDirector extends EventEmitter {
  constructor() {
    super();
    this.audio = new AudioManager();
    this.currentScene = null;
    this.currentIntensity = 0;
    this.isInCombat = false;
    this.activeQuests = new Set();
    
    // Dynamic music state
    this.musicLayers = {
      base: null,
      action: null,
      tension: null,
      victory: null
    };

    // Scene-specific sound configs
    this.sceneConfigs = {
      meditation: {
        ambient: { volume: 0.4, fadeTime: 3000 },
        music: { volume: 0.3, fadeTime: 2000 },
        effects: { volume: 0.5 }
      },
      combat: {
        ambient: { volume: 0.2, fadeTime: 1500 },
        music: { volume: 0.6, fadeTime: 1000 },
        effects: { volume: 0.7 }
      },
      exploration: {
        ambient: { volume: 0.5, fadeTime: 2500 },
        music: { volume: 0.4, fadeTime: 2000 },
        effects: { volume: 0.6 }
      }
    };
  }

  async init() {
    await this.audio.init();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Game state events
    this.on('combatStart', () => this.handleCombatStart());
    this.on('combatEnd', () => this.handleCombatEnd());
    this.on('questStart', (questId) => this.handleQuestStart(questId));
    this.on('questComplete', (questId) => this.handleQuestComplete(questId));
    this.on('playerDeath', () => this.handlePlayerDeath());
    this.on('bossEncounter', () => this.handleBossEncounter());
    
    // Environment events
    this.on('environmentChange', (env) => this.handleEnvironmentChange(env));
    this.on('timeChange', (time) => this.handleTimeChange(time));
    this.on('weatherChange', (weather) => this.handleWeatherChange(weather));
  }

  async transitionToScene(sceneName, options = {}) {
    const {
      immediate = false,
      crossFade = true
    } = options;

    const config = this.sceneConfigs[sceneName] || this.sceneConfigs.exploration;
    const fadeTime = immediate ? 0 : config.ambient.fadeTime;

    try {
      // Transition realm sounds
      await this.audio.transitionToRealm(sceneName, fadeTime);
      
      // Update music intensity based on scene
      await this.updateMusicIntensity(
        sceneName === 'combat' ? 0.8 : 0.3
      );

      this.currentScene = sceneName;
    } catch (error) {
      console.warn('Failed to transition scene:', error);
    }
  }

  async updateMusicIntensity(intensity) {
    this.currentIntensity = intensity;
    
    try {
      // Adjust layer volumes based on intensity
      if (this.musicLayers.base) {
        await this.audio.setLayerVolume('base', 0.7 - (intensity * 0.3));
      }
      if (this.musicLayers.action) {
        await this.audio.setLayerVolume('action', intensity * 0.8);
      }
      if (this.musicLayers.tension) {
        await this.audio.setLayerVolume('tension', intensity * 0.6);
      }
    } catch (error) {
      console.warn('Failed to update music intensity:', error);
    }
  }

  async handleCombatStart() {
    this.isInCombat = true;
    await this.transitionToScene('combat', { crossFade: true });
    await this.audio.playSound('combat_start', 0.6);
  }

  async handleCombatEnd(victory = true) {
    this.isInCombat = false;
    if (victory) {
      await this.audio.playSound('victory', 0.5);
      await this.updateMusicIntensity(0.2);
    }
    await this.transitionToScene('exploration');
  }

  async handleQuestStart(questId) {
    this.activeQuests.add(questId);
    await this.audio.playSound('quest_accept', 0.5);
    await this.updateMusicIntensity(0.4);
  }

  async handleQuestComplete(questId) {
    this.activeQuests.delete(questId);
    await this.audio.playSound('quest_complete', 0.6);
    await this.audio.playInstrument('fanfare', 'victory', { volume: 0.5 });
  }

  async handleEnvironmentChange(environment) {
    try {
      await this.audio.updateAmbientSounds(environment);
      
      // Adjust reverb based on environment
      const reverbSettings = {
        cave: { decay: 3.0, mix: 0.4 },
        forest: { decay: 1.5, mix: 0.2 },
        temple: { decay: 2.5, mix: 0.3 }
      };
      
      await this.audio.setReverbSettings(
        reverbSettings[environment] || { decay: 1.0, mix: 0.2 }
      );
    } catch (error) {
      console.warn('Failed to handle environment change:', error);
    }
  }

  async cleanup() {
    this.removeAllListeners();
    await this.audio.cleanup();
  }
}

export default new GameSoundDirector(); 