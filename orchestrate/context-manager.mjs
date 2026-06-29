/**
 * Strategic context manager for agent sessions.
 * Tracks context budget, prunes irrelevant data, and manages strategic loading.
 * @module orchestrate/context-manager
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolvePaths } from './config-resolver.mjs';
import { parseAllSpecs } from './spec-parser.mjs';
import { resolveAffectedSpecs } from './spec-resolver.mjs';
import { get as cacheGet, set as cacheSet } from './cache-manager.mjs';

const { projectRoot } = resolvePaths();

/** Approximate token counts (rough estimate: 1 token ≈ 4 chars) */
function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

/**
 * @typedef {{
 *   key: string,
 *   path: string,
 *   type: string,
 *   tokens: number,
 *   priority: 'critical'|'high'|'medium'|'low',
 *   loaded: boolean
 * }} ContextItem
 */

/**
 * @typedef {{
 *   budget: number,
 *   used: number,
 *   items: ContextItem[],
 *   tier: 'minimal'|'standard'|'full'
 * }} ContextBudget
 */

/**
 * Determine context budget based on tier and branch.
 * @param {'trivial'|'standard'|'large'} tier
 * @param {string} [branch='main']
 * @returns {ContextBudget}
 */
export function createBudget(tier = 'standard', branch = 'main') {
  const limits = {
    trivial: 15000,  // ~60K chars
    standard: 30000, // ~120K chars
    large: 60000,    // ~240K chars
  };

  return {
    budget: limits[tier] || limits.standard,
    used: 0,
    items: [],
    tier,
  };
}

/**
 * Define what context items should be loaded and in what priority.
 * @returns {Array<{key: string, path: string, type: string, priority: string}>}
 */
function getContextItems(taskDescription, affectedSpecs) {
  const { siteJsonPath, designDir } = resolvePaths();

  const items = [
    { key: 'site', path: siteJsonPath, type: 'json', priority: 'critical' },
    { key: 'design', path: designDir || '', type: 'dir', priority: 'critical' },
    { key: 'agents', path: `${projectRoot}/AGENTS.md`, type: 'markdown', priority: 'high' },
  ];

  // Add affected specs at high priority
  for (const spec of affectedSpecs) {
    items.push({
      key: `spec:${spec.specName}`,
      path: `${projectRoot}/openspec/specs/${spec.specName}/spec.md`,
      type: 'spec',
      priority: spec.confidence > 0.5 ? 'high' : 'medium',
    });
  }

  // Add remaining specs at low priority
  const allSpecs = parseAllSpecs().map((s) => s.name);
  const affectedNames = new Set(affectedSpecs.map((s) => s.specName));
  for (const name of allSpecs) {
    if (!affectedNames.has(name)) {
      items.push({
        key: `spec:${name}`,
        path: `${projectRoot}/openspec/specs/${name}/spec.md`,
        type: 'spec',
        priority: 'low',
      });
    }
  }

  return items;
}

/**
 * Load and estimate token cost of a single context item.
 * @param {string} key
 * @param {string} path
 * @param {string} type
 * @returns {{tokens: number, text: string|null, loaded: boolean}}
 */
function loadItem(key, path, type) {
  if (!existsSync(path)) return { tokens: 0, text: null, loaded: false };

  try {
    const raw = readFileSync(path, 'utf-8');
    return { tokens: estimateTokens(raw), text: raw, loaded: true };
  } catch {
    return { tokens: 0, text: null, loaded: false };
  }
}

/**
 * Build a context plan — determines what to load within budget.
 * Critical items always loaded. High-priority loaded next. Medium/low as budget allows.
 * @param {string} taskDescription
 * @param {'trivial'|'standard'|'large'} [tier='standard']
 * @returns {{budget: ContextBudget, items: ContextItem[], summary: string}}
 */
export function planContext(taskDescription, tier = 'standard') {
  const affectedSpecs = resolveAffectedSpecs(taskDescription, parseAllSpecs());
  const budget = createBudget(tier);
  const allItems = getContextItems(taskDescription, affectedSpecs);
  const loaded = [];

  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  allItems.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  let tokensUsed = 0;

  for (const item of allItems) {
    // Always load critical items
    if (item.priority === 'critical') {
      const { tokens } = loadItem(item.key, item.path, item.type);
      loaded.push({ ...item, tokens, loaded: true });
      tokensUsed += tokens;
      continue;
    }

    // Check budget for others
    const estimated = estimateTokens(item.path); // rough estimate from path size
    if (tokensUsed + estimated > budget.budget) {
      loaded.push({ ...item, tokens: 0, loaded: false });
      continue;
    }

    const { tokens } = loadItem(item.key, item.path, item.type);
    loaded.push({ ...item, tokens, loaded: true });
    tokensUsed += tokens;
  }

  budget.used = tokensUsed;
  budget.items = loaded;

  const summary = [
    `Context budget: ${budget.budget} tokens | Used: ${budget.used} tokens | Tier: ${tier}`,
    `Critical: ${loaded.filter((i) => i.priority === 'critical' && i.loaded).length} loaded`,
    `High: ${loaded.filter((i) => i.priority === 'high' && i.loaded).length} loaded`,
    `Medium: ${loaded.filter((i) => i.priority === 'medium' && i.loaded).length} loaded`,
    `Low: ${loaded.filter((i) => i.priority === 'low' && i.loaded).length} loaded`,
    `Skipped (budget): ${loaded.filter((i) => !i.loaded).length} items`,
  ].join(' | ');

  return { budget, items: loaded, summary };
}

/**
 * Get the strategic loading order for a task.
 * @param {string} taskDescription
 * @returns {Array<{key: string, path: string, type: string, priority: string}>}
 */
export function loadingOrder(taskDescription) {
  const affectedSpecs = resolveAffectedSpecs(taskDescription, parseAllSpecs());
  const items = getContextItems(taskDescription, affectedSpecs);
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return items.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

/**
 * Estimate the total context cost for a task.
 * @param {string} taskDescription
 * @returns {{totalTokens: number, breakdown: Record<string, number>}}
 */
export function estimateCost(taskDescription) {
  const items = loadingOrder(taskDescription);
  let total = 0;
  const breakdown = {};

  for (const item of items) {
    const { tokens } = loadItem(item.key, item.path, item.type);
    breakdown[item.key] = tokens;
    total += tokens;
  }

  return { totalTokens: total, breakdown };
}
