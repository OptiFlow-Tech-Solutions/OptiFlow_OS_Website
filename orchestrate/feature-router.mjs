/**
 * Feature Router — auto-resolves implementation context from a flat Feature ID.
 * Given only a Feature ID (e.g., "PAGE-001"), the engine scans the project and
 * reconstructs specs, source files, tests, dependencies, and routing automatically.
 *
 * No metadata is stored in features.json — only { id, name }.
 * Everything else is inferred from the project structure.
 *
 * @module orchestrate/feature-router
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';
import { get as cacheGet, set as cacheSet } from './cache-manager.mjs';
import { parseAllSpecs } from './spec-parser.mjs';
import { routeBySpecs } from './skill-router.mjs';
import { routeAgents } from './agent-router.mjs';
import { routeHooks } from './hook-router.mjs';
import { getBranch } from './project-scanner.mjs';
import { logEvent } from './audit-log.mjs';

const { projectRoot } = resolvePaths();
const ROOT = projectRoot;
const CACHE_TTL = 600000;

// ── Registry Loading ────────────────────────────

let _registry = null;

export function loadFeatureRegistry() {
  const cacheKey = 'feature-registry';
  const cached = cacheGet(cacheKey);
  if (cached) { _registry = cached; return cached; }

  const registryPath = resolve(ROOT, 'features', 'features.json');
  if (!existsSync(registryPath)) throw new Error(`Feature registry not found at ${registryPath}`);

  const registry = JSON.parse(readFileSync(registryPath, 'utf-8'));
  cacheSet(cacheKey, registry, { ttl: CACHE_TTL });
  _registry = registry;
  logEvent({ type: 'feature-registry', action: 'loaded', featureCount: registry.features.length });
  return registry;
}

// ── Feature Lookup ──────────────────────────────

export function getFeature(idOrName) {
  const registry = loadFeatureRegistry();
  const q = idOrName.trim();
  return registry.features.find((f) => f.id === q) || registry.features.find((f) => f.name === q);
}

export function listFeatures() {
  return loadFeatureRegistry().features.map((f) => ({ id: f.id, name: f.name }));
}

// ── Context Resolution ──────────────────────────

/**
 * Given a feature ID prefix (e.g., "SYS", "PAGE", "API"),
 * return speculative dependencies from the registry.
 */
function resolveBaseDependencies(prefix, registry) {
  const order = ['SYS', 'PAGE', 'LEAD', 'LEGAL', 'API', 'QA', 'OPS'];
  const idx = order.indexOf(prefix);
  if (idx === -1) return [];
  return registry.features.filter((f) => order.indexOf(extractPrefix(f.id)) < idx);
}

function extractPrefix(id) { return id.split('-')[0]; }

/**
 * Auto-discover source files relevant to a feature by scanning src/pages/.
 */
function discoverSourceFiles(feature) {
  const pagesDir = resolve(ROOT, 'src', 'pages');
  if (!existsSync(pagesDir)) return [];

  const nameLower = feature.name.toLowerCase();
  const nameTokens = nameLower.split(/[\s&]+/);

  const allFiles = readdirSync(pagesDir).filter((f) => f.endsWith('.html'));
  const matches = allFiles.filter((f) => {
    const base = f.replace('.html', '').toLowerCase().replace(/-/g, ' ');
    return nameTokens.every((t) => base.includes(t));
  });

  return matches.map((f) => `src/pages/${f}`);
}

/**
 * Auto-discover relevant spec files by matching feature name against spec names.
 */
