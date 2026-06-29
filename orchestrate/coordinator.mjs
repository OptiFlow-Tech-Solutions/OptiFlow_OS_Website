/**
 * V4 spec-driven orchestration engine.
 * Auto-discovers capabilities, specs, routes everything, and EXECUTES the plan.
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
import { saveState, loadState } from './state-manager.mjs';
import { startTimer, record } from './metrics.mjs';
import { logEvent } from './audit-log.mjs';
import { getBranch } from './project-scanner.mjs';
import { executePipeline, loadPipeline } from './pipeline-engine.mjs';
import { runOpsxCommand } from './opsx-commands.mjs';
import { executeHook } from './hook-engine.mjs';
import { runGates } from './quality-gate.mjs';
import { emit } from './event-bus.mjs';
import { resolvePaths } from './config-resolver.mjs';
import { get as cacheGet, set as cacheSet } from './cache-manager.mjs';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

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
 * @param {string} taskDescription
 * @param {{execute?: boolean}} [opts]
 */
export async function run(taskDescription, opts = {}) {
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
  const plan = orchestrateOpenSpec('auto', slug, taskDescription, { execute: false });
  // Since orchestrateOpenSpec is async but we're in sync code, use the sync path
  // Actually, let's handle this differently

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
