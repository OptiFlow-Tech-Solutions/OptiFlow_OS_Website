---
name: openspec-auto
description: >
  Single intelligent entry point for the complete Spec-Driven Development lifecycle.
  The AI agent autonomously executes the entire engineering workflow —
  repository intelligence → explore → propose → sync → apply → validate → verify → archive —
  using a goal-oriented execution loop with shared memory, dynamic skill composition,
  and per-phase agent teams. One command, zero manual phase invocation.
  Stops only when the goal is verified complete or an unrecoverable failure occurs.
license: MIT
compatibility: OpenSpec >= 1.0, Node.js >= 18
metadata:
  version: "14.0"
  enterprise: true
  generatedBy: "2.1.0"
  triggers:
    - /opsx-auto
    - opsx auto
    - auto orchestrate
    - auto pipeline
    - autonomous pipeline
    - master orchestrator
  domains:
    - orchestration
    - spec-driven-development
    - automation
    - quality-assurance
    - meta
  orchestration:
    role: master-orchestrator
    coordinates: [OPSX_EXPLORE, OPSX_PROPOSE, OPSX_SYNC, OPSX_APPLY, VALIDATE, OPSX_VERIFY, OPSX_ARCHIVE]
    entryPoint: /opsx-auto
  relatedSkills:
    - openspec-explore
    - openspec-propose
    - openspec-sync
    - openspec-apply
    - openspec-verify
    - openspec-archive
  outputContracts:
    - proposal.md (scope + rationale)
    - design.md (architecture + decisions)
    - tasks.md (implementation checklist)
    - delta-specs (ADDED/MODIFIED/REMOVED requirements)
    - traceability.md (spec → task → commit → file chain)
    - audit.jsonl (timestamped event log)
    - telemetry-summary.json (execution stats)
  changelog: |
    v14.0 (2026-07-04): Enterprise upgrade — 13-stage master orchestrator, complete lifecycle
      integration (explore→propose→sync→apply→validate→verify→archive),
      dynamic skill intelligence with automatic composition, per-phase agent teams,
      shared execution context, dependency-aware execution, continuous validation,
      enterprise telemetry dashboard, improved recovery, backward compatible.
    v13.0 (2026-07-03): V13 master orchestrator — repository snapshot (parallel analysis),
      9-role skill composer, per-phase agent composer, iteration controller
      (enter→analyze→plan→execute→validate→decide), shared memory, enterprise telemetry.
    v12.0 (2026-07-02): Staleness detection (3-iteration stall), circuit breaker
      (3 consecutive failures), degraded mode, concurrency limiter.
    v11.0 (2026-06-30): Initial V11 autonomous orchestration engine.
---

# OpenSpec Autonomous Orchestration — AI Behavior Specification v14.0

## Purpose

Single intelligent entry point for the complete Spec-Driven Development lifecycle.
The AI agent autonomously executes the entire engineering workflow from a single
command, driving all 13 stages sequentially until the goal is verified complete or
an unrecoverable failure occurs.

## Prerequisites

- `openspec/` directory with `specs/` and `changes/` structure
- `orchestrate/` runtime modules (auto-pipeline-v13.mjs, state-manager.mjs, etc.)
- `site.json` with company data and page inventory
- `DESIGN.md/` with design system rules
- `features/features.json` feature registry (optional)
- Node.js >= 18

## Lifecycle Agent Architecture

```
/opsx-auto (Master Orchestrator)
  │
  ├─ Explore Agent (OPSX_EXPLORE)
  │   Role: repository-analyst
  │   Skill: openspec-explore
  │
  ├─ Propose Agent (OPSX_PROPOSE)
  │   Role: proposal-writer  [FATAL]
  │   Skill: openspec-propose
  │
  ├─ Sync Agent (OPSX_SYNC)
  │   Role: spec-synchronizer
  │   Skill: openspec-sync
  │
  ├─ Apply Agent (OPSX_APPLY)
  │   Role: implementer  [FATAL]
  │   Skill: openspec-apply
  │
  ├─ Validate Agent (VALIDATE)
  │   Role: build-validator
  │   Runtime: auto-pipeline.mjs
  │
  ├─ Verify Agent (OPSX_VERIFY)
  │   Role: quality-verifier
  │   Skill: openspec-verify
  │
  └─ Archive Agent (OPSX_ARCHIVE)
      Role: archivist
      Skill: openspec-archive
```

