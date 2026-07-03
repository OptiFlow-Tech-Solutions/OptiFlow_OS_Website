/**
 * V8: OpenSpec command integration with real outputs.
 * Each command produces concrete, actionable results — no stub templates.
 * @module orchestrate/opsx-commands
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';
import { loadFullContext, loadFullContextWithAnalysis } from './context-loader.mjs';
import { parseAllSpecs } from './spec-parser.mjs';
import { resolveAffectedSpecs } from './spec-resolver.mjs';
import { syncToMain, validateSync } from './spec-sync.mjs';
import { generateTrace } from './traceability.mjs';
import { syncDocs } from './doc-sync.mjs';
import { logEvent } from './audit-log.mjs';
import { emit } from './event-bus.mjs';
import { executePipeline, loadPipeline } from './pipeline-engine.mjs';
import { planExecution } from './execution-planner.mjs';
import { discoverSkills } from './skill-discovery.mjs';
import { analyzeTask } from './capability-analyzer.mjs';

const { projectRoot } = resolvePaths();
const ROOT = projectRoot;
const PIPELINE_DIR = resolve(import.meta.dirname || '.', 'pipeline-config');

/**
 * Run a single OpenSpec command with real outputs.
 */
export async function runOpsxCommand(command, changeName, context = {}) {
  await emit('opsx:start', { command, changeName, context });
  logEvent({ type: 'opsx-command', command, changeName });

  const changeDir = resolve(ROOT, 'openspec', 'changes', changeName);

  if (command !== 'explore') {
    mkdirSync(join(changeDir, 'specs'), { recursive: true });
  }

  switch (command) {
    case 'explore':
      return runExplore(changeName, context);

    case 'propose':
      return runPropose(changeName, changeDir, context);

    case 'sync':
      return runSync(changeName, context);

    case 'apply':
      return runApply(changeName, changeDir, context);

    case 'verify':
      return runVerify(changeName, context);

    case 'archive':
      return runArchive(changeName, context);

    case 'feature':
      return runFeatureRoute(changeName, context);

    default:
      return { error: `Unknown command: ${command}` };
  }
}

// ── Real implementations ──

async function runExplore(_changeName, context = {}) {
  console.log('[Explore] Scanning repository — specs, features, pages, dependencies...');

  const fullContext = loadFullContext(context.description || _changeName);
  const specs = fullContext.specs || [];
  const features = fullContext.features || {};
  const site = fullContext.site || {};

  const pages = site.pages || [];
  const specList = specs.map((s) => ({
    name: s.name,
    requirements: (s.requirements || []).length,
    domains: s.domains || [],
  }));

  const result = {
    specsLoaded: specList.length,
    specs: specList,
    featuresLoaded: (features.features || []).length,
    features: (features.features || []).map((f) => ({ id: f.id, name: f.name, module: f.parentModule || f.module, status: f.status })),
    pagesLoaded: pages.length,
    pages: pages.map((p) => ({ name: p.name || p.title, path: p.path || p.url })),
    affected: fullContext.affected || [],
    branch: fullContext.branch || 'unknown',
  };

  console.log(`     Specs: ${result.specsLoaded} | Features: ${result.featuresLoaded} | Pages: ${result.pagesLoaded}`);
  console.log(`     Affected specs: ${result.affected.length ? result.affected.map((a) => a.specName).join(', ') : 'none'}`);

  await emit('opsx:complete', { command: 'explore', changeName: _changeName, result });
  return result;
}

