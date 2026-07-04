/**
 * V13: Execution strategy — determines what phases to run each iteration.
 * Replaces hardcoded linear PHASE_ORDER with dynamic, context-aware planning.
 *
 * @module orchestrate/execution-strategy
 */

import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';

const { projectRoot } = resolvePaths();

/**
 * @typedef {{
 *   phaseId: string,
 *   shouldRun: boolean,
 *   priority: number,
 *   reason: string,
 *   isFatal: boolean
 * }} PhaseDecision
 */

/**
 * Determine which phases should run in the next iteration.
 * Considers: phase completion status, current progress, iteration count, fatal phase failures.
 *
 * @param {import('./pipeline-context.mjs').PipelineContext} ctx
 * @returns {PhaseDecision[]}
 */
export function planIteration(ctx) {
  const completePhases = new Set(
    ctx.phases.filter((p) => p.status === 'complete').map((p) => p.id),
  );
  const failedPhases = new Set(
    ctx.phases.filter((p) => p.status === 'failed').map((p) => p.id),
  );

  const taskLower = (ctx.task || '').toLowerCase();
  const hasDeltaSpecs = checkDeltaSpecsExist(ctx.changeName);

  const decisions = [];

  // ── OPSX_EXPLORE ──
  if (completePhases.has('OPSX_EXPLORE')) {
    decisions.push({ phaseId: 'OPSX_EXPLORE', shouldRun: false, priority: 0, reason: 'already complete', isFatal: false });
  } else if (failedPhases.has('OPSX_EXPLORE')) {
    // Retry if non-fatal fail and we have iterations left
    decisions.push({ phaseId: 'OPSX_EXPLORE', shouldRun: ctx.canContinue(), priority: 1, reason: 'retry after failure', isFatal: false });
  } else {
    decisions.push({ phaseId: 'OPSX_EXPLORE', shouldRun: true, priority: 1, reason: 'primary phase', isFatal: false });
  }

  // ── OPSX_PROPOSE ──
  const changeDir = resolve(projectRoot, 'openspec', 'changes', ctx.changeName);
  const proposalExists = existsSync(resolve(changeDir, 'proposal.md'));
  const designExists = existsSync(resolve(changeDir, 'design.md'));
  const tasksExist = existsSync(resolve(changeDir, 'tasks.md'));

  if (completePhases.has('OPSX_PROPOSE')) {
    decisions.push({ phaseId: 'OPSX_PROPOSE', shouldRun: false, priority: 0, reason: 'already complete', isFatal: true });
  } else if (failedPhases.has('OPSX_PROPOSE') && ctx.canContinue()) {
    decisions.push({ phaseId: 'OPSX_PROPOSE', shouldRun: true, priority: 2, reason: 'retry after fatal failure', isFatal: true });
  } else if (proposalExists && designExists && tasksExist) {
    // Artifacts exist but phase not marked complete — mark complete, skip
    decisions.push({ phaseId: 'OPSX_PROPOSE', shouldRun: false, priority: 0, reason: 'artifacts exist, phase complete', isFatal: true });
  } else {
    decisions.push({ phaseId: 'OPSX_PROPOSE', shouldRun: true, priority: 2, reason: 'primary phase', isFatal: true });
  }

  // ── OPSX_SYNC ──
  if (completePhases.has('OPSX_SYNC')) {
    decisions.push({ phaseId: 'OPSX_SYNC', shouldRun: false, priority: 0, reason: 'already complete', isFatal: false });
  } else if (!hasDeltaSpecs && proposalExists) {
    // No delta specs to sync — skip this phase entirely
    decisions.push({ phaseId: 'OPSX_SYNC', shouldRun: false, priority: 0, reason: 'no delta specs to sync', isFatal: false });
  } else if (failedPhases.has('OPSX_SYNC')) {
    decisions.push({ phaseId: 'OPSX_SYNC', shouldRun: ctx.canContinue(), priority: 3, reason: 'retry after failure', isFatal: false });
  } else {
    decisions.push({ phaseId: 'OPSX_SYNC', shouldRun: completePhases.has('OPSX_PROPOSE'), priority: 3, reason: 'depends on propose', isFatal: false });
  }

  // ── OPSX_APPLY ──
  if (completePhases.has('OPSX_APPLY')) {
    decisions.push({ phaseId: 'OPSX_APPLY', shouldRun: false, priority: 0, reason: 'already complete', isFatal: true });
  } else if (failedPhases.has('OPSX_APPLY') && ctx.canContinue()) {
    decisions.push({ phaseId: 'OPSX_APPLY', shouldRun: true, priority: 4, reason: 'retry after fatal failure', isFatal: true });
  } else {
    const canApply = completePhases.has('OPSX_PROPOSE') || (proposalExists && tasksExist);
    decisions.push({ phaseId: 'OPSX_APPLY', shouldRun: canApply, priority: 4, reason: 'depends on propose', isFatal: true });
  }

  // ── VALIDATE ──
  if (completePhases.has('VALIDATE')) {
    decisions.push({ phaseId: 'VALIDATE', shouldRun: false, priority: 0, reason: 'already complete', isFatal: false });
  } else if (failedPhases.has('VALIDATE') && ctx.canContinue() && ctx.iterationCount > 0) {
    // Retry validation — crucial for iterative improvement
    decisions.push({ phaseId: 'VALIDATE', shouldRun: true, priority: 5, reason: 'retry after failure (iterative validation)', isFatal: false });
  } else if (ctx.skipBuild) {
    decisions.push({ phaseId: 'VALIDATE', shouldRun: false, priority: 0, reason: 'build skipped (--skip-build)', isFatal: false });
  } else {
    const canValidate = completePhases.has('OPSX_APPLY') || completePhases.has('OPSX_PROPOSE');
    decisions.push({ phaseId: 'VALIDATE', shouldRun: canValidate, priority: 5, reason: 'depends on apply', isFatal: false });
  }

  // ── OPSX_ARCHIVE ──
  if (completePhases.has('OPSX_ARCHIVE')) {
    decisions.push({ phaseId: 'OPSX_ARCHIVE', shouldRun: false, priority: 0, reason: 'already complete', isFatal: false });
  } else {
    const canArchive = (completePhases.has('VALIDATE') || completePhases.has('OPSX_VERIFY')) && ctx.validation?.passed !== false;
    decisions.push({ phaseId: 'OPSX_ARCHIVE', shouldRun: canArchive, priority: 7, reason: 'depends on validate/verify success', isFatal: false });
  }

  // ── OPSX_VERIFY ──
  if (completePhases.has('OPSX_VERIFY')) {
    decisions.push({ phaseId: 'OPSX_VERIFY', shouldRun: false, priority: 0, reason: 'already complete', isFatal: false });
  } else if (ctx.skipBuild) {
    decisions.push({ phaseId: 'OPSX_VERIFY', shouldRun: false, priority: 0, reason: 'build skipped (--skip-build)', isFatal: false });
  } else {
    const canVerify = completePhases.has('OPSX_APPLY') || completePhases.has('VALIDATE');
    decisions.push({ phaseId: 'OPSX_VERIFY', shouldRun: canVerify, priority: 6, reason: 'depends on apply/validate', isFatal: false });
  }

  return decisions;
}

