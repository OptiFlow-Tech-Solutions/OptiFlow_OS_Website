/**
 * Performance metrics collection for orchestration pipelines.
 * Includes export functions for audit logging and final reports.
 * @module orchestrate/metrics
 */

import { logEvent } from './audit-log.mjs';

/** @type {Record<string, {values: number[], min: number, max: number, sum: number}>} */
const metrics = {};

let _timeOrigin = performance.now();

/**
 * Start a named timer. Returns a stop function that records the elapsed ms.
 * @param {string} label
 * @returns {() => number}
 */
export function startTimer(label) {
  const start = performance.now();
  return () => {
    const elapsed = performance.now() - start;
    record(label, elapsed);
    return elapsed;
  };
}

/**
 * Record a metric value.
 * @param {string} label
 * @param {number} value
 */
export function record(label, value) {
  if (!metrics[label]) {
    metrics[label] = { values: [], min: Infinity, max: -Infinity, sum: 0 };
  }
  const m = metrics[label];
  m.values.push(value);
  if (value < m.min) m.min = value;
  if (value > m.max) m.max = value;
  m.sum += value;
}

/**
 * @returns {Record<string, {count: number, min: number, max: number, avg: number}>}
 */
export function summary() {
  /** @type {Record<string, {count: number, min: number, max: number, avg: number}>} */
  const out = {};
  for (const [label, m] of Object.entries(metrics)) {
    out[label] = {
      count: m.values.length,
      min: m.min === Infinity ? 0 : m.min,
      max: m.max === -Infinity ? 0 : m.max,
      avg: m.values.length ? m.sum / m.values.length : 0,
    };
  }
  return out;
}

/**
 * Export metrics to the audit log and return a plain summary object.
 * Call at pipeline finish to capture execution telemetry.
 * @returns {{totalDuration: number, phases: object, detail: object}}
 */
export function exportMetrics(executionId = '') {
  const s = summary();
  const totalDuration = performance.now() - _timeOrigin;

  logEvent({
    type: 'metrics-export',
    executionId,
    totalDuration,
    phases: s,
  });

  return { totalDuration, phases: s };
}

/**
 * Reset all metrics (for a new pipeline run).
 */
export function reset() {
  for (const key of Object.keys(metrics)) delete metrics[key];
  _timeOrigin = performance.now();
}
