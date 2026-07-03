/**
 * Unified command runner — single entry point for all shell execution.
 * Consolidates execSync patterns across the orchestration engine.
 * @module orchestrate/command-runner
 */

import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';

const { projectRoot: ROOT } = resolvePaths();

/**
 * Run a shell command with consistent error handling, timeout, and encoding.
 * @param {string} cmd - the command to run
 * @param {{cwd?: string, timeout?: number, silent?: boolean}} [opts]
 * @returns {{ok: boolean, stdout: string, stderr: string, error?: Error}}
 */
export function run(cmd, { cwd = ROOT, timeout = 120000, silent = false } = {}) {
  if (!silent) console.log(`  $ ${cmd}`);
  try {
    const stdout = execSync(cmd, {
      cwd,
      encoding: 'utf-8',
      timeout,
      stdio: 'pipe',
      windowsHide: true,
    }).trim();
    return { ok: true, stdout, stderr: '' };
  } catch (e) {
    return {
      ok: false,
      stdout: (e.stdout || '').trim(),
      stderr: (e.stderr || '').trim(),
      error: e,
    };
  }
}

// ── Convenience wrappers ──

export function build() {
  return run('node scripts/assemble.mjs', { timeout: 120000 });
}

export function validate() {
  return run('node scripts/validate.mjs', { timeout: 60000 });
}

export function lint() {
  return run('npx html-validate "dist/**/*.html"', { timeout: 60000 });
}

export function test() {
  return run('npm test', { timeout: 120000 });
}

export function testPlaywright(spec) {
  const specPath = spec.startsWith('tests/') ? spec : `tests/e2e/${spec}`;
  return run(`npx playwright test ${specPath}`, { timeout: 300000 });
}

export function git(args, opts = {}) {
  return run(`git ${args}`, { timeout: 10000, ...opts });
}

export function gitBranch(opts = {}) {
  const result = git('rev-parse --abbrev-ref HEAD', opts);
  return result.ok ? result.stdout : 'unknown';
}

export function gitChangedFiles(since = 'HEAD') {
  const result = git(`diff --name-only ${since} HEAD`);
  return result.ok ? result.stdout.split('\n').filter(Boolean) : [];
}

export function gitLog(count = 20) {
  const result = git(`log --oneline --no-merges -${count}`);
  if (!result.ok) return [];
  return result.stdout.split('\n').map((line) => {
    const [hash, ...msg] = line.split(' ');
    return { hash, message: msg.join(' ') };
  });
}

export function gitChangedFilesForCommit(commitHash) {
  const result = git(`diff-tree --no-commit-id --name-only -r ${commitHash}`);
  return result.ok ? result.stdout.split('\n').filter(Boolean) : [];
}

/**
 * Run a Node.js module as a child process.
 * @param {string} modulePath - path to the .mjs file
 * @param {object} [opts]
 * @returns {{ok: boolean, stdout: string, stderr: string, error?: Error}}
 */
export function runModule(modulePath, opts = {}) {
  return run(`node "${modulePath}"`, opts);
}
