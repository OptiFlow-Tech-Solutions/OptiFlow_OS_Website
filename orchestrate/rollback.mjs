/**
 * Rollback logging — records actions for potential undo.
 * @module orchestrate/rollback
 */

import { existsSync, mkdirSync, appendFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname || '.', '..');
const LOG_FILE = resolve(ROOT, 'orchestrate', '.rollback.log');

function ensureDir() {
  const dir = resolve(ROOT, 'orchestrate');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

/**
 * Record an action that can be rolled back.
 * @param {{description?: string, undo?: string}|string} action
 */
export function recordAction(action) {
  ensureDir();
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    action: typeof action === 'string' ? action : (action.description || action),
    undo: typeof action === 'object' ? action.undo || null : null,
  });
  appendFileSync(LOG_FILE, entry + '\n', 'utf-8');
}

/**
 * Print rollback instructions in reverse order.
 * @returns {Array<{timestamp: string, action: string, undo: string|null}>}
 */
export function rollback() {
  if (!existsSync(LOG_FILE)) {
    console.error('No rollback log found.');
    return [];
  }

  const lines = readFileSync(LOG_FILE, 'utf-8').trim().split('\n').filter(Boolean);
  const entries = lines.map((l) => JSON.parse(l));
  const reversed = [...entries].reverse();

  console.error('\n─ Manual Rollback Instructions ─');
  for (const e of reversed) {
    console.error(`  [${e.timestamp}] ${e.action}`);
    if (e.undo) console.error(`    → undo: ${e.undo}`);
  }
  console.error();

  return reversed;
}
