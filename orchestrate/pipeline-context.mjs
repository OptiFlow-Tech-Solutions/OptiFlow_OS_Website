/**
 * V11: Shared execution context for the autonomous orchestration pipeline.
 * One context object flows through every phase and iteration.
 * The AI agent reads from it to know what to do; phases write results back.
 * Supports goal-oriented execution loops with checkpoint/recovery.
 * @module orchestrate/pipeline-context
 */

export const GOAL_STATES = Object.freeze({
  INIT: 'INIT',
  ANALYZING: 'ANALYZING',
  EXPLORING: 'EXPLORING',
  PROPOSING: 'PROPOSING',
  IMPLEMENTING: 'IMPLEMENTING',
  VALIDATING: 'VALIDATING',
  ARCHIVING: 'ARCHIVING',
  COMPLETE: 'COMPLETE',
  FAILED: 'FAILED',
});

export const ITERATION_LIMIT = 20;
export const MAX_STALE_ITERATIONS = 3;

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';
import { measureProgress } from './progress-tracker.mjs';

const { stateDir } = resolvePaths();

export class PipelineContext {
  /**
   * @param {string} taskDescription
   * @param {object} [opts]
   * @param {boolean} [opts.dryRun]
   * @param {boolean} [opts.skipBuild]
   * @param {boolean} [opts.autoApprove]
   * @param {boolean} [opts.planOnly]
   */
  constructor(taskDescription, opts = {}) {
    this.executionId = `${slugify(taskDescription)}-${Date.now()}`;
    this.task = taskDescription;
    this.changeName = slugify(taskDescription);
    this.dryRun = opts.dryRun || false;
    this.skipBuild = opts.skipBuild || false;
    this.autoApprove = opts.autoApprove !== false;
    this.planOnly = opts.planOnly || false;
    this.startedAt = new Date().toISOString();
    this.branch = 'unknown';
    this.phases = [];
    this.status = 'pending';

    this.project = { name: 'unknown', framework: 'unknown', architecture: 'unknown', totalFiles: 0, totalLines: 0 };
    this.skills = [];
    this.agents = null;
    this.featureId = null;
    this.featureName = null;
    this.affectedSpecs = [];
    this.validation = { passed: false, failures: [] };

    this.phaseResults = {};
    this.errors = [];
    this.warnings = [];
    this.completedAt = null;
    this.totalDuration = 0;

    // V11: Goal-oriented execution
    this.goalState = GOAL_STATES.INIT;
    this.iterationCount = 0;
    this.targetDescription = taskDescription;
    this.checkpoints = [];

    // V12: Staleness detection
    this.lastProgressPct = -1;
    this.staleIterationCount = 0;

    // V13: Shared memory — agents append structured findings for cross-phase reasoning
    this.sharedMemory = {
      findings: [],    // {type, content, confidence, agent, timestamp}
      decisions: [],   // {decision, rationale, alternatives}
      risks: [],       // {risk, severity, mitigation}
      assumptions: [], // {assumption, validated, by}
    };

    // V13: Repository snapshot — unified repository intelligence
    this.repository = null;

    // V13: Composed skills by role
    this.composedSkills = null;

    // V13: Composed agent teams
    this.agentTeams = null;
  }

  get currentPhase() {
    const running = this.phases.filter((p) => p.status === 'running');
    return running.length ? running[running.length - 1] : null;
  }

  get nextPhaseId() {
    const completed = new Set(this.phases.filter((p) => p.status === 'complete' || p.status === 'skipped').map((p) => p.id));
    const order = ['DEEP_SCAN', 'SKILL_DISCOVERY', 'OPSX_EXPLORE', 'OPSX_PROPOSE', 'OPSX_SYNC', 'OPSX_APPLY', 'VALIDATE', 'OPSX_VERIFY', 'OPSX_ARCHIVE'];
    return order.find((id) => !completed.has(id)) || null;
  }

  startPhase(id, label) {
    const phase = {
      id, label: label || id, status: 'running',
      startedAt: new Date().toISOString(),
      completedAt: null, duration: 0, error: null, output: null,
    };
    this.phases.push(phase);
    return phase;
  }