async function runPropose(changeName, changeDir, context = {}) {
  console.log(`[Propose] Generating proposal for: ${changeName}`);

  const taskDesc = context.description || changeName;
  const specs = parseAllSpecs();
  const affected = resolveAffectedSpecs(taskDesc, specs);
  const analysis = analyzeTask(taskDesc);
  const domains = analysis.domains.length ? analysis.domains : ['frontend', 'design'];
  let skills = [];
  try { skills = discoverSkills(taskDesc, domains, 8); } catch { /* ok */ }

  const affectedList = affected.map((a) =>
    `- **${a.specName}** (confidence: ${(a.confidence * 100).toFixed(0)}%): ${a.requirements.slice(0, 3).join(', ')}`
  ).join('\n') || '- (no existing specs directly affected — this is a new capability)';

  const skillList = skills.length ? skills.map((s) => `- ${s}`).join('\n') : '- (no specific skills matched)';

  // Real proposal content
  const proposal = [
    `# ${changeName}`,
    '',
    '## Summary',
    context.description || 'TBD',
    '',
    '## Scope',
    ...domains.map((d) => `- ${d}`),
    '',
    '## Affected Specs',
    affectedList,
    '',
    '## Recommended Skills',
    skillList,
    '',
    `## Metadata`,
    `- Generated: ${new Date().toISOString()}`,
    `- Domains: ${domains.join(', ')}`,
    `- Affected spec count: ${affected.length}`,
  ].join('\n');

  writeFileSync(join(changeDir, 'proposal.md'), proposal);

  // Real design doc
  const designDoc = [
    `# Design: ${changeName}`,
    '',
    '## Architecture',
    `- Project: static-site (HTML/CSS/JS)`,
    `- Design system: OptiFlow OS Enterprise DESIGN.md v5.0`,
    '',
    '## Decisions',
    '- Follow existing page template patterns from src/pages/',
    '- Use CSS variables from core.css for all styling',
    '- Include nav and footer via <!-- INCLUDE: nav --> and <!-- INCLUDE: footer -->',
    '- Page-specific styles in <style> block in <head>',
    '- Never hardcode company info — use {{PHONE}}, {{EMAIL}}, {{YEAR}} placeholders',
    '',
    '## Affected Specs',
    ...affected.map((a) => `- ${a.specName}: ${a.requirements.slice(0, 2).join('; ')}`),
    '',
    `## Generated: ${new Date().toISOString()}`,
  ].join('\n');

  writeFileSync(join(changeDir, 'design.md'), designDoc);

  // Real tasks
  const tasks = [
    `# Tasks: ${changeName}`,
    '',
    '- [ ] Review affected specs and design decisions',
    ...affected.flatMap((a) =>
      a.requirements.slice(0, 4).map((r) => `- [ ] Implement: ${r}`)
    ),
    '- [ ] Build and validate (`npm run build && npm run validate`)',
    '- [ ] Verify against DESIGN.md design system',
    '- [ ] Run accessibility checks',
    '- [ ] Run SEO audit',
    '- [ ] Archive and trace',
    '',
    `## Generated: ${new Date().toISOString()}`,
  ].join('\n');

  writeFileSync(join(changeDir, 'tasks.md'), tasks);

  // Run the propose pipeline
  const pipelinePath = resolve(PIPELINE_DIR, 'propose.yaml');
  let pipelineResult = { results: [], success: true };
  if (existsSync(pipelinePath)) {
    try {
      const pipeline = loadPipeline(pipelinePath);
      pipelineResult = await executePipeline(pipeline, { changeName, ...context });
    } catch { /* pipeline optional */ }
  }

  console.log(`     Created: proposal.md, design.md, tasks.md`);
  console.log(`     Affected specs: ${affected.length} | Skills: ${skills.length}`);

  await emit('opsx:complete', { command: 'propose', changeName, result: { affected, skills } });
  return {
    proposalPath: join(changeDir, 'proposal.md'),
    designPath: join(changeDir, 'design.md'),
    tasksPath: join(changeDir, 'tasks.md'),
    specsDir: join(changeDir, 'specs'),
    affected,
    skills,
    pipelineResult,
  };
}

async function runSync(changeName, context = {}) {
  console.log(`[Sync] Syncing delta specs to main: ${changeName}`);

  const deltaDir = resolve(ROOT, 'openspec', 'changes', changeName, 'specs');
  if (!existsSync(deltaDir)) {
    console.log('     No delta specs to sync.');
    await emit('opsx:complete', { command: 'sync', changeName, synced: 0 });
    return { synced: [], message: 'No delta specs found' };
  }

  const validation = validateSync(changeName);
  if (validation.conflicts.length) {
    console.log(`     Conflicts: ${validation.conflicts.join('; ')}`);
  }

  const syncResult = syncToMain(changeName, { dryRun: context.dryRun || false, backup: true });
  console.log(`     Synced ${syncResult.synced.length} spec(s): ${syncResult.synced.map((s) => s.spec).join(', ') || 'none'}`);

  await emit('opsx:complete', { command: 'sync', changeName, syncResult });
  return { syncResult };
}

