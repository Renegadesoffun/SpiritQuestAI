import { WaveformGenerator } from '../app/audio/WaveformGenerator.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateAllCompositions() {
  const outputDir = join(__dirname, '../app/assets/sounds');
  
  try {
    // Create output directories
    await fs.mkdir(join(outputDir, 'ambient'), { recursive: true });
    await fs.mkdir(join(outputDir, 'instruments/pad'), { recursive: true });
    await fs.mkdir(join(outputDir, 'instruments/choir'), { recursive: true });
    await fs.mkdir(join(outputDir, 'instruments/strings'), { recursive: true });

    // Generate meditation realm sounds
    await WaveformGenerator.composeMeditation(
      join(outputDir, 'ambient/meditation.wav')
    );

    // Generate other realm sounds
    const realms = ['crystal', 'spirit', 'forest'];
    for (const realm of realms) {
      console.log(`Generating ${realm} realm sounds...`);
      await WaveformGenerator[`compose${realm.charAt(0).toUpperCase() + realm.slice(1)}`](
        join(outputDir, `ambient/${realm}.wav`)
      );
    }

    console.log('✓ All compositions generated successfully!');
  } catch (error) {
    console.error('× Failed to generate compositions:', error);
  }
}

generateAllCompositions().catch(console.error); 