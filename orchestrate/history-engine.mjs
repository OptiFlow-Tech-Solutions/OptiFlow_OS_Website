/**
 * V1: Structured execution history engine.
 * Maintains chronological, queryable records of every /opsx-auto execution.
 * Written to openspec/history.json for permanent repository visibility.
 *
 * @module orchestrate/history-engine
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';

const { projectRoot } = resolvePaths();
const HISTORY_PATH = resolve(projectRoot, 'openspec', 'history.json');

function loadHistory() {
  if (!existsSync(HISTORY_PATH)) return { version: '1.0.0', records: [], generated: new Date().toISOString() };
  try {
    return JSON.parse(readFileSync(HISTORY_PATH, 'utf-8'));
  } catch {
    return { version: '1.0.0', records: [], generated: new Date().toISOString() };
  }
}

function saveHistory(history) {
  const dir = resolve(projectRoot, 'openspec');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  history.generated = new Date().toISOString();
  writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2), 'utf-8');
}

/**
 * Record a completed execution.
 * @param {object} ctx - PipelineContext summary
 * @param {object} opts
 * @param {string} [opts.commitHash] - HEAD commit at archive time
 * @param {string[]} [opts.changedFiles] - files changed in the commit
 * @param {string} [opts.archiveTarget] - archive directory name
 */
export function recordExecution(ctx, opts = {}) {
  const history = loadHistory();

  const entry = {
    executionId: ctx.executionId,
    task: ctx.task,
    changeName: ctx.changeName,
    status: ctx.status || 'done',
    goalState: ctx.goalState,
    startedAt: ctx.startedAt,
    completedAt: new Date().toISOString(),
    duration: ctx.totalDuration || 0,
    iterationCount: ctx.iterationCount || 0,
    phases: (ctx.phases || []).map((p) => ({
      id: p.id,
      status: p.status,
      duration: p.duration || 0,
    })),
    validation: ctx.validation || { passed: false, failures: [] },
    archiveTarget: opts.archiveTarget || null,
    commitHash: opts.commitHash || null,
    changedFiles: opts.changedFiles || [],
    featureId: ctx.featureId || null,
    featureName: ctx.featureName || null,
  };

  history.records.push(entry);

  // Keep last 200 entries
  if (history.records.length > 200) {
    history.records = history.records.slice(-200);
  }

  saveHistory(history);
  return entry;
}

/**
 * Query execution history.
 * @param {{status?: string, dateFrom?: string, dateTo?: string, limit?: number}} [filters]
 * @returns {object[]}
 */
export function queryHistory(filters = {}) {
  let records = loadHistory().records;

  if (filters.status) {
    records = records.filter((r) => r.status === filters.status);
  }
  if (filters.dateFrom) {
    records = records.filter((r) => r.completedAt >= filters.dateFrom);
  }
  if (filters.dateTo) {
    records = records.filter((r) => r.completedAt <= filters.dateTo);
  }

  records.sort((a, b) => b.completedAt.localeCompare(a.completedAt));

  if (filters.limit) {
    records = records.slice(0, filters.limit);
  }

  return records;
}

/**
 * Get all executions for a specific change or feature.
 * @param {string} changeNameOrFeatureId
 * @returns {object[]}
 */
export function getChangeHistory(changeNameOrFeatureId) {
  const records = loadHistory().records;
  return records.filter(
    (r) =>
      r.changeName === changeNameOrFeatureId ||
      r.featureId === changeNameOrFeatureId ||
      (r.task || '').includes(changeNameOrFeatureId),
  ).sort((a, b) => a.startedAt.localeCompare(b.startedAt));
}

/**
 * Generate a markdown changelog from history.
 * @returns {string}
 */
export function generateChangelog() {
  const records = loadHistory().records
    .filter((r) => r.status === 'done')
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));

  if (!records.length) return '# Changelog\n\nNo executions recorded yet.\n';

  const lines = ['# Execution Changelog', '', `Auto-generated: ${new Date().toISOString()}`, '', '| Date | Task | Duration | Status |', '|------|------|----------|:------:|'];

  for (const r of records.slice(0, 50)) {
    const date = r.completedAt ? r.completedAt.split('T')[0] : 'unknown';
    const task = (r.task || '').slice(0, 50);
    const dur = `${(r.duration / 1000).toFixed(1)}s`;
    const status = r.status === 'done' ? '✓' : '✗';
    lines.push(`| ${date} | ${task} | ${dur} | ${status} |`);
  }

  return lines.join('\n');
}

/**
 * Get summary statistics.
 */
export function historyStats() {
  const records = loadHistory().records;
  const done = records.filter((r) => r.status === 'done').length;
  const failed = records.filter((r) => r.status === 'failed').length;
  const avgDuration = done > 0
    ? records.filter((r) => r.status === 'done').reduce((s, r) => s + (r.duration || 0), 0) / done
    : 0;

  return {
    total: records.length,
    done,
    failed,
    avgDuration,
    lastExecution: records.length ? records[records.length - 1].completedAt : null,
    successRate: records.length > 0 ? Math.round((done / records.length) * 100) : 0,
  };
}

/**
 * Generate history summary markdown.
 */
export function generateHistorySummary() {
  const stats = historyStats();
  const changelog = generateChangelog();

  return [
    '# Execution History',
    '',
    `> Auto-generated: ${new Date().toISOString()}`,
    '',
    '## Summary',
    '',
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Total Executions | ${stats.total} |`,
    `| Successful | ${stats.done} (${stats.successRate}%) |`,
    `| Failed | ${stats.failed} |`,
    `| Average Duration | ${(stats.avgDuration / 1000).toFixed(1)}s |`,
    `| Last Execution | ${stats.lastExecution || 'N/A'} |`,
    '',
    changelog,
  ].join('\n');
}
