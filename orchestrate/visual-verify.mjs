/**
 * Visual verification loop for /opsx-auto mode.
 * Emits events on the event bus that the harness picks up and executes
 * via Playwright MCP / Chrome DevTools MCP browser tools.
 *
 * The engine only emits signals — the actual browser interaction is done
 * by the harness (the AI agent) listening on the event bus.
 *
 * @module orchestrate/visual-verify
 */

import { execSync, spawn } from 'node:child_process';
import { emit } from './event-bus.mjs';
import { logEvent } from './audit-log.mjs';
import { resolvePaths } from './config-resolver.mjs';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const { projectRoot } = resolvePaths();

/** @type {import('node:child_process').ChildProcess|null} */
let devServerProcess = null;
let devServerPort = 3000;
let maxFixIterations = 3;

/**
 * Start the local development server (npx serve dist).
 * Emits 'auto:verify:start-dev' when ready.
 * @param {number} [port=3000]
 * @returns {Promise<{started: boolean, port: number, error?: string}>}
 */
export async function startDevServer(port = 3000) {
  devServerPort = port;
  await emit('auto:verify:start-dev', { port });

  const distDir = resolve(projectRoot, 'dist');
  if (!existsSync(resolve(distDir, 'index.html'))) {
    const msg = 'dist/index.html not found — build first';
    logEvent({ type: 'visual-verify', phase: 'start-dev', error: msg });
    await emit('auto:verify:dev-error', { error: msg });
    return { started: false, port, error: msg };
  }

  try {
    devServerProcess = spawn('npx', ['serve', 'dist', '-p', String(port)], {
      cwd: projectRoot,
      stdio: 'pipe',
      shell: true,
    });

    devServerProcess.on('error', async (err) => {
      await emit('auto:verify:dev-error', { error: err.message });
    });

    // Wait a bit for the server to start
    await new Promise((r) => setTimeout(r, 2000));

    logEvent({ type: 'visual-verify', phase: 'start-dev', port });
    return { started: true, port };
  } catch (e) {
    await emit('auto:verify:dev-error', { error: e.message });
    return { started: false, port, error: e.message };
  }
}

/**
 * Stop the dev server.
 * Emits 'auto:verify:cleanup'.
 * @returns {Promise<{stopped: boolean}>}
 */
export async function stopDevServer() {
  if (devServerProcess) {
    devServerProcess.kill('SIGTERM');
    devServerProcess = null;
  }
  // Also try killing any lingering serve processes on the port
  try {
    execSync(`npx kill-port ${devServerPort}`, { stdio: 'pipe', timeout: 5000 });
  } catch { /* port may not be in use */ }

  await emit('auto:verify:cleanup', { port: devServerPort });
  logEvent({ type: 'visual-verify', phase: 'cleanup' });
  return { stopped: true };
}

/**
 * Take a screenshot of a page via the harness.
 * Emits 'auto:verify:screenshot' — harness picks up and uses Playwright MCP.
 * @param {string} url — the local URL to screenshot
 * @param {string} [label='default'] — label for the screenshot
 * @returns {Promise<{taken: boolean, label: string}>}
 */
export async function screenshot(url, label = 'default') {
  await emit('auto:verify:screenshot', { url, label });
  logEvent({ type: 'visual-verify', phase: 'screenshot', url, label });
  return { taken: true, label };
}

/**
 * Check the page for console errors and broken resources.
 * Emits 'auto:verify:check-errors' — harness picks up and uses Chrome DevTools MCP.
 * @param {string} [url='http://localhost:3000']
 * @returns {Promise<{checked: boolean, url: string}>}
 */
export async function checkErrors(url = `http://localhost:${devServerPort}`) {
  await emit('auto:verify:check-errors', { url });
  logEvent({ type: 'visual-verify', phase: 'check-errors', url });
  return { checked: true, url };
}

/**
 * Run basic interactions on a page.
 * Emits 'auto:verify:interact' — harness picks up and uses Playwright MCP.
 * @param {string} [url='http://localhost:3000']
 * @param {object} [actions={}] — interaction description
 * @returns {Promise<{ran: boolean, url: string}>}
 */
export async function interact(url = `http://localhost:${devServerPort}`, actions = {}) {
  await emit('auto:verify:interact', { url, actions });
  logEvent({ type: 'visual-verify', phase: 'interact', url });
  return { ran: true, url };
}

/**
 * Run the full visual verification on a specific page.
 * @param {string} pagePath — the page path to verify (e.g., '/pricing/')
 * @param {number} [port=3000]
 * @returns {Promise<{url: string, issues: string[], passed: boolean}>}
 */
export async function verifyPage(pagePath, port = 3000) {
  const url = `http://localhost:${port}${pagePath}`;
  const issues = [];

  try {
    await emit('auto:verify:page-start', { url, path: pagePath });
  } catch { /* best-effort */ }

  // 1. Navigate and screenshot
  try {
    await screenshot(url, pagePath.replace(/\//g, '-'));
  } catch (e) {
    issues.push(`Screenshot failed: ${e.message}`);
  }

  // 2. Check console errors
  try {
    await checkErrors(url);
  } catch (e) {
    issues.push(`Error check failed: ${e.message}`);
  }

  // 3. Check responsive
  try {
    await emit('auto:verify:responsive', { url });
  } catch { /* best-effort */ }

  try {
    await emit('auto:verify:page-end', { url, path: pagePath, issues });
  } catch { /* best-effort */ }

  return { url, issues, passed: issues.length === 0 };
}

/**
 * Run the full visual verification loop for multiple pages.
 * Auto-fixes and re-verifies up to maxIterations times.
 *
 * @param {string[]} pages — page paths to verify
 * @param {number} [port=3000]
 * @param {number} [maxIterations=3]
 * @returns {Promise<{pages: object[], totalIssues: number, iterations: number, finalPassed: boolean}>}
 */
export async function verifyAll(pages, port = 3000, maxIterations = 3) {
  maxFixIterations = maxIterations;
  let iterations = 0;
  let lastIssues = [];
  let finalPassed = false;

  await emit('auto:verify:loop-start', { pages, port, maxIterations });

  while (iterations < maxFixIterations) {
    iterations++;
    const pageResults = [];
    const allIssues = [];

    await emit('auto:verify:iteration', { iteration: iterations, total: maxIterations });

    for (const page of pages) {
      const result = await verifyPage(page, port);
      pageResults.push(result);
      allIssues.push(...result.issues);
    }

    lastIssues = allIssues;

    if (allIssues.length === 0) {
      finalPassed = true;
      break;
    }

    logEvent({
      type: 'visual-verify',
      phase: 'iteration',
      iteration: iterations,
      issues: allIssues,
    });

    // Emit fix-needed event — harness auto-fixes
    await emit('auto:verify:fix-needed', {
      issues: allIssues,
      iteration: iterations,
      pages,
    });
  }

  await emit('auto:verify:loop-end', { iterations, passed: finalPassed, issues: lastIssues });

  return {
    pages: pages.map((p) => ({
      path: p,
      verified: true,
      passed: lastIssues.length === 0,
    })),
    totalIssues: lastIssues.length,
    iterations,
    finalPassed,
  };
}

/**
 * Set the maximum number of fix iterations.
 * @param {number} n
 */
export function setMaxIterations(n) { maxFixIterations = n; }

/**
 * Get the current dev server port.
 * @returns {number}
 */
export function getDevPort() { return devServerPort; }
