/**
 * Human-in-the-loop approval gate for orchestration checkpoints.
 * @module orchestrate/human-gate
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname || '.', '..');
const GATES_DIR = resolve(ROOT, 'orchestrate', '.gates');

/**
 * Create an approval gate. Writes a JSON file and polls it for a human decision.
 * @param {string} question - The question to present
 * @param {{timeout?: number}} [opts]
 * @returns {Promise<boolean>}
 */
export function createGate(question, { timeout = 60000 } = {}) {
  if (!existsSync(GATES_DIR)) mkdirSync(GATES_DIR, { recursive: true });

  const gateId = `gate-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const gateFile = resolve(GATES_DIR, `${gateId}.json`);

  writeFileSync(
    gateFile,
    JSON.stringify({ question, approved: null, created: new Date().toISOString() }, null, 2),
    'utf-8',
  );

  console.error(`\n[HUMAN GATE] ${question}`);
  console.error(`[HUMAN GATE] Edit ${gateFile} — set "approved": true or false`);
  console.error(`[HUMAN GATE] Waiting ${timeout / 1000}s...`);

  return new Promise((resolvePromise) => {
    const start = Date.now();

    const poll = () => {
      if (!existsSync(gateFile)) return resolvePromise(false);
      try {
        const data = JSON.parse(readFileSync(gateFile, 'utf-8'));
        if (data.approved === true) return resolvePromise(true);
        if (data.approved === false) return resolvePromise(false);
        if (Date.now() - start >= timeout) return resolvePromise(false);
        setTimeout(poll, 500);
      } catch {
        setTimeout(poll, 500);
      }
    };

    poll();
  });
}
