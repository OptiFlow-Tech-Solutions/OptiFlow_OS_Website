/**
 * V13: Agent lifecycle contracts.
 * Defines formal input/output contracts for all 6 lifecycle agents.
 *
 * @module orchestrate/agent-contracts
 */

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';

const { projectRoot } = resolvePaths();

/**
 * @typedef {{
 *   id: string,
 *   role: string,
 *   description: string,
 *   isFatal: boolean,
 *   timeout: number,
 *   requires: string[],
 *   produces: string[],
 *   inputs: {required: string[], optional: string[]},
 *   outputs: {required: string[], optional: string[]},
 *   handoffTo: string|null,
 *   validateInput: (ctx: object) => {valid: boolean, missing: string[]},
 *   validateOutput: (ctx: object) => {valid: boolean, missing: string[]},
 *   retryPolicy: {maxRetries: number, backoffMs: number},
 *   recoveryStrategy: string
 * }} AgentContract
 */

/** @type {Record<string, AgentContract>} */
export const LIFECYCLE_CONTRACTS = Object.freeze({
  OPSX_EXPLORE: {
    id: 'OPSX_EXPLORE',
    role: 'repository-analyst',
    description: 'Analyze repository context \u2014 specs, features, pages, design system',
    isFatal: false,
    timeout: 300000,
    requires: [],
    produces: ['repository-understanding'],
    inputs: { required: [], optional: ['repository', 'skills', 'agents'] },
    outputs: { required: [], optional: ['exploreSummary'] },
    handoffTo: 'OPSX_PROPOSE',
    validateInput(ctx) {
      const missing = [];
      if (!ctx.task) missing.push('ctx.task');
      if (!ctx.changeName) missing.push('ctx.changeName');
      return { valid: missing.length === 0, missing };
    },
    validateOutput(ctx) {
      const phase = ctx.phases?.find((p) => p.id === 'OPSX_EXPLORE');
      return { valid: phase?.status === 'complete', missing: phase?.status === 'complete' ? [] : ['explore phase not complete'] };
    },
    retryPolicy: { maxRetries: 2, backoffMs: 1000 },
    recoveryStrategy: 'Re-read specs and context. Update affected specs list.',
  },

  OPSX_PROPOSE: {
    id: 'OPSX_PROPOSE',
    role: 'proposal-writer',
    description: 'Generate proposal.md, design.md, tasks.md, and delta specs',
    isFatal: true,
    timeout: 600000,
    requires: ['OPSX_EXPLORE'],
    produces: ['proposal.md', 'design.md', 'tasks.md', 'delta-specs'],
    inputs: { required: ['task', 'changeName', 'affectedSpecs', 'skills'], optional: ['repository'] },
    outputs: { required: ['proposal.md', 'design.md', 'tasks.md'], optional: ['delta-specs'] },
    handoffTo: 'OPSX_SYNC',
    validateInput(ctx) {
      const missing = [];
      if (!ctx.task) missing.push('ctx.task');
      if (!ctx.changeName) missing.push('ctx.changeName');
      if (!ctx.skills || ctx.skills.length === 0) missing.push('ctx.skills (no skills discovered)');
      return { valid: missing.length === 0, missing };
    },
    validateOutput(ctx) {
      const changeDir = resolve(projectRoot, 'openspec', 'changes', ctx.changeName);
      const missing = [];
      if (!existsSync(resolve(changeDir, 'proposal.md'))) missing.push('proposal.md');
      if (!existsSync(resolve(changeDir, 'design.md'))) missing.push('design.md');
      if (!existsSync(resolve(changeDir, 'tasks.md'))) missing.push('tasks.md');
      return { valid: missing.length === 0, missing };
    },
    retryPolicy: { maxRetries: 1, backoffMs: 2000 },
    recoveryStrategy: 'Re-analyze task and regenerate proposal artifacts with corrected scope.',
  },

  OPSX_SYNC: {
    id: 'OPSX_SYNC',
    role: 'spec-synchronizer',
    description: 'Merge delta specs from change into main capability specs',
    isFatal: false,
    timeout: 120000,
    requires: ['OPSX_PROPOSE'],
    produces: ['synced-specs'],
    inputs: { required: ['changeName'], optional: ['delta-specs'] },
    outputs: { required: [], optional: ['syncedCount', 'syncedSpecs'] },
    handoffTo: 'OPSX_APPLY',
    validateInput(ctx) {
      const missing = [];
      if (!ctx.changeName) missing.push('ctx.changeName');
      return { valid: missing.length === 0, missing };
    },
    validateOutput(ctx) {
      const phase = ctx.phases?.find((p) => p.id === 'OPSX_SYNC');
      const valid = phase && (phase.status === 'complete' || phase.status === 'skipped');
      return { valid, missing: valid ? [] : ['sync phase not complete'] };
    },
    retryPolicy: { maxRetries: 3, backoffMs: 500 },
    recoveryStrategy: 'Check for merge conflicts in delta specs. Re-validate sync metadata.',
  },

  OPSX_APPLY: {
    id: 'OPSX_APPLY',
    role: 'implementer',
    description: 'Execute implementation tasks from tasks.md',
    isFatal: true,
    timeout: 1800000,
    requires: ['OPSX_PROPOSE'],
    produces: ['implementation', 'build-output'],
    inputs: { required: ['changeName'], optional: ['tasks.md', 'design.md', 'proposal.md', 'repository'] },
    outputs: { required: [], optional: ['batches', 'pipelineSuccess'] },
    handoffTo: 'VALIDATE',
    validateInput(ctx) {
      const changeDir = resolve(projectRoot, 'openspec', 'changes', ctx.changeName);
      const missing = [];
      if (!existsSync(resolve(changeDir, 'tasks.md'))) missing.push('tasks.md');
      return { valid: missing.length === 0, missing };
    },
    validateOutput(ctx) {
      const phase = ctx.phases?.find((p) => p.id === 'OPSX_APPLY');
      return { valid: phase?.status === 'complete', missing: phase?.status === 'complete' ? [] : ['apply phase not complete'] };
    },
    retryPolicy: { maxRetries: 1, backoffMs: 3000 },
    recoveryStrategy: 'Check tasks.md for remaining tasks. Re-run failed build/validation commands.',
  },

  VALIDATE: {
    id: 'VALIDATE',
    role: 'quality-verifier',
    description: 'Build, lint, test, quality gates, L1-L7 validation',
    isFatal: false,
    timeout: 600000,
    requires: ['OPSX_APPLY'],
    produces: ['validation-report'],
    inputs: { required: [], optional: ['implementation'] },
    outputs: { required: [], optional: ['passed', 'failures'] },
    handoffTo: 'OPSX_ARCHIVE',
    validateInput(ctx) { return { valid: true, missing: [] }; },
    validateOutput(ctx) {
      const phase = ctx.phases?.find((p) => p.id === 'VALIDATE');
      const completed = phase && (phase.status === 'complete' || phase.status === 'failed');
      return { valid: completed, missing: completed ? [] : ['validation phase not run'] };
    },
    retryPolicy: { maxRetries: 3, backoffMs: 1000 },
    recoveryStrategy: 'Run npm run build && npm run validate. Fix specific errors. Re-validate.',
  },

  OPSX_ARCHIVE: {
    id: 'OPSX_ARCHIVE',
    role: 'archivist',
    description: 'Sync specs, generate traceability, update docs, finalize',
    isFatal: false,
    timeout: 300000,
    requires: ['VALIDATE'],
    produces: ['archive-record', 'traceability.md'],
    inputs: { required: ['changeName'], optional: ['validation'] },
    outputs: { required: ['traceability.md'], optional: ['docs'] },
    handoffTo: null,
    validateInput(ctx) {
      const missing = [];
      if (!ctx.changeName) missing.push('ctx.changeName');
      return { valid: missing.length === 0, missing };
    },
    validateOutput(ctx) {
      const phase = ctx.phases?.find((p) => p.id === 'OPSX_ARCHIVE');
      return { valid: phase?.status === 'complete', missing: phase?.status === 'complete' ? [] : ['archive phase not complete'] };
    },
    retryPolicy: { maxRetries: 2, backoffMs: 1000 },
    recoveryStrategy: 'Re-run spec sync. Verify all artifacts exist. Regenerate traceability.',
  },

  OPSX_VERIFY: {
    id: 'OPSX_VERIFY',
    role: 'standalone-verifier',
    description: 'Run standalone verification pipeline before archive \u2014 build, lint, tests, quality gates',
    isFatal: false,
    timeout: 600000,
    requires: ['OPSX_APPLY'],
    produces: ['verification-report'],
    inputs: { required: ['changeName'], optional: ['implementation'] },
    outputs: { required: [], optional: ['pipelineSuccess', 'duration'] },
    handoffTo: 'OPSX_ARCHIVE',
    validateInput(ctx) {
      const missing = [];
      if (!ctx.changeName) missing.push('ctx.changeName');
      return { valid: missing.length === 0, missing };
    },
    validateOutput(ctx) {
      const phase = ctx.phases?.find((p) => p.id === 'OPSX_VERIFY');
      return { valid: phase?.status === 'complete', missing: phase?.status === 'complete' ? [] : ['verify phase not complete'] };
    },
    retryPolicy: { maxRetries: 2, backoffMs: 2000 },
    recoveryStrategy: 'Run standalone verification. Check build, lint, tests, and quality gates individually.',
  },
});

