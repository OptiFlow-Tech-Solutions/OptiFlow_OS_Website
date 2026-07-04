/**
 * V5: On-demand capability loading. Reads and caches individual skill/rule/doc files
 * from monorepos and skill directories only when needed. Avoids loading entire monorepos.
 * @module orchestrate/lazy-loader
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { get as cacheGet, set as cacheSet, del as cacheDel } from './cache-manager.mjs';
import { getCapability } from './capability-registry.mjs';

const CACHE_PREFIX = 'lazy:';
const CACHE_TTL = 1800000; // 30min

/**
 * Load a capability's source file content on demand.
 * @param {string} skillName
 * @returns {{ content: string, path: string, name: string, loaded: boolean, source?: string }|null}
 */
export function loadSkillContent(skillName) {
  const cacheKey = CACHE_PREFIX + skillName;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const cap = getCapability('skill', skillName);
  if (!cap) return null;

  const filePath = cap.path;
  if (!filePath || !existsSync(filePath)) return null;

  try {
    const content = readFileSync(filePath, 'utf-8');
    const result = { content, path: filePath, name: cap.name, loaded: true, source: cap.source };
    cacheSet(cacheKey, result, { ttl: CACHE_TTL });
    return result;
  } catch {
    return null;
  }
}

/**
 * Load multiple capabilities at once.
 * @param {string[]} skillNames
 * @returns {Map<string, object|null>}
 */
export function loadSkillContents(skillNames) {
  const results = new Map();
  for (const name of skillNames) {
    results.set(name, loadSkillContent(name));
  }
  return results;
}

/**
 * Load resource files from a monorepo skill.
 * @param {string} skillName
 * @param {'rules'|'specs'|'templates'|'plans'|'docs'} resourceType
 * @returns {{ files: Array<{path: string, content: string}>, count: number }}
 */
export function loadMonorepoResources(skillName, resourceType) {
  const cap = getCapability('skill', skillName);
  if (!cap || !cap.sourceRoot) return { files: [], count: 0 };

  const dirMap = { rules: ['rules'], specs: ['specs'], templates: ['templates'], plans: ['plans'], docs: ['docs', 'contributing'] };
  const dirs = dirMap[resourceType] || [];
  if (!dirs.length) return { files: [], count: 0 };

  const filePaths = [];
  for (const dir of dirs) {
    const fullDir = join(cap.sourceRoot, dir);
    if (!existsSync(fullDir)) continue;
    walkDir(fullDir, filePaths);
  }

  const files = filePaths.map((p) => {
    try { return { path: p, content: readFileSync(p, 'utf-8') }; }
    catch { return { path: p, content: '' }; }
  });

  return { files, count: files.length };
}

function walkDir(dir, results) {
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(full, results);
      } else if (/\.(md|mdx|mdc|csv|json)$/.test(entry.name)) {
        results.push(full);
      }
    }
  } catch { /* skip inaccessible dirs */ }
}

/**
 * Check which V5 skills are already cached.
 * @param {string[]} skillNames
 * @returns {{ loaded: string[], missing: string[] }}
 */
export function checkPreloaded(skillNames) {
  const loaded = [];
  const missing = [];
  for (const name of skillNames) {
    if (cacheGet(CACHE_PREFIX + name)) loaded.push(name);
    else missing.push(name);
  }
  return { loaded, missing };
}

/**
 * Invalidate lazy-load cache for a skill.
 */
export function invalidateSkill(skillName) {
  cacheDel(CACHE_PREFIX + skillName);
}
