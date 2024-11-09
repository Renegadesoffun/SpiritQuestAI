import { Audio } from 'expo-av';
import MusicComposer from './MusicComposer.mjs';
import { WaveformGenerator } from './WaveformGenerator.mjs';

class SoundEnhancer {
  constructor() {
    this.composer = MusicComposer;
    this.activeLayers = new Map();
    this.realmEffects = {
      meditation: {
        reverb: { decay: 3.0, mix: 0.4 },
        delay: { time: 0.8, feedback: 0.2 }
      },
      crystal: {
        chorus: { rate: 0.8, depth: 0.3 },
        reverb: { decay: 2.5, mix: 0.3 }
      },
      spirit: {
        delay: { time: 0.6, feedback: 0.3 },
        chorus: { rate: 1.2, depth: 0.4 }
      },
      forest: {
        reverb: { decay: 2.0, mix: 0.25 },
        delay: { time: 0.4, feedback: 0.15 }
      },
      astral: {
        chorus: { rate: 1.5, depth: 0.5 },
        reverb: { decay: 4.0, mix: 0.5 }
      }
    };
  }

  async createAmbientPad(realm, options = {}) {
    const {
      volume = 0.3,
      fadeIn = 2000,
      loop = true
    } = options;

    try {
      // Clean up any existing ambient for this realm
      await this.cleanupRealm(realm);

      // Get realm-specific effects
      const effects = this.realmEffects[realm] || this.realmEffects.meditation;

      // Create base pad layer
      const padSound = await this.createPadLayer(realm, {
        volume: volume * 0.6,
        fadeIn,
        loop,
        effects
      });

      // Create atmospheric layer
      const atmosphereSound = await this.createAtmosphereLayer(realm, {
        volume: volume * 0.4,
        fadeIn,
        loop,
        effects
      });

      // Create texture layer
      const textureSound = await this.createTextureLayer(realm, {
        volume: volume * 0.3,
        fadeIn,
        loop,
        effects
      });

      this.activeLayers.set(realm, [padSound, atmosphereSound, textureSound].filter(Boolean));
    } catch (error) {
      console.warn(`Failed to create ambient pad for ${realm}:`, error);
    }
  }

  async createPadLayer(realm, options) {
    const padTypes = {
      meditation: 'ethereal',
      crystal: 'crystal',
      spirit: 'cosmic',
      forest: 'nature',
      astral: 'space'
    };

    const padType = padTypes[realm] || 'ethereal';
    return await this.loadAndEnhanceSound(`instruments/pad/${padType}`, options);
  }

  async createAtmosphereLayer(realm, options) {
    const atmosphereTypes = {
      meditation: 'wind',
      crystal: 'shimmer',
      spirit: 'whispers',
      forest: 'leaves',
      astral: 'space_wind'
    };

    const atmosphereType = atmosphereTypes[realm] || 'wind';
    return await this.loadAndEnhanceSound(`ambient/${atmosphereType}`, options);
  }

  async createTextureLayer(realm, options) {
    const textureTypes = {
      meditation: 'chimes',
      crystal: 'sparkles',
      spirit: 'echoes',
      forest: 'birds',
      astral: 'stars'
    };

    const textureType = textureTypes[realm] || 'chimes';
    return await this.loadAndEnhanceSound(`ambient/${textureType}`, options);
  }

  async loadAndEnhanceSound(soundPath, options) {
    const {
      volume = 1.0,
      fadeIn = 2000,
      loop = true,
      effects = {}
    } = options;

    try {
      const sound = await this.composer.loadSound(soundPath);
      if (!sound) return null;

      // Apply effects
      await this.applyEffects(sound, effects);

      // Configure sound
      await sound.setVolumeAsync(0);
      if (loop) {
        await sound.setIsLoopingAsync(true);
      }

      // Play and fade in
      await sound.playAsync();
      await this.fadeIn(sound, volume, fadeIn);

      return sound;
    } catch (error) {
      console.warn(`Failed to load and enhance sound ${soundPath}:`, error);
      return null;
    }
  }

  async applyEffects(sound, effects) {
    // Apply each effect in sequence
    for (const [effect, settings] of Object.entries(effects)) {
      try {
        await this.applyEffect(sound, effect, settings);
      } catch (error) {
        console.warn(`Failed to apply effect ${effect}:`, error);
      }
    }
  }

  async applyEffect(sound, effect, settings) {
    // Implementation would depend on the audio processing capabilities
    // Here we're just simulating effect application
    console.log(`Applied ${effect} effect with settings:`, settings);
  }

  async fadeIn(sound, targetVolume, duration) {
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = targetVolume / steps;

    for (let i = 0; i <= steps; i++) {
      await sound.setVolumeAsync(volumeStep * i);
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
  }

  async cleanupRealm(realm) {
    const layers = this.activeLayers.get(realm);
    if (layers) {
      await Promise.all(
        layers.map(async sound => {
          try {
            await sound.stopAsync();
            await sound.unloadAsync();
          } catch (error) {
            console.warn(`Failed to cleanup sound for realm ${realm}:`, error);
          }
        })
      );
      this.activeLayers.delete(realm);
    }
  }

  async cleanup() {
    const realms = Array.from(this.activeLayers.keys());
    await Promise.all(
      realms.map(realm => this.cleanupRealm(realm))
    );
  }
}

export { SoundEnhancer }; 