/**
 * V13: Telemetry export and audit reporting.
 *
 * Provides structured exports of execution history, performance trends,
 * and audit reports for enterprise observability.
 *
 * @module orchestrate/telemetry
 */

import { existsSync, writeFileSync, mkdirSync, appendFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';
import { listPipelineStates, loadPipelineState } from './state-manager.mjs';
import { queryEvents } from './audit-log.mjs';

const { projectRoot } = resolvePaths();
const TELEMETRY_DIR = resolve(projectRoot, 'orchestrate', '.telemetry');

function ensureTelemetryDir() {
  if (!existsSync(TELEMETRY_DIR)) mkdirSync(TELEMETRY_DIR, { recursive: true });
}

/**
 * Export telemetry data for all pipeline executions.
 * Produces JSONL and summary JSON.
 *
 * @returns {{summary: object, executions: object[]}}
 */
export function exportTelemetry() {
  ensureTelemetryDir();

  const states = listPipelineStates();
  const executions = [];

  for (const execId of states) {
    try {
      const state = loadPipelineState(execId);
      if (!state) continue;

      executions.push({
        executionId: state.executionId,
        task: state.task,
        status: state.status,
        goalState: state.goalState,
        iterations: state.iterationCount,
        startedAt: state.startedAt,
        completedAt: state.completedAt,
        totalDuration: state.totalDuration,
        phases: (state.phases || []).map((p) => ({
          id: p.id, status: p.status, duration: p.duration,
        })),
        sharedMemory: state.sharedMemory ? {
          findings: state.sharedMemory.findings?.length || 0,
          decisions: state.sharedMemory.decisions?.length || 0,
          risks: state.sharedMemory.risks?.length || 0,
        } : null,
        skillsUsed: state.skills?.length || 0,
        primaryAgent: state.agents?.primaryAgent || 'unknown',
        validationPassed: state.validation?.passed ?? null,
      });
    } catch { /* corrupted state, skip */ }
  }

  // Compute summary statistics
  const summary = computeSummary(executions);

  // Write telemetry files
  try {
    const summaryPath = resolve(TELEMETRY_DIR, 'telemetry-summary.json');
    writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');

    const exportPath = resolve(TELEMETRY_DIR, 'executions.jsonl');
    for (const exec of executions) {
      appendFileSync(exportPath, JSON.stringify(exec) + '\n', 'utf-8');
    }
  } catch { /* non-critical */ }

  return { summary, executions };
}

function computeSummary(executions) {
  if (!executions.length) return { count: 0 };

  const completed = executions.filter((e) => e.status === 'done' || e.goalState === 'COMPLETE');
  const failed = executions.filter((e) => e.status === 'failed' || e.goalState === 'FAILED');
  const durations = executions.filter((e) => e.totalDuration > 0).map((e) => e.totalDuration);
  const avgDuration = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

  const skillsUsage = {};
  for (const e of executions) {
    if (e.skillsUsed > 0) {
      const bucket = `${e.skillsUsed}-skills`;
      skillsUsage[bucket] = (skillsUsage[bucket] || 0) + 1;
    }
  }

  const agentUsage = {};
  for (const e of executions) {
    const agent = e.primaryAgent || 'unknown';
    agentUsage[agent] = (agentUsage[agent] || 0) + 1;
  }

  const avgIterations = executions.length
    ? Math.round(executions.reduce((a, b) => a + (b.iterations || 0), 0) / executions.length)
    : 0;

  return {
    totalExecutions: executions.length,
    completed: completed.length,
    failed: failed.length,
    successRate: executions.length ? Math.round((completed.length / executions.length) * 100) : 0,
    avgDurationMs: avgDuration,
    avgIterations,
    topAgents: Object.entries(agentUsage).sort(([, a], [, b]) => b - a).slice(0, 5),
    oldestExecution: executions[executions.length - 1]?.startedAt || null,
    newestExecution: executions[0]?.startedAt || null,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Generate an audit report from the audit log.
 * @param {object} [filter]
 * @returns {{events: object[], summary: object}}
 */
export function generateAuditReport(filter = {}) {
  let events = [];
  try {
    events = queryEvents(filter);
  } catch { /* audit log unavailable */ }

  const byType = {};
  for (const e of events) {
    const type = e.type || 'unknown';
    byType[type] = (byType[type] || 0) + 1;
  }

  const autoPipelineEvents = events.filter((e) =>
    e.type === 'auto-pipeline' || e.type === 'auto-pipeline-v13');
  const succeeded = autoPipelineEvents.filter((e) =>
    e.phase === 'complete').length;
  const failed = autoPipelineEvents.filter((e) =>
    e.phase === 'error' || e.phase === 'failed').length;

  return {
    events,
    summary: {
      totalEvents: events.length,
      byType,
      autoPipelineExecutions: autoPipelineEvents.length,
      succeeded,
      failed,
      generatedAt: new Date().toISOString(),
    },
  };
}

/**
 * Get performance trend data comparing recent executions.
 * @param {number} [limit=10]
 * @returns {{trends: object[]}}
 */
export function getPerformanceTrends(limit = 10) {
  const { exports: tel } = exportTelemetry();
  const recent = (tel.executions || []).slice(0, limit);

  const trends = recent.map((e, i) => ({
    executionId: e.executionId,
    task: e.task?.slice(0, 60),
    durationMs: e.totalDuration || 0,
    iterations: e.iterations || 0,
    validationPassed: e.validationPassed,
    skillsUsed: e.skillsUsed || 0,
    index: i,
  }));

  return { trends };
}
