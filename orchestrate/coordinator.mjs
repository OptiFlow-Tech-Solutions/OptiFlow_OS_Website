/**
 * V8: Orchestration coordinator — unified entry point.
 * Re-exports the state-machine API from auto-pipeline.mjs for the AI agent,
 * plus maintains backward compatibility for CLI use.
 * @module orchestrate/coordinator
 */

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ── Re-export the V8 state-machine API ──
export {
  initPipeline,
  runDeepScan,
  runSkillDiscovery,
  runExplore,
  runPropose,
  runSync,
  runApply,
  runValidate,
  runArchive,
  finishPipeline,
  getPhaseInstructions,
  autoFullPipeline,
  PipelineContext,
  slugify,
  SAFETY_RULES,
  PHASE_ORDER,
} from './auto-pipeline.mjs';

export { resolveFeatureFromTask } from './feature-router.mjs';

/**
 * Quick entry point — runs the full autonomous pipeline.
 * `node orchestrate/coordinator.mjs "task description"`
 */
export async function run(taskDescription, opts = {}) {
  const { autoFullPipeline } = await import('./auto-pipeline.mjs');
  return autoFullPipeline(taskDescription, opts);
}

/**
 * CLI main — invoked when running `node orchestrate/coordinator.mjs`
 */
if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const task = process.argv[2];
  if (!task) {
    console.log('Usage: node orchestrate/coordinator.mjs "Task description"');
    console.log('Options: --dry-run --skip-build');
    process.exit(1);
  }

  const dryRun = process.argv.includes('--dry-run');
  const skipBuild = process.argv.includes('--skip-build');

  run(task, { dryRun, skipBuild }).then((report) => {
    console.log(JSON.stringify(report, null, 2));
    process.exit(report.status === 'done' ? 0 : 1);
  }).catch((e) => {
    console.error('Pipeline failed:', e.message);
    process.exit(1);
  });
}
