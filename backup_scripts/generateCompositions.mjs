import { WaveformGenerator } from '../app/audio/WaveformGenerator.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function generateCompositions() {
    try {
        console.log('Generating ambient compositions...');
        const outputDir = path.join(__dirname, '../app/assets/sounds/ambient');

        const compositions = {
            'meditation': {
                baseFreq: 432,  // Healing frequency
                duration: 60,   // 1 minute
                layers: ['pad', 'choir', 'bells']
            },
            'crystal_cave': {
                baseFreq: 528,  // Transformation frequency
                duration: 45,
                layers: ['crystal', 'drone', 'shimmer']
            },
            'spirit_realm': {
                baseFreq: 396,  // Liberation frequency
                duration: 60,
                layers: ['cosmic', 'voices', 'wind']
            },
            'forest_atmosphere': {
                baseFreq: 417,  // Facilitation of change
                duration: 45,
                layers: ['nature', 'breeze', 'chimes']
            }
        };

        for (const [name, config] of Object.entries(compositions)) {
            await WaveformGenerator.generateAmbientComposition(
                path.join(outputDir, `${name}.wav`),
                config
            );
            console.log(`Generated ${name} composition`);
        }

        return true;
    } catch (error) {
        console.error('Error generating compositions:', error);
        throw error;
    }
} 