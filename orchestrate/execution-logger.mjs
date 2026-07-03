/**
 * V6 Structured per-phase execution logger.
 * Produces human-readable console output and JSON logs for every pipeline phase.
 * @module orchestrate/execution-logger
 */

import { writeFileSync, mkdirSync, existsSync, appendFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';
import { logEvent } from './audit-log.mjs';

const { projectRoot } = resolvePaths();
const LOG_DIR = resolve(projectRoot, 'orchestrate', '.state');

/** @type {{executionId: string, phases: object[], status: string}} */
let currentRun = null;

const STATUS_ICONS = {
  complete: '✔',
  failed:  '✗',
  skipped: '○',
  running: '…',
};

/**
 * Initialize a new execution run.
 * @param {string} taskDescription
 * @param {string} changeName
 * @returns {string} executionId
 */
export function startRun(taskDescription, changeName) {
  const executionId = `${changeName}-${Date.now()}`;
  currentRun = {
    executionId,
    task: taskDescription,
    changeName,
    startedAt: new Date().toISOString(),
    phases: [],
    status: 'running',
  };

  console.log(`\n${'═'.repeat(62)}`);
  console.log(`  /opsx-auto — Master Orchestration`);
  console.log(`  Task: "${taskDescription.slice(0, 70)}"`);
  console.log(`  Execution: ${executionId}`);
  console.log(`  Started: ${currentRun.startedAt}`);
  console.log(`${'═'.repeat(62)}`);
  console.log('');

  return executionId;
}

/**
 * Mark a phase as started.
 */
export function phaseStart(phaseName, details = {}) {
  if (!currentRun) return;
  const phase = {
    name: phaseName,
    status: 'running',
    startedAt: new Date().toISOString(),
    details,
  };
  currentRun.phases.push(phase);

  const icon = STATUS_ICONS.running;
  const pad = phaseName.padEnd(22);
  process.stdout.write(`  ${icon} ${pad}`);
  return phase;
}

/**
 * Mark a phase as complete.
 */
export function phaseComplete(phaseName, details = {}) {
  if (!currentRun) return null;
  const phase = currentRun.phases.find((p) => p.name === phaseName);
  if (!phase) return null;

  phase.status = 'complete';
  phase.completedAt = new Date().toISOString();
  phase.duration = Date.now() - new Date(phase.startedAt).getTime();
  Object.assign(phase, details);

  const icon = STATUS_ICONS.complete;
  const pad = phaseName.padEnd(22);
  const durationStr = `(${(phase.duration / 1000).toFixed(1)}s)`;
  console.log(`${icon} ${pad} ${durationStr}`);

  logEvent({ type: 'phase:complete', phase: phaseName, ...details, duration: phase.duration });
  return phase;
}

/**
 * Mark a phase as failed.
 */
export function phaseFailed(phaseName, error, details = {}) {
  if (!currentRun) return null;
  const phase = currentRun.phases.find((p) => p.name === phaseName);
  if (!phase) return null;

  phase.status = 'failed';
  phase.completedAt = new Date().toISOString();
  phase.duration = Date.now() - new Date(phase.startedAt).getTime();
  phase.error = typeof error === 'string' ? error : error.message;
  Object.assign(phase, details);

  const icon = STATUS_ICONS.failed;
  const pad = phaseName.padEnd(22);
  console.log(`${icon} ${pad} ${phase.error?.slice(0, 60)}`);

  logEvent({ type: 'phase:failed', phase: phaseName, error: phase.error, duration: phase.duration });
  return phase;
}

/**
 * Mark a phase as skipped.
 */
export function phaseSkipped(phaseName, reason) {
  if (!currentRun) return null;
  const phase = {
    name: phaseName,
    status: 'skipped',
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    duration: 0,
    reason,
  };
  currentRun.phases.push(phase);

  const icon = STATUS_ICONS.skipped;
  const pad = phaseName.padEnd(22);
  console.log(`${icon} ${pad} (${reason})`);
  return phase;
}

/**
 * Finalize the run and write the full log to disk.
 */
export function finishRun(status = 'done') {
  if (!currentRun) return;
  currentRun.status = status;
  currentRun.completedAt = new Date().toISOString();
  currentRun.totalDuration = Date.now() - new Date(currentRun.startedAt).getTime();

  const total = currentRun.totalDuration;
  const passed = currentRun.phases.filter((p) => p.status === 'complete').length;
  const failed = currentRun.phases.filter((p) => p.status === 'failed').length;
  const skipped = currentRun.phases.filter((p) => p.status === 'skipped').length;
  const totalPhases = currentRun.phases.length;

  console.log('');
  console.log(`${'─'.repeat(62)}`);
  console.log(`  Status: ${status === 'done' ? 'COMPLETE' : status === 'failed' ? 'FAILED' : 'PARTIAL'}`);
  console.log(`  Phases: ${passed} passed, ${failed} failed, ${skipped} skipped / ${totalPhases} total`);
  console.log(`  Duration: ${(total / 1000).toFixed(1)}s`);
  console.log(`${'═'.repeat(62)}\n`);

  // Persist the full execution log
  try {
    if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });
    writeFileSync(
      resolve(LOG_DIR, `${currentRun.executionId}-log.json`),
      JSON.stringify(currentRun, null, 2),
      'utf-8',
    );

    // Also append to summary file
    const summaryPath = resolve(LOG_DIR, 'execution-summary.jsonl');
    appendFileSync(summaryPath, JSON.stringify({
      executionId: currentRun.executionId,
      task: currentRun.task,
      status,
      duration: total,
      phases: currentRun.phases.map((p) => ({
        name: p.name, status: p.status, duration: p.duration || 0,
      })),
      timestamp: currentRun.completedAt,
    }) + '\n', 'utf-8');
  } catch { /* non-critical */ }

  logEvent({ type: 'execution:complete', executionId: currentRun.executionId, status, duration: total });
  return currentRun;
}

/**
 * Get the current run data (for the final report).
 */
export function getCurrentRun() {
  return currentRun;
}
