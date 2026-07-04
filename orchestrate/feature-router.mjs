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
import { resolve } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';
import { get as cacheGet, set as cacheSet } from './cache-manager.mjs';
import { parseAllSpecs } from './spec-parser.mjs';
import { routeBySpecs } from './skill-router.mjs';
import { routeAgents } from './agent-router.mjs';
import { routeHooks } from './hook-router.mjs';
import { getBranch } from './project-scanner.mjs';
import { logEvent } from './audit-log.mjs';
import { resolveSpecsForFeature } from './keyword-maps.mjs';

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
  const order = ['SYS', 'PAGE', 'LEAD', 'LEGAL', 'API', 'QA', 'OPS', 'UI', 'SEC', 'PERF', 'TEST', 'DOCS', 'CONTENT'];
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
  return resolveSpecsForFeature(feature.name.toLowerCase());
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
    const skillRoute = routeBySpecs([{ specName: feature.name, domains: [...new Set(domains)] }]);
    skills = Array.isArray(skillRoute) ? skillRoute : (skillRoute?.skills || []);
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

// ── V6: Natural language → Feature ID resolution ──

/** Extended keyword map for /opsx-auto task→feature resolution */
const TASK_FEATURE_MAP = Object.freeze({
  'home page': ['PAGE-001'],
  'home': ['PAGE-001'],
  'homepage': ['PAGE-001'],
  'landing page': ['PAGE-001'],
  'hero section': ['PAGE-001'],
  'hero': ['PAGE-001'],
  'cta': ['PAGE-001'],

  'problem': ['PAGE-002'],
  'solutions': ['PAGE-002'],
  'problem and solutions': ['PAGE-002'],
  'problem & solutions': ['PAGE-002'],

  'product overview': ['PAGE-003'],
  'product': ['PAGE-003'],
  'product page': ['PAGE-003'],
  'platform overview': ['PAGE-003'],
  'inventory': ['PAGE-003'],
  'module': ['PAGE-003'],

  'feature showcase': ['PAGE-004'],
  'features': ['PAGE-004'],
  'feature list': ['PAGE-004'],

  'competitive positioning': ['PAGE-005'],
  'competitive': ['PAGE-005'],
  'comparison': ['PAGE-005'],
  'why choose': ['PAGE-005'],

  'pricing': ['PAGE-006'],
  'pricing page': ['PAGE-006'],
  'pricing & plans': ['PAGE-006'],
  'plans': ['PAGE-006'],
  'subscription': ['PAGE-006'],
  'pricing table': ['PAGE-006'],

  'newsletter subscription': ['PAGE-007'],
  'newsletter': ['PAGE-007'],
  'newsletter & content': ['PAGE-007'],
  'content': ['PAGE-007'],
  'blog': ['PAGE-007'],

  'faq': ['PAGE-008'],
  'faq & self-service': ['PAGE-008'],
  'faq page': ['PAGE-008'],
  'self-service': ['PAGE-008'],
  'help page': ['PAGE-008'],

  'demo booking': ['LEAD-001'],
  'demo': ['LEAD-001'],
  'booking': ['LEAD-001'],
  'schedule demo': ['LEAD-001'],
  'book demo': ['LEAD-001'],
  'appointment': ['LEAD-001'],
  'demo page': ['LEAD-001'],

  'contact': ['LEAD-002'],
  'contact & support': ['LEAD-002'],
  'support': ['LEAD-002'],
  'contact page': ['LEAD-002'],
  'contact form': ['LEAD-002'],

  'privacy policy': ['LEGAL-001'],
  'privacy': ['LEGAL-001'],
  'privacy page': ['LEGAL-001'],

  'terms': ['LEGAL-002'],
  'terms & conditions': ['LEGAL-002'],
  'terms and conditions': ['LEGAL-002'],
  'tos': ['LEGAL-002'],

  'form processing': ['API-001'],
  'form api': ['API-001'],
  'form submission': ['API-001'],
  'contact api': ['API-001'],

  'admin authentication': ['API-002'],
  'admin auth': ['API-002'],
  'admin login': ['API-002'],
  'authentication': ['API-002'],

  'admin dashboard': ['API-003'],
  'admin panel': ['API-003'],
  'admin page': ['API-003'],
  'admin': ['API-003'],

  'email notifications': ['API-004'],
  'email': ['API-004'],
  'notifications': ['API-004'],
  'email api': ['API-004'],
  'send email': ['API-004'],

  'database': ['API-005'],
  'data management': ['API-005'],
  'kv store': ['API-005'],
  'storage': ['API-005'],

  'monitoring': ['API-006'],
  'observability': ['API-006'],
  'health check': ['API-006'],
  'logging': ['API-006'],

  'accessibility': ['QA-001'],
  'a11y': ['QA-001'],
  'wcag': ['QA-001'],
  'accessibility compliance': ['QA-001'],

  'testing': ['QA-002'],
  'test suite': ['QA-002'],
  'e2e tests': ['QA-002'],
  'playwright': ['QA-002'],

  'code quality': ['QA-003'],
  'performance': ['QA-003'],
  'optimization': ['QA-003'],
  'code quality & performance': ['QA-003'],
  'speed': ['QA-003'],
  'responsive': ['QA-003'],
  'layout': ['QA-003'],

  'orchestration engine': ['OPS-001'],
  'orchestration': ['OPS-001'],
  'orchestrate': ['OPS-001'],

  'git hooks': ['OPS-002'],
  'hooks': ['OPS-002'],
  'automation': ['OPS-002'],
  'git hooks & automation': ['OPS-002'],

  'dark mode support': ['SYS-001'],
  'dark mode': ['SYS-001'],
  'design system': ['SYS-001'],
  'theming': ['SYS-001'],
  'design system & theming': ['SYS-001'],

  'navigation': ['SYS-002'],
  'site navigation': ['SYS-002'],
  'nav bar': ['SYS-002'],
  'site navigation & structure': ['SYS-002'],
  'structure': ['SYS-002'],

  'interactive': ['SYS-003'],
  'interactive runtime': ['SYS-003'],
  'javascript runtime': ['SYS-003'],

  'build pipeline': ['SYS-004'],
  'build & deployment': ['SYS-004'],
  'build & deployment pipeline': ['SYS-004'],
  'deployment': ['SYS-004'],
  'build': ['SYS-004'],

  'seo optimization': ['SYS-005'],
  'seo': ['SYS-005'],
  'seo & metadata': ['SYS-005'],
  'metadata': ['SYS-005'],
  'sitemap': ['SYS-005'],
  'meta tags': ['SYS-005'],

  // ── V5.0: UI, PERF, SEC, TEST, DOCS, CONTENT, OPS expansions ──
  'motion': ['UI-001'],
  'animation': ['UI-001'],
  'motion system': ['UI-001'],

  'page transition': ['UI-002'],
  'transition animation': ['UI-002'],

  'skeleton loading': ['UI-003'],
  'skeleton': ['UI-003'],
  'empty states': ['UI-003'],
  'loading state': ['UI-003'],

  'toast': ['UI-004'],
  'toast notification': ['UI-004'],
  'notification system': ['UI-004'],

  'cookie consent': ['UI-005'],
  'cookie': ['UI-005'],
  'privacy compliance': ['UI-005'],
  'gdpr': ['UI-005'],

  'image optimization': ['UI-006'],
  'webp': ['UI-006'],
  'image pipeline': ['UI-006'],

  'service worker': ['UI-007'],
  'pwa': ['UI-007'],
  'progressive web': ['UI-007'],

  'interactive demo': ['UI-008'],
  'product mockup': ['UI-008'],

  'site search': ['UI-009'],
  'search functionality': ['UI-009'],

  'error boundary': ['UI-010'],
  'error recovery': ['UI-010'],
  'recovery system': ['UI-010'],

  'hero motion': ['UI-011'],
  'hero enhancement': ['UI-011'],

  'scroll animation': ['UI-012'],
  'scroll trigger': ['UI-012'],

  'card interaction': ['UI-013'],
  'component polish': ['UI-013'],

  'content freshness': ['UI-014'],
  'last updated': ['UI-014'],

  'critical css': ['PERF-001'],
  'css extraction': ['PERF-001'],

  'asset caching': ['PERF-002'],
  'cdn': ['PERF-002'],
  'cache strategy': ['PERF-002'],

  'font self-hosting': ['PERF-003'],
  'font subsetting': ['PERF-003'],

  'lighthouse ci': ['PERF-004'],
  'lighthouse': ['PERF-004'],

  'csrf': ['SEC-001'],
  'csrf protection': ['SEC-001'],

  'input sanitization': ['SEC-002'],
  'xss': ['SEC-002'],
  'xss prevention': ['SEC-002'],

  'sri hash': ['SEC-003'],
  'subresource integrity': ['SEC-003'],

  'csp reporting': ['SEC-004'],
  'content security': ['SEC-004'],

  'unit test': ['TEST-001'],
  'unit testing': ['TEST-001'],

  'api integration test': ['TEST-002'],
  'api test': ['TEST-002'],

  'visual regression': ['TEST-003'],
  'visual test': ['TEST-003'],

  'accessibility audit': ['TEST-004'],
  'manual audit': ['TEST-004'],

  'performance profiling': ['TEST-005'],
  'profiling': ['TEST-005'],

  'api doc': ['DOCS-001'],
  'api documentation': ['DOCS-001'],

  'architecture decision': ['DOCS-002'],
  'adr': ['DOCS-002'],

  'changelog': ['DOCS-003'],
  'changelog automation': ['DOCS-003'],

  'deployment runbook': ['DOCS-004'],
  'runbook': ['DOCS-004'],

  'component catalog': ['DOCS-005'],
  'storybook': ['DOCS-005'],

  'content pipeline': ['CONTENT-001'],

  'case study': ['CONTENT-002'],
  'customer story': ['CONTENT-002'],

  'product roadmap': ['CONTENT-003'],
  'release notes': ['CONTENT-003'],

  'blog': ['CONTENT-004'],
  'blog engine': ['CONTENT-004'],

  'monitoring pipeline': ['OPS-003'],
  'alerting': ['OPS-003'],

  'backup': ['OPS-004'],
  'disaster recovery': ['OPS-004'],

  'coverage reporting': ['OPS-005'],
  'spec coverage': ['OPS-005'],

  'engine documentation': ['OPS-006'],
  'orchestration docs': ['OPS-006'],
});