## 1. Core Philosophy

You are the **autonomous engineering agent** for Spec-Driven Development. The user
executes one command:

```
/opsx-auto "<task>"
```

From that single command, you autonomously drive the complete engineering lifecycle
until the requested outcome is verified complete or an unrecoverable failure occurs.

### 1.1 Agent-Infrastructure Split

| Layer | Responsibility | Location |
|-------|---------------|----------|
| **You (AI Agent)** | Intelligence: analysis, decisions, code generation, quality judgment | This SKILL.md |
| **JS Runtime** | Infrastructure: context, discovery, validation, build, file I/O, state | `orchestrate/` |

You call the JS runtime for infrastructure tasks. You handle all intelligence tasks
yourself using your tools (Read, Write, Edit, Bash, Task, etc.).

### 1.2 Execution Guarantees

1. **Continuous execution** — Do not stop between phases. Only stop when the
   goal is verified complete or an unrecoverable failure occurs.
2. **Goal-oriented** — Every action serves progress toward the user's stated goal.
3. **Iterative refinement** — Validate, fix, re-validate until quality gates pass.
4. **Resumable** — State persists after every phase. Interruptions recover cleanly.
5. **Traceable** — Every change traces back through tasks → specs → commits.

## 2. Complete Lifecycle (13 Stages)

```
┌─────────────────────────────────────────────────────────────┐
│              ENTERPRISE ORCHESTRATION v14                    │
│                                                              │
│  STAGE 1-5: INITIALIZATION (Parallel where safe)             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 1. Repository Intelligence                           │    │
│  │ 2. Task Understanding                                │    │
│  │ 3. Repository Analysis      ← parallel with 1,2      │    │
│  │ 4. Skill Discovery           ← parallel with 1,2,3   │    │
│  │ 5. Agent Composition         ← after 1-4 complete    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  STAGE 6-12: LIFECYCLE (Sequential, dependency-aware)       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  6. Explore   ─→ 7. Propose  ─→ 8. Sync             │    │
│  │       │              │              │                │    │
│  │       └──────────────┴──────────────┘                │    │
│  │                      ↓                               │    │
│  │  9. Apply  ─→ 10. Validate  ─→ 11. Verify           │    │
│  │       │              │              │                │    │
│  │       └──────────────┴──────────────┘                │    │
│  │                      ↓                               │    │
│  │                 12. Archive                           │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  STAGE 13: COMPLETION                                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 13. Completion Report + Enterprise Telemetry          │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  Safety: Max 20 iterations. Staleness detection (3).         │
│  Circuit breaker (3 consecutive failures).                   │
│  Shared memory persists across iterations.                   │
└─────────────────────────────────────────────────────────────┘
```

### 2.1 Goal-Oriented Loop

After initialization, the system enters a controlled iteration loop:

```
ANALYZE → planIteration() → which phases should run this iteration?
PLAN    → validatePrerequisites() → are dependencies satisfied?
EXECUTE → run phases in priority order → handle errors
VALIDATE→ measureProgress() → check quality gates
DECIDE  → goalMet? → archive → finish
          canContinue? → iterate
          else → fail with partial report
```

### 2.2 Loop Rules

- **Do NOT exit the loop early.** Only exit when `isGoalAchieved()` returns true
  or when an unrecoverable failure occurs.
- **After each validation failure, fix and re-validate.** The iteration controller handles this automatically.
- **After implementing, refresh your repository understanding** by re-reading affected files.
- **Phase states are tracked in `ctx.phases[]`.**
- **V14 Staleness detection:** If 3 consecutive iterations show no progress change, the pipeline stops.
- **V14 Circuit breaker:** Steps that fail 3 times consecutively are skipped.
- **V14 Shared memory:** Agents record findings, decisions, risks, assumptions in `ctx.sharedMemory`.

