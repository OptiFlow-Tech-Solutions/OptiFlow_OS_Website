/**
 * V4: Semantic spec resolution.
 * Determines which specs are affected by a change using the spec indexer
 * for intelligent matching, falling back to token overlap scoring.
 * @module orchestrate/spec-resolver
 */

import { search } from './spec-indexer.mjs';
import { get as cacheGet, set as cacheSet } from './cache-manager.mjs';

/**
 * Compute keyword overlap score between task description and spec content.
 * Fallback when spec-indexer isn't available.
 */
function overlapScore(taskDescription, parsedSpec) {
  const taskWords = new Set(taskDescription.toLowerCase().split(/\W+/).filter(Boolean));
  const specWords = new Set();
  for (const req of parsedSpec.requirements) {
    const text = `${req.name} ${req.description}`.toLowerCase().split(/\W+/);
    for (const w of text) specWords.add(w);
  }
  for (const d of parsedSpec.domains) specWords.add(d);
  const intersection = [...taskWords].filter((w) => specWords.has(w) && w.length > 2);
  if (intersection.length === 0) return 0;
  const domainBonus = parsedSpec.domains.some((d) => taskDescription.toLowerCase().includes(d)) ? 0.3 : 0;
  return Math.min(1, (intersection.length / taskWords.size) * 0.7 + domainBonus);
}

/**
 * Resolve which specs are affected by a task description.
 * V4: Uses spec-indexer search for semantic matching, falls back to token scoring.
 * @param {string} taskDescription
 * @param {ReturnType<typeof import('./spec-parser.mjs').parseAllSpecs>} parsedSpecs
 * @returns {Array<{specName: string, requirements: string[], confidence: number}>}
 */
export function resolveAffectedSpecs(taskDescription, parsedSpecs) {
  const cacheKey = `spec-resolve:${taskDescription.slice(0, 80)}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  // Primary: spec-indexer search
  try {
    const results = search(taskDescription, { minScore: 0.05, limit: 10 });
    if (results.length > 0) {
      const grouped = new Map();
      for (const r of results) {
        if (!grouped.has(r.specName)) grouped.set(r.specName, { requirements: [], totalScore: 0 });
        const entry = grouped.get(r.specName);
        entry.requirements.push(r.requirementName);
        entry.totalScore += r.score;
      }
      const resolved = [...grouped.entries()]
        .map(([specName, { requirements, totalScore }]) => ({
          specName,
          requirements,
          confidence: Math.round(Math.min(1, totalScore / results.length) * 100) / 100,
        }))
        .sort((a, b) => b.confidence - a.confidence);

      cacheSet(cacheKey, resolved, { ttl: 300000 });
      return resolved;
    }
  } catch { /* indexer unavailable — use fallback */ }

  // Fallback: token overlap
  const resolved = parsedSpecs
    .map((spec) => ({
      specName: spec.name,
      requirements: spec.requirements.map((r) => r.name),
      confidence: Math.round(overlapScore(taskDescription, spec) * 100) / 100,
    }))
    .filter((s) => s.confidence > 0)
    .sort((a, b) => b.confidence - a.confidence);

  cacheSet(cacheKey, resolved, { ttl: 300000 });
  return resolved;
}

/**
 * Get unique spec names from affected specs.
 */
export function getAffectedDomains(affectedSpecs) {
  return [...new Set(affectedSpecs.map((s) => s.specName))];
}

/**
 * Get all requirements for a spec by name.
 */
export function getSpecRequirements(specName, parsedSpecs) {
  const spec = parsedSpecs.find((s) => s.name === specName);
  return spec ? spec.requirements.map((r) => r.name) : [];
}
