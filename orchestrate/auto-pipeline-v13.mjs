/**
 * V13: Next-Generation /opsx-auto Autonomous Orchestration Engine.
 *
 * Master orchestration agent that:
 *   - Builds a unified repository snapshot (parallel read-only analysis)
 *   - Composes skills by workflow role (automatic skill intelligence)
 *   - Composes agent teams per lifecycle phase (dynamic agent composition)
 *   - Runs controlled goal-oriented iterations (enter→analyze→plan→execute→validate→decide)
 *   - Validates at each iteration boundary (validation-driven iteration)
 *   - Finishes only after verified completion
 *
 * This is the V13 evolution from the V11 linear waterfall to a true
 * goal-oriented autonomous orchestration engine.
 *
 * Architecture:
 *   Master Agent (/opsx-auto)
 *     ├─ RepositorySnapshot (parallel scan/discovery/index)
 *     ├─ SkillComposer (role-assigned skill groups)
 *     ├─ AgentComposer (phase-assigned agent teams)
 *     ├─ IterationController (goal-oriented loop)
 *     ├─ ExecutionStrategy (adaptive phase planning)
 *     ├─ AgentContracts (formal lifecycle contracts)
 *     └─ PipelineContext (shared memory + state)
 *
 * @module orchestrate/auto-pipeline-v13
 */

import { PipelineContext, slugify, GOAL_STATES, ITERATION_LIMIT } from './pipeline-context.mjs';
import { buildRepositorySnapshot, applySnapshot } from './repository-snapshot.mjs';
import { composeSkills } from './skill-composer.mjs';
import { composeAgentTeam } from './agent-composer.mjs';
import { buildPhasePlan, validatePrerequisites, getContract } from './agent-contracts.mjs';
import { runGoalLoop } from './iteration-controller.mjs';
import { measureProgress, progressSummary, isGoalAchieved } from './progress-tracker.mjs';
import { runOpsxCommand } from './opsx-commands.mjs';
import { getBranch } from './project-scanner.mjs';
import { savePipelineState, writeExecutionSummary, writeRecoveryGuidance } from './state-manager.mjs';
import { startTimer, record, exportMetrics } from './metrics.mjs';
import { logEvent, queryEvents } from './audit-log.mjs';
import { emit, registerDefaults } from './event-bus.mjs';
import { enableAutoApprove } from './human-gate.mjs';
import { resetAllCircuits } from './pipeline-engine.mjs';
import { resolvePaths } from './config-resolver.mjs';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { runValidate as runValidateV12 } from './auto-pipeline.mjs';
import { syncDashboards } from './feature-engine.mjs';
import { recordExecution } from './history-engine.mjs';

const { projectRoot } = resolvePaths();
const ROOT = projectRoot;

registerDefaults((event) => logEvent({ type: 'event-bus', ...event }));

// ─────────────────────────────────────────────────────────
// PHASE EXECUTORS — called by the iteration controller
// ─────────────────────────────────────────────────────────

async function executeExplore(ctx) {
  // V13: Also record findings from the repository snapshot
  if (ctx.repository) {
    ctx.recordFinding('repository', `Project: ${ctx.repository.project.name}, Framework: ${ctx.repository.project.framework}`, 1.0, 'repo-snapshot');
    ctx.recordFinding('affected-specs', `${ctx.affectedSpecs.length} spec(s) affected: ${ctx.affectedSpecs.map((a) => a.specName).join(', ') || 'none'}`, 0.9, 'repo-snapshot');
  }

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

  ctx.advanceGoalState(GOAL_STATES.EXPLORING);
  logEvent({ type: 'auto-pipeline', phase: 'explore', specsLoaded: result.specsLoaded });
  ctx.persist();
}

async function executePropose(ctx) {
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
  ctx.persist();
}

async function executeSync(ctx) {
  const deltaDir = resolve(ROOT, 'openspec', 'changes', ctx.changeName, 'specs');
  if (!existsSync(deltaDir)) {
    ctx.completePhase('OPSX_SYNC', { synced: 0, note: 'no delta specs to sync' });
    ctx.persist();
    return;
  }

  const result = await runOpsxCommand('sync', ctx.changeName, {
    description: ctx.task, autoApprove: ctx.autoApprove,
  });

  ctx.completePhase('OPSX_SYNC', {
    synced: result.syncResult?.synced?.length || 0,
    specs: result.syncResult?.synced?.map((s) => s.spec) || [],
  });

  logEvent({ type: 'auto-pipeline', phase: 'sync', synced: result.syncResult?.synced?.length || 0 });
  ctx.persist();
}

