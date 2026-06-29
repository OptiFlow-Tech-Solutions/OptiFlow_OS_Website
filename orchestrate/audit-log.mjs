/**
 * Structured JSON audit trail for orchestration events.
 * @module orchestrate/audit-log
 */

import { existsSync, appendFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname || '.', '..');
const LOG_FILE = resolve(ROOT, 'orchestrate', '.audit.jsonl');

/**
 * Append an event to the audit log.
 * @param {Record<string, any>} event - Key-value pairs (timestamp auto-added)
 */
export function logEvent(event) {
  const entry = JSON.stringify({ timestamp: new Date().toISOString(), ...event });
  appendFileSync(LOG_FILE, entry + '\n', 'utf-8');
}

/**
 * Query audit events by field values.
 * @param {Record<string, any>} [filter={}]
 * @returns {Array<Record<string, any>>}
 */
export function queryEvents(filter = {}) {
  if (!existsSync(LOG_FILE)) return [];

  const events = readFileSync(LOG_FILE, 'utf-8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((l) => {
      try { return JSON.parse(l); } catch { return null; }
    })
    .filter(Boolean);

  const keys = Object.keys(filter);
  if (!keys.length) return events;

  return events.filter((e) => keys.every((k) => e[k] === filter[k]));
}
