import { promises as fs } from 'fs';
import fs_sync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function checkEnvironment() {
    console.log('\n🔍 Checking environment...');
    console.log('Node.js version:', process.version);
    console.log('Current directory:', process.cwd());

    // Check directories
    console.log('\nChecking directories:');
    const requiredDirs = [
        'scripts/drawing',
        'app/assets/images',
        'app/assets/sounds'
    ];

    for (const dir of requiredDirs) {
        const fullPath = path.join(process.cwd(), dir);
        if (fs_sync.existsSync(fullPath)) {
            console.log(`✓ ${dir} exists`);
        } else {
            console.log(`Creating directory: ${dir}`);
            fs_sync.mkdirSync(fullPath, { recursive: true });
        }
    }

    // Check files
    console.log('\nChecking files:');
    const requiredFiles = [
        'scripts/drawing/characters.mjs',
        'scripts/drawing/elements.mjs',
        'scripts/drawing/helpers.mjs'
    ];

    for (const file of requiredFiles) {
        const fullPath = path.join(process.cwd(), file);
        if (fs_sync.existsSync(fullPath)) {
            console.log(`✓ Found: ${file}`);
        } else {
            throw new Error(`Missing required file: ${file}`);
        }
    }

    console.log('✓ Environment check passed');
    return true;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    checkEnvironment().catch(console.error);
} 