/**
 * Maps a project phase and task tier to the appropriate ECC agent.
 * @module orchestrate/agent-selector
 */

/** @type {Record<string, string>} */
const PHASE_AGENTS = {
  plan: 'planner',
  architect: 'architect',
  implement: 'tdd-guide',
  review: 'code-reviewer',
  security: 'security-reviewer',
  refactor: 'refactor-cleaner',
  docs: 'doc-updater',
  'build-fix': 'build-error-resolver',
  explore: 'explore',
  e2e: 'e2e-runner',
  'node-review': 'typescript-reviewer',
  loop: 'loop-operator',
  mine: 'spec-miner',
};

const ALL_PHASES = Object.freeze([
  'plan', 'architect', 'implement', 'review', 'security', 'refactor', 'docs', 'build-fix', 'explore',
  'e2e', 'node-review', 'loop', 'mine',
]);

/**
 * Default phase sequence for a standard change.
 * @type {string[]}
 */
export const DEFAULT_PHASES = Object.freeze(['explore', 'plan', 'implement', 'review']);

/**
 * Select the agent for a given phase, adjusting for task tier.
 * @param {string} phase - The project phase name
 * @param {'standard'|'large'|'trivial'} [tier='standard'] - Task size tier
 * @returns {{agent: string, skipPhases: string[]}} Agent name and phases to skip
 */
export function selectAgent(phase, tier = 'standard') {
  const skipPhases = [];

  if (tier === 'trivial') {
    skipPhases.push('plan', 'architect');
    if (phase === 'plan') return { agent: PHASE_AGENTS.implement, skipPhases };
    return { agent: PHASE_AGENTS[phase] || 'explore', skipPhases };
  }

  if (tier === 'large' && phase === 'plan') {
    return { agent: PHASE_AGENTS.architect, skipPhases };
  }

  return { agent: PHASE_AGENTS[phase] || 'explore', skipPhases };
}

/**
 * Get the full agent map for all standard phases at a given tier.
 * @param {'standard'|'large'|'trivial'} [tier='standard'] - Task size tier
 * @returns {Record<string, string>} Phase → agent mapping
 */
export function agentMap(tier = 'standard') {
  /** @type {Record<string, string>} */
  const map = {};
  for (const phase of ALL_PHASES) {
    map[phase] = selectAgent(phase, tier).agent;
  }
  return map;
}
