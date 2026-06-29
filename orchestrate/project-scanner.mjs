/**
 * Scans the project directory for local resources (specs, changes, pages, hooks, commands).
 * @module orchestrate/project-scanner
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = resolve(import.meta.dirname || '.', '..');

/**
 * Scan openspec/specs/{name}/spec.md.
 * @returns {Array<{name: string, path: string}>}
 */
function scanSpecs() {
  const specsDir = join(ROOT, 'openspec', 'specs');
  if (!existsSync(specsDir)) return [];
  return readdirSync(specsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .filter((d) => existsSync(join(specsDir, d.name, 'spec.md')))
    .map((d) => ({ name: d.name, path: join(specsDir, d.name, 'spec.md') }));
}

/**
 * Scan openspec/changes/* directories.
 * @returns {string[]}
 */
function scanChanges() {
  const changesDir = join(ROOT, 'openspec', 'changes');
  if (!existsSync(changesDir)) return [];
  return readdirSync(changesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

/**
 * Scan project commands/*.md.
 * @returns {Array<{name: string, path: string}>}
 */
function scanProjectCommands() {
  const cmdsDir = join(ROOT, 'commands');
  if (!existsSync(cmdsDir)) return [];
  return readdirSync(cmdsDir, { withFileTypes: true })
    .filter((f) => f.isFile() && f.name.endsWith('.md'))
    .map((f) => ({ name: f.name.replace(/\.md$/, ''), path: join(cmdsDir, f.name) }));
}

/**
 * Scan project hooks/*.mjs.
 * @returns {Array<{name: string, path: string}>}
 */
function scanProjectHooks() {
  const hooksDir = join(ROOT, 'hooks');
  if (!existsSync(hooksDir)) return [];
  return readdirSync(hooksDir, { withFileTypes: true })
    .filter((f) => f.isFile() && f.name.endsWith('.mjs'))
    .map((f) => ({ name: f.name, path: join(hooksDir, f.name) }));
}

/**
 * Load page inventory from site.json.
 * @returns {Array<{file: string, title: string, active: (string|null)}>}
 */
function scanPages() {
  const sitePath = join(ROOT, 'site.json');
  if (!existsSync(sitePath)) return [];
  try {
    const site = JSON.parse(readFileSync(sitePath, 'utf-8'));
    return (site.pages || []).map((p) => ({ file: p.file, title: p.title, active: p.active }));
  } catch { return []; }
}

/**
 * Check if the design system specification exists.
 * @returns {boolean}
 */
function checkDesignSystem() {
  const dir = join(ROOT, 'OptiFlow-OS-—-Enterprise-DESIGN.md-Specification-(v5.0)');
  return existsSync(dir) && existsSync(join(dir, 'DESIGN.md'));
}

/**
 * Get current git branch name.
 * @returns {string}
 */
export function getBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { cwd: ROOT, encoding: 'utf-8' }).trim();
  } catch { return 'unknown'; }
}

/**
 * Get files changed since a git ref.
 * @param {string} since - Git ref to diff from (e.g. 'main', 'HEAD~3')
 * @returns {string[]}
 */
export function getChangedFiles(since) {
  try {
    return execSync(`git diff --name-only ${since} HEAD`, { cwd: ROOT, encoding: 'utf-8' })
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch { return []; }
}

/**
 * Scan the full project for local resources.
 * @returns {{
 *   specs: {name: string, path: string}[],
 *   changes: string[],
 *   commands: {name: string, path: string}[],
 *   hooks: {name: string, path: string}[],
 *   pages: {file: string, title: string, active: string|null}[],
 *   designSystem: boolean
 * }}
 */
export function scanProject() {
  return {
    specs: scanSpecs(),
    changes: scanChanges(),
    commands: scanProjectCommands(),
    hooks: scanProjectHooks(),
    pages: scanPages(),
    designSystem: checkDesignSystem(),
  };
}