## 3. Decision Framework

### 3.1 When to Use Each Phase

| Phase | When to Run | How |
|-------|------------|-----|
| `initPipelineV13()` | Once, at start | JS runtime |
| `buildRepositorySnapshot()` | Once, at start; parallel read-only analysis | JS runtime |
| `composeSkills()` | Once, at start | JS runtime |
| `composeAgentTeam()` | Once, at start | JS runtime |
| Explore | Every iteration that needs codebase context | **AI intelligence** |
| Propose | When no proposal.md exists | **AI intelligence** |
| Sync | After proposal changes delta specs | JS runtime |
| Apply | When tasks.md has unchecked items | **AI intelligence** |
| Validate | After every implementation batch | JS runtime |
| Verify | Standalone: before archive | **AI intelligence** |
| Archive | When goal achieved | JS runtime + AI intelligence |

### 3.2 When to Ask the User

**Only ask when execution cannot safely continue without an answer:**

1. **Blocking ambiguity** — The task description could mean multiple fundamentally
   different things, and your best interpretation could be significantly wrong.
2. **Human gate** — At proposal review (GATE 1) and archive confirmation (GATE 2).
3. **Unrecoverable error** — A fatal phase failed and you cannot determine the fix.

**Never ask when:**
- You can make a reasonable assumption and proceed.
- The question is about implementation details you can decide.
- The user has already provided sufficient context.
- You're about to ask "shall I continue?" between phases — just continue.

### 3.3 Iterate vs. Finish

```
measureProgress(ctx) → completionPct, blockers

IF completionPct >= 90 AND blockers.length === 0:
    → Archive → Finish

IF blockers.length > 0:
    → Fix blockers → Re-validate → Re-measure

IF completionPct < 90:
    → Identify unmet criteria → Implement remaining work → Re-validate

IF ctx.iterationCount >= 20:
    → Stop, report partial completion with exact remaining work
```

## 4. Repository Intelligence

### 4.1 Initial Scan

The JS runtime automatically:
- Reads all capability specs from `openspec/specs/`
- Reads `site.json` for company data and page inventory
- Reads `features/features.json` for feature registry
- Reads `DESIGN.md/` for design system rules
- Analyzes project structure, framework, architecture style
- Resolves affected specs for the task
- Reads AGENTS.md for agent instructions

### 4.2 Continuous Refresh

After making file changes, refresh your understanding:
- If you created/modified a page: re-read `site.json`, `DESIGN.md/`
- If you changed a shared asset: re-read `assets/css/core.css`, `assets/js/core.js`
- If you affected specs: re-read relevant `openspec/specs/*/spec.md` files
- After validation failures: re-read the failing files, understand the errors

### 4.3 Design System Compliance (Project Override)

> **PROJECT OVERRIDE:** This section contains OptiFlow OS-specific rules.
> Replace with your project's design system conventions.

When building pages, ALWAYS follow `DESIGN.md/DESIGN.md` rules:
- Use CSS variables (`var(--*)`) for all colors, never hardcode hex values
- Use `var(--gap-*)` for spacing
- Use `.display`, `h1`-`h6`, `.lead`, `.body` typography classes
- Never hardcode company info — use `{{PHONE}}`, `{{EMAIL}}`, `{{YEAR}}` placeholders
- Include nav/footer via `<!-- INCLUDE: nav -->` and `<!-- INCLUDE: footer -->`
- Page-specific styles in `<style>` block in `<head>`
- Shared styles go in `assets/css/core.css`, never in page files

## 5. Dynamic Skill Intelligence

### 5.1 Initial Discovery

`buildRepositorySnapshot()` automatically:
- Scans ~271 global skills + project-local skills in parallel
- Scores by TF-IDF with domain filtering
- Boosts project-local skills (5x multiplier)
- Boosts framework-matching skills (3x multiplier)
- Returns skill metadata in `ctx.repository.skillMetadata`

### 5.2 Skill Composition by Role

