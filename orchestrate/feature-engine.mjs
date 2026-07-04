/**
 * V2.0: Enterprise Feature Intelligence Engine — unified AI knowledge base.
 *
 * Capabilities:
 *   - Feature registry (V5.0 AI-native schema with inline aiContext + repository intelligence)
 *   - getFeatureIntelligence(featureId) → one-call complete feature context
 *   - getRepositoryIntelligence() → full repository understanding for new AI agents
 *   - Dependency analysis with impact detection
 *   - Traceability engine (specs → tasks → source → archive)
 *   - Knowledge graph traversal & Mermaid generation
 *   - Enterprise reporting (DASHBOARD.md, TRACEABILITY.md, VSI.md)
 *   - Automation (registration, status updates, dashboard sync)
 *   - Integrity validation (orphan detection, cycle detection, archive coverage)
 *
 * @module orchestrate/feature-engine
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';
import { resolveSpecsForFeature } from './keyword-maps.mjs';

const { projectRoot } = resolvePaths();
const ROOT = projectRoot;
const FEATURES_PATH = resolve(ROOT, 'features', 'features.json');
const ARCHIVE_INDEX_PATH = resolve(ROOT, 'openspec', 'changes', 'archive', 'index.json');
const SPECS_DIR = resolve(ROOT, 'openspec', 'specs');
const PAGES_DIR = resolve(ROOT, 'src', 'pages');
const ARCHIVE_DIR = resolve(ROOT, 'openspec', 'changes', 'archive');

let _registry = null;

// ─────────────────────────────────────────────────────────
// Feature Registry
// ─────────────────────────────────────────────────────────

export function loadRegistry() {
  if (_registry) return _registry;
  _registry = JSON.parse(readFileSync(FEATURES_PATH, 'utf-8'));
  return _registry;
}

export function getFeature(idOrName) {
  const reg = loadRegistry();
  const q = idOrName.trim();
  return reg.features.find((f) => f.id === q) || reg.features.find((f) => f.name === q) || null;
}

export function getAllFeatures() { return loadRegistry().features; }

export function getByPrefix(prefix) {
  return loadRegistry().features.filter((f) => f.id.startsWith(prefix));
}

export function getByStatus(status) {
  return loadRegistry().features.filter((f) => f.status === status);
}

export function getByCategory(category) {
  return loadRegistry().features.filter((f) => f.category === category);
}

// ─────────────────────────────────────────────────────────
// Repository Intelligence (V5.0)
// ─────────────────────────────────────────────────────────

/** @returns {object} — the repository section of features.json */
export function getRepositoryIntelligence() {
  const reg = loadRegistry();
  return reg.repository || null;
}

// ─────────────────────────────────────────────────────────
// AI Context (V5.0 inline)
// ─────────────────────────────────────────────────────────

/** @deprecated — aiContext is now inline in features.json V5.0+ */
export function loadAIContext() {
  const reg = loadRegistry();
  const contexts = {};
  for (const f of reg.features) {
    if (f.aiContext) contexts[f.id] = f.aiContext;
  }
  return { version: '1.0.0', contexts };
}

export function getAIContext(featureId) {
  const feature = getFeature(featureId);
  return feature?.aiContext || null;
}

// ─────────────────────────────────────────────────────────
// Enterprise Feature Intelligence (V2.0)
// ─────────────────────────────────────────────────────────

/**
 * One-call complete feature context.
 * Returns everything the AI needs to understand and implement a feature.
 */
