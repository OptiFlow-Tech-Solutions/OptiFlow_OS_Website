/**
 * Unified index of ALL resources — global ECC + project-local.
 * V4: Uses config-resolver for dynamic paths, includes capability models.
 * @module orchestrate/capability-registry
 */

import { cachedScan } from './global-repo-scanner.mjs';
import { scanProject, getBranch } from './project-scanner.mjs';
import { parseAllSpecs } from './spec-parser.mjs';
import { get as cacheGet, set as cacheSet } from './cache-manager.mjs';

const CACHE_KEY = 'capability-registry';
const CACHE_TTL = 300000; // 5min

let _registry = null;

/**
 * Build a unified registry of global + project capabilities.
 * Results are cached for 5 minutes.
 * @returns {Promise<{
 *   skills: Map<string, object>,
 *   agents: Map<string, object>,
 *   mcpServers: Map<string, object>,
 *   hooks: Map<string, object>,
 *   commands: Map<string, object>,
 *   specs: Map<string, object>,
 *   parsedSpecs: object[],
 *   pages: object[],
 *   branch: string,
 *   designSystem: boolean
 * }>}
 */
export async function buildRegistry() {
  const cached = cacheGet(CACHE_KEY);
  if (cached) return cached;

  const global = cachedScan();
  const project = scanProject();
  const branch = getBranch();
  const parsedSpecs = parseAllSpecs();

  const registry = {
    skills: new Map(global.skills.map((s) => [s.name, s])),
    agents: new Map(global.agents.map((a) => [a.name, a])),
    mcpServers: new Map(global.mcpServers.map((m) => [m.name, m])),
    hooks: new Map(global.hooks.map((h) => [h.id, h])),
    commands: new Map(global.commands.map((c) => [c.name, c])),
    specs: new Map(project.specs.map((s) => [s.name, s])),
    parsedSpecs,
    pages: project.pages,
    branch,
    designSystem: project.designSystem,
  };

  cacheSet(CACHE_KEY, registry, { ttl: CACHE_TTL });
  return registry;
}

/**
 * Synchronous get-or-init registry accessor.
 * Returns cached instance or null if not yet built.
 * @returns {object|null}
 */
export function getRegistry() {
  if (_registry) return _registry;
  _registry = cacheGet(CACHE_KEY);
  return _registry || null;
}

/**
 * Set the registry instance (used after async buildRegistry).
 * @param {object} registry
 */
export function setRegistry(registry) {
  _registry = registry;
  cacheSet(CACHE_KEY, registry, { ttl: CACHE_TTL });
}

/**
 * Look up a capability by name and type.
 * @param {'skill'|'agent'|'mcp'|'hook'|'command'|'spec'} type
 * @param {string} name
 * @returns {object|undefined}
 */
export function getCapability(type, name) {
  const reg = getRegistry();
  if (!reg) return undefined;
  const mapKey = { skill: 'skills', agent: 'agents', mcp: 'mcpServers', hook: 'hooks', command: 'commands', spec: 'specs' }[type];
  return reg[mapKey]?.get(name);
}

/**
 * List all capabilities of a given type.
 * @param {'skill'|'agent'|'mcp'|'hook'|'command'|'spec'} type
 * @returns {object[]}
 */
export function listCapabilities(type) {
  const reg = getRegistry();
  if (!reg) return [];
  const mapKey = { skill: 'skills', agent: 'agents', mcp: 'mcpServers', hook: 'hooks', command: 'commands', spec: 'specs' }[type];
  return [...(reg[mapKey]?.values() || [])];
}

/**
 * Find skills matching given domains, sorted by relevance.
 * @param {string[]} domains
 * @returns {object[]}
 */
export function findSkillsByDomain(domains) {
  const skills = listCapabilities('skill');
  const scored = skills.map((s) => {
    const domainOverlap = s.domains?.filter((d) => domains.includes(d)).length || 0;
    const keywordOverlap = s.keywords?.filter((k) => domains.some((d) => k.includes(d) || d.includes(k))).length || 0;
    return { skill: s, score: domainOverlap * 2 + keywordOverlap };
  });
  return scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).map((s) => s.skill);
}

/**
 * Find agents matching given roles, sorted by relevance.
 * @param {string[]} roles
 * @returns {object[]}
 */
export function findAgentsByRole(roles) {
  const agents = listCapabilities('agent');
  const scored = agents.map((a) => {
    const roleOverlap = a.capabilities?.roles?.filter((r) => roles.includes(r)).length || 0;
    return { agent: a, score: roleOverlap };
  });
  return scored.filter((a) => a.score > 0).sort((a, b) => b.score - a.score).map((a) => a.agent);
}
