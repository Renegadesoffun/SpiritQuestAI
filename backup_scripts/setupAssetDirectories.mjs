import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const assetDirectories = [
  '../app/assets/images',
  '../app/assets/images/story',
  '../app/assets/images/game',
  '../app/assets/images/backgrounds',
  '../app/assets/images/effects',
  '../app/assets/sounds',
  '../app/assets/sounds/instruments/strings',
  '../app/assets/sounds/instruments/piano',
  '../app/assets/sounds/instruments/pad',
  '../app/assets/sounds/instruments/choir',
  '../app/assets/sounds/effects',
  '../app/assets/sounds/ambient',
  '../scripts/drawing'
];

export async function createDirectoryStructure() {
  const directories = [
    'app/assets',
    'app/assets/images',
    'app/assets/images/game',
    'app/assets/images/story',
    'app/assets/sounds',
    'app/assets/sounds/ambient',
    'app/assets/sounds/instruments/strings',
    'app/assets/sounds/instruments/pad',
    'app/assets/sounds/instruments/choir'
  ];

  for (const dir of directories) {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  }
  return true;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createDirectoryStructure().catch(console.error);
}
