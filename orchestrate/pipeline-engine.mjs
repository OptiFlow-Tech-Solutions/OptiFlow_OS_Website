/**
 * V4 YAML pipeline executor with DAG dependency support.
 * Supports step types: command, hook, skill, agent, subagent, check, gate, info.
 * Agent/skill/subagent steps signal intent via event bus for the harness to pick up.
 * Shell commands execute directly.
 * @module orchestrate/pipeline-engine
 */

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolvePaths } from './config-resolver.mjs';
import { logEvent } from './audit-log.mjs';
import { runTask } from './task-runner.mjs';
import { emit } from './event-bus.mjs';

const { projectRoot } = resolvePaths();

/**
 * @typedef {{id: string, type: string, command: string, task: string,
 *   subagentType: string, blocking: boolean, depends: string[],
 *   continueOnError: boolean, timeout: number, description: string}} PipelineStep
 * @typedef {{id: string, status: string, output: string, duration: number}} StepResult
 * @typedef {{name: string, description: string, steps: PipelineStep[]}} Pipeline
 * @typedef {{results: StepResult[], success: boolean, totalDuration: number}} PipelineResult
 */

/**
 * Parse a YAML pipeline config file.
 * Supports the V4 `type` field on steps.
 */
export function loadPipeline(yamlPath) {
  const raw = readFileSync(yamlPath, 'utf-8');
  const lines = raw.split('\n');

  const pipeline = { name: '', description: '', steps: [] };
  let currentStep = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Top-level key
    const rootMatch = trimmed.match(/^(\w[\w\s]*?)\s*:\s*(.*)$/);
    if (rootMatch && !line.startsWith(' ') && !line.startsWith('\t')) {
      const [, key, value] = rootMatch;
      if (key === 'name') pipeline.name = value.trim().replace(/['"]/g, '');
      else if (key === 'description') pipeline.description = value.trim().replace(/['"]/g, '');
      continue;
    }

    // New step entry
    const stepEntry = trimmed.match(/^-\s*(.*)/);
    if (stepEntry) {
      if (currentStep) pipeline.steps.push(currentStep);
      currentStep = {
        id: '', type: 'command', command: '', task: '',
        subagentType: '', blocking: false, depends: [],
        continueOnError: false, timeout: 300000, description: '',
      };
      continue;
    }

    if (currentStep) {
      const propMatch = trimmed.match(/^(\w[\w\s]*?)\s*:\s*(.*)$/);
      if (!propMatch) continue;

      const [, key, value] = propMatch;
      const val = value.trim().replace(/['"]/g, '');

      switch (key) {
        case 'id': currentStep.id = val; break;
        case 'type': currentStep.type = val; break;
        case 'command': currentStep.command = val; break;
        case 'task': currentStep.task = val; break;
        case 'subagentType': currentStep.subagentType = val; break;
        case 'description': currentStep.description = val; break;
        case 'blocking': currentStep.blocking = val === 'true'; break;
        case 'continueOnError': currentStep.continueOnError = val === 'true'; break;
        case 'timeout': currentStep.timeout = parseInt(val, 10) || 300000; break;
        case 'depends': {
          const bracketMatch = val.match(/^\[(.*)\]$/);
          if (bracketMatch) {
            currentStep.depends = bracketMatch[1]
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);
          }
          break;
        }
      }
    }
  }

  if (currentStep) pipeline.steps.push(currentStep);
  return pipeline;
}

/**
 * Topological sort using Kahn's algorithm.
 * @param {PipelineStep[]} steps
 * @returns {{order: string[], phases: string[][]}}
 */
function topologicalSort(steps) {
  const ids = new Set(steps.map((s) => s.id));
  const inDegree = {};
  const adj = {};
  for (const id of ids) { inDegree[id] = 0; adj[id] = []; }

  for (const step of steps) {
    for (const dep of step.depends) {
      if (ids.has(dep)) {
        adj[dep].push(step.id);
        inDegree[step.id] = (inDegree[step.id] || 0) + 1;
      }
    }
  }

  const order = [];
  const phases = [];
  let queue = Object.entries(inDegree)
    .filter(([, d]) => d === 0)
    .map(([id]) => id);

  while (queue.length > 0) {
    phases.push([...queue]);
    const nextQueue = [];
    for (const id of queue) {
      order.push(id);
      for (const neighbor of adj[id]) {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) nextQueue.push(neighbor);
      }
    }
    queue = nextQueue;
  }

  return { order, phases };
}

/**
 * Run a single legacy shell-command step.
 */
export function runStep(step) {
  const start = performance.now();
  try {
    const output = execSync(step.command, {
      cwd: projectRoot,
      encoding: 'utf-8',
      timeout: step.timeout || 300000,
      stdio: 'pipe',
    }).trim();
    const duration = Math.round(performance.now() - start);
    return { id: step.id, status: 'done', output, duration };
  } catch (e) {
    const duration = Math.round(performance.now() - start);
    return { id: step.id, status: 'failed', output: e.stderr || e.stdout || e.message, duration };
  }
}

/**
 * V4: Execute pipeline with DAG, supporting all step types.
 * Independent steps in the same phase run in parallel.
 * @param {Pipeline} pipeline
 * @param {Record<string, any>} [context={}]
 * @returns {Promise<PipelineResult>}
 */
export async function executePipeline(pipeline, context = {}) {
  const pipelineStart = performance.now();
  await emit('pipeline:start', { pipeline: pipeline.name, context });

  const { steps } = pipeline;
  if (!steps.length) {
    await emit('pipeline:end', { pipeline: pipeline.name, success: true });
    return { results: [], success: true, totalDuration: 0 };
  }

  const { phases } = topologicalSort(steps);
  const stepMap = new Map(steps.map((s) => [s.id, s]));
  const resultsMap = new Map();
  const failedIds = new Set();

  for (const phaseIds of phases) {
    const phaseSteps = phaseIds.map((id) => stepMap.get(id)).filter(Boolean);

    const toRun = phaseSteps.filter((s) => {
      for (const dep of s.depends) { if (failedIds.has(dep)) return false; }
      return true;
    });

    if (!toRun.length) continue;

    await emit('pipeline:phase', { phaseIds, phaseSteps: toRun.map((s) => s.id) });

    const blockers = toRun.filter((s) => s.blocking);
    const nonBlockers = toRun.filter((s) => !s.blocking);

    // Run blocking steps sequentially
    if (blockers.length > 0) {
      for (const step of blockers) {
        const result = await runTask(step, context);
        resultsMap.set(result.id, result);
        await emit('pipeline:step', { step: step.id, status: result.status, duration: result.duration });
        if (result.status === 'failed' && !step.continueOnError) failedIds.add(result.id);
      }
    }

    // Run non-blocking steps in parallel
    if (nonBlockers.length > 0) {
      const parallelResults = await Promise.all(
        nonBlockers.map(async (step) => {
          const result = await runTask(step, context);
          resultsMap.set(result.id, result);
          await emit('pipeline:step', { step: step.id, status: result.status, duration: result.duration });
          return result;
        }),
      );
      for (const result of parallelResults) {
        const step = stepMap.get(result.id);
        if (result.status === 'failed' && step && !step.continueOnError) failedIds.add(result.id);
      }
    }
  }

  const results = steps.map((s) => resultsMap.get(s.id) || {
    id: s.id,
    status: 'skipped',
    output: '',
    duration: 0,
  });

  const success = results.every((r) => r.status !== 'failed');
  const totalDuration = Math.round(performance.now() - pipelineStart);

  logEvent({
    type: 'pipeline-exec',
    pipeline: pipeline.name,
    success,
    stepCount: steps.length,
    totalDuration,
    failures: results.filter((r) => r.status === 'failed').map((r) => r.id),
  });

  await emit('pipeline:end', { pipeline: pipeline.name, success, results, totalDuration });

  return { results, success, totalDuration };
}
