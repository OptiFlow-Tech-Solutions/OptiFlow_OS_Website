#!/usr/bin/env node
/* ═══════════════════════════════════════════
   OptiFlow OS — Pre-Build Hook
   Validates site.json, DESIGN.md, assets,
   and referenced images before build.
   Exits 0 on success, 1 on failure.
   ═══════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ASSETS, ASSETS_IMG, SRC_PAGES, SRC_PARTIALS, readText, fail, ok, walkDir, findDesignMd, getErrors } from './_utils.mjs';

console.log('\n─ Pre-Build Validation ─\n');

// 1. Validate site.json
console.log('1. site.json');
const sitePath = path.join(ROOT, 'site.json');
if (!fs.existsSync(sitePath)) { fail('site.json not found'); }
else {
  const site = JSON.parse(readText(sitePath));
  ['name', 'phone', 'email', 'pages'].forEach(f => {
    if (!site[f]) fail(`site.json missing "${f}"`);
  });
  if (!Array.isArray(site.pages) || site.pages.length === 0) fail('site.json pages must be a non-empty array');
  if (!getErrors()) ok('site.json valid');
}

// 2. Check DESIGN.md exists
console.log('2. DESIGN.md');
const designPath = findDesignMd();
if (!designPath) fail('DESIGN.md not found (expected in OptiFlow-OS-* folder)');
else ok(`DESIGN.md found at ${path.relative(ROOT, designPath)}`);

// 3. Check all .png references
console.log('3. Image references');
const designPngs = findDesignPngs();
const assetsPngs = fs.existsSync(ASSETS_IMG)
  ? fs.readdirSync(ASSETS_IMG).filter(f => f.toLowerCase().endsWith('.png'))
  : [];

const allHtml = [...walkDir(SRC_PAGES, ['.html']), ...walkDir(SRC_PARTIALS, ['.html'])];
const pngRefs = new Set();
for (const f of allHtml) {
  const content = readText(f);
  const matches = content.matchAll(/(?:src|content|href)="\/assets\/img\/([^"]+\.png)"/g);
  for (const m of matches) pngRefs.add(m[1]);
}
if (pngRefs.size === 0) ok('no .png references found');
else {
  for (const ref of pngRefs) {
    if (assetsPngs.includes(ref)) ok(`${ref} found in assets/img/`);
    else if (designPngs.includes(ref)) ok(`${ref} found in design folder (copied at build)`);
    else fail(`${ref} referenced but not found`);
  }
}

// 4. Check core.css and core.js
console.log('4. Core assets');
if (!fs.existsSync(path.join(ASSETS, 'css', 'core.css'))) fail('assets/css/core.css missing');
else ok('assets/css/core.css');
if (!fs.existsSync(path.join(ASSETS, 'js', 'core.js'))) fail('assets/js/core.js missing');
else ok('assets/js/core.js');

console.log(`\n${getErrors()} error(s)`);
process.exit(getErrors() > 0 ? 1 : 0);

function findDesignPngs() {
  const pngs = [];
  const designRoot = fs.readdirSync(ROOT).find(d => d.startsWith('OptiFlow-OS'));
  if (designRoot) {
    const base = path.join(ROOT, designRoot);
    (function walk(dir) {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) walk(path.join(dir, entry.name));
        else if (entry.name.toLowerCase().endsWith('.png')) pngs.push(entry.name);
      }
    }(base));
  }
  // ponytail: also check DESIGN.md/logos/
  const logosDir = path.join(ROOT, 'DESIGN.md', 'logos');
  if (fs.existsSync(logosDir)) {
    for (const f of fs.readdirSync(logosDir)) {
      if (f.toLowerCase().endsWith('.png')) pngs.push(f);
    }
  }
  return pngs;
}
