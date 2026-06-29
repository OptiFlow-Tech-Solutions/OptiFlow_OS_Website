#!/usr/bin/env node
/* ───────────────────────────────────────────
   OptiFlow OS — Pre-Push Hook
   Validates, builds, and verifies the site
   before allowing a push to proceed.
   Exits 0 on clean, 1 on blocked.
   ─────────────────────────────────────────── */
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

function run(label, command) {
  console.log(`\n─ ${label}`);
  try {
    execSync(command, { cwd: ROOT, stdio: 'inherit' });
    return 0;
  } catch {
    return 1;
  }
}

console.log('\n─── Pre-Push ───\n');

const step1 = run('Pre-build validation', 'node hooks/pre-build.mjs');
if (step1 !== 0) {
  console.log('\n  ✗ push blocked: pre-build failed');
  process.exit(1);
}

const step2 = run('Build', 'node scripts/assemble.mjs');
if (step2 !== 0) {
  console.log('\n  ✗ push blocked: build failed');
  process.exit(1);
}

const step3 = run('Validate', 'node scripts/validate.mjs');
if (step3 !== 0) {
  console.log('\n  ✗ push blocked: validate failed');
  process.exit(1);
}

console.log('\n  ✓ ready to push\n');
process.exit(0);