function discoverSpecs(feature) {
  const specsDir = resolve(ROOT, 'openspec', 'specs');
  if (!existsSync(specsDir)) return [];

  const nameLower = feature.name.toLowerCase();
  const prefixes = ['PAGE', 'LEAD', 'LEGAL', 'API', 'QA', 'SYS', 'OPS'];
  const prefix = extractPrefix(feature.id);

  const allSpecs = readdirSync(specsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  // Keyword-based matching
  const keywordMap = {
    'design system': ['design-system'],
    'theming': ['design-system', 'dark-mode'],
    'navigation': ['shared-components'],
    'structure': ['shared-components'],
    'runtime': ['shared-components'],
    'interactive': ['shared-components'],
    'build': ['build-pipeline'],
    'deployment': ['build-pipeline'],
    'pipeline': ['build-pipeline'],
    'seo': ['seo'],
    'metadata': ['seo'],
    'home page': ['marketing-pages'],
    'home': ['marketing-pages'],
    'problem': ['marketing-pages'],
    'solutions': ['marketing-pages'],
    'product overview': ['marketing-pages'],
    'feature showcase': ['marketing-pages'],
    'features': ['marketing-pages'],
    'competitive': ['marketing-pages'],
    'positioning': ['marketing-pages'],
    'why optiflow': ['marketing-pages'],
    'pricing': ['marketing-pages'],
    'plans': ['marketing-pages'],
    'newsletter': ['marketing-pages'],
    'content': ['marketing-pages'],
    'faq': ['marketing-pages'],
    'self-service': ['marketing-pages'],
    'demo booking': ['marketing-pages'],
    'demo': ['marketing-pages'],
    'contact': ['marketing-pages'],
    'support': ['marketing-pages'],
    'privacy': ['marketing-pages'],
    'terms': ['marketing-pages'],
    'conditions': ['marketing-pages'],
    'form processing': ['platform-api'],
    'api': ['platform-api'],
    'admin auth': ['platform-auth'],
    'authentication': ['platform-auth'],
    'admin dashboard': ['platform-auth', 'platform-database'],
    'email': ['platform-email'],
    'notifications': ['platform-email'],
    'database': ['platform-database'],
    'data management': ['platform-database'],
    'monitoring': ['platform-monitoring'],
    'observability': ['platform-monitoring'],
    'health': ['platform-monitoring'],
    'accessibility': ['accessibility'],
    'testing': ['build-pipeline'],
    'code quality': ['build-pipeline'],
    'performance': ['build-pipeline', 'platform-monitoring'],
    'orchestration': ['orchestration-engine'],
    'engine': ['orchestration-engine'],
    'git hooks': ['build-pipeline'],
    'hooks': ['build-pipeline'],
    'automation': ['build-pipeline'],
  };

  return keywordMap[nameLower] || [];
}

/**
 * Reconstruct the complete implementation context for a feature.
 * Auto-resolves everything from the project — no manual metadata needed.
 *
 * @param {string} featureId - Feature ID (e.g., "PAGE-001")
 * @param {{skipCache?: boolean}} [opts]
 * @returns {Promise<object>}
 */
export async function reconstructContext(featureId, opts = {}) {
  const cacheKey = `feature-context:${featureId}`;
  if (!opts.skipCache) {
    const cached = cacheGet(cacheKey);
    if (cached) return cached;
  }

  const registry = loadFeatureRegistry();
  const feature = getFeature(featureId);
  if (!feature) throw new Error(`Feature not found: ${featureId}`);

  const branch = getBranch();
  const prefix = extractPrefix(feature.id);

  // Auto-discover
  const specFiles = discoverSpecs(feature);
  const sourceFiles = discoverSourceFiles(feature);
  const baseDeps = resolveBaseDependencies(prefix, registry);

  // Resolve specs
  let parsedSpecs = [];
  try {
    const allSpecs = parseAllSpecs();
    parsedSpecs = specFiles.map((sn) => {
      const spec = allSpecs.find((s) => s.name === sn);
      return spec ? { name: spec.name, requirementCount: spec.requirementCount, scenarioCount: spec.scenarioCount, domains: spec.domains } : { name: sn, error: 'not found' };
    });
  } catch { /* best-effort */ }

  // Resolve skills from spec domains
  let skills = [];
  try {
    const domains = parsedSpecs.flatMap((s) => s.domains || []);
    const skillRoute = routeBySpecs(feature.name, [...new Set(domains)]);
    skills = skillRoute?.skills || [];
  } catch { /* best-effort */ }

  // Resolve agents
  let agents = [];
  try {
    const agentRoute = routeAgents([prefix.toLowerCase()], 'standard', branch, feature.name);
    agents = [agentRoute.primaryAgent, ...agentRoute.supportAgents].filter(Boolean);
  } catch { /* best-effort */ }

  // Resolve hooks
  let hooks = [];
  try {
    const hookRoute = routeHooks('apply');
    hooks = [...(hookRoute.preHooks || []), ...(hookRoute.postHooks || [])];
  } catch { /* best-effort */ }

  const context = {
    version: '2.0.0',
    feature: { id: feature.id, name: feature.name },
    dependencies: {
      chain: baseDeps.map((d) => d.id),
      count: baseDeps.length,
    },
    specs: {
      files: specFiles.map((s) => `openspec/specs/${s}/spec.md`),
      parsed: parsedSpecs,
      count: specFiles.length,
    },
    files: {
      source: sourceFiles,
      count: sourceFiles.length,
    },
    routing: {
      skills,
      agents,
      hooks,
    },
    integration: {
      branch,
      pipelineConfig: 'apply.yaml',
      qualityGates: ['GATE_SPEC', 'GATE_BUILD', 'GATE_VALIDATE', 'GATE_TEST', 'GATE_A11Y'],
    },
  };

  cacheSet(cacheKey, context, { ttl: CACHE_TTL });
  logEvent({ type: 'feature-context', featureId, featureName: feature.name, depCount: baseDeps.length });
  return context;
}

// ── Summary ─────────────────────────────────────

export async function summarizeFeature(featureId) {
  const ctx = await reconstructContext(featureId);
  const f = ctx.feature;
  return [
    `=== Feature: ${f.id} | ${f.name} ===`,
    `Deps:       ${ctx.dependencies.chain.join(' → ') || 'none'}`,
    `Specs:      ${ctx.specs.files.join(', ') || 'auto-resolved'}`,
    `Sources:    ${ctx.files.source.map((s) => s.replace(/^.*\//, '')).join(', ') || 'auto-resolved'}`,
    `Skills:     ${ctx.routing.skills.join(', ') || '(auto)'}`,
    `Agents:     ${ctx.routing.agents.join(', ') || '(auto)'}`,
    `Hooks:      ${ctx.routing.hooks.join(', ') || '(auto)'}`,
    `Gates:      ${ctx.integration.qualityGates.join(' → ')}`,
    `Branch:     ${ctx.integration.branch}`,
  ].join('\n');
}

export function resolveFeatureTree(idOrName) {
  const registry = loadFeatureRegistry();
  const feature = getFeature(idOrName);
  if (!feature) throw new Error(`Feature not found: ${idOrName}`);

  const prefix = extractPrefix(feature.id);
  const deps = resolveBaseDependencies(prefix, registry);
  return {
    feature,
    allDependencies: deps,
    dependencyChain: [feature.id, ...deps.map((d) => d.id)],
  };
}

export function featuresByPrefix(prefix) {
  return loadFeatureRegistry().features.filter((f) => f.id.startsWith(prefix));
}

export function mapToSpec(feature) {
  return discoverSpecs(feature);
}
