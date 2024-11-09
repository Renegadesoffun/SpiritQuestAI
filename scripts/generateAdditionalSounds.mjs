import { FreesoundDownloader } from '../app/audio/FreesoundDownloader.mjs';
import path from 'path';
import fs from 'fs';

console.log('Starting additional sounds script - imports successful');

const ADDITIONAL_SOUNDS = {
    instruments: {
        woodwinds: {
            flute: {
                notes: {
                    'C4': { 
                        query: 'flute C4 note classical', 
                        filter: 'tag:flute tag:classical duration:[1 TO 3] type:wav samplerate:44100'
                    },
                    'D4': { 
                        query: 'flute D4 note classical', 
                        filter: 'tag:flute tag:classical duration:[1 TO 3] type:wav samplerate:44100'
                    },
                    'E4': { 
                        query: 'flute E4 note classical', 
                        filter: 'tag:flute tag:classical duration:[1 TO 3] type:wav samplerate:44100'
                    }
                },
                sustain: { 
                    query: 'flute sustain peaceful', 
                    filter: 'tag:flute tag:sustain duration:[2 TO 4] type:wav samplerate:44100'
                }
            },
            clarinet: {
                notes: {
                    'C4': { 
                        query: 'clarinet C4 note classical', 
                        filter: 'tag:clarinet tag:classical duration:[1 TO 3] type:wav samplerate:44100'
                    },
                    'G4': { 
                        query: 'clarinet G4 note classical', 
                        filter: 'tag:clarinet tag:classical duration:[1 TO 3] type:wav samplerate:44100'
                    }
                },
                sustain: { 
                    query: 'clarinet sustain soft', 
                    filter: 'tag:clarinet tag:sustain duration:[2 TO 4] type:wav samplerate:44100'
                }
            }
        },
        strings: {
            viola: {
                notes: {
                    'C3': { 
                        query: 'viola C3 note classical', 
                        filter: 'tag:viola tag:classical duration:[1 TO 3] type:wav samplerate:44100'
                    },
                    'G3': { 
                        query: 'viola G3 note classical', 
                        filter: 'tag:viola tag:classical duration:[1 TO 3] type:wav samplerate:44100'
                    }
                },
                sustain: { 
                    query: 'viola sustain classical', 
                    filter: 'tag:viola tag:sustain duration:[2 TO 4] type:wav samplerate:44100'
                },
                pizzicato: { 
                    query: 'viola pizzicato classical', 
                    filter: 'tag:viola tag:pizzicato duration:[0.5 TO 2] type:wav samplerate:44100'
                }
            }
        },
        pad: {
            forest: { 
                query: 'forest ambient pad mystical', 
                filter: 'tag:pad tag:ambient tag:forest duration:[8 TO 20] type:wav samplerate:44100'
            },
            meditation: { 
                query: 'meditation pad peaceful', 
                filter: 'tag:pad tag:meditation tag:peaceful duration:[8 TO 20] type:wav samplerate:44100'
            }
        }
    },
    effects: {
        nature: {
            stream: { 
                query: 'water stream peaceful nature', 
                filter: 'tag:water tag:nature duration:[4 TO 8] type:wav samplerate:44100'
            },
            birds: { 
                query: 'forest birds morning nature', 
                filter: 'tag:birds tag:nature duration:[3 TO 6] type:wav samplerate:44100'
            }
        },
        magic: {
            crystal_hum: { 
                query: 'crystal resonance magical', 
                filter: 'tag:crystal tag:magic duration:[2 TO 4] type:wav samplerate:44100'
            },
            spirit_wind: { 
                query: 'spirit wind mystical', 
                filter: 'tag:wind tag:mystical duration:[2 TO 4] type:wav samplerate:44100'
            }
        }
    }
};

async function cleanupExistingFiles(baseDir) {
    console.log('Cleaning up existing additional sound files...');
    for (const category of Object.keys(ADDITIONAL_SOUNDS)) {
        const categoryPath = path.join(baseDir, category);
        try {
            await fs.promises.rm(categoryPath, { recursive: true, force: true });
            console.log(`✓ Cleaned up ${category} directory`);
        } catch (error) {
            console.warn(`⚠️ Failed to cleanup ${category}: ${error.message}`);
        }
    }
}

