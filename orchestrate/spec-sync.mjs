/**
 * V4 Spec sync — intelligent delta-to-main synchronization.
 * Supports conflict detection, backup before sync, and dry-run mode.
 * V7: Deduplicates requirement sections on repeated syncs.
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

// ponytail: split content into requirement blocks keyed by "### Requirement: <name>"
function parseRequirements(content) {
  const map = new Map();
  const blocks = content.split(/(?=###\s+Requirement:)/);
  for (const block of blocks) {
    const match = block.match(/^###\s+Requirement:\s*(.+)/m);
    if (match) map.set(match[1].trim(), block.trim());
  }
  return map;
}

function mergeRequirements(existing, delta, _opts = {}) {
  const existingReqs = parseRequirements(existing);
  const deltaReqs = parseRequirements(delta);
  const allNames = new Set([...existingReqs.keys(), ...deltaReqs.keys()]);
  const blocks = [];
  for (const name of allNames) {
    if (deltaReqs.has(name)) {
      blocks.push(deltaReqs.get(name));
    } else if (existingReqs.has(name)) {
      blocks.push(existingReqs.get(name));
    }
  }
  const trimmed = blocks.join('\n\n').trim();
  if (!trimmed) return '';
  const purposeMatch = existing.match(/^##\s*Purpose[\s\S]*?(?=###\s+Requirement:)/m);
  const newDeltaMatch = delta.match(/^##\s*Purpose[\s\S]*?(?=###\s+Requirement:)/m);
  const purposeBlock = newDeltaMatch
    ? newDeltaMatch[0].trim()
    : purposeMatch
      ? purposeMatch[0].trim()
      : '## Purpose\n\nTBD\n';
  return `${purposeBlock}\n\n${trimmed}\n`;
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
        const merged = mergeRequirements(existing, content);
        writeFileSync(dest, merged);
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
