import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createCanvas } from 'canvas';

import {
  drawCosmicEffects,
  drawSpiritualEnergy,
  drawDivineLight,
  drawCosmos,
  drawSpiritForm,
  drawEnergyFields,
  drawLightPath,
  drawStarfield
} from './drawing/effects.mjs';

import {
  drawSacredGeometry,
  drawEtherealTree,
  drawCrystal,
  drawMysticalLeaves
} from './drawing/elements.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to ensure directory exists
async function ensureDir(dirPath) {
  try {
    await fs.promises.access(dirPath);
  } catch {
    await fs.promises.mkdir(dirPath, { recursive: true });
  }
}

export async function generateStoryAssets() {
  try {
    // Define and create required directories
    const storyDir = path.join(__dirname, '../app/assets/images/story');
    const bgDir = path.join(__dirname, '../app/assets/images/backgrounds');
    
    await ensureDir(storyDir);
    await ensureDir(bgDir);

    // Generate story sequence images
    const storySequences = {
      'forest': {
        count: 3,
        baseColor: '#0a2f1a',
        effects: ['trees', 'leaves']
      },
      'cave': {
        count: 3,
        baseColor: '#1a1a2e',
        effects: ['crystals', 'energy']
      },
      'temple': {
        count: 3,
        baseColor: '#2d1b4e',
        effects: ['sacred', 'light']
      },
      'spirit': {
        count: 3,
        baseColor: '#16213e',
        effects: ['cosmic', 'spirit']
      }
    };

    // Generate each sequence
    for (const [scene, config] of Object.entries(storySequences)) {
      for (let i = 1; i <= config.count; i++) {
        const canvas = createCanvas(1920, 1080);
        const ctx = canvas.getContext('2d');
        
        // Create base gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 1080);
        gradient.addColorStop(0, config.baseColor);
        gradient.addColorStop(1, shiftColor(config.baseColor, 20));
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1920, 1080);

        // Add scene-specific effects
        config.effects.forEach(effect => {
          switch(effect) {
            case 'trees':
              drawEtherealTree(ctx, 960, 700, 600);
              break;
            case 'leaves':
              drawMysticalLeaves(ctx);
              break;
            case 'crystals':
              drawCrystal(ctx, 960, 540, 400);
              break;
            case 'energy':
              drawEnergyFields(ctx);
              break;
            case 'sacred':
              drawSacredGeometry(ctx, 960, 540, 500);
              break;
            case 'light':
              drawDivineLight(ctx, 960, 540, 600);
              break;
            case 'cosmic':
              drawCosmicEffects(ctx, 960, 540, 800);
              break;
            case 'spirit':
              drawSpiritForm(ctx, 960, 540, 400);
              break;
          }
        });

        const buffer = canvas.toBuffer('image/png');
        const filename = `${scene}${i}.png`;
        await fs.promises.writeFile(
          path.join(storyDir, filename),
          buffer
        );
        console.log(`Generated ${filename}`);
      }
    }

    // Generate special story assets
    const specialAssets = {
      'awakening': {
        baseColor: '#1c092c',
        effects: ['starfield', 'spiritualEnergy']
      },
      'meditation': {
        baseColor: '#0a2f1a',
        effects: ['sacred', 'light']
      },
      'enlightenment': {
        baseColor: '#16213e',
        effects: ['cosmic', 'spirit']
      }
    };

    // Generate special assets
    for (const [name, config] of Object.entries(specialAssets)) {
      const canvas = createCanvas(1920, 1080);
      const ctx = canvas.getContext('2d');
      
      // Create base gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 1080);
      gradient.addColorStop(0, config.baseColor);
      gradient.addColorStop(1, shiftColor(config.baseColor, 20));
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1920, 1080);

      // Add effects
      config.effects.forEach(effect => {
        switch(effect) {
          case 'starfield':
            drawStarfield(ctx);
            break;
          case 'spiritualEnergy':
            drawSpiritualEnergy(ctx, 960, 540, 600);
            break;
          case 'sacred':
            drawSacredGeometry(ctx, 960, 540, 500);
            break;
          case 'light':
            drawDivineLight(ctx, 960, 540, 600);
            break;
          case 'cosmic':
            drawCosmicEffects(ctx, 960, 540, 800);
            break;
          case 'spirit':
            drawSpiritForm(ctx, 960, 540, 400);
            break;
        }
      });

      const buffer = canvas.toBuffer('image/png');
      await fs.promises.writeFile(
        path.join(storyDir, `${name}.png`),
        buffer
      );
      console.log(`Generated ${name}.png`);
    }

    return true;
  } catch (error) {
    console.error('Error generating story assets:', error);
    throw error;
  }
}

// Helper function to shift color brightness
function shiftColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}
