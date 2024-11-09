import { Audio } from 'expo-av';
import { Asset } from 'expo-asset';
import { WaveformGenerator } from './WaveformGenerator.mjs';
import { AVAILABLE_SOUNDS, isNoteAvailable, isChordAvailable } from './SoundLibrary';

class MusicComposer {
  constructor() {
    this.activeSounds = new Map();
    this.currentIntensity = 0;
    this.realmSoundLayers = {
      meditation: ['pad', 'choir', 'strings'],
      crystal: ['pad', 'harp', 'piano'],
      spirit: ['pad', 'strings', 'choir'],
      forest: ['pad', 'harp', 'strings'],
      astral: ['pad', 'piano', 'choir']
    };

    this.availableSounds = AVAILABLE_SOUNDS;
    this.scales = {
      major: [0, 2, 4, 5, 7, 9, 11],
      minor: [0, 2, 3, 5, 7, 8, 10],
      pentatonic: [0, 2, 4, 7, 9]
    };
  }

  async init() {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true
    });
  }

  async playComposition(type, options = {}) {
    const {
      volume = 1.0,
      fadeIn = 2000,
      loop = true
    } = options;

    try {
      // Stop any existing composition
      await this.stopComposition(type);

      const layers = this.realmSoundLayers[type] || ['pad'];
      const sounds = await Promise.all(
        layers.map(async (layer, index) => {
          const sound = await this.loadSound(`instruments/${layer}/${type}`);
          if (sound) {
            // Stagger the start times slightly for more organic feel
            setTimeout(() => {
              sound.setVolumeAsync(0);
              sound.playAsync();
              this.fadeIn(sound, volume * (1 - index * 0.2), fadeIn);
            }, index * 200);
            
            if (loop) {
              sound.setIsLoopingAsync(true);
            }
            
            this.activeSounds.set(`${type}_${layer}`, sound);
            return sound;
          }
        })
      );

      return sounds.filter(Boolean);
    } catch (error) {
      console.warn(`Failed to play composition ${type}:`, error);
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

  async fadeOut(sound, duration) {
    const steps = 20;
    const stepDuration = duration / steps;
    const currentVolume = await sound.getVolumeAsync();
    const volumeStep = currentVolume / steps;

    for (let i = steps; i >= 0; i--) {
      await sound.setVolumeAsync(volumeStep * i);
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
  }

  async adjustMusicIntensity(intensity) {
    this.currentIntensity = intensity;
    
    for (const [key, sound] of this.activeSounds.entries()) {
      const [type, layer] = key.split('_');
      let layerVolume;
      
      switch (layer) {
        case 'pad':
          layerVolume = 1 - (intensity * 0.3); // Pads fade slightly with intensity
          break;
        case 'strings':
        case 'choir':
          layerVolume = 0.7 + (intensity * 0.3); // Strings/choir increase with intensity
          break;
        case 'piano':
        case 'harp':
          layerVolume = 0.5 + (intensity * 0.5); // Piano/harp increase more with intensity
          break;
        default:
          layerVolume = 1;
      }
      
      await sound.setVolumeAsync(layerVolume);
    }
  }

  async playGameEvent(event, options = {}) {
    const {
      volume = 1.0,
      duration = 2000
    } = options;

    try {
      const sound = await this.loadSound(`effects/${event}`);
      if (sound) {
        await sound.setVolumeAsync(volume);
        await sound.playAsync();
        
        // Cleanup after playing
        setTimeout(async () => {
          await sound.unloadAsync();
        }, duration);
      }
    } catch (error) {
      console.warn(`Failed to play game event ${event}:`, error);
    }
  }

  async stopComposition(type) {
    const layersToStop = Array.from(this.activeSounds.keys())
      .filter(key => key.startsWith(type));
      
    await Promise.all(
      layersToStop.map(async key => {
        const sound = this.activeSounds.get(key);
        if (sound) {
          await this.fadeOut(sound, 1000);
          await sound.stopAsync();
          await sound.unloadAsync();
          this.activeSounds.delete(key);
        }
      })
    );
  }

  async cleanup() {
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
  }

  async loadSound(path) {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require(`../assets/sounds/${path}.mp3`),
        { shouldPlay: false }
      );
      return sound;
    } catch (error) {
      console.warn(`Failed to load sound ${path}:`, error);
      return null;
    }
  }

  async composeRealmTheme(realm, options = {}) {
    const {
      scale = 'pentatonic',
      rootNote = 'C4',
      tempo = 90,
      duration = 32
    } = options;

    // Select instruments based on realm
    const instruments = this.getRealmInstruments(realm);
    
    // Generate melody using available notes
    const melody = this.generateMelody(instruments.lead, scale, rootNote, duration);
    
    // Generate harmony using available chords
    const harmony = this.generateHarmony(instruments.harmony, scale, rootNote);
    
    // Add realm-specific effects
    const effects = this.getRealmEffects(realm);

    return {
      melody,
      harmony,
      effects,
      tempo,
      instruments
    };
  }

  getRealmInstruments(realm) {
    const instrumentSets = {
      meditation: {
        lead: ['strings.violin', 'woodwinds.flute'],
        harmony: ['piano.soft', 'pad.meditation'],
        bass: 'strings.cello',
        texture: ['choir.sustain', 'pad.crystal']
      },
      crystal: {
        lead: ['strings.violin', 'strings.harp'],
        harmony: ['piano.grand', 'pad.crystal'],
        bass: 'strings.cello',
        texture: ['choir.staccato', 'effects.magic.crystal_hum']
      },
      spirit: {
        lead: ['strings.violin', 'woodwinds.flute'],
        harmony: ['strings.viola', 'pad.spirit'],
        bass: 'strings.cello',
        texture: ['choir.sustain', 'effects.magic.spirit_wind']
      },
      forest: {
        lead: ['woodwinds.flute', 'strings.violin'],
        harmony: ['strings.viola', 'pad.forest'],
        bass: 'strings.cello',
        texture: ['effects.nature.birds', 'choir.sustain']
      },
      astral: {
        lead: ['strings.violin', 'strings.harp'],
        harmony: ['pad.crystal', 'strings.viola'],
        bass: 'strings.cello',
        texture: ['choir.sustain', 'pad.meditation']
      }
    };

    return instrumentSets[realm] || instrumentSets.meditation;
  }

  getRealmMelodyPatterns(realm) {
    const patterns = {
      meditation: {
        rhythms: [[2, 2, 4], [3, 3, 2], [4, 4]],
        intervals: [0, 2, 4, 7, 9],
        direction: 'ascending'
      },
      crystal: {
        rhythms: [[1, 1, 2], [2, 1, 1], [1, 2, 1]],
        intervals: [0, 4, 7, 11, 12],
        direction: 'alternating'
      },
      spirit: {
        rhythms: [[3, 3], [2, 2, 2], [4, 2]],
        intervals: [0, 3, 7, 10, 12],
        direction: 'descending'
      },
      forest: {
        rhythms: [[2, 1, 1], [1, 2, 1], [1, 1, 2]],
        intervals: [0, 2, 5, 7, 9],
        direction: 'random'
      },
      astral: {
        rhythms: [[4], [2, 2], [1, 1, 1, 1]],
        intervals: [0, 4, 8, 12, 16],
        direction: 'expanding'
      }
    };

    return patterns[realm] || patterns.meditation;
  }

  generateMelody(instrument, scale, rootNote, duration) {
    const notes = [];
    const availableNotes = this.getAvailableScaleNotes(instrument, scale, rootNote);

    if (availableNotes.length === 0) {
      console.warn(`No available notes for instrument ${instrument} in scale ${scale}`);
      return notes;
    }

    // Generate melody using available notes
    for (let i = 0; i < duration; i++) {
      const note = availableNotes[Math.floor(Math.random() * availableNotes.length)];
      notes.push({
        note,
        duration: 1,
        velocity: 0.8
      });
    }

    return notes;
  }

  getAvailableScaleNotes(instrument, scale, rootNote) {
    const scalePattern = this.scales[scale];
    const baseNote = this.noteToMidi(rootNote);
    
    return scalePattern
      .map(interval => this.midiToNote(baseNote + interval))
      .filter(note => isNoteAvailable(instrument, note));
  }
}

export default new MusicComposer();
