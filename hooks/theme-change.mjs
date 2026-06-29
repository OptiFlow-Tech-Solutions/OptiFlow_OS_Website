#!/usr/bin/env node
/* ═══════════════════════════════════════════
   OptiFlow OS — Theme Change Hook
   Verifies DESIGN.md color tokens are
   represented as CSS variables in core.css.
   ═══════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

function findDesignMd() {
  for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name.startsWith('OptiFlow-OS')) {
      const fp = path.join(ROOT, entry.name, 'DESIGN.md');
      if (fs.existsSync(fp)) return fp;
    }
  }
  return null;
}

function extractColors(mdPath) {
  const text = fs.readFileSync(mdPath, 'utf-8');
  const colors = [];

  // Extract from the Color Palette table rows
  const tableRe = /\|\s*(\w+)\s*\|\s*([^|]+?)\s*\|\s*`([#A-Fa-f0-9]+)`\s*\|/g;
  let match;
  while ((match = tableRe.exec(text)) !== null) {
    const role = match[1].trim();
    const token = match[2].trim();
    const hex = match[3].toUpperCase();
    colors.push({ role, token, hex });
  }

  // Extract from yaml frontmatter colors
  const yamlColorRe = /\b(\w[\w-]*):\s*"?(#[A-Fa-f0-9]{6})"?/g;
  const yamlSection = text.match(/^---([\s\S]*?)^---/m);
  if (yamlSection) {
    while ((match = yamlColorRe.exec(yamlSection[1])) !== null) {
      colors.push({ role: 'yaml', token: match[1], hex: match[2].toUpperCase() });
    }
  }

  return colors;
}

function cssUsesVarFor(css, hex) {
  // Check if any CSS variable resolves to this hex (approximate check)
  // Look for var(--*) usages in property values, and check if the hex appears
  // only in :root variable definitions.
  const hexUpper = hex.toUpperCase();

  // Find all CSS variable definitions
  const varDefRe = /--([\w-]+)\s*:\s*([^;]+?)\s*;/g;
  const varDefs = [];
  let m;
  while ((m = varDefRe.exec(css)) !== null) {
    const name = `--${m[1]}`;
    const value = m[2].toUpperCase();
    varDefs.push({ name, value });
  }

  // Check if this hex is captured in a CSS variable
  const matchedVar = varDefs.find(v => v.value.includes(hexUpper));
  if (!matchedVar) return { ok: false, reason: 'no CSS variable defined for this hex' };

  // Check if var() usage exists outside of :root definitions
  const outsideRoot = css.replace(/:root\s*\{[\s\S]*?\}/g, '');
  const varUsage = outsideRoot.includes(`var(${matchedVar.name})`);
  if (!varUsage) {
    return { ok: false, reason: `CSS variable ${matchedVar.name} defined but never used outside :root` };
  }

  return { ok: true, variable: matchedVar.name };
}

console.log('\n─ Theme Change Audit ─\n');

const designPath = findDesignMd();
if (!designPath) {
  console.error('DESIGN.md not found');
  process.exit(1);
}
console.log(`DESIGN.md: ${path.relative(ROOT, designPath)}`);

const cssPath = path.join(ROOT, 'assets', 'css', 'core.css');
if (!fs.existsSync(cssPath)) {
  console.error('assets/css/core.css not found');
  process.exit(1);
}
console.log(`core.css:  assets/css/core.css\n`);

const designColors = extractColors(designPath);
const cssRaw = fs.readFileSync(cssPath, 'utf-8');

const uniqueColors = [];
const seen = new Set();
for (const c of designColors) {
  if (!seen.has(c.hex)) { seen.add(c.hex); uniqueColors.push(c); }
}

let mismatches = 0;
for (const { role, token, hex } of uniqueColors) {
  const result = cssUsesVarFor(cssRaw, hex);
  if (result.ok) {
    console.log(`  ✓ ${token} (${hex}) → ${result.variable}`);
  } else {
    console.log(`  ✗ ${token} (${hex}) → ${result.reason}`);
    mismatches++;
  }
}

// Also check: are there hardcoded hexes in core.css outside :root?
// This is a looser check than the validate.mjs scan on dist pages.
const outsideRoot = cssRaw.replace(/:root\s*\{[\s\S]*?\}/g, '').replace(/\[data-theme="dark"\]\s*\{[\s\S]*?\}/g, '');
const hexInCss = outsideRoot.match(/#[0-9a-fA-F]{6}/g) || [];
if (hexInCss.length > 0) {
  console.log(`\n  ⚠ Hardcoded hex in core.css outside :root: ${hexInCss.join(', ')}`);
  mismatches++;
}

console.log(`\n${mismatches} mismatch(es)`);
process.exit(mismatches > 0 ? 1 : 0);