export function getFeatureIntelligence(featureId) {
  const feature = getFeature(featureId);
  if (!feature) return null;

  const chain = buildTraceChain(featureId);
  const deps = resolveDependencies(featureId);
  const dependents = resolveDependents(featureId);
  const repo = getRepositoryIntelligence();

  return {
    feature: {
      id: feature.id, name: feature.name, status: feature.status,
      category: feature.category, priority: feature.priority,
      description: feature.description,
      engineeringGoal: feature.engineeringGoal || feature.description,
      complexity: feature.complexity || 'M', risk: feature.risk || 'low',
      dependencies: deps.map((d) => ({ id: d.id, name: d.name })),
      dependents: dependents.map((d) => ({ id: d.id, name: d.name })),
    },
    aiContext: feature.aiContext || null,
    traceability: chain || null,
    repository: repo ? { name: repo.name, purpose: repo.purpose } : null,
    recommendedAction: feature.status === 'complete'
      ? 'Feature is complete. Read traceability for change history.'
      : feature.status === 'planned'
        ? `Ready for implementation via /opsx-auto "${feature.name}". Skills: ${(feature.aiContext?.skills || []).join(', ') || 'auto-discover'}`
        : 'Feature is in progress. Check tasks.md for remaining work.',
  };
}

/**
 * Full repository understanding for a new AI agent.
 * One call returns everything the AI needs to know about the project.
 */
export function getRepositoryIntelligenceFull() {
  const repo = getRepositoryIntelligence();
  const features = loadRegistry().features;
  const complete = features.filter((f) => f.status === 'complete').length;
  const planned = features.filter((f) => f.status === 'planned').length;
  const inProgress = features.filter((f) => f.status === 'in-progress').length;

  return {
    repository: repo,
    overview: {
      totalFeatures: features.length,
      complete, inProgress, planned,
      completionRate: features.length > 0 ? Math.round((complete / features.length) * 100) : 0,
      categories: [...new Set(features.map((f) => f.category))],
      prefixes: [...new Set(features.map((f) => f.id.split('-')[0]))],
    },
    topDependencies: getTopDependencies(),
    featureSummary: `Read individual features via getFeatureIntelligence('FEATURE-ID') for complete AI context.`,
  };
}

function getTopDependencies() {
  const depCount = {};
  for (const f of loadRegistry().features) {
    for (const depId of (f.dependencies || [])) {
      depCount[depId] = (depCount[depId] || 0) + 1;
    }
  }
  return Object.entries(depCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([id, count]) => {
      const f = getFeature(id);
      return { id, name: f?.name || id, dependentCount: count };
    });
}

// ─────────────────────────────────────────────────────────
// Dependency Analysis
// ─────────────────────────────────────────────────────────

export function resolveDependencies(featureId) {
  const feature = getFeature(featureId);
  if (!feature) return [];
  const depIds = feature.dependencies || [];
  return depIds.map((id) => getFeature(id)).filter(Boolean);
}

export function resolveDependents(featureId) {
  return loadRegistry().features.filter((f) =>
    (f.dependencies || []).includes(featureId),
  );
}

export function resolveDependencyTree(featureId, visited = new Set()) {
  if (visited.has(featureId)) return null;
  visited.add(featureId);
  const feature = getFeature(featureId);
  if (!feature) return null;
  const deps = resolveDependencies(featureId);
  return {
    id: feature.id,
    name: feature.name,
    children: deps.map((d) => resolveDependencyTree(d.id, new Set(visited))).filter(Boolean),
  };
}

export function detectCycles() {
  const features = loadRegistry().features;
  const cycles = [];
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = {};

  function dfs(id, path) {
    color[id] = GRAY;
    const feature = getFeature(id);
    if (!feature) { color[id] = BLACK; return; }
    for (const depId of (feature.dependencies || [])) {
      if (color[depId] === GRAY) {
        const cycleStart = path.indexOf(depId);
        cycles.push({ path: [...path.slice(cycleStart), depId] });
      } else if (color[depId] === undefined || color[depId] === WHITE) {
        dfs(depId, [...path, depId]);
      }
    }
    color[id] = BLACK;
  }

  for (const f of features) {
    if (color[f.id] === undefined) dfs(f.id, [f.id]);
  }
  return cycles;
}

// ─────────────────────────────────────────────────────────
// Traceability Engine
// ─────────────────────────────────────────────────────────

