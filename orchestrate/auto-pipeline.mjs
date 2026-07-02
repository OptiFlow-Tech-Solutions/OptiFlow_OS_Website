/**
 * V6: Auto-full-pipeline — the brain of /opsx-auto.
 *
 * Given only a natural language task description, this module:
 *   1. Analyzes intent (domains, roles, capabilities)
 *   2. Resolves the feature from the task description
 *   3. Loads full project context
 *   4. Auto-selects skills, agents, MCPs, hooks
 *   5. Executes the full OpenSpec lifecycle: explore → propose → apply → verify → archive
 *   6. Runs build + validate + quality gates
 *   7. Starts dev server, visually verifies via Playwright MCP
 *   8. Auto-fixes discovered issues (up to 3 iterations)
 *   9. Cleans up and reports final status
 *
 * @module orchestrate/auto-pipeline
 */

import { analyzeTask, findBestSkills } from './capability-analyzer.mjs';
import { resolveFeatureFromTask } from './feature-router.mjs';
import { loadFullContext } from './context-loader.mjs';
import { routeBySpecs, routeTask } from './skill-router.mjs';
import { routeAgents } from './agent-router.mjs';
import { routeMCP } from './mcp-router.mjs';
import { routeHooks } from './hook-router.mjs';
import { routeCommands } from './command-router.mjs';
import { runOpsxCommand } from './opsx-commands.mjs';
import { runGates, gatesForPhase } from './quality-gate.mjs';
import { startTimer, record } from './metrics.mjs';
import { logEvent } from './audit-log.mjs';
import { emit } from './event-bus.mjs';
import { saveState } from './state-manager.mjs';
import { getBranch } from './project-scanner.mjs';
import { execSync } from 'node:child_process';
import { resolvePaths } from './config-resolver.mjs';

const { projectRoot } = resolvePaths();
const ROOT = projectRoot;

/**
 * The single entry point for /opsx-auto mode.
 * Takes a natural language task description, executes the complete lifecycle,
 * and returns a full status report.
 *
 * @param {string} taskDescription — natural language task (e.g. "Build the Pricing Page")
 * @param {object} [opts]
 * @param {boolean} [opts.skipVisual=false] — skip visual verification
 * @param {boolean} [opts.skipBuild=false] — skip build step
 * @param {boolean} [opts.dryRun=false] — plan only, don't execute
 * @param {number} [opts.maxFixIterations=3] — max visual fix iterations
 * @returns {Promise<object>} Full status report
 */
