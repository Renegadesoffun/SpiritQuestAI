import fs from 'fs';
import path from 'path';
import * as mm from 'music-metadata';

// Sound categories and their expected usage patterns
const SOUND_CATEGORIES = {
  instruments: {
    strings: {
      usage: 'GameSoundDirector.playInstrument',
      types: ['violin', 'cello', 'viola', 'harp'],
      validations: {
        minDuration: 0.5,
        maxDuration: 4,
        minSampleRate: 44100,
        requireStereo: true
      }
    },
    woodwinds: {
      usage: 'GameSoundDirector.playInstrument',
      types: ['flute', 'clarinet'],
      validations: {
        minDuration: 0.5,
        maxDuration: 4,
        minSampleRate: 44100
      }
    },
    piano: {
      usage: 'GameSoundDirector.playPiano',
      types: ['grand', 'soft'],
      validations: {
        minDuration: 0.5,
        maxDuration: 2,
        minSampleRate: 44100,
        requireStereo: true
      }
    }
  },
  effects: {
    magic: {
      usage: 'SpatialAudioManager.playEffect',
      types: ['chime', 'sparkle', 'whoosh'],
      validations: {
        maxDuration: 2,
        requireStereo: true
      }
    },
    ui: {
      usage: 'AudioEngine.playUISound',
      types: ['click', 'hover', 'success'],
      validations: {
        maxDuration: 0.5
      }
    }
  },
  ambient: {
    environments: {
      usage: 'SpatialAudioManager.createAmbientSound',
      types: ['forest', 'cave', 'temple'],
      validations: {
        minDuration: 20,
        requireLoop: true,
        requireStereo: true
      }
    },
    weather: {
      usage: 'GameSoundDirector.playWeatherSound',
      types: ['rain', 'wind', 'thunder'],
      validations: {
        minDuration: 10,
        requireLoop: true
      }
    }
  },
  music: {
    themes: {
      usage: 'GameSoundDirector.playTheme',
      types: ['menu', 'map', 'boss'],
      validations: {
        minDuration: 30,
        requireStereo: true,
        requireLoop: true
      }
    }
  }
};

// Add more detailed component validations
const COMPONENT_VALIDATIONS = {
  'GameSoundDirector.playInstrument': {
    minSampleRate: 44100,
    maxDuration: 4,
    requireStereo: true,
    allowedFormats: ['wav'],
    recommendedEffects: ['reverb', 'spatialize'],
    musicalProperties: {
      requireNote: true,
      allowedArticulations: ['sustain', 'pizzicato', 'staccato']
    }
  },
  'GameSoundDirector.playTheme': {
    minSampleRate: 44100,
    minDuration: 30,
    requireStereo: true,
    requireLoop: true,
    allowedFormats: ['wav', 'mp3'],
    recommendedEffects: ['reverb', 'compression'],
    musicalProperties: {
      requireKey: true,
      requireTempo: true
    }
  },
  'SpatialAudioManager.createAmbientSound': {
    minSampleRate: 44100,
    minDuration: 20,
    requireLoop: true,
    requireStereo: true,
    recommendedEffects: ['lowpass', 'reverb'],
    spatialProperties: {
      maxDistance: 50,
      rolloffFactor: 1
    }
  },
  'AudioEngine.playUISound': {
    maxDuration: 0.5,
    maxSize: 1024 * 1024, // 1MB
    recommendedEffects: [],
    playbackProperties: {
      maxInstances: 3,
      fadeOut: 0.1
    }
  }
};

