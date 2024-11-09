import { FreesoundDownloader } from '../app/audio/FreesoundDownloader.mjs';
import path from 'path';
import fs from 'fs';

console.log('Starting script - imports successful');

const SOUND_LIBRARY = {
    instruments: {
        strings: {
            violin: {
                notes: {
                    'C4': { 
                        query: 'violin single note C4', 
                        filter: 'tag:violin tag:single-note tag:classical duration:[1 TO 3] type:wav samplerate:44100'
                    },
                    'D4': { 
                        query: 'violin single note D4', 
                        filter: 'tag:violin tag:single-note tag:classical duration:[1 TO 3] type:wav samplerate:44100'
                    },
                    'E4': { query: 'violin E4 solo', filter: 'tag:violin tag:solo duration:[1 TO 3] type:wav' },
                    'G4': { query: 'violin G4 solo', filter: 'tag:violin tag:solo duration:[1 TO 3] type:wav' },
                    'A4': { query: 'violin A4 solo', filter: 'tag:violin tag:solo duration:[1 TO 3] type:wav' }
                },
                sustain: { 
                    query: 'violin sustain emotional', 
                    filter: 'tag:violin tag:sustain tag:classical duration:[3 TO 8] type:wav samplerate:44100'
                },
                pizzicato: { 
                    query: 'violin pizzicato classical', 
                    filter: 'tag:violin tag:pizzicato duration:[0.5 TO 2] type:wav samplerate:44100'
                }
            },
            cello: {
                notes: {
                    'C2': { 
                        query: 'cello single note C2', 
                        filter: 'tag:cello tag:single-note tag:classical duration:[1 TO 3] type:wav samplerate:44100'
                    },
                    'G2': { query: 'cello G2 solo', filter: 'tag:cello tag:solo duration:[1 TO 3] type:wav' },
                    'C3': { query: 'cello C3 solo', filter: 'tag:cello tag:solo duration:[1 TO 3] type:wav' }
                },
                sustain: { 
                    query: 'cello sustain classical', 
                    filter: 'tag:cello tag:sustain tag:classical duration:[3 TO 8] type:wav samplerate:44100'
                },
                pizzicato: { query: 'cello pizzicato', filter: 'tag:cello tag:pizzicato duration:[0.5 TO 2] type:wav' }
            },
            harp: {
                notes: {
                    'C4': { query: 'harp C4 single', filter: 'tag:harp duration:[1 TO 2] type:wav' },
                    'G4': { query: 'harp G4 single', filter: 'tag:harp duration:[1 TO 2] type:wav' }
                },
                glissando_up: { query: 'harp glissando ascending', filter: 'tag:harp tag:glissando duration:[2 TO 4] type:wav' },
                glissando_down: { query: 'harp glissando descending', filter: 'tag:harp tag:glissando duration:[2 TO 4] type:wav' },
                glissando: { 
                    query: 'harp glissando classical', 
                    filter: 'tag:harp tag:glissando duration:[2 TO 4] type:wav samplerate:44100'
                }
            }
        },
        piano: {
            grand: {
                notes: {
                    'C4': { 
                        query: 'piano note C4 grand', 
                        filter: 'tag:piano tag:grand tag:single-note duration:[1 TO 3] type:wav samplerate:44100'
                    },
                    'G4': { query: 'grand piano G4 single', filter: 'tag:piano tag:grand duration:[1 TO 3] type:wav' }
                },
                chords: {
                    'Cmaj': { query: 'grand piano C major chord', filter: 'tag:piano tag:chord duration:[2 TO 4] type:wav' },
                    'Gmaj': { query: 'grand piano G major chord', filter: 'tag:piano tag:chord duration:[2 TO 4] type:wav' }
                }
            },
            soft: {
                notes: {
                    'C4': { query: 'soft piano C4 single felt', filter: 'tag:piano tag:soft duration:[1 TO 3] type:wav' },
                    'G4': { query: 'soft piano G4 single felt', filter: 'tag:piano tag:soft duration:[1 TO 3] type:wav' }
                }
            }
        },
        choir: {
            sustain: {
                'ahh': { 
                    query: 'choir vocals sustain ahh', 
                    filter: 'tag:choir tag:vocals tag:sustain duration:[3 TO 8] type:wav samplerate:44100'
                },
                'mmm': { 
                    query: 'choir vocals sustain mmm', 
                    filter: 'tag:choir tag:vocals tag:sustain duration:[3 TO 8] type:wav samplerate:44100'
                },
                'ohh': { query: 'choir sustain ohh', filter: 'tag:choir tag:sustain duration:[3 TO 8] type:wav' }
            },
            staccato: {
                'ahh': { query: 'choir staccato ahh', filter: 'tag:choir tag:staccato duration:[0.5 TO 2] type:wav' }
            }
        },
        pad: {
            atmospheric: { 
                query: 'atmospheric pad synthesizer', 
                filter: 'tag:pad tag:atmospheric tag:ambient duration:[8 TO 20] type:wav samplerate:44100'
            },
            crystal: { 
                query: 'crystal shimmer pad', 
                filter: 'tag:pad tag:crystal tag:shimmer duration:[8 TO 20] type:wav samplerate:44100'
            },
            spirit: { 
                query: 'ethereal pad mystical', 
                filter: 'tag:pad tag:ethereal duration:[8 TO 20] type:wav' 
            }
        }
    },
    effects: {
        magical_chime: { 
            query: 'magical crystal bell chime', 
            filter: 'tag:magic tag:crystal tag:bell duration:[1 TO 3] type:wav'
        },
        crystal_collect: { 
            query: 'crystal collect powerup', 
            filter: 'tag:game tag:powerup tag:collect duration:[0.3 TO 1] type:wav'
        },
        spirit_whoosh: { 
            query: 'magical whoosh swoosh', 
            filter: 'tag:magic tag:whoosh tag:transition duration:[0.5 TO 2] type:wav'
        },
        achievement: { 
            query: 'achievement fanfare success game', 
            filter: 'tag:game tag:achievement duration:[1 TO 3]' 
        },
        meditation_bell: { 
            query: 'tibetan singing bowl pure', 
            filter: 'tag:meditation tag:bowl duration:[2 TO 4]' 
        }
    },
    ambient: {
        meditation: { 
            query: 'meditation ambient peaceful', 
            filter: 'tag:meditation tag:ambient tag:peaceful duration:[60 TO 180] type:wav'
        },
        crystal_cave: { 
            query: 'crystal cave ambient atmosphere', 
            filter: 'tag:cave tag:ambient tag:crystal duration:[60 TO 180] type:wav'
        },
        spirit_realm: { 
            query: 'mystical realm atmospheric', 
            filter: 'tag:mystical tag:ambient tag:atmospheric duration:[60 TO 180] type:wav'
        },
        forest: { 
            query: 'magical forest atmosphere fantasy', 
            filter: 'tag:ambient tag:fantasy duration:[60 TO 180]' 
        }
    },
    music: {
        menu: { 
            query: 'peaceful mystical theme loop', 
            filter: 'tag:game tag:theme tag:peaceful duration:[30 TO 120] type:wav'
        },
        map: { 
            query: 'fantasy adventure theme loop', 
            filter: 'tag:game tag:adventure tag:fantasy duration:[30 TO 120] type:wav'
        },
        boss: { 
            query: 'epic boss battle theme', 
            filter: 'tag:game tag:epic tag:battle duration:[60 TO 180] type:wav'
        }
    }
};

