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
getAllPages(); // ponytail: triggers page discovery

for (const page of pages) {
  const html = fs.readFileSync(page, 'utf-8');
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
  if (!html.includes('meta name="description"')) log('error', `Missing meta description in ${name}`);
  if (!html.includes('<h1')) log('warn', `Missing <h1> in ${name}`);
  if (!html.includes('og:title')) log('error', `Missing OG tags in ${name}`);
}

// 4a. Check meta description length
console.log('\n─ Description Length (120-160) ─');
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf-8');
  const name = path.relative(DIST, page);
  const match = html.match(/<meta name="description" content="([^"]+)"/);
  if (match) {
    const desc = match[1];
    if (desc.length < 120) log('error', `Description too short (${desc.length} chars) in ${name}`);
    else if (desc.length > 160) log('error', `Description too long (${desc.length} chars) in ${name}`);
  }
}

// 4b. Check canonical URL
console.log('\n─ Canonical URLs ─');
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf-8');
  const name = path.relative(DIST, page);
  if (!html.includes('rel="canonical"')) log('error', `Missing canonical URL in ${name}`);
}

// 4c. Check OG URL
console.log('\n─ OpenGraph URLs ─');
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf-8');
  const name = path.relative(DIST, page);
  if (!html.includes('og:url')) log('error', `Missing og:url in ${name}`);
  if (!html.includes('og:site_name')) log('error', `Missing og:site_name in ${name}`);
  if (!html.includes('og:locale')) log('error', `Missing og:locale in ${name}`);
}

// 4d. Check structured data
console.log('\n─ Structured Data ─');
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf-8');
  const name = path.relative(DIST, page);
  if (!html.includes('"@type":"Organization"') && !html.includes('"@type": "Organization"')) log('warn', `Missing Organization schema in ${name}`);
  if (!html.includes('BreadcrumbList')) log('warn', `Missing BreadcrumbList in ${name}`);
}

// 5. Contrast ratio check (WCAG 2.2 AA)
console.log('\n─ Contrast Ratios (WCAG 2.2 AA) ─');

function parseOklch(str) {
  const m = str.match(/oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\)/);
  if (!m) return null;
  return { l: parseFloat(m[1]) / 100, c: parseFloat(m[2]), h: parseFloat(m[3]) };
}

function oklchToRgb({ l, c, h }) {
  const hr = h * Math.PI / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  const r_ = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g_ = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  const toSrgb = (x) => {
    const abs = Math.abs(x);
    const sign = x < 0 ? -1 : 1;
    return sign * (abs > 0.0031308 ? 1.055 * Math.pow(abs, 1 / 2.4) - 0.055 : 12.92 * abs);
  };

  return { r: toSrgb(r_), g: toSrgb(g_), bl: toSrgb(bl) };
}

function relativeLuminance({ r, g, bl }) {
  const toLinear = (c) => {
    const s = c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return s;
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(bl);
}

function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getTokens(block) {
  const tokens = {};
  for (const match of block.matchAll(/--([\w-]+):\s*(oklch\([\d.]+%?\s+[\d.]+\s+[\d.]+\))/g)) {
    tokens[match[1]] = parseOklch(match[2]);
  }
  return tokens;
}

try {
  const css = fs.readFileSync(path.join(ROOT, 'assets', 'css', 'core.css'), 'utf-8');
  const rootMatch = css.match(/:root\s*\{([^}]+)\}/);
  const darkMatch = css.match(/\[data-theme="dark"\]\s*\{([^}]+)\}/);

  const lightTokens = rootMatch ? getTokens(rootMatch[1]) : {};
  const darkTokens = darkMatch ? getTokens(darkMatch[1]) : {};

  const pairs = [
    ['--fg', '--bg', 'Body text on background'],
    ['--muted', '--bg', 'Muted text on background'],
    ['--accent', '--bg', 'Accent text on background'],
    ['--accent', '--surface', 'Accent text on surface'],
    ['--teal', '--bg', 'Teal text on background'],
  ];

  for (const [fgKey, bgKey, label] of pairs) {
    for (const [mode, tokens] of [['light', lightTokens], ['dark', darkTokens]]) {
      if (!tokens[fgKey.slice(2)] || !tokens[bgKey.slice(2)]) continue;
      const fgRgb = oklchToRgb(tokens[fgKey.slice(2)]);
      const bgRgb = oklchToRgb(tokens[bgKey.slice(2)]);
      const cr = contrastRatio(relativeLuminance(fgRgb), relativeLuminance(bgRgb));
      const threshold = label.includes('Muted') ? 4.5 : 4.5;
      if (cr < threshold) {
        log('warn', `${label} (${mode}): ${cr.toFixed(2)}:1 (needs ${threshold}:1)`);
      }
    }
  }
} catch (e) {
  log('warn', `Could not run contrast check: ${e.message}`);
}

// 6. Check canonical data consistency
console.log('\n─ Data Consistency ─');
const _site = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.json'), 'utf-8'));
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf-8');
  if (html.includes('+91 98765 43210')) log('error', `Wrong phone number in ${path.relative(DIST, page)}`);
  if (html.includes('Ahmedabad')) log('warn', `Old location in ${path.relative(DIST, page)}`);
}

// 7. Check source files for hardcoded contact info
console.log('\n─ Source Contact Hardcoding ─');
const srcDirs = [
  path.join(ROOT, 'src', 'pages'),
  path.join(ROOT, 'src', 'partials'),
];
const sourceFiles = [];
for (const dir of srcDirs) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir, { recursive: !!dir.includes('pages') ? false : true })) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isFile() && f.endsWith('.html')) sourceFiles.push(full);
  }
  // pages dir has subdirectories
  if (dir.includes('pages')) {
    for (const sub of fs.readdirSync(dir, { withFileTypes: true })) {
      if (sub.isDirectory()) {
        const subDir = path.join(dir, sub.name);
        for (const f of fs.readdirSync(subDir)) {
          if (f.endsWith('.html')) sourceFiles.push(path.join(subDir, f));
        }
      }
    }
  }
}

for (const file of sourceFiles) {
  const html = fs.readFileSync(file, 'utf-8');
  const relPath = path.relative(ROOT, file);

  // ponytail: match +91 with 10 digits; skip form placeholder patterns like +91 00000 00000
  const phoneMatches = html.match(/\+91[\s-]?\d{5}[\s-]?\d{5}/g) || [];
  for (const match of phoneMatches) {
    if (match.includes('00000')) continue; // skip form input placeholder hints
    log('error', `Hardcoded phone number in ${relPath}: "${match}" (use {{PHONE}} or {{PHONE_TEL}})`);
  }

  const emailMatches = html.match(/@optiflow\.co\.in/g) || [];
  for (const match of emailMatches) {
    if (!html.includes('{{EMAIL}}')) {
      log('error', `Hardcoded email domain in ${relPath}: "${match}" (use {{EMAIL}})`);
    }
  }

  if (!html.includes('{{LOCATION}}') && html.includes('Surat, India')) {
    log('error', `Hardcoded location in ${relPath}: "Surat, India" (use {{LOCATION}})`);
  }
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors > 0 ? 1 : 0);