// Generate runtime validation code
function generateValidationCode() {
  let code = `// Auto-generated validation code\n\n`;
  code += `export function validateSoundUsage(soundPath: string, usage: string): ValidationResult {\n`;
  code += `  const validations = ${JSON.stringify(COMPONENT_VALIDATIONS, null, 2)};\n\n`;
  code += `  return function validate(metadata) {\n`;
  code += `    const errors = [];\n`;
  code += `    const warnings = [];\n\n`;
  code += `    const rules = validations[usage];\n`;
  code += `    if (!rules) return { isValid: true, errors: [], warnings: [] };\n\n`;
  code += `    // Check sample rate\n`;
  code += `    if (rules.minSampleRate && metadata.sampleRate < rules.minSampleRate) {\n`;
  code += `      errors.push(\`Sample rate too low: \${metadata.sampleRate}Hz (min: \${rules.minSampleRate}Hz)\`);\n`;
  code += `    }\n\n`;
  code += `    // Add more validation checks...\n`;
  code += `    return { isValid: errors.length === 0, errors, warnings };\n`;
  code += `  };\n`;
  code += `}\n`;

  return code;
}

// Generate more component examples
function generateComponentExamples(soundPath, category, metadata) {
  const usage = SOUND_CATEGORIES[category.main]?.[category.sub]?.usage;
  if (!usage) return [];

  const examples = [];
  const validations = COMPONENT_VALIDATIONS[usage] || {};

  switch (usage) {
    case 'GameSoundDirector.playInstrument':
      examples.push(
        `// In GameSoundDirector:`,
        `const instrument = await this.loadInstrument('${soundPath}', {`,
        `  volume: 0.8,`,
        `  effects: ${JSON.stringify(validations.recommendedEffects)},`,
        `  spatialize: true`,
        `});`,
        ``,
        `// Play with musical expression`,
        `await instrument.play({`,
        `  velocity: 0.8,`,
        `  expression: 'legato',`,
        `  pan: 0.2`,
        `});`,
        ``,
        `// Use in composition`,
        `this.composer.addInstrument(instrument, {`,
        `  part: 'melody',`,
        `  octave: 4,`,
        `  timing: 'quantized'`,
        `});`
      );
      break;

    case 'SpatialAudioManager.createAmbientSound':
      examples.push(
        `// In SpatialAudioManager:`,
        `const ambient = await this.createAmbientSound('${soundPath}', {`,
        `  position: new Vector3(x, y, z),`,
        `  volume: 0.5,`,
        `  maxDistance: ${validations.spatialProperties.maxDistance},`,
        `  rolloffFactor: ${validations.spatialProperties.rolloffFactor},`,
        `  effects: ${JSON.stringify(validations.recommendedEffects)}`,
        `});`,
        ``,
        `// Fade in/out`,
        `await ambient.fadeIn(2.0);`,
        `await ambient.fadeOut(1.5);`,
        ``,
        `// Move sound source`,
        `ambient.setPosition(new Vector3(newX, newY, newZ));`
      );
      break;

    case 'GameSoundDirector.playTheme':
      examples.push(
        `// In GameSoundDirector:`,
        `const theme = await this.loadTheme('${soundPath}', {`,
        `  volume: 0.4,`,
        `  fadeIn: 2.0,`,
        `  effects: ${JSON.stringify(validations.recommendedEffects)}`,
        `});`,
        ``,
        `// Layer with intensity`,
        `theme.setIntensity(0.8);`,
        `theme.addLayer('action', { volume: 0.6 });`,
        ``,
        `// Transition between themes`,
        `await this.transitionTheme(theme, {`,
        `  duration: 3.0,`,
        `  crossFade: true`,
        `});`
      );
      break;
  }

  return examples;
}

// Generate TypeScript interfaces for sound metadata
function generateSoundInterfaces() {
  let interfaces = `// Auto-generated sound interfaces\n\n`;
  interfaces += `export interface SoundMetadata {\n`;
  interfaces += `  path: string;\n`;
  interfaces += `  category: {\n`;
  interfaces += `    main: string;\n`;
  interfaces += `    sub: string;\n`;
  interfaces += `    type: string;\n`;
  interfaces += `  };\n`;
  interfaces += `  format: {\n`;
  interfaces += `    codec: string;\n`;
  interfaces += `    sampleRate: number;\n`;
  interfaces += `    channels: number;\n`;
  interfaces += `    duration: number;\n`;
  interfaces += `  };\n`;
  interfaces += `  analysis: {\n`;
  interfaces += `    isLoop: boolean;\n`;
  interfaces += `    isHighQuality: boolean;\n`;
  interfaces += `    musicalNote?: string;\n`;
  interfaces += `    instrument?: string;\n`;
  interfaces += `    articulations: string[];\n`;
  interfaces += `  };\n`;
  interfaces += `}\n`;

  return interfaces;
}

