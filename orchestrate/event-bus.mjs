/**
 * Central event bus for decoupled module communication.
 * Supports publish/subscribe, once listeners, wildcard patterns, and async dispatch.
 * @module orchestrate/event-bus
 */

/** @type {Map<string, Set<{fn: Function, once: boolean}>>} */
const listeners = new Map();

/** @type {Array<{event: string, data: any, ts: number}>} */
const history = [];
const MAX_HISTORY = 500;

/**
 * Subscribe to an event. Returns unsubscribe function.
 * @param {string} event
 * @param {Function} fn
 * @returns {() => void}
 */
export function on(event, fn) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  const entry = { fn, once: false };
  listeners.get(event).add(entry);
  return () => listeners.get(event)?.delete(entry);
}

/**
 * Subscribe to an event once. Auto-unsubscribes after first fire.
 * @param {string} event
 * @param {Function} fn
 * @returns {() => void}
 */
export function once(event, fn) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  const entry = { fn, once: true };
  listeners.get(event).add(entry);
  return () => listeners.get(event)?.delete(entry);
}

/**
 * Emit an event to all listeners. Supports wildcard listeners ('*').
 * @param {string} event
 * @param {*} [data]
 * @returns {Promise<void>}
 */
export async function emit(event, data) {
  history.push({ event, data, ts: Date.now() });
  if (history.length > MAX_HISTORY) history.shift();

  const promises = [];

  // Wildcard listeners
  const wildcards = listeners.get('*');
  if (wildcards) {
    for (const { fn, once } of [...wildcards]) {
      if (once) wildcards.delete({ fn, once });
      promises.push(dispatch(fn, event, data));
    }
  }

  // Exact listeners
  const exact = listeners.get(event);
  if (exact) {
    for (const { fn, once } of [...exact]) {
      if (once) exact.delete({ fn, once });
      promises.push(dispatch(fn, event, data));
    }
  }

  await Promise.allSettled(promises);
}

async function dispatch(fn, event, data) {
  try {
    const result = fn(data, event);
    if (result instanceof Promise) await result;
  } catch (e) {
    // ponytail: silent catch — listeners are fire-and-forget
    // Add error telemetry here if observability matters.
  }
}

/**
 * Remove all listeners for an event, or all events if none specified.
 * @param {string} [event]
 */
export function clear(event) {
  if (event) listeners.delete(event);
  else listeners.clear();
}

/**
 * Get recent event history.
 * @param {string} [event] - Filter by event name
 * @param {number} [limit=50]
 * @returns {Array<{event: string, data: any, ts: number}>}
 */
export function getHistory(event, limit = 50) {
  let filtered = history;
  if (event) filtered = filtered.filter((e) => e.event === event);
  return filtered.slice(-limit);
}

/**
 * Count current listeners.
 * @param {string} [event]
 * @returns {number}
 */
export function listenerCount(event) {
  if (event) return listeners.get(event)?.size || 0;
  let total = 0;
  for (const s of listeners.values()) total += s.size;
  return total;
}
