#!/usr/bin/env node
/* ═══════════════════════════════════════════
   OptiFlow OS — Post-Merge Hook
   Detects dependency drift and warns
   of rebuild-requiring changes after merge.
   Exits 0 always (warnings only, no block).
   ═══════════════════════════════════════════ */
import { execSync } from 'node:child_process';
import { ROOT } from './_utils.mjs';

console.log('\n─ Post-Merge Check ─\n');

let changedFiles;
try {
  changedFiles = execSync('git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD', {
    encoding: 'utf-8',
    cwd: ROOT,
  }).trim().split('\n').filter(Boolean);
} catch {
  console.log('  ⚠ Could not determine changed files. Skipping.');
  process.exit(0);
}

if (changedFiles.length === 0) {
  console.log('  ✓ No files changed in merge.');
  process.exit(0);
}

// Check for package-lock.json changes
if (changedFiles.includes('package-lock.json')) {
  console.log('1. Dependency changes');
  console.log('  ⚠ package-lock.json changed. Running npm install...');
  try {
    execSync('npm install', { cwd: ROOT, stdio: 'inherit', timeout: 120000 });
    console.log('  ✓ npm install completed');
  } catch {
    console.log('  ⚠ npm install failed — run manually before building');
  }
} else {
  console.log('  ✓ No dependency changes');
}

// Check for rebuild-requiring data changes
const rebuildTriggers = ['site.json', 'assets/css/core.css'];
const needsRebuild = changedFiles.filter(f => rebuildTriggers.some(t => f.includes(t)));
if (needsRebuild.length > 0) {
  console.log('2. Rebuild required');
  console.log(`  ⚠ Changed: ${needsRebuild.join(', ')}`);
  console.log('  Run: npm run build');
} else {
  console.log('2. No rebuild-requiring changes');
}

console.log('');
process.exit(0);