// Generate TypeScript type definitions for sound paths
function generateTypeDefinitions(dirStructure) {
  let types = `// Auto-generated sound path types\n\n`;
  types += `export type SoundPath = {\n`;
  
  function addPathTypes(obj, prefix = '') {
    Object.entries(obj).forEach(([key, value]) => {
      if (value.path) {
        const fullPath = prefix + key;
        const category = fullPath.split('/')[0];
        const usage = findUsagePattern(category, fullPath);
        types += `  '${fullPath}': {\n`;
        types += `    path: string;\n`;
        types += `    usage: '${usage}';\n`;
        types += `    duration: number;\n`;
        types += `    format: {\n`;
        types += `      codec: string;\n`;
        types += `      sampleRate: number;\n`;
        types += `      channels: number;\n`;
        types += `    };\n`;
        types += `  };\n`;
      } else {
        addPathTypes(value, `${prefix}${key}/`);
      }
    });
  }
  
  addPathTypes(dirStructure);
  types += `};\n`;
  
  return types;
}

// Generate usage examples for components
function generateUsageExamples(soundPath, metadata, category) {
  const usage = findUsagePattern(category.main, soundPath);
  const examples = [];
  
  switch (usage) {
    case 'GameSoundDirector.playInstrument':
      examples.push(
        `// In GameSoundDirector:\n`,
        `await this.audio.playSound('${soundPath}', {\n`,
        `  volume: 0.8,\n`,
        `  effects: ['reverb'],\n`,
        `  spatialize: true\n`,
        `});\n`
      );
      break;
    case 'SpatialAudioManager.playEffect':
      examples.push(
        `// In GameAudioController:\n`,
        `await this.spatial.createSpatialSound('${soundPath}', position, {\n`,
        `  volume: 0.6,\n`,
        `  maxDistance: 30\n`,
        `});\n`
      );
      break;
    // ... (other usage patterns)
  }
  
  return examples;
}

// Add validation result type
const createValidationResult = (isValid = true, errors = [], warnings = []) => ({
  isValid,
  errors,
  warnings
});

// Add validation function
function validateSound(filePath, metadata, category) {
  const errors = [];
  const warnings = [];

  // Check basic requirements
  if (metadata.format.sampleRate < 44100) {
    warnings.push(`Low sample rate: ${metadata.format.sampleRate}Hz`);
  }

  // Category-specific validations
  switch (category.main) {
    case 'instruments':
      if (metadata.format.duration > 4) {
        warnings.push('Instrument sample longer than 4 seconds');
      }
      if (metadata.format.numberOfChannels !== 2) {
        warnings.push('Instrument should be stereo');
      }
      break;

    case 'ambient':
      if (metadata.format.duration < 20) {
        errors.push('Ambient sound too short (should be > 20s)');
      }
      break;

    case 'effects':
      if (metadata.format.duration > 2) {
        warnings.push('Effect sound longer than 2 seconds');
      }
      break;
  }

  return createValidationResult(
    errors.length === 0,
    errors,
    warnings
  );
}

