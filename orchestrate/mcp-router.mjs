/**
 * V4: Context-aware MCP server routing.
 * Routes based on task phase, affected domains, and capability requirements.
 * @module orchestrate/mcp-router
 */

import { analyzeTask } from './capability-analyzer.mjs';
import { get as cacheGet, set as cacheSet } from './cache-manager.mjs';

const ALL_SERVERS = Object.freeze([
  'context7', 'parallel-search', 'chrome-devtools', 'playwright',
  'magic', 'sequential-thinking', 'memory',
  'token-optimizer', 'cloudflare-docs', 'laraplugins',
  'vercel', 'railway', 'cloudflare-workers-builds',
  'cloudflare-workers-bindings', 'cloudflare-observability',
]);

/** Phase-specific MCP requirements */
const PHASE_SERVERS = Object.freeze({
  explore: ['context7', 'parallel-search', 'sequential-thinking'],
  propose: ['context7', 'parallel-search', 'sequential-thinking'],
  apply: ['context7', 'playwright'],
  verify: ['chrome-devtools', 'playwright', 'parallel-search'],
  archive: ['context7'],
  auto: ['context7', 'parallel-search'],
});

/** Domain → recommended MCP servers */
const DOMAIN_SERVERS = Object.freeze({
  design: ['magic', 'chrome-devtools'],
  frontend: ['chrome-devtools', 'playwright'],
  build: ['context7', 'cloudflare-docs'],
  accessibility: ['chrome-devtools', 'playwright'],
  seo: ['parallel-search'],
  content: ['parallel-search'],
  quality: ['playwright'],
  performance: ['chrome-devtools'],
  deploy: ['cloudflare-workers-builds', 'vercel', 'railway'],
  security: ['cloudflare-docs'],
  testing: ['playwright', 'chrome-devtools'],
  data: ['context7'],
});

/**
 * Route MCP servers based on task description, domains, and phase.
 * @param {string} taskDescription
 * @param {string[]} [domains=[]]
 * @param {string} [phase='auto']
 * @returns {{mcpServers: string[], disabledServers: string[]}}
 */
export function routeMCP(taskDescription, domains = [], phase = 'auto') {
  const cacheKey = `mcp-route:${phase}:${taskDescription.slice(0, 60)}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const enabled = new Set();
  const lower = taskDescription.toLowerCase();

  // Always enable context7 and parallel-search as base
  enabled.add('context7');
  enabled.add('parallel-search');

  // Phase-based routing
  const phaseServers = PHASE_SERVERS[phase] || [];
  phaseServers.forEach((s) => enabled.add(s));

  // Domain-based routing
  for (const domain of domains) {
    const servers = DOMAIN_SERVERS[domain];
    if (servers) servers.forEach((s) => enabled.add(s));
  }

  // Keyword-based routing
  if (/test|qa|browser|playwright|e2e|ui|visual/.test(lower)) {
    enabled.add('playwright');
    enabled.add('chrome-devtools');
  }
  if (/build|deploy|publish|ship|workers|cloudflare/.test(lower)) {
    enabled.add('cloudflare-docs');
  }
  if (/component|ui|magic|design system/.test(lower)) {
    enabled.add('magic');
  }
  if (/complex|analyze|decide|tradeoff|architecture/.test(lower)) {
    enabled.add('sequential-thinking');
  }

  // Capability-based routing
  try {
    const analysis = analyzeTask(taskDescription);
    if (analysis.domains.includes('testing')) {
      enabled.add('playwright');
      enabled.add('chrome-devtools');
    }
    if (analysis.domains.includes('deploy')) {
      enabled.add('cloudflare-workers-builds');
      enabled.add('cloudflare-observability');
    }
  } catch { /* analyzer unavailable */ }

  const result = {
    mcpServers: [...enabled],
    disabledServers: ALL_SERVERS.filter((s) => !enabled.has(s)),
  };

  cacheSet(cacheKey, result, { ttl: 300000 });
  return result;
}
