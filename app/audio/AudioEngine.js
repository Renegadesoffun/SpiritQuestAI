import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

class AudioEngine {
  constructor() {
    this.activeSounds = new Map();
    this.volumes = {
      music: 0.4,
      ambient: 0.3,
      effects: 0.5,
      instruments: 0.4
    };
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });
      
      this.isInitialized = true;
      console.log('✅ AudioEngine initialized');
    } catch (error) {
      console.warn('❌ Failed to initialize AudioEngine:', error);
      throw error;
    }
  }

  async playSound(soundPath, volume = 1.0, options = {}) {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require(`../assets/sounds/${soundPath}.mp3`),
        { 
          shouldPlay: true,
          volume: volume,
          ...options
        }
      );

      // Store reference if we need to control it later
      if (options.storeRef) {
        this.activeSounds.set(soundPath, sound);
      }

      // Auto cleanup for one-shot sounds
      if (!options.loop) {
        sound.setOnPlaybackStatusUpdate(status => {
          if (status.didJustFinish) {
            sound.unloadAsync();
            this.activeSounds.delete(soundPath);
          }
        });
      }

      return sound;
    } catch (error) {
      console.warn(`Failed to play sound ${soundPath}:`, error);
      return null;
    }
  }

  async playMusic(musicPath, options = {}) {
    const {
      loop = true,
      volume = this.volumes.music,
      fadeIn = 2000
    } = options;

    try {
      const sound = await this.playSound(musicPath, 0, {
        loop,
        storeRef: true
      });

      if (sound) {
        await this.fadeIn(sound, volume, fadeIn);
        return sound;
      }
    } catch (error) {
      console.warn(`Failed to play music ${musicPath}:`, error);
    }
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

  async fadeOut(soundPath, duration) {
    const sound = this.activeSounds.get(soundPath);
    if (!sound) return;

    try {
      const steps = 20;
      const stepDuration = duration / steps;
      const currentVolume = (await sound.getStatusAsync()).volume;
      const volumeStep = currentVolume / steps;

      for (let i = steps; i >= 0; i--) {
        await sound.setVolumeAsync(volumeStep * i);
        await new Promise(resolve => setTimeout(resolve, stepDuration));
      }

      await sound.stopAsync();
      await sound.unloadAsync();
      this.activeSounds.delete(soundPath);
    } catch (error) {
      console.warn(`Failed to fade out ${soundPath}:`, error);
    }
  }

  updateVolumes(volumes) {
    this.volumes = { ...this.volumes, ...volumes };
    
    // Update all active sounds
    this.activeSounds.forEach((sound, path) => {
      const category = path.split('/')[0];
      const volume = this.volumes[category] || 1.0;
      sound.setVolumeAsync(volume).catch(error => {
        console.warn(`Failed to update volume for ${path}:`, error);
      });
    });
  }

  async cleanup() {
    try {
      await Promise.all(
        Array.from(this.activeSounds.values()).map(async sound => {
          try {
            await sound.stopAsync();
            await sound.unloadAsync();
          } catch (error) {
            console.warn('Error cleaning up sound:', error);
          }
        })
      );
      
      this.activeSounds.clear();
      this.isInitialized = false;
    } catch (error) {
      console.warn('Error during AudioEngine cleanup:', error);
    }
  }
}

export default new AudioEngine(); 