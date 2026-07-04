/**
 * V13: Controlled goal-oriented iteration controller.
 *
 * Replaces the linear autoFullPipeline() waterfall with a true
 * enter→analyze→plan→execute→validate→decide loop.
 *
 * Each iteration:
 *   1. ANALYZE  — Read current state, progress, errors
 *   2. PLAN     — Decide which phases to run this iteration (via execution-strategy)
 *   3. EXECUTE  — Run the planned phases in dependency order
 *   4. VALIDATE — Measure progress, check quality gates
 *   5. DECIDE   — Goal met? → finish. Can continue? → iterate. Else → fail.
 *
 * Safety:
 *   - Max 20 iterations (ITERATION_LIMIT)
 *   - Staleness detection (3 iterations with no progress change)
 *   - Circuit breaker (3 consecutive failures per step)
 *   - Fatal phase failure → immediate stop
 *
 * @module orchestrate/iteration-controller
 */

import { measureProgress, progressSummary, isGoalAchieved } from './progress-tracker.mjs';
import { planIteration, isPhaseBlocked } from './execution-strategy.mjs';
import { validatePrerequisites } from './agent-contracts.mjs';
import { logEvent } from './audit-log.mjs';
import { emit } from './event-bus.mjs';
import { recordAgentResult } from './skill-evolution.mjs';

/**
 * @typedef {{
 *   iteration: number,
 *   phasePlan: import('./execution-strategy.mjs').PhaseDecision[],
 *   executed: string[],
 *   skipReasons: Record<string, string>,
 *   progressBefore: number,
 *   progressAfter: number,
 *   errors: string[],
 *   goalMet: boolean
 * }} IterationRecord
 */

/**
 * Run one full iteration of the goal-oriented execution loop.
 *
 * @param {import('./pipeline-context.mjs').PipelineContext} ctx
 * @param {object} phaseExecutors — { [phaseId]: async (ctx) => ctx }
 * @returns {Promise<IterationRecord>}
 */
