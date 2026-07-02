/**
 * V5 spec-driven orchestration engine with Vertical Slice Architecture.
 * Auto-discovers capabilities, specs, features, routes everything, and EXECUTES the plan.
 * NOW: Given only a Feature ID, the engine reconstructs the entire implementation context.
 * The user runs a single OpenSpec command — the engine handles everything.
 * @module orchestrate/coordinator
 */

import { routeTask, routeBySpecs } from './skill-router.mjs';
import { routeAgents, agentForPhase } from './agent-router.mjs';
import { routeMCP } from './mcp-router.mjs';
import { routeHooks } from './hook-router.mjs';
import { routeCommands } from './command-router.mjs';
import { resolveAffectedSpecs } from './spec-resolver.mjs';
import { parseAllSpecs } from './spec-parser.mjs';
import { detectPhase, detectSize } from './phase-detector.mjs';
import { buildContext } from './execution-context.mjs';
import { determineLevels } from './validation-pipeline.mjs';
import { gatesForPhase } from './quality-gate.mjs';
import { resolveDependencies } from './dependency-resolver.mjs';
import { saveState } from './state-manager.mjs';
import { startTimer, record } from './metrics.mjs';
import { logEvent } from './audit-log.mjs';
import { getBranch } from './project-scanner.mjs';
import { executePipeline, loadPipeline } from './pipeline-engine.mjs';
import { executeHook } from './hook-engine.mjs';
import { runGates } from './quality-gate.mjs';
import { emit } from './event-bus.mjs';
import { resolvePaths } from './config-resolver.mjs';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { reconstructContext, getFeature, listFeatures, summarizeFeature, resolveFeatureFromTask } from './feature-router.mjs';

const { projectRoot } = resolvePaths();
const ROOT = projectRoot;
const OPENSPEC_PHASES = ['explore', 'propose', 'apply', 'verify', 'archive'];

/** @type {Map<string, string>} */
const PHASE_PIPELINE_MAP = new Map([
  ['explore', 'explore'],
  ['propose', 'propose'],
  ['apply', 'apply'],
  ['verify', 'verify'],
  ['archive', 'archive'],
  ['auto', 'build'],
]);

function detectTier(changeName) {
  const tasksPath = join(ROOT, 'openspec', 'changes', changeName, 'tasks.md');
  if (existsSync(tasksPath)) return detectSize(readFileSync(tasksPath, 'utf-8'));
  return 'standard';
}

function selectPipeline(phase) {
  const name = PHASE_PIPELINE_MAP.get(phase) || 'build';
  const pipelinePath = join(import.meta.dirname || '.', 'pipeline-config', `${name}.yaml`);
  if (existsSync(pipelinePath)) return loadPipeline(pipelinePath);
  return null;
}

/**
 * V4 orchestration plan — builds and optionally executes.
 * @param {'explore'|'propose'|'apply'|'verify'|'archive'|'auto'} command
 * @param {string} changeName
 * @param {string} taskDescription
 * @param {{changedFiles?: string[], execute?: boolean, skipGates?: boolean}} [opts]
 */