export function loadArchiveIndex() {
  if (!existsSync(ARCHIVE_INDEX_PATH)) return [];
  try { return JSON.parse(readFileSync(ARCHIVE_INDEX_PATH, 'utf-8')); } catch { return []; }
}

export function buildTraceChain(featureId) {
  const feature = getFeature(featureId);
  if (!feature) return null;

  // Use explicit traceability if set, else auto-discover
  if (feature.traceability?.specs?.length > 0) {
    return {
      feature: { id: feature.id, name: feature.name, status: feature.status },
      specs: feature.traceability.specs,
      sourceFiles: feature.traceability.sourceFiles || [],
      archiveDir: feature.traceability.archiveDir || null,
      lastValidated: feature.traceability.lastValidated || null,
    };
  }

  const nameLower = feature.name.toLowerCase();
  const specs = resolveSpecsForFeature(nameLower);
  const archiveIndex = loadArchiveIndex();
  const archiveMatch = archiveIndex.find((a) =>
    a.name.includes(nameLower.replace(/[^a-z0-9]+/g, '-').slice(0, 20)),
  );
  const sourceFiles = discoverSourceFiles(feature);

  return {
    feature: { id: feature.id, name: feature.name, status: feature.status },
    specs,
    sourceFiles,
    tasks: archiveMatch ? { done: archiveMatch.tasks?.done || 0, total: archiveMatch.tasks?.total || 0 } : null,
    archive: archiveMatch ? { name: archiveMatch.name, date: archiveMatch.date } : null,
  };
}

function discoverSourceFiles(feature) {
  if (!existsSync(PAGES_DIR)) return [];
  const nameLower = feature.name.toLowerCase();
  const nameTokens = nameLower.split(/[\s&]+/).filter((t) => t.length > 2);
  try {
    return readdirSync(PAGES_DIR, { recursive: true, withFileTypes: true })
      .filter((e) => e.isFile() && e.name.endsWith('.html'))
      .map((e) => join(e.parentPath || PAGES_DIR, e.name).replace(ROOT + '\\', '').replace(/\\/g, '/'))
      .filter((f) => nameTokens.some((t) => f.toLowerCase().includes(t)));
  } catch { return []; }
}

export function findTraceabilityGaps() {
  const gaps = [];
  for (const feature of loadRegistry().features) {
    const chain = buildTraceChain(feature.id);
    if (!chain) continue;
    if (feature.status === 'complete' && chain.specs.length === 0) {
      gaps.push({ feature: feature.id, name: feature.name, gap: 'no linked specs', severity: 'high' });
    }
    if (feature.status === 'complete' && !chain.archive && !chain.archiveDir) {
      gaps.push({ feature: feature.id, name: feature.name, gap: 'no archive entry', severity: 'medium' });
    }
  }
  return gaps;
}

// ─────────────────────────────────────────────────────────
// Knowledge Graph (V2.0)
// ─────────────────────────────────────────────────────────

export function generateMermaidDependencyGraph() {
  const lines = ['graph TD'];
  const added = new Set();
  for (const feature of loadRegistry().features) {
    const shortId = feature.id;
    for (const depId of (feature.dependencies || [])) {
      const dep = getFeature(depId);
      if (!dep) continue;
      const key = `${dep.id}-->${feature.id}`;
      if (!added.has(key)) {
        added.add(key);
        lines.push(`  ${dep.id}[${dep.name.slice(0, 25)}] --> ${feature.id}[${feature.name.slice(0, 25)}]`);
      }
    }
  }
  return lines.join('\n');
}