/**
 * Reverse-map a natural language task description to a Feature ID.
 * Uses extended keyword matching with scoring heuristics.
 *
 * @param {string} taskDescription
 * @returns {{ featureId: string, featureName: string, confidence: number }}
 */
export function resolveFeatureFromTask(taskDescription) {
  const lower = taskDescription.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();

  let bestMatch = null;
  let bestScore = 0;

  for (const [key, ids] of Object.entries(TASK_FEATURE_MAP)) {
    const score = scoreKeywordMatch(lower, key);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = { key, ids };
    }
  }

  if (bestMatch && bestScore > 0) {
    const featureId = bestMatch.ids[0];
    const feature = getFeature(featureId);
    if (feature) {
      return {
        featureId: feature.id,
        featureName: feature.name,
        confidence: Math.min(1, bestScore),
      };
    }
  }

  // Fallback: scan all feature names
  const registry = loadFeatureRegistry();
  for (const f of registry.features) {
    const score = scoreKeywordMatch(lower, f.name.toLowerCase());
    if (score > bestScore) {
      bestScore = score;
      bestMatch = { ids: [f.id], key: f.name };
    }
  }

  if (bestMatch && bestScore > 0) {
    return {
      featureId: bestMatch.ids[0],
      featureName: bestMatch.key,
      confidence: Math.min(1, bestScore * 0.7),
    };
  }

  // Absolute fallback: home page
  return { featureId: 'PAGE-001', featureName: 'Home Page', confidence: 0.1 };
}

/**
 * Score how well a keyword matches the task description.
 * @param {string} taskLower
 * @param {string} keyword
 * @returns {number}
 */
function scoreKeywordMatch(taskLower, keyword) {
  if (taskLower === keyword) return 1.0;
  if (taskLower.includes(keyword)) return 0.8 + (keyword.split(' ').length * 0.05);
  if (keyword.includes(taskLower)) return 0.6 + (taskLower.split(' ').length * 0.05);

  const taskTokens = new Set(taskLower.split(' ').filter(Boolean));
  const kwTokens = keyword.split(' ').filter(Boolean);
  const matched = kwTokens.filter((t) => taskTokens.has(t));
  if (kwTokens.length === 0) return 0;

  return (matched.length / kwTokens.length) + (matched.length * 0.01);
}
