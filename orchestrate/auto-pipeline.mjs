/**
 * V11: /opsx-auto Autonomous Orchestration Engine.
 *
 * Infrastructure layer for the AI agent. The AI agent drives execution
 * using the goal-oriented loop; this module provides context, discovery,
 * validation, build, file I/O, state persistence, and recovery.
 *
 * Architecture:
 *   AI Agent (intelligence) → PipelineContext (shared state) → Phase methods (infrastructure)
 *
 * Phases the AI agent orchestrates:
 *   1. INIT            — initPipeline() builds execution context
 *   2. DEEP_SCAN       — analyzeProject() + loadFullContextWithAnalysis()
 *   3. SKILL_DISCOVERY — discoverSkills() + routeAgents()
 *   4. OPSX_EXPLORE    — AI reads specs/features/pages, understands codebase
 *   5. OPSX_PROPOSE    — AI writes proposal.md, design.md, tasks.md directly
 *   6. OPSX_SYNC       — runOpsxCommand('sync') auto-merges delta specs
 *   7. OPSX_APPLY      — AI implements tasks, then runs build pipeline
 *   8. VALIDATE        — build + lint + tests + quality gates
 *   9. OPSX_ARCHIVE    — spec sync + trace + doc sync + artifact check
 *
 * Goal-Oriented Loop (driven by the AI agent):
 *   Initialize → Analyze → Plan → Execute → Validate
 *     → { goal met? → Archive → Done | iterate }
 *
 * @module orchestrate/auto-pipeline
 */

import { PipelineContext, slugify, GOAL_STATES, ITERATION_LIMIT } from './pipeline-context.mjs';
import { analyzeProject } from './project-analyzer.mjs';
import { loadFullContextWithAnalysis } from './context-loader.mjs';
import { discoverSkills } from './skill-discovery.mjs';
import { analyzeTask } from './capability-analyzer.mjs';
import { routeAgents } from './agent-router.mjs';
import { routeMCP } from './mcp-router.mjs';
import { routeHooks } from './hook-router.mjs';
import { routeCommands } from './command-router.mjs';
import { gatesForPhase, runGates } from './quality-gate.mjs';
import { resolveFeatureFromTask } from './feature-router.mjs';
import { runOpsxCommand } from './opsx-commands.mjs';
import { getBranch } from './project-scanner.mjs';
import { savePipelineState, writeExecutionSummary, writeRecoveryGuidance } from './state-manager.mjs';
import { startTimer, record, exportMetrics } from './metrics.mjs';
import { logEvent } from './audit-log.mjs';
import { emit, registerDefaults } from './event-bus.mjs';
import { executeLifecycle } from './hook-engine.mjs';
import { enableAutoApprove } from './human-gate.mjs';
import { build as runBuild, validate as runValidateCmd, lint as runLint, test as runTest } from './command-runner.mjs';
import { runValidations } from './validation-pipeline.mjs';
import { resolveDependencies } from './dependency-resolver.mjs';
import { measureProgress, progressSummary } from './progress-tracker.mjs';
import { recordPattern } from './skill-evolution.mjs';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { verifyAll, startDevServer, stopDevServer } from './visual-verify.mjs';
import { resolvePaths } from './config-resolver.mjs';
import { buildRegistry } from './capability-registry.mjs';
import { resetAllCircuits } from './pipeline-engine.mjs';

const { projectRoot } = resolvePaths();
const ROOT = projectRoot;

registerDefaults((event) => logEvent({ type: 'event-bus', ...event }));

const PHASE_ORDER = [
  { id: 'DEEP_SCAN',       label: 'Deep Scan' },
  { id: 'SKILL_DISCOVERY', label: 'Skill Discovery' },
  { id: 'OPSX_EXPLORE',    label: 'Explore' },
  { id: 'OPSX_PROPOSE',    label: 'Propose' },
  { id: 'OPSX_SYNC',       label: 'Sync' },
  { id: 'OPSX_APPLY',      label: 'Apply' },
  { id: 'VALIDATE',        label: 'Validate' },
  { id: 'OPSX_ARCHIVE',    label: 'Archive' },
];

const SAFETY_RULES = {
  maxFilesChanged: 200,
  protectedDirs: ['.git', 'node_modules', 'dist', 'orchestrate/.state', 'orchestrate/.cache'],
  neverDelete: ['site.json', 'package.json', 'AGENTS.md'],
};

// ─────────────────────────────────────────────────────────
// PUBLIC API — called by the AI agent between phases
// ─────────────────────────────────────────────────────────

/**
 * Initialize the pipeline. Returns the execution context the AI agent uses.
 * Must be called first. All subsequent methods expect the returned context.
 *
 * @param {string} taskDescription
 * @param {{ dryRun?: boolean, skipBuild?: boolean }} [opts]
 * @returns {PipelineContext}
 */