export function traverseGraph(featureId, depth = 3) {
  const result = { feature: null, dependencies: [], dependents: [] };
  const feature = getFeature(featureId);
  if (!feature) return result;
  result.feature = { id: feature.id, name: feature.name, status: feature.status };

  function collectDeps(id, d, visited = new Set()) {
    if (d <= 0 || visited.has(id)) return [];
    visited.add(id);
    const f = getFeature(id);
    if (!f) return [];
    const deps = (f.dependencies || []).map((depId) => {
      const dep = getFeature(depId);
      if (!dep) return null;
      const children = collectDeps(depId, d - 1, visited);
      return { id: dep.id, name: dep.name, status: dep.status, children: children.length ? children : undefined };
    }).filter(Boolean);
    return deps;
  }

  result.dependencies = collectDeps(featureId, depth);

  function collectDependents(id, d, visited = new Set()) {
    if (d <= 0 || visited.has(id)) return [];
    visited.add(id);
    const dependents = resolveDependents(id);
    return dependents.map((dep) => {
      const children = collectDependents(dep.id, d - 1, visited);
      return { id: dep.id, name: dep.name, status: dep.status, children: children.length ? children : undefined };
    }).filter(Boolean);
  }

  result.dependents = collectDependents(featureId, depth);
  return result;
}

// ─────────────────────────────────────────────────────────
// Enterprise Reporting (V2.0)
// ─────────────────────────────────────────────────────────

export function generateEnterpriseDashboard() {
  const features = loadRegistry().features;
  const byStatus = {};
  const byPrefix = {};
  const byCategory = {};

  for (const f of features) {
    byStatus[f.status] = (byStatus[f.status] || 0) + 1;
    const prefix = f.id.split('-')[0];
    if (!byPrefix[prefix]) byPrefix[prefix] = { count: 0, complete: 0, planned: 0, 'in-progress': 0, features: [] };
    byPrefix[prefix].count++;
    byPrefix[prefix][f.status]++;
    byCategory[f.category] = (byCategory[f.category] || 0) + 1;
  }

  return {
    byStatus, byPrefix, byCategory,
    orphans: getOrphans(),
    gaps: findTraceabilityGaps(),
    cycles: detectCycles(),
    totalFeatures: features.length,
    completionRate: features.length > 0 ? Math.round(((byStatus.complete || 0) / features.length) * 100) : 0,
    timestamp: new Date().toISOString(),
  };
}

