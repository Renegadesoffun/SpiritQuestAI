import { FreesoundDownloader } from '../app/audio/FreesoundDownloader.mjs';
import path from 'path';
import fs from 'fs';

console.log('Starting missing sounds download script...');

// Add rate limiting
const RATE_LIMIT = {
  requestsPerMinute: 50,
  requestCount: 0,
  lastReset: Date.now()
};

async function waitForRateLimit() {
  const now = Date.now();
  if (now - RATE_LIMIT.lastReset > 60000) {
    RATE_LIMIT.requestCount = 0;
    RATE_LIMIT.lastReset = now;
  }
  
  if (RATE_LIMIT.requestCount >= RATE_LIMIT.requestsPerMinute) {
    console.log('Rate limit reached, waiting 60 seconds...');
    await new Promise(resolve => setTimeout(resolve, 60000));
    RATE_LIMIT.requestCount = 0;
    RATE_LIMIT.lastReset = Date.now();
  }
  
  RATE_LIMIT.requestCount++;
}

// Update the MISSING_SOUNDS config with better queries
const MISSING_SOUNDS = {
  instruments: {
    strings: {
      violin: {
        notes: {
          'A4': { 
            query: 'violin A4 single note', 
            filter: 'tag:violin duration:[0.5 TO 2]'
          },
          'C4': { 
            query: 'violin C4 single note', 
            filter: 'tag:violin duration:[0.5 TO 2]'
          },
          'D4': { 
            query: 'violin D4 single note', 
            filter: 'tag:violin duration:[0.5 TO 2]'
          },
          'E4': { 
            query: 'violin E4 single note', 
            filter: 'tag:violin duration:[0.5 TO 2]'
          },
          'G4': { 
            query: 'violin G4 single note', 
            filter: 'tag:violin duration:[0.5 TO 2]'
          }
        },
        pizzicato: {
          query: 'violin pizzicato single', 
          filter: 'tag:violin tag:pizzicato duration:[0.5 TO 2]'
        },
        sustain: {
          query: 'violin sustain', 
          filter: 'tag:violin tag:sustain duration:[1 TO 3]'
        }
      },
      cello: {
        notes: {
          'C2': { 
            query: 'cello C2 note classical solo', 
            filter: 'tag:cello tag:classical duration:[1 TO 2] type:wav samplerate:44100'
          },
          'C3': { 
            query: 'cello C3 note classical solo', 
            filter: 'tag:cello tag:classical duration:[1 TO 2] type:wav samplerate:44100'
          },
          'G2': { 
            query: 'cello G2 note classical solo', 
            filter: 'tag:cello tag:classical duration:[1 TO 2] type:wav samplerate:44100'
          }
        },
        pizzicato: { 
          query: 'cello pizzicato classical', 
          filter: 'tag:cello tag:pizzicato duration:[1 TO 2] type:wav samplerate:44100'
        },
        sustain: { 
          query: 'cello sustain classical', 
          filter: 'tag:cello tag:sustain duration:[2 TO 4] type:wav samplerate:44100'
        }
      }
    },
    piano: {
      grand: {
        notes: {
          'C4': { 
            query: 'piano C4 note classical', 
            filter: 'tag:piano tag:classical duration:[1 TO 2] type:wav samplerate:44100'
          },
          'G4': { 
            query: 'piano G4 note classical', 
            filter: 'tag:piano tag:classical duration:[1 TO 2] type:wav samplerate:44100'
          }
        },
        chords: {
          'Cmaj': { 
            query: 'piano C major chord classical', 
            filter: 'tag:piano tag:chord duration:[1 TO 2] type:wav samplerate:44100'
          },
          'Gmaj': { 
            query: 'piano G major chord classical', 
            filter: 'tag:piano tag:chord duration:[1 TO 2] type:wav samplerate:44100'
          }
        }
      }
    }
  },
  effects: {
    achievement: {
      query: 'achievement success jingle', 
      filter: 'tag:game tag:success duration:[0.5 TO 2]'
    },
    magical_chime: {
      query: 'magic chime bell', 
      filter: 'tag:magic tag:chime duration:[0.5 TO 2]'
    },
    meditation_bell: {
      query: 'meditation bell tibetan', 
      filter: 'tag:meditation tag:bell duration:[1 TO 3]'
    },
    spirit_whoosh: {
      query: 'spirit whoosh swoosh', 
      filter: 'tag:whoosh duration:[0.5 TO 2]'
    }
  }
};

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2 seconds

