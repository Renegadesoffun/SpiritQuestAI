import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Only include files that need to be checked
const filesToConvert = [
    // Audio files
    ['app/audio/AudioEngine.js', 'app/audio/AudioEngine.mjs'],
    ['app/audio/WaveformGenerator.js', 'app/audio/WaveformGenerator.mjs'],
    ['app/audio/MusicComposer.js', 'app/audio/MusicComposer.mjs'],
    ['app/audio/expoAVWrapper.js', 'app/audio/expoAVWrapper.mjs'],
    
    // Script files that are imported in generateAllAssets.mjs
    ['scripts/generateGameAssets.js', 'scripts/generateGameAssets.mjs'],
    ['scripts/generateStoryAssets.js', 'scripts/generateStoryAssets.mjs'],
    ['scripts/generateLevelAssets.js', 'scripts/generateLevelAssets.mjs'],
    ['scripts/generateSplash.js', 'scripts/generateSplash.mjs'],
    ['scripts/generateAllSounds.js', 'scripts/generateAllSounds.mjs'],
    ['scripts/setupAssetDirectories.js', 'scripts/setupAssetDirectories.mjs'],
    ['scripts/generateAppIcons.js', 'scripts/generateAppIcons.mjs'],
    ['scripts/generateAssets.js', 'scripts/generateAssets.mjs']
];

async function fileExists(path) {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
}

async function convertToMJS() {
    console.log('\n=== Starting MJS Conversion Check ===\n');
    
    for (const [oldPath, newPath] of filesToConvert) {
        const fullOldPath = path.join(process.cwd(), oldPath);
        const fullNewPath = path.join(process.cwd(), newPath);
        
        console.log(`Checking ${oldPath}...`);
        
        const oldExists = await fileExists(fullOldPath);
        const newExists = await fileExists(fullNewPath);
        
        if (oldExists && !newExists) {
            console.log(`Found .js file: ${oldPath}`);
            try {
                const content = await fs.readFile(fullOldPath, 'utf8');
                await fs.mkdir(path.dirname(fullNewPath), { recursive: true });
                await fs.writeFile(fullNewPath, content);
                console.log(`✓ Created ${newPath}`);
                await fs.unlink(fullOldPath);
                console.log(`✓ Deleted ${oldPath}\n`);
            } catch (error) {
                console.error(`× Error converting ${oldPath}:`, error.message, '\n');
            }
        } else if (!oldExists && newExists) {
            console.log(`✓ Already converted: ${newPath} exists\n`);
        } else if (!oldExists && !newExists) {
            console.error(`× Missing both .js and .mjs versions of ${path.basename(oldPath)}\n`);
        }
    }
    
    console.log('=== Conversion Check Complete ===\n');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    convertToMJS().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
} 