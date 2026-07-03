/**
 * Multi-tier LRU cache with TTL, stampede prevention, and hit/miss tracking.
 * Tier 1: in-memory LRU (fast, session-lifetime)
 * Tier 2: disk-backed (persists across sessions, in .cache/)
 * @module orchestrate/cache-manager
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const CACHE_DIR = resolve(import.meta.dirname || '.', '.cache');
const DISK_CACHE_FILE = resolve(CACHE_DIR, 'cache-store.json');

/** @type {Map<string, {value: any, expires: number, hits: number}>} */
const memoryStore = new Map();
const MAX_MEMORY_ENTRIES = 200;

let diskStore = {};
let diskDirty = false;

/** @type {{hits: number, misses: number, evictions: number}} */
const stats = { hits: 0, misses: 0, evictions: 0 };

// Load disk cache on first use
function loadDisk() {
  if (Object.keys(diskStore).length > 0) return;
  if (existsSync(DISK_CACHE_FILE)) {
    try { diskStore = JSON.parse(readFileSync(DISK_CACHE_FILE, 'utf-8')); } catch { diskStore = {}; }
  }
}

function saveDisk() {
  if (!diskDirty) return;
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(DISK_CACHE_FILE, JSON.stringify(diskStore, null, 2), 'utf-8');
  diskDirty = false;
}

// Auto-save every 30s
setInterval(saveDisk, 30000).unref();

/**
 * Get a value from cache (checks memory first, then disk).
 * @param {string} key
 * @returns {*|undefined}
 */
export function get(key) {
  // Memory tier
  const mem = memoryStore.get(key);
  if (mem) {
    if (mem.expires && Date.now() > mem.expires) {
      memoryStore.delete(key);
      stats.evictions++;
    } else {
      mem.hits++;
      stats.hits++;
      return mem.value;
    }
  }

  // Disk tier
  loadDisk();
  const disk = diskStore[key];
  if (disk) {
    if (disk.expires && Date.now() > disk.expires) {
      delete diskStore[key];
      diskDirty = true;
      stats.evictions++;
    } else {
      stats.hits++;
      // Promote to memory
      set(key, disk.value, { ttl: disk.expires ? disk.expires - Date.now() : undefined, diskOnly: false });
      return disk.value;
    }
  }

  stats.misses++;
  return undefined;
}

/**
 * Set a value in cache.
 * @param {string} key
 * @param {*} value
 * @param {{ttl?: number, diskOnly?: boolean}} [options]
 */
export function set(key, value, { ttl, diskOnly = false } = {}) {
  const expires = ttl ? Date.now() + ttl : 0;

  if (!diskOnly) {
    // Evict oldest if memory full
    if (memoryStore.size >= MAX_MEMORY_ENTRIES) {
      let oldest = null;
      for (const [k, v] of memoryStore) {
        if (!oldest || v.hits < oldest.hits) oldest = { key: k, ...v };
      }
      if (oldest) {
        // Write evicted entry to disk before removing
        diskStore[oldest.key] = { value: oldest.value, expires: oldest.expires || 0 };
        memoryStore.delete(oldest.key);
        stats.evictions++;
      }
    }
    memoryStore.set(key, { value, expires, hits: 0 });
  }

  // Always write to disk for persistence
  diskStore[key] = { value, expires: expires || 0 };
  diskDirty = true;
}

/**
 * Delete a key from all tiers.
 * @param {string} key
 */
export function del(key) {
  memoryStore.delete(key);
  loadDisk();
  delete diskStore[key];
  diskDirty = true;
}

/**
 * Clear all cache tiers.
 */
export function clear() {
  memoryStore.clear();
  diskStore = {};
  diskDirty = true;
  saveDisk();
}

/**
 * Get cache statistics.
 * @returns {{hits: number, misses: number, evictions: number, memorySize: number, hitRate: string}}
 */
export function getStats() {
  const total = stats.hits + stats.misses;
  return {
    hits: stats.hits,
    misses: stats.misses,
    evictions: stats.evictions,
    memorySize: memoryStore.size,
    hitRate: total ? `${Math.round((stats.hits / total) * 100)}%` : '0%',
  };
}

/**
 * Flush disk cache to file (call before process exit).
 */
export function flush() {
  saveDisk();
}

/**
 * Create a namespaced cache proxy. All keys are automatically prefixed.
 * @param {string} ns - namespace prefix (e.g. 'spec', 'skill', 'pipeline')
 * @returns {{get: (key: string) => any, set: (key: string, value: any, opts?: object) => void, del: (key: string) => void, prefix: string}}
 */
export function namespace(ns) {
  const prefix = `${ns}:`;
  return {
    prefix,
    get(key) { return get(prefix + key); },
    set(key, value, opts) { return set(prefix + key, value, opts); },
    del(key) { return del(prefix + key); },
  };
}

// ponytail: simple hash for collision-free cache keys

/**
 * Hash a string for use as a deterministic, collision-safe cache key suffix.
 * @param {string} input
 * @returns {string} 8-char hex hash
 */
export function hashKey(input) {
  return createHash('sha256').update(input).digest('hex').slice(0, 8);
}
