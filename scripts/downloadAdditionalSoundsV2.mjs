import { FreesoundDownloader } from '../app/audio/FreesoundDownloader.mjs';
import path from 'path';
import fs from 'fs';

const ADDITIONAL_SOUNDS_V2 = {
  instruments: {
    percussion: {
      drums: {
        kick: { query: 'kick drum acoustic', filter: 'tag:drum tag:kick duration:[0.2 TO 1]' },
        snare: { query: 'snare drum acoustic', filter: 'tag:drum tag:snare duration:[0.2 TO 1]' },
        hihat: { query: 'hihat acoustic', filter: 'tag:drum tag:hihat duration:[0.2 TO 1]' }
      },
      bells: {
        tingsha: { query: 'tingsha bells meditation', filter: 'tag:bell tag:meditation duration:[1 TO 4]' },
        windchimes: { query: 'wind chimes crystal', filter: 'tag:chimes duration:[2 TO 6]' }
      }
    },
    strings: {
      koto: {
        notes: {
          'C4': { query: 'koto C4 note', filter: 'tag:koto tag:note duration:[1 TO 3]' },
          'G4': { query: 'koto G4 note', filter: 'tag:koto tag:note duration:[1 TO 3]' }
        },
        pluck: { query: 'koto pluck traditional', filter: 'tag:koto tag:pluck duration:[1 TO 2]' }
      },
      guzheng: {
        gliss: { query: 'guzheng glissando', filter: 'tag:guzheng duration:[2 TO 4]' },
        pluck: { query: 'guzheng pluck', filter: 'tag:guzheng tag:pluck duration:[1 TO 2]' }
      }
    },
    woodwinds: {
      shakuhachi: {
        notes: {
          'C4': { query: 'shakuhachi C4 traditional', filter: 'tag:shakuhachi tag:japanese duration:[1 TO 3]' },
          'G4': { query: 'shakuhachi G4 traditional', filter: 'tag:shakuhachi tag:japanese duration:[1 TO 3]' }
        },
        effects: { query: 'shakuhachi effects japanese', filter: 'tag:shakuhachi tag:effects duration:[2 TO 4]' }
      },
      bamboo_flute: {
        sustain: { query: 'bamboo flute sustain', filter: 'tag:bamboo tag:flute duration:[2 TO 4]' },
        staccato: { query: 'bamboo flute staccato', filter: 'tag:bamboo tag:flute tag:staccato duration:[0.5 TO 2]' }
      }
    },
    crystal: {
      bowls: {
        low: { query: 'crystal singing bowl low', filter: 'tag:crystal tag:bowl duration:[3 TO 6]' },
        high: { query: 'crystal singing bowl high', filter: 'tag:crystal tag:bowl duration:[3 TO 6]' }
      },
      chimes: { query: 'crystal chimes meditation', filter: 'tag:crystal tag:chimes duration:[2 TO 4]' }
    }
  },
  effects: {
    footsteps: {
      grass: { query: 'footsteps grass', filter: 'tag:footsteps tag:grass duration:[0.3 TO 1]' },
      stone: { query: 'footsteps stone', filter: 'tag:footsteps tag:stone duration:[0.3 TO 1]' },
      water: { query: 'footsteps water', filter: 'tag:footsteps tag:water duration:[0.3 TO 1]' }
    },
    magic: {
      portal: { query: 'magic portal open', filter: 'tag:magic tag:portal duration:[1 TO 3]' },
      transform: { query: 'magic transform spell', filter: 'tag:magic tag:spell duration:[1 TO 3]' },
      heal: { query: 'magic heal spell', filter: 'tag:magic tag:heal duration:[1 TO 2]' }
    },
    nature: {
      leaves: { query: 'leaves rustling forest', filter: 'tag:leaves tag:nature duration:[2 TO 4]' },
      birds: {
        morning: { query: 'birds morning forest', filter: 'tag:birds tag:morning duration:[3 TO 6]' },
        night: { query: 'birds night forest owl', filter: 'tag:birds tag:night duration:[2 TO 4]' }
      },
      insects: {
        crickets: { query: 'crickets night', filter: 'tag:crickets tag:night duration:[4 TO 8]' },
        cicadas: { query: 'cicadas summer', filter: 'tag:cicadas duration:[4 TO 8]' }
      }
    },
    spiritual: {
      meditation_bells: { query: 'meditation bell tibetan', filter: 'tag:meditation tag:bell duration:[2 TO 4]' },
      om_chant: { query: 'om chant meditation', filter: 'tag:om tag:chant duration:[4 TO 8]' },
      spirit_whoosh: { query: 'spirit whoosh mystical', filter: 'tag:whoosh tag:mystical duration:[1 TO 2]' }
    }
  },
  ambient: {
    water: {
      stream: { query: 'water stream peaceful', filter: 'tag:water tag:stream duration:[20 TO 60]' },
      waterfall: { query: 'waterfall distant', filter: 'tag:waterfall duration:[20 TO 60]' }
    },
    wind: {
      leaves: { query: 'wind leaves trees', filter: 'tag:wind tag:leaves duration:[20 TO 60]' },
      cave: { query: 'wind cave hollow', filter: 'tag:wind tag:cave duration:[20 TO 60]' }
    },
    meditation: {
      temple: { query: 'temple atmosphere meditation', filter: 'tag:temple tag:atmosphere duration:[30 TO 120]' },
      crystal_cave: { query: 'crystal cave atmosphere', filter: 'tag:crystal tag:cave duration:[30 TO 120]' },
      spirit_realm: { query: 'spiritual ambient peaceful', filter: 'tag:spiritual tag:ambient duration:[30 TO 120]' }
    },
    forest: {
      day: { query: 'forest daytime ambient', filter: 'tag:forest tag:day duration:[30 TO 120]' },
      night: { query: 'forest night ambient', filter: 'tag:forest tag:night duration:[30 TO 120]' },
      rain: { query: 'forest rain ambient', filter: 'tag:forest tag:rain duration:[30 TO 120]' }
    }
  },
  ui: {
    feedback: {
      hover: { query: 'ui hover subtle', filter: 'tag:ui tag:hover duration:[0.1 TO 0.5]' },
      click: { query: 'ui click feedback', filter: 'tag:ui tag:click duration:[0.1 TO 0.5]' },
      success: { query: 'ui success notification', filter: 'tag:ui tag:success duration:[0.5 TO 1]' },
      error: { query: 'ui error alert', filter: 'tag:ui tag:error duration:[0.5 TO 1]' }
    }
  }
};