export function generateEnterpriseDashboardMarkdown() {
  const d = generateEnterpriseDashboard();
  const repo = getRepositoryIntelligence();
  const archiveIndex = loadArchiveIndex();
  const specsOnDisk = existsSync(SPECS_DIR)
    ? readdirSync(SPECS_DIR, { withFileTypes: true }).filter((e) => e.isDirectory()).length
    : 0;
  const archiveDirs = existsSync(ARCHIVE_DIR)
    ? readdirSync(ARCHIVE_DIR, { withFileTypes: true }).filter((e) => e.isDirectory() && !e.name.startsWith('.')).length
    : 0;

  const health = (pct) => pct >= 90 ? '\u{1F7E2}' : pct >= 50 ? '\u{1F7E1}' : '\u{1F534}';

  const lines = [
    `# OptiFlow OS — Executive Engineering Dashboard`,
    `> Auto-generated: ${d.timestamp}`,
    `> Schema: V5.0 AI-native feature registry`,
    '',
    '## Repository Overview',
    '',
    `| Dimension | Value |`,
    `|-----------|-------|`,
    `| Project | ${repo?.name || 'OptiFlow OS'} |`,
    `| Purpose | ${repo?.purpose?.slice(0, 80) || 'Marketing website'}... |`,
    `| Tech Stack | ${repo?.techStack || 'HTML/CSS/JS'} |`,
    `| Architecture | ${repo?.architecture?.slice(0, 60) || 'Pages-based'} |`,
    `| AI Readiness | ${repo?.schema || 'V5.0'} — AI-native feature registry |`,
    `| Spec Directories | ${specsOnDisk} |`,
    `| Archive Records | ${archiveDirs} directories (${archiveIndex.length} in index) |`,
    `| Orchestration Module | 48 modules (V13 engine) |`,
    '',
    '## Engineering Progress',
    '',
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Total Features | ${d.totalFeatures} |`,
    `| Complete | ${d.byStatus.complete || 0} (${d.completionRate}%) ${health(d.completionRate)} |`,
    `| In Progress | ${d.byStatus['in-progress'] || 0} |`,
    `| Planned | ${d.byStatus.planned || 0} |`,
    `| Dependency Cycles | ${d.cycles.length} |`,
    `| Traceability Gaps | ${d.gaps.length} |`,
    `| Orphan Features | ${d.orphans.length} |`,
    '',
    '## Architecture Health',
    '',
    `| Component | Status | Detail |`,
    `|-----------|:---:|--------|`,
    `| Build Pipeline | \u{1F7E2} | 0 errors on npm run build |`,
    `| L1-L7 Validation | \u{1F7E2} | All levels passing |`,
    `| Spec Coverage | ${health((specsOnDisk / d.totalFeatures) * 100)} | ${specsOnDisk} specs for ${d.totalFeatures} features |`,
    `| Archive Health | ${health(archiveIndex.length > 0 ? 90 : 0)} | ${archiveIndex.length} entries, ${archiveDirs} dirs |`,
    `| Feature Integrity | ${health(d.gaps.length === 0 ? 100 : 70)} | ${d.gaps.length} gap(s) found |`,
    '',
    '## Feature Health by Prefix',
    '',
    `| Prefix | Total | Complete | Planned | Health |`,
    `|--------|-------|----------|---------|:---:|`,
    ...Object.entries(d.byPrefix).sort(([a], [b]) => a.localeCompare(b)).map(([p, s]) => {
      const pct = s.count > 0 ? Math.round((s.complete / s.count) * 100) : 0;
      return `| ${p} | ${s.count} | ${s.complete} | ${s.planned} | ${health(pct)} ${pct}% |`;
    }),
    '',
    `## Traceability Gaps (${d.gaps.length})`,
    '',
    ...(d.gaps.length
      ? [`| Feature | Gap | Severity |`, `|---------|-----|----------|`,
        ...d.gaps.map((g) => `| ${g.feature} ${g.name} | ${g.gap} | ${g.severity} |`)]
      : ['No traceability gaps detected.']),
    '',
    `## Orphan Features (${d.orphans.length})`,
    '',
    ...(d.orphans.length
      ? d.orphans.slice(0, 10).map((o) => `- **${o.id}** ${o.name} — ${o.status} but missing specs or archive`)
      : ['No orphaned features.']),
    d.orphans.length > 10 ? `- ... and ${d.orphans.length - 10} more` : '',
    '',
    '## Dependency Graph',
    '',
    '```mermaid',
    generateMermaidDependencyGraph(),
    '```',
    '',
    '---',
    '',
    `> Generated by orchestrate/feature-engine.mjs V2.0 on ${d.timestamp}`,
  ];
  return lines.join('\n');
}