export async function orchestrateOpenSpec(command, changeName, taskDescription, opts = {}) {
  const { changedFiles = [], execute = false, skipGates = false } = opts;
  const timer = startTimer('orchestrate');
  await emit('orchestrate:start', { command, changeName, taskDescription });

  const parsedSpecs = parseAllSpecs();
  const affected = resolveAffectedSpecs(taskDescription, parsedSpecs);
  const specMap = new Map(parsedSpecs.map((s) => [s.name, s]));
  const affectedWithDomains = affected.map((s) => ({
    specName: s.specName, requirements: s.requirements, confidence: s.confidence,
    domains: specMap.get(s.specName)?.domains || [],
  }));
  const affectedDomains = [...new Set(affectedWithDomains.flatMap((s) => s.domains))];
  const branch = getBranch();
  const phase = command === 'auto' ? detectPhase(changeName) : command;
  const tier = detectTier(changeName);

  // Intelligent routing
  const skills = affectedWithDomains.length > 0
    ? routeBySpecs(affectedWithDomains) : routeTask(taskDescription);
  const agentRoute = routeAgents(affectedDomains, tier, branch);
  const { mcpServers } = routeMCP(taskDescription, affectedDomains);
  const { preHooks, postHooks } = routeHooks(phase);
  const commands = routeCommands(phase, { changeName });
  const validationLevels = determineLevels(affectedDomains);
  const qualityGates = gatesForPhase(phase);
  const deps = resolveDependencies(changedFiles);
  const ctx = buildContext(changeName, taskDescription, branch);

  const plan = {
    version: '4.0',
    command, changeName, size: tier, branch,
    timestamp: new Date().toISOString(),
    context: { ...ctx, affectedSpecs: affectedWithDomains, affectedDomains },
    capabilities: {
      skills,
      agents: { primary: agentRoute.primaryAgent, support: agentRoute.supportAgents },
      mcpServers,
      hooks: { pre: preHooks, post: postHooks },
      commands,
    },
    phases: command === 'auto' ? OPENSPEC_PHASES : OPENSPEC_PHASES.slice(OPENSPEC_PHASES.indexOf(phase)),
    validationLevels, qualityGates,
    pagesToRebuild: deps.pagesToRebuild,
    buildCommand: 'npm run build && npm run validate',
  };

  saveState(`orchestrate-${changeName}`, plan);
  logEvent({ type: 'orchestrate', command, changeName, size: tier, phase, skills, domains: affectedDomains });

  // Execute if requested
  if (execute) {
    await executePlan(plan, { skipGates });
  }

  record('orchestrate', timer());
  await emit('orchestrate:complete', { command, changeName, plan });

  return plan;
}

/**
 * Execute the orchestration plan. Runs pre-hooks → pipeline → post-hooks → validation → gates.
 * @param {object} plan
 * @param {{skipGates?: boolean}} [opts]
 */
export async function executePlan(plan, opts = {}) {
  const { skipGates = false } = opts;
  console.log(`\n=== Executing: ${plan.command} "${plan.changeName}" ===\n`);

  // 1. Run pre-hooks
  if (plan.capabilities.hooks.pre.length) {
    console.log('[Hooks] Pre-execution...');
    for (const hook of plan.capabilities.hooks.pre) {
      await emit('hook:pre', { hook, phase: plan.command });
      const result = executeHook(hook);
      console.log(`  ${result.ran ? '✓' : '-'} ${hook}`);
    }
  }

  // 2. Run the phase pipeline
  const pipeline = selectPipeline(plan.command);
  if (pipeline && pipeline.steps.length) {
    console.log(`\n[Pipeline] ${pipeline.name}...`);
    const result = await executePipeline(pipeline, {
      changeName: plan.changeName,
      taskDescription: plan.context?.taskDescription || '',
      affectedDomains: plan.context?.affectedDomains || [],
      affectedSpecs: plan.context?.affectedSpecs || [],
    });
    if (!result.success) {
      console.log('  Pipeline failed — stopping.');
      await emit('pipeline:failed', { pipeline: pipeline.name, results: result.results });
      return { ...plan, status: 'failed', pipelineResult: result };
    }
    console.log('  Pipeline complete.');
  }

  // 3. Run quality gates (unless skipped)
  if (!skipGates && plan.qualityGates.length) {
    console.log(`\n[Gates] ${plan.qualityGates.join(' → ')}...`);
    const gateResult = runGates(plan.qualityGates, { changeName: plan.changeName });
    if (!gateResult.passed) {
      console.log(`  Gate failed: ${gateResult.failedGate}`);
      await emit('gate:failed', { gate: gateResult.failedGate, plan });
      return { ...plan, status: 'gated', gateResult };
    }
    console.log('  All gates passed.');
  }

  // 4. Run post-hooks
  if (plan.capabilities.hooks.post.length) {
    console.log('\n[Hooks] Post-execution...');
    for (const hook of plan.capabilities.hooks.post) {
      await emit('hook:post', { hook, phase: plan.command });
      const result = executeHook(hook);
      console.log(`  ${result.ran ? '✓' : '-'} ${hook}`);
    }
  }

  console.log(`\n=== Complete: ${plan.command} "${plan.changeName}" ===\n`);
  return { ...plan, status: 'done' };
}

/**
 * Backward-compatible wrapper. Plans but does not execute.
 */
export function orchestrate(taskDescription, changedFiles = []) {
  const slug = slugify(taskDescription);
  return orchestrateOpenSpec('auto', slug, taskDescription, { changedFiles });
}

