import fs from 'fs';
import path from 'path';

const source = 'dist';
const dest = '../dist';

try {
  if (fs.existsSync(source)) {
    fs.cpSync(source, dest, { recursive: true, force: true });
    console.log(`✓ Copied dist from ${source} to ${dest}`);
  }
} catch (error) {
  console.error(`Failed to copy dist: ${error.message}`);
  process.exit(1);
}
