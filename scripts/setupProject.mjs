import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupProject() {
    const filesToRename = [
        ['app/audio/AudioEngine.js', 'app/audio/AudioEngine.mjs'],
        ['app/audio/WaveformGenerator.js', 'app/audio/WaveformGenerator.mjs'],
        ['app/audio/audioAssets.js', 'app/audio/audioAssets.mjs'],
        ['scripts/generateCompositions.js', 'scripts/generateCompositions.mjs']
    ];

    for (const [oldPath, newPath] of filesToRename) {
        try {
            const fullOldPath = path.join(__dirname, '..', oldPath);
            const fullNewPath = path.join(__dirname, '..', newPath);
            
            // Check if old file exists and new file doesn't
            const oldExists = await fs.access(fullOldPath).then(() => true).catch(() => false);
            const newExists = await fs.access(fullNewPath).then(() => true).catch(() => false);
            
            if (oldExists && !newExists) {
                await fs.rename(fullOldPath, fullNewPath);
                console.log(`Renamed ${oldPath} to ${newPath}`);
            }
        } catch (error) {
            console.log(`Note: ${oldPath} already processed or doesn't exist`);
        }
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    setupProject().catch(console.error);
} 