function checkDeltaSpecsExist(changeName) {
  if (!changeName) return false;
  const deltaDir = resolve(projectRoot, 'openspec', 'changes', changeName, 'specs');
  if (!existsSync(deltaDir)) return false;
  try {
    const entries = readdirSync(deltaDir, { withFileTypes: true });
    return entries.some((e) => e.isDirectory() || e.name.endsWith('.md'));
  } catch {
    return false;
  }
}

/**
 * Check if a phase is blocked by its prerequisites.
 * @param {string} phaseId
 * @param {import('./pipeline-context.mjs').PipelineContext} ctx
 * @returns {{blocked: boolean, by: string[]}}
 */
export function isPhaseBlocked(phaseId, ctx) {
  const prereqs = {
    OPSX_EXPLORE: [],
    OPSX_PROPOSE: ['OPSX_EXPLORE'],
    OPSX_SYNC: ['OPSX_PROPOSE'],
    OPSX_APPLY: ['OPSX_PROPOSE'],
    VALIDATE: ['OPSX_APPLY'],
    OPSX_VERIFY: ['OPSX_APPLY', 'VALIDATE'],
    OPSX_ARCHIVE: ['VALIDATE', 'OPSX_VERIFY'],
  };

  const required = prereqs[phaseId] || [];
  const blockedBy = required.filter((req) => {
    const phase = ctx.phases?.find((p) => p.id === req);
    return !phase || phase.status !== 'complete';
  });

  return { blocked: blockedBy.length > 0, by: blockedBy };
}

/**
 * Compute the recommended phase list for a task.
 * Used at the start to customize the pipeline for the specific task.
 *
 * @param {import('./pipeline-context.mjs').PipelineContext} ctx
 * @returns {string[]}
 */
export function recommendedPhases(ctx) {
  const taskLower = (ctx.task || '').toLowerCase();
  const phases = ['OPSX_EXPLORE'];

  // Always include propose (it's fatal)
  phases.push('OPSX_PROPOSE');

  // Sync only if there are delta specs or this involves new capabilities
  const needsSync = taskLower.includes('new') ||
    taskLower.includes('add') ||
    taskLower.includes('create') ||
    taskLower.includes('spec') ||
    taskLower.includes('api') ||
    taskLower.includes('endpoint');
  if (needsSync) phases.push('OPSX_SYNC');

  // Always include apply
  phases.push('OPSX_APPLY');

  // Validation only if not skipped
  if (!ctx.skipBuild) phases.push('VALIDATE');

  // Standalone verify between validate and archive
  if (!ctx.skipBuild) phases.push('OPSX_VERIFY');

  // Always include archive (terminal phase)
  phases.push('OPSX_ARCHIVE');

  return phases;
}
