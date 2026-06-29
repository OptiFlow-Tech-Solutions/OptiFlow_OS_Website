/**
 * Full-text searchable index of all OpenSpec requirements and scenarios.
 * Supports keyword, domain, and semantic-style search across all specs.
 * @module orchestrate/spec-indexer
 */

import { parseAllSpecs } from './spec-parser.mjs';
import { get as cacheGet, set as cacheSet } from './cache-manager.mjs';

const CACHE_KEY = 'spec-index';
const CACHE_TTL = 600000; // 10min

/**
 * @typedef {{
 *   specName: string,
 *   requirementName: string,
 *   description: string,
 *   scenarios: {name: string, given: string, when: string, then: string}[],
 *   domains: string[],
 *   tokens: Set<string>
 * }} IndexEntry
 */

/**
 * Build a searchable index of all spec requirements.
 * @returns {IndexEntry[]}
 */
export function buildIndex() {
  const cached = cacheGet(CACHE_KEY);
  if (cached) return cached;

  const specs = parseAllSpecs();
  const entries = [];

  for (const spec of specs) {
    for (const req of spec.requirements) {
      const allText = `${req.name} ${req.description} ${req.scenarios.map((s) => `${s.given} ${s.when} ${s.then}`).join(' ')}`;
      const tokens = new Set(allText.toLowerCase().split(/\W+/).filter((w) => w.length > 2));

      entries.push({
        specName: spec.name,
        requirementName: req.name,
        description: req.description,
        scenarios: req.scenarios,
        domains: spec.domains,
        tokens,
      });
    }
  }

  cacheSet(CACHE_KEY, entries, { ttl: CACHE_TTL });
  return entries;
}

/**
 * Search requirements by keyword query.
 * @param {string} query
 * @param {{minScore?: number, limit?: number}} [opts]
 * @returns {Array<{specName: string, requirementName: string, description: string, score: number}>}
 */
export function search(query, { minScore = 0.1, limit = 20 } = {}) {
  const index = buildIndex();
  const queryTokens = query.toLowerCase().split(/\W+/).filter((w) => w.length > 2);

  if (!queryTokens.length) return [];

  const results = index.map((entry) => {
    let score = 0;
    for (const qt of queryTokens) {
      if (entry.tokens.has(qt)) score += 1;
      // Partial match bonus
      for (const et of entry.tokens) {
        if (et.includes(qt) || qt.includes(et)) score += 0.5;
      }
    }
    // Domain bonus
    for (const d of entry.domains) {
      if (queryTokens.includes(d)) score += 2;
    }
    return {
      specName: entry.specName,
      requirementName: entry.requirementName,
      description: entry.description,
      score: entry.tokens.size ? score / Math.max(entry.tokens.size, queryTokens.length) : 0,
    };
  });

  return results
    .filter((r) => r.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Find requirements that reference specific domains.
 * @param {string[]} domains
 * @returns {Array<{specName: string, requirementName: string, domains: string[]}>}
 */
export function findByDomain(domains) {
  const index = buildIndex();
  return index
    .filter((e) => domains.some((d) => e.domains.includes(d)))
    .map((e) => ({
      specName: e.specName,
      requirementName: e.requirementName,
      domains: e.domains,
    }));
}

/**
 * Find cross-spec dependencies — requirements that share tokens.
 * @param {string} specName
 * @returns {Array<{source: string, target: string, sharedTokens: string[]}>}
 */
export function findDependencies(specName) {
  const index = buildIndex();
  const sourceEntries = index.filter((e) => e.specName === specName);
  const targets = index.filter((e) => e.specName !== specName);

  const deps = [];
  for (const src of sourceEntries) {
    for (const tgt of targets) {
      const shared = [...src.tokens].filter((t) => tgt.tokens.has(t) && t.length > 3);
      if (shared.length >= 3) {
        deps.push({
          source: `${src.specName}:${src.requirementName}`,
          target: `${tgt.specName}:${tgt.requirementName}`,
          sharedTokens: shared.slice(0, 10),
        });
      }
    }
  }

  return deps;
}

/**
 * Summarize all specs — counts and domain coverage.
 * @returns {{totalSpecs: number, totalRequirements: number, totalScenarios: number, domains: string[]}}
 */
export function summarize() {
  const specs = parseAllSpecs();
  return {
    totalSpecs: specs.length,
    totalRequirements: specs.reduce((s, sp) => s + sp.requirementCount, 0),
    totalScenarios: specs.reduce((s, sp) => s + sp.scenarioCount, 0),
    domains: [...new Set(specs.flatMap((sp) => sp.domains))],
  };
}