export function initPipeline(taskDescription, opts = {}) {
  const timer = startTimer('init-pipeline');
  resetAllCircuits(); // V12: Fresh circuit state per pipeline
  const ctx = new PipelineContext(taskDescription, opts);
  ctx.branch = getBranch();
  ctx.advanceGoalState(GOAL_STATES.INIT);
  ctx.persist();

  if (ctx.autoApprove) enableAutoApprove();

  console.log('');
  console.log('═'.repeat(62));
  console.log(`  /opsx-auto — Autonomous Spec-Driven Orchestration v11`);
  console.log(`  Task: "${taskDescription.slice(0, 70)}"`);
  console.log(`  Execution: ${ctx.executionId}`);
  console.log(`  Branch: ${ctx.branch}`);
  console.log(`  Started: ${ctx.startedAt}`);
  console.log('═'.repeat(62));
  console.log('');

  logEvent({ type: 'auto-pipeline', phase: 'init', task: taskDescription, executionId: ctx.executionId });
  record('init-pipeline', timer());
  return ctx;
}

/**
 * Phase 1: Deep repository scan. Returns enriched context.
 * The AI agent calls this, reads the output, then calls phaseComplete().
 *
 * @param {PipelineContext} ctx
 * @returns {PipelineContext}
 */
export function runDeepScan(ctx) {
  const _phase = ctx.startPhase('DEEP_SCAN', 'Deep Scan');
  const timer = startTimer('deep-scan');

  try {
    const full = loadFullContextWithAnalysis(ctx.task);
    const analysis = full.projectAnalysis || analyzeProject();

    ctx.project = {
      name: analysis.projectName || 'unknown',
      framework: analysis.framework || 'unknown',
      architecture: analysis.architectureStyle || 'unknown',
      totalFiles: analysis.totalFiles || 0,
      totalLines: analysis.totalLines || 0,
    };

    const feature = resolveFeatureFromTask(ctx.task);
    ctx.featureId = feature.featureId;
    ctx.featureName = feature.featureName;

    console.log(`     Project: ${ctx.project.name}`);
    console.log(`     Framework: ${ctx.project.framework}`);
    console.log(`     Architecture: ${ctx.project.architecture}`);
    console.log(`     Package mgr: ${analysis.packageManager || 'unknown'}`);
    console.log(`     Branch: ${ctx.branch}`);
    console.log(`     Files: ~${ctx.project.totalFiles} (${ctx.project.totalLines} lines)`);
    console.log(`     Feature: ${feature.featureId || 'none'} | ${feature.featureName || 'none'}`);
    console.log(`     TODOs: ${analysis.todos?.length || 0} | FIXMEs: ${analysis.fixmes?.length || 0}`);

    ctx.affectedSpecs = full.affected || [];

    ctx.advanceGoalState(GOAL_STATES.ANALYZING);
    ctx.addCheckpoint('repository-analyzed');

    ctx.completePhase('DEEP_SCAN', {
      project: ctx.project,
      featureId: ctx.featureId,
      featureName: ctx.featureName,
      todoCount: analysis.todos?.length || 0,
      fixmeCount: analysis.fixmes?.length || 0,
      affectedSpecs: ctx.affectedSpecs.length,
    });

    logEvent({ type: 'auto-pipeline', phase: 'deep-scan', project: ctx.project.name, framework: ctx.project.framework });
  } catch (e) {
    ctx.failPhase('DEEP_SCAN', e);
    console.log(`     [WARN] Deep scan partial: ${e.message}`);
  }

  record('deep-scan', timer());
  ctx.persist();
  return ctx;
}

/**
 * Phase 2: Discover and score skills. Returns skill list and agent routing.
 *
 * @param {PipelineContext} ctx
 * @returns {PipelineContext}
 */
export function runSkillDiscovery(ctx) {
  const _phase = ctx.startPhase('SKILL_DISCOVERY', 'Skill Discovery');
  const timer = startTimer('skill-discovery');

  try {
    const analysis = analyzeTask(ctx.task);
    const domains = analysis.domains.length ? analysis.domains : ['frontend', 'design'];

    let discoveredSkills = [];
    try { discoveredSkills = discoverSkills(ctx.task, domains, 12, ctx.project); } catch { /* fall through */ }

    const agentRoute = routeAgents(domains, 'standard', ctx.branch, ctx.task);
    const mcpRoute = routeMCP(ctx.task, domains, 'auto');
    const _hooks = routeHooks('auto');
    const _commands = routeCommands('auto', { changeName: ctx.changeName });
    const gates = gatesForPhase('auto');

    ctx.skills = discoveredSkills;
    ctx.agents = agentRoute;

    console.log(`     Intents: ${analysis.intents.join(', ') || '(general)'}`);
    console.log(`     Domains: ${domains.join(', ')}`);
    console.log(`     Skills (${discoveredSkills.length}): ${discoveredSkills.slice(0, 6).join(', ')}${discoveredSkills.length > 6 ? ` +${discoveredSkills.length - 6} more` : ''}`);
    console.log(`     Agents: ${agentRoute.primaryAgent}${agentRoute.supportAgents?.length ? ` + [${agentRoute.supportAgents.join(', ')}]` : ''}`);
    console.log(`     MCPs: ${mcpRoute.mcpServers?.join(', ') || 'none'}`);
    console.log(`     Gates: ${gates.join(' → ')}`);

    ctx.completePhase('SKILL_DISCOVERY', {
      intents: analysis.intents,
      domains,
      skillCount: discoveredSkills.length,
      skills: discoveredSkills,
      primaryAgent: agentRoute.primaryAgent,
      mcpServers: mcpRoute.mcpServers,
      gates,
    });

    logEvent({ type: 'auto-pipeline', phase: 'skill-discovery', skills: discoveredSkills.length, agent: agentRoute.primaryAgent });

    // ── Evolve: record pattern for skill evolution ──
    try { recordPattern(ctx.task, domains, discoveredSkills, true); } catch { /* best-effort */ }
  } catch (e) {
    ctx.failPhase('SKILL_DISCOVERY', e);
    console.log(`     [WARN] Skill discovery partial: ${e.message}`);
  }

  record('skill-discovery', timer());
  ctx.persist();
  return ctx;
}

