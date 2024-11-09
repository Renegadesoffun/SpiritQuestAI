import { FreesoundDownloader } from '../app/audio/FreesoundDownloader.mjs';
import path from 'path';

async function testDownload() {
    try {
        console.log('🎵 Testing Freesound Downloader...');
        const downloader = new FreesoundDownloader();
        
        const testFile = path.join(process.cwd(), 'app/assets/sounds/test/test_bell.mp3');
        
        await downloader.searchAndDownload(
            'meditation bell temple',
            testFile,
            { 
                filter: 'duration:[1 TO 3]',
                sort: 'rating_desc'
            }
        );
        
        console.log('\n✨ Test complete!');
    } catch (error) {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    }
}

testDownload(); 