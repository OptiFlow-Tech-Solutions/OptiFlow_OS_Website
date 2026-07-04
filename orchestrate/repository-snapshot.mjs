/**
 * V13: Unified repository intelligence snapshot.
 * Aggregates project analysis, spec index, feature registry, design rules,
 * and capability registry into a single shared structure that all agents access.
 *
 * Phases DEEP_SCAN, SKILL_DISCOVERY, and CAPABILITY_INDEX can run in parallel
 * because they are all read-only operations with no shared mutable state.
 *
 * @module orchestrate/repository-snapshot
 */

import { analyzeProject } from './project-analyzer.mjs';
import { loadFullContextWithAnalysis } from './context-loader.mjs';
import { discoverSkills, getDiscoveredSkillMetadata } from './skill-discovery.mjs';
import { analyzeTask } from './capability-analyzer.mjs';
import { routeAgents } from './agent-router.mjs';
import { routeMCP } from './mcp-router.mjs';
import { routeHooks } from './hook-router.mjs';
import { routeCommands } from './command-router.mjs';
import { gatesForPhase } from './quality-gate.mjs';
import { resolveFeatureFromTask } from './feature-router.mjs';
import { getBranch } from './project-scanner.mjs';
import { buildRegistry } from './capability-registry.mjs';
import { startTimer, record } from './metrics.mjs';
import { logEvent } from './audit-log.mjs';

/**
 * @typedef {{
 *   project: {name: string, framework: string, architecture: string, totalFiles: number, totalLines: number, packageManager: string},
 *   branch: string,
 *   featureId: string|null,
 *   featureName: string|null,
 *   specs: object[],
 *   features: object|null,
 *   site: object|null,
 *   design: string|null,
 *   affectedSpecs: object[],
 *   analysis: object,
 *   skills: string[],
 *   skillMetadata: object[],
 *   agents: {primaryAgent: string, supportAgents: string[], skipAgents: string[]},
 *   mcpRoute: object,
 *   gates: string[],
 *   capabilityRegistry: object|null,
 *   taskAnalysis: {intents: string[], domains: string[], roles: string[], skills: string[], confidence: number},
 *   preloadedSkills: {name: string, path: string, role: string}[],
 *   scannedAt: string
 * }} RepositorySnapshot
 */

/**
 * Build a complete repository snapshot. Runs read-only analysis in parallel.
 * This is the foundation for all intelligent decisions in the pipeline.
 *
 * @param {string} taskDescription
 * @param {string} [branch]
 * @returns {Promise<RepositorySnapshot>}
 */
export async function buildRepositorySnapshot(taskDescription, branch = null) {
  const timer = startTimer('repo-snapshot');
  const b = branch || getBranch();

  // All read-only analysis runs in parallel
  const [
    fullContext,
    projectAnalysis,
    capabilityRegistry,
  ] = await Promise.all([
    Promise.resolve(loadFullContextWithAnalysis(taskDescription)),
    Promise.resolve(analyzeProject()),
    buildRegistry().catch(() => null),
  ]);

  const analysis = fullContext.projectAnalysis || projectAnalysis;
  const taskAnalysis = analyzeTask(taskDescription);
  const feature = resolveFeatureFromTask(taskDescription);
  const domains = taskAnalysis.domains.length ? taskAnalysis.domains : ['frontend', 'design'];

  // Skill discovery uses the full metadata for later composition
  const skills = discoverSkills(taskDescription, domains, 12, {
    framework: analysis?.framework,
    architecture: analysis?.architectureStyle,
    featureId: feature.featureId,
  });

  const skillMetadata = getDiscoveredSkillMetadata(taskDescription, domains, 12);

  // Pre-load top 3 skills with paths for the AI agent to load immediately
  const preloadedSkills = skillMetadata.slice(0, 3).map((s) => ({
    name: s.name,
    path: s.path,
    score: s.score,
  }));

  const agentRoute = routeAgents(domains, 'standard', b, taskDescription);
  const mcpRoute = routeMCP(taskDescription, domains, 'auto');
  routeHooks('auto');
  routeCommands('auto', { changeName: '' });
  const gates = gatesForPhase('auto');

  const snapshot = {
    project: {
      name: analysis?.projectName || 'unknown',
      framework: analysis?.framework || 'unknown',
      architecture: analysis?.architectureStyle || 'unknown',
      totalFiles: analysis?.totalFiles || 0,
      totalLines: analysis?.totalLines || 0,
      packageManager: analysis?.packageManager || 'unknown',
    },
    branch: b,
    featureId: feature.featureId,
    featureName: feature.featureName,
    specs: fullContext.specs || [],
    features: fullContext.features || null,
    site: fullContext.site || null,
    design: fullContext.design || null,
    affectedSpecs: fullContext.affected || [],
    analysis: fullContext,
    skills,
    skillMetadata,
    preloadedSkills,
    agents: agentRoute,
    mcpRoute,
    gates,
    capabilityRegistry,
    taskAnalysis,
    scannedAt: new Date().toISOString(),
  };

  logEvent({ type: 'repo-snapshot', project: snapshot.project.name, framework: snapshot.project.framework, skills: skills.length, agents: agentRoute.primaryAgent });
  record('repo-snapshot', timer());

  return snapshot;
}

/**
 * Apply a repository snapshot to a pipeline context.
 * Populates all context fields from the snapshot.
 *
 * @param {import('./pipeline-context.mjs').PipelineContext} ctx
 * @param {RepositorySnapshot} snapshot
 * @returns {import('./pipeline-context.mjs').PipelineContext}
 */
export function applySnapshot(ctx, snapshot) {
  ctx.project = snapshot.project;
  ctx.branch = snapshot.branch;
  ctx.featureId = snapshot.featureId;
  ctx.featureName = snapshot.featureName;
  ctx.affectedSpecs = snapshot.affectedSpecs;
  ctx.skills = snapshot.skills;
  ctx.agents = snapshot.agents;
  ctx.repository = snapshot;

  console.log(`     Project: ${snapshot.project.name}`);
  console.log(`     Framework: ${snapshot.project.framework}`);
  console.log(`     Architecture: ${snapshot.project.architecture}`);
  console.log(`     Package mgr: ${snapshot.project.packageManager}`);
  console.log(`     Branch: ${snapshot.branch}`);
  console.log(`     Files: ~${snapshot.project.totalFiles} (${snapshot.project.totalLines} lines)`);
  console.log(`     Feature: ${snapshot.featureId || 'none'} | ${snapshot.featureName || 'none'}`);
  console.log(`     Intents: ${snapshot.taskAnalysis.intents.join(', ') || '(general)'}`);
  console.log(`     Domains: ${snapshot.taskAnalysis.domains.join(', ')}`);
  console.log(`     Skills (${snapshot.skills.length}): ${snapshot.skills.slice(0, 6).join(', ')}${snapshot.skills.length > 6 ? ` +${snapshot.skills.length - 6} more` : ''}`);
  if (snapshot.preloadedSkills?.length) {
    console.log(`     Pre-loaded (${snapshot.preloadedSkills.length}): ${snapshot.preloadedSkills.map((s) => `${s.name} [score=${s.score}]`).join(', ')}`);
  }
  console.log(`     Agents: ${snapshot.agents.primaryAgent}${snapshot.agents.supportAgents?.length ? ` + [${snapshot.agents.supportAgents.join(', ')}]` : ''}`);
  console.log(`     MCPs: ${snapshot.mcpRoute.mcpServers?.join(', ') || 'none'}`);
  console.log(`     Gates: ${snapshot.gates.join(' \u2192 ')}`);

  return ctx;
}