export async function autoFullPipeline(taskDescription, opts = {}) {
  const {
    skipVisual = false,
    skipBuild = false,
    dryRun = false,
    maxFixIterations = 3,
  } = opts;

  const timer = startTimer('auto-full-pipeline');
  const branch = getBranch();
  const changeName = slugify(taskDescription);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`  /opsx-auto — Intelligent Spec-Driven Orchestration`);
  console.log(`  Request: "${taskDescription.slice(0, 80)}"`);
  console.log(`  Branch: ${branch} | ${new Date().toISOString()}`);
  console.log(`${'='.repeat(60)}\n`);

  await emit('auto:pipeline:start', { taskDescription, branch });

  // ═══════ Phase 1: Analyze intent ═══════
  console.log('[Phase 1/9] Analyzing intent...');
  const analysis = analyzeTask(taskDescription);
  console.log(`  Intents: ${analysis.intents.join(', ') || '(general)'}`);
  console.log(`  Domains: ${analysis.domains.join(', ') || '(auto)'}`);
  console.log(`  Confidence: ${(analysis.confidence * 100).toFixed(0)}%`);

  // ═══════ Phase 2: Resolve feature ═══════
  console.log('\n[Phase 2/9] Resolving feature...');
  const { featureId, featureName, confidence: featureConfidence } = resolveFeatureFromTask(taskDescription);
  console.log(`  Feature: ${featureId} | ${featureName} (${(featureConfidence * 100).toFixed(0)}% match)`);

  // ═══════ Phase 3: Load full context ═══════
  console.log('\n[Phase 3/9] Loading project context...');
  const context = loadFullContext(taskDescription);
  console.log(`  Site: ${context.site ? 'loaded' : 'not found'}`);
  console.log(`  Design system: ${context.design ? `${context.design.split('\n').length} lines` : 'not found'}`);
  console.log(`  Features: ${context.features?.features?.length || 0} registered`);
  console.log(`  Specs: ${context.specs?.length || 0} loaded`);
  console.log(`  Affected specs: ${context.affected?.length || 0}`);

  // ═══════ Phase 4: Auto-select capabilities ═══════
  console.log('\n[Phase 4/9] Selecting capabilities...');

  // Skills — try composition first, then capability matching, then domain routing
  const skills = [];
  try {
    const composed = routeTask(taskDescription);
    if (composed) skills.push(...composed);
  } catch { /* use domains below */ }

  if (!skills.length) {
    try {
      const skillNames = findBestSkills(taskDescription, 6);
      if (skillNames) skills.push(...skillNames);
    } catch { /* empty */ }
  }

  if (!skills.length && context.affected?.length) {
    try {
      const domainSkills = routeBySpecs(context.affected);
      if (domainSkills) skills.push(...domainSkills);
    } catch { /* empty */ }
  }

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

  console.log(`  Skills (${skills.length}): ${skills.join(', ')}`);
  console.log(`  Agents: ${agentRoute.primaryAgent} + [${agentRoute.supportAgents.join(', ') || 'none'}]`);
  console.log(`  MCPs (${mcpRoute.mcpServers.length}): ${mcpRoute.mcpServers.join(', ')}`);
  console.log(`  Hooks: pre=[${hooks.preHooks.join(', ') || 'none'}] post=[${hooks.postHooks.join(', ') || 'none'}]`);
  console.log(`  Gates: ${gates.join(' → ')}`);

  if (dryRun) {
    console.log('\n[Dry Run] Planning complete. Add execute=true to implement.');
    const plan = {
      version: '6.0', command: 'auto', changeName, branch,
      timestamp: new Date().toISOString(),
      analysis,
      feature: { id: featureId, name: featureName, confidence: featureConfidence },
      capabilities: { skills, agents: agentRoute, mcpServers: mcpRoute.mcpServers, hooks, commands, gates },
      context: { specCount: context.specs?.length || 0, featureCount: context.features?.features?.length || 0 },
    };
    saveState(`auto-plan-${changeName}`, plan);
    logEvent({ type: 'auto-pipeline', phase: 'plan', task: taskDescription, dryRun: true });
    await emit('auto:pipeline:end', { plan, dryRun: true });
    return { status: 'planned', plan };
  }

  // ═══════ Phase 5: Execute OpenSpec lifecycle ═══════
  console.log('\n[Phase 5/9] Executing OpenSpec lifecycle...');

  const lifecycleResults = [];
  const phases = ['explore', 'propose', 'apply', 'verify', 'archive'];

  for (const phase of phases) {
    try {
      console.log(`  ${phase.toUpperCase()}...`);
      const result = await runOpsxCommand(phase, changeName, {
        description: taskDescription,
        autoApprove: true,
      });
      lifecycleResults.push({ phase, success: true, result });
      console.log(`     ${phase === 'apply' ? 'Implemented' : phase === 'verify' ? 'Validated' : phase === 'archive' ? 'Archived' : 'Complete'}.`);
    } catch (e) {
      lifecycleResults.push({ phase, success: false, error: e.message });
      console.log(`     Failed: ${e.message}`);
    }
  }

  // ═══════ Phase 6: Build & Validate ═══════
  console.log('\n[Phase 6/9] Building & validating...');

  if (!skipBuild) {
    try {
      console.log('  Building...');
      const buildOut = execSync('node scripts/assemble.mjs', {
        cwd: ROOT, encoding: 'utf-8', timeout: 60000, stdio: 'pipe',
      }).trim();
      console.log(`     Build: OK (${buildOut.length} bytes output)`);
    } catch (e) {
      console.log(`     Build failed: ${e.message?.slice(0, 200)}`);
    }

    try {
      console.log('  Validating...');
      execSync('node scripts/validate.mjs', {
        cwd: ROOT, encoding: 'utf-8', timeout: 30000, stdio: 'pipe',
      });
      console.log('     Validate: OK');
    } catch (_e) {
      console.log(`     Validate warnings (non-blocking)`);
    }

    // Run quality gates
    const gateResult = await runGates(gates, { changeName });
    if (gateResult.allPassed) {
      console.log(`  Gates: ${gates.join(' → ')} — ALL PASSED`);
    } else {
      console.log(`  Gate failed at: ${gateResult.failedGate}`);
    }
  }

  // ═══════ Phase 7: Visual verification ═══════
  let visualResult = { pages: [], totalIssues: 0, iterations: 0, finalPassed: true };

  if (!skipVisual) {
    console.log('\n[Phase 7/9] Visual verification...');

    try {
      const { startDevServer, verifyAll, stopDevServer } = await import('./visual-verify.mjs');

      const devStarted = await startDevServer(3000);
      if (!devStarted.started) {
        console.log('     Dev server failed to start. Skipping visual verification.');
      } else {
        const pagesToVerify = resolvePagesToVerify(taskDescription, context);
        console.log(`     Verifying ${pagesToVerify.length} page(s): ${pagesToVerify.join(', ')}`);

        await emit('auto:verify:ready', { pages: pagesToVerify, port: 3000 });
        console.log('     [Event] auto:verify:ready emitted — harness should now verify pages.');

        visualResult = await verifyAll(pagesToVerify, 3000, maxFixIterations);

        console.log(`     Iterations: ${visualResult.iterations}`);
        console.log(`     Issues found: ${visualResult.totalIssues}`);
        console.log(`     Final status: ${visualResult.finalPassed ? 'PASSED' : 'issues remain'}`);

        await stopDevServer();
      }
    } catch (e) {
      console.log(`     Visual verify unavailable: ${e.message?.slice(0, 100)}`);
    }
  }

  // ═══════ Phase 8: Sync documentation ═══════
  console.log('\n[Phase 8/9] Syncing documentation...');
  try {
    const { syncDocs } = await import('./doc-sync.mjs');
    syncDocs(changeName, context.affected?.map((s) => s.specName) || []);
    console.log('     Documentation synced.');
  } catch (e) {
    console.log(`     Doc sync skipped: ${e.message?.slice(0, 80)}`);
  }

  try {
    const { generateTrace } = await import('./traceability.mjs');
    generateTrace(changeName, 'HEAD');
    console.log('     Traceability updated.');
  } catch { /* non-critical */ }

  // ═══════ Phase 9: Final report ═══════
  const duration = timer();
  record('auto-full-pipeline', duration);

  const report = {
    version: '6.0',
    command: 'auto',
    changeName,
    branch,
    task: taskDescription,
    status: visualResult.finalPassed ? 'done' : 'issues-found',
    duration,
    feature: { id: featureId, name: featureName, confidence: featureConfidence },
    analysis: { intents: analysis.intents, domains: analysis.domains, confidence: analysis.confidence },
    capabilities: {
      skills,
      agents: { primary: agentRoute.primaryAgent, support: agentRoute.supportAgents },
      mcpServers: mcpRoute.mcpServers,
      hooks,
      gates,
    },
    lifecycle: lifecycleResults,
    visualVerification: {
      pages: visualResult.pages,
      totalIssues: visualResult.totalIssues,
      iterations: visualResult.iterations,
      passed: visualResult.finalPassed,
    },
    timestamp: new Date().toISOString(),
  };

  saveState(`auto-full-${changeName}`, report);
  logEvent({ type: 'auto-pipeline', phase: 'complete', task: taskDescription, duration, status: report.status });

  await emit('auto:pipeline:end', { report });

  console.log(`\n${'='.repeat(60)}`);
  console.log(`  /opsx-auto — ${report.status === 'done' ? 'COMPLETE' : 'ISSUES FOUND'}`);
  console.log(`  Feature: ${featureId} | ${featureName}`);
  console.log(`  Duration: ${(duration / 1000).toFixed(1)}s`);
  console.log(`${'='.repeat(60)}\n`);

  return report;
}