`composeSkills()` assigns skills to 9 workflow roles:
- **repo-analyst** — codebase exploration (EXPLORE phase)
- **planner** — architecture and approach (EXPLORE phase)
- **designer** — visual design and accessibility (PROPOSE phase)
- **spec-writer** — formal specifications (PROPOSE phase)
- **implementer** — code generation (APPLY phase)
- **tester** — test execution (VALIDATE phase)
- **reviewer** — quality/security/accessibility review (VALIDATE phase)
- **deployer** — deployment and finalization (ARCHIVE phase)
- **documenter** — documentation and traceability (ARCHIVE phase)

The system selects the best skill per role with deduplication.

### 5.3 Skill Loading

When you need a skill's full instructions, use the **Skill** tool to load it by name.
Only load skills when you're about to use them — don't pre-load all skills.

## 6. Dynamic Agent Composition

### 6.1 Per-Phase Agent Teams

`composeAgentTeam(phaseId, ctx)` assigns agents per lifecycle phase:
- **OPSX_EXPLORE** — planner + architect support
- **OPSX_PROPOSE** — planner + architect support
- **OPSX_SYNC** — planner + architect + code-reviewer
- **OPSX_APPLY** — tdd-guide + code-reviewer support
- **VALIDATE** — tdd-guide + code-reviewer + security-reviewer
- **OPSX_VERIFY** — code-reviewer + security-reviewer
- **OPSX_ARCHIVE** — doc-updater + reviewer support

Selection uses capability-based matching with static domain-phase fallbacks.
Branch context adds security-reviewer (main) or e2e-runner (staging).

### 6.2 Agent Collaboration Pattern

For complex tasks, use multiple agents sequentially, not all at once:
1. **Explore/Plan** — analyze codebase, understand architecture
2. **Implement** — write code, build, test
3. **Review** — verify quality, check design system compliance
4. **Validate** — run tests, lint, accessibility checks
5. **Document** — update specs, traceability, archive

## 7. Validation Pipeline

After every implementation batch, run validation:

```
BUILD → LINT → TESTS → TYPE CHECK → A11Y → SEO → QUALITY GATES

If any fail:
  1. Read the error output
  2. Fix the specific issue
  3. Re-build, re-validate
  4. Continue until clean or iteration limit
```

### 7.1 Validation Levels (L1-L7)

| Level | Check | Tool |
|-------|-------|------|
| L1 | HTML + JS + CSS linting | `html-validate` |
| L2 | Full source build | `node scripts/assemble.mjs` |
| L3 | Link check + data consistency | `node scripts/validate.mjs` |
| L4 | Design audit | `hooks/theme-change.mjs` |
| L5 | SEO audit | Playwright SEO spec |
| L6 | A11y scan | Playwright + axe-core |
| L7 | Full E2E suite | Playwright |

### 7.2 Auto-Fix Rules

When safe, auto-fix common issues:
- Lint errors → run `npm run lint -- --fix`
- Missing CSS variable → replace hardcoded color with nearest `var(--*)`
- Missing nav/footer includes → add `<!-- INCLUDE: nav -->` and `<!-- INCLUDE: footer -->`
- Placeholder mismatch → replace with `{{PHONE}}`, `{{EMAIL}}`, `{{YEAR}}`

## 8. Archive Lifecycle

Archive is not just a terminal phase. Maintain these continuously:

| Artifact | Purpose | Updated When |
|----------|---------|-------------|
| `proposal.md` | What and why | After scope changes |
| `design.md` | How | After design decisions |
| `tasks.md` | Implementation steps | After each task completion |
| `traceability.md` | Spec → task → commit chain | On archive |
| `specs/` | Delta specs | When requirements change |

### 8.1 Archive Verification

Before declaring completion, verify every artifact:
```
proposal.md    exists  ✓
design.md      exists  ✓
tasks.md       exists  ✓
traceability.md exists ✓
All tasks [x]  checked ✓
Build passes   ✓
```

## 9. Safety Mechanisms

### 9.1 Staleness Detection

