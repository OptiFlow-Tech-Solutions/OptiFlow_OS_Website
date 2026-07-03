/**
 * V11: Goal-oriented progress measurement.
 * Assesses how close execution is to "done" so the AI agent can decide
 * whether to iterate or finish.
 * @module orchestrate/progress-tracker
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';

const { projectRoot } = resolvePaths();

/**
 * @typedef {{completionPct: number, blockers: string[], met: string[], unmet: string[], detail: string}} ProgressReport
 */

/**
 * Measure progress toward goal completion.
 * Aggregates signals: tasks done, artifacts exist, builds pass, validation passes.
 *
 * @param {import('./pipeline-context.mjs').PipelineContext} ctx
 * @returns {ProgressReport}
 */
export function measureProgress(ctx) {
  const changeDir = resolve(projectRoot, 'openspec', 'changes', ctx.changeName);
  const met = [];
  const unmet = [];
  const blockers = [];

  let totalSignals = 0;
  let metSignals = 0;

  // 1. Proposal exists
  totalSignals++;
  if (existsSync(join(changeDir, 'proposal.md'))) {
    met.push('Proposal artifact exists');
    metSignals++;
  } else {
    unmet.push('Proposal artifact missing');
  }

  // 2. Design exists
  totalSignals++;
  if (existsSync(join(changeDir, 'design.md'))) {
    met.push('Design artifact exists');
    metSignals++;
  } else {
    unmet.push('Design artifact missing');
  }

  // 3. Tasks exist
  totalSignals++;
  if (existsSync(join(changeDir, 'tasks.md'))) {
    met.push('Tasks artifact exists');
    metSignals++;
  } else {
    unmet.push('Tasks artifact missing');
  }

  // 4. Task completion rate
  const tasksPath = join(changeDir, 'tasks.md');
  if (existsSync(tasksPath)) {
    totalSignals++;
    const content = readFileSync(tasksPath, 'utf-8');
    const totalTasks = (content.match(/^-\s*\[[ x]\]/gm) || []).length;
    const doneTasks = (content.match(/^-\s*\[x\]/gm) || []).length;

    if (totalTasks === 0) {
      met.push('No tasks defined (trivial)');
      metSignals++;
    } else if (doneTasks === totalTasks) {
      met.push(`All ${totalTasks} tasks complete`);
      metSignals++;
    } else {
      const pct = Math.round((doneTasks / totalTasks) * 100);
      unmet.push(`${doneTasks}/${totalTasks} tasks complete (${pct}%)`);
      metSignals += doneTasks / totalTasks;
    }
  }

  // 5. Build passed
  if (ctx.phaseResults?.VALIDATE?.passed === true) {
    met.push('Build validation passed');
    metSignals++;
  } else if (ctx.phaseResults?.VALIDATE !== undefined) {
    unmet.push('Build validation failed');
  }
  totalSignals++;

  // 6. Explore completed
  if (ctx.phases?.some((p) => p.id === 'OPSX_EXPLORE' && p.status === 'complete')) {
    met.push('Explore phase complete');
    metSignals++;
  } else {
    unmet.push('Explore phase pending');
  }
  totalSignals++;

  // 7. Proposal phase completed
  if (ctx.phases?.some((p) => p.id === 'OPSX_PROPOSE' && p.status === 'complete')) {
    met.push('Propose phase complete');
    metSignals++;
  } else {
    unmet.push('Propose phase pending');
  }
  totalSignals++;

  // 8. Apply completed
  if (ctx.phases?.some((p) => p.id === 'OPSX_APPLY' && p.status === 'complete')) {
    met.push('Apply phase complete');
    metSignals++;
  } else {
    unmet.push('Apply phase pending');
  }
  totalSignals++;

  // 9. Archive completed
  if (ctx.phases?.some((p) => p.id === 'OPSX_ARCHIVE' && p.status === 'complete')) {
    met.push('Archive phase complete');
    metSignals++;
  } else {
    unmet.push('Archive phase pending');
  }
  totalSignals++;

  // 10. No active errors in fatal phases
  const fatalPhases = ctx.errors?.filter((e) => ['OPSX_PROPOSE', 'OPSX_APPLY'].includes(e.phase));
  totalSignals++;
  if (!fatalPhases?.length) {
    met.push('No fatal phase errors');
    metSignals++;
  } else {
    blockers.push(...fatalPhases.map((e) => `${e.phase}: ${e.error}`));
    unmet.push('Fatal phase errors present');
  }

  const completionPct = totalSignals > 0 ? Math.round((metSignals / totalSignals) * 100) : 0;

  const detail = [
    `Progress: ${completionPct}%`,
    met.length ? `  Met: ${met.join('; ')}` : '',
    unmet.length ? `  Unmet: ${unmet.join('; ')}` : '',
    blockers.length ? `  BLOCKERS: ${blockers.join('; ')}` : '',
  ].filter(Boolean).join('\n');

  return { completionPct, blockers, met, unmet, detail };
}

/**
 * Quick check: is the goal achieved?
 * Returns true when all core artifacts exist, all tasks are done,
 * build passes, and no fatal errors remain.
 *
 * @param {import('./pipeline-context.mjs').PipelineContext} ctx
 * @returns {boolean}
 */
export function isGoalAchieved(ctx) {
  const { completionPct, blockers } = measureProgress(ctx);
  return completionPct >= 90 && blockers.length === 0;
}

/**
 * Generate a human-readable progress summary for the AI agent.
 *
 * @param {import('./pipeline-context.mjs').PipelineContext} ctx
 * @returns {string}
 */
export function progressSummary(ctx) {
  const { completionPct, met, unmet, blockers } = measureProgress(ctx);

  const lines = [
    `\n─── Progress: ${completionPct}% ───`,
    ...met.map((m) => `  ✓ ${m}`),
    ...unmet.map((u) => blockers.some((b) => u.includes(b.split(':')[0]))
      ? `  ✗ ${u} (BLOCKER)`
      : `  ○ ${u}`),
    '',
  ];

  return lines.join('\n');
}
