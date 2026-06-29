/**
 * V4 Context loader — dynamic paths, budget-aware loading.
 * @module orchestrate/context-loader
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';
import { parseAllSpecs } from './spec-parser.mjs';
import { resolveAffectedSpecs } from './spec-resolver.mjs';
import { get as cacheGet, set as cacheSet } from './cache-manager.mjs';

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
 * Ordered context loading list.
 */
export function contextLoadingOrder() {
  return ALWAYS_LOAD.map(({ key, path, type }) => ({ key, path, type }));
}

/**
 * Load all context content into memory.
 */
export function loadAllContext(taskDescription) {
  const cacheKey = `context:${taskDescription.slice(0, 80)}`;
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
 * Print context summary.
 */
export function getContextSummary(context) {
  const specReq = context.specs.reduce((s, sp) => s + sp.requirementCount, 0);
  const specScen = context.specs.reduce((s, sp) => s + sp.scenarioCount, 0);
  const lines = [
    `Loaded: site.json (${context.data.site_lines || '?'} lines),`,
    `DESIGN.md (${context.data.design_lines || '?'} lines),`,
    `${context.specs.length} specs (${specReq} requirements, ${specScen} scenarios)`,
  ];
  console.log(lines.join(' '));
  return lines.join(' ');
}