/**
 * Phase 3: Explore. The AI agent MUST call this and read the output.
 * Returns specs, features, pages, and affected specs for the agent to understand.
 *
 * @param {PipelineContext} ctx
 * @returns {Promise<PipelineContext>}
 */
export async function runExplore(ctx) {
  const _phase = ctx.startPhase('OPSX_EXPLORE', 'Explore');
  const timer = startTimer('explore');

  try {
    const result = await runOpsxCommand('explore', ctx.changeName, {
      description: ctx.task,
      autoApprove: ctx.autoApprove,
    });

    ctx.completePhase('OPSX_EXPLORE', {
      specsLoaded: result.specsLoaded || 0,
      featuresLoaded: result.featuresLoaded || 0,
      pagesLoaded: result.pagesLoaded || 0,
      affectedCount: (result.affected || []).length,
    });

    logEvent({ type: 'auto-pipeline', phase: 'explore', specsLoaded: result.specsLoaded });
  } catch (e) {
    ctx.failPhase('OPSX_EXPLORE', e);
    console.log(`     [ERROR] Explore failed: ${e.message}`);
  }

  record('explore', timer());
  ctx.persist();
  return ctx;
}

/**
 * Phase 4: Generate proposal, design doc, and task list.
 * The AI agent calls this — it creates real proposal files.
 *
 * @param {PipelineContext} ctx
 * @returns {Promise<PipelineContext>}
 */
export async function runPropose(ctx) {
  const _phase = ctx.startPhase('OPSX_PROPOSE', 'Propose');
  const timer = startTimer('propose');

  try {
    // V11: AI agent writes proposal/design/tasks directly via Edit/Write tools.
    // The JS runtime invokes the propose pipeline for structural validation only.
    // If artifacts already exist (re-entry), skip regeneration.
    const changeDir = resolve(ROOT, 'openspec', 'changes', ctx.changeName);
    const proposalExists = existsSync(resolve(changeDir, 'proposal.md'));
    const designExists = existsSync(resolve(changeDir, 'design.md'));
    const tasksExist = existsSync(resolve(changeDir, 'tasks.md'));

    if (proposalExists && designExists && tasksExist) {
      console.log('     Artifacts already exist — preserving existing content.');
    }

    const result = await runOpsxCommand('propose', ctx.changeName, {
      description: ctx.task,
      autoApprove: ctx.autoApprove,
    });

    ctx.advanceGoalState(GOAL_STATES.PROPOSING);
    ctx.addCheckpoint('proposal-created');

    ctx.completePhase('OPSX_PROPOSE', {
      proposalPath: result.proposalPath,
      designPath: result.designPath,
      tasksPath: result.tasksPath,
      affected: result.affected || [],
      skills: result.skills || [],
    });

    logEvent({ type: 'auto-pipeline', phase: 'propose', paths: [result.proposalPath, result.designPath, result.tasksPath] });
  } catch (e) {
    ctx.failPhase('OPSX_PROPOSE', e);
    console.log(`     [FATAL] Proposal failed: ${e.message}`);
  }

  record('propose', timer());
  ctx.persist();
  return ctx;
}

/**
 * Phase 5: Sync delta specs to main.
 *
 * @param {PipelineContext} ctx
 * @returns {Promise<PipelineContext>}
 */