async function executeApply(ctx) {
  const result = await runOpsxCommand('apply', ctx.changeName, {
    description: ctx.task, autoApprove: ctx.autoApprove,
  });

  ctx.advanceGoalState(GOAL_STATES.IMPLEMENTING);
  ctx.addCheckpoint('implementation-complete');

  ctx.completePhase('OPSX_APPLY', {
    batches: result.batches?.length || 0,
    pipelineSuccess: result.pipelineResult?.success || false,
  });

  logEvent({ type: 'auto-pipeline', phase: 'apply', batches: result.batches?.length || 0 });
  ctx.persist();
}

async function executeValidate(ctx) {
  if (ctx.skipBuild) {
    ctx.completePhase('VALIDATE', { passed: true, note: 'Build skipped (--skip-build)' });
    return;
  }

  await runValidateV12(ctx);

  if (!ctx.validation.passed) {
    ctx.recordRisk('Validation failed', 'high',
      `npm run build && npm run validate to fix: ${ctx.validation.failures.join('; ') || 'unknown errors'}`);
  }
}

async function executeVerify(ctx) {
  const result = await runOpsxCommand('verify', ctx.changeName, {
    description: ctx.task, autoApprove: ctx.autoApprove,
  });

  ctx.completePhase('OPSX_VERIFY', {
    pipelineSuccess: result.pipelineResult?.success || false,
    duration: result.pipelineResult?.totalDuration || 0,
  });

  ctx.recordFinding('verify', `Verify pipeline: ${result.pipelineResult?.success ? 'PASSED' : 'FAILED'}`, result.pipelineResult?.success ? 1.0 : 0.5, 'verify-agent');
  logEvent({ type: 'auto-pipeline', phase: 'verify', success: result.pipelineResult?.success });
  ctx.persist();
}

async function executeArchive(ctx) {
  const result = await runOpsxCommand('archive', ctx.changeName, {
    description: ctx.task, autoApprove: ctx.autoApprove,
  });

  ctx.advanceGoalState(GOAL_STATES.ARCHIVING);
  ctx.addCheckpoint('archive-complete');

  // Store commit hash from archive result for history/traceability
  if (result.commitHash) {
    ctx.archiveCommitHash = result.commitHash;
    ctx.archiveTarget = result.archiveTarget;
  }

  ctx.completePhase('OPSX_ARCHIVE', {
    synced: result.syncResult?.synced?.length || 0,
    traced: !!result.traceResult,
    docs: !!result.docResult,
    commitHash: result.commitHash || null,
    archiveTarget: result.archiveTarget || null,
  });

  logEvent({ type: 'auto-pipeline', phase: 'archive', synced: result.syncResult?.synced?.length || 0 });
  ctx.persist();
}

// Built-in phase executors for the iteration controller
const PHASE_EXECUTORS = {
  OPSX_EXPLORE: executeExplore,
  OPSX_PROPOSE: executePropose,
  OPSX_SYNC: executeSync,
  OPSX_APPLY: executeApply,
  VALIDATE: executeValidate,
  OPSX_VERIFY: executeVerify,
  OPSX_ARCHIVE: executeArchive,
};

// ─────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────

/**
 * Initialize the V13 autonomous pipeline.
 * Builds repository snapshot, composes skills and agents,
 * then enters the goal-oriented iteration loop.
 *
 * @param {string} taskDescription
 * @param {{ dryRun?: boolean, skipBuild?: boolean }} [opts]
 * @returns {Promise<import('./pipeline-context.mjs').PipelineContext>}
 */
