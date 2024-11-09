import { Audio } from 'expo-av';
import { Vector3 } from 'three';

class SpatialAudioManager {
  constructor() {
    this.spatialSounds = new Map();
    this.listenerPosition = new Vector3();
    this.listenerOrientation = new Vector3(0, 0, -1);
    this.maxDistance = 50;
    this.rolloffFactor = 1;
  }

  setListenerPosition(position, orientation) {
    this.listenerPosition.copy(position);
    if (orientation) {
      this.listenerOrientation.copy(orientation);
    }
    this.updateAllSoundPositions();
  }

  async createSpatialSound(soundPath, position, options = {}) {
    const {
      volume = 1.0,
      loop = false,
      maxDistance = this.maxDistance,
      rolloffFactor = this.rolloffFactor,
      spread = 360,
      autoplay = true
    } = options;

    try {
      const { sound } = await Audio.Sound.createAsync(
        require(`../assets/sounds/${soundPath}.mp3`),
        { 
          shouldPlay: autoplay,
          volume: 0, // Will be set by position calculation
          isLooping: loop
        }
      );

      const spatialSound = {
        sound,
        position: new Vector3().copy(position),
        maxDistance,
        rolloffFactor,
        spread,
        baseVolume: volume
      };

      this.spatialSounds.set(soundPath, spatialSound);
      this.updateSoundPosition(spatialSound);

      return sound;
    } catch (error) {
      console.warn(`Failed to create spatial sound ${soundPath}:`, error);
      return null;
    }
  }

  updateSoundPosition(spatialSound) {
    const { sound, position, maxDistance, rolloffFactor, baseVolume } = spatialSound;
    
    // Calculate distance between listener and sound
    const distance = this.listenerPosition.distanceTo(position);
    
    // Calculate direction vector from listener to sound
    const direction = position.clone().sub(this.listenerPosition).normalize();
    
    // Calculate angle between listener orientation and sound direction
    const angle = Math.acos(direction.dot(this.listenerOrientation));
    
    // Calculate volume based on distance (inverse square law with rolloff)
    let volume = baseVolume / (1 + rolloffFactor * Math.pow(distance / maxDistance, 2));
    
    // Apply angular attenuation
    volume *= Math.cos(angle) * 0.5 + 0.5;
    
    // Clamp volume
    volume = Math.max(0, Math.min(1, volume));
    
    // Update sound volume
    sound.setVolumeAsync(volume);

    // Calculate stereo pan based on angle
    const pan = Math.sin(angle) * Math.sign(direction.x);
    if (sound.setStatusAsync) {
      sound.setStatusAsync({ stereoPan: pan });
    }
  }

  updateAllSoundPositions() {
    this.spatialSounds.forEach(sound => {
      this.updateSoundPosition(sound);
    });
  }

  async moveSoundPosition(soundPath, newPosition) {
    const spatialSound = this.spatialSounds.get(soundPath);
    if (spatialSound) {
      spatialSound.position.copy(newPosition);
      this.updateSoundPosition(spatialSound);
    }
  }

  async cleanup() {
    await Promise.all(
      Array.from(this.spatialSounds.values()).map(async ({ sound }) => {
        try {
          await sound.stopAsync();
          await sound.unloadAsync();
        } catch (error) {
          console.warn('Error cleaning up spatial sound:', error);
        }
      })
    );
    this.spatialSounds.clear();
  }
}

export default new SpatialAudioManager(); 