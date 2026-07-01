#!/usr/bin/env node
/* ═══════════════════════════════════════════
   OptiFlow OS — Theme Change Hook
   Verifies DESIGN.md color tokens are
   represented as CSS variables in core.css.
   ═══════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, readText, findDesignMd } from './_utils.mjs';

function extractColors(mdPath) {
  const text = readText(mdPath);
  const colors = [];

  const tableRe = /\|\s*(\w+)\s*\|\s*([^|]+?)\s*\|\s*`([#A-Fa-f0-9]+)`\s*\|/g;
  let match;
  while ((match = tableRe.exec(text)) !== null) {
    const role = match[1].trim();
    const token = match[2].trim();
    const hex = match[3].toUpperCase();
    colors.push({ role, token, hex });
  }

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
  const hexUpper = hex.toUpperCase();

  const varDefRe = /--([\w-]+)\s*:\s*([^;]+?)\s*;/g;
  const varDefs = [];
  let m;
  while ((m = varDefRe.exec(css)) !== null) {
    const name = `--${m[1]}`;
    const value = m[2].toUpperCase();
    varDefs.push({ name, value });
  }

  const matchedVar = varDefs.find(v => v.value.includes(hexUpper));
  if (!matchedVar) return { ok: false, reason: 'no CSS variable defined for this hex' };

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
const cssRaw = readText(cssPath);

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

const outsideRoot = cssRaw.replace(/:root\s*\{[\s\S]*?\}/g, '').replace(/\[data-theme="dark"\]\s*\{[\s\S]*?\}/g, '');
const hexInCss = outsideRoot.match(/#[0-9a-fA-F]{6}/g) || [];
if (hexInCss.length > 0) {
  console.log(`\n  ⚠ Hardcoded hex in core.css outside :root: ${hexInCss.join(', ')}`);
  mismatches++;
}

console.log(`\n${mismatches} mismatch(es)`);
process.exit(mismatches > 0 ? 1 : 0);