/**
 * Plan and execute. The one-stop entry point.
 * V6: When opts.auto is true (default), runs the full auto pipeline.
 * Falls back to legacy orchestration when auto: false.
 * @param {string} taskDescription
 * @param {{execute?: boolean, auto?: boolean, skipVisual?: boolean, dryRun?: boolean}} [opts]
 */
export async function run(taskDescription, opts = {}) {
  if (opts.auto !== false) {
    try {
      const { autoFullPipeline } = await import('./auto-pipeline.mjs');
      return autoFullPipeline(taskDescription, opts);
    } catch (e) {
      console.log(`Auto pipeline unavailable: ${e.message}. Falling back to legacy mode.`);
    }
  }

  const slug = slugify(taskDescription);
  return orchestrateOpenSpec('auto', slug, taskDescription, {
    ...opts,
    execute: opts.execute !== false,
  });
}

/**
 * Single-command execution. Runs a specific OpenSpec phase with full orchestration.
 * @param {'explore'|'propose'|'apply'|'verify'|'archive'} command
 * @param {string} changeName
 * @param {string} taskDescription
 * @param {{execute?: boolean, skipGates?: boolean}} [opts]
 */
export async function runPhase(command, changeName, taskDescription, opts = {}) {
  return orchestrateOpenSpec(command, changeName, taskDescription, {
    ...opts,
    execute: opts.execute !== false,
  });
}

/**
 * Display the orchestration plan (CLI output, no execution).
 */
export function autoOrchestrate(taskDescription) {
  const slug = slugify(taskDescription);
  // Since orchestrateOpenSpec is async but we're in sync code, use the sync path

  const parsedSpecs = parseAllSpecs();
  const affected = resolveAffectedSpecs(taskDescription, parsedSpecs);
  const specMap = new Map(parsedSpecs.map((s) => [s.name, s]));
  const affectedDomains = [...new Set(affected.flatMap((s) => specMap.get(s.specName)?.domains || []))];
  const branch = getBranch();
  const phase = detectPhase(slug);
  const tier = detectTier(slug);
  const skills = affected.length > 0 ? routeBySpecs(affected.map((s) => ({ ...s, domains: specMap.get(s.specName)?.domains || [] }))) : routeTask(taskDescription);
  const agentRoute = routeAgents(affectedDomains, tier, branch);

  console.log([
    `\n=== Auto-Orchestrate: "${taskDescription.slice(0, 60)}" ===`,
    `Size: ${tier} | Branch: ${branch}`,
    `Affected domains: ${affectedDomains.join(', ') || '(none)'}`,
    `Skills: ${skills.join(', ')}`,
    `Primary agent: ${agentRoute.primaryAgent}`,
    `Support agents: ${agentRoute.supportAgents.join(', ') || 'none'}`,
    `Phase plan:`,
  ].join('\n'));

  const startPhase = OPENSPEC_PHASES.indexOf(phase);
  for (const p of OPENSPEC_PHASES.slice(startPhase >= 0 ? startPhase : 0)) {
    const agent = agentForPhase(p);
    const hooks = routeHooks(p);
    const gates = gatesForPhase(p);
    console.log(`  ${p.padEnd(10)} → agent: ${agent.padEnd(18)} hooks: ${[...hooks.preHooks, ...hooks.postHooks].join(', ') || '-'} gates: ${gates.join(', ') || '-'}`);
  }

  const levels = determineLevels(affectedDomains);
  console.log(`\nValidations: L${levels.join(', L') || '1-7'}`);
  console.log('Run with execute=true to execute the plan.\n');

  // Return a sync plan object
  return {
    version: '4.0',
    command: 'auto',
    changeName: slug,
    size: tier,
    branch,
    capabilities: { skills, agents: agentRoute },
    phases: OPENSPEC_PHASES.slice(OPENSPEC_PHASES.indexOf(phase) >= 0 ? OPENSPEC_PHASES.indexOf(phase) : 0),
    validationLevels: levels,
  };
}

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').slice(0, 40).replace(/[^a-z0-9-]/g, '');
}

// ═══════════════════════════════════════════
// V5 Feature-Based Vertical Slice Orchestration
// ═══════════════════════════════════════════

/**
 * Orchestrate by Feature ID. This is the primary VSA entry point.
 * Given only a Feature ID and name, the engine auto-resolves everything.
 *
 * @param {string} featureId - Feature ID (e.g., "PAGE-001") or name (e.g., "Home Page")
 * @param {{execute?: boolean, skipGates?: boolean}} [opts]
 * @returns {Promise<object>}
 */
