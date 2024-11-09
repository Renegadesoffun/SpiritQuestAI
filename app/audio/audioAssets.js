import { Asset } from 'expo-asset';

export const audioAssets = {
  ambient: {
    meditation: require('../assets/sounds/ambient/meditation.wav'),
    crystal_cave: require('../assets/sounds/ambient/crystal_cave.wav'),
    spirit_realm: require('../assets/sounds/ambient/spirit_realm.wav'),
    forest_atmosphere: require('../assets/sounds/ambient/forest_atmosphere.wav')
  },
  effects: {
    achievement: require('../../assets/sounds/effects/achievement.wav'),
    collect_crystal: require('../../assets/sounds/effects/collect_crystal.wav'),
    magical_chime: require('../../assets/sounds/effects/magical_chime.wav'),
    spirit_whoosh: require('../../assets/sounds/effects/spirit_whoosh.wav')
  },
  instruments: {
    choir: {
      ahh: require('../../assets/sounds/instruments/choir/choir_ahh.wav'),
      mmm: require('../../assets/sounds/instruments/choir/choir_mmm.wav'),
      ohh: require('../../assets/sounds/instruments/choir/choir_ohh.wav')
    },
    harp: {
      gliss_down: require('../../assets/sounds/instruments/harp/harp_gliss_down.wav'),
      gliss_up: require('../../assets/sounds/instruments/harp/harp_gliss_up.wav'),
      single_note: require('../../assets/sounds/instruments/harp/harp_single_note.wav')
    },
    pad: {
      atmospheric: require('../../assets/sounds/instruments/pad/atmospheric_pad_C.wav'),
      crystal: require('../../assets/sounds/instruments/pad/crystal_pad.wav'),
      spirit: require('../../assets/sounds/instruments/pad/spirit_pad.wav')
    },
    piano: {
      C4: require('../../assets/sounds/instruments/piano/grand_piano_C4.wav'),
      G4: require('../../assets/sounds/instruments/piano/grand_piano_G4.wav'),
      chord_Cmaj: require('../../assets/sounds/instruments/piano/grand_piano_chord_Cmaj.wav')
    },
    strings: {
      cello_C3: require('../../assets/sounds/instruments/strings/cello_C3.wav'),
      viola_G3: require('../../assets/sounds/instruments/strings/viola_G3.wav'),
      violin_C4: require('../../assets/sounds/instruments/strings/violin_C4.wav'),
      violin_G4: require('../../assets/sounds/instruments/strings/violin_G4.wav')
    }
  }
};

export const preloadAudioAssets = async () => {
  try {
    const assets = [];
    
    // Helper function to recursively collect assets
    const collectAssets = (obj) => {
      Object.values(obj).forEach(value => {
        if (typeof value === 'number') { // Asset requires return numbers
          assets.push(value);
        } else if (typeof value === 'object') {
          collectAssets(value);
        }
      });
    };

    collectAssets(audioAssets);
    await Asset.loadAsync(assets);
    console.log('✓ Audio assets preloaded successfully');
    return true;
  } catch (err) {
    console.error('× Failed to preload sounds:', err);
    return false;
  }
};
