/**
 * V8: /opsx-auto State-Machine Orchestration Engine.
 *
 * This is a LIBRARY — the AI agent drives it. The agent calls methods
 * between phases to track state, get context, and run non-AI tasks.
 *
 * Architecture:
 *   PipelineContext (shared state) → Phase methods (do real work) → Report
 *
 * Phases the AI must execute sequentially:
 *   1. DEEP_SCAN       — analyzeProject() + loadFullContextWithAnalysis()
 *   2. SKILL_DISCOVERY — discoverSkills() + routeAgents()
 *   3. OPSX_EXPLORE    — runOpsxCommand('explore') — AI reads specs/features/pages
 *   4. OPSX_PROPOSE    — runOpsxCommand('propose') — AI writes proposal + design + tasks
 *   5. OPSX_SYNC       — runOpsxCommand('sync') — auto-merge delta specs
 *   6. OPSX_APPLY      — runOpsxCommand('apply') — AI implements tasks
 *   7. VALIDATE        — build + lint + tests + quality gates
 *   8. OPSX_ARCHIVE    — runOpsxCommand('archive') — spec sync + trace + doc sync
 *
 * @module orchestrate/auto-pipeline
 */

import { PipelineContext, slugify } from './pipeline-context.mjs';
import { analyzeProject } from './project-analyzer.mjs';
import { loadFullContextWithAnalysis } from './context-loader.mjs';
import { discoverSkills, getDiscoveredSkillMetadata } from './skill-discovery.mjs';
import { analyzeTask } from './capability-analyzer.mjs';
import { routeAgents } from './agent-router.mjs';
import { routeMCP } from './mcp-router.mjs';
import { routeHooks } from './hook-router.mjs';
import { routeCommands } from './command-router.mjs';
import { gatesForPhase, runGates } from './quality-gate.mjs';
import { resolveFeatureFromTask } from './feature-router.mjs';
import { runOpsxCommand } from './opsx-commands.mjs';
import { getBranch } from './project-scanner.mjs';
import { savePipelineState, writeExecutionSummary } from './state-manager.mjs';
import { startTimer, record } from './metrics.mjs';
import { logEvent } from './audit-log.mjs';
import { emit, registerDefaults } from './event-bus.mjs';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';

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
  const ctx = new PipelineContext(taskDescription, opts);
  ctx.branch = getBranch();
  ctx.persist();

  console.log('');
  console.log('═'.repeat(62));
  console.log(`  /opsx-auto — Master Orchestration`);
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
  const phase = ctx.startPhase('DEEP_SCAN', 'Deep Scan');
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
  const phase = ctx.startPhase('SKILL_DISCOVERY', 'Skill Discovery');
  const timer = startTimer('skill-discovery');

  try {
    const analysis = analyzeTask(ctx.task);
    const domains = analysis.domains.length ? analysis.domains : ['frontend', 'design'];

    let discoveredSkills = [];
    try { discoveredSkills = discoverSkills(ctx.task, domains, 12); } catch { /* fall through */ }

    const agentRoute = routeAgents(domains, 'standard', ctx.branch, ctx.task);
    const mcpRoute = routeMCP(ctx.task, domains, 'auto');
    const hooks = routeHooks('auto');
    const commands = routeCommands('auto', { changeName: ctx.changeName });
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
  const phase = ctx.startPhase('OPSX_EXPLORE', 'Explore');
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
  const phase = ctx.startPhase('OPSX_PROPOSE', 'Propose');
  const timer = startTimer('propose');

  try {
    const result = await runOpsxCommand('propose', ctx.changeName, {
      description: ctx.task,
      autoApprove: ctx.autoApprove,
    });

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
  const phase = ctx.startPhase('OPSX_SYNC', 'Sync');

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
  const phase = ctx.startPhase('OPSX_APPLY', 'Apply');
  const timer = startTimer('apply');

  try {
    const result = await runOpsxCommand('apply', ctx.changeName, {
      description: ctx.task,
      autoApprove: ctx.autoApprove,
    });

    ctx.completePhase('OPSX_APPLY', {
      batches: result.batches?.length || 0,
      pipelineSuccess: result.pipelineResult?.success || false,
    });

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

  const phase = ctx.startPhase('VALIDATE', 'Validate');
  const timer = startTimer('validate');
  const failures = [];

  // Build
  try {
    console.log('     Building...');
    execSync('node scripts/assemble.mjs', {
      cwd: ROOT, encoding: 'utf-8', timeout: 60000, stdio: 'pipe',
    });
    console.log('     ✓ Build passed');
  } catch (e) {
    failures.push(`Build: ${e.message?.slice(0, 120)}`);
    console.log(`     ✗ Build failed: ${e.message?.slice(0, 80)}`);
  }

  // Validate
  try {
    console.log('     Validating...');
    execSync('node scripts/validate.mjs', {
      cwd: ROOT, encoding: 'utf-8', timeout: 30000, stdio: 'pipe',
    });
    console.log('     ✓ Validate passed');
  } catch (e) {
    const msg = (e.stderr || e.stdout || e.message || '').slice(0, 200);
    if (msg.includes('error') || msg.includes('ERROR')) {
      failures.push(`Validate: ${msg.slice(0, 120)}`);
      console.log(`     ✗ Validate failed`);
    } else {
      console.log('     ⚠ Validate warnings (non-blocking)');
    }
  }

  // Lint (if available)
  let lintRan = false;
  try {
    const pkgPath = resolve(ROOT, 'package.json');
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      const lintCmd = pkg.scripts?.['lint:all']
        ? 'npm run lint:all'
        : pkg.scripts?.lint
          ? 'npm run lint'
          : null;
      if (lintCmd) {
        lintRan = true;
        execSync(lintCmd, { cwd: ROOT, encoding: 'utf-8', timeout: 30000, stdio: 'pipe' });
        console.log('     ✓ Lint passed');
      }
    }
  } catch (e) {
    if (lintRan) {
      failures.push(`Lint: ${(e.stderr || e.message || '').slice(0, 120)}`);
      console.log('     ✗ Lint failed');
    }
  }

  // Tests (if available)
  let testsRan = false;
  try {
    const pkgPath = resolve(ROOT, 'package.json');
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      if (pkg.scripts?.test) {
        testsRan = true;
        execSync('npm test', { cwd: ROOT, encoding: 'utf-8', timeout: 60000, stdio: 'pipe' });
        console.log('     ✓ Tests passed');
      }
    }
  } catch (e) {
    if (testsRan) {
      failures.push(`Tests: ${(e.stderr || e.message || '').slice(0, 120)}`);
      console.log('     ✗ Tests failed');
    }
  }

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

  const passed = failures.length === 0;
  ctx.validation = { passed, failures };

  if (passed) {
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
  const phase = ctx.startPhase('OPSX_ARCHIVE', 'Archive');
  const timer = startTimer('archive');

  try {
    const result = await runOpsxCommand('archive', ctx.changeName, {
      description: ctx.task,
      autoApprove: ctx.autoApprove,
    });

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
  const status = failed > 0 ? 'issues-found' : 'done';

  ctx.finalize(status);
  savePipelineState(ctx);
  writeExecutionSummary(ctx);

  console.log('');
  console.log('─'.repeat(62));
  console.log(`  Status: ${status === 'done' ? 'COMPLETE' : 'PARTIAL'}`);
  console.log(`  Phases: ${passed} passed, ${failed} failed / ${total} total`);
  console.log(`  Duration: ${(ctx.totalDuration / 1000).toFixed(1)}s`);
  console.log('═'.repeat(62));
  console.log('');

  logEvent({ type: 'auto-pipeline', phase: 'complete', task: ctx.task, status, duration: ctx.totalDuration });

  const report = ctx.summary();
  report.project = ctx.project;
  report.agents = ctx.agents ? { primary: ctx.agents.primaryAgent, support: ctx.agents.supportAgents } : {};
  report.validation = ctx.validation;
  report.timestamp = new Date().toISOString();

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
 * Legacy: Run the complete pipeline autonomously (for CLI use).
 * @deprecated Use the state-machine API methods above. The AI agent drives execution.
 */
export async function autoFullPipeline(taskDescription, opts = {}) {
  const ctx = initPipeline(taskDescription, opts);
  if (opts.dryRun) {
    runDeepScan(ctx);
    runSkillDiscovery(ctx);
    finishPipeline(ctx);
    return ctx.summary();
  }

  runDeepScan(ctx);
  runSkillDiscovery(ctx);
  await runExplore(ctx);
  await runPropose(ctx);
  await runSync(ctx);
  await runApply(ctx);
  await runValidate(ctx);
  await runArchive(ctx);
  return finishPipeline(ctx);
}

export { SAFETY_RULES, PHASE_ORDER, PipelineContext, slugify };
