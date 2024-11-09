import { FreesoundDownloader } from '../app/audio/FreesoundDownloader.mjs';
import path from 'path';

async function testFreesoundConnection() {
    try {
        console.log('Testing Freesound API connection...');
        const downloader = new FreesoundDownloader();
        
        // Test directory
        const testDir = path.join(process.cwd(), 'app/assets/sounds/test');
        const testFile = path.join(testDir, 'test_sound.mp3');
        
        console.log('Attempting to download a test sound...');
        await downloader.searchAndDownload(
            'meditation bell',  // Simple search query
            testFile,
            { 
                fields: 'id,name,previews',
                page_size: 1,
                filter: 'duration:[1 TO 3]' 
            }
        );
        
        console.log('✅ Test successful! Check the test sound at:', testFile);
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\nTroubleshooting steps:');
        console.log('1. Verify your API key at https://freesound.org/apiv2/apply/');
        console.log('2. Make sure API KEY is enabled for your application');
        console.log('3. Check your internet connection');
        console.log('4. Verify the .env file contains FREESOUND_API_KEY');
    }
}

// Run the test
testFreesoundConnection(); 