If 3 consecutive iterations show **no progress change**, the pipeline stops.

### 9.2 Circuit Breaker

Pipeline steps that fail **3 times consecutively** are skipped to prevent cascading failures.

### 9.3 Iteration Limit

Hard cap at **20 iterations**. Reaching this limit produces a partial completion report.

### 9.4 Degraded Mode

Non-fatal phase failures allow remaining phases to continue. Fatal phases
(PROPOSE, APPLY) halt the pipeline with a partial report and recovery guidance.

## 10. Human Gates

Only two human gates interrupt autonomous execution:

### GATE 1: Proposal Review
**When:** After explore + propose.
**What:** Show a brief summary (1-3 lines). Ask if the scope looks right.

### GATE 2: Archive Confirmation
**When:** After all tasks complete and validation passes.
**What:** Show completion summary. Ask to confirm archive.

## 11. Recovery

### 11.1 Checkpoint Recovery

State persists after every phase to `orchestrate/.state/{executionId}-context.json`.
To resume after interruption:

```
Read orchestrate/.state/{executionId}-context.json
Resume from ctx.nextPhaseId
```

Or via the JS runtime:
```js
const ctx = resumePipelineV13(executionId);
```

### 11.2 Execution ID

The execution ID is printed at start: `task-slug-{timestamp}`.

## 12. Observability

### 12.1 Progress Display

After each phase:
```
[6/13] Explore — ✓ Completed (0.3s)
```

After each validation cycle:
```
─── Progress: 75% ───
  ✓ Proposal artifact exists
  ✓ Design artifact exists
  ✓ Tasks artifact exists
  ○ 3/7 tasks complete (43%)
  ○ Build validation pending
```

### 12.2 Final Report

```
─── Goal Achieved ───
  Task: Build Pricing Page
  Iterations: 2
  Phases: 13/13 complete
  Duration: 12.4s
  Artifacts: proposal.md, design.md, tasks.md, traceability.md
  Archive: openspec/changes/build-pricing-page/
```

### 12.3 Audit Trail

Every action is logged to `orchestrate/.audit.jsonl` with timestamps.

## 13. Usage Modes

```
/opsx-auto "Build the Pricing Page"           # Full autonomous pipeline
/opsx-auto "Fix the hero section overflow"     # Targeted fix
/opsx-auto --dry-run "Add newsletter flow"     # Plan only (stop after skill discovery)
/opsx-auto --skip-build "Improve navigation"   # Skip validation phase
/opsx-auto --plan "Complex redesign"           # Stop after proposal for review
```

## 14. Module Reference

### AI Agent Calls

| Function | Purpose | Module |
|----------|---------|--------|
| `initPipelineV13(task, opts)` | Create V13 execution context | `auto-pipeline-v13.mjs` |
| `autoFullPipelineV13(task, opts)` | Full autonomous pipeline | `auto-pipeline-v13.mjs` |
| `buildRepositorySnapshot(task)` | Parallel repo analysis | `repository-snapshot.mjs` |
| `composeSkills(metadata, domains, phaseId)` | Role-assigned skills | `skill-composer.mjs` |
| `composeAgentTeam(phaseId, ctx)` | Phase-assigned agents | `agent-composer.mjs` |
| `runGoalLoop(ctx, executors)` | Controlled goal loop | `iteration-controller.mjs` |
| `planIteration(ctx)` | Adaptive phase planning | `execution-strategy.mjs` |
| `getContract(phaseId)` | Agent lifecycle contract | `agent-contracts.mjs` |
| `resumePipelineV13(id)` | Load persisted state | `auto-pipeline-v13.mjs` |
| `measureProgress(ctx)` | Goal completion % | `progress-tracker.mjs` |
| `isGoalAchieved(ctx)` | True if done | `progress-tracker.mjs` |
| `exportTelemetry()` | Enterprise telemetry | `telemetry.mjs` |

### Available Imports

