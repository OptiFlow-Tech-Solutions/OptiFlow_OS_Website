/**
 * Unified task execution interface.
 * Runs shell commands, loads skills, or dispatches to agents/sub-agents
 * based on task type. The single execution surface for the pipeline engine.
 * @module orchestrate/task-runner
 */

import { execSync } from 'node:child_process';
import { resolvePaths } from './config-resolver.mjs';
import { logEvent } from './audit-log.mjs';
import { emit } from './event-bus.mjs';

const { projectRoot, hooksDir } = resolvePaths();

/**
 * Run a shell command.
 * @param {string} command
 * @param {{cwd?: string, timeout?: number}} [opts]
 * @returns {{status: string, output: string, duration: number}}
 */
function runCommand(command, { cwd = projectRoot, timeout = 300000 } = {}) {
  const start = performance.now();
  try {
    const output = execSync(command, { cwd, encoding: 'utf-8', timeout, stdio: 'pipe' }).trim();
    return { status: 'done', output, duration: Math.round(performance.now() - start) };
  } catch (e) {
    return {
      status: 'failed',
      output: e.stderr || e.stdout || e.message,
      duration: Math.round(performance.now() - start),
    };
  }
}

/**
 * Run a project hook (.mjs script in hooks/).
 * @param {string} hookName - e.g., 'pre-build'
 * @returns {{status: string, output: string, duration: number}}
 */
function runHook(hookName) {
  const hookPath = `${hooksDir}/${hookName}.mjs`;
  try {
    // ponytail: dynamic import for hooks
    return runCommand(`node "${hookPath}"`);
  } catch {
    return { status: 'failed', output: `Hook not found: ${hookName}`, duration: 0 };
  }
}

/**
 * Map of step types to their execution functions.
 * @type {Record<string, (step: any, context: any) => Promise<{status: string, output: string, duration: number}>>}
 */
const EXECUTORS = {
  /** Run a shell command */
  command: async (step) => runCommand(step.command, { timeout: step.timeout }),

  /** Run a project hook */
  hook: async (step) => runHook(step.command),

  /** Load a skill (emits event for the agent harness to pick up) */
  skill: async (step, context) => {
    emit('skill:request', { skill: step.command, context });
    // ponytail: skill loading is harness-side; we just signal the intent.
    // The actual agent harness (open-code) responds to skill:request events.
    return { status: 'done', output: `Skill requested: ${step.command}`, duration: 0 };
  },

  /** Delegate to an agent */
  agent: async (step, context) => {
    emit('agent:request', {
      agent: step.command,
      task: step.task || context?.taskDescription || '',
      context,
    });
    return { status: 'done', output: `Agent requested: ${step.command}`, duration: 0 };
  },

  /** Delegate to a sub-agent */
  subagent: async (step, context) => {
    emit('subagent:request', {
      type: step.subagentType || 'general',
      task: step.task || step.command || '',
      context,
    });
    return { status: 'done', output: `Sub-agent requested: ${step.subagentType || 'general'}`, duration: 0 };
  },

  /** Validation check (runs a command, fails on non-zero exit) */
  check: async (step, context) => runCommand(step.command),

  /** Quality gate (emits event for gate execution) */
  gate: async (step, context) => {
    emit('gate:check', { gate: step.command, context });
    return { status: 'done', output: `Gate checked: ${step.command}`, duration: 0 };
  },

  /** Informational / no-op step */
  info: async (step) => ({
    status: 'done',
    output: step.command || step.description || '',
    duration: 0,
  }),
};

/**
 * Execute a single pipeline step.
 * @param {{id: string, type?: string, command?: string, task?: string,
 *   subagentType?: string, description?: string, timeout?: number,
 *   blocking?: boolean, depends?: string[], continueOnError?: boolean}} step
 * @param {Record<string, any>} [context={}]
 * @returns {Promise<{id: string, status: string, output: string, duration: number}>}
 */
export async function runTask(step, context = {}) {
  const type = step.type || 'command';
  const executor = EXECUTORS[type];

  if (!executor) {
    return { id: step.id, status: 'failed', output: `Unknown step type: ${type}`, duration: 0 };
  }

  const start = performance.now();
  try {
    const result = await executor(step, context);
    const duration = Math.round(performance.now() - start);

    logEvent({
      type: 'task-run',
      stepId: step.id,
      stepType: type,
      status: result.status,
      duration,
    });

    return { id: step.id, ...result, duration };
  } catch (e) {
    const duration = Math.round(performance.now() - start);
    logEvent({
      type: 'task-run',
      stepId: step.id,
      stepType: type,
      status: 'failed',
      error: e.message,
      duration,
    });
    return { id: step.id, status: 'failed', output: e.message, duration };
  }
}

/**
 * Available step types.
 * @returns {string[]}
 */
export function availableTypes() {
  return Object.keys(EXECUTORS);
}
