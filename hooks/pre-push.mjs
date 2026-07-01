#!/usr/bin/env node
/* ═══════════════════════════════════════════
   OptiFlow OS — Pre-Push Hook
   Runs lint + validate before allowing push.
   Exits 0 on pass, 1 on failure.
   ═══════════════════════════════════════════ */
import { execSync } from 'node:child_process';
import { ROOT } from './_utils.mjs';

console.log('\n─ Pre-Push Gate ─\n');

let hasErrors = false;

console.log('1. Lint (lint:all)...');
try {
  execSync('npm run lint:all', { cwd: ROOT, stdio: 'inherit' });
  console.log('  ✓ lint passed');
} catch {
  console.log('  ✗ lint failed');
  hasErrors = true;
}

console.log('\n2. Validate...');
try {
  execSync('npm run validate', { cwd: ROOT, stdio: 'inherit' });
  console.log('  ✓ validate passed');
} catch {
  console.log('  ✗ validate failed');
  hasErrors = true;
}

console.log('');
process.exit(hasErrors ? 1 : 0);
