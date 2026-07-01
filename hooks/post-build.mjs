#!/usr/bin/env node
/* ═══════════════════════════════════════════
   OptiFlow OS — Post-Build Hook
   Runs validation, reports build statistics.
   validate.mjs warnings are logged but do
   NOT fail the build.
   ═══════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const DIST = path.join(ROOT, 'dist');

function fmtBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function findAllPages(dir) {
  const pages = [];
  if (!fs.existsSync(dir)) return pages;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== 'assets') pages.push(...findAllPages(path.join(dir, entry.name)));
    else if (entry.name === 'index.html') pages.push(path.join(dir, entry.name));
  }
  return pages;
}

function getSize(fp) {
  try { return fs.statSync(fp).size; } catch { return 0; }
}

console.log('\n─ Post-Build Report ─\n');

// 1. Run validate
console.log('Running validate...');
try {
  execSync('node scripts/validate.mjs', { cwd: ROOT, stdio: 'inherit' });
} catch (e) {
  if (e.status && e.status !== 0) {
    console.error('  ✗ validate.mjs failed with errors. Build aborted.');
    process.exit(e.status);
  }
  console.log('  ⚠ validate.mjs exited with non-zero. Warnings above, build continues.');
}

// 2. Build statistics
if (!fs.existsSync(DIST)) {
  console.error('dist/ not found. Build may have failed.');
  process.exit(0);
}

const pages = findAllPages(DIST);
const cssSize = getSize(path.join(DIST, 'assets', 'css', 'core.css'));
const jsSize = getSize(path.join(DIST, 'assets', 'js', 'core.js'));

console.log('\n─ Build Statistics ─');
console.log(`  Total pages:  ${pages.length}`);
console.log(`  CSS size:     ${fmtBytes(cssSize)}`);
console.log(`  JS size:      ${fmtBytes(jsSize)}`);
console.log(`  Total dist:   ${fmtBytes(getSize(DIST))} (recursive)`);

console.log('\n─ Per-Page Sizes ─');
for (const page of pages.sort()) {
  const rel = path.relative(DIST, page);
  console.log(`  ${fmtBytes(getSize(page)).padEnd(10)} ${rel}`);
}

console.log('');