function updateDirStructure(dirStructure, filePath, metadata) {
  const relativePath = path.relative(process.cwd(), filePath);
  const pathParts = relativePath.split(path.sep);
  let current = dirStructure;

  // Build nested structure
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    if (!current[part]) {
      current[part] = {};
    }
    current = current[part];
  }

  // Add file metadata
  const fileName = pathParts[pathParts.length - 1];
  current[fileName] = {
    path: filePath,
    size: metadata.size,
    duration: metadata.format.duration,
    format: {
      codec: metadata.format.codec,
      sampleRate: metadata.format.sampleRate,
      channels: metadata.format.numberOfChannels,
      bitDepth: metadata.format.bitsPerSample
    },
    analysis: {
      isLoop: metadata.format.duration > 4 && metadata.format.duration < 8,
      isHighQuality: metadata.format.sampleRate >= 44100,
      isStereo: metadata.format.numberOfChannels === 2,
      hasReverb: false, // Would need waveform analysis
      isCompressed: metadata.format.codec !== 'wav'
    },
    lastModified: new Date(metadata.size.mtimeMs).toISOString()
  };

  return dirStructure;
}

// Add directory scanning
async function scanSoundFiles(baseDir) {
  const files = [];
  
  async function scan(dir) {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.name.match(/\.(wav|mp3)$/i)) {
        files.push(fullPath);
      }
    }
  }
  
  await scan(baseDir);
  return files;
}

