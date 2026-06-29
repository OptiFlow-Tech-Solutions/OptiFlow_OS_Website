/**
 * Simple plugin system that loads .mjs files from a directory.
 * @module orchestrate/plugin-loader
 */

import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Load all .mjs plugin files from a directory.
 * Each plugin's default export (or full module if no default) is appended.
 * @param {string} dir - Directory containing .mjs plugin files
 * @returns {Promise<Array<Record<string, Function>>>}
 */
export async function loadPlugins(dir) {
  const plugins = [];
  try {
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.mjs')) continue;
      const mod = await import(resolve(dir, file));
      plugins.push(mod.default || mod);
    }
  } catch {
    // directory doesn't exist — return empty
  }
  return plugins;
}

/**
 * Run a named hook on all loaded plugins.
 * @param {Array<Record<string, Function>>} plugins
 * @param {string} hookName
 * @param {...any} args
 * @returns {Promise<any[]>}
 */
export async function runHook(plugins, hookName, ...args) {
  const results = [];
  for (const plugin of plugins) {
    if (typeof plugin[hookName] === 'function') {
      results.push(await plugin[hookName](...args));
    }
  }
  return results;
}
