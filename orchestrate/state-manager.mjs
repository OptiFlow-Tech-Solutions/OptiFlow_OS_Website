/**
 * V8: Orchestration state manager with pipeline-context integration.
 * Persists execution state to disk for resume/recovery.
 * @module orchestrate/state-manager
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';

const { stateDir } = resolvePaths();

function ensureDir() {
  if (!existsSync(stateDir)) mkdirSync(stateDir, { recursive: true });
}

/**
 * Save any state object.
 */
export function saveState(stateId, state) {
  ensureDir();
  writeFileSync(resolve(stateDir, `${stateId}.json`), JSON.stringify(state, null, 2), 'utf-8');
}

/**
 * Load a saved state object.
 */
export function loadState(stateId) {
  const fp = resolve(stateDir, `${stateId}.json`);
  if (!existsSync(fp)) return null;
  return JSON.parse(readFileSync(fp, 'utf-8'));
}

/**
 * List all saved states.
 */
export function listStates() {
  ensureDir();
  return readdirSync(stateDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.slice(0, -5));
}

/**
 * Delete a saved state.
 */
export function deleteState(stateId) {
  const fp = resolve(stateDir, `${stateId}.json`);
  if (existsSync(fp)) unlinkSync(fp);
}

/**
 * Save pipeline execution context to disk.
 */
export function savePipelineState(context) {
  if (!context || !context.executionId) return;
  saveState(`pipeline-${context.executionId}`, context.toJSON());
}

/**
 * Load pipeline execution context from disk.
 */
export function loadPipelineState(executionId) {
  return loadState(`pipeline-${executionId}`);
}

/**
 * List all pipeline states on disk.
 */
export function listPipelineStates() {
  ensureDir();
  return readdirSync(stateDir)
    .filter((f) => f.startsWith('pipeline-') && f.endsWith('.json'))
    .map((f) => f.replace('pipeline-', '').replace('.json', ''));
}

/**
 * Get the most recent pipeline state.
 */
export function getLatestPipelineState() {
  const states = listPipelineStates();
  if (!states.length) return null;
  const latest = states.sort().pop();
  return loadPipelineState(latest);
}

/**
 * Save a phase result checkpoint.
 * Used for resumable pipelines.
 */
export function savePhaseCheckpoint(executionId, phaseId, result) {
  ensureDir();
  writeFileSync(
    resolve(stateDir, `phase-${executionId}-${phaseId}.json`),
    JSON.stringify({ phaseId, result, timestamp: new Date().toISOString() }, null, 2),
    'utf-8',
  );
}

/**
 * Load a phase result checkpoint.
 */
export function loadPhaseCheckpoint(executionId, phaseId) {
  const fp = resolve(stateDir, `phase-${executionId}-${phaseId}.json`);
  if (!existsSync(fp)) return null;
  return JSON.parse(readFileSync(fp, 'utf-8'));
}

/**
 * Write a final execution summary.
 */
export function writeExecutionSummary(context) {
  if (!context) return;
  ensureDir();
  const summaryPath = resolve(stateDir, 'execution-summary.jsonl');
  const entry = {
    executionId: context.executionId,
    task: context.task,
    status: context.status,
    duration: context.totalDuration,
    phases: context.phases.map((p) => ({
      name: p.id, status: p.status, duration: p.duration || 0,
    })),
    timestamp: context.completedAt || new Date().toISOString(),
  };
  try {
    require('fs').appendFileSync(summaryPath, JSON.stringify(entry) + '\n', 'utf-8');
  } catch { /* non-critical */ }
}

/**
 * Generate recovery guidance when the pipeline has failed phases.
 * Writes a human-readable recovery file and returns commands to run.
 * @param {object} ctx — PipelineContext-like object with phases, executionId
 * @returns {{ recoveryFile: string, commands: string[] }}
 */
export function writeRecoveryGuidance(ctx) {
  ensureDir();
  const recoveryPath = resolve(stateDir, `${ctx.executionId}-recovery.md`);
  const failedPhases = (ctx.phases || []).filter((p) => p.status === 'failed');
  if (!failedPhases.length) return { recoveryFile: '', commands: [] };

  const lines = [
    `# Recovery Guide — ${ctx.executionId}`,
    `**Task:** ${ctx.task}`,
    `**Failed at:** ${new Date().toISOString()}`,
    '',
    '## Failed Phases',
    ...failedPhases.map((p) => `- **${p.id}**: ${p.error || 'unknown error'}`),
    '',
    '## Recovery Steps',
    '',
    '```js',
    `import { PipelineContext } from './orchestrate/auto-pipeline.mjs';`,
    `const ctx = PipelineContext.load("${ctx.executionId}");`,
    `if (!ctx) throw new Error("Context not found. Cannot resume.");`,
    `// Phases completed: ${(ctx.phases || []).filter((p) => p.status === 'complete').length}`,
    `// Next phase to run: ${ctx.nextPhaseId || 'UNKNOWN'}`,
    '// Fix the underlying issue, then resume with:',
    `// Re-run the failed phases or the remaining pipeline`,
    '```',
    '',
    '## Suggested Commands',
    '',
    ...getFailureSuggestions(failedPhases),
  ];

  try {
    writeFileSync(recoveryPath, lines.join('\n'), 'utf-8');
  } catch { /* non-critical */ }

  return { recoveryFile: recoveryPath, commands: getFailureSuggestions(failedPhases) };
}

function getFailureSuggestions(failedPhases) {
  const suggestions = [];
  for (const p of failedPhases) {
    if (p.error && p.error.includes('Cannot find package')) suggestions.push('$ npm install @playwright/test');
    if (p.error && p.error.includes('lint')) suggestions.push('$ npm run lint -- --fix');
    if (p.id === 'VALIDATE') suggestions.push('$ npm run build && npm run validate');
    if (p.id === 'OPSX_APPLY') suggestions.push('Check openspec/changes/<name>/tasks.md for unresolved tasks');
  }
  return suggestions;
}