async function runApply(changeName, changeDir, context = {}) {
  console.log(`[Apply] Implementing: ${changeName}`);

  const tasksPath = join(changeDir, 'tasks.md');
  const content = existsSync(tasksPath) ? readFileSync(tasksPath, 'utf-8') : '';
  const { batches } = planExecution(content);

  const pipelinePath = resolve(PIPELINE_DIR, 'apply.yaml');
  let pipelineResult = { results: [], success: true };
  if (existsSync(pipelinePath)) {
    try {
      const pipeline = loadPipeline(pipelinePath);
      pipelineResult = await executePipeline(pipeline, { changeName, tasksContent: content, ...context });
    } catch { /* pipeline optional */ }
  }

  console.log(`     Task batches: ${batches.length} | Pipeline: ${pipelineResult.success ? 'ok' : 'failed'}`);

  await emit('opsx:complete', { command: 'apply', changeName, pipelineResult });
  return { batches, pipelineResult };
}

async function runVerify(changeName, context = {}) {
  console.log(`[Verify] Validating: ${changeName}`);

  const pipelinePath = resolve(PIPELINE_DIR, 'verify.yaml');
  let pipelineResult = { results: [], success: true, totalDuration: 0 };
  if (existsSync(pipelinePath)) {
    try {
      const pipeline = loadPipeline(pipelinePath);
      pipelineResult = await executePipeline(pipeline, { changeName, ...context });
    } catch (e) { pipelineResult = { results: [], success: false, totalDuration: 0, error: e.message }; }
  }

  await emit('opsx:complete', { command: 'verify', changeName, pipelineResult });
  return { pipelineResult };
}

async function runArchive(changeName, context = {}) {
  console.log(`[Archive] Archiving: ${changeName}`);

  // Sync specs to main
  const archiveSyncResult = syncToMain(changeName);

  // Sync docs
  const syncedSpecs = archiveSyncResult.synced.map((s) => s.spec);
  let docResult = null;
  try { docResult = syncDocs(changeName, syncedSpecs); } catch { /* optional */ }

  // Generate traceability
  let traceResult = null;
  try { traceResult = generateTrace(changeName, 'HEAD'); } catch { /* optional */ }

  // Run archive pipeline
  const pipelinePath = resolve(PIPELINE_DIR, 'archive.yaml');
  let pipelineResult = { results: [], success: true };
  if (existsSync(pipelinePath)) {
    try {
      const pipeline = loadPipeline(pipelinePath);
      pipelineResult = await executePipeline(pipeline, { changeName, ...context });
    } catch { /* pipeline optional */ }
  }

  console.log(`     Synced: ${archiveSyncResult.synced.length} spec(s)`);
  console.log(`     Traced: ${traceResult ? 'yes' : 'no'} | Docs: ${docResult ? 'synced' : 'skipped'}`);

  await emit('opsx:complete', { command: 'archive', changeName, syncResult: archiveSyncResult, traceResult, docResult, pipelineResult });
  return { syncResult: archiveSyncResult, traceResult, docResult, pipelineResult };
}

async function runFeatureRoute(featureId, context = {}) {
  console.log(`[Feature] Auto-orchestrating from Feature ID: ${featureId}`);
  try {
    const { reconstructContext, summarizeFeature } = await import('./feature-router.mjs');
    const ctx = await reconstructContext(featureId);
    const summary = await summarizeFeature(featureId);

    await emit('opsx:complete', { command: 'feature', featureId, ctx, summary });
    return { featureContext: ctx, summary, status: 'context-reconstructed' };
  } catch (e) {
    await emit('opsx:error', { command: 'feature', featureId, error: e.message });
    return { error: e.message };
  }
}

/**
 * Run the full OpenSpec pipeline: explore → propose → sync → apply → verify → archive.
 */
export async function runFullPipeline(changeName, taskDescription, opts = {}) {
  const steps = ['explore', 'propose', 'sync', 'apply', 'verify', 'archive'];
  const results = [];

  await emit('pipeline:full:start', { changeName, taskDescription });

  for (const step of steps) {
    console.log(`\n[${step.toUpperCase()}] ${changeName}`);
    const result = await runOpsxCommand(step, changeName, { description: taskDescription, autoApprove: opts.autoApprove });
    results.push({ phase: step, result });
    console.log(`[${step.toUpperCase()}] Complete.`);
  }

  await emit('pipeline:full:complete', { changeName, results });
  return { changeName, phases: results };
}
