import WavPlayer from 'node-wav-player';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function verifySound(filepath) {
  try {
    await WavPlayer.play({
      path: filepath,
    });
    console.log(`✓ Successfully played ${filepath}`);
    return true;
  } catch (error) {
    console.error(`× Failed to play ${filepath}:`, error);
    return false;
  }
}

async function verifyAllSounds() {
  const soundsDir = join(__dirname, '../app/assets/sounds');
  
  const testFiles = [
    'ambient/meditation.wav',
    'ambient/crystal.wav',
    'ambient/spirit.wav',
    'ambient/forest.wav'
  ];

  for (const file of testFiles) {
    await verifySound(join(soundsDir, file));
    // Wait between sounds
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

verifyAllSounds().catch(console.error); 