import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export class FreesoundDownloader {
    constructor() {
        this.apiKey = process.env.FREESOUND_API_KEY;
        console.log('API Key loaded:', this.apiKey ? '✓ Present' : '✗ Missing');
        if (!this.apiKey) {
            throw new Error('Missing FREESOUND_API_KEY in .env file');
        }
        this.baseUrl = 'https://freesound.org/apiv2';
    }

    async searchAndDownload(query, outputPath, options = {}) {
        console.log('\n📥 Download Request:');
        console.log('Query:', query);
        console.log('Output:', outputPath);
        console.log('Options:', JSON.stringify(options, null, 2));
        
        // Ensure output directory exists
        const dir = path.dirname(outputPath);
        console.log('Creating directory:', dir);
        await fs.promises.mkdir(dir, { recursive: true });

        // Default search parameters
        const searchParams = new URLSearchParams({
            query,
            fields: 'id,name,previews',
            page_size: 1,
            filter: options.filter || 'duration:[1 TO 3]',
            sort: options.sort || 'rating_desc'
        });

        const searchUrl = `${this.baseUrl}/search/text/?${searchParams}`;
        console.log('\n🔍 Search URL:', searchUrl);

        try {
            console.log('Making API request...');
            const searchResponse = await fetch(searchUrl, {
                headers: {
                    'Authorization': `Token ${this.apiKey}`
                }
            });

            if (!searchResponse.ok) {
                const errorText = await searchResponse.text();
                throw new Error(`Search failed (${searchResponse.status}): ${errorText}`);
            }

            const searchData = await searchResponse.json();
            console.log('\nAPI Response:', JSON.stringify(searchData, null, 2));
            
            if (!searchData.results || searchData.results.length === 0) {
                throw new Error('No sounds found matching the query');
            }

            const sound = searchData.results[0];
            console.log(`\n✓ Found sound: ${sound.name} (ID: ${sound.id})`);

            const previewUrl = sound.previews['preview-hq-mp3'];
            if (!previewUrl) {
                throw new Error('No HQ preview available');
            }

            console.log('⬇️ Downloading from:', previewUrl);

            const soundResponse = await fetch(previewUrl);
            if (!soundResponse.ok) {
                throw new Error(`Download failed: ${soundResponse.statusText}`);
            }

            const buffer = await soundResponse.buffer();
            await fs.promises.writeFile(outputPath, buffer);

            console.log(`✅ Successfully downloaded to: ${outputPath}`);
            return true;

        } catch (error) {
            console.error('\n❌ Error:', error.message);
            throw error;
        }
    }
}