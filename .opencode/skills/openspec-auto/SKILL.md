---
name: openspec-auto
description: >
  Single intelligent entry point for the complete Spec-Driven Development lifecycle.
  The AI agent autonomously executes the entire engineering workflow —
  analyze → explore → propose → implement → validate → archive —
  using a goal-oriented execution loop. One command, zero manual phase invocation.
  Stops only when the goal is verified complete or an unrecoverable failure occurs.
license: MIT
compatibility: OpenSpec >= 1.0, Node.js >= 18
metadata:
  version: "12.0"
  generatedBy: "2.0.0"
  triggers:
    - /opsx-auto
    - opsx auto
    - auto orchestrate
    - auto pipeline
  domains:
    - orchestration
    - spec-driven-development
    - automation
    - quality-assurance
    - meta
---

# OpenSpec Autonomous Orchestration — AI Behavior Specification v12.0

## Purpose

Single intelligent entry point for the complete Spec-Driven Development lifecycle.
The AI agent autonomously executes the entire engineering workflow from a single
command, driving all phases sequentially until the goal is verified complete or
an unrecoverable failure occurs.

## Prerequisites

- `openspec/` directory with `specs/` and `changes/` structure
- `orchestrate/` runtime modules (auto-pipeline.mjs, state-manager.mjs, etc.)
- `site.json` with company data and page inventory
- `DESIGN.md/` with design system rules
- `features/features.json` feature registry
- Node.js >= 18

## Related Skills

| Skill | Role | When Used |
|-------|------|-----------|
| `openspec-explore` | Codebase understanding | Phase 4 (EXPLORE) |
| `openspec-propose` | Artifact generation | Phase 5 (PROPOSE) |
| `openspec-sync` | Delta spec merging | Phase 6 (SYNC) |
| `openspec-apply` | Task implementation | Phase 7 (APPLY) |
| `openspec-verify` | Standalone verification | Outside auto pipeline |
| `openspec-archive` | Change archival | Phase 9 (ARCHIVE) |

This skill is the **orchestrator** — it invokes the others via the JS runtime
or delegates to the AI agent for intelligence tasks.

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

## 2. Goal-Oriented Execution Loop

After the user types `/opsx-auto "Build the Pricing Page"`, you enter the loop:

```
┌─────────────────────────────────────────────────────────────┐
│                     GOAL-ORIENTED LOOP V12                   │
│                                                              │
│  1. INITIALIZE                                               │
│     └─→ initPipeline() → execution context                   │
│                                                              │
│  2. ANALYZE REPOSITORY                                       │
│     └─→ runDeepScan() → project, specs, features, pages      │
│                                                              │
│  3. DISCOVER SKILLS + ROUTE AGENTS                           │
│     └─→ runSkillDiscovery() → top skills, agents, gates      │
│                                                              │
│  4. EXPLORE (AI Intelligence)                                │
│     └─→ Read affected specs, features, DESIGN.md, site.json  │
│     └─→ Understand what exists and what must change          │
│                                                              │
│  5. PROPOSE (AI Intelligence)                                │
│     └─→ Write proposal.md, design.md, tasks.md directly      │
│     └─→ Create delta specs in specs/ directory                │
│     └─→ HUMAN GATE 1: Show proposal, confirm scope           │
│                                                              │
│  6. SYNC (Infrastructure)                                    │
│     └─→ runSync() → merge delta specs to main                │
│                                                              │
│  7. IMPLEMENT (AI Intelligence)                              │
│     └─→ Execute tasks from tasks.md one by one               │
│     └─→ Build after each change: npm run build               │
│     └─→ Mark tasks [x] as completed                          │
│                                                              │
│  8. VALIDATE (Infrastructure + AI)                           │
│     └─→ runValidate() → build, lint, test, quality gates     │
│     └─→ If failures: analyze, fix, re-validate               │
│     └─→ Loop until all mandatory gates pass                  │
│                                                              │
│  9. ARCHIVE (Infrastructure + AI)                            │
│     └─→ runArchive() → sync, trace, doc sync                 │
│     └─→ Verify all artifacts exist on disk                   │
│     └─→ HUMAN GATE 2: Confirm archive                        │
│                                                              │
│ 10. MEASURE PROGRESS                                         │
│     └─→ measureProgress() → completion percentage            │
│     └─→ isGoalAchieved() → true/false                        │
│                                                              │
│ 11. GOAL COMPLETE?                                           │
│     ├─→ YES → Finalize, report, DONE                         │
│     └─→ NO  → Iterate (go to step 4 or step 7)              │
│                                                              │
│  Safety: Max 20 iterations. If limit hit, stop and report.   │
└─────────────────────────────────────────────────────────────┘
```

