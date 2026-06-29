/**
 * Routes hooks into the orchestration pipeline based on phase.
 * Scans hooks/ directory for available hook definitions.
 * @module orchestrate/hook-router
 */

import { readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = resolve(import.meta.dirname || '.', '..');
const HOOKS_DIR = join(ROOT, 'hooks');

/** @type {Readonly<Record<string, {pre: string[], post: string[]}>>} */
const PHASE_HOOKS = Object.freeze({
  explore: { pre: [], post: [] },
  propose: { pre: ['pre-build', 'theme-change'], post: [] },
  apply: { pre: ['pre-build', 'theme-change'], post: ['post-build', 'pre-commit'] },
  verify: { pre: ['pre-build'], post: ['post-build', 'post-deploy'] },
  archive: { pre: ['pre-commit', 'pre-push'], post: [] },
});

const GLOBAL_PRE = Object.freeze(['pre-build']);

/**
 * Route hooks for a given phase and optional context.
 * @param {string} phase
 * @param {Record<string, any>} [context]
 * @returns {{preHooks: string[], postHooks: string[]}}
 */
export function routeHooks(phase, context = {}) {
  const phaseDef = PHASE_HOOKS[phase] || { pre: [], post: [] };
  const pre = [...new Set([...GLOBAL_PRE, ...phaseDef.pre])];
  const post = [...new Set(phaseDef.post)];
  return { preHooks: pre, postHooks: post };
}

/**
 * Scan hooks/ directory for all .mjs files.
 * @returns {Array<{name: string, path: string}>}
 */
export function availableHooks() {
  try {
    return readdirSync(HOOKS_DIR)
      .filter((f) => f.endsWith('.mjs'))
      .map((f) => ({ name: f.slice(0, -4), path: join(HOOKS_DIR, f) }));
  } catch {
    return [];
  }
}