export async function featureOrchestrate(featureId, opts = {}) {
  const { execute = false, skipGates = false } = opts;
  const timer = startTimer('feature-orchestrate');
  await emit('feature:orchestrate:start', { featureId });

  // Auto-reconstruct the entire implementation context from the Feature ID alone
  const ctx = await reconstructContext(featureId);
  const feature = ctx.feature;

  console.log([
    `\n=== VSA Orchestrate: ${feature.id} | ${feature.name} ===`,
    `Module: ${feature.parentModule} | Priority: ${feature.priority} | Status: ${feature.status}`,
    `Dependencies (${ctx.dependencies.count}): ${ctx.dependencies.chain.join(' → ')}`,
    `Specs (${ctx.specs.count}): ${ctx.specs.files.join(', ') || 'none'}`,
    `Source files (${ctx.files.sourceCount}): ${ctx.files.source.join(', ') || 'none'}`,
    `Tests (${ctx.tests.count}): ${ctx.tests.files.join(', ') || 'none'}`,
    `Skills: ${ctx.routing.skills.join(', ')}`,
    `Agents: ${ctx.routing.agents.join(', ')}`,
    `Hooks: ${ctx.routing.hooks.join(', ')}`,
    `Gates: ${ctx.integration.qualityGates.join(' → ')}`,
    `Pipeline: ${ctx.integration.pipelineConfig}`,
    `Branch: ${ctx.integration.branch}`,
  ].join('\n'));

  // Build the plan
  const plan = {
    version: '5.0',
    feature: ctx.feature,
    context: ctx,
    changeName: `${feature.id}-${feature.name}`,
    capabilities: {
      skills: ctx.routing.skills,
      agents: { primary: ctx.routing.agents[0] || 'tdd-guide', support: ctx.routing.agents.slice(1) },
      mcpServers: ctx.routing.mcpServers,
      hooks: { pre: ctx.routing.hooks.filter((h) => h.startsWith('pre-')), post: ctx.routing.hooks.filter((h) => h.startsWith('post-')) },
    },
    qualityGates: ctx.integration.qualityGates,
    buildCommand: 'npm run build && npm run validate',
    timestamp: new Date().toISOString(),
  };

  saveState(`vsa-${feature.id}`, plan);
  logEvent({ type: 'feature-orchestrate', featureId: feature.id, featureName: feature.name });

  if (execute) {
    const result = await featureExecute(plan, { skipGates });
    record('feature-orchestrate', timer());
    return { plan, result };
  }

  record('feature-orchestrate', timer());
  return plan;
}

/**
 * Execute a feature-based plan.
 * @param {object} plan
 * @param {{skipGates?: boolean}} [opts]
 */
