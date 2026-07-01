/**
 * V5 Full traceability engine with Feature ID support.
 * Links feature IDs → spec requirements → tasks → git commits → changed files.
 * The Feature ID is the root of every trace chain (Vertical Slice Architecture).
 * @module orchestrate/traceability
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';
import { logEvent } from './audit-log.mjs';

const { projectRoot } = resolvePaths();

function parseRequirement(line) {
  const m = line.match(/^[-*]\s+(?:REQ\d+:\s*)?(.+)/i);
  return m ? m[1].trim() : null;
}

function parseChecklistItems(content) {
  const items = [];
  for (const line of content.split('\n')) {
    const m = line.trim().match(/^-\s*\[[ x]\](.+)/i);
    if (m) items.push(m[1].trim());
  }
  return items;
}

function readSpecDeltas(changeDir) {
  const specsDir = join(changeDir, 'specs');
  if (!existsSync(specsDir)) return [];

  const specs = [];
  for (const entry of readdirSync(specsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const content = readFileSync(join(specsDir, entry.name), 'utf-8');
    const requirements = [];
    for (const line of content.split('\n')) {
      const req = parseRequirement(line);
      if (req) requirements.push(req);
    }
    if (requirements.length > 0) specs.push({ file: entry.name, requirements });
  }
  return specs;
}

function readTasks(changeDir) {
  const tasksPath = join(changeDir, 'tasks.md');
  if (!existsSync(tasksPath)) return [];
  return parseChecklistItems(readFileSync(tasksPath, 'utf-8'));
}

/**
 * Get recent git commits matching the change.
 */
function getRelevantCommits(_changeName) {
  try {
    const log = execSync(
      `git log --oneline --no-merges -20`,
      { cwd: projectRoot, encoding: 'utf-8', timeout: 10000 },
    ).trim();
    return log.split('\n').map((line) => {
      const [hash, ...msg] = line.split(' ');
      return { hash, message: msg.join(' ') };
    });
  } catch {
    return [];
  }
}

/**
 * Get files changed in a specific commit.
 */
function getChangedFiles(commitHash) {
  try {
    const files = execSync(
      `git diff-tree --no-commit-id --name-only -r ${commitHash}`,
      { cwd: projectRoot, encoding: 'utf-8', timeout: 10000 },
    ).trim();
    return files ? files.split('\n') : [];
  } catch {
    return [];
  }
}

/**
 * Generate a traceability report for a change.
 */
export function generateTrace(changeName, commitHash) {
  const changeDir = resolve(projectRoot, 'openspec', 'changes', changeName);
  if (!existsSync(changeDir)) return { specs: [] };

  const tasks = readTasks(changeDir);
  const deltas = readSpecDeltas(changeDir);
  const changedFiles = commitHash !== 'HEAD' ? getChangedFiles(commitHash) : [];

  const specs = [];
  for (const delta of deltas) {
    const requirements = [];
    for (const req of delta.requirements) {
      const matchedTasks = tasks.filter((t) => {
        const taskWords = new Set(t.toLowerCase().split(/\s+/));
        const reqWords = req.toLowerCase().split(/\s+/);
        return reqWords.some((w) => taskWords.has(w) && w.length > 3);
      });
      requirements.push({
        requirement: req,
        tasks: matchedTasks.length > 0 ? matchedTasks : tasks,
        commit: commitHash,
        files: changedFiles.length > 0 ? changedFiles : ['(no file data)'],
      });
    }
    specs.push({ file: delta.file, requirements });
  }

  logEvent({ type: 'trace', changeName, commitHash, specCount: specs.length });

  return { specs };
}

