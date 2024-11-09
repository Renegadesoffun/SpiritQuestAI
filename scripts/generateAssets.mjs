import fs from 'fs/promises';
import path from 'path';
import { createCanvas } from 'canvas';

export async function generateAssets() {
    console.log('\n=== Starting Asset Generation ===');
    try {
        const baseDir = path.join(process.cwd(), 'app/assets');
        const imageDir = path.join(baseDir, 'images');
        
        console.log('Creating directories at:');
        console.log('- Base dir:', baseDir);
        console.log('- Image dir:', imageDir);

        // Test file write permission with a simple text file
        try {
            await fs.writeFile(path.join(baseDir, 'test.txt'), 'test');
            console.log('✓ Write permission test passed');
            await fs.unlink(path.join(baseDir, 'test.txt'));
        } catch (err) {
            console.error('× Write permission test failed:', err);
            throw err;
        }

        // Create directories
        await fs.mkdir(imageDir, { recursive: true });
        console.log('✓ Directories created');

        const iconSizes = {
            'icon.png': 1024,
            'adaptive-icon.png': 1024,
            'favicon.png': 196,
            'splash.png': 2048
        };

        console.log('\nGenerating assets:');
        for (const [filename, size] of Object.entries(iconSizes)) {
            try {
                console.log(`\nProcessing ${filename}:`);
                console.log('1. Creating canvas...');
                const canvas = createCanvas(size, size);
                const ctx = canvas.getContext('2d');

                console.log('2. Drawing background...');
                ctx.fillStyle = '#2a1042';
                ctx.fillRect(0, 0, size, size);

                console.log('3. Creating buffer...');
                const buffer = canvas.toBuffer('image/png');
                
                console.log('4. Writing file...');
                const filePath = path.join(imageDir, filename);
                await fs.writeFile(filePath, buffer);
                
                console.log('5. Verifying file...');
                const stats = await fs.stat(filePath);
                console.log(`✓ Generated ${filename} (${stats.size} bytes)`);
            } catch (err) {
                console.error(`× Error generating ${filename}:`, err);
                throw err;
            }
        }

        console.log('\n=== Asset Generation Complete ===');
        return true;
    } catch (error) {
        console.error('\n× Asset Generation Failed:', error);
        return false;
    }
}
