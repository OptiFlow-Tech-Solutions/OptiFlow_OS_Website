/**
 * V13: Orchestration coordinator \u2014 unified entry point.
 * Exposes both V12 (linear waterfall) and V13 (goal-oriented loop) APIs.
 * Backward compatible: all V12 exports remain available.
 *
 * Default: V13 (autoFullPipelineV13) for autonomous orchestration.
 * V12 (autoFullPipeline) available as fallback via `--v12` flag or direct import.
 *
 * @module orchestrate/coordinator
 */

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ── V12 API (backward compatibility) ──
export {
  initPipeline, runDeepScan, runSkillDiscovery,
  runExplore, runPropose, runSync, runApply,
  runValidate, runArchive, finishPipeline, getPhaseInstructions,
  autoFullPipeline, resumePipeline,
  isPhaseComplete, isPhaseFailed,
  PipelineContext, slugify,
  SAFETY_RULES, PHASE_ORDER, GOAL_STATES, ITERATION_LIMIT,
} from './auto-pipeline.mjs';

// ── V13 API (next-generation master orchestrator) ──
export {
  initPipelineV13, autoFullPipelineV13, resumePipelineV13,
} from './auto-pipeline-v13.mjs';

// ── V13 sub-modules ──
export { buildRepositorySnapshot, applySnapshot } from './repository-snapshot.mjs';
export { composeSkills, rolesForPhase, WORKFLOW_ROLES } from './skill-composer.mjs';
export { composeAgentTeam, composeAllTeams, invocationStrategy } from './agent-composer.mjs';
export {
  LIFECYCLE_CONTRACTS, getContract, validatePrerequisites,
  buildPhasePlan, getHandoff, contractSummary,
} from './agent-contracts.mjs';
export { planIteration, isPhaseBlocked, recommendedPhases } from './execution-strategy.mjs';
export { runIteration, runGoalLoop } from './iteration-controller.mjs';
export { exportTelemetry, generateAuditReport } from './telemetry.mjs';

export { resolveFeatureFromTask } from './feature-router.mjs';

// ── Feature Intelligence Engine (V2.0) ──
export {
  loadRegistry as loadFeatureRegistry, getFeature, getAllFeatures,
  getByPrefix, getByStatus, getByCategory, getOrphans,
  loadAIContext, getAIContext,
  getFeatureIntelligence, getRepositoryIntelligence, getRepositoryIntelligenceFull,
  resolveDependencies as resolveFeatureDependencies, resolveDependents,
  resolveDependencyTree, detectCycles, traverseGraph,
  buildTraceChain, findTraceabilityGaps, loadArchiveIndex,
  generateEnterpriseDashboard, generateEnterpriseDashboardMarkdown,
  generateTraceabilityMarkdown, generateVSIDocumentMarkdown,
  generateMermaidDependencyGraph,
  syncDashboards, registerFeature, updateFeatureStatus, validateIntegrity,
} from './feature-engine.mjs';

/**
 * Quick entry point \u2014 runs the V13 autonomous pipeline by default.
 * Use `--v12` flag to run the legacy V12 pipeline instead.
 *
 * `node orchestrate/coordinator.mjs "task description"`
 */
export async function run(taskDescription, opts = {}) {
  if (opts.useV12 || process.argv.includes('--v12')) {
    const { autoFullPipeline } = await import('./auto-pipeline.mjs');
    return autoFullPipeline(taskDescription, opts);
  }
  const { autoFullPipelineV13 } = await import('./auto-pipeline-v13.mjs');
  return autoFullPipelineV13(taskDescription, opts);
}

/**
 * CLI main \u2014 invoked when running `node orchestrate/coordinator.mjs`
 */
if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const task = process.argv[2];
  if (!task) {
    console.log('Usage: node orchestrate/coordinator.mjs "Task description"');
    console.log('Options: --dry-run --skip-build --plan --feature-sync --feature-report --v12');
    process.exit(1);
  }

  const dryRun = process.argv.includes('--dry-run');
  const skipBuild = process.argv.includes('--skip-build');
  const planOnly = process.argv.includes('--plan');
  const featureSync = process.argv.includes('--feature-sync');
  const featureReport = process.argv.includes('--feature-report');

  if (featureSync) {
    import('./feature-engine.mjs').then(({ syncDashboards }) => {
      syncDashboards();
      process.exit(0);
    });
  } else if (featureReport) {
    import('./feature-engine.mjs').then(({ generateDashboardMarkdown, findTraceabilityGaps, validateIntegrity }) => {
      console.log(generateDashboardMarkdown());
      const gaps = findTraceabilityGaps();
      if (gaps.length) { console.log('\n## Traceability Gaps'); gaps.forEach((g) => console.log(`  [${g.severity.toUpperCase()}] ${g.feature} ${g.name}: ${g.gap}`)); }
      const integrity = validateIntegrity();
      console.log(`\n${integrity.summary}`);
      process.exit(0);
    });
  } else {
    run(task, { dryRun, skipBuild, planOnly }).then((report) => {
      console.log(JSON.stringify(report, null, 2));
      process.exit(report.status === 'done' ? 0 : 1);
    }).catch((e) => {
      console.error('Pipeline failed:', e.message);
      process.exit(1);
    });
  }
}
