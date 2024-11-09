import fs from 'fs';
import path from 'path';
import * as mm from 'music-metadata';
import { AVAILABLE_SOUNDS } from '../app/audio/SoundLibrary.js';

function getSuggestedUsage(category, relativePath) {
  const examples = [];
  const soundPath = relativePath.replace(/\\/g, '/');

  switch (category) {
    case 'ambient':
      examples.push(
        `// Loop ambient sound:`,
        `await AudioEngine.playSound('${soundPath}', 0.3, { loop: true });`,
        ``,
        `// Use with spatial audio:`,
        `await SpatialAudioManager.createSpatialSound('${soundPath}', position, { volume: 0.3, maxDistance: 50 });`
      );
      break;
    case 'instruments':
      if (relativePath.includes('notes')) {
        examples.push(
          `// Play note:`,
          `await AudioEngine.playSound('${soundPath}', 0.5);`,
          ``,
          `// With effects:`,
          `await AudioEngine.playSound('${soundPath}', 0.5, { effects: ['reverb', 'delay'] });`
        );
      } else if (relativePath.includes('sustain')) {
        examples.push(
          `// Play sustained sound:`,
          `await AudioEngine.playSound('${soundPath}', 0.4, { loop: true });`
        );
      }
      break;
    case 'effects':
      examples.push(
        `// Play effect:`,
        `await AudioEngine.playSound('${soundPath}', 0.6);`,
        ``,
        `// With position:`,
        `await SpatialAudioManager.playEffect('${soundPath}', position);`
      );
      break;
    default:
      examples.push(
        `// Basic playback:`,
        `await AudioEngine.playSound('${soundPath}', 0.5);`
      );
  }
  return examples;
}

function checkMissingRequiredSounds() {
  const requiredSounds = {
    ambient: ['forest', 'meditation'],
    effects: ['magical_chime', 'meditation_bell'],
    music: ['map', 'boss'],
    instruments: {
      woodwinds: ['clarinet/notes/C4', 'flute/notes/C4'],
      strings: ['viola/sustain']
    }
  };

  console.log('\n🔍 Checking Required Sounds:');
  const baseDir = path.join(process.cwd(), 'app/assets/sounds');
  
  function checkCategory(category, items, basePath = '') {
    for (const [key, value] of Object.entries(items)) {
      if (typeof value === 'string') {
        const soundPath = path.join(baseDir, category, basePath, value);
        const exists = fs.existsSync(soundPath + '.mp3') || fs.existsSync(soundPath + '.wav');
        console.log(`${exists ? '✅' : '❌'} ${category}/${basePath}${value}`);
      } else if (typeof value === 'object') {
        checkCategory(category, value, key + '/');
      }
    }
  }

  for (const [category, items] of Object.entries(requiredSounds)) {
    checkCategory(category, items);
  }
}

