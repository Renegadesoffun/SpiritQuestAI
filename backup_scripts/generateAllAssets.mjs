import { generateGameAssets } from './generateGameAssets.mjs';
import { generateStoryAssets } from './generateStoryAssets.mjs';
import { generateLevelBackgrounds } from './generateLevelAssets.mjs';
import { generateSplash } from './generateSplash.mjs';
import { generateAllSounds } from './generateAllSounds.mjs';
import { createDirectoryStructure } from './setupAssetDirectories.mjs';
import fs from 'fs';
import path from 'path';
import { checkEnvironment } from './checkEnvironment.mjs';
import { fileURLToPath } from 'url';

console.log('Script started - generateAllAssets.mjs');

async function verifyOrGenerateAsset(assetPath, generatorFn) {
    try {
        await fs.promises.access(assetPath);
        console.log(`Asset exists: ${assetPath}`);
    } catch {
        console.log(`Generating asset: ${assetPath}`);
        await generatorFn();
    }
}

async function generateAllAssets() {
    console.log('generateAllAssets function called');
    try {
        // Step 1: Check environment
        console.log('\nStep 1: Checking environment...');
        await checkEnvironment();

        // Step 2: Create directories
        console.log('\nStep 2: Creating directories...');
        const requiredDirs = [
            'app/assets/images',
            'app/assets/images/game',
            'app/assets/images/story',
            'app/assets/images/backgrounds',
            'app/assets/sounds',
            'app/assets/sounds/ambient',
            'app/assets/sounds/effects',
            'app/assets/sounds/instruments',
            'app/assets/sounds/instruments/strings',
            'app/assets/sounds/instruments/piano',
            'app/assets/sounds/instruments/pad',
            'app/assets/sounds/instruments/choir'
        ];

        for (const dir of requiredDirs) {
            const fullPath = path.join(process.cwd(), dir);
            console.log(`Checking directory: ${fullPath}`);
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
                console.log(`Created directory: ${dir}`);
            }
            console.log(`✓ Verified directory: ${dir}`);
        }

        // Step 3: Generate assets
        console.log('\nStep 3: Generating assets...');
        
        // Generate story assets
        console.log('\nGenerating story assets...');
        const storyAssets = await generateStoryAssets();
        if (!storyAssets) {
            throw new Error('Failed to generate story assets');
        }
        
        // Generate game assets
        console.log('\nGenerating game assets...');
        const gameAssets = await generateGameAssets();
        if (!gameAssets) {
            throw new Error('Failed to generate game assets');
        }
        
        // Generate level backgrounds
        console.log('\nGenerating level backgrounds...');
        const levelBgs = await generateLevelBackgrounds();
        if (!levelBgs) {
            throw new Error('Failed to generate level backgrounds');
        }
        
        // Generate splash screen
        console.log('\nGenerating splash screen...');
        const splash = await generateSplash();
        if (!splash) {
            throw new Error('Failed to generate splash screen');
        }
        
        // Generate sounds
        console.log('\nGenerating sound assets...');
        const sounds = await generateAllSounds();
        if (!sounds) {
            throw new Error('Failed to generate sound assets');
        }

        console.log('\n=== Asset Generation Complete ===');
        return true;

    } catch (error) {
        console.error('\n=== Asset Generation Failed ===');
        console.error('Error details:', error);
        throw error;
    }
}

// Immediately execute when this is the main module
if (import.meta.url.startsWith('file:')) {
    const modulePath = fileURLToPath(import.meta.url);
    if (process.argv[1] === modulePath) {
        console.log('Running as main module...');
        generateAllAssets().catch(error => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
    }
}

export { generateAllAssets };