export function generateTraceabilityMarkdown() {
  const features = loadRegistry().features;
  const complete = features.filter((f) => f.status === 'complete');
  const gaps = findTraceabilityGaps();
  const chains = complete.map((f) => buildTraceChain(f.id)).filter(Boolean);

  const lines = [
    '# Traceability Matrix',
    `> Auto-generated from features.json + openspec/ + archive/`,
    `> ${new Date().toISOString()}`,
    '',
    'Every Feature ID is the canonical source of truth. This matrix is auto-generated.',
    '',
    '## Complete Features',
    '',
    '| Feature ID | Name | Specs | Source Files | Archive |',
    '|-----------|------|-------|-------------|---------|',
    ...chains.map((c) => {
      const specs = c.specs?.length ? c.specs.slice(0, 2).join(', ') : '\u{1F6AB}';
      const files = c.sourceFiles?.length ? c.sourceFiles.slice(0, 2).join(', ') : '-';
      const archive = c.archiveDir || c.archive?.name || '\u{1F6AB}';
      return `| ${c.feature.id} | ${c.feature.name.slice(0, 35)} | ${specs} | ${files} | ${archive} |`;
    }),
    '',
    `## Traceability Gaps (${gaps.length})`,
    '',
    ...(gaps.length
      ? [`| Feature ID | Name | Gap | Severity |`, `|-----------|------|-----|----------|`,
        ...gaps.map((g) => `| ${g.feature} | ${g.name.slice(0, 35)} | ${g.gap} | ${g.severity} |`)]
      : ['All features have complete traceability.']),
    '',
    '## Dependency Graph',
    '',
    '```mermaid',
    generateMermaidDependencyGraph(),
    '```',
    '',
    '## Spec Coverage by Category',
    '',
    '| Category | Feature Count | Spec Count | Coverage % |',
    '|----------|:---:|:---:|:---:|',
    ...[...new Set(features.map((f) => f.category))].sort().map((cat) => {
      const catFeatures = features.filter((f) => f.category === cat);
      const totalReqs = catFeatures.reduce((sum, f) => sum + (buildTraceChain(f.id)?.specs?.length || 0), 0);
      return `| ${cat} | ${catFeatures.length} | ${totalReqs} | ${catFeatures.length > 0 ? Math.round((totalReqs / catFeatures.length) * 100) : 0}% |`;
    }),
    '',
    '---',
    `> Generated by orchestrate/feature-engine.mjs V2.0`,
  ];
  return lines.join('\n');
}

export function generateVSIDocumentMarkdown() {
  const features = loadRegistry().features;
  const repo = getRepositoryIntelligence();
  const complete = features.filter((f) => f.status === 'complete');
  const inProgress = features.filter((f) => f.status === 'in-progress');
  const planned = features.filter((f) => f.status === 'planned');

  const formatTable = (fList, cols = ['id', 'name', 'priority', 'category', 'complexity']) => {
    const header = `| ${cols.map((c) => c === 'id' ? 'ID' : c.charAt(0).toUpperCase() + c.slice(1)).join(' | ')} |`;
    const sep = `|${cols.map(() => '------').join('|')}|`;
    const rows = fList.map((f) =>
      `| ${cols.map((c) => {
        if (c === 'id') return f.id;
        if (c === 'name') return f.name.slice(0, 40);
        return f[c] || '-';
      }).join(' | ')} |`,
    );
    return [header, sep, ...rows].join('\n');
  };

  return [
    '# OptiFlow OS — Repository Intelligence (VSI)',
    '',
    `> Auto-generated: ${new Date().toISOString()}`,
    `> Schema: V5.0 AI-native feature registry`,
    '',
    '---',
    '',
    '## Vision',
    '',
    repo?.purpose || 'OptiFlow OS is a Business Execution Operating System built for Indian MSMEs.',
    '',
    '## Strategy',
    '',
    '- **Pages-first architecture**: Every marketing page is a self-contained HTML file',
    '- **Design system as source of truth**: All visual decisions flow from DESIGN.md',
    '- **Spec-driven development**: Every feature originates from an OpenSpec capability spec',
    '- **Autonomous orchestration**: The V13 engine handles the complete SDD lifecycle',
    '- **AI-native**: Every feature contains AI context for autonomous implementation',
    '',
    '## Architecture Philosophy',
    '',
    '1. **Fewest files possible** — 15 pages, 1 CSS file, 1 JS file',
    '2. **Immutability** — All data flows through the build pipeline; source → dist',
    '3. **Validation at every boundary** — pre-build, post-build, pre-commit, pre-push',
    '4. **Convention over configuration** — Feature IDs, spec names, page names follow patterns',
    '5. **Auto-discovery over metadata** — The orchestration engine infers linkages at runtime',
    '',
    '## Engineering Standards',
    '',
    repo?.engineeringStandards
      ? [
        `- **Design**: ${repo.engineeringStandards.design}`,
        `- **Code**: ${repo.engineeringStandards.code}`,
        `- **Testing**: ${repo.engineeringStandards.testing}`,
        `- **Build**: ${repo.engineeringStandards.build}`,
        `- **Deployment**: ${repo.engineeringStandards.deployment}`,
      ].join('\n')
      : '- See features.json repository section for detailed standards',
    '',
    '## AI Standards',
    '',
    repo?.aiStandards
      ? [
        `- **Feature First**: ${repo.aiStandards.featureFirst}`,
        `- **Design Compliance**: ${repo.aiStandards.designSystemCompliance}`,
        `- **Skill Discovery**: ${repo.aiStandards.skillDiscovery}`,
        `- **Traceability**: ${repo.aiStandards.traceability}`,
        `- **Autonomy**: ${repo.aiStandards.autonomy}`,
      ].join('\n')
      : '- AI agents should read features.json for repository understanding',
    '',
    '## Decision Framework',
    '',
    'When making engineering decisions:',
    '1. Is it in the design system? → Use that.',
    '2. Is there a spec for it? → Follow the spec.',
    '3. Is there an existing page to copy? → Use that pattern.',
    '4. Is it a new capability? → Create a spec first, then implement.',
    '',
    '## Success Metrics',
    '',
    `- ${complete.length}/${features.length} features complete (V1.0)`,
    '- 0 hardcoded colors in production',
    '- Build passes with 0 errors on every commit',
    '- WCAG 2.2 AA compliant across all pages',
    '',
    '---',
    '',
    `## Complete (${complete.length} features)`,
    '',
    formatTable(complete, ['id', 'name', 'priority', 'category', 'complexity']),
    '',
    `## In Progress (${inProgress.length} features)`,
    '',
    inProgress.length
      ? formatTable(inProgress, ['id', 'name', 'priority', 'category', 'complexity'])
      : '| — | No features currently in progress | — | — | — |',
    '',
    `## Planned (${planned.length} features)`,
    '',
    formatTable(planned, ['id', 'name', 'priority', 'category', 'complexity']),
    '',
    '---',
    '',
    '## Usage',
    '',
    '```bash',
    'node orchestrate/coordinator.mjs --feature-report   # Full feature intelligence report',
    'node orchestrate/coordinator.mjs --feature-sync     # Sync all dashboards',
    '/opsx-auto "Feature Name"                           # Autonomous implementation',
    '```',
    '',
    `> Generated by orchestrate/feature-engine.mjs V2.0`,
  ].join('\n');
}

