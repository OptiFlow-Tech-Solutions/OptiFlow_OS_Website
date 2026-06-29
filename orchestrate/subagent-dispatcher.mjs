/**
 * V4 sub-agent dispatcher. Classifies tasks, resolves dependencies, and dispatches
 * to sub-agents via the event bus. Integrates with task-runner for unified execution.
 * @module orchestrate/subagent-dispatcher
 */

import { analyzeTask } from './capability-analyzer.mjs';
import { emit } from './event-bus.mjs';

/** Domain groups for dependency detection */
const DOMAIN_GROUPS = {
  style: ['css', 'style', 'layout', 'visual', 'spacing', 'color', 'dark mode', 'theme', 'design'],
  content: ['copy', 'text', 'content', 'writing', 'newsletter', 'blog'],
  build: ['build', 'compile', 'assemble', 'bundle', 'dist'],
  test: ['test', 'qa', 'e2e', 'browser', 'playwright', 'spec'],
  seo: ['seo', 'meta', 'sitemap', 'og', 'description', 'title'],
  page: ['page', 'component', 'template', 'html', 'nav', 'footer'],
  config: ['config', 'settings', 'json', 'toml', 'yaml'],
  deploy: ['deploy', 'publish', 'ship', 'cloudflare', 'netlify'],
};

/**
 * Classify a task into a sub-agent type.
 * @param {string} description
 * @returns {string}
 */
function classifyTask(description) {
  const lower = description.toLowerCase();
  if (/explor|investigat|research|understand|audit|scan|analyze/.test(lower)) return 'explore';
  if (/complex|architect|design/.test(lower) && description.length > 60) return 'general';
  return 'general';
}

/**
 * Check whether two tasks are independent (can run in parallel).
 * @param {{description: string}} a
 * @param {{description: string}} b
 * @returns {boolean}
 */
function areIndependent(a, b) {
  const da = getDomainGroup(a.description);
  const db = getDomainGroup(b.description);
  if (!da || !db) return true;
  return da !== db;
}

function getDomainGroup(text) {
  const lower = text.toLowerCase();
  for (const [name, keywords] of Object.entries(DOMAIN_GROUPS)) {
    if (keywords.some((kw) => lower.includes(kw))) return name;
  }
  return null;
}

/**
 * Dispatch tasks into parallel batches for sub-agent execution.
 * Each batch runs in parallel; batches run sequentially.
 * @param {Array<{description: string, prompt?: string, id?: string}>} tasks
 * @param {number} [maxConcurrent=4]
 * @returns {{batches: Array<Array<{id: string, description: string, prompt: string, subagentType: string}>>}}
 */
export function dispatchSubAgents(tasks, maxConcurrent = 4) {
  if (!tasks.length) return { batches: [] };

  const remaining = tasks.map((t, i) => ({
    id: t.id || `task-${i}`,
    description: t.description,
    prompt: t.prompt || t.description,
    subagentType: classifyTask(t.description),
  }));

  const batches = [];
  let currentBatch = [];
  const taken = new Set();

  for (let i = 0; i < remaining.length; i++) {
    if (taken.has(i)) continue;

    if (currentBatch.length >= maxConcurrent) {
      batches.push([...currentBatch]);
      currentBatch = [];
    }

    const conflicts = currentBatch.some((bt) => {
      const idx = remaining.indexOf(bt);
      return idx >= 0 && !areIndependent(tasks[i], tasks[idx]);
    });

    if (conflicts && currentBatch.length > 0) {
      batches.push([...currentBatch]);
      currentBatch = [];
    }

    currentBatch.push(remaining[i]);
    taken.add(i);
  }

  if (currentBatch.length > 0) batches.push([...currentBatch]);

  return { batches };
}

/**
 * V4: Actually dispatch a batch of sub-agents via the event bus.
 * The agent harness picks up these events and executes the sub-agents.
 * @param {Array<{id: string, description: string, prompt: string, subagentType: string}>} batch
 * @param {Record<string, any>} [context={}]
 * @returns {Promise<Array<{id: string, status: string}>>}
 */
export async function executeBatch(batch, context = {}) {
  const results = await Promise.all(
    batch.map(async (task) => {
      try {
        await emit('subagent:dispatch', {
          id: task.id,
          type: task.subagentType,
          description: task.description,
          prompt: task.prompt,
          context,
        });
        return { id: task.id, status: 'dispatched' };
      } catch (e) {
        return { id: task.id, status: 'failed', error: e.message };
      }
    }),
  );
  return results;
}

/**
 * Execute all batches sequentially, each batch in parallel.
 * @param {ReturnType<typeof dispatchSubAgents>} plan
 * @param {Record<string, any>} [context={}]
 * @returns {Promise<{batchResults: Array<Array<{id: string, status: string}>>>}>}
 */
export async function executeAllBatches(plan, context = {}) {
  const batchResults = [];
  for (const batch of plan.batches) {
    const results = await executeBatch(batch, context);
    batchResults.push(results);
  }
  return { batchResults };
}

/**
 * Auto-dispatch tasks from a task description.
 * @param {string} taskDescription
 * @returns {ReturnType<typeof dispatchSubAgents>}
 */
export function autoDispatch(taskDescription) {
  const analysis = analyzeTask(taskDescription);

  const tasks = [];
  for (const intent of analysis.intents) {
    tasks.push({
      id: intent,
      description: `${intent}: ${taskDescription}`,
    });
  }

  if (!tasks.length) {
    tasks.push({ id: 'default', description: taskDescription });
  }

  return dispatchSubAgents(tasks);
}
