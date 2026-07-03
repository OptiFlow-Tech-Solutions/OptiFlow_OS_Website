/**
 * V7: /opsx-auto Master Orchestration Pipeline.
 *
 * 8-phase autonomous execution:
 *   1. DEEP_SCAN     — Read entire codebase + detect project context
 *   2. SKILL_DISCOVERY — Scan global (~271) + project skills, score relevance
 *   3. OPSX_EXPLORE  — Run existing explore workflow
 *   4. OPSX_PROPOSE  — Generate implementation proposal
 *   5. OPSX_SYNC     — Sync delta specs to main (auto-silent)
 *   6. OPSX_APPLY    — Execute implementation
 *   7. VALIDATE      — Build + lint + typecheck + tests + quality gates
 *   8. OPSX_ARCHIVE  — Archive execution with full metadata
 *
 * Each phase is modular. Each OPSX command reuses the existing `runOpsxCommand`
 * implementation. The orchestrator coordinates only — no logic duplication.
 *
 * @module orchestrate/auto-pipeline
 */

import { analyzeTask } from './capability-analyzer.mjs';
import { resolveFeatureFromTask } from './feature-router.mjs';
import { loadFullContextWithAnalysis } from './context-loader.mjs';
import { routeTask, routeBySpecs } from './skill-router.mjs';
import { routeAgents } from './agent-router.mjs';
import { routeMCP } from './mcp-router.mjs';
import { routeHooks } from './hook-router.mjs';
import { routeCommands } from './command-router.mjs';
import { runOpsxCommand } from './opsx-commands.mjs';
import { runGates, gatesForPhase } from './quality-gate.mjs';
import { startTimer, record } from './metrics.mjs';
import { logEvent } from './audit-log.mjs';
import { emit, registerDefaults } from './event-bus.mjs';
import { saveState } from './state-manager.mjs';
import { getBranch } from './project-scanner.mjs';
import { discoverSkills } from './skill-discovery.mjs';
import { startRun, phaseStart, phaseComplete, phaseFailed, finishRun, getCurrentRun } from './execution-logger.mjs';
import { execSync } from 'node:child_process';
import { resolvePaths } from './config-resolver.mjs';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const { projectRoot } = resolvePaths();
const ROOT = projectRoot;

// ── Execution phases (fixed order) ──
const PHASES = [
  { id: 'DEEP_SCAN',      label: 'Deep Scan' },
  { id: 'SKILL_DISCOVERY', label: 'Skill Discovery' },
  { id: 'OPSX_EXPLORE',   label: 'Explore' },
  { id: 'OPSX_PROPOSE',   label: 'Propose' },
  { id: 'OPSX_SYNC',      label: 'Sync' },
  { id: 'OPSX_APPLY',     label: 'Apply' },
  { id: 'VALIDATE',       label: 'Validate' },
  { id: 'OPSX_ARCHIVE',   label: 'Archive' },
];

// ── Safety: operations prohibited in auto mode ──
const SAFETY_RULES = {
  maxFilesChanged: 200,
  protectedDirs: ['.git', 'node_modules', 'dist', 'orchestrate/.state', 'orchestrate/.cache'],
  neverDelete: ['site.json', 'package.json', 'AGENTS.md', 'DESIGN.md/DESIGN.md'],
};

/**
 * The single entry point for /opsx-auto mode.
 *
 * @param {string} taskDescription — natural language task (e.g. "Build the Pricing Page")
 * @param {object} [opts]
 * @param {boolean} [opts.skipBuild=false] — skip build/validate/test phases
 * @param {boolean} [opts.dryRun=false] — plan only, don't execute
 * @returns {Promise<object>} Full status report
 */
