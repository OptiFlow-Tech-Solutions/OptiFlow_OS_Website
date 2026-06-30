/**
 * Spec Indexer — builds searchable indices from OpenSpec specification files.
 * Provides spec-to-feature mapping, full-text search, and requirement lookup.
 *
 * @module orchestrate/spec-indexer
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, join } from 'path';
import { resolvePaths } from './config-resolver.mjs';
import { get as cacheGet, set as cacheSet } from './cache-manager.mjs';
import { parseAllSpecs } from './spec-parser.mjs';

const { projectRoot } = resolvePaths();
const ROOT = projectRoot;
const SPEC_CACHE_KEY = 'spec-index';
const SPEC_CACHE_TTL = 300000;

/**
 * Build a full-text index of all spec requirements for search.
 */
export function buildSpecIndex() {
  const cached = cacheGet(SPEC_CACHE_KEY);
  if (cached) return cached;

  const allSpecs = parseAllSpecs();
  const index = [];

  for (const spec of allSpecs) {
    for (const req of spec.requirements) {
      index.push({
        specName: spec.name,
        requirementName: req.name,
        description: req.description,
      });
    }
  }

  cacheSet(SPEC_CACHE_KEY, index, { ttl: SPEC_CACHE_TTL });
  return index;
}

/**
 * Search requirements by keyword.
 * @param {string} query
 * @param {string} [specName] - optional spec name filter
 */
export function searchRequirements(query, specName) {
  const index = buildSpecIndex();
  const tokens = query.toLowerCase().split(/\W+/).filter((w) => w.length > 1);

  let results = index;

  if (specName) {
    results = results.filter((r) => r.specName === specName);
  }

  results = results.filter((r) => {
    const text = `${r.specName} ${r.requirementName} ${r.description}`.toLowerCase();
    return tokens.some((t) => text.includes(t));
  });

  return results;
}

/**
 * Find requirements for a specific spec.
 */
export function findBySpec(specName) {
  const index = buildSpecIndex();
  return index.filter((r) => r.specName === specName);
}

/**
 * List all discovered spec names.
 */
export function listSpecNames() {
  const index = buildSpecIndex();
  return [...new Set(index.map((r) => r.specName))];
}

// ── Feature to Spec Resolution ──────────────────

let _featureIndex = null;
const FEATURE_CACHE_KEY = 'feature-spec-index';
const FEATURE_CACHE_TTL = 600000;

/**
 * Build a feature→spec mapping by loading features.json and matching by name.
 */
export function buildFeatureSpecIndex() {
  const cached = cacheGet(FEATURE_CACHE_KEY);
  if (cached) return cached;

  const featurePath = resolve(ROOT, 'features', 'features.json');
  if (!existsSync(featurePath)) return new Map();

  const registry = JSON.parse(readFileSync(featurePath, 'utf-8'));
  const index = new Map();

  // Keyword-based spec mapping (same logic as feature-router discoverSpecs)
  const keywordMap = {
    'design system': ['design-system'],
    'theming': ['design-system', 'dark-mode'],
    'navigation': ['shared-components'],
    'structure': ['shared-components'],
    'runtime': ['shared-components'],
    'interactive': ['shared-components'],
    'build': ['build-pipeline'],
    'deployment': ['build-pipeline'],
    'pipeline': ['build-pipeline'],
    'seo': ['seo'],
    'metadata': ['seo'],
    'home page': ['marketing-pages'],
    'home': ['marketing-pages'],
    'problem': ['marketing-pages'],
    'solutions': ['marketing-pages'],
    'product overview': ['marketing-pages'],
    'feature showcase': ['marketing-pages'],
    'features': ['marketing-pages'],
    'competitive': ['marketing-pages'],
    'positioning': ['marketing-pages'],
    'pricing': ['marketing-pages'],
    'plans': ['marketing-pages'],
    'newsletter': ['marketing-pages'],
    'content': ['marketing-pages'],
    'faq': ['marketing-pages'],
    'self-service': ['marketing-pages'],
    'demo': ['marketing-pages'],
    'contact': ['marketing-pages'],
    'support': ['marketing-pages'],
    'privacy': ['marketing-pages'],
    'terms': ['marketing-pages'],
    'conditions': ['marketing-pages'],
    'form processing': ['platform-api'],
    'api': ['platform-api'],
    'admin': ['platform-auth'],
    'authentication': ['platform-auth'],
    'dashboard': ['platform-auth'],
    'email': ['platform-email'],
    'notifications': ['platform-email'],
    'database': ['platform-database'],
    'data management': ['platform-database'],
    'monitoring': ['platform-monitoring'],
    'observability': ['platform-monitoring'],
    'accessibility': ['accessibility'],
    'testing': ['build-pipeline'],
    'code quality': ['build-pipeline'],
    'performance': ['build-pipeline'],
    'orchestration': ['orchestration-engine'],
    'engine': ['orchestration-engine'],
    'git': ['build-pipeline'],
    'hooks': ['build-pipeline'],
    'automation': ['build-pipeline'],
  };

  for (const feature of registry.features) {
    const nameLower = feature.name.toLowerCase();
    const specs = keywordMap[nameLower] || [];
    index.set(feature.id, specs);
  }

  cacheSet(FEATURE_CACHE_KEY, index, { ttl: FEATURE_CACHE_TTL });
  return index;
}

/**
 * Find requirements relevant to a specific feature.
 */
export function findByFeature(featureId) {
  const featureSpecIndex = buildFeatureSpecIndex();
  const specFiles = featureSpecIndex.get(featureId) || [];
  if (!specFiles.length) return [];

  const allSpecs = parseAllSpecs();
  const results = [];

  for (const specName of specFiles) {
    const spec = allSpecs.find((s) => s.name === specName);
    if (!spec) continue;

    for (const req of spec.requirements) {
      results.push({
        specName: spec.name,
        requirementName: req.name,
        description: req.description,
      });
    }
  }

  return results;
}

/**
 * Search features by keyword.
 */
export function searchFeatures(query) {
  const featurePath = resolve(ROOT, 'features', 'features.json');
  if (!existsSync(featurePath)) return [];

  const registry = JSON.parse(readFileSync(featurePath, 'utf-8'));
  const queryTokens = query.toLowerCase().split(/\W+/).filter((w) => w.length > 2);

  return registry.features
    .filter((f) => {
      const text = `${f.id} ${f.name}`.toLowerCase();
      return queryTokens.some((t) => text.includes(t));
    })
    .map((f) => ({ id: f.id, name: f.name }));
}