export function getContract(phaseId) {
  return LIFECYCLE_CONTRACTS[phaseId] || null;
}

export function validatePrerequisites(phaseId, ctx) {
  const contract = getContract(phaseId);
  if (!contract) return { valid: true, missing: [], blockedBy: [] };
  const blockedBy = contract.requires.filter((req) => {
    const phase = ctx.phases?.find((p) => p.id === req);
    return !phase || phase.status !== 'complete';
  });
  return { valid: blockedBy.length === 0, missing: [], blockedBy };
}

export function buildPhasePlan(ctx) {
  const order = ['OPSX_EXPLORE', 'OPSX_PROPOSE', 'OPSX_SYNC', 'OPSX_APPLY', 'VALIDATE', 'OPSX_VERIFY', 'OPSX_ARCHIVE'];
  return order.map((phaseId) => {
    const contract = getContract(phaseId);
    return { phaseId, contract, required: contract ? contract.isFatal || contract.id === 'OPSX_ARCHIVE' : true };
  });
}

export function getHandoff(phaseId) {
  const contract = getContract(phaseId);
  return contract ? contract.handoffTo : null;
}

export function contractSummary(phaseId) {
  const c = getContract(phaseId);
  if (!c) return `No contract for ${phaseId}`;
  return [
    `${c.id} [${c.role}] ${c.isFatal ? 'FATAL' : 'NON-FATAL'}`,
    `  Description: ${c.description}`,
    `  Inputs: ${c.inputs.required.join(', ') || 'none'}`,
    `  Outputs: ${c.outputs.required.join(', ') || 'none'}`,
    `  Handoff: ${c.handoffTo || 'TERMINAL'}`,
    `  Retry: ${c.retryPolicy.maxRetries}x / ${c.retryPolicy.backoffMs}ms`,
    `  Recovery: ${c.recoveryStrategy}`,
  ].join('\n');
}