async function verifySoundLibrary() {
  const baseDir = path.join(process.cwd(), 'app/assets/sounds');
  const errors = [];
  const warnings = [];
  const foundSounds = [];

  async function findAllSoundFiles(dir) {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return findAllSoundFiles(fullPath);
      } else if (entry.name.match(/\.(mp3|wav)$/i)) {
        try {
          const stats = fs.statSync(fullPath);
          const metadata = await mm.parseFile(fullPath);
          const relativePath = path.relative(baseDir, fullPath);
          const category = relativePath.split(path.sep)[0];
          
          return {
            path: fullPath,
            relativePath,
            category,
            name: entry.name,
            size: (stats.size / 1024 / 1024).toFixed(2) + ' MB',
            extension: path.extname(entry.name).toLowerCase(),
            duration: metadata.format.duration.toFixed(2) + ' seconds',
            format: {
              sampleRate: metadata.format.sampleRate + ' Hz',
              bitDepth: metadata.format.bitsPerSample + ' bit',
              channels: metadata.format.numberOfChannels + ' channels',
              codec: metadata.format.codec
            },
            lastModified: stats.mtime.toLocaleString()
          };
        } catch (error) {
          warnings.push(`Warning: Could not read metadata for ${fullPath}: ${error.message}`);
          return null;
        }
      }
      return null;
    }));
    
    return files.flat().filter(f => f !== null);
  }

  try {
    console.log('\n🔍 Scanning sound directory...');
    foundSounds.push(...await findAllSoundFiles(baseDir));

    // Group by directory structure
    const dirStructure = {};
    foundSounds.forEach(sound => {
      const parts = sound.relativePath.split(path.sep);
      let current = dirStructure;
      parts.forEach((part, i) => {
        if (!current[part]) {
          current[part] = i === parts.length - 1 ? sound : {};
        }
        current = current[part];
      });
    });

    // Print directory structure
    console.log('\n📂 Directory Structure:');
    function printStructure(obj, indent = '') {
      Object.entries(obj).forEach(([key, value]) => {
        if (value.path) {
          // It's a file
          console.log(`${indent}📄 ${key}`);
          console.log(`${indent}   Size: ${value.size}, Duration: ${value.duration}`);
          console.log(`${indent}   Format: ${value.format.codec}, ${value.format.sampleRate}`);
        } else {
          // It's a directory
          console.log(`${indent}📁 ${key}`);
          printStructure(value, indent + '  ');
        }
      });
    }
    printStructure(dirStructure);

    // Enhanced reporting
    console.log('\n📊 Sound Library Report');
    console.log('===================');

    if (foundSounds.length > 0) {
      // Group by category
      const categorizedSounds = {};
      foundSounds.forEach(sound => {
        if (!categorizedSounds[sound.category]) {
          categorizedSounds[sound.category] = [];
        }
        categorizedSounds[sound.category].push(sound);
      });

      // Print detailed inventory
      console.log('\n📁 Complete Sound Inventory:');
      
      for (const [category, sounds] of Object.entries(categorizedSounds)) {
        console.log(`\n${category.toUpperCase()} (${sounds.length} files):`);
        sounds.forEach(sound => {
          console.log(`\n  📂 ${sound.relativePath}`);
          console.log(`    📊 Format: ${sound.format.codec}, ${sound.format.sampleRate}, ${sound.format.channels}`);
          console.log(`    ⏱️  Duration: ${sound.duration}`);
          console.log(`    💾 Size: ${sound.size}`);
          console.log(`    🔄 Last Modified: ${sound.lastModified}`);
          
          // Add usage examples based on category and file type
          console.log('\n    💡 Usage Examples:');
          const examples = getSuggestedUsage(sound.category, sound.relativePath);
          examples.forEach(example => {
            console.log(`      ${example}`);
          });
        });
      }

      // Print summary by extension
      console.log('\n📊 File Type Summary:');
      const byExtension = {};
      foundSounds.forEach(sound => {
        if (!byExtension[sound.extension]) {
          byExtension[sound.extension] = [];
        }
        byExtension[sound.extension].push(sound);
      });

      for (const [ext, files] of Object.entries(byExtension)) {
        console.log(`\n${ext.toUpperCase()} Files (${files.length}):`);
        files.forEach(file => {
          console.log(`  • ${file.relativePath}`);
          console.log(`    Size: ${file.size}, Duration: ${file.duration}`);
        });
      }

      // Print overall statistics
      const totalSize = foundSounds.reduce((acc, sound) => acc + parseFloat(sound.size), 0);
      const totalDuration = foundSounds.reduce((acc, sound) => acc + parseFloat(sound.duration), 0);
      
      console.log('\n📈 Summary:');
      console.log(`Total files: ${foundSounds.length}`);
      console.log(`Total size: ${totalSize.toFixed(2)} MB`);
      console.log(`Total duration: ${totalDuration.toFixed(2)} seconds`);
      console.log(`Average duration: ${(totalDuration / foundSounds.length).toFixed(2)} seconds`);
    }

    // Check for missing required sounds
    checkMissingRequiredSounds();

  } catch (error) {
    console.error('Failed to verify sound library:', error);
  }
}

verifySoundLibrary(); 