async function downloadSoundRecursively(category, items, baseDir, downloader) {
    for (const [name, config] of Object.entries(items)) {
        if (config.notes || config.sustain || typeof config === 'object' && !config.query) {
            const subDir = path.join(baseDir, name);
            console.log(`Creating directory: ${subDir}`);
            await fs.promises.mkdir(subDir, { recursive: true });
            
            for (const [subName, subConfig] of Object.entries(config)) {
                if (typeof subConfig === 'object') {
                    await downloadSoundRecursively(category, { [subName]: subConfig }, subDir, downloader);
                }
            }
        } 
        else if (config.query) {
            const fileName = `${name}.mp3`;
            const filePath = path.join(baseDir, fileName);
            
            console.log(`\nDownloading: ${fileName}`);
            
            const queries = generateFallbackQueries(config.query, name, category);
            const filters = generateFallbackFilters(config.filter);
            
            let downloaded = false;
            for (let i = 0; i < queries.length && !downloaded; i++) {
                const query = queries[i];
                for (let j = 0; j < filters.length && !downloaded; j++) {
                    const filter = filters[j];
                    
                    console.log(`Query attempt ${i+1}/${queries.length}, filter ${j+1}/${filters.length}:`);
                    console.log(`Query: "${query}"`);
                    console.log(`Filter: ${filter}`);
                    
                    try {
                        await downloader.searchAndDownload(query, filePath, {
                            filter: filter,
                            sort: 'rating_desc',
                            fields: 'id,name,previews'
                        });
                        console.log(`✅ Successfully downloaded ${fileName}`);
                        downloaded = true;
                    } catch (error) {
                        console.warn(`⚠️ Attempt failed: ${error.message}`);
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }
            }
            
            if (!downloaded) {
                console.error(`❌ Failed to download ${fileName} after all attempts`);
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

function generateFallbackQueries(primaryQuery, name, category) {
    const queries = [primaryQuery];
    
    if (name.match(/^[A-G][#b]?\d$/)) {
        const [note, octave] = [name.slice(0, -1), name.slice(-1)];
        queries.push(
            `${note} note octave ${octave}`,
            `${note}${octave} note sample`,
            `${note} ${octave} single note`,
            `${category} ${note}${octave}`,
            `${note} musical note`
        );
    }
    
    if (category === 'instruments') {
        queries.push(
            primaryQuery.replace('single note', 'sample'),
            primaryQuery.replace('classical', 'acoustic'),
            primaryQuery.split(' ').slice(0, 2).join(' ')
        );
    }
    
    return [...new Set(queries)];
}

function generateFallbackFilters(primaryFilter) {
    if (!primaryFilter) return [''];
    
    const filters = [primaryFilter];
    
    if (primaryFilter.includes('type:wav')) {
        filters.push(primaryFilter.replace('type:wav', ''));
    }
    
    if (primaryFilter.includes('samplerate:44100')) {
        filters.push(primaryFilter.replace('samplerate:44100', ''));
    }
    
    const tags = primaryFilter.match(/tag:\w+/g) || [];
    if (tags.length > 1) {
        filters.push(tags.slice(0, Math.ceil(tags.length/2)).join(' '));
    }
    
    const durationMatch = primaryFilter.match(/duration:\[\d+ TO \d+\]/);
    if (durationMatch) {
        filters.push(durationMatch[0]);
    }
    
    return [...new Set(filters)];
}

async function generateAdditionalSounds() {
    const baseDir = path.join(process.cwd(), 'app', 'assets', 'sounds');
    const downloader = new FreesoundDownloader();
    
    try {
        await cleanupExistingFiles(baseDir);
        
        for (const [category, items] of Object.entries(ADDITIONAL_SOUNDS)) {
            const categoryDir = path.join(baseDir, category);
            await fs.promises.mkdir(categoryDir, { recursive: true });
            await downloadSoundRecursively(category, items, categoryDir, downloader);
        }
        
        console.log('\n✨ Additional sounds generation complete!');
    } catch (error) {
        console.error('❌ Error generating additional sounds:', error);
    }
}

generateAdditionalSounds();