async function cleanupExistingFiles(baseDir) {
    console.log('Cleaning up existing sound files...');
    for (const category of Object.keys(SOUND_LIBRARY)) {
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
        if (config.notes || config.sustain || config.chords || typeof config === 'object' && !config.query) {
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
                        await downloader.searchAndDownload(
                            query,
                            filePath,
                            {
                                filter: filter,
                                sort: 'rating_desc',
                                fields: 'id,name,previews'
                            }
                        );
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
    
    if (category === 'ambient' || category === 'effects') {
        queries.push(
            primaryQuery.replace('atmospheric', 'ambient'),
            primaryQuery.split(' ').slice(0, 2).join(' '),
            primaryQuery + ' sample'
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

async function generateMusicLibrary() {
    console.log('🎵 Initializing music library generation...');
    
    let downloader;
    try {
        downloader = new FreesoundDownloader();
        console.log('✅ FreesoundDownloader initialized');
    } catch (error) {
        console.error('❌ Failed to initialize FreesoundDownloader:', error);
        return;
    }

    const baseDir = path.join(process.cwd(), 'app/assets/sounds');
    console.log('📂 Base directory:', baseDir);

    await cleanupExistingFiles(baseDir);

    for (const category of Object.keys(SOUND_LIBRARY)) {
        const dir = path.join(baseDir, category);
        console.log(`Creating directory: ${dir}`);
        await fs.promises.mkdir(dir, { recursive: true });
    }

    for (const [category, items] of Object.entries(SOUND_LIBRARY)) {
        console.log(`\nProcessing ${category}...`);
        const categoryDir = path.join(baseDir, category);
        await downloadSoundRecursively(category, items, categoryDir, downloader);
    }

    console.log('\n✨ Music library generation complete!');
}

generateMusicLibrary().catch(error => {
    console.error('Failed to generate music library:', error);
    process.exit(1);
});

export { generateMusicLibrary }; 