### 2.1 Loop Rules

- **Do NOT exit the loop early.** Only exit when `isGoalAchieved()` returns true
  or when an unrecoverable failure occurs (fatal phase error, iteration limit, staleness).
- **After each validation failure, fix and re-validate.** Don't just log and continue.
- **After implementing, refresh your repository understanding** by re-reading
  affected files, specs, and the dependency graph.
- **Phase states are tracked in `ctx.phases[]`.** Check `isPhaseComplete()` and
  `isPhaseFailed()` to avoid re-running completed phases.
- **V12 Staleness detection:** If 3 consecutive iterations show no progress change,
  the pipeline stops automatically to prevent infinite loops.
- **V12 Circuit breaker:** Steps that fail 3 times consecutively are skipped to
  prevent cascading failures.
- Use `/opsx:verify` standalone to check a change independently of the auto pipeline.

## 3. Decision Framework

### 3.1 When to Use Each Phase

| Phase | When to Run | How |
|-------|------------|-----|
| `initPipeline()` | Once, at start | JS runtime |
| `runDeepScan()` | Once, at start; re-run if repo changes significantly | JS runtime |
| `runSkillDiscovery()` | Once, at start; re-run if task understanding changes | JS runtime |
| Explore | Every iteration that needs codebase context | **AI intelligence** |
| Propose | When no proposal.md exists | **AI intelligence** (write files directly) |
| Sync | After proposal changes delta specs | JS runtime |
| Apply | When tasks.md has unchecked items | **AI intelligence** (implement tasks) |
| Validate | After every implementation batch | JS runtime |
| Verify | Standalone: before archive, after partial implementation | **AI intelligence** (run checks) |
| Archive | When goal achieved | JS runtime + AI intelligence |

### 3.2 When to Ask the User (Question Engine)

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

**Question format:** One clear, high-value question. Provide context. Offer your
recommended answer. Never ask multiple questions at once.

### 3.3 When to Iterate vs. Finish

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

### 4.1 Initial Scan (runDeepScan)

The JS runtime automatically:
- Reads all 24 capability specs from `openspec/specs/`
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

## 5. Skill Intelligence

### 5.1 Initial Discovery

`runSkillDiscovery()` automatically:
- Scans ~271 global skills + 6 project skills
- Scores by TF-IDF with domain filtering
- Boosts project-local skills (5x multiplier)
- Boosts framework-matching skills (3x multiplier)
- Returns top 12 scored skill names in `ctx.skills`

### 5.2 Dynamic Re-Evaluation

If your task understanding evolves significantly (e.g., you discover you also need
SEO work or animation), re-run `discoverSkills(ctx.task, newDomains, 12, ctx.project)`.

### 5.3 Skill Loading

When you need a skill's full instructions, use the **Skill** tool to load it by name.
Only load skills when you're about to use them — don't pre-load all 12.

## 6. Agent Routing

### 6.1 Primary Agent

