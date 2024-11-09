import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Audio } from '../app/audio/expoAVWrapper.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function verifySoundSystem() {
  try {
    console.log('Verifying sound system...');
    
    // Test basic initialization
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      shouldDuckAndroid: true,
    });
    
    const soundsDir = join(__dirname, '../app/assets/sounds');
    
    // Test ambient sounds
    const ambientSounds = [
      'ambient/meditation.wav',
      'ambient/crystal_cave.wav',
      'ambient/spirit_realm.wav',
      'ambient/forest_atmosphere.wav'
    ];

    for (const sound of ambientSounds) {
      const filepath = join(soundsDir, sound);
      console.log(`Testing ambient sound: ${sound}`);
      try {
        await Audio.Sound.createAsync({ uri: `file://${filepath}` });
        console.log(`✓ Successfully loaded ${sound}`);
      } catch (error) {
        console.error(`× Failed to load ${sound}:`, error);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Sound system verification complete!');
  } catch (error) {
    console.error('Sound system verification failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  verifySoundSystem().catch(console.error);
}
