#!/usr/bin/env node
/* ═══════════════════════════════════════════
   OptiFlow OS — Shared Hook Utilities
   Imported by all hooks in hooks/ directory.
   ═══════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '..');
export const ASSETS = path.join(ROOT, 'assets');
export const ASSETS_CSS = path.join(ASSETS, 'css');
export const ASSETS_JS = path.join(ASSETS, 'js');
export const ASSETS_IMG = path.join(ASSETS, 'img');
export const SRC_PAGES = path.join(ROOT, 'src', 'pages');
export const SRC_PARTIALS = path.join(ROOT, 'src', 'partials');
export const DIST = path.join(ROOT, 'dist');

let errors = 0;

export function fail(msg) { console.error(`  ✗ ${msg}`); errors++; }
export function ok(msg) { console.log(`  ✓ ${msg}`); }

export function getErrors() { return errors; }
export function resetErrors() { errors = 0; }

export function readText(fp) {
  try { return fs.readFileSync(fp, 'utf-8'); } catch { return ''; }
}

export function walkDir(dir, exts) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) files.push(...walkDir(path.join(dir, entry.name), exts));
    else if (exts.some(e => entry.name.endsWith(e))) files.push(path.join(dir, entry.name));
  }
  return files;
}

export function findDesignMd() {
  for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name.startsWith('OptiFlow-OS')) {
      const fp = path.join(ROOT, entry.name, 'DESIGN.md');
      if (fs.existsSync(fp)) return fp;
    }
  }
  return null;
}
