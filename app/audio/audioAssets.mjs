import expoAsset from 'expo-asset';
const { Asset } = expoAsset;

export const audioAssets = {
    ambient: {
        meditation: require('../assets/sounds/ambient/meditation.wav'),
        crystal_cave: require('../assets/sounds/ambient/crystal_cave.wav'),
        spirit_realm: require('../assets/sounds/ambient/spirit_realm.wav'),
        forest_atmosphere: require('../assets/sounds/ambient/forest_atmosphere.wav')
    },
    effects: {
        achievement: require('../assets/sounds/effects/achievement.wav'),
        collect_crystal: require('../assets/sounds/effects/collect_crystal.wav'),
        magical_chime: require('../assets/sounds/effects/magical_chime.wav'),
        spirit_whoosh: require('../assets/sounds/effects/spirit_whoosh.wav')
    },
    instruments: {
        piano: {
            grand_piano_C4: require('../assets/sounds/instruments/piano/grand_piano_C4.wav'),
            grand_piano_G4: require('../assets/sounds/instruments/piano/grand_piano_G4.wav'),
            grand_piano_chord_Cmaj: require('../assets/sounds/instruments/piano/grand_piano_chord_Cmaj.wav')
        },
        strings: {
            violin_C4: require('../assets/sounds/instruments/strings/violin_C4.wav'),
            violin_G4: require('../assets/sounds/instruments/strings/violin_G4.wav'),
            viola_G3: require('../assets/sounds/instruments/strings/viola_G3.wav'),
            cello_C3: require('../assets/sounds/instruments/strings/cello_C3.wav')
        }
    }
};

export async function preloadAudioAssets() {
    try {
        const assets = [];
        
        const collectAssets = (obj) => {
            Object.values(obj).forEach(value => {
                if (typeof value === 'number') {
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
} 