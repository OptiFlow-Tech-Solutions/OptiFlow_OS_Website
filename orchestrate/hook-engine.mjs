/**
 * Lifecycle hook execution engine.
 * Runs project and global hooks for orchestration lifecycle events.
 * @module orchestrate/hook-engine
 */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname || '.', '..');
const PROJECT_HOOKS_DIR = resolve(ROOT, 'hooks');
const GLOBAL_HOOKS_DIR = resolve('C:\\Users\\Deel\\.config\\opencode\\hooks');

/**
 * Execute a single hook by name.
 * @param {string} hookName - Hook file name without path (e.g. 'pre-build.mjs')
 * @param {Record<string, any>} [context={}]
 * @returns {{ran: boolean, output: string}}
 */
export function executeHook(hookName, context = {}) {
  const hookPath = resolve(PROJECT_HOOKS_DIR, hookName);
  if (!existsSync(hookPath)) return { ran: false, output: '' };

  try {
    const output = execSync(`node "${hookPath}"`, {
      cwd: ROOT,
      encoding: 'utf-8',
      timeout: 300000,
      stdio: 'pipe',
    }).trim();
    return { ran: true, output };
  } catch (e) {
    return { ran: true, output: e.stderr || e.stdout || e.message };
  }
}

/**
 * Run all hooks matching a lifecycle event. Checks project hooks first, then global hooks.
 * @param {string} event - Lifecycle event name
 * @param {Record<string, any>} [context={}]
 * @returns {{project: string[], global: string[], allResults: {ran: boolean, output: string}[]}}
 */
export function executeLifecycle(event, context = {}) {
  const hookFile = `${event}.mjs`;
  const projectResults = [];
  const globalResults = [];

  // Project hook
  const projectPath = resolve(PROJECT_HOOKS_DIR, hookFile);
  if (existsSync(projectPath)) {
    const r = executeHook(hookFile, context);
    projectResults.push(hookFile);
  }

  // Global hooks
  if (existsSync(GLOBAL_HOOKS_DIR)) {
    const globalPath = resolve(GLOBAL_HOOKS_DIR, hookFile);
    if (existsSync(globalPath)) {
      try {
        const output = execSync(`node "${globalPath}"`, {
          cwd: ROOT,
          encoding: 'utf-8',
          timeout: 300000,
          stdio: 'pipe',
        }).trim();
        globalResults.push({ ran: true, output });
      } catch (e) {
        globalResults.push({ ran: true, output: e.stderr || e.stdout || e.message });
      }
      globalResults.push(hookFile);
    }
  }

  const allResults = [
    ...projectResults.map((name) => ({ ran: true, output: '' })),
    ...globalResults.map((o) => (typeof o === 'string' ? { ran: false, output: '' } : o)),
  ];

  return {
    project: projectResults,
    global: globalResults.filter((g) => typeof g === 'string'),
    allResults,
  };
}

/**
 * Map an orchestration phase to its lifecycle events.
 * @param {string} phase - Phase name
 * @returns {string[]}
 */
export function lifecycleForPhase(phase) {
  switch (phase) {
    case 'explore': return [];
    case 'propose': return ['pre-build'];
    case 'apply': return ['pre-build', 'post-build', 'theme-change'];
    case 'verify': return ['pre-build', 'post-build', 'post-deploy'];
    case 'archive': return ['pre-commit', 'pre-push'];
    default: return [];
  }
}
