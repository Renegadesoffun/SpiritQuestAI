import GameSoundDirector from '../audio/GameSoundDirector';
import SpatialAudioManager from '../audio/SpatialAudioManager';
import DSPEffectsProcessor from '../audio/DSPEffectsProcessor';
import AudioDebugger from '../audio/AudioDebugger';
import SoundProfiler from '../audio/SoundProfiler';
import { Vector3 } from 'three';

class GameAudioController {
  constructor() {
    this.director = GameSoundDirector;
    this.spatial = SpatialAudioManager;
    this.dsp = DSPEffectsProcessor;
    this.debugger = AudioDebugger;
    this.profiler = SoundProfiler;
    
    // Game state
    this.currentScene = null;
    this.playerPosition = new Vector3();
    this.isInCombat = false;
    this.environmentType = 'default';
    
    // Audio zones
    this.audioZones = new Map();
    
    // Performance monitoring
    this.lastUpdate = Date.now();
    this.frameCount = 0;
  }

  async init() {
    try {
      await Promise.all([
        this.director.init(),
        this.dsp.init()
      ]);
      
      this.setupEventListeners();
      this.startPerformanceMonitoring();
      
      console.log('✅ Game Audio Controller initialized');
    } catch (error) {
      console.warn('❌ Failed to initialize Game Audio Controller:', error);
    }
  }

  setupEventListeners() {
    // Game events
    this.director.on('combatStart', () => this.handleCombatStart());
    this.director.on('combatEnd', () => this.handleCombatEnd());
    this.director.on('questStart', (questId) => this.handleQuestStart(questId));
    this.director.on('questComplete', (questId) => this.handleQuestComplete(questId));
    
    // Environment events
    this.director.on('environmentChange', (env) => this.handleEnvironmentChange(env));
    this.director.on('timeChange', (time) => this.handleTimeChange(time));
    this.director.on('weatherChange', (weather) => this.handleWeatherChange(weather));
  }

  updatePlayerPosition(position, orientation) {
    this.playerPosition.copy(position);
    this.spatial.setListenerPosition(position, orientation);
    this.checkAudioZones();
  }

  registerAudioZone(id, position, radius, options = {}) {
    this.audioZones.set(id, {
      position: new Vector3().copy(position),
      radius,
      sound: options.sound,
      volume: options.volume || 1.0,
      effects: options.effects || []
    });
  }

  checkAudioZones() {
    this.audioZones.forEach((zone, id) => {
      const distance = this.playerPosition.distanceTo(zone.position);
      if (distance <= zone.radius) {
        this.handleZoneEnter(id, distance / zone.radius);
      }
    });
  }

  async handleZoneEnter(zoneId, distanceRatio) {
    const zone = this.audioZones.get(zoneId);
    if (!zone) return;

    // Create spatial sound for zone
    await this.spatial.createSpatialSound(
      zone.sound,
      zone.position,
      {
        volume: zone.volume * (1 - distanceRatio),
        maxDistance: zone.radius,
        effects: zone.effects
      }
    );
  }

  async handleCombatStart() {
    this.isInCombat = true;
    await this.dsp.createEffect('compressor', {
      threshold: -24,
      ratio: 12,
      attack: 0.003
    });
    await this.director.transitionToScene('combat', { crossFade: true });
  }

  startPerformanceMonitoring() {
    setInterval(() => {
      const now = Date.now();
      const elapsed = now - this.lastUpdate;
      const fps = this.frameCount / (elapsed / 1000);
      
      this.debugger.updateMetrics({
        fps,
        audioLatency: this.dsp.audioContext?.baseLatency || 0,
        activeEffects: this.dsp.effects.size,
        activeSounds: this.spatial.spatialSounds.size
      });
      
      this.frameCount = 0;
      this.lastUpdate = now;
    }, 1000);
  }

  update() {
    this.frameCount++;
    
    // Update spectral analysis
    const spectralData = this.dsp.getSpectralData();
    this.debugger.updateMetrics({
      spectralData
    });
    
    // Profile performance
    this.profiler.recordFrameTime(Date.now() - this.lastUpdate);
  }

  async cleanup() {
    await Promise.all([
      this.director.cleanup(),
      this.spatial.cleanup(),
      this.dsp.cleanup()
    ]);
    
    this.audioZones.clear();
    this.debugger.log('Game Audio Controller cleaned up');
  }
}

export default new GameAudioController(); 