  completePhase(id, output = null) {
    const phase = this.phases.find((p) => p.id === id);
    if (!phase) return null;
    phase.status = 'complete';
    phase.completedAt = new Date().toISOString();
    phase.duration = Date.now() - new Date(phase.startedAt).getTime();
    phase.output = output;
    this.phaseResults[id] = output;
    return phase;
  }

  failPhase(id, error) {
    const phase = this.phases.find((p) => p.id === id);
    if (!phase) return null;
    phase.status = 'failed';
    phase.completedAt = new Date().toISOString();
    phase.duration = Date.now() - new Date(phase.startedAt).getTime();
    phase.error = typeof error === 'string' ? error : error?.message || 'Unknown error';
    this.errors.push({ phase: id, error: phase.error });
    return phase;
  }

  skipPhase(id, reason) {
    const phase = {
      id, label: id, status: 'skipped',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      duration: 0, error: null, output: reason,
    };
    this.phases.push(phase);
    return phase;
  }

  finalize(status = 'done') {
    this.status = status;
    this.completedAt = new Date().toISOString();
    this.totalDuration = Date.now() - new Date(this.startedAt).getTime();
    this.persist();
  }

  advanceGoalState(newState) {
    const valid = Object.values(GOAL_STATES).includes(newState);
    if (valid) {
      this.goalState = newState;
      if (newState === GOAL_STATES.COMPLETE || newState === GOAL_STATES.FAILED) {
        this.finalize(newState === GOAL_STATES.COMPLETE ? 'done' : 'failed');
      }
    }
    this.persist();
    return this.goalState;
  }

  isGoalMet() {
    try {
      const { completionPct, blockers } = measureProgress(this);
      return completionPct >= 90 && blockers.length === 0;
    } catch {
      // ponytail: fallback — check phases only
      const required = ['OPSX_EXPLORE', 'OPSX_PROPOSE', 'OPSX_APPLY', 'OPSX_ARCHIVE'];
      return required.every((id) => this.phases.some((p) => p.id === id && p.status === 'complete'));
    }
  }

  addCheckpoint(label) {
    const cp = {
      label,
      phase: this.goalState,
      iteration: this.iterationCount,
      timestamp: new Date().toISOString(),
      errors: [...this.errors],
    };
    this.checkpoints.push(cp);
    this.persist();
    return cp;
  }

  canContinue() {
    if (this.iterationCount >= ITERATION_LIMIT) return false;
    if (this.goalState === GOAL_STATES.FAILED) return false;
    if (this.goalState === GOAL_STATES.COMPLETE) return false;
    if (this.staleIterationCount >= MAX_STALE_ITERATIONS) return false;
    return true;
  }

  /**
   * Check for staleness by comparing current progress with the last snapshot.
   * Returns true if progress has stalled (same percentage for MAX_STALE_ITERATIONS).
   */
  checkStaleness() {
    try {
      const { completionPct } = measureProgress(this);
      if (completionPct === this.lastProgressPct) {
        this.staleIterationCount++;
      } else {
        this.staleIterationCount = 0;
        this.lastProgressPct = completionPct;
      }
    } catch {
      this.staleIterationCount++;
    }
    return this.staleIterationCount >= MAX_STALE_ITERATIONS;
  }

  // ── V13: Shared memory methods ──

  /**
   * Record a finding in shared memory. Agents append structured findings
   * so subsequent agents can read previous reasoning.
   */
  recordFinding(type, content, confidence = 1.0, agent = null) {
    const finding = {
      type,
      content,
      confidence,
      agent: agent || 'unknown',
      timestamp: new Date().toISOString(),
    };
    this.sharedMemory.findings.push(finding);
    this.persist();
    return finding;
  }

  /**
   * Record an architectural decision with rationale.
   */
  recordDecision(decision, rationale, alternatives = []) {
    this.sharedMemory.decisions.push({
      decision, rationale, alternatives,
      timestamp: new Date().toISOString(),
    });
    this.persist();
  }

  /**
   * Record a risk assessment.
   */
  recordRisk(risk, severity = 'medium', mitigation = '') {
    this.sharedMemory.risks.push({ risk, severity, mitigation });
    this.persist();
  }

  /**
   * Record an assumption for later validation.
   */
  recordAssumption(assumption, by = null) {
    this.sharedMemory.assumptions.push({
      assumption, validated: false, by: by || 'unknown',
      timestamp: new Date().toISOString(),
    });
    this.persist();
  }

  /**
   * Mark an assumption as validated.
   */
  validateAssumption(index) {
    if (this.sharedMemory.assumptions[index]) {
      this.sharedMemory.assumptions[index].validated = true;
      this.persist();
    }
  }

  /**
   * Get all findings relevant to a specific phase.
   */
  findingsForPhase(phaseId) {
    const relevant = [];
    for (const f of this.sharedMemory.findings) {
      if (!f.phase || f.phase === phaseId) relevant.push(f);
    }
    // Also include decisions and risks
    for (const d of this.sharedMemory.decisions) relevant.push({
      type: 'decision', content: `${d.decision}: ${d.rationale}`,
      confidence: 1.0, agent: 'unknown', timestamp: d.timestamp,
    });
    for (const r of this.sharedMemory.risks) relevant.push({
      type: 'risk', content: `[${r.severity}] ${r.risk} — ${r.mitigation || 'no mitigation'}`,
      confidence: 0.8, agent: 'unknown', timestamp: '',
    });
    return relevant;
  }

  // ── End V13 memory methods ──

  /**
   * Persist the full context to disk for resume/recovery.
   */
  persist() {
    try {
      if (!existsSync(stateDir)) mkdirSync(stateDir, { recursive: true });
      writeFileSync(
        resolve(stateDir, `${this.executionId}-context.json`),
        JSON.stringify(this.toJSON(), null, 2),
        'utf-8',
      );
    } catch { /* non-critical */ }
  }

  /**
   * Load a previously persisted context.
   */
  static load(executionId) {
    try {
      const fp = resolve(stateDir, `${executionId}-context.json`);
      if (!existsSync(fp)) return null;
      const raw = JSON.parse(readFileSync(fp, 'utf-8'));
      const ctx = new PipelineContext(raw.task, {
        dryRun: raw.dryRun,
        skipBuild: raw.skipBuild,
        autoApprove: raw.autoApprove,
      });
      Object.assign(ctx, raw);
      Object.setPrototypeOf(ctx, PipelineContext.prototype);
      return ctx;
    } catch { return null; }
  }

  toJSON() {
    return {
      executionId: this.executionId,
      task: this.task,
      changeName: this.changeName,
      dryRun: this.dryRun,
      skipBuild: this.skipBuild,
      autoApprove: this.autoApprove,
      planOnly: this.planOnly,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      totalDuration: this.totalDuration,
      branch: this.branch,
      status: this.status,
      project: this.project,
      skills: this.skills,
      agents: this.agents,
      featureId: this.featureId,
      featureName: this.featureName,
      affectedSpecs: this.affectedSpecs,
      validation: this.validation,
      phaseResults: this.phaseResults,
      phases: this.phases,
      errors: this.errors,
      warnings: this.warnings,
      goalState: this.goalState,
      iterationCount: this.iterationCount,
      targetDescription: this.targetDescription,
      checkpoints: this.checkpoints,
      lastProgressPct: this.lastProgressPct,
      staleIterationCount: this.staleIterationCount,
      sharedMemory: this.sharedMemory,
      repository: this.repository,
      composedSkills: this.composedSkills,
      agentTeams: this.agentTeams,
    };
  }

  summary() {
    const passed = this.phases.filter((p) => p.status === 'complete').length;
    const failed = this.phases.filter((p) => p.status === 'failed').length;
    const skipped = this.phases.filter((p) => p.status === 'skipped').length;
    return {
      executionId: this.executionId,
      task: this.task,
      status: this.status,
      project: this.project.name,
      framework: this.project.framework,
      skills: this.skills,
      phases: this.phases.map((p) => ({ id: p.id, status: p.status, duration: p.duration })),
      passed, failed, skipped,
      totalDuration: this.totalDuration,
    };
  }
}

export function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 40)
    .replace(/^-+|-+$/g, '');
}