export async function runSync(ctx) {
  const _phase = ctx.startPhase('OPSX_SYNC', 'Sync');

  const deltaDir = resolve(ROOT, 'openspec', 'changes', ctx.changeName, 'specs');
  if (!existsSync(deltaDir)) {
    ctx.completePhase('OPSX_SYNC', { synced: 0, note: 'no delta specs to sync' });
    ctx.persist();
    return ctx;
  }

  const timer = startTimer('sync');
  try {
    const result = await runOpsxCommand('sync', ctx.changeName, {
      description: ctx.task,
      autoApprove: ctx.autoApprove,
    });

    ctx.completePhase('OPSX_SYNC', {
      synced: result.syncResult?.synced?.length || 0,
      specs: result.syncResult?.synced?.map((s) => s.spec) || [],
    });

    logEvent({ type: 'auto-pipeline', phase: 'sync', synced: result.syncResult?.synced?.length || 0 });
  } catch (e) {
    ctx.failPhase('OPSX_SYNC', e);
    console.log(`     [WARN] Sync failed (non-blocking): ${e.message}`);
  }

  record('sync', timer());
  ctx.persist();
  return ctx;
}

/**
 * Phase 6: Apply — execute build pipeline.
 * The AI agent performs the actual code implementation between phases 5 and 6.
 * This function runs the build pipeline and marks apply as done.
 *
 * @param {PipelineContext} ctx
 * @returns {Promise<PipelineContext>}
 */
export async function runApply(ctx) {
  const _phase = ctx.startPhase('OPSX_APPLY', 'Apply');
  const timer = startTimer('apply');

  try {
    // Resolve what needs rebuilding from affected specs
    const affected = ctx.phaseResults?.OPSX_PROPOSE?.affected || [];
    if (affected.length > 0) {
      try {
        const filePaths = affected
          .filter((a) => typeof a === 'string')
          .map((a) => String(a));
        if (filePaths.length > 0) {
          const { pagesToRebuild, reason } = resolveDependencies(filePaths);
          console.log(`     Rebuilding ${pagesToRebuild.length} page(s): ${reason}`);
        }
      } catch { /* dependency resolution is advisory only */ }
    }

    const result = await runOpsxCommand('apply', ctx.changeName, {
      description: ctx.task,
      autoApprove: ctx.autoApprove,
    });

    ctx.advanceGoalState(GOAL_STATES.IMPLEMENTING);
    ctx.addCheckpoint('implementation-complete');

    ctx.completePhase('OPSX_APPLY', {
      batches: result.batches?.length || 0,
      pipelineSuccess: result.pipelineResult?.success || false,
    });

    // ── Evolve: record successful implementation pattern ──
    try {
      const analysis = analyzeTask(ctx.task);
      recordPattern(ctx.task, analysis.domains, ctx.skills || [], true);
    } catch { /* best-effort */ }

    logEvent({ type: 'auto-pipeline', phase: 'apply', batches: result.batches?.length || 0 });
  } catch (e) {
    ctx.failPhase('OPSX_APPLY', e);
    console.log(`     [FATAL] Apply failed: ${e.message}`);
  }

  record('apply', timer());
  ctx.persist();
  return ctx;
}

/**
 * Phase 7: Validate — build + lint + tests + quality gates.
 * Runs real build and validation commands.
 *
 * @param {PipelineContext} ctx
 * @returns {PipelineContext}
 */
