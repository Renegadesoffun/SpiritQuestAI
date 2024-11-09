import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { WaveformGenerator } from '../app/audio/WaveformGenerator.mjs';
import { generateCompositions } from './generateCompositions.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function generateAllSounds() {
    try {
        console.log('🎵 Starting sound generation...');
        
        const outputDir = join(__dirname, '../app/assets/sounds');
        
        // Generate instrument sounds
        console.log('Generating instrument sounds...');
        await WaveformGenerator.generateInstrumentSounds(outputDir);
        
        // Generate effect sounds
        console.log('Generating effect sounds...');
        await WaveformGenerator.generateEffectSounds(outputDir);
        
        // Generate ambient compositions
        console.log('Generating ambient compositions...');
        await generateCompositions();
        
        console.log('✨ Sound generation complete!');
        return true;
    } catch (error) {
        console.error('Error generating sounds:', error);
        return false;
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    generateAllSounds().catch(console.error);
}