// Add rate limiting
const RATE_LIMIT = {
  requestsPerMinute: 50,
  requestCount: 0,
  lastReset: Date.now()
};

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000;

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

async function downloadSoundRecursively(category, items, baseDir, downloader) {
  for (const [name, config] of Object.entries(items)) {
    if (typeof config === 'object' && !config.query) {
      // This is a subcategory
      const subDir = path.join(baseDir, name);
      await fs.promises.mkdir(subDir, { recursive: true });
      await downloadSoundRecursively(category, config, subDir, downloader);
    } else if (config.query) {
      // This is a sound to download
      const fileName = `${name}.mp3`;
      const filePath = path.join(baseDir, fileName);
      
      // Skip if file exists
      if (fs.existsSync(filePath)) {
        console.log(`✓ Skipping existing file: ${filePath}`);
        continue;
      }

      console.log(`\n📥 Downloading: ${fileName}`);
      await waitForRateLimit();
      
      try {
        await retryDownload(downloader, config.query, config.filter, filePath);
        console.log(`✅ Downloaded: ${fileName}`);
      } catch (error) {
        console.error(`❌ Failed to download ${fileName}:`, error.message);
      }
    }
  }
}

async function retryDownload(downloader, query, filter, outputPath, attempt = 1) {
  try {
    return await downloader.searchAndDownload(query, outputPath, {
      filter,
      sort: 'rating_desc',
      fields: 'id,name,previews'
    });
  } catch (error) {
    if (attempt >= RETRY_ATTEMPTS) {
      throw error;
    }
    
    console.log(`Retry ${attempt}/${RETRY_ATTEMPTS} for ${outputPath}`);
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    
    return retryDownload(downloader, query, filter, outputPath, attempt + 1);
  }
}

async function downloadAdditionalSoundsV2() {
  const baseDir = path.join(process.cwd(), 'app/assets/sounds');
  const downloader = new FreesoundDownloader();
  
  try {
    console.log('\n🎵 Starting download of additional sounds V2...');
    
    for (const [category, items] of Object.entries(ADDITIONAL_SOUNDS_V2)) {
      const categoryDir = path.join(baseDir, category);
      await fs.promises.mkdir(categoryDir, { recursive: true });
      await downloadSoundRecursively(category, items, categoryDir, downloader);
    }
    
    console.log('\n✨ Additional sounds V2 download complete!');
  } catch (error) {
    console.error('❌ Error downloading additional sounds:', error);
  }
}

downloadAdditionalSoundsV2();