/**
 * Parses a tasks.md checklist string and groups independent items into parallel execution batches.
 * Items at the same indentation level are considered independent (unless explicitly marked with dependencies).
 * @module orchestrate/execution-planner
 */

/**
 * @typedef {{id: string, description: string}} TaskItem
 */

/**
 * Parse a line looking for a checklist marker.
 * @param {string} line - A line from tasks.md
 * @returns {{id: string, description: string, level: number}|null}
 */
function parseChecklistLine(line) {
  const trimmed = line.trim();
  const match = trimmed.match(/^-\s*\[([ x])\]\s+(.+)/i);
  if (!match) return null;

  const done = match[1] !== ' ';
  const text = match[2].trim();
  const leading = line.match(/^(\s*)/);
  const level = leading ? Math.floor(leading[1].length / 2) : 0;

  const id = text.slice(0, 40).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
  return { id, description: text, level, done };
}

/**
 * Parse a tasks.md content string and produce parallel execution batches.
 * Items at the same level are batched together. Items at deeper levels depend on the parent.
 * @param {string} tasksContent - Raw content of tasks.md
 * @returns {{batches: TaskItem[][], totalTasks: number}}
 */
export function planExecution(tasksContent) {
  const lines = tasksContent.split('\n');
  /** @type {{items: TaskItem[], level: number}[]} */
  const sections = [];
  /** @type {TaskItem[]} */
  let currentGroup = [];
  let pendingCount = 0;

  for (const line of lines) {
    const parsed = parseChecklistLine(line);
    if (!parsed) continue;

    pendingCount++;

    if (parsed.level === 0 && currentGroup.length > 0) {
      sections.push({ items: [...currentGroup], level: currentGroup[0]?.levelText ?? 0 });
      currentGroup = [];
    }

    currentGroup.push({
      id: parsed.id,
      description: parsed.description,
      /** @type {number} */
      levelText: parsed.level,
    });
  }

  if (currentGroup.length > 0) {
    sections.push({ items: [...currentGroup], level: currentGroup[0]?.levelText ?? 0 });
  }

  /** @type {TaskItem[][]} */
  const batches = [];
  for (const section of sections) {
    const subBatches = [];
    let chunk = [];
    for (const item of section.items) {
      chunk.push({ id: item.id, description: item.description });
      if (chunk.length >= 5) {
        subBatches.push([...chunk]);
        chunk = [];
      }
    }
    if (chunk.length > 0) subBatches.push([...chunk]);
    batches.push(...subBatches);
  }

  return { batches, totalTasks: pendingCount };
}

/**
 * Parse and return only pending (not-yet-done) items grouped into batches.
 * @param {string} tasksContent - Raw content of tasks.md
 * @returns {{batches: TaskItem[][], totalTasks: number}}
 */
export function planPendingTasks(tasksContent) {
  const lines = tasksContent.split('\n');
  /** @type {TaskItem[]} */
  const pending = [];

  for (const line of lines) {
    const parsed = parseChecklistLine(line);
    if (!parsed || parsed.done) continue;
    pending.push({ id: parsed.id, description: parsed.description });
  }

  /** @type {TaskItem[][]} */
  const batches = [];
  for (let i = 0; i < pending.length; i += 5) {
    batches.push(pending.slice(i, i + 5));
  }

  return { batches, totalTasks: pending.length };
}
