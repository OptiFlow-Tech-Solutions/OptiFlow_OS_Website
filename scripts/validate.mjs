#!/usr/bin/env node
/* ═══════════════════════════════════════════
   OptiFlow OS — Validation Script
   Checks for broken internal links, missing assets,
   hardcoded hex colors that should be variables,
   and data consistency across pages.
   ═══════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const DIST = path.join(ROOT, 'dist');

let errors = 0;
let warnings = 0;

function log(level, msg) {
  const prefix = level === 'error' ? '  ✗' : level === 'warn' ? '  ⚠' : '  ✓';
  console.log(`${prefix} ${msg}`);
  if (level === 'error') errors++;
  if (level === 'warn') warnings++;
}

if (!fs.existsSync(DIST)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

function getAllPages(dir = DIST) {
  const pages = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== 'assets') {
      pages.push(...getAllPages(path.join(dir, entry.name)));
    } else if (entry.name === 'index.html') {
      pages.push(path.join(dir, entry.name));
    }
  }
  return pages;
}

const pages = getAllPages();

// 1. Check all internal links
console.log('\n─ Link Check ─');
const pageSet = new Set(pages.map(p => {
  const rel = '/' + path.relative(DIST, p).replace(/\\/g, '/').replace(/\/index\.html$/, '') + '/';
  return rel.replace('//', '/');
}));

for (const page of pages) {
  const html = fs.readFileSync(page, 'utf-8');
  const relDir = path.dirname(page);
  const links = html.match(/href="([^"]+)"/g) || [];
  for (const match of links) {
    const href = match.slice(6, -1);
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || href.startsWith('javascript:')) continue;
    if (href.startsWith('/')) {
      const clean = href.split('#')[0].slice(1);
      if (!clean) continue;
      let target = path.join(DIST, clean);
      if (!fs.existsSync(target) && !clean.includes('.')) {
        target = path.join(DIST, clean, 'index.html');
      }
      if (!fs.existsSync(target)) {
        log('error', `Broken link in ${path.relative(DIST, page)}: ${href}`);
      }
    }
  }
}

// 2. Check for hardcoded hex colors
console.log('\n─ Hardcoded Colors ─');
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf-8');
  const stripped = html.replace(/<style[\s\S]*?<\/style>/g, '').replace(/fill="[^"]*"/g, '');
  const hexes = stripped.match(/#[0-9a-fA-F]{6}/g) || [];
  for (const hex of hexes) {
    log('warn', `Hardcoded ${hex} in ${path.relative(DIST, page)}`);
  }
}

// 3. Check dark mode coverage
console.log('\n─ Dark Mode Coverage ─');
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf-8');
  if (!html.includes('[data-theme="dark"]')) {
    log('warn', `No dark mode styles in ${path.relative(DIST, page)}`);
  }
}

// 4. Check for common missing elements
console.log('\n─ SEO / Accessibility ─');
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf-8');
  const name = path.relative(DIST, page);
  if (!html.includes('<title>')) log('error', `Missing <title> in ${name}`);
  if (!html.includes('meta name="description"')) log('warn', `Missing meta description in ${name}`);
  if (!html.includes('<h1')) log('warn', `Missing <h1> in ${name}`);
  if (!html.includes('og:title')) log('warn', `Missing OG tags in ${name}`);
}

// 5. Check canonical data consistency
console.log('\n─ Data Consistency ─');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.json'), 'utf-8'));
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf-8');
  if (html.includes('+91 98765 43210')) log('error', `Wrong phone number in ${path.relative(DIST, page)}`);
  if (html.includes('Ahmedabad')) log('warn', `Old location in ${path.relative(DIST, page)}`);
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors > 0 ? 1 : 0);
