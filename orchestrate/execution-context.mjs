/**
 * Builds an immutable execution context for an orchestration run.
 * @module orchestrate/execution-context
 */

import { randomBytes } from 'node:crypto';
import { resolveAffectedSpecs, getAffectedDomains } from './spec-resolver.mjs';
import { parseAllSpecs } from './spec-parser.mjs';
import { detectPhase, detectSize } from './phase-detector.mjs';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = resolve(import.meta.dirname || '.', '..');

/**
 * Build an immutable execution context.
 * @param {string} changeName
 * @param {string} taskDescription
 * @param {string} [branch]
 * @returns {Readonly<{runId: string, changeName: string, taskDescription: string, branch: string|null, timestamp: string, affectedSpecs: ReturnType<typeof resolveAffectedSpecs>, capabilities: string[], phases: ReturnType<typeof detectPhase>, tier: string}>}
 */
export function buildContext(changeName, taskDescription, branch = null) {
  const parsedSpecs = parseAllSpecs();
  const affectedSpecs = resolveAffectedSpecs(taskDescription, parsedSpecs);
  const phase = detectPhase(changeName);

  let tasksContent = '';
  const tasksPath = join(ROOT, 'openspec', 'changes', changeName, 'tasks.md');
  if (existsSync(tasksPath)) tasksContent = readFileSync(tasksPath, 'utf-8');
  const tier = tasksContent ? detectSize(tasksContent) : 'standard';

  const runId = `${Date.now().toString(36)}-${randomBytes(4).toString('hex')}`;

  return Object.freeze({
    runId,
    changeName,
    taskDescription,
    branch,
    timestamp: new Date().toISOString(),
    affectedSpecs,
    capabilities: getAffectedDomains(affectedSpecs),
    phases: phase,
    tier,
  });
}

/**
 * Print a formatted summary of the execution context.
 * @param {ReturnType<typeof buildContext>} ctx
 */
export function printContext(ctx) {
  console.log([
    `=== Execution Context ===`,
    `Run ID:      ${ctx.runId}`,
    `Change:      ${ctx.changeName}`,
    `Phase:       ${ctx.phases}`,
    `Tier:        ${ctx.tier}`,
    `Branch:      ${ctx.branch || '(none)'}`,
    `Timestamp:   ${ctx.timestamp}`,
    `Capabilities: ${ctx.capabilities.join(', ') || '(none)'}`,
    `Affected Specs (${ctx.affectedSpecs.length}):`,
    ...ctx.affectedSpecs.map((s) => `  - ${s.specName} (conf: ${s.confidence})`),
    `=========================`,
  ].join('\n'));
}