export async function runValidate(ctx) {
  if (ctx.skipBuild) {
    ctx.completePhase('VALIDATE', { passed: true, note: 'Build skipped (--skip-build)' });
    return ctx;
  }

  const _phase = ctx.startPhase('VALIDATE', 'Validate');
  const timer = startTimer('validate');
  const failures = [];

  // Build
  try {
    console.log('     Building...');
    const buildResult = runBuild();
    if (buildResult.ok) {
      console.log('     ✓ Build passed');
    } else {
      failures.push(`Build: ${buildResult.stderr?.slice(0, 120)}`);
      console.log(`     ✗ Build failed: ${buildResult.stderr?.slice(0, 80)}`);
    }
  } catch { /* covered by runBuild */ }

  // Validate
  try {
    console.log('     Validating...');
    const validateResult = runValidateCmd();
    if (validateResult.ok) {
      console.log('     ✓ Validate passed');
    } else {
      const msg = (validateResult.stderr || validateResult.stdout || '').slice(0, 200);
      if (msg.includes('error') || msg.includes('ERROR')) {
        failures.push(`Validate: ${msg.slice(0, 120)}`);
        console.log(`     ✗ Validate failed`);
      } else {
        console.log('     ⚠ Validate warnings (non-blocking)');
      }
    }
  } catch { /* covered by runValidateCmd */ }

  // Lint (if available)
  try {
    const pkgPath = resolve(ROOT, 'package.json');
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      const hasLint = pkg.scripts?.['lint:all'] || pkg.scripts?.lint;
      if (hasLint) {
        const lintResult = runLint();
        if (lintResult.ok) {
          console.log('     ✓ Lint passed');
        } else {
          failures.push(`Lint: ${(lintResult.stderr || '').slice(0, 120)}`);
          console.log('     ✗ Lint failed');
        }
      }
    }
  } catch { /* lint unavailable */ }

  // Tests (if available)
  try {
    const pkgPath = resolve(ROOT, 'package.json');
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      if (pkg.scripts?.test) {
        const testResult = runTest();
        if (testResult.ok) {
          console.log('     ✓ Tests passed');
        } else {
          failures.push(`Tests: ${(testResult.stderr || '').slice(0, 120)}`);
          console.log('     ✗ Tests failed');
        }
      }
    }
  } catch { /* tests unavailable */ }

  // Quality gates
  try {
    const gates = gatesForPhase('auto');
    const gateResult = await runGates(gates, { changeName: ctx.changeName });
    if (gateResult.allPassed) {
      console.log(`     ✓ Quality gates: ${gates.join(' → ')} — PASSED`);
    } else {
      failures.push(`Gate: ${gateResult.failedGate}`);
      console.log(`     ✗ Gate failed: ${gateResult.failedGate}`);
    }
  } catch (e) {
    console.log(`     ⚠ Gates unavailable: ${e.message?.slice(0, 80)}`);
  }

  // L1-L7 validation pipeline (deeper checks)
  try {
    console.log('     Running L1-L7 validation pipeline...');
    const levels = [1, 2, 3, 4, 5];
    if (ctx.branch === 'main') levels.push(6, 7);
    const vResult = await runValidations(levels);
    if (vResult.failed.length > 0) {
      failures.push(`Validation L${vResult.failed.join(', L')}`);
    }
    console.log(`     ✓ L1-L7: ${vResult.passed.length} passed, ${vResult.failed.length} failed, ${vResult.skipped.length} skipped`);
  } catch (e) {
    console.log(`     ⚠ L1-L7 pipeline unavailable: ${e.message?.slice(0, 80)}`);
  }

  // Visual verification (starts dev server, runs page checks)
  try {
    console.log('     Running visual verification...');
    const distExists = existsSync(resolve(ROOT, 'dist', 'index.html'));
    if (distExists) {
      const server = await startDevServer(3000);
      if (server.started) {
        const pages = (ctx.affectedSpecs || []).length > 0 ? ['/'] : ['/'];
        const vResult = await verifyAll(pages, 3000, 2);
        await stopDevServer();
        if (vResult.finalPassed) {
          console.log('     ✓ Visual verification passed');
        } else {
          console.log(`     ⚠ Visual verification: ${vResult.totalIssues} issue(s) across ${vResult.iterations} iteration(s)`);
        }
      }
    }
  } catch (e) {
    console.log(`     ⚠ Visual verification unavailable: ${e.message?.slice(0, 80)}`);
  }

  const passed = failures.length === 0;
    ctx.validation = { passed, failures };

  if (passed) {
    ctx.advanceGoalState(GOAL_STATES.VALIDATING);
    ctx.addCheckpoint('validation-passed');
    ctx.completePhase('VALIDATE', { passed: true, failures: [] });
  } else {
    ctx.failPhase('VALIDATE', failures.join('; '), { passed: false, failures });
  }

  record('validate', timer());
  ctx.persist();
  return ctx;
}

/**
 * Phase 8: Archive — sync specs, trace, docs, save state.
 *
 * @param {PipelineContext} ctx
 * @returns {Promise<PipelineContext>}
 */
export async function runArchive(ctx) {
  const _phase = ctx.startPhase('OPSX_ARCHIVE', 'Archive');
  const timer = startTimer('archive');

  try {
    const result = await runOpsxCommand('archive', ctx.changeName, {
      description: ctx.task,
      autoApprove: ctx.autoApprove,
    });

    ctx.advanceGoalState(GOAL_STATES.ARCHIVING);
    ctx.addCheckpoint('archive-complete');

    ctx.completePhase('OPSX_ARCHIVE', {
      synced: result.syncResult?.synced?.length || 0,
      traced: !!result.traceResult,
      docs: !!result.docResult,
    });

    logEvent({ type: 'auto-pipeline', phase: 'archive', synced: result.syncResult?.synced?.length || 0 });
  } catch (e) {
    ctx.failPhase('OPSX_ARCHIVE', e);
    console.log(`     [WARN] Archive partial: ${e.message}`);
  }

  record('archive', timer());
  ctx.persist();
  return ctx;
}

/**
 * Post-archive verification: checks all 14 completion criteria.
 * Outputs a verification report and returns pass/fail.
 * @param {PipelineContext} ctx
 * @returns {{allPassed: boolean, checks: Array<{label: string, passed: boolean}>}}
 */