export async function autoFullPipeline(taskDescription, opts = {}) {
  const {
    skipBuild = false,
    dryRun = false,
  } = opts;

  const timer = startTimer('auto-full-pipeline');
  const branch = getBranch();
  const changeName = slugify(taskDescription);
  const executionId = startRun(taskDescription, changeName);

  // ponytail: shared context accumulating phase outputs for downstream reuse
  /** @type {{featureId?: string, featureName?: string, skills?: string[], agents?: object, explore?: object, propose?: object, sync?: object, apply?: object, validation?: object, archive?: object}} */
  const phaseContext = {};

  // ═══════════════════════════════════════════
  // Phase 1: DEEP_SCAN
  // ═══════════════════════════════════════════
  phaseStart('DEEP_SCAN', { task: taskDescription, branch });
  let context;
  let projectAnalysis;
  try {
    context = loadFullContextWithAnalysis(taskDescription);
    projectAnalysis = context.projectAnalysis;

    // Resolve feature context
    const { featureId, featureName, confidence: featureConfidence } = resolveFeatureFromTask(taskDescription);
    phaseContext.featureId = featureId;
    phaseContext.featureName = featureName;

    console.log(`     Project: ${projectAnalysis?.projectName || 'unknown'}`);
    console.log(`     Framework: ${projectAnalysis?.framework || 'unknown'}`);
    console.log(`     Architecture: ${projectAnalysis?.architectureStyle || 'unknown'}`);
    console.log(`     Package mgr: ${projectAnalysis?.packageManager || 'unknown'}`);
    console.log(`     Branch: ${branch}`);
    console.log(`     Files: ~${projectAnalysis?.totalFiles || '?'} (${projectAnalysis?.totalLines || '?'} lines)`);
    console.log(`     Feature: ${featureId} | ${featureName} (${(featureConfidence * 100).toFixed(0)}%)`);
    console.log(`     TODOs: ${projectAnalysis?.todos?.length || 0} | FIXMEs: ${projectAnalysis?.fixmes?.length || 0}`);
    console.log(`     Partial features: ${projectAnalysis?.partialFeatures?.length || 0}`);
    console.log(`     Stale docs: ${projectAnalysis?.staleDocs?.length || 0}`);
    console.log(`     Key dirs: ${(projectAnalysis?.keyDirs || []).join(', ')}`);

    phaseComplete('DEEP_SCAN', {
      projectName: projectAnalysis?.projectName,
      framework: projectAnalysis?.framework,
      totalFiles: projectAnalysis?.totalFiles,
      totalLines: projectAnalysis?.totalLines,
      todoCount: projectAnalysis?.todos?.length || 0,
      fixmeCount: projectAnalysis?.fixmes?.length || 0,
      featureId,
      featureName,
    });
  } catch (e) {
    phaseFailed('DEEP_SCAN', e, { fallback: 'loading basic context' });
    context = loadFullContextWithAnalysis(taskDescription);
  }

  // ═══════════════════════════════════════════
  // Phase 2: SKILL_DISCOVERY
  // ═══════════════════════════════════════════
  phaseStart('SKILL_DISCOVERY');
  const analysis = analyzeTask(taskDescription);

  // Global + project skill discovery
  let discoveredSkills = [];
  try {
    discoveredSkills = discoverSkills(taskDescription, analysis.domains, 12);
  } catch { /* fall through */ }

  // Existing routing as fallback/merge
  let routedSkills = [];
  try {
    const composed = routeTask(taskDescription);
    if (composed) routedSkills = composed;
  } catch { /* empty */ }

  if (!routedSkills.length && context.affected?.length) {
    try {
      const specSkills = routeBySpecs(context.affected);
      if (specSkills) routedSkills = specSkills;
    } catch { /* empty */ }
  }

  // Merge routed first (more precise composition rules), then discovered, deduplicate, keep top 12
  const allSkillNames = [...new Set([...routedSkills, ...discoveredSkills])].slice(0, 12);

  // Agents
  const domains = analysis.domains.length ? analysis.domains : ['frontend', 'design'];
  const agentRoute = routeAgents(domains, 'standard', branch, taskDescription);

  // MCPs
  const mcpRoute = routeMCP(taskDescription, domains, 'auto');

  // Hooks
  const hooks = routeHooks('auto');

  // Commands
  const commands = routeCommands('auto', { changeName });

  // Quality gates
  const gates = gatesForPhase('auto');

  console.log(`     Intents: ${analysis.intents.join(', ') || '(general)'}`);
  console.log(`     Domains: ${domains.join(', ')}`);
  console.log(`     Skills (${allSkillNames.length}): ${allSkillNames.slice(0, 6).join(', ')}${allSkillNames.length > 6 ? ` +${allSkillNames.length - 6} more` : ''}`);
  console.log(`     Agents: ${agentRoute.primaryAgent}${agentRoute.supportAgents.length ? ` + [${agentRoute.supportAgents.join(', ')}]` : ''}`);
  console.log(`     MCPs: ${mcpRoute.mcpServers.join(', ')}`);
  console.log(`     Gates: ${gates.join(' → ')}`);

  phaseComplete('SKILL_DISCOVERY', {
    intents: analysis.intents,
    domains,
    skillCount: allSkillNames.length,
    skills: allSkillNames,
    primaryAgent: agentRoute.primaryAgent,
    supportAgents: agentRoute.supportAgents,
    mcpServers: mcpRoute.mcpServers,
    gates,
  });

  // Store in shared context
  phaseContext.skills = allSkillNames;
  phaseContext.agents = agentRoute;

  if (dryRun) {
    console.log('\n[Dry Run] Planning complete.');
    const plan = {
      version: '7.0', command: 'auto', executionId, changeName, branch,
      timestamp: new Date().toISOString(),
      analysis,
      project: {
        name: projectAnalysis?.projectName,
        framework: projectAnalysis?.framework,
        architecture: projectAnalysis?.architectureStyle,
      },
      capabilities: {
        skills: allSkillNames,
        agents: agentRoute,
        mcpServers: mcpRoute.mcpServers,
        hooks,
        commands,
        gates,
      },
    };
    saveState(`auto-plan-${changeName}`, plan);
    logEvent({ type: 'auto-pipeline', phase: 'plan', task: taskDescription, dryRun: true });
    await emit('auto:pipeline:end', { plan, dryRun: true });
    finishRun('planned');
    return { status: 'planned', plan };
  }

  // ═══════════════════════════════════════════
  // Phase 3: OPSX_EXPLORE
  // ═══════════════════════════════════════════
  phaseStart('OPSX_EXPLORE');
  let exploreResult;
  try {
    exploreResult = await runOpsxCommand('explore', changeName, {
      description: taskDescription,
      autoApprove: true,
    });
    phaseComplete('OPSX_EXPLORE', {
      specsLoaded: exploreResult?.loadedSpecs?.size || 0,
    });
    phaseContext.explore = exploreResult;
  } catch (e) {
    phaseFailed('OPSX_EXPLORE', e);
    logEvent({ type: 'auto-pipeline', phase: 'explore', status: 'failed', error: e.message });
  }

  // ═══════════════════════════════════════════
  // Phase 4: OPSX_PROPOSE
  // ═══════════════════════════════════════════
  phaseStart('OPSX_PROPOSE');
  let proposeResult;
  try {
    proposeResult = await runOpsxCommand('propose', changeName, {
      description: taskDescription,
      autoApprove: true,
    });
    phaseComplete('OPSX_PROPOSE', {
      proposalPath: proposeResult?.proposalPath,
      tasksPath: proposeResult?.tasksPath,
    });
    phaseContext.propose = proposeResult;
  } catch (e) {
    phaseFailed('OPSX_PROPOSE', e);
    logEvent({ type: 'auto-pipeline', phase: 'propose', status: 'failed', error: e.message });
    // Bail out: without a proposal, subsequent phases cannot function
    console.log('     [FATAL] Proposal failed — stopping pipeline.');
    return await buildReport('failed', { fatalPhase: 'OPSX_PROPOSE', error: e.message });
  }

  // ═══════════════════════════════════════════
  // Phase 5: OPSX_SYNC (auto-silent merge)
  // ═══════════════════════════════════════════
  phaseStart('OPSX_SYNC');
  let syncResult;
  const deltaDir = resolve(ROOT, 'openspec', 'changes', changeName, 'specs');
  if (existsSync(deltaDir)) {
    try {
      syncResult = await runOpsxCommand('sync', changeName, {
        description: taskDescription,
        autoApprove: true,
      });
      const syncedCount = syncResult?.syncResult?.synced?.length || 0;
      phaseComplete('OPSX_SYNC', { specCount: syncedCount });
      phaseContext.sync = syncResult;
    } catch (e) {
      phaseFailed('OPSX_SYNC', e);
    }
  } else {
    phaseComplete('OPSX_SYNC', { specCount: 0, note: 'no delta specs to sync' });
  }

  // ═══════════════════════════════════════════
  // Phase 6: OPSX_APPLY
  // ═══════════════════════════════════════════
  phaseStart('OPSX_APPLY');
  let applyResult;
  try {
    applyResult = await runOpsxCommand('apply', changeName, {
      description: taskDescription,
      autoApprove: true,
    });
    const batchCount = applyResult?.batches?.length || 0;
    phaseComplete('OPSX_APPLY', { batches: batchCount, success: true });
    phaseContext.apply = applyResult;
  } catch (e) {
    phaseFailed('OPSX_APPLY', e);
    logEvent({ type: 'auto-pipeline', phase: 'apply', status: 'failed', error: e.message });
    // Bail out: apply failure means incomplete implementation
    console.log('     [FATAL] Apply failed — stopping pipeline.');
    return await buildReport('failed', { fatalPhase: 'OPSX_APPLY', error: e.message });
  }

  // ═══════════════════════════════════════════
  // Phase 7: VALIDATE
  // ═══════════════════════════════════════════
  phaseStart('VALIDATE');
  let validationStatus = { passed: true, failures: [] };

  if (!skipBuild) {
    // Build
    try {
      console.log('     Building...');
      execSync('node scripts/assemble.mjs', {
        cwd: ROOT, encoding: 'utf-8', timeout: 60000, stdio: 'pipe',
      });
      console.log('     ✓ Build');
    } catch (e) {
      validationStatus.failures.push(`Build: ${e.message?.slice(0, 120)}`);
      validationStatus.passed = false;
      console.log(`     ✗ Build failed`);
    }

    // Validate
    try {
      console.log('     Validating...');
      execSync('node scripts/validate.mjs', {
        cwd: ROOT, encoding: 'utf-8', timeout: 30000, stdio: 'pipe',
      });
      console.log('     ✓ Validate');
    } catch (e) {
      const stderr = e.stderr || e.stdout || e.message || '';
      if (stderr.includes('error') || stderr.includes('ERROR')) {
        validationStatus.failures.push(`Validate: ${stderr.slice(0, 120)}`);
        validationStatus.passed = false;
        console.log(`     ✗ Validate failed`);
      } else {
        console.log('     ⚠ Validate warnings (non-blocking)');
      }
    }

    // Lint
    let lintAvailable = false;
    try {
      const pkgPath = resolve(ROOT, 'package.json');
      if (existsSync(pkgPath)) {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
        const lintCmd = pkg.scripts?.['lint:all'] ? 'npm run lint:all'
          : pkg.scripts?.lint ? 'npm run lint'
          : null;
        if (lintCmd) {
          lintAvailable = true;
          execSync(lintCmd, { cwd: ROOT, encoding: 'utf-8', timeout: 30000, stdio: 'pipe' });
          console.log('     ✓ Lint');
        }
      }
    } catch (e) {
      if (lintAvailable) {
        validationStatus.failures.push(`Lint: ${(e.stderr || e.message || '').slice(0, 120)}`);
        validationStatus.passed = false;
        console.log('     ✗ Lint failed');
      }
    }

    // Tests
    let testsAvailable = false;
    try {
      const pkgPath = resolve(ROOT, 'package.json');
      if (existsSync(pkgPath)) {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
        if (pkg.scripts?.test) {
          testsAvailable = true;
          execSync('npm test', { cwd: ROOT, encoding: 'utf-8', timeout: 60000, stdio: 'pipe' });
          console.log('     ✓ Tests');
        }
      }
    } catch (e) {
      if (testsAvailable) {
        validationStatus.failures.push(`Tests: ${(e.stderr || e.message || '').slice(0, 120)}`);
        validationStatus.passed = false;
        console.log('     ✗ Tests failed');
      }
    }

    // Quality gates
    try {
      const gateResult = await runGates(gates, { changeName });
      if (gateResult.allPassed) {
        console.log(`     ✓ Gates: ${gates.join(' → ')} — PASSED`);
      } else {
        validationStatus.failures.push(`Gate: ${gateResult.failedGate}`);
        console.log(`     ✗ Gate failed: ${gateResult.failedGate}`);
      }
    } catch (e) {
      console.log(`     ⚠ Gates unavailable: ${e.message?.slice(0, 80)}`);
    }
  } else {
    console.log('     (Build skipped)');
  }

  if (validationStatus.passed) {
    phaseComplete('VALIDATE', validationStatus);
  } else {
    phaseFailed('VALIDATE', validationStatus.failures.join('; '), validationStatus);
  }
  phaseContext.validation = validationStatus;

  // ═══════════════════════════════════════════
  // Phase 8: OPSX_ARCHIVE
  // ═══════════════════════════════════════════
  phaseStart('OPSX_ARCHIVE');
  let archiveResult;
  try {
    archiveResult = await runOpsxCommand('archive', changeName, {
      description: taskDescription,
      autoApprove: true,
    });
    phaseComplete('OPSX_ARCHIVE', {
      synced: archiveResult?.syncResult?.synced?.length || 0,
      traced: archiveResult?.traceResult ? true : false,
    });
    phaseContext.archive = archiveResult;
  } catch (e) {
    phaseFailed('OPSX_ARCHIVE', e);
    logEvent({ type: 'auto-pipeline', phase: 'archive', status: 'failed', error: e.message });
  }

  // ═══════════════════════════════════════════
  // Final report
  // ═══════════════════════════════════════════
  return await buildReport('done');

  // ── Report builder (accesses closure scope) ──
  async function buildReport(status, extra = {}) {
    const duration = timer();
    record('auto-full-pipeline', duration);

    const run = getCurrentRun();
    const overallStatus = status === 'done'
      ? (run?.phases.every((p) => p.status !== 'failed') ? 'done' : 'issues-found')
      : status;

    const report = {
      version: '7.0',
      command: 'auto',
      executionId,
      changeName,
      branch,
      task: taskDescription,
      status: overallStatus,
      duration,
      project: {
        name: projectAnalysis?.projectName || 'unknown',
        framework: projectAnalysis?.framework || 'unknown',
        architecture: projectAnalysis?.architectureStyle || 'unknown',
        totalFiles: projectAnalysis?.totalFiles || 0,
        totalLines: projectAnalysis?.totalLines || 0,
        todos: projectAnalysis?.todos?.length || 0,
        fixmes: projectAnalysis?.fixmes?.length || 0,
        partialFeatures: projectAnalysis?.partialFeatures?.length || 0,
      },
      analysis: {
        intents: analysis?.intents || [],
        domains: domains || [],
        confidence: analysis?.confidence || 0,
      },
      capabilities: {
        skills: allSkillNames || [],
        agents: { primary: agentRoute?.primaryAgent || 'unknown', support: agentRoute?.supportAgents || [] },
        mcpServers: mcpRoute?.mcpServers || [],
        hooks: hooks || { preHooks: [], postHooks: [] },
        gates: gates || [],
      },
      lifecycle: run?.phases.map((p) => ({
        name: p.name,
        status: p.status,
        duration: p.duration || 0,
      })) || [],
      validation: validationStatus || { passed: false, failures: [extra.error || 'pipeline aborted'] },
      phaseContext: {
        featureId: phaseContext.featureId,
        featureName: phaseContext.featureName,
        skillCount: phaseContext.skills?.length || 0,
      },
      ...extra,
      timestamp: new Date().toISOString(),
    };

    saveState(`auto-full-${changeName}`, report);
    logEvent({ type: 'auto-pipeline', phase: 'complete', task: taskDescription, duration, status: overallStatus });
    await emit('auto:pipeline:end', { report });
    finishRun(overallStatus);

    return report;
  }
}

// ── Helpers ──

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 40)
    .replace(/^-+|-+$/g, '');
}

// Re-export for backward compatibility
export { SAFETY_RULES, PHASES };

// Register event bus listeners so emit calls produce audit logs
registerDefaults((event) => logEvent({ type: 'event-bus', ...event }));
