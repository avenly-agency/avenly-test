// scripts/flatten-rsc.mjs
// Workaround dla bug'a Next.js 16.1.1 + output:'export' + nested routes:
// Next.js generuje pliki RSC payload z slashami w nazwie (które Apache interpretuje
// jako foldery), np. `__next.uslugi/strony-www/one-page.txt`. Browser jednak fetchuje
// flat URL z kropkami: `__next.uslugi.strony-www.one-page.txt` → 404 → router silent fail.
//
// Skrypt kopiuje każdy nested RSC payload na flat name w parent folderze docelowej trasy.
// Uruchamiany jako post-build (npm run build).

import { readdirSync, statSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = 'out';
let copiedCount = 0;
let skippedCount = 0;

function walk(dir, callback) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

walk(OUT_DIR, (filePath) => {
  if (!filePath.endsWith('.txt')) return;

  // Normalize path separators (Windows uses \, treat as /)
  const normalized = filePath.replace(/\\/g, '/');

  // Locate __next. prefix in path
  const idx = normalized.indexOf('/__next.');
  if (idx === -1) return;

  const parentDir = normalized.substring(0, idx + 1); // includes trailing /
  const rscRelPath = normalized.substring(idx + 1);   // e.g. __next.uslugi/strony-www/one-page.txt

  // Skip if already flat (no slashes after __next.)
  const afterPrefix = rscRelPath.substring('__next.'.length);
  if (!afterPrefix.includes('/')) {
    skippedCount++;
    return;
  }

  // Flatten: replace / with . in the rsc segment
  const flatName = '__next.' + afterPrefix.replace(/\//g, '.');
  const newPath = parentDir + flatName;

  // Copy (preserve original for backwards compat if anything)
  copyFileSync(filePath, newPath);
  copiedCount++;
});

console.log(`[flatten-rsc] Flat RSC payloads created: ${copiedCount} (skipped already-flat: ${skippedCount})`);