export async function initPipelineV13(taskDescription, opts = {}) {
  const timer = startTimer('init-pipeline-v13');
  resetAllCircuits();

  const ctx = new PipelineContext(taskDescription, opts);
  ctx.branch = getBranch();
  ctx.advanceGoalState(GOAL_STATES.INIT);

  if (ctx.autoApprove) enableAutoApprove();

  console.log('');
  console.log('\u2550'.repeat(62));
  console.log(`  /opsx-auto V13 \u2014 Autonomous Master Orchestrator`);
  console.log(`  Task: "${taskDescription.slice(0, 70)}"`);
  console.log(`  Execution: ${ctx.executionId}`);
  console.log(`  Branch: ${ctx.branch}`);
  console.log(`  Started: ${ctx.startedAt}`);
  console.log('\u2550'.repeat(62));
  console.log('');

  logEvent({ type: 'auto-pipeline-v13', phase: 'init', task: taskDescription, executionId: ctx.executionId });

  // ── Phase 0: Build unified repository snapshot (parallel analysis) ──
  console.log('[Phase 0] Building repository intelligence snapshot...');
  const snapshot = await buildRepositorySnapshot(taskDescription, ctx.branch);

  // Apply snapshot to context
  applySnapshot(ctx, snapshot);

  // Complete both DEEP_SCAN and SKILL_DISCOVERY phases from snapshot
  ctx.completePhase('DEEP_SCAN', {
    project: snapshot.project,
    featureId: snapshot.featureId,
    featureName: snapshot.featureName,
    affectedSpecs: snapshot.affectedSpecs.length,
  });

  ctx.completePhase('SKILL_DISCOVERY', {
    intents: snapshot.taskAnalysis.intents,
    domains: snapshot.taskAnalysis.domains,
    skillCount: snapshot.skills.length,
    skills: snapshot.skills,
    primaryAgent: snapshot.agents.primaryAgent,
    mcpServers: snapshot.mcpRoute.mcpServers,
    gates: snapshot.gates,
  });

  // ── Phase 0.5: Compose skills by workflow role ──
  const skillComposition = composeSkills(snapshot.skillMetadata, snapshot.taskAnalysis.domains);
  ctx.composedSkills = skillComposition;
  console.log(`     Skill roles: ${Object.entries(skillComposition.bestPerRole)
    .filter(([, s]) => s)
    .map(([role, s]) => `${role}=${s.name}`)
    .join(', ')}`);
  console.log(`     Primary role: ${skillComposition.primaryRole}`);

  // ── Phase 0.6: Compose agent teams per phase ──
  const agentTeams = {};
  for (const { phaseId } of buildPhasePlan(ctx)) {
    agentTeams[phaseId] = composeAgentTeam(phaseId, ctx);
  }
  ctx.agentTeams = agentTeams;
  for (const [phaseId, team] of Object.entries(agentTeams)) {
    console.log(`     ${phaseId}: ${team.primary}${team.support.length ? ` + [${team.support.join(', ')}]` : ''}`);
  }

  ctx.advanceGoalState(GOAL_STATES.ANALYZING);
  record('init-pipeline-v13', timer());
  ctx.persist();

  return ctx;
}

/**
 * Run the V13 autonomous orchestration pipeline.
 * Uses controlled goal-oriented iterations with the iteration controller.
 *
 * @param {string} taskDescription
 * @param {{ dryRun?: boolean, skipBuild?: boolean, planOnly?: boolean }} [opts]
 * @returns {Promise<object>} Final execution report
 */
export async function autoFullPipelineV13(taskDescription, opts = {}) {
  const ctx = await initPipelineV13(taskDescription, opts);

  if (opts.dryRun) {
    ctx.advanceGoalState(GOAL_STATES.COMPLETE);
    ctx.finalize('dry-run');
    return finishPipelineV13(ctx);
  }

  // ── Plan-only mode: execute explore + propose, then stop for human review ──
  if (opts.planOnly || ctx.planOnly) {
    ctx.planOnly = true;
    console.log('');
    console.log('  ── Plan Mode ──');
    console.log('  Stopping after proposal for human review.');
    console.log('  Resume with: /opsx-auto "<same task>"');
    console.log('  Or: node orchestrate/coordinator.mjs "<same task>"');
    console.log('');

    emit('auto:pipeline:v13:start', { task: taskDescription, executionId: ctx.executionId, mode: 'plan' });

    await executeExplore(ctx);
    await executePropose(ctx);

    ctx.advanceGoalState(GOAL_STATES.PROPOSING);
    ctx.recordDecision('plan-mode-stop',
      'Pipeline stopped after PROPOSE for human review. Artifacts generated but no code was changed.',
      ['Review proposal.md, design.md, tasks.md before continuing']);

    emit('auto:pipeline:v13:end', {
      status: 'plan-ready', executionId: ctx.executionId, mode: 'plan',
    });

    return finishPipelineV13(ctx, { iterations: [{ executed: ['OPSX_EXPLORE', 'OPSX_PROPOSE'] }], finalProgress: 40, goalMet: false });
  }

  emit('auto:pipeline:v13:start', { task: taskDescription, executionId: ctx.executionId });

  // ── Run the goal-oriented execution loop ──
  const loopResult = await runGoalLoop(ctx, PHASE_EXECUTORS);

  ctx.recordFinding('execution-complete',
    `Goal ${loopResult.goalMet ? 'achieved' : 'not achieved'} after ${loopResult.iterations.length} iteration(s), ${loopResult.finalProgress}% progress.`,
    loopResult.goalMet ? 1.0 : 0.5,
    'iteration-controller');

  emit('auto:pipeline:v13:end', {
    status: loopResult.goalMet ? 'done' : 'failed',
    executionId: ctx.executionId,
    iterations: loopResult.iterations.length,
    finalProgress: loopResult.finalProgress,
    goalMet: loopResult.goalMet,
  });

  return finishPipelineV13(ctx, loopResult);
}