function generateFallbackQueries(originalQuery) {
  const queries = [originalQuery];
  
  // Remove specific terms to make more general queries
  const terms = originalQuery.split(' ');
  if (terms.length > 2) {
    queries.push(terms.slice(0, 2).join(' ')); // First two terms only
    queries.push(terms[0]); // Just the main term
  }
  
  return queries;
}

function generateFallbackFilters(originalFilter) {
  const filters = [originalFilter];
  
  // Gradually remove constraints
  if (originalFilter.includes('samplerate:44100')) {
    filters.push(originalFilter.replace('samplerate:44100', ''));
  }
  
  if (originalFilter.includes('type:wav')) {
    filters.push(originalFilter.replace('type:wav', ''));
  }
  
  // Reduce duration constraints
  const durationMatch = originalFilter.match(/duration:\[(\d+) TO (\d+)\]/);
  if (durationMatch) {
    const [_, min, max] = durationMatch;
    filters.push(originalFilter.replace(
      /duration:\[\d+ TO \d+\]/,
      `duration:[${min} TO ${parseInt(max) + 2}]`
    ));
    filters.push(originalFilter.replace(/duration:\[\d+ TO \d+\]/, ''));
  }
  
  return filters;
}

async function retryDownload(downloader, query, filter, outputPath, attempt = 1) {
  try {
    return await downloader.searchAndDownload(query, outputPath, {
      filter: filter,
      sort: 'rating_desc',
      fields: 'id,name,previews'
    });
  } catch (error) {
    if (attempt >= RETRY_ATTEMPTS) {
      throw error;
    }
    
    console.log(`Retry ${attempt}/${RETRY_ATTEMPTS} for ${outputPath}`);
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    
    // Try fallback queries and filters
    const queries = generateFallbackQueries(query);
    const filters = generateFallbackFilters(filter);
    
    for (const fallbackQuery of queries) {
      for (const fallbackFilter of filters) {
        try {
          console.log(`Trying fallback: query="${fallbackQuery}", filter="${fallbackFilter}"`);
          return await downloader.searchAndDownload(fallbackQuery, outputPath, {
            filter: fallbackFilter,
            sort: 'rating_desc',
            fields: 'id,name,previews'
          });
        } catch (retryError) {
          continue;
        }
      }
    }
    
    return retryDownload(downloader, query, filter, outputPath, attempt + 1);
  }
}

async function downloadMissingSounds() {
  const baseDir = path.join(process.cwd(), 'app/assets/sounds');
  const downloader = new FreesoundDownloader();
  
  try {
    console.log('\n📥 Starting download of missing sounds...');
    
    for (const [category, items] of Object.entries(MISSING_SOUNDS)) {
      const categoryDir = path.join(baseDir, category);
      
      for (const [name, config] of Object.entries(items)) {
        const filePath = path.join(categoryDir, `${name}.mp3`);
        
        // Skip if file exists
        if (fs.existsSync(filePath)) {
          console.log(`✓ Skipping existing file: ${filePath}`);
          continue;
        }
        
        await waitForRateLimit();
        await retryDownload(downloader, config.query, config.filter, filePath);
      }
    }
    
    console.log('\n✨ Missing sounds download complete!');
  } catch (error) {
    console.error('❌ Error downloading missing sounds:', error);
  }
}

downloadMissingSounds(); 