import { AudioEngine } from './AudioEngine';
import { SoundEnhancer } from './SoundEnhancer';
import { MusicComposer } from './MusicComposer';

class AudioManager {
  constructor() {
    this.engine = AudioEngine;
    this.enhancer = new SoundEnhancer();
    this.composer = MusicComposer;
    this.currentMood = 'calm';
    this.currentRealm = 'physical';
    this.currentMusic = null;
    this.currentAmbient = null;
    this.isInitialized = false;
    this.volumes = {
      music: 0.4,
      ambient: 0.3,
      effects: 0.5,
      instruments: 0.4
    };
  }

  async init() {
    if (this.isInitialized) return;
    
    try {
      await this.engine.init();
      this.isInitialized = true;
      console.log('✅ AudioManager initialized');
    } catch (err) {
      console.warn('❌ Failed to initialize audio:', err);
    }
  }

  async playSound(soundName, volume = 1.0) {
    if (!this.isInitialized) {
      await this.init();
    }
    await this.engine.playSound(`effects/${soundName}`, volume * this.volumes.effects);
  }

  async playMusic(type, fadeTime = 2000) {
    if (!this.isInitialized) await this.init();
    
    try {
      if (this.currentMusic === type) return;
      
      // Fade out current music if any
      if (this.currentMusic) {
        await this.engine.fadeOut(this.currentMusic, fadeTime);
      }
      
      // Start new music
      this.currentMusic = type;
      await this.engine.playMusic(
        `music/${type}`,
        {
          loop: true,
          volume: this.volumes.music,
          fadeIn: fadeTime
        }
      );
    } catch (err) {
      console.warn(`Failed to play music ${type}:`, err);
    }
  }

  async transitionToRealm(realm, fadeTime = 3000) {
    if (!this.isInitialized) await this.init();
    if (this.currentRealm === realm) return;
    
    try {
      // Fade out current sounds
      if (this.currentAmbient) {
        await this.engine.fadeOut(`ambient/${this.currentRealm}`, fadeTime);
      }
      if (this.currentMusic) {
        await this.engine.fadeOut(this.currentMusic, fadeTime);
      }
      
      this.currentRealm = realm;
      
      // Play transition effect
      await this.playSound('spirit_whoosh', 0.4);
      
      // Start new ambient and music
      await Promise.all([
        this.playLayeredAmbient(realm, {
          fadeIn: fadeTime,
          loop: true
        }),
        this.playComposition(realm, {
          fadeIn: fadeTime,
          loop: true
        })
      ]);

    } catch (err) {
      console.warn('Failed to transition realm:', err);
    }
  }

  setMood(mood) {
    this.currentMood = mood;
    const moodVolumes = {
      calm: {
        music: 0.3,
        ambient: 0.3,
        effects: 0.4,
        instruments: 0.3
      },
      intense: {
        music: 0.6,
        ambient: 0.4,
        effects: 0.7,
        instruments: 0.5
      },
      mystical: {
        music: 0.4,
        ambient: 0.5,
        effects: 0.5,
        instruments: 0.4
      }
    };
    
    this.volumes = moodVolumes[mood] || moodVolumes.calm;
    this.engine.updateVolumes(this.volumes);
  }

  async cleanup() {
    if (!this.isInitialized) return;
    
    try {
      const fadeTime = 1000;
      await Promise.all([
        this.engine.fadeOut(this.currentMusic, fadeTime),
        this.engine.fadeOut(`ambient/${this.currentRealm}`, fadeTime),
        this.composer.cleanup(),
        this.enhancer.cleanup()
      ]);
      
      this.engine.cleanup();
      this.isInitialized = false;
      this.currentMusic = null;
      this.currentAmbient = null;
    } catch (err) {
      console.warn('Error during cleanup:', err);
    }
  }

  async playInstrument(type, name, options = {}) {
    if (!this.isInitialized) await this.init();
    
    try {
      const volume = options.volume || 1.0;
      await this.engine.playSound(
        `instruments/${type}/${name}`,
        volume * this.volumes.instruments
      );
    } catch (err) {
      console.warn(`Failed to play instrument ${type}/${name}:`, err);
    }
  }

  async playLayeredAmbient(realm, options = {}) {
    if (!this.isInitialized) await this.init();
    
    try {
      // Create layered ambient sound using SoundEnhancer
      await this.enhancer.createAmbientPad(realm, {
        volume: this.volumes.ambient,
        ...options
      });
    } catch (err) {
      console.warn(`Failed to play layered ambient for ${realm}:`, err);
    }
  }

  async playComposition(type, options = {}) {
    if (!this.isInitialized) await this.init();
    
    try {
      await this.composer.playComposition(type, {
        volume: this.volumes.music,
        ...options
      });
    } catch (err) {
      console.warn(`Failed to play composition ${type}:`, err);
    }
  }
}

export { AudioManager };