function verifyCompletion(ctx) {
  const changeRoot = resolve(ROOT, 'openspec', 'changes', ctx.changeName);
  const stateRoot = resolve(ROOT, 'orchestrate', '.state');

  const checks = [
    { label: 'Repository analyzed',          passed: !!(ctx.project && ctx.project.name !== 'unknown') },
    { label: 'Task understood',              passed: !!(ctx.task && ctx.phases.length > 0) },
    { label: 'Skills loaded',                passed: !!(ctx.skills && ctx.skills.length > 0) },
    { label: 'Agents selected',              passed: !!(ctx.agents && ctx.agents.primaryAgent) },
    { label: 'Explore completed',            passed: ctx.phases.some((p) => p.id === 'OPSX_EXPLORE' && p.status === 'complete') },
    { label: 'Proposal completed',           passed: existsSync(resolve(changeRoot, 'proposal.md')) && ctx.phases.some((p) => p.id === 'OPSX_PROPOSE' && p.status === 'complete') },
    { label: 'Sync completed',               passed: ctx.phases.some((p) => p.id === 'OPSX_SYNC' && (p.status === 'complete' || p.status === 'skipped')) },
    { label: 'Apply completed',              passed: ctx.phases.some((p) => p.id === 'OPSX_APPLY' && p.status === 'complete') },
    { label: 'Validation completed',         passed: ctx.phases.some((p) => p.id === 'VALIDATE' && (p.status === 'complete' || p.status === 'failed')) },
    { label: 'Archive completed',            passed: ctx.phases.some((p) => p.id === 'OPSX_ARCHIVE' && p.status === 'complete') },
    { label: 'Proposal artifact exists',     passed: existsSync(resolve(changeRoot, 'proposal.md')) },
    { label: 'Design artifact exists',       passed: existsSync(resolve(changeRoot, 'design.md')) },
    { label: 'Tasks artifact exists',        passed: existsSync(resolve(changeRoot, 'tasks.md')) },
    { label: 'Execution log exists',         passed: existsSync(resolve(stateRoot, `${ctx.executionId}-context.json`)) },
  ];

  const allPassed = checks.every((c) => c.passed);
  const failedChecks = checks.filter((c) => !c.passed);

  console.log('');
  console.log('  ── Post-Archive Verification ──');
  checks.forEach((c) => console.log(`    ${c.passed ? '\u2713' : '\u2717'} ${c.label}`));
  console.log(`  Result: ${allPassed ? 'ALL PASSED' : `${failedChecks.length} FAILED`}`);

  ctx.verification = { allPassed, checks: checks.map((c) => ({ label: c.label, passed: c.passed })) };
  return ctx.verification;
}

/**
 * Finalize the pipeline and produce the completion report.
 * Must be called after all phases.
 *
 * @param {PipelineContext} ctx
 * @returns {object} Final report
 */
export function finishPipeline(ctx) {
  const passed = ctx.phases.filter((p) => p.status === 'complete').length;
  const failed = ctx.phases.filter((p) => p.status === 'failed').length;
  const total = ctx.phases.length;
  const goalMet = ctx.isGoalMet();

  if (goalMet) ctx.advanceGoalState(GOAL_STATES.COMPLETE);
  else if (failed > 0 && !ctx.canContinue()) ctx.advanceGoalState(GOAL_STATES.FAILED);

  const status = ctx.goalState === GOAL_STATES.COMPLETE ? 'done'
    : ctx.goalState === GOAL_STATES.FAILED ? 'failed' : 'issues-found';

  ctx.finalize(status);
  savePipelineState(ctx);
  writeExecutionSummary(ctx);

  // ── Compose final report ──
  const report = ctx.summary();
  report.project = ctx.project;
  report.agents = ctx.agents ? { primary: ctx.agents.primaryAgent, support: ctx.agents.supportAgents } : {};
  report.validation = ctx.validation;
  report.timestamp = new Date().toISOString();
  report.goalState = ctx.goalState;
  report.iterationCount = ctx.iterationCount;

  // ── Export telemetry ──
  report.metrics = exportMetrics(ctx.executionId);

  // ── Progress measurement ──
  measureProgress(ctx);
  console.log(progressSummary(ctx));

  // ── Post-archive verification ──
  verifyCompletion(ctx);

  // ── Recovery guidance on failure ──
  if (failed > 0 || ctx.goalState === GOAL_STATES.FAILED) {
    const recovery = writeRecoveryGuidance(ctx);
    if (recovery.recoveryFile) {
      console.log('');
      console.log('  ── Recovery Guide ──');
      console.log(`  Saved to: ${recovery.recoveryFile}`);
      if (recovery.commands.length) {
        console.log('  Suggested fix commands:');
        recovery.commands.forEach((c) => console.log(`    ${c}`));
      }
    }
  }

  console.log('');
  console.log('─'.repeat(62));
  const stateLabel = ctx.goalState === GOAL_STATES.COMPLETE ? 'GOAL ACHIEVED'
    : ctx.goalState === GOAL_STATES.FAILED ? 'FAILED' : 'PARTIAL (iterate to continue)';
  console.log(`  Status: ${stateLabel}`);
  console.log(`  Iterations: ${ctx.iterationCount}`);
  console.log(`  Phases: ${passed} passed, ${failed} failed / ${total} total`);
  console.log(`  Duration: ${(ctx.totalDuration / 1000).toFixed(1)}s`);
  console.log('═'.repeat(62));
  console.log('');

  logEvent({ type: 'auto-pipeline', phase: 'complete', task: ctx.task, status, duration: ctx.totalDuration, iterations: ctx.iterationCount, goalState: ctx.goalState });

  return report;
}