// Add path generation
function getNewPath(oldPath, category, metadata, analysis) {
  const ext = path.extname(oldPath);
  const baseDir = path.join(process.cwd(), 'app/assets/sounds');
  let newName = '';

  // Build standardized filename
  if (analysis.instrument) {
    newName = [
      analysis.instrument.name,
      analysis.musicalNote,
      analysis.articulations[0],
      analysis.instrument.isLoop ? 'loop' : null
    ]
      .filter(Boolean)
      .join('_')
      .toLowerCase();
  } else {
    newName = path.basename(oldPath, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  // Build path based on category
  const categoryPath = [
    baseDir,
    category.main,
    category.sub,
    category.type
  ].filter(Boolean);

  return path.join(...categoryPath, `${newName}${ext}`);
}

function determineCategory(filePath, metadata) {
  const fileName = path.basename(filePath).toLowerCase();
  const pathParts = filePath.toLowerCase().split(path.sep);

  // First check if path contains category info
  for (const [mainCat, subCats] of Object.entries(SOUND_CATEGORIES)) {
    if (pathParts.includes(mainCat)) {
      for (const [subCat, config] of Object.entries(subCats)) {
        if (pathParts.includes(subCat)) {
          return {
            main: mainCat,
            sub: subCat,
            type: config.types?.find(t => fileName.includes(t)) || 'misc',
            usage: config.usage,
            validations: config.validations || {}
          };
        }
      }
    }
  }

  // If not found in path, analyze content
  const analysis = analyzeFileCharacteristics(fileName, metadata);
  
  if (analysis.isInstrumental) {
    return {
      main: 'instruments',
      sub: analysis.instrumentFamily || 'misc',
      type: analysis.instrumentType || 'misc',
      usage: 'GameSoundDirector.playInstrument'
    };
  }

  if (analysis.isAmbient) {
    return {
      main: 'ambient',
      sub: analysis.isNature ? 'environments' : 'weather',
      type: analysis.environmentType || 'misc',
      usage: 'SpatialAudioManager.createAmbientSound'
    };
  }

  if (analysis.isEffect) {
    return {
      main: 'effects',
      sub: analysis.isMagical ? 'magic' : 'ui',
      type: analysis.effectType || 'misc',
      usage: 'AudioEngine.playEffect'
    };
  }

  if (analysis.isMusic) {
    return {
      main: 'music',
      sub: 'themes',
      type: analysis.musicType || 'misc',
      usage: 'GameSoundDirector.playTheme'
    };
  }

  return {
    main: 'misc',
    sub: 'uncategorized',
    type: 'misc',
    usage: 'AudioEngine.playSound'
  };
}

function analyzeFileCharacteristics(fileName, metadata) {
  const analysis = {
    isInstrumental: false,
    isAmbient: false,
    isEffect: false,
    isMusic: false,
    instrumentFamily: null,
    instrumentType: null,
    environmentType: null,
    effectType: null,
    musicType: null
  };

  // Instrument patterns
  if (fileName.match(/violin|cello|flute|piano|guitar/)) {
    analysis.isInstrumental = true;
    analysis.instrumentType = fileName.match(/violin|cello|flute|piano|guitar/)[0];
    analysis.instrumentFamily = determineInstrumentFamily(analysis.instrumentType);
  }

  // Environment patterns
  if (fileName.match(/forest|cave|temple|nature|ambient/)) {
    analysis.isAmbient = true;
    analysis.environmentType = fileName.match(/forest|cave|temple|nature|ambient/)[0];
  }

  // Effect patterns
  if (fileName.match(/magic|sparkle|chime|whoosh|ui|click/)) {
    analysis.isEffect = true;
    analysis.effectType = fileName.match(/magic|sparkle|chime|whoosh|ui|click/)[0];
    analysis.isMagical = /magic|sparkle|chime/.test(fileName);
  }

  // Music patterns
  if (fileName.match(/theme|music|soundtrack|boss|map/)) {
    analysis.isMusic = true;
    analysis.musicType = fileName.match(/theme|music|soundtrack|boss|map/)[0];
  }

  return analysis;
}

async function analyzeSoundFile(filePath, metadata) {
  const fileName = path.basename(filePath).toLowerCase();
  const analysis = {
    instrument: determineInstrument(filePath),
    duration: metadata.format.duration,
    sampleRate: metadata.format.sampleRate,
    channels: metadata.format.numberOfChannels,
    format: metadata.format.codec,
    characteristics: {
      isLoop: metadata.format.duration > 4 && metadata.format.duration < 8,
      isHighQuality: metadata.format.sampleRate >= 44100,
      isStereo: metadata.format.numberOfChannels === 2,
      hasReverb: detectReverb(metadata),
      isCompressed: metadata.format.codec !== 'wav'
    }
  };

  // Extract musical properties
  const noteMatch = fileName.match(/([A-G][#b]?\d)/);
  if (noteMatch) {
    analysis.musicalNote = noteMatch[1];
  }

  // Determine articulations
  analysis.articulations = determineArticulation(fileName) ? [determineArticulation(fileName)] : [];

  // Check for potential issues
  analysis.issues = [];
  
  // Check sample rate
  if (metadata.format.sampleRate < 44100) {
    analysis.issues.push({
      type: 'error',
      message: `Low sample rate: ${metadata.format.sampleRate}Hz (minimum: 44100Hz)`,
      suggestion: 'Replace with higher quality recording'
    });
  }

  // Check bit depth
  if (metadata.format.bitsPerSample < 16) {
    analysis.issues.push({
      type: 'warning',
      message: `Low bit depth: ${metadata.format.bitsPerSample} bits`,
      suggestion: 'Consider replacing with 16-bit or 24-bit audio'
    });
  }

  // Check duration based on sound type
  if (analysis.instrument) {
    if (metadata.format.duration > 4 && !fileName.includes('sustain')) {
      analysis.issues.push({
        type: 'warning',
        message: 'Instrument sample too long',
        suggestion: 'Trim to 1-4 seconds or mark as sustain'
      });
  }
  }

  // Check stereo requirements
  const category = determineCategory(filePath, metadata);
  if (category.main === 'ambient' && metadata.format.numberOfChannels !== 2) {
    analysis.issues.push({
      type: 'error',
      message: 'Ambient sound should be stereo',
      suggestion: 'Replace with stereo recording'
    });
  }

  return analysis;
}

function detectReverb(metadata) {
  // Basic reverb detection based on duration and amplitude envelope
  // This is a simplified version - could be enhanced with actual waveform analysis
  const hasLongTail = metadata.format.duration > 2;
  const hasHighDynamicRange = metadata.format.bitsPerSample >= 16;
  return hasLongTail && hasHighDynamicRange;
}

function generateFreesoundQuery(file, category, metadata = {}) {
  const fileName = path.basename(file, path.extname(file));
  const parts = fileName.split('_');
  
  // Base query from filename
  let query = parts.join(' ');
  
  // Add category-specific terms
  switch (category.main) {
    case 'instruments':
      query += ` ${category.sub} single note`;
      break;
    case 'ambient':
      query += ` ambient atmosphere`;
      break;
    case 'effects':
      query += ` sound effect`;
      break;
  }
  
  // Add quality requirements
  const filter = [
    'type:wav',
    'samplerate:44100',
    category.main === 'ambient' ? 'duration:[10 TO 30]' : 'duration:[1 TO 4]'
  ].join(' ');
  
  return { query, filter };
}

function getRequiredSoundsForCategory(category) {
  const required = [];
  
  switch (category.main) {
    case 'instruments':
      if (category.sub === 'strings') {
        required.push(
          'violin_sustain.wav',
          'cello_sustain.wav',
          'violin_pizzicato.wav'
        );
      } else if (category.sub === 'woodwinds') {
        required.push(
          'flute_sustain.wav',
          'clarinet_sustain.wav'
        );
      }
      break;
      
    case 'ambient':
      if (category.sub === 'environments') {
        required.push(
          'forest_loop.wav',
          'cave_loop.wav',
          'temple_loop.wav'
        );
      }
      break;
      
    case 'effects':
      if (category.sub === 'magic') {
        required.push(
          'sparkle.wav',
          'chime.wav',
          'whoosh.wav'
        );
      }
      break;
  }
  
  return required;
}

function determineInstrument(filePath) {
  const fileName = path.basename(filePath).toLowerCase();
  const pathParts = filePath.toLowerCase().split(path.sep);
  
  const instruments = {
    strings: {
      types: ['violin', 'viola', 'cello', 'bass', 'harp'],
      patterns: {
        pizzicato: ['pizz', 'pizzicato'],
        sustain: ['sustain', 'long', 'held'],
        tremolo: ['trem', 'tremolo'],
        staccato: ['stacc', 'staccato']
      }
    },
    woodwinds: {
      types: ['flute', 'clarinet', 'oboe', 'bassoon'],
      patterns: {
        sustain: ['sustain', 'long'],
        staccato: ['stacc', 'staccato'],
        flutter: ['flutter', 'fluttertongue']
      }
    },
    piano: {
      types: ['piano', 'grand', 'upright'],
      patterns: {
        sustain: ['sustain', 'pedal'],
        staccato: ['stacc', 'staccato'],
        soft: ['soft', 'gentle', 'p']
      }
    },
    pad: {
      types: ['pad', 'ambient', 'atmosphere', 'spirit'],
      patterns: {
        sustain: ['sustain', 'long', 'loop'],
        evolving: ['evolving', 'moving'],
        texture: ['texture', 'soundscape']
      }
    }
  };

  // First check path for instrument family
  let foundFamily = null;
  let foundType = null;
  let foundPatterns = [];

  for (const [family, config] of Object.entries(instruments)) {
    // Check if path contains family name
    if (pathParts.includes(family)) {
      foundFamily = family;
      
      // Look for specific instrument type
      foundType = config.types.find(type => 
        pathParts.includes(type) || fileName.includes(type)
      );

      // Check for articulation patterns
      for (const [pattern, keywords] of Object.entries(config.patterns)) {
        if (keywords.some(keyword => fileName.includes(keyword))) {
          foundPatterns.push(pattern);
        }
      }

      break;
    }
  }

  // If no family found in path, try filename analysis
  if (!foundFamily) {
    for (const [family, config] of Object.entries(instruments)) {
      const typeMatch = config.types.find(type => fileName.includes(type));
      if (typeMatch) {
        foundFamily = family;
        foundType = typeMatch;
        
        // Check patterns for the found family
        for (const [pattern, keywords] of Object.entries(config.patterns)) {
          if (keywords.some(keyword => fileName.includes(keyword))) {
            foundPatterns.push(pattern);
          }
        }
        break;
      }
    }
  }

  // Extract musical note if present
  const noteMatch = fileName.match(/([A-G][#b]?\d)/);
  const hasNote = !!noteMatch;

  // Check for loop indicators
  const isLoop = fileName.includes('loop') || 
                 fileName.includes('sustain') || 
                 fileName.includes('ambient');

  return foundFamily ? {
    family: foundFamily,
    type: foundType || 'unknown',
    patterns: foundPatterns,
    hasNote,
    note: noteMatch ? noteMatch[1] : null,
    isLoop
  } : null;
}

async function organizeSoundLibrary() {
  const baseDir = path.join(process.cwd(), 'app/assets/sounds');
  const dirStructure = {};
  const validationErrors = [];
  const replacementSuggestions = [];
  const missingFiles = [];
  
  try {
    console.log('🔄 Starting sound library organization...');
    
    // Scan and organize files
    const files = await scanSoundFiles(baseDir);
    for (const file of files) {
      const metadata = await mm.parseFile(file);
      const category = determineCategory(file, metadata);
      const analysis = await analyzeSoundFile(file, metadata);
      
      // Validate sound
      const validation = validateSound(file, metadata, category);
      if (!validation.isValid || validation.warnings.length > 0) {
        validationErrors.push({
          file,
          errors: validation.errors,
          warnings: validation.warnings
        });

        // Generate replacement suggestion if needed
        if (validation.errors.length > 0) {
          replacementSuggestions.push({
            file,
            category,
            freesoundQuery: generateFreesoundQuery(file, category, metadata),
            reason: validation.errors.join(', ')
          });
        }
      }
      
      // Check for missing required sounds
      const requiredSounds = getRequiredSoundsForCategory(category);
      for (const required of requiredSounds) {
        if (!files.some(f => f.includes(required))) {
          missingFiles.push({
            path: path.join(category.main, category.sub, required),
            freesoundQuery: generateFreesoundQuery(required, category)
          });
        }
      }
      
      // Organize file
      const newPath = getNewPath(file, category, metadata, analysis);
      await fs.promises.mkdir(path.dirname(newPath), { recursive: true });
      await fs.promises.rename(file, newPath);
      
      // Update directory structure
      updateDirStructure(dirStructure, newPath, {
        ...metadata,
        size: (await fs.promises.stat(newPath)).size
      });
    }
    
    // Report results
    if (validationErrors.length > 0) {
      console.log('\n⚠️ Files Needing Attention:');
      validationErrors.forEach(({ file, errors, warnings }) => {
        console.log(`\n📄 ${path.relative(baseDir, file)}`);
        if (errors.length > 0) {
          console.log('  ❌ Errors:');
          errors.forEach(error => console.log(`    • ${error}`));
        }
        if (warnings.length > 0) {
          console.log('  ⚠️ Warnings:');
          warnings.forEach(warning => console.log(`    • ${warning}`));
        }
      });
    }

    if (replacementSuggestions.length > 0) {
      console.log('\n🔄 Replacement Suggestions:');
      replacementSuggestions.forEach(({ file, category, freesoundQuery, reason }) => {
        console.log(`\n📄 ${path.relative(baseDir, file)}`);
        console.log(`  Reason: ${reason}`);
        console.log(`  Freesound Query: "${freesoundQuery}"`);
        console.log(`  Filter: "tag:${category.main} duration:[1 TO 4] type:wav samplerate:44100"`);
      });
    }

    if (missingFiles.length > 0) {
      console.log('\n📥 Missing Required Files:');
      missingFiles.forEach(({ path, freesoundQuery }) => {
        console.log(`\n❌ ${path}`);
        console.log(`  Freesound Query: "${freesoundQuery}"`);
      });
    }
    
    console.log('\n✨ Sound library organization complete!');
  } catch (error) {
    console.error('Failed to organize sound library:', error);
  }
}

organizeSoundLibrary(); 