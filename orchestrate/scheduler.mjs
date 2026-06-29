/**
 * Simple schedule definition store. Actual cron execution is external
 * (GitHub Actions, system cron, etc.). This module stores/reads definitions.
 * @module orchestrate/scheduler
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname || '.', '..');
const SCHEDULE_FILE = resolve(ROOT, 'orchestrate', '.schedule.json');

function ensureFile() {
  if (!existsSync(SCHEDULE_FILE)) writeFileSync(SCHEDULE_FILE, '[]', 'utf-8');
}

/**
 * Add a schedule definition.
 * @param {{name: string, cron: string, command: string}} spec
 * @returns {Array<{name: string, cron: string, command: string, created: string}>}
 */
export function schedule(spec) {
  ensureFile();
  const schedules = JSON.parse(readFileSync(SCHEDULE_FILE, 'utf-8'));
  const entry = { name: spec.name, cron: spec.cron, command: spec.command, created: new Date().toISOString() };
  schedules.push(entry);
  writeFileSync(SCHEDULE_FILE, JSON.stringify(schedules, null, 2), 'utf-8');
  return schedules;
}

/**
 * @returns {Array<{name: string, cron: string, command: string, created: string}>}
 */
export function listSchedules() {
  ensureFile();
  return JSON.parse(readFileSync(SCHEDULE_FILE, 'utf-8'));
}