Determined dynamically from task analysis. The agent router selects based on:
- Task domains (frontend, design, seo, etc.)
- Required roles (implementation, review, testing, etc.)
- Branch context (main adds security-reviewer; feature/* skips doc-updater)

### 6.2 Agent Collaboration Pattern

For complex tasks, use multiple agents sequentially, not all at once:
1. **Explore/Plan** — analyze codebase, understand architecture
2. **Implement** — write code, build, test
3. **Review** — verify quality, check design system compliance
4. **Validate** — run tests, lint, accessibility checks
5. **Document** — update specs, traceability, archive

Use the **Task** tool to delegate work to specialized agents when appropriate.

## 7. Validation Loop

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

When safe, auto-fix common issues instead of asking:
- Lint errors → run `npm run lint -- --fix`
- Missing CSS variable → replace hardcoded color with nearest `var(--*)`
- Missing nav/footer includes → add `<!-- INCLUDE: nav -->` and `<!-- INCLUDE: footer -->`
- Placeholder mismatch → replace with `{{PHONE}}`, `{{EMAIL}}`, `{{YEAR}}`

If auto-fix is not safe, report the issue and fix it directly.

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

## 9. V12 Safety Mechanisms

### 9.1 Staleness Detection

If 3 consecutive iterations show **no progress change** (same `completionPct`),
the pipeline automatically stops. Output:

```
[STALE] No progress for 3 iterations (75%). Pipeline stalled.
```

**What this means for you:** If you're in the goal loop and the same validation
keeps failing in the same way, fix the root cause — don't re-run. The system
will stop you after 3 identical failures.

### 9.2 Circuit Breaker

Pipeline steps that fail **3 times consecutively** are skipped. Output:

```
[OPEN] Circuit open for step "build" — skipping
```

**What this means for you:** If a step keeps failing with the same error,
the pipeline skips it to prevent cascading failures. Fix the underlying
issue, then restart the pipeline (circuit state resets on `initPipeline()`).

### 9.3 Iteration Limit

Hard cap at **20 iterations**. Reaching this limit produces a partial completion
report with exact remaining work.

### 9.4 Degraded Mode

Non-fatal phase failures allow remaining phases to continue. Fatal phases
(PROPOSE, APPLY) halt the pipeline with a partial report and recovery guidance.

## 10. Human Gates

Only two human gates interrupt autonomous execution:

### GATE 1: Proposal Review
**When:** After you've written proposal.md, design.md, tasks.md.
**What:** Show a brief summary (1-3 lines). Ask if the scope looks right.
**If approved:** Continue to implementation.
**If not:** Adjust based on feedback, re-show.

### GATE 2: Archive Confirmation
**When:** After all tasks complete and validation passes.
**What:** Show completion summary. Ask to confirm archive.
**If approved:** Run archive, produce final report.
**If not:** Report what remains to be done.

## 11. Recovery

### 10.1 Checkpoint Recovery

State persists after every phase to `orchestrate/.state/{executionId}-context.json`.
To resume after interruption:

```
Read orchestrate/.state/{executionId}-context.json
Resume from ctx.nextPhaseId
```

Or via the JS runtime:
```js
const ctx = resumePipeline(executionId);
// ctx.phases shows statuses; ctx.nextPhaseId shows what's next
```

### 10.2 Execution ID

The execution ID is printed at start: `task-slug-{timestamp}`. Use this for
state lookup and audit trail correlation.

## 12. Observability

### 11.1 Progress Display

After each phase, display:
```
[3/8] Explore — ✓ Completed (0.3s)
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

### 11.2 Final Report

When complete, display:
```
─── Goal Achieved ───
  Task: Build Pricing Page
  Iterations: 2
  Phases: 8/8 complete
  Duration: 12.4s
  Artifacts: proposal.md, design.md, tasks.md, traceability.md
  Archive: openspec/changes/build-pricing-page/
```

### 11.3 Audit Trail

Every action is logged to `orchestrate/.audit.jsonl` with timestamps.
Query: `queryEvents({ type: 'auto-pipeline' })`

## 13. Usage Modes

```
/opsx-auto "Build the Pricing Page"           # Full autonomous pipeline
/opsx-auto "Fix the hero section overflow"     # Targeted fix
/opsx-auto --dry-run "Add newsletter flow"     # Plan only (stop after skill discovery)
/opsx-auto --skip-build "Improve navigation"   # Skip validation phase
```

## 14. Module Reference

### AI Agent Calls (You Call These)

| Function | Purpose | Module |
|----------|---------|--------|
| `initPipeline(task, opts)` | Create execution context | `auto-pipeline.mjs` |
| `runDeepScan(ctx)` | Analyze repository | `auto-pipeline.mjs` |
| `runSkillDiscovery(ctx)` | Discover skills + route agents | `auto-pipeline.mjs` |
| `runSync(ctx)` | Merge delta specs | `auto-pipeline.mjs` |
| `runValidate(ctx)` | Build + lint + test + gates | `auto-pipeline.mjs` |
| `runArchive(ctx)` | Sync + trace + docs | `auto-pipeline.mjs` |
| `finishPipeline(ctx)` | Verify + report | `auto-pipeline.mjs` |
| `resumePipeline(id)` | Load persisted state | `auto-pipeline.mjs` |
| `isPhaseComplete(ctx, id)` | Check phase status | `auto-pipeline.mjs` |
| `isPhaseFailed(ctx, id)` | Check phase failure | `auto-pipeline.mjs` |
| `getPhaseInstructions(ctx, id)` | AI prompt for phase | `auto-pipeline.mjs` |
| `measureProgress(ctx)` | Goal completion % | `progress-tracker.mjs` |
| `isGoalAchieved(ctx)` | True if done | `progress-tracker.mjs` |
| `progressSummary(ctx)` | Human-readable progress | `progress-tracker.mjs` |

### Available Imports

```js
const {
  initPipeline, runDeepScan, runSkillDiscovery,
  runExplore, runPropose, runSync, runApply,
  runValidate, runArchive, finishPipeline,
  getPhaseInstructions, resumePipeline,
  isPhaseComplete, isPhaseFailed,
  PipelineContext, GOAL_STATES, ITERATION_LIMIT,
} = await import('./orchestrate/auto-pipeline.mjs');

const { measureProgress, isGoalAchieved, progressSummary }
  = await import('./orchestrate/progress-tracker.mjs');
```

## 15. Extension Points

| Extension | File | Mechanism |
|-----------|------|-----------|
| New phase | `auto-pipeline.mjs` | Add method + PHASE_ORDER entry + PHASE_IS_FATAL |
| New validation level | `validation-pipeline.mjs` | Add case to `runLevel()` |
| New quality gate | `quality-gate.mjs` | Add case to `runGate()` |
| New intent | `capability-analyzer.mjs` | Add entry to TAXONOMY array |
| New pipeline config | `pipeline-config/*.yaml` | Create YAML, reference from phase |
| New hook | `hooks/` directory | Create `.mjs` matching lifecycle event |
| New progress signal | `progress-tracker.mjs` | Add check to `measureProgress()` |

## 16. References

| Document | Path |
|----------|------|
| Command definition | `.opencode/commands/opsx-auto.md` |
| Verify command | `.opencode/commands/opsx-verify.md` |
| Verify skill | `.opencode/skills/openspec-verify/SKILL.md` |
| State machine | `orchestrate/auto-pipeline.mjs` |
| Context class | `orchestrate/pipeline-context.mjs` |
| Progress tracker | `orchestrate/progress-tracker.mjs` |
| OPSX commands | `orchestrate/opsx-commands.mjs` |
| Skill discovery | `orchestrate/skill-discovery.mjs` |
| Capability analyzer | `orchestrate/capability-analyzer.mjs` |
| Spec resolver | `orchestrate/spec-resolver.mjs` |
| Quality gates | `orchestrate/quality-gate.mjs` |
| Validation pipeline | `orchestrate/validation-pipeline.mjs` |
| State manager | `orchestrate/state-manager.mjs` |
| Event bus | `orchestrate/event-bus.mjs` |
| Design system | `DESIGN.md/` |
| Feature registry | `features/features.json` |
| Site config | `site.json` |

## 17. Anti-Patterns

- **DO NOT** skip phases — the pipeline validates at every stage; skipping creates untestable gaps
- **DO NOT** re-run completed phases without checking `isPhaseComplete()` first
- **DO NOT** ignore staleness warnings — if validation fails the same way 3 times, fix the root cause
- **DO NOT** manually archive without verification — use the pipeline's `verifyCompletion()` check
- **DO NOT** ask "shall I continue?" between phases — the pipeline is autonomous by design
- **DO NOT** override `SAFETY_RULES.protectedDirs` — these protect the repository from accidental damage

## 18. Changelog

| Version | Date | Changes |
|---------|------|---------|
| v12.0 | 2026-07-04 | Added staleness detection (3-iteration stall), circuit breaker (3 consecutive failures), degraded mode, concurrency limiter. |
| v11.0 | 2026-06 | Initial V11 autonomous orchestration engine. Goal-oriented loop, phase runner, checkpoint/resume, human gates. |
