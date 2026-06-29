/**
 * Determines the correct OpenSpec phase based on change directory state.
 * @module orchestrate/phase-detector
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = resolve(import.meta.dirname || '.', '..');
const CHANGES_DIR = resolve(ROOT, 'openspec', 'changes');

/**
 * Detect the current OpenSpec phase for a change.
 * @param {string} changeName
 * @returns {'explore'|'propose'|'plan'|'apply'|'verify'|'complete'}
 */
export function detectPhase(changeName) {
  const dir = join(CHANGES_DIR, changeName);
  if (!existsSync(dir)) return 'explore';

  const proposalPath = join(dir, 'proposal.md');
  if (!existsSync(proposalPath)) return 'propose';

  const tasksPath = join(dir, 'tasks.md');
  if (!existsSync(tasksPath)) return 'plan';

  const tasksContent = readFileSync(tasksPath, 'utf-8');
  const incomplete = /-\s+\[ \]/.test(tasksContent);
  if (incomplete) return 'apply';

  const archivedPath = resolve(ROOT, 'openspec', 'archive', changeName);
  if (existsSync(archivedPath)) return 'complete';

  return 'verify';
}

/**
 * Detect task tier from tasks.md content.
 * @param {string} tasksContent - Raw markdown content of tasks.md
 * @returns {'trivial'|'standard'|'large'}
 */
export function detectSize(tasksContent) {
  const count = (tasksContent.match(/^-\s+\[[ x]\]/gm) || []).length;
  if (count <= 3) return 'trivial';
  if (count <= 10) return 'standard';
  return 'large';
}
