/**
 * V13: Agent lifecycle composer.
 * Dynamically composes agent teams per lifecycle phase.
 * Each phase gets a role-assigned team from the available agent pool.
 *
 * @module orchestrate/agent-composer
 */

import { agentForPhase, composeAgentChain } from './agent-router.mjs';
import { listCapabilities, getCapability } from './capability-registry.mjs';
import { getAgentPhaseRates } from './skill-evolution.mjs';

/**
 * @typedef {{agentId: string, role: string, isPrimary: boolean}} AgentAssignment
 * @typedef {{phaseId: string, primary: string, support: string[], assignments: AgentAssignment[]}} AgentTeam
 */

/**
 * Lifecycle role to agent role mapping.
 * Translates orchestration phase roles to agent capability roles.
 */
const PHASE_AGENT_ROLES = Object.freeze({
  OPSX_EXPLORE: ['explore', 'planning', 'analysis'],
  OPSX_PROPOSE: ['planning', 'documentation', 'design'],
  OPSX_SYNC: ['documentation', 'review'],
  OPSX_APPLY: ['implementation', 'debugging'],
  VALIDATE: ['testing', 'review', 'security'],
  OPSX_VERIFY: ['testing', 'review', 'quality'],
  OPSX_ARCHIVE: ['documentation', 'operations'],
});

/**
 * Compose an agent team for a specific lifecycle phase.
 * Uses capability-based matching with domain-aware fallbacks.
 *
 * @param {string} phaseId — lifecycle phase (OPSX_EXPLORE, OPSX_PROPOSE, etc.)
 * @param {import('./pipeline-context.mjs').PipelineContext} ctx
 * @returns {AgentTeam}
 */
export function composeAgentTeam(phaseId, ctx) {
  const roles = PHASE_AGENT_ROLES[phaseId] || ['implementation'];

  // Get primary agent from static phase mapping
  let primaryAgent = agentForPhase(phaseId);

  // If we have runtime context, try capability-based matching
  if (ctx?.task) {
    const chain = composeAgentChain(ctx.task, ctx.repository?.taskAnalysis?.domains || [], ctx.branch || 'main');
    if (chain.primaryAgent && chain.primaryAgent !== 'explore') {
      primaryAgent = chain.primaryAgent;
    }
  }

  // V14: Agent performance feedback — prefer agents with proven success in this phase
  const phaseRates = getAgentPhaseRates(phaseId);
  const provenAgents = Object.entries(phaseRates)
    .filter(([, r]) => r.successRate >= 1.0 && r.count >= 2)
    .map(([id]) => id);
  if (provenAgents.length > 0 && !provenAgents.includes(primaryAgent)) {
    const provenAlsoInRoles = provenAgents.filter((id) => {
      const cap = getCapability('agent', id);
      if (!cap?.capabilities?.roles) return false;
      return cap.capabilities.roles.some((r) => roles.includes(r));
    });
    if (provenAlsoInRoles.length > 0) {
      const old = primaryAgent;
      primaryAgent = provenAlsoInRoles[0];
      // ponytail: performance-based override — revert if quality drops
      if (ctx?.repository) {
        ctx.recordFinding('agent-bias', `Agent ${primaryAgent} preferred over ${old} for ${phaseId} (${phaseRates[primaryAgent].count} successful runs)`, 0.7, 'agent-composer');
      }
    }
  }

  // Find support agents from the capability registry
  const supportAgents = [];
  const registryAgents = listCapabilities('agent');

  for (const role of roles) {
    const matched = registryAgents.filter((a) => {
      const agentRoles = a.capabilities?.roles || [];
      const desc = (a.description || '').toLowerCase();
      return agentRoles.includes(role) || desc.includes(role);
    });

    for (const agent of matched) {
      if (agent.name !== primaryAgent && !supportAgents.includes(agent.name)) {
        supportAgents.push(agent.name);
      }
    }
  }

  // Build assignments with role annotations and verify availability
  const verifyAvailability = (agentId) => !!getCapability('agent', agentId);

  const assignments = [
    {
      agentId: primaryAgent, role: 'primary', isPrimary: true,
      available: verifyAvailability(primaryAgent),
    },
    ...supportAgents.map((id) => ({
      agentId: id, role: 'support', isPrimary: false,
      available: verifyAvailability(id),
    })),
  ];

  const unavailable = assignments.filter((a) => !a.available).map((a) => a.agentId);
  if (unavailable.length) {
    // ponytail: registry may be cold — agents are lazy-loaded; this is advisory
    // flagged as 'unverified' rather than blocked
  }

  return {
    phaseId,
    primary: primaryAgent,
    support: supportAgents.slice(0, 2),
    assignments,
    unavailable,
  };
}

/**
 * Compose agent teams for all lifecycle phases.
 * Returns a map of phaseId → AgentTeam.
 *
 * @param {import('./pipeline-context.mjs').PipelineContext} ctx
 * @returns {Record<string, AgentTeam>}
 */
export function composeAllTeams(ctx) {
  const phases = ['OPSX_EXPLORE', 'OPSX_PROPOSE', 'OPSX_SYNC', 'OPSX_APPLY', 'VALIDATE', 'OPSX_VERIFY', 'OPSX_ARCHIVE'];
  const teams = {};

  for (const phaseId of phases) {
    teams[phaseId] = composeAgentTeam(phaseId, ctx);
  }

  return teams;
}

/**
 * Get the recommended agent invocation strategy for a phase.
 * Determines whether agents should run sequentially or in parallel.
 *
 * @param {string} phaseId
 * @param {AgentTeam} team
 * @returns {{mode: 'sequential'|'parallel'|'single', order: string[]}}
 */
export function invocationStrategy(phaseId, team) {
  const parallelPhases = ['DEEP_SCAN', 'SKILL_DISCOVERY', 'CAPABILITY_INDEX', 'VALIDATE', 'OPSX_VERIFY'];
  const singlePhases = ['OPSX_EXPLORE', 'OPSX_APPLY'];

  if (singlePhases.includes(phaseId)) {
    return { mode: 'single', order: [team.primary] };
  }

  if (parallelPhases.includes(phaseId)) {
    return { mode: 'parallel', order: [team.primary, ...team.support] };
  }

  // Default: sequential (primary first, then support)
  return { mode: 'sequential', order: [team.primary, ...team.support] };
}