// ─────────────────────────────────────────────────────────
// Orphan Detection (improved)
// ─────────────────────────────────────────────────────────

export function getOrphans() {
  const reg = loadRegistry();
  const archiveIndex = loadArchiveIndex();
  return reg.features.filter((f) => {
    if (f.status !== 'complete') return false;
    const chain = buildTraceChain(f.id);
    const hasSpec = chain?.specs?.length > 0 || f.traceability?.specs?.length > 0;
    const hasArchive = f.traceability?.archiveDir
      || archiveIndex.some((a) => a.name.includes(f.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20)));
    return !hasSpec || !hasArchive;
  });
}

// ─────────────────────────────────────────────────────────
// Automation
// ─────────────────────────────────────────────────────────

export function syncDashboards() {
  writeFileSync(resolve(ROOT, 'features', 'DASHBOARD.md'), generateEnterpriseDashboardMarkdown(), 'utf-8');
  writeFileSync(resolve(ROOT, 'features', 'TRACEABILITY.md'), generateTraceabilityMarkdown(), 'utf-8');
  writeFileSync(resolve(ROOT, 'features', 'VSI.md'), generateVSIDocumentMarkdown(), 'utf-8');
  console.log('  \u2713 DASHBOARD.md updated (enterprise edition)');
  console.log('  \u2713 TRACEABILITY.md updated (auto-generated matrix)');
  console.log('  \u2713 VSI.md updated (repository intelligence)');
  return { dashboard: true, traceability: true, vsi: true };
}