/**
 * Get a phase-specific instruction prompt for the AI agent.
 * The agent reads this to know exactly what to do in the current phase.
 *
 * @param {PipelineContext} ctx
 * @param {string} phaseId
 * @returns {string}
 */
export function getPhaseInstructions(ctx, phaseId) {
  switch (phaseId) {
    case 'OPSX_EXPLORE':
      return [
        '## Explore Phase',
        `Task: ${ctx.task}`,
        `Change: ${ctx.changeName}`,
        '',
        'Read ALL specs from openspec/specs/ that are affected by this task.',
        `Affected specs: ${ctx.affectedSpecs.map((a) => a.specName).join(', ') || 'auto-detect'}`,
        'Read features/features.json for feature context.',
        'Read site.json for page inventory and company data.',
        'Read DESIGN.md/ for design system rules.',
        '',
        'Produce a summary of what exists and what needs to change.',
      ].join('\n');

    case 'OPSX_PROPOSE':
      return [
        '## Propose Phase',
        `Task: ${ctx.task}`,
        `Change: ${ctx.changeName}`,
        `Skills: ${ctx.skills.join(', ')}`,
        `Agent: ${ctx.agents?.primaryAgent || 'code-reviewer'}`,
        '',
        'Write a complete proposal to:',
        `  openspec/changes/${ctx.changeName}/proposal.md`,
        `  openspec/changes/${ctx.changeName}/design.md`,
        `  openspec/changes/${ctx.changeName}/tasks.md`,
        '',
        'The proposal must include: affected specs, scope, approach, and verification steps.',
        'The design must reference DESIGN.md/ rules (CSS vars, typography, spacing, colors).',
        'The tasks must be concrete, ordered, checkbox-format.',
        '',
        'Create delta specs in:',
        `  openspec/changes/${ctx.changeName}/specs/`,
      ].join('\n');

    case 'OPSX_APPLY':
      return [
        '## Apply Phase',
        `Task: ${ctx.task}`,
        `Change: ${ctx.changeName}`,
        `Skills: ${ctx.skills.join(', ')}`,
        '',
        'Implement all tasks from:',
        `  openspec/changes/${ctx.changeName}/tasks.md`,
        '',
        'Follow design rules from DESIGN.md/ EXACTLY:',
        '  - Use CSS variables (var(--*)) for all colors',
        '  - Use var(--gap-*) for spacing',
        '  - Use .display, h1-h6, .lead, .body typography classes',
        '  - Never hardcode company info (use {{PHONE}}, {{EMAIL}}, {{YEAR}})',
        '  - Include nav/footer via <!-- INCLUDE: nav --> and <!-- INCLUDE: footer -->',
        '',
        'Build and validate after each file change:',
        '  npm run build && npm run validate',
      ].join('\n');

    default:
      return `Phase: ${phaseId} — proceed with execution.`;
  }
}

/**
 * Phase map: which phases are fatal and which are optional.
 * Fatal = if this phase fails, the pipeline stops.
 */
const PHASE_IS_FATAL = {
  DEEP_SCAN: false,
  SKILL_DISCOVERY: false,
  OPSX_EXPLORE: false,
  OPSX_PROPOSE: true,
  OPSX_SYNC: false,
  OPSX_APPLY: true,
  VALIDATE: false,
  OPSX_ARCHIVE: false,
};

/**
 * Autonomous full pipeline runner — chains ALL phases sequentially
 * without stopping. Returns when all phases complete or a fatal phase fails.
 * Uses hook-engine lifecycle events, emits progress, and persists state.
 *
 * @param {string} taskDescription
 * @param {object} [opts]
 * @returns {Promise<PipelineContext>}
 */