const PATH_PATTERNS = {
  design: [/assets\/css\//, /DESIGN\.md/],
  frontend: [/src\/pages\//, /assets\/js\//],
  build: [/scripts\//, /hooks\//, /package\.json/],
  seo: [/site\.json/, /openspec/],
  accessibility: [/assets\/css\//, /src\/pages\//],
};

export function linkToFiles(specRequirements, changedFiles) {
  const links = [];
  for (const spec of specRequirements) {
    const baseName = spec.file.replace('.md', '');
    const patterns = PATH_PATTERNS[baseName] || [];
    for (const req of spec.requirements) {
      const matched = changedFiles.filter((f) =>
        patterns.some((re) => re.test(f)) ||
        f.toLowerCase().includes(baseName) ||
        req.split(/\s+/).some((w) => w.length > 3 && f.toLowerCase().includes(w.toLowerCase())),
      );
      links.push({
        specFile: spec.file,
        requirement: req,
        matchedFiles: matched.length > 0 ? matched : changedFiles,
      });
    }
  }
  return links;
}

/**
 * Generate full structured trace with commit-level detail.
 */
export function generateFullTrace(changeName, commitHash, changedFiles = []) {
  const changeDir = resolve(projectRoot, 'openspec', 'changes', changeName);
  if (!existsSync(changeDir)) return { specs: [] };

  const tasks = readTasks(changeDir);
  const deltas = readSpecDeltas(changeDir);

  // If no changedFiles provided, try to get them from the commit
  let files = changedFiles;
  if (!files.length && commitHash && commitHash !== 'HEAD') {
    files = getChangedFiles(commitHash);
  }

  const links = linkToFiles(deltas, files);
  const specs = [];

  for (const delta of deltas) {
    const requirements = [];
    for (const req of delta.requirements) {
      const matchedTasks = tasks.filter((t) => {
        const taskWords = new Set(t.toLowerCase().split(/\s+/));
        const reqWords = req.toLowerCase().split(/\s+/);
        return reqWords.some((w) => taskWords.has(w) && w.length > 3);
      });
      const link = links.find((l) => l.specFile === delta.file && l.requirement === req);
      requirements.push({
        requirement: req,
        tasks: matchedTasks.length > 0 ? matchedTasks : tasks,
        commit: commitHash,
        files: link ? link.matchedFiles : files,
      });
    }
    specs.push({ file: delta.file, requirements });
  }

  return { specs };
}

/**
 * Generate a complete traceability report for the last N commits.
 */
export function generateCommitTrace(count = 10) {
  const commits = getRelevantCommits('');
  const recent = commits.slice(0, count);
  const traces = [];

  for (const commit of recent) {
    const files = getChangedFiles(commit.hash);
    traces.push({
      hash: commit.hash,
      message: commit.message,
      files,
      timestamp: '', // ponytail: add author date with `git log --format=%aI` if needed
    });
  }

  return { commits: traces };
}

export function exportTrace(trace, format) {
  if (format === 'json') return JSON.stringify(trace, null, 2);

  const lines = ['# Traceability Report', ''];
  for (const spec of trace.specs) {
    lines.push(`## ${spec.file}`, '');
    for (const req of spec.requirements) {
      lines.push(`- **${req.requirement}**`);
      lines.push(`  - Tasks: ${req.tasks.join(', ')}`);
      lines.push(`  - Commit: ${req.commit}`);
      lines.push(`  - Files: ${req.files.join(', ')}`);
      lines.push('');
    }
  }
  return lines.join('\n');
}

/**
 * V5: Generate traceability for a feature ID.
 * Reconstructs the full trace chain: feature → spec → delta → task → commit → file.
 * @param {string} featureId - Feature ID (e.g., "F-010")
 * @param {string} [commitHash='HEAD'] - Git commit hash
 * @returns {object}
 */
export async function generateFeatureTrace(featureId, commitHash = 'HEAD') {
  const featurePath = resolve(projectRoot, 'features', 'features.json');
  let feature = null;

  if (existsSync(featurePath)) {
    const registry = JSON.parse(readFileSync(featurePath, 'utf-8'));
    feature = registry.features.find((f) => f.id === featureId || f.name === featureId);
  }

  const trace = {
    featureId,
    feature: feature ? { id: feature.id, name: feature.name, module: feature.parentModule, priority: feature.priority, status: feature.status } : null,
    specs: [],
    commits: [],
    files: [],
  };

  // Get changed files for the commit
  if (commitHash !== 'HEAD') {
    trace.files = getChangedFiles(commitHash);
  }

  // Get relevant commits
  trace.commits = getRelevantCommits('').slice(0, 10);

  // Find related specs from change directories
  const changesDir = resolve(projectRoot, 'openspec', 'changes');
  if (existsSync(changesDir)) {
    for (const entry of readdirSync(changesDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const changeDir = join(changesDir, entry.name);
      const deltas = readSpecDeltas(changeDir);
      if (deltas.length > 0) {
        trace.specs.push({ change: entry.name, deltas });
      }
    }
  }

  // Add capability specs
  const capabilitySpecs = readSpecDeltas(resolve(projectRoot, 'openspec', 'specs'));
  if (capabilitySpecs.length > 0) {
    trace.specs.push({ change: 'capability-specs', deltas: capabilitySpecs });
  }

  logEvent({ type: 'feature-trace', featureId, commitHash });

  return trace;
}
