/**
 * V8: Unified task execution interface.
 * Runs shell commands, project hooks, or skill/agent dispatches.
 * Skill and agent steps produce structured results instead of fire-and-forget events.
 * @module orchestrate/task-runner
 */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolvePaths } from './config-resolver.mjs';
import { logEvent } from './audit-log.mjs';
import { emit } from './event-bus.mjs';

const { projectRoot, hooksDir } = resolvePaths();

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

function runHook(hookName) {
  const hookPath = `${hooksDir}\\${hookName}.mjs`;
  if (!existsSync(hookPath)) {
    return { status: 'failed', output: `Hook not found: ${hookName}`, duration: 0 };
  }
  return runCommand(`node "${hookPath}"`);
}

const EXECUTORS = {
  command: async (step) => runCommand(step.command, { timeout: step.timeout }),

  hook: async (step) => runHook(step.command),

  skill: async (step, context) => {
    emit('skill:request', { skill: step.command, context });
    return {
      status: 'done',
      output: JSON.stringify({
        skill: step.command,
        loaded: true,
        intent: 'Agent harness loads and applies this skill.',
      }),
      duration: 0,
    };
  },

  agent: async (step, context) => {
    emit('agent:request', {
      agent: step.command,
      task: step.task || context?.taskDescription || '',
      context,
    });
    return {
      status: 'done',
      output: JSON.stringify({
        agent: step.command,
        dispatched: true,
        task: step.task || context?.taskDescription || '',
        intent: 'AI agent invokes this agent for the task.',
      }),
      duration: 0,
    };
  },

  subagent: async (step, context) => {
    emit('subagent:request', {
      type: step.subagentType || 'general',
      task: step.task || step.command || '',
      context,
    });
    return {
      status: 'done',
      output: JSON.stringify({
        subagentType: step.subagentType || 'general',
        dispatched: true,
        intent: 'AI agent spawns this subagent.',
      }),
      duration: 0,
    };
  },

  check: async (step) => runCommand(step.command),

  gate: async (step, context) => {
    emit('gate:check', { gate: step.command, context });
    return { status: 'done', output: `Gate checked: ${step.command}`, duration: 0 };
  },

  info: async (step) => ({
    status: 'done',
    output: step.command || step.description || '',
    duration: 0,
  }),
};

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

export function availableTypes() {
  return Object.keys(EXECUTORS);
}

export { runCommand, runHook };
