/**
 * Terminal dashboard for pipeline progress visualization.
 * @module orchestrate/pipeline-viz
 */

const ICONS = { pending: '⏳', 'in-progress': '🔄', done: '✅', failed: '❌' };
const BAR_LEN = 30;

function bar(ratio) {
  const filled = Math.round(ratio * BAR_LEN);
  return '█'.repeat(filled) + '░'.repeat(BAR_LEN - filled);
}

/**
 * @param {{name?: string, steps: Array<{id: string, status: string, label?: string}>}} pipeline
 */
export function renderPipeline(pipeline) {
  const { steps = [], name = 'pipeline' } = pipeline;
  const done = steps.filter((s) => s.status === 'done').length;
  const ratio = steps.length ? done / steps.length : 0;

  console.log(`\n  Pipeline: ${name}  [${done}/${steps.length}]`);
  console.log(`  ${bar(ratio)} ${Math.round(ratio * 100)}%\n`);

  for (const step of steps) {
    const icon = ICONS[step.status] || '⏳';
    const id = step.id.padEnd(20);
    console.log(`  ${icon} ${id} ${step.label || ''}`);
  }
  console.log();
}
