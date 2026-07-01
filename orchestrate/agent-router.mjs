/**
 * V4: Capability-aware agent selection.
 * Uses capability analyzer for intelligent agent matching. Falls back to domain-phase maps.
 * @module orchestrate/agent-router
 */

import { analyzeTask } from './capability-analyzer.mjs';
import { findAgentsByRole } from './capability-registry.mjs';
import { get as cacheGet, set as cacheSet } from './cache-manager.mjs';

/** Legacy static domain→agent maps as fallback */
const DOMAIN_PRIMARY = Object.freeze({
  design: 'frontend-design-direction',
  frontend: 'tdd-guide',
  build: 'build-error-resolver',
  accessibility: 'frontend-a11y',
  seo: 'seo-specialist',
  content: 'content-writer',
  quality: 'code-reviewer',
  security: 'security-reviewer',
});

const PHASE_AGENTS = Object.freeze({
  explore: 'explore',
  plan: 'planner',
  propose: 'planner',
  apply: 'tdd-guide',
  verify: 'code-reviewer',
  archive: 'doc-updater',
  security: 'security-reviewer',
  refactor: 'refactor-cleaner',
  'build-fix': 'build-error-resolver',
});

/**
 * V4 agent routing. Uses capability-based matching when registry is available.
 * @param {string[]} affectedDomains
 * @param {'standard'|'large'|'trivial'} [tier='standard']
 * @param {string} [branch='main']
 * @param {string} [taskDescription='']
 * @returns {{primaryAgent: string, supportAgents: string[], skipAgents: string[]}}
 */
export function routeAgents(affectedDomains, tier = 'standard', branch = 'main', taskDescription = '') {
  const supportAgents = new Set();
  const skipAgents = new Set();
  let primaryAgent = 'tdd-guide';

  if (taskDescription) {
    const cacheKey = `agent-route:${taskDescription.slice(0, 80)}`;
    const cached = cacheGet(cacheKey);
    if (cached) return cached;
  }

  // Primary: capability-based matching
  if (taskDescription) {
    try {
      const analysis = analyzeTask(taskDescription);
      if (analysis.roles.length > 0) {
        const matchedAgents = findAgentsByRole(analysis.roles);
        if (matchedAgents.length) {
          primaryAgent = matchedAgents[0].name;
          for (let i = 1; i < matchedAgents.length; i++) {
            supportAgents.add(matchedAgents[i].name);
          }
        }
      }
    } catch { /* fall through to static maps */ }
  }

  // Fallback: static domain map
  if (primaryAgent === 'tdd-guide' && affectedDomains.length > 0) {
    primaryAgent = DOMAIN_PRIMARY[affectedDomains[0]] || 'tdd-guide';
    for (let i = 1; i < affectedDomains.length; i++) {
      const agent = DOMAIN_PRIMARY[affectedDomains[i]];
      if (agent) supportAgents.add(agent);
    }
  }

  // Branch awareness
  if (branch === 'main') supportAgents.add('security-reviewer');
  if (branch === 'staging') supportAgents.add('e2e-runner');
  if (branch.startsWith('feature/')) skipAgents.add('doc-updater');

  // Tier awareness
  if (tier === 'trivial') {
    skipAgents.add('architect');
    skipAgents.add('frontend-a11y');
  }
  if (tier === 'large') {
    supportAgents.add('architect');
    supportAgents.add('performance-optimizer');
    supportAgents.add('harness-optimizer');
  }

  const result = {
    primaryAgent,
    supportAgents: [...supportAgents],
    skipAgents: [...skipAgents],
  };

  if (taskDescription) {
    cacheSet(`agent-route:${taskDescription.slice(0, 80)}`, result, { ttl: 300000 });
  }

  return result;
}

/**
 * Simple phase-to-agent mapping.
 */
export function agentForPhase(phase) {
  return PHASE_AGENTS[phase] || 'explore';
}