export async function autoFullPipeline(taskDescription, opts = {}) {
  const ctx = initPipeline(taskDescription, opts);

  // Initialize the capability registry (agents, skills, MCPs, hooks, commands)
  try { await buildRegistry(); } catch { /* registry optional — fallback routes exist */ }

  if (opts.dryRun) {
    runDeepScan(ctx);
    runSkillDiscovery(ctx);
    ctx.advanceGoalState(GOAL_STATES.COMPLETE);
    ctx.finalize('dry-run');
    finishPipeline(ctx);
    return ctx;
  }

  emit('auto:pipeline:start', { task: taskDescription, executionId: ctx.executionId });

  // ── Phase runner helper (V11: iteration-aware) ──
  const runPhase = async (phaseFn, phaseId) => {
    const idx = ctx.phases.length + 1;
    const total = 8;
    const label = PHASE_ORDER.find((p) => p.id === phaseId)?.label || phaseId;
    const phaseSlug = phaseId.toLowerCase().replace('opsx_', '');
    console.log(`\n[${idx}/${total}] ${label}  [iteration ${ctx.iterationCount}]`);
    console.log('  Running...');

    ctx.iterationCount++;

    try {
      executeLifecycle(`pre-${phaseSlug}`, { task: taskDescription, executionId: ctx.executionId });
    } catch { /* hook failure should not block */ }

    emit('auto:pipeline:phase', { phase: phaseId, label, status: 'running', iteration: ctx.iterationCount });

    let err = null;
    try {
      await phaseFn(ctx);
    } catch (e) {
      err = e;
    }

    try {
      executeLifecycle(`post-${phaseSlug}`, { task: taskDescription, executionId: ctx.executionId });
    } catch { /* hook failure should not block */ }

    const phase = ctx.phases.find((p) => p.id === phaseId);
    const status = phase?.status || 'unknown';
    emit('auto:pipeline:phase', { phase: phaseId, label, status, iteration: ctx.iterationCount });
    if (status === 'complete') {
      const dur = phase?.duration ? ` (${(phase.duration / 1000).toFixed(1)}s)` : '';
      console.log(`  \u2713 Completed${dur}`);
    } else if (status === 'failed') {
      console.log(`  \u2717 Failed: ${phase?.error || 'unknown error'}`);
      if (PHASE_IS_FATAL[phaseId]) {
        console.log('  [FATAL] Pipeline cannot continue.');
        throw err || new Error(`Fatal phase ${phaseId} failed`);
      }
      console.log('  [WARN] Non-fatal — continuing.');
    }

    // V11: Safety cap — stop if iteration limit reached
    if (ctx.iterationCount >= ITERATION_LIMIT) {
      console.log(`  [LIMIT] Iteration limit (${ITERATION_LIMIT}) reached.`);
      ctx.advanceGoalState(GOAL_STATES.FAILED);
      throw new Error(`Iteration limit of ${ITERATION_LIMIT} reached`);
    }

    // V12: Staleness detection — stop if no progress across iterations
    const isStale = ctx.checkStaleness();
    if (isStale) {
      console.log(`  [STALE] No progress for ${ctx.staleIterationCount} iterations (${ctx.lastProgressPct}%).`);
      ctx.advanceGoalState(GOAL_STATES.FAILED);
      throw new Error(`Pipeline stalled — no progress for ${ctx.staleIterationCount} iterations at ${ctx.lastProgressPct}%`);
    }
  };

  try {
    await runPhase(() => runDeepScan(ctx), 'DEEP_SCAN');
    await runPhase(() => runSkillDiscovery(ctx), 'SKILL_DISCOVERY');
    await runPhase(runExplore, 'OPSX_EXPLORE');
    await runPhase(runPropose, 'OPSX_PROPOSE');
    await runPhase(runSync, 'OPSX_SYNC');
    await runPhase(runApply, 'OPSX_APPLY');
    await runPhase(runValidate, 'VALIDATE');
    await runPhase(runArchive, 'OPSX_ARCHIVE');
  } catch (e) {
    logEvent({ type: 'auto-pipeline', phase: 'error', error: e.message, executionId: ctx.executionId, iteration: ctx.iterationCount });
  }

  emit('auto:pipeline:end', { status: ctx.status, executionId: ctx.executionId, goalState: ctx.goalState });
  return finishPipeline(ctx);
}

export { SAFETY_RULES, PHASE_ORDER, PipelineContext, slugify, GOAL_STATES, ITERATION_LIMIT };

/**
 * Check if a phase has completed successfully.
 * @param {PipelineContext} ctx
 * @param {string} phaseId
 * @returns {boolean}
 */
export function isPhaseComplete(ctx, phaseId) {
  return ctx.phases.some((p) => p.id === phaseId && p.status === 'complete');
}

/**
 * Check if a phase has failed.
 * @param {PipelineContext} ctx
 * @param {string} phaseId
 * @returns {boolean}
 */
export function isPhaseFailed(ctx, phaseId) {
  return ctx.phases.some((p) => p.id === phaseId && p.status === 'failed');
}

/**
 * Resume a previously persisted pipeline execution from a checkpoint.
 * The AI agent calls this to continue a paused or interrupted run.
 *
 * @param {string} executionId
 * @returns {PipelineContext|null}
 */
export function resumePipeline(executionId) {
  const ctx = PipelineContext.load(executionId);
  if (!ctx) {
    console.log(`No pipeline state found for execution: ${executionId}`);
    return null;
  }

  console.log('');
  console.log('═'.repeat(62));
  console.log(`  /opsx-auto — RESUMING`);
  console.log(`  Execution: ${ctx.executionId}`);
  console.log(`  Goal state: ${ctx.goalState}`);
  console.log(`  Iterations: ${ctx.iterationCount}`);
  console.log(`  Completed phases: ${ctx.phases.filter((p) => p.status === 'complete').length}`);
  console.log('═'.repeat(62));
  console.log('');

  logEvent({ type: 'auto-pipeline', phase: 'resume', executionId, goalState: ctx.goalState });
  return ctx;
}
