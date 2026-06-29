/**
 * Persist orchestration state to disk as JSON files.
 * @module orchestrate/state-manager
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname || '.', '..');
const STATE_DIR = resolve(ROOT, 'orchestrate', '.state');

function ensureDir() {
  if (!existsSync(STATE_DIR)) mkdirSync(STATE_DIR, { recursive: true });
}

/**
 * @param {string} stateId
 * @param {object} state
 */
export function saveState(stateId, state) {
  ensureDir();
  writeFileSync(resolve(STATE_DIR, `${stateId}.json`), JSON.stringify(state, null, 2), 'utf-8');
}

/**
 * @param {string} stateId
 * @returns {object|null}
 */
export function loadState(stateId) {
  const fp = resolve(STATE_DIR, `${stateId}.json`);
  if (!existsSync(fp)) return null;
  return JSON.parse(readFileSync(fp, 'utf-8'));
}

/**
 * @returns {string[]}
 */
export function listStates() {
  ensureDir();
  return readdirSync(STATE_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.slice(0, -5));
}

/**
 * @param {string} stateId
 */
export function deleteState(stateId) {
  const fp = resolve(STATE_DIR, `${stateId}.json`);
  if (existsSync(fp)) unlinkSync(fp);
}