```js
const {
  initPipelineV13, autoFullPipelineV13, resumePipelineV13,
  PipelineContext, GOAL_STATES, ITERATION_LIMIT,
} = await import('./orchestrate/auto-pipeline-v13.mjs');

const { buildRepositorySnapshot, applySnapshot }
  = await import('./orchestrate/repository-snapshot.mjs');

const { composeSkills, rolesForPhase }
  = await import('./orchestrate/skill-composer.mjs');

const { composeAgentTeam, composeAllTeams }
  = await import('./orchestrate/agent-composer.mjs');

const { runGoalLoop } = await import('./orchestrate/iteration-controller.mjs');

const { planIteration } = await import('./orchestrate/execution-strategy.mjs');

const { measureProgress, isGoalAchieved, progressSummary }
  = await import('./orchestrate/progress-tracker.mjs');

const { exportTelemetry, generateAuditReport }
  = await import('./orchestrate/telemetry.mjs');
```

## 15. Extension Points

| Extension | File | Mechanism |
|-----------|------|-----------|
| New phase | `auto-pipeline-v13.mjs` | Add executor to `PHASE_EXECUTORS` |
| New workflow role | `skill-composer.mjs` | Add entry to `WORKFLOW_ROLES` |
| New agent contract | `agent-contracts.mjs` | Add entry to `LIFECYCLE_CONTRACTS` |
| New validation level | `validation-pipeline.mjs` | Add case to `runLevel()` |
| New quality gate | `quality-gate.mjs` | Add case to `runGate()` |
| New intent | `capability-analyzer.mjs` | Add entry to TAXONOMY array |
| New pipeline config | `pipeline-config/*.yaml` | Create YAML |
| New hook | `hooks/` directory | Create `.mjs` matching lifecycle event |
| New progress signal | `progress-tracker.mjs` | Add check to `measureProgress()` |

## 16. References

| Document | Path |
|----------|------|
| Command definition | `.opencode/commands/opsx-auto.md` |
| State machine (V13) | `orchestrate/auto-pipeline-v13.mjs` |
| Iteration controller | `orchestrate/iteration-controller.mjs` |
| Execution strategy | `orchestrate/execution-strategy.mjs` |
| Repository snapshot | `orchestrate/repository-snapshot.mjs` |
| Skill composer | `orchestrate/skill-composer.mjs` |
| Agent composer | `orchestrate/agent-composer.mjs` |
| Agent contracts | `orchestrate/agent-contracts.mjs` |
| Context class | `orchestrate/pipeline-context.mjs` |
| Progress tracker | `orchestrate/progress-tracker.mjs` |
| Telemetry | `orchestrate/telemetry.mjs` |
| OPSX commands | `orchestrate/opsx-commands.mjs` |
| Validation pipeline | `orchestrate/validation-pipeline.mjs` |
| Design system | `DESIGN.md/` |
| Feature registry | `features/features.json` |
| Site config | `site.json` |

## 17. Anti-Patterns

- **DO NOT** skip lifecycle stages — the pipeline validates at every stage; skipping creates untestable gaps
- **DO NOT** re-run completed phases without checking phase status first
- **DO NOT** ignore staleness warnings — if validation fails the same way 3 times, fix the root cause
- **DO NOT** manually archive without verification — use the pipeline's `verifyCompletion()` check
- **DO NOT** ask "shall I continue?" between phases — the pipeline is autonomous by design
- **DO NOT** override `SAFETY_RULES.protectedDirs` — these protect the repository
- **DO NOT** load all skills at once — use lazy loading via the Skill tool

## 18. Changelog

| Version | Date | Changes |
|---------|------|---------|
| v14.0 | 2026-07-04 | Enterprise upgrade: complete 13-stage lifecycle, dynamic skill/agent intelligence, shared execution context, dependency-aware execution, continuous validation, enterprise telemetry, improved metadata. |
| v13.0 | 2026-07-03 | Master orchestrator: repository snapshot, 9-role skill composer, per-phase agent composer, iteration controller, shared memory. |
| v12.0 | 2026-07-02 | Staleness detection, circuit breaker, degraded mode, concurrency limiter. |
| v11.0 | 2026-06-30 | Initial V11 autonomous orchestration engine. |
