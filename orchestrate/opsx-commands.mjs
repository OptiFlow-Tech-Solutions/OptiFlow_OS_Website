/**
 * V4 OpenSpec command integration.
 * Each command dispatches through the pipeline engine for proper execution.
 * Uses phase-specific pipeline configs from pipeline-config/.
 * @module orchestrate/opsx-commands
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';
import { loadContext } from './context-loader.mjs';
import { executePipeline, loadPipeline } from './pipeline-engine.mjs';
import { planExecution } from './execution-planner.mjs';
import { runValidations } from './validation-pipeline.mjs';
import { runGates } from './quality-gate.mjs';
import { syncToMain } from './spec-sync.mjs';
import { generateTrace } from './traceability.mjs';
import { syncDocs } from './doc-sync.mjs';
import { logEvent } from './audit-log.mjs';
import { emit } from './event-bus.mjs';

const { projectRoot } = resolvePaths();
const ROOT = projectRoot;
const PIPELINE_DIR = resolve(import.meta.dirname || '.', 'pipeline-config');

/**
 * Run a single OpenSpec command through its phase pipeline.
 * @param {'explore'|'propose'|'apply'|'verify'|'archive'} command
 * @param {string} changeName
 * @param {Record<string, any>} [context={}]
 * @returns {Promise<object>}
 */
export async function runOpsxCommand(command, changeName, context = {}) {
  await emit('opsx:start', { command, changeName, context });
  logEvent({ type: 'opsx-command', command, changeName });

  const changeDir = resolve(ROOT, 'openspec', 'changes', changeName);
  const pipelinePath = resolve(PIPELINE_DIR, `${command}.yaml`);

  // Ensure change directory exists for propose+
  if (command !== 'explore') {
    mkdirSync(join(changeDir, 'specs'), { recursive: true });
  }

  switch (command) {
    case 'explore': {
      console.log('[Explore] Loading specs... Scanning codebase... Discovering context...');
      const loaded = loadContext([]);
      const pipeline = loadPipeline(pipelinePath);
      const result = await executePipeline(pipeline, { changeName, ...context });
      await emit('opsx:complete', { command, changeName, result });
      return { loadedSpecs: [...loaded.specs.keys()], pipelineResult: result };
    }

    case 'propose': {
      console.log(`[Propose] Creating change: ${changeName}`);
      const proposal = `# ${changeName}\n\n## Summary\n${context.description || 'TBD'}\n\n## Scope\n- TBD\n\n## Affected Specs\n- TBD\n`;
      writeFileSync(join(changeDir, 'proposal.md'), proposal);
      writeFileSync(join(changeDir, 'design.md'), `# Design: ${changeName}\n\n## Decisions\n- TBD\n`);
      writeFileSync(join(changeDir, 'tasks.md'), `# Tasks: ${changeName}\n\n- [ ] Implement changes\n- [ ] Validate result\n`);
      const pipeline = loadPipeline(pipelinePath);
      const result = await executePipeline(pipeline, { changeName, ...context });
      await emit('opsx:complete', { command, changeName, result });
      return { proposalPath: join(changeDir, 'proposal.md'), specsDir: join(changeDir, 'specs'), tasksPath: join(changeDir, 'tasks.md'), pipelineResult: result };
    }

    case 'apply': {
      console.log(`[Apply] Implementing: ${changeName}`);
      const tasksPath = join(changeDir, 'tasks.md');
      const content = existsSync(tasksPath) ? readFileSync(tasksPath, 'utf-8') : '';
      const { batches } = planExecution(content);
      const pipeline = loadPipeline(pipelinePath);
      const pipelineResult = await executePipeline(pipeline, { changeName, tasksContent: content, ...context });
      await emit('opsx:complete', { command, changeName, pipelineResult });
      return { batches, pipelineResult };
    }

    case 'verify': {
      console.log(`[Verify] Validating: ${changeName}`);
      const pipeline = loadPipeline(pipelinePath);
      const pipelineResult = await executePipeline(pipeline, { changeName, ...context });
      const validationResult = runValidations(['all']);
      const qualityGates = runGates(['GATE_BUILD', 'GATE_VALIDATE', 'GATE_TEST', 'GATE_A11Y']);
      await emit('opsx:complete', { command, changeName, pipelineResult, validationResult, qualityGates });
      return { pipelineResult, validationResult, qualityGates };
    }

    case 'archive': {
      console.log(`[Archive] Archiving: ${changeName}`);
      const syncResult = syncToMain(changeName);
      syncDocs(changeName, syncResult.synced.map((s) => s.spec));
      const traceResult = generateTrace(changeName, 'HEAD');
      const pipeline = loadPipeline(pipelinePath);
      const pipelineResult = await executePipeline(pipeline, { changeName, ...context });
      await emit('opsx:complete', { command, changeName, syncResult, traceResult, pipelineResult });
      return { syncResult, traceResult, pipelineResult };
    }

    default:
      return { error: `Unknown command: ${command}` };
  }
}

/**
 * Run the full OpenSpec pipeline: explore → propose → apply → verify → archive.
 * Each phase gates on human approval at propose and archive checkpoints.
 * @param {string} changeName
 * @param {string} taskDescription
 * @param {{autoApprove?: boolean}} [opts]
 * @returns {Promise<object>}
 */
export async function runFullPipeline(changeName, taskDescription, opts = {}) {
  const steps = ['explore', 'propose', 'apply', 'verify', 'archive'];
  const humanGates = new Set(['propose', 'archive']);
  const results = [];

  await emit('pipeline:full:start', { changeName, taskDescription });

  for (const step of steps) {
    console.log(`\n[${step.toUpperCase()}] ${changeName}`);

    if (humanGates.has(step) && !opts.autoApprove) {
      console.log('[GATE] Human approval required before proceeding.');
      await emit('gate:human', { phase: step, changeName });
      // In auto mode, we proceed; in interactive mode, the harness waits for approval
    }

    const result = await runOpsxCommand(step, changeName, { description: taskDescription });
    results.push({ phase: step, result });
    console.log(`[${step.toUpperCase()}] Complete.`);
  }

  await emit('pipeline:full:complete', { changeName, results });

  return { changeName, phases: results };
}
