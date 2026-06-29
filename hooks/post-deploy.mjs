#!/usr/bin/env node
/* ───────────────────────────────────────────
   OptiFlow OS — Post-Deploy Canary
   Verifies all 12 pages are healthy after
   a deployment. Exits 0 on all pass, 1 on
   any failure.
   Usage: node hooks/post-deploy.mjs [baseUrl]
   ─────────────────────────────────────────── */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

const BASE = process.argv[2] || 'http://localhost:3000';
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.json'), 'utf-8'));

const pages = site.pages.map(p => {
  return p.file === 'index.html' ? '/' : '/' + p.file.replace('/index.html', '').replace('.html', '') + '/';
});

console.log(`\n─── Post-Deploy Canary [${BASE}] ───\n`);

let passed = 0;
let failed = 0;

for (const page of pages) {
  const url = BASE + page;
  try {
    const res = await fetch(url);
    const body = await res.text();

    const checks = [];
    if (res.status !== 200) checks.push(`status ${res.status}`);
    if (!body.includes('</html>')) checks.push('missing </html>');
    if (!body.toLowerCase().includes('optiflow')) checks.push('brand not found');

    if (checks.length === 0) {
      console.log(`  ✓ ${page}`);
      passed++;
    } else {
      console.log(`  ✗ ${page} — ${checks.join(', ')}`);
      failed++;
    }
  } catch (err) {
    console.log(`  ✗ ${page} — ${err.message}`);
    failed++;
  }
}

const total = pages.length;
console.log(`\n  ${failed === 0 ? '✓' : '✗'} ${passed}/${total} pages healthy\n`);

if (failed > 0) {
  console.log(`  ✗ ${failed}/${total} pages FAILED\n`);
  process.exit(1);
}

process.exit(0);
