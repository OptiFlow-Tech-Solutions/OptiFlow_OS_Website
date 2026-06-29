#!/usr/bin/env node
/* ═══════════════════════════════════════════
   OptiFlow OS — File Watcher (dev mode)
   Watches src/, assets/, site.json and rebuilds on change
   ═══════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ASSEMBLE = path.join(ROOT, 'scripts', 'assemble.mjs');

let timer = null;

function rebuild(label) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    try {
      console.log(`\n[${label}] Rebuilding...`);
      execSync(`node "${ASSEMBLE}"`, { cwd: ROOT, stdio: 'inherit' });
    } catch (e) {
      console.error('Build failed, waiting for changes...');
    }
  }, 200);
}

function watchDir(dir) {
  fs.watch(dir, { recursive: true }, (event, filename) => {
    if (filename) rebuild(path.relative(ROOT, path.join(dir, filename)));
  });
}

console.log('OptiFlow OS — Watching for changes...\n');
console.log(`  src/      (pages, partials)`);
console.log(`  assets/   (CSS, JS, images)`);
console.log(`  site.json (site config)\n`);

watchDir(path.join(ROOT, 'src'));
watchDir(path.join(ROOT, 'assets'));
fs.watch(path.join(ROOT, 'site.json'), (event, filename) => {
  if (filename) rebuild('site.json');
});

rebuild('initial');