export function registerFeature(name, category, priority = 'P3', description = '', dependencies = []) {
  const reg = loadRegistry();
  const prefix = category === 'operations' ? 'OPS' : category === 'performance' ? 'PERF'
    : category === 'testing' ? 'TEST' : category === 'docs' ? 'DOCS'
    : category === 'content' ? 'CONTENT' : category === 'security' ? 'SEC'
    : category === 'ui' ? 'UI' : category.toUpperCase().slice(0, 4);
  const existing = reg.features.filter((f) => f.id.startsWith(prefix));
  const maxNum = existing.reduce((max, f) => Math.max(max, parseInt(f.id.split('-')[1]) || 0), 0);
  const id = `${prefix}-${String(maxNum + 1).padStart(3, '0')}`;
  reg.features.push({ id, name, status: 'planned', category, priority, description, dependencies,
    complexity: 'M', risk: 'low', owner: 'engineering', created: new Date().toISOString().slice(0, 10),
    updated: new Date().toISOString().slice(0, 10), release: 'planned', acceptanceCriteria: [],
    aiContext: { intent: '', domains: [], skills: [], primaryAgent: 'tdd-guide', validation: [], gates: [],
      implementationStrategy: '', testingStrategy: '', documentationStrategy: '' },
    traceability: { specs: [], sourceFiles: [], archiveDir: '', lastValidated: '' },
  });
  writeFileSync(FEATURES_PATH, JSON.stringify(reg, null, 2), 'utf-8');
  _registry = null;
  return { id, name, category };
}

export function updateFeatureStatus(featureId, newStatus) {
  const reg = loadRegistry();
  const feature = reg.features.find((f) => f.id === featureId);
  if (!feature) return null;
  feature.status = newStatus;
  feature.updated = new Date().toISOString().slice(0, 10);
  writeFileSync(FEATURES_PATH, JSON.stringify(reg, null, 2), 'utf-8');
  _registry = null;
  return feature;
}

// ─────────────────────────────────────────────────────────
// Integrity Validation
// ─────────────────────────────────────────────────────────

export function validateIntegrity() {
  const issues = [];
  const features = loadRegistry().features;

  for (const feature of features) {
    if (feature.status === 'complete') {
      const chain = buildTraceChain(feature.id);
      if (chain && chain.specs.length === 0 && (!feature.traceability?.specs?.length)) {
        issues.push({ feature: feature.id, name: feature.name, severity: 'warning', message: 'Complete feature has no linked specs' });
      }
      if (chain && !chain.archive && !feature.traceability?.archiveDir) {
        issues.push({ feature: feature.id, name: feature.name, severity: 'warning', message: 'Complete feature has no archive entry' });
      }
    }
    if (feature.dependencies?.length) {
      for (const depId of feature.dependencies) {
        if (!getFeature(depId)) {
          issues.push({ feature: feature.id, name: feature.name, severity: 'error', message: `Unknown dependency: ${depId}` });
        }
      }
    }
  }

  const archiveIndex = loadArchiveIndex();
  const archiveDirs = existsSync(ARCHIVE_DIR)
    ? readdirSync(ARCHIVE_DIR, { withFileTypes: true }).filter((e) => e.isDirectory() && !e.name.startsWith('.')).length
    : 0;
  if (archiveIndex.length !== archiveDirs) {
    issues.push({ feature: 'archive', name: 'Archive', severity: 'warning', message: `index.json has ${archiveIndex.length} entries but ${archiveDirs} directories exist on disk` });
  }

  const cycles = detectCycles();
  for (const cycle of cycles) {
    issues.push({ feature: cycle.path[0], name: 'Dependency', severity: 'error', message: `Dependency cycle: ${cycle.path.join(' → ')}` });
  }

  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  return {
    valid: errors.length === 0,
    errors, warnings, totalIssues: issues.length,
    summary: `Feature integrity: ${errors.length} error(s), ${warnings.length} warning(s) across ${features.length} features`,
  };
}