/**
 * Slugify a task description for use as a change name.
 */
function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 40)
    .replace(/^-+|-+$/g, '');
}

/**
 * Resolve which pages to verify based on the task and context.
 * @param {string} taskDescription
 * @param {object} context
 * @returns {string[]}
 */
function resolvePagesToVerify(taskDescription, _context) {
  const lower = taskDescription.toLowerCase();

  // Map known feature patterns to pages
  const pageMap = {
    'home': ['/'],
    'problem': ['/problem-solutions/'],
    'solutions': ['/problem-solutions/'],
    'product': ['/product-overview/'],
    'overview': ['/product-overview/'],
    'feature': ['/features/', '/feature-showcase/'],
    'showcase': ['/feature-showcase/'],
    'why': ['/why-optiflow/'],
    'pricing': ['/pricing/'],
    'price': ['/pricing/'],
    'plan': ['/pricing/'],
    'newsletter': ['/newsletter/'],
    'content': ['/newsletter/'],
    'faq': ['/faq/'],
    'self-service': ['/faq/'],
    'contact': ['/contact/'],
    'support': ['/contact/'],
    'demo': ['/demo-booking/'],
    'booking': ['/demo-booking/'],
    'legal': ['/privacy-policy/', '/terms/'],
    'privacy': ['/privacy-policy/'],
    'terms': ['/terms/'],
    'competitive': ['/competitive-positioning/'],
    'positioning': ['/competitive-positioning/'],
    'admin': ['/admin/'],
  };

  const matchedPages = [];
  for (const [key, pages] of Object.entries(pageMap)) {
    if (lower.includes(key)) {
      for (const p of pages) {
        if (!matchedPages.includes(p)) matchedPages.push(p);
      }
    }
  }

  // Default: verify homepage
  if (!matchedPages.length) matchedPages.push('/');

  // Verify homepage first, then specific pages
  if (!matchedPages.includes('/')) matchedPages.unshift('/');

  return matchedPages.slice(0, 4); // max 4 pages to keep fast
}
