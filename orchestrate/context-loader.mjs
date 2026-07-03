/**
 * V4 Context loader — dynamic paths, budget-aware loading.
 * @module orchestrate/context-loader
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';
import { parseAllSpecs } from './spec-parser.mjs';
import { resolveAffectedSpecs } from './spec-resolver.mjs';
import { get as cacheGet, set as cacheSet, hashKey } from './cache-manager.mjs';
import { getBranch } from './project-scanner.mjs';
import { analyzeProject } from './project-analyzer.mjs';

const { projectRoot, siteJsonPath, designDir } = resolvePaths();

const ALWAYS_LOAD = [
  { key: 'site', path: siteJsonPath, type: 'json' },
  { key: 'design', path: designDir || '', type: 'dir' },
  { key: 'agents', path: resolve(projectRoot, 'AGENTS.md'), type: 'markdown' },
];

/**
 * Generate context loading order.
 */
export function loadContext(specNames = []) {
  const data = {};
  for (const item of ALWAYS_LOAD) {
    data[item.key] = { path: item.path, type: item.type, exists: existsSync(item.path) };
  }
  const specs = new Map();
  for (const name of specNames) {
    const specPath = resolve(projectRoot, 'openspec', 'specs', name, 'spec.md');
    specs.set(name, { path: specPath, exists: existsSync(specPath) });
  }
  return { data, specs };
}

/**
 * Load all context content into memory.
 */
export function loadAllContext(taskDescription) {
  const cacheKey = `context:${hashKey(taskDescription)}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const data = {};
  for (const item of ALWAYS_LOAD) {
    try {
      const raw = readFileSync(item.path, 'utf-8');
      data[item.key] = item.type === 'json' ? JSON.parse(raw) : raw;
      data[`${item.key}_lines`] = raw.split('\n').length;
    } catch {
      data[item.key] = null;
      data[`${item.key}_lines`] = 0;
    }
  }

  const allSpecs = parseAllSpecs();
  const affected = resolveAffectedSpecs(taskDescription, allSpecs);

  const result = { data, specs: allSpecs, affected };
  cacheSet(cacheKey, result, { ttl: 300000 });
  return result;
}

/**
 * V6: Load full project context for /opsx-auto mode.
 * Loads everything: site.json, DESIGN.md, all 23 specs, all 28 features,
 * resolves affected specs, and gathers project metadata.
 *
 * @param {string} taskDescription
 * @returns {{ site: object|null, design: string|null, features: object|null, specs: object[], affected: object[], branch: string, paths: object }}
 */
export function loadFullContext(taskDescription) {
  const cacheKey = `full-context:${hashKey(taskDescription)}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  let site = null;
  try { site = JSON.parse(readFileSync(siteJsonPath, 'utf-8')); } catch { /* missing */ }

  let design = null;
  try {
    const designPath = resolve(designDir, 'DESIGN.md');
    if (existsSync(designPath)) design = readFileSync(designPath, 'utf-8');
  } catch { /* missing */ }

  let features = null;
  try {
    const featuresPath = resolve(projectRoot, 'features', 'features.json');
    if (existsSync(featuresPath)) features = JSON.parse(readFileSync(featuresPath, 'utf-8'));
  } catch { /* missing */ }

  let specs = [];
  try { specs = parseAllSpecs(); } catch { /* missing */ }

  let affected = [];
  try { affected = resolveAffectedSpecs(taskDescription, specs); } catch { /* missing */ }

  let branch = 'unknown';
  try { branch = getBranch(); } catch { /* missing */ }

  const result = {
    site,
    design,
    features,
    specs,
    affected,
    branch,
    paths: { projectRoot, siteJsonPath, designDir },
  };

  cacheSet(cacheKey, result, { ttl: 300000 });
  return result;
}

/**
 * V6: Extended context loading with deep project analysis.
 * Combines loadFullContext with analyzeProject for full repository understanding.
 *
 * @param {string} taskDescription
 * @returns {{ site: object|null, design: string|null, features: object|null, specs: object[], affected: object[], branch: string, paths: object, projectAnalysis: object }}
 */
export function loadFullContextWithAnalysis(taskDescription) {
  const context = loadFullContext(taskDescription);
  let projectAnalysis = null;
  try { projectAnalysis = analyzeProject(); } catch { /* non-critical */ }

  return { ...context, projectAnalysis };
}