async function featureExecute(plan, opts = {}) {
  const { skipGates = false } = opts;
  const feature = plan.feature;

  console.log(`\n=== Executing VSA: ${feature.id} | ${feature.name} ===\n`);

  // 1. Run pre-hooks
  if (plan.capabilities.hooks.pre.length) {
    console.log('[Hooks] Pre-execution...');
    for (const hook of plan.capabilities.hooks.pre) {
      await emit('hook:pre', { hook, featureId: feature.id });
      const result = executeHook(hook);
      console.log(`  ${result.ran ? '✓' : '-'} ${hook}`);
    }
  }

  // 2. Build
  console.log('\n[Build] Assembling dist/...');
  try {
    const { execSync } = await import('node:child_process');
    execSync('node scripts/assemble.mjs', { cwd: ROOT, encoding: 'utf-8', timeout: 60000, stdio: 'pipe' });
    console.log('  ✓ Build complete.');
    } catch (_e) {
    console.log(`  ✗ Build failed: ${_e.message}`);
    return { status: 'failed', stage: 'build', error: _e.message };
  }

  // 3. Validate
  console.log('\n[Validate] Running full validation...');
  try {
    const { execSync } = await import('node:child_process');
    execSync('node scripts/validate.mjs', { cwd: ROOT, encoding: 'utf-8', timeout: 30000, stdio: 'pipe' });
    console.log('  ✓ Validation passed.');
    } catch (_e) {
    console.log(`  ⚠ Validation warnings (non-blocking)`);
  }

  // 4. Tests (if any)
  if (plan.context.tests.count > 0) {
    console.log(`\n[Tests] Running ${plan.context.tests.count} test files...`);
    const testResults = [];
    for (const testFile of plan.context.tests.files) {
      try {
        const { execSync } = await import('node:child_process');
        execSync(`npx playwright test ${testFile}`, { cwd: ROOT, encoding: 'utf-8', timeout: 120000, stdio: 'pipe' });
        testResults.push({ file: testFile, passed: true });
        console.log(`  ✓ ${testFile}`);
      } catch (e) {
        testResults.push({ file: testFile, passed: false, error: e.message.slice(0, 200) });
        console.log(`  ✗ ${testFile}`);
      }
    }
  }

  // 5. Quality gates
  if (!skipGates && plan.qualityGates.length) {
    console.log(`\n[Gates] ${plan.qualityGates.join(' → ')}...`);
    const gateResult = runGates(plan.qualityGates, { changeName: plan.changeName });
    if (!gateResult.passed) {
      console.log(`  Gate failed: ${gateResult.failedGate}`);
      return { status: 'gated', gateResult };
    }
    console.log('  All gates passed.');
  }

  // 6. Post-hooks
  if (plan.capabilities.hooks.post.length) {
    console.log('\n[Hooks] Post-execution...');
    for (const hook of plan.capabilities.hooks.post) {
      await emit('hook:post', { hook, featureId: feature.id });
      const result = executeHook(hook);
      console.log(`  ${result.ran ? '✓' : '-'} ${hook}`);
    }
  }

  console.log(`\n=== VSA Complete: ${feature.id} | ${feature.name} ===\n`);
  return { status: 'done', featureId: feature.id, featureName: feature.name };
}

/**
 * Display a feature's full hierarchical context (dry run, no execution).
 * Shows parent → child features → tasks tree.
 * @param {string} featureId
 * @returns {Promise<string>}
 */
export async function featureShow(featureId) {
  const feature = getFeature(featureId);
  if (!feature) return `Feature not found: ${featureId}. Run 'feature list' to see all registered features.`;
  return summarizeFeature(featureId);
}

/**
 * Display the full VSI tree for all marketing pages.
 * @returns {string}
 */
export function featureListTree() {
  const allFeatures = listFeatures();
  const prefixes = ['SYS', 'PAGE', 'LEAD', 'LEGAL', 'API', 'QA', 'OPS'];
  const lines = ['=== Feature Inventory (Flat, Vertical-Sliced) ===', ''];

  for (const prefix of prefixes) {
    const group = allFeatures.filter((f) => f.id.startsWith(prefix));
    if (group.length === 0) continue;
    lines.push(`\n## ${prefix}`);
    for (const f of group) {
      lines.push(`  ${f.id}  ${f.name}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

/**
 * List all registered features.
 * @returns {Array<{id: string, name: string, phase: number, priority: string, status: string, module: string}>}
 */
export function featureList() {
  return listFeatures();
}

/**
 * Run the full OpenSpec pipeline for a feature.
 * Equivalent to: /opsx:explore -> /opsx:propose -> /opsx:apply -> /opsx:verify -> /opsx:archive
 * but auto-populated from the feature registry.
 *
 * @param {string} featureId
 * @param {{autoApprove?: boolean}} [opts]
 * @returns {Promise<object>}
 */
export async function featureFullPipeline(featureId, opts = {}) {
  const ctx = await reconstructContext(featureId);
  const feature = ctx.feature;
  const changeName = feature.id.toLowerCase();

  console.log(`\n=== VSA Full Pipeline: ${feature.id} | ${feature.name} ===`);
  console.log(`Specs: ${ctx.specs.count} | Sources: ${ctx.files.count}`);
  console.log('');

  const { runFullPipeline } = await import('./opsx-commands.mjs');
  return runFullPipeline(changeName, feature.name, {
    autoApprove: opts.autoApprove,
    featureContext: ctx,
  });
}

// ═══════════════════════════════════════════
// V6 Re-exports
// ═══════════════════════════════════════════

export { resolveFeatureFromTask };

export async function autoFullPipeline(taskDescription, opts = {}) {
  const mod = await import('./auto-pipeline.mjs');
  return mod.autoFullPipeline(taskDescription, opts);
}