/**
 * Finalize the V13 pipeline and produce the completion report.
 *
 * @param {import('./pipeline-context.mjs').PipelineContext} ctx
 * @param {{success: boolean, iterations: object[], finalProgress: number, goalMet: boolean}} [loopResult]
 * @returns {object}
 */
function finishPipelineV13(ctx, loopResult = null) {
  const passed = ctx.phases.filter((p) => p.status === 'complete').length;
  const failed = ctx.phases.filter((p) => p.status === 'failed').length;
  const total = ctx.phases.length;

  const goalMet = loopResult ? loopResult.goalMet : isGoalAchieved(ctx);

  const isDryRun = ctx.dryRun;
  if (goalMet && !isDryRun) ctx.advanceGoalState(GOAL_STATES.COMPLETE);
  else if (failed > 0 && !ctx.canContinue()) ctx.advanceGoalState(GOAL_STATES.FAILED);

  const status = ctx.goalState === GOAL_STATES.COMPLETE ? 'done'
    : ctx.goalState === GOAL_STATES.FAILED ? 'failed' : 'issues-found';

  ctx.finalize(status);
  savePipelineState(ctx);
  writeExecutionSummary(ctx);

  const report = ctx.summary();
  report.project = ctx.project;
  report.agents = ctx.agents ? { primary: ctx.agents.primaryAgent, support: ctx.agents.supportAgents } : {};
  report.validation = ctx.validation;
  report.timestamp = new Date().toISOString();
  report.goalState = ctx.goalState;
  report.iterationCount = ctx.iterationCount;
  report.composedSkills = ctx.composedSkills ? { primaryRole: ctx.composedSkills.primaryRole } : {};
  report.agentTeams = ctx.agentTeams ? Object.fromEntries(
    Object.entries(ctx.agentTeams).map(([k, v]) => [k, { primary: v.primary, support: v.support }]),
  ) : {};
  report.sharedMemory = {
    findings: ctx.sharedMemory.findings.length,
    decisions: ctx.sharedMemory.decisions.length,
    risks: ctx.sharedMemory.risks.length,
  };
  report.loopResult = loopResult ? {
    iterations: loopResult.iterations.length,
    goalMet: loopResult.goalMet,
    finalProgress: loopResult.finalProgress,
  } : null;

  report.metrics = exportMetrics(ctx.executionId);

  measureProgress(ctx);
  console.log(progressSummary(ctx));

  // Post-archive verification
  verifyCompletionV13(ctx);

  // Sync feature dashboards (DASHBOARD.md, TRACEABILITY.md, VSI.md)
  try {
    syncDashboards();
    console.log('     Feature dashboards synced.');
  } catch { /* non-critical */ }

  // Record execution in history engine (openspec/history.json)
  try {
    recordExecution(ctx, {
      commitHash: ctx.archiveCommitHash || null,
      archiveTarget: ctx.archiveTarget || null,
    });
  } catch { /* non-critical */ }

  // Recovery guidance on failure
  if (failed > 0 || ctx.goalState === GOAL_STATES.FAILED) {
    const recovery = writeRecoveryGuidance(ctx);
    if (recovery.recoveryFile) {
      console.log('');
      console.log('  \u2500\u2500 Recovery Guide \u2500\u2500');
      console.log(`  Saved to: ${recovery.recoveryFile}`);
      if (recovery.commands.length) {
        console.log('  Suggested fix commands:');
        recovery.commands.forEach((c) => console.log(`    ${c}`));
      }
    }
  }

  console.log('');
  console.log('\u2500'.repeat(62));
  const stateLabel = isDryRun ? 'DRY-RUN (repository intelligence built)'
    : ctx.planOnly ? 'PLAN MODE \u2014 Review proposal.md, design.md, tasks.md, then resume'
    : ctx.goalState === GOAL_STATES.COMPLETE ? 'GOAL ACHIEVED'
    : ctx.goalState === GOAL_STATES.FAILED ? 'FAILED' : 'PARTIAL (iterate to continue)';
  console.log(`  Status: ${stateLabel}`);
  console.log(`  Iterations: ${ctx.iterationCount}`);
  console.log(`  Phases: ${passed} passed, ${failed} failed / ${total} total`);
  console.log(`  Duration: ${(ctx.totalDuration / 1000).toFixed(1)}s`);
  console.log(`  Shared Memory: ${ctx.sharedMemory.findings.length} findings, ${ctx.sharedMemory.decisions.length} decisions, ${ctx.sharedMemory.risks.length} risks`);
  console.log('\u2550'.repeat(62));
  console.log('');

  logEvent({
    type: 'auto-pipeline-v13', phase: 'complete', task: ctx.task, status,
    duration: ctx.totalDuration, iterations: ctx.iterationCount,
    goalState: ctx.goalState,
  });

  return report;
}

