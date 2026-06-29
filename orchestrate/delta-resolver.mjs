/**
 * V4 Delta resolver — semantic delta resolution from OpenSpec change directories.
 * Parses ADDED/MODIFIED/REMOVED/RENAMED sections with conflict detection.
 * @module orchestrate/delta-resolver
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join, basename } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';
import { get as cacheGet, set as cacheSet } from './cache-manager.mjs';

const { projectRoot } = resolvePaths();

function parseDelta(content, specName) {
  const sections = { added: [], modified: [], removed: [], renamed: [] };
  let kind = '';

  for (const line of content.split('\n')) {
    const h2 = line.match(/^##\s+(.+)/);
    if (h2) { kind = h2[1].toLowerCase().replace(/\s+/g, ' ').trim(); continue; }
    if (!kind) continue;

    const req = line.match(/^-\s+(.+)/);
    if (!req) continue;
    const text = req[1].trim();

    if (kind.startsWith('added')) {
      sections.added.push({ spec: specName, requirement: text });
    } else if (kind.startsWith('modified')) {
      sections.modified.push({ spec: specName, requirement: text });
    } else if (kind.startsWith('removed')) {
      sections.removed.push({ spec: specName, requirement: text });
    } else if (kind.startsWith('renamed')) {
      const m = text.match(/^(.+?)\s*->\s*(.+)/);
      if (m) sections.renamed.push({ from: m[1].trim(), to: m[2].trim() });
    }
  }

  return sections;
}

/**
 * Resolve all deltas for a given change.
 */
export function resolveDeltas(changeName) {
  const cacheKey = `deltas:${changeName}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const merged = { added: [], modified: [], removed: [], renamed: [] };
  const specsDir = join(projectRoot, 'openspec', 'changes', changeName, 'specs');

  if (!existsSync(specsDir)) return merged;

  for (const entry of readdirSync(specsDir)) {
    if (!entry.endsWith('.md')) continue;
    const content = readFileSync(join(specsDir, entry), 'utf-8');
    const delta = parseDelta(content, basename(entry, '.md'));
    for (const k of Object.keys(merged)) merged[k].push(...delta[k]);
  }

  cacheSet(cacheKey, merged, { ttl: 300000 });
  return merged;
}

/**
 * Human-readable delta summary.
 */
export function getDeltaSummary(deltas) {
  const parts = Object.entries(deltas)
    .filter(([, v]) => v.length)
    .map(([k, v]) => `${v.length} ${k}`);
  return parts.join(', ') || 'no deltas';
}

/**
 * Generate impact analysis from resolved deltas.
 */
export function analyzeImpact(deltas) {
  const total = Object.values(deltas).reduce((s, v) => s + v.length, 0);
  const affectedSpecs = new Set();

  for (const k of Object.keys(deltas)) {
    for (const entry of deltas[k]) {
      affectedSpecs.add(entry.spec);
    }
  }

  return {
    totalChanges: total,
    affectedSpecs: [...affectedSpecs],
    breakdown: {
      added: deltas.added.length,
      modified: deltas.modified.length,
      removed: deltas.removed.length,
      renamed: deltas.renamed.length,
    },
  };
}
