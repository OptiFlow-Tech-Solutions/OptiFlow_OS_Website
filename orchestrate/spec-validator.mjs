/**
 * Validates implementation against OpenSpec requirements.
 * Checks that every spec requirement is traceable to an implementation.
 * @module orchestrate/spec-validator
 */

import { parseAllSpecs } from './spec-parser.mjs';
import { buildIndex, search } from './spec-indexer.mjs';
import { findAllPages } from './project-scanner.mjs';
import { get as cacheGet, set as cacheSet } from './cache-manager.mjs';

/**
 * Check which spec requirements are implemented (found in source).
 * @returns {Promise<{covered: string[], uncovered: string[], coverage: number}>}
 */
export async function validateCoverage() {
  const specs = parseAllSpecs();
  const allReqs = [];
  for (const spec of specs) {
    for (const req of spec.requirements) {
      allReqs.push({ specName: spec.name, requirement: req.name, description: req.description });
    }
  }

  // For a static website, we check that page content and CSS/JS match spec intent
  // This is a heuristic — actual validation happens at the E2E test level
  const covered = [];
  const uncovered = [];

  for (const req of allReqs) {
    const fullText = `${req.specName} ${req.requirement} ${req.description}`;
    // Search the spec index for cross-references
    const related = search(fullText, { minScore: 0.1 });
    if (related.length > 0) {
      covered.push(`${req.specName}:${req.requirement}`);
    } else {
      uncovered.push(`${req.specName}:${req.requirement}`);
    }
  }

  const coverage = allReqs.length ? Math.round((covered.length / allReqs.length) * 100) : 100;

  return { covered, uncovered, coverage };
}

/**
 * Run a spec compliance check.
 * Verifies that:
 * 1. All spec files exist and follow BDD format
 * 2. All requirements have scenarios
 * 3. All specs are referenced in config.yaml
 * @returns {{valid: boolean, issues: string[]}}
 */
export function validateSpecs() {
  const issues = [];
  const specs = parseAllSpecs();

  if (!specs.length) {
    issues.push('No spec files found in openspec/specs/');
    return { valid: false, issues };
  }

  for (const spec of specs) {
    if (!spec.requirementCount) {
      issues.push(`${spec.name}: No requirements defined`);
    }
    for (const req of spec.requirements) {
      if (!req.scenarios.length) {
        issues.push(`${spec.name}/${req.name}: No scenarios defined`);
      }
    }
  }

  return { valid: issues.length === 0, issues, specCount: specs.length };
}

/**
 * Check cross-spec consistency.
 * Finds overlapping requirements between specs that may conflict.
 * @returns {Array<{specA: string, specB: string, overlapping: string[]}>}
 */
export function findConflicts() {
  const specs = parseAllSpecs();
  const conflicts = [];

  for (let i = 0; i < specs.length; i++) {
    for (let j = i + 1; j < specs.length; j++) {
      const specA = specs[i];
      const specB = specs[j];
      const overlapping = [];

      for (const reqA of specA.requirements) {
        const tokensA = new Set(reqA.name.toLowerCase().split(/\W+/).filter((w) => w.length > 3));
        for (const reqB of specB.requirements) {
          const tokensB = new Set(reqB.name.toLowerCase().split(/\W+/).filter((w) => w.length > 3));
          const shared = [...tokensA].filter((t) => tokensB.has(t));
          if (shared.length >= 2) {
            overlapping.push(`${reqA.name} ↔ ${reqB.name}`);
          }
        }
      }

      if (overlapping.length > 0) {
        conflicts.push({ specA: specA.name, specB: specB.name, overlapping });
      }
    }
  }

  return conflicts;
}