/**
 * Post-archive verification: checks all completion criteria.
 */
function verifyCompletionV13(ctx) {
  const changeRoot = resolve(ROOT, 'openspec', 'changes', ctx.changeName);
  const stateRoot = resolve(ROOT, 'orchestrate', '.state');

  const checks = [
    { label: 'Repository analyzed',          passed: !!(ctx.repository?.project) },
    { label: 'Task analyzed',                passed: !!(ctx.repository?.taskAnalysis?.intents?.length > 0) },
    { label: 'Skills composed by role',      passed: !!(ctx.composedSkills?.primaryRole) },
    { label: 'Agent teams assigned',         passed: !!(ctx.agentTeams && Object.keys(ctx.agentTeams).length > 0) },
    { label: 'Explore completed',            passed: ctx.phases.some((p) => p.id === 'OPSX_EXPLORE' && p.status === 'complete') },
    { label: 'Proposal completed',           passed: existsSync(resolve(changeRoot, 'proposal.md')) && ctx.phases.some((p) => p.id === 'OPSX_PROPOSE' && p.status === 'complete') },
    { label: 'Sync completed',               passed: ctx.phases.some((p) => p.id === 'OPSX_SYNC' && (p.status === 'complete' || p.status === 'skipped')) },
    { label: 'Apply completed',              passed: ctx.phases.some((p) => p.id === 'OPSX_APPLY' && p.status === 'complete') },
    { label: 'Validation completed',         passed: ctx.phases.some((p) => p.id === 'VALIDATE' && (p.status === 'complete' || p.status === 'failed')) },
    { label: 'Verification completed',       passed: ctx.phases.some((p) => p.id === 'OPSX_VERIFY' && p.status === 'complete') },
    { label: 'Archive completed',            passed: ctx.phases.some((p) => p.id === 'OPSX_ARCHIVE' && p.status === 'complete') },
    { label: 'Proposal artifact exists',     passed: existsSync(resolve(changeRoot, 'proposal.md')) },
    { label: 'Design artifact exists',       passed: existsSync(resolve(changeRoot, 'design.md')) },
    { label: 'Tasks artifact exists',        passed: existsSync(resolve(changeRoot, 'tasks.md')) },
    { label: 'Shared memory active',         passed: ctx.sharedMemory.findings.length > 0 },
    { label: 'Execution log exists',         passed: existsSync(resolve(stateRoot, `${ctx.executionId}-context.json`)) },
  ];

  const allPassed = checks.every((c) => c.passed);
  const failedChecks = checks.filter((c) => !c.passed);

  console.log('');
  console.log('  \u2500\u2500 Post-Archive Verification (V13) \u2500\u2500');
  checks.forEach((c) => console.log(`    ${c.passed ? '\u2713' : '\u2717'} ${c.label}`));
  console.log(`  Result: ${allPassed ? 'ALL PASSED' : `${failedChecks.length} FAILED`}`);

  ctx.verification = { allPassed, checks: checks.map((c) => ({ label: c.label, passed: c.passed })) };
  return ctx.verification;
}

/**
 * Resume a previously persisted pipeline execution.
 */
export function resumePipelineV13(executionId) {
  const ctx = PipelineContext.load(executionId);
  if (!ctx) {
    console.log(`No pipeline state found for execution: ${executionId}`);
    return null;
  }

  console.log('');
  console.log('\u2550'.repeat(62));
  console.log(`  /opsx-auto V13 \u2014 RESUMING`);
  console.log(`  Execution: ${ctx.executionId}`);
  console.log(`  Goal state: ${ctx.goalState}`);
  console.log(`  Iterations: ${ctx.iterationCount}`);
  console.log(`  Completed phases: ${ctx.phases.filter((p) => p.status === 'complete').length}`);
  console.log(`  Shared memory: ${ctx.sharedMemory?.findings?.length || 0} findings`);
  console.log('\u2550'.repeat(62));
  console.log('');

  logEvent({ type: 'auto-pipeline-v13', phase: 'resume', executionId, goalState: ctx.goalState });
  return ctx;
}

export { GOAL_STATES, ITERATION_LIMIT, PipelineContext, slugify };
