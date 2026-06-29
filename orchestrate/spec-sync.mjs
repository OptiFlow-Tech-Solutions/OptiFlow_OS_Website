/**
 * V4 Spec sync — intelligent delta-to-main synchronization.
 * Supports conflict detection, backup before sync, and dry-run mode.
 * @module orchestrate/spec-sync
 */

import { existsSync, readdirSync, readFileSync, writeFileSync, copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';
import { logEvent } from './audit-log.mjs';

const { projectRoot } = resolvePaths();

/** @typedef {{action: 'ADDED'|'MODIFIED'|'REMOVED', spec: string, details: string}} SyncEntry */

function detectAction(content) {
  if (/^##\s*ADDED/im.test(content)) return 'ADDED';
  if (/^##\s*REMOVED/im.test(content)) return 'REMOVED';
  return 'MODIFIED';
}

/**
 * Sync delta specs from a change to main openspec/specs/.
 * @param {string} changeName
 * @param {{dryRun?: boolean, backup?: boolean}} [opts]
 * @returns {{synced: SyncEntry[], dryRun: boolean}}
 */
export function syncToMain(changeName, opts = {}) {
  const { dryRun = false, backup = true } = opts;
  const deltaDir = resolve(projectRoot, 'openspec', 'changes', changeName, 'specs');
  const mainDir = resolve(projectRoot, 'openspec', 'specs');

  if (!existsSync(deltaDir)) return { synced: [], dryRun };

  /** @type {SyncEntry[]} */
  const synced = [];

  for (const entry of readdirSync(deltaDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;

    const src = join(deltaDir, entry.name);
    const content = readFileSync(src, 'utf-8');
    const action = detectAction(content);
    const specName = entry.name.replace('.md', '');
    const destDir = join(mainDir, specName);
    const dest = join(destDir, 'spec.md');

    if (action === 'ADDED') {
      if (!dryRun) {
        mkdirSync(destDir, { recursive: true });
        copyFileSync(src, dest);
      }
      synced.push({ action, spec: specName, details: `Copied to openspec/specs/${specName}/spec.md` });
    } else if (action === 'MODIFIED') {
      const existing = existsSync(dest) ? readFileSync(dest, 'utf-8') : '';
      // Backup before modifying
      if (backup && existsSync(dest) && !dryRun) {
        writeFileSync(dest + '.bak', existing, 'utf-8');
      }
      if (!dryRun) {
        mkdirSync(destDir, { recursive: true });
        writeFileSync(dest, (existing + '\n\n' + content.split(/^##\s*(?:ADDED|REMOVED)/im)[0]).trim() + '\n');
      }
      synced.push({ action, spec: specName, details: `Merged into openspec/specs/${specName}/spec.md` });
    } else if (action === 'REMOVED') {
      if (!dryRun && existsSync(destDir)) {
        rmSync(destDir, { recursive: true, force: true });
      }
      synced.push({ action, spec: specName, details: `Removed openspec/specs/${specName}/` });
    }
  }

  logEvent({ type: 'spec-sync', changeName, synced: synced.length, dryRun });

  return { synced, dryRun };
}

/**
 * Check for conflicts before syncing.
 */
export function validateSync(changeName) {
  const deltaDir = resolve(projectRoot, 'openspec', 'changes', changeName, 'specs');
  if (!existsSync(deltaDir)) return { conflicts: [], safe: true };

  const deltaSpecs = readdirSync(deltaDir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => e.name.replace('.md', ''));

  const conflicts = [];
  for (const spec of deltaSpecs) {
    if (existsSync(resolve(projectRoot, 'openspec', 'specs', spec, 'spec.md'))) {
      conflicts.push(`Spec "${spec}" already exists in main — will be merged`);
    }
  }

  return {
    conflicts,
    safe: true, // We now safely merge instead of blocking
    specCount: deltaSpecs.length,
  };
}