export async function runIteration(ctx, phaseExecutors) {
  const iteration = ctx.iterationCount + 1;
  ctx.iterationCount = iteration;

  const progressBefore = (() => {
    try { return measureProgress(ctx).completionPct; } catch { return 0; }
  })();

  console.log(`\n${'\u2500'.repeat(62)}`);
  console.log(`  Iteration ${iteration} / ${ctx.constructor.ITERATION_LIMIT || 20}  [progress: ${progressBefore}%]`);
  console.log(`${'\u2500'.repeat(62)}`);

  emit('iteration:start', { iteration, executionId: ctx.executionId, progressBefore });

  // ── 1. ANALYZE ──
  const plan = planIteration(ctx);
  const toRun = plan.filter((d) => d.shouldRun);
  const toSkip = plan.filter((d) => !d.shouldRun);

  const skipReasons = {};
  for (const d of toSkip) {
    skipReasons[d.phaseId] = d.reason;
  }

  console.log(`  Plan: ${toRun.length} phase(s) to run, ${toSkip.length} to skip`);
  for (const d of toRun) {
    console.log(`    \u2192 ${d.phaseId} [priority=${d.priority}] — ${d.reason}`);
  }
  for (const d of toSkip) {
    console.log(`    \u2192 ${d.phaseId} [SKIP] ${d.reason}`);
  }

  // ── 2. EXECUTE ──
  const executed = [];
  const errors = [];

  for (const decision of toRun.sort((a, b) => a.priority - b.priority)) {
    const { phaseId } = decision;

    // Check prerequisites
    const prereqs = validatePrerequisites(phaseId, ctx);
    if (!prereqs.valid) {
      console.log(`  [BLOCKED] ${phaseId} — prerequisites not met: ${prereqs.blockedBy.join(', ')}`);
      skipReasons[phaseId] = `blocked by: ${prereqs.blockedBy.join(', ')}`;
      continue;
    }

    // Check if blocked by dependency
    const blocked = isPhaseBlocked(phaseId, ctx);
    if (blocked.blocked) {
      console.log(`  [BLOCKED] ${phaseId} — depends on: ${blocked.by.join(', ')}`);
      skipReasons[phaseId] = `blocked by: ${blocked.by.join(', ')}`;
      continue;
    }

    // Execute
    const executor = phaseExecutors[phaseId];
    if (!executor) {
      skipReasons[phaseId] = 'no executor available';
      continue;
    }

    try {
      emit('iteration:phase:start', { iteration, phaseId, executionId: ctx.executionId });
      await executor(ctx);
      executed.push(phaseId);
      emit('iteration:phase:end', { iteration, phaseId, status: 'complete', executionId: ctx.executionId });

      // V14: Record agent performance for future composition biasing
      const team = ctx.agentTeams?.[phaseId];
      if (team?.primary) {
        const phaseResult = ctx.phases?.find((p) => p.id === phaseId);
        const success = phaseResult?.status === 'complete';
        try { recordAgentResult(team.primary, phaseId, success); } catch { /* best-effort */ }
      }

      // Check for fatal failure after execution
      const phase = ctx.phases?.find((p) => p.id === phaseId);
      if (phase?.status === 'failed' && decision.isFatal) {
        errors.push(`[FATAL] ${phaseId}: ${phase.error || 'unknown error'}`);
        break; // Stop iterating on fatal failures
      }
    } catch (e) {
      errors.push(`[ERROR] ${phaseId}: ${e.message}`);
      if (decision.isFatal) break;
    }
  }

  // ── 3. VALIDATE ──
  const progressAfter = (() => {
    try { return measureProgress(ctx).completionPct; } catch { return progressBefore; }
  })();

  // ── 4. STALENESS CHECK ──
  const isStale = ctx.checkStaleness();
  if (isStale) {
    errors.push(`[STALE] No progress for ${ctx.staleIterationCount} iterations (${progressAfter}%).`);
  }

  // ── 5. DECIDE ──
  const goalMet = isGoalAchieved(ctx);

  console.log('');
  console.log(`  Progress: ${progressBefore}% \u2192 ${progressAfter}%`);
  console.log(`  Executed: ${executed.join(', ') || 'none'}`);
  if (errors.length) console.log(`  Errors: ${errors.join('; ')}`);
  console.log(`  Goal met: ${goalMet ? 'YES' : `NO (${progressAfter}%)`}`);
  console.log(`  Can continue: ${ctx.canContinue() ? 'YES' : 'NO'}`);

  emit('iteration:end', {
    iteration, executionId: ctx.executionId,
    progressBefore, progressAfter,
    executed, errors, goalMet, canContinue: ctx.canContinue(),
  });

  return {
    iteration,
    phasePlan: plan,
    executed,
    skipReasons,
    progressBefore,
    progressAfter,
    errors,
    goalMet,
  };
}

/**
 * Run the full goal-oriented execution loop.
 * Continues iterating until the goal is achieved or execution cannot continue.
 *
 * @param {import('./pipeline-context.mjs').PipelineContext} ctx
 * @param {object} phaseExecutors — { [phaseId]: async (ctx) => ctx }
 * @returns {Promise<{success: boolean, iterations: IterationRecord[], finalProgress: number, goalMet: boolean}>}
 */
export async function runGoalLoop(ctx, phaseExecutors) {
  const records = [];

  while (ctx.canContinue()) {
    const record = await runIteration(ctx, phaseExecutors);
    records.push(record);

    if (record.goalMet) {
      console.log(`\n  \u2713 Goal achieved in ${records.length} iteration(s).`);
      break;
    }

    if (record.errors.some((e) => e.startsWith('[FATAL]'))) {
      console.log(`\n  \u2717 Fatal error encountered. Stopping.`);
      break;
    }

    if (record.executed.length === 0) {
      // No phases ran and goal not met — likely blocked. One more retry per iteration.
      console.log(`\n  \u26A0 No phases executed. Re-evaluating plan next iteration.`);
      // Don't break — let staleness detection handle it
    }

    if (!ctx.canContinue()) {
      console.log(`\n  \u26A0 Cannot continue: limit=${ctx.iterationCount >= 20 ? 'iteration limit' : 'stalled'}.`);
      break;
    }
  }

  const finalProgress = (() => {
    try { return measureProgress(ctx).completionPct; } catch { return 0; }
  })();

  const goalMet = isGoalAchieved(ctx);

  logEvent({
    type: 'iteration-loop',
    executionId: ctx.executionId,
    iterations: records.length,
    goalMet,
    finalProgress,
    totalPhasesExecuted: records.reduce((sum, r) => sum + r.executed.length, 0),
  });

  return {
    success: goalMet,
    iterations: records,
    finalProgress,
    goalMet,
  };
}
