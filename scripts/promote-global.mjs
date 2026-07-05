import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, join, dirname } from 'path';

const __dirname = import.meta.dirname || dirname(new (globalThis.URL)(import.meta.url).pathname);
const PROJECT_ROOT = resolve(__dirname, '..');
const GLOBAL_ROOT = resolve(process.env.USERPROFILE, '.config', 'opencode');

const PROJECT_CMD_DIR = join(PROJECT_ROOT, '.opencode', 'commands');
const GLOBAL_CMD_DIR = join(GLOBAL_ROOT, 'commands');
const PROJECT_SKILL_DIR = join(PROJECT_ROOT, '.opencode', 'skills');
const GLOBAL_SKILL_DIR = join(GLOBAL_ROOT, 'skills');

const results = { promoted: [], skipped: [], errors: [] };

// ── Promote Commands ──
const opsxCommands = ['opsx-auto.md', 'opsx-explore.md', 'opsx-propose.md', 'opsx-sync.md', 'opsx-apply.md', 'opsx-verify.md', 'opsx-archive.md'];

console.log('');
console.log('='.repeat(64));
console.log('  GLOBAL PROMOTION — Commands');
console.log('='.repeat(64));

for (const cmd of opsxCommands) {
  const src = join(PROJECT_CMD_DIR, cmd);
  const dst = join(GLOBAL_CMD_DIR, cmd);

  if (!existsSync(src)) {
    results.errors.push(`Source missing: ${cmd}`);
    console.log(`  SKIP: ${cmd} — source not found`);
    continue;
  }

  const projectContent = readFileSync(src, 'utf-8');

  if (!existsSync(dst)) {
    results.errors.push(`Global target missing: ${cmd}`);
    console.log(`  SKIP: ${cmd} — global target not found`);
    continue;
  }

  const globalContent = readFileSync(dst, 'utf-8');

  // Compare — only promote if changed
  if (projectContent === globalContent) {
    results.skipped.push(`${cmd} (identical)`);
    console.log(`  SKIP: ${cmd} — already identical`);
    continue;
  }

  writeFileSync(dst, projectContent, 'utf-8');
  results.promoted.push(`${cmd} (${globalContent.length} → ${projectContent.length} bytes)`);
  console.log(`  SYNC: ${cmd} — promoted (${globalContent.length} → ${projectContent.length} bytes)`);
}

// ── Promote Skills ──
const openspecSkills = ['openspec-auto', 'openspec-explore', 'openspec-propose', 'openspec-sync', 'openspec-apply', 'openspec-verify', 'openspec-archive'];

console.log('');
console.log('='.repeat(64));
console.log('  GLOBAL PROMOTION — Skills');
console.log('='.repeat(64));

for (const skill of openspecSkills) {
  const srcPath = join(PROJECT_SKILL_DIR, skill, 'SKILL.md');
  const dstDir = join(GLOBAL_SKILL_DIR, skill);
  const dstPath = join(dstDir, 'SKILL.md');

  if (!existsSync(srcPath)) {
    results.errors.push(`Source missing: ${skill}/SKILL.md`);
    console.log(`  SKIP: ${skill} — source not found`);
    continue;
  }

  if (!existsSync(dstPath)) {
    results.errors.push(`Global target missing: ${skill}/SKILL.md`);
    console.log(`  SKIP: ${skill} — global target not found`);
    continue;
  }

  const projectContent = readFileSync(srcPath, 'utf-8');
  const globalContent = readFileSync(dstPath, 'utf-8');

  if (projectContent === globalContent) {
    results.skipped.push(`${skill} (identical)`);
    console.log(`  SKIP: ${skill} — already identical`);
    continue;
  }

  writeFileSync(dstPath, projectContent, 'utf-8');
  results.promoted.push(`${skill} (${globalContent.length} → ${projectContent.length} bytes)`);
  console.log(`  SYNC: ${skill} — promoted (${globalContent.length} → ${projectContent.length} bytes)`);
}

// ── Summary ──
console.log('');
console.log('='.repeat(64));
console.log('  PROMOTION SUMMARY');
console.log('='.repeat(64));
console.log(`  Promoted:  ${results.promoted.length}`);
console.log(`  Skipped:   ${results.skipped.length}`);
console.log(`  Errors:    ${results.errors.length}`);
console.log('='.repeat(64));

if (results.promoted.length) {
  console.log('');
  console.log('Promoted:');
  results.promoted.forEach(p => console.log(`  + ${p}`));
}

if (results.skipped.length) {
  console.log('');
  console.log('Skipped (already identical):');
  results.skipped.forEach(s => console.log(`  - ${s}`));
}

if (results.errors.length) {
  console.log('');
  console.log('Errors:');
  results.errors.forEach(e => console.log(`  ! ${e}`));
}

// ── Final Status ──
if (results.errors.length === 0 && results.promoted.some(_p => true)) {
  console.log('');
  console.log('  RESULT: Global promotion complete — changes synced successfully.');
} else if (results.errors.length === 0 && results.promoted.length === 0) {
  console.log('');
  console.log('  RESULT: No changes needed — global and project are in sync.');
} else {
  console.log('');
  console.log(`  RESULT: ${results.errors.length} error(s) — some files could not be promoted.`);
}

process.exit(results.errors.length > 0 ? 1 : 0);
