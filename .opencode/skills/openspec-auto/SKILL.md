---
name: openspec-auto
description: >
  Single intelligent entry point for the complete Spec-Driven Development lifecycle.
  The AI agent becomes the orchestration engine: it understands the repository,
  analyzes the task, discovers and composes relevant skills dynamically, and
  autonomously executes explore → propose → sync → apply → validate → archive
  without any manual phase invocation.

license: MIT
compatibility: OpenSpec >= 1.0, Node.js >= 18, ECC >= 2.0
metadata:
  author: openspec
  version: "9.0"
  generatedBy: "1.4.1"
  triggers:
    - /opsx-auto
    - opsx auto
    - auto orchestrate
    - auto pipeline
    - spec-driven auto
    - single command orchestrator
    - master orchestration
    - auto lifecycle
    - autonomous spec development
    - one-shot implementation
  domains:
    - orchestration
    - spec-driven-development
    - automation
    - quality-assurance
    - meta
    - devops
---

# OpenSpec Autonomous Orchestration — Skill Specification v9.0

## 1. Purpose

`/opsx-auto` is the single entry point that transforms the AI agent into a
fully autonomous orchestration engine for the entire Spec-Driven Development
lifecycle. A single natural-language task description is sufficient to trigger
repository analysis, skill discovery, proposal generation, implementation,
validation, and archival — all without requiring the user to invoke
`/opsx-explore`, `/opsx-propose`, `/opsx-sync`, `/opsx-apply`, or
`/opsx-archive` manually.

Individual commands remain independently executable. `/opsx-auto` is the
intelligent coordinator that chains them automatically.

---

## 2. AI Role Definition

When this skill is activated, the AI agent assumes the role of
**orchestration engine**, not passive command executor.

### 2.1 Primary Responsibilities

| Responsibility | Description |
|---------------|-------------|
| Repository understanding | Deep-scan the codebase before any proposal |
| Task classification | Categorize intent, domains, affected modules |
| Skill composition | Discover, score, and compose skills dynamically |
| Command coordination | Chain all OPSX phases in correct order with context |
| Quality enforcement | Validate every phase; block on gate failures |
| Output integrity | Produce real files, not stubs or templates |
| State persistence | Save checkpoints for recovery after interruption |
| Audit generation | Produce structured logs and execution summaries |

### 2.2 Decision Authority

The AI agent **must** make autonomous decisions about:

- Which skills are relevant (never hardcoded mappings)
- Whether existing implementations can be reused
- The scope and granularity of the task breakdown
- When a phase is complete enough to advance
- Whether a quality gate failure is blocking or advisory
- Whether to halt the pipeline on error

### 2.3 Constraints

The AI agent **must not**:

- Modify files outside the change scope
- Delete files in protected directories
- Bypass validation gates
- Proceed past a fatal phase failure
- Duplicate existing implementations
- Overwrite user-authored content without proposal approval

---

## 3. Architecture

### 3.1 Engine Structure

```
┌─────────────────────────────────────────────────────────┐
│                    AI AGENT (orchestrator)                │
│                                                          │
│  Reads task → Understands repo → Selects skills          │
│       │                                                  │
│       │  Calls state-machine methods between phases       │
│       ▼                                                  │
│  ┌──────────────────────────────────────────────────┐    │
│  │         orchestrate/auto-pipeline.mjs             │    │
│  │                                                  │    │
│  │  initPipeline()      → PipelineContext           │    │
│  │  runDeepScan()       → project analysis          │    │
│  │  runSkillDiscovery() → skill + agent selection   │    │
│  │  runExplore()        → specs, features, pages    │    │
│  │  runPropose()        → proposal + design + tasks │    │
│  │  runSync()           → delta spec merge          │    │
│  │  runApply()          → build pipeline            │    │
│  │  runValidate()       → build + lint + test + QC  │    │
│  │  runArchive()        → sync + trace + docs       │    │
│  │  finishPipeline()    → final report              │    │
│  └──────────────────────────────────────────────────┘    │
│       │                                                  │
│       │  Shared state: PipelineContext class              │
│       ▼                                                  │
│  ┌──────────────────────────────────────────────────┐    │
│  │         orchestrate/pipeline-context.mjs          │    │
│  │                                                  │    │
│  │  executionId, task, changeName, branch            │    │
│  │  project metadata, skills[], agents               │    │
│  │  phases[], phaseResults{}, validation             │    │
│  │  errors[], warnings[]                             │    │
│  │  startPhase() / completePhase() / failPhase()      │    │
│  │  persist() / load() / summary()                   │    │
│  └──────────────────────────────────────────────────┘    │
│       │                                                  │
│       │  Supporting modules (35+ files)                   │
│       ▼                                                  │
│  ┌──────────────────────────────────────────────────┐    │
│  │  skill-discovery  spec-resolver  quality-gate     │    │
│  │  project-analyzer pipeline-engine execution-logger│    │
│  │  opsx-commands    traceability   spec-sync        │    │
│  │  event-bus        state-manager  audit-log        │    │
│  │  ...35+ total orchestration modules               │    │
│  └──────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Key Architectural Decisions

1. **AI is the executor.** The pipeline code is a state-machine library. The
   AI agent calls it between phases to track state and run non-AI tasks
   (build, lint, scan, sync). AI-reasoning phases (code generation, design
   decisions) are performed directly by the agent using its tools.

2. **Shared context, not re-derived context.** The `PipelineContext` object
   is built once at initialization and passed by reference through every
   phase. No phase re-derives project metadata or skill selections.

3. **Every phase produces real outputs.** No TBD stubs, no placeholder files.
   `propose` generates real proposals from actual spec resolution. `explore`
   produces real analysis. `archive` runs real sync, trace, and doc updates.

4. **State is persisted at every phase boundary.** Interruption at any point
   leaves a recoverable checkpoint on disk.

---

## 4. Execution Pipeline

### 4.1 Phase Order (Mandatory)

The AI agent **must** execute phases in this exact order:

```
Phase 0: INIT              Initialize execution context
Phase 1: DEEP_SCAN         Repository analysis
Phase 2: SKILL_DISCOVERY   Dynamic skill selection
Phase 3: OPSX_EXPLORE      Spec, feature, and page discovery
Phase 4: OPSX_PROPOSE      Generate proposal, design, tasks
Phase 5: OPSX_SYNC         Merge delta specs to main
Phase 6: OPSX_APPLY        Implement tasks
Phase 7: VALIDATE          Build, lint, test, quality gates
Phase 8: OPSX_ARCHIVE      Spec sync, traceability, doc sync
Phase 9: REPORT            Final execution report
```

### 4.2 Phase Dependencies

| Phase | Depends On | Fatal On Failure | Skippable |
|-------|-----------|-----------------|-----------|
| INIT | — | Yes | No |
| DEEP_SCAN | INIT | No (partial ok) | No |
| SKILL_DISCOVERY | DEEP_SCAN | No (partial ok) | No |
| OPSX_EXPLORE | SKILL_DISCOVERY | No | No |
| OPSX_PROPOSE | OPSX_EXPLORE | **Yes** | No |
| OPSX_SYNC | OPSX_PROPOSE | No | Yes (no delta specs) |
| OPSX_APPLY | OPSX_PROPOSE | **Yes** | No |
| VALIDATE | OPSX_APPLY | No (warnings allowed) | Yes (`--skip-build`) |
| OPSX_ARCHIVE | VALIDATE | No | No |
| REPORT | ARCHIVE | No | No |

### 4.3 Parallelization

The following read-only operations may run in parallel within a phase:

- Reading spec files, feature registries, and site metadata
- Parsing SKILL.md frontmatter from multiple skill directories
- Counting files and lines across source directories
- Reading DESIGN.md and AGENTS.md

Write operations must remain sequential.

---

## 5. Repository Intelligence

### 5.1 Deep Scan — Phase 1 Requirements

Before any proposal or implementation, the AI must understand the repository.
The `runDeepScan()` function performs automated analysis. The AI agent must
**additionally** perform its own qualitative assessment.

#### Automated Analysis (via `project-analyzer.mjs`)

| Signal | Source | Purpose |
|--------|--------|---------|
| Project name | `site.json` → `company.name` | Identity |
| Framework | `package.json` → dependencies | Technology |
| Architecture | Directory layout (`src/pages/`, `src/components/`) | Structure |
| Language | File extension histogram | Primary language |
| Package manager | Lock file detection (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`) | Tooling |
| Build system | `package.json` → `scripts.build` | Build |
| TODOs/FIXMEs | Source file scanning | Technical debt |
| Stale docs | Git log analysis (30-day window) | Documentation health |
| Partial features | `features/features.json` → `status !== 'complete'` | Incomplete work |
| File counts | Recursive directory walk | Scale |
| Line counts | File reading (capped at 300 files) | Size |
| Branch | `git rev-parse --abbrev-ref HEAD` | Context |
| Feature resolution | `resolveFeatureFromTask()` | Domain mapping |

#### AI Qualitative Assessment

After automated scan completes, the AI agent must **read and understand**:

1. **Project identity:** `site.json` — company, pages, navigation structure
2. **Design system:** `DESIGN.md/` directory — colors, typography, spacing, voice
3. **Feature registry:** `features/features.json` — all registered features and status
4. **Conventions:** `AGENTS.md` — coding rules, build commands, validation
5. **Specifications:** `openspec/specs/` — affected capability specs
6. **Existing patterns:** `src/pages/` — existing page templates to reuse
7. **Shared assets:** `assets/css/core.css`, `assets/js/core.js` — reusable code

The AI agent must form a **mental model** of the repository before generating
any proposal. This model informs all downstream decisions.

---

## 6. Task Intelligence

### 6.1 Task Classification — Phase 2 Prerequisite

The AI agent must classify the user's task before selecting skills. The
`analyzeTask()` function from `capability-analyzer.mjs` provides automated
classification across 32 intent categories.

#### Intent Taxonomy (32 Categories)

| Category | Examples | Typical Skills |
|----------|---------|---------------|
| `build-page` | "Build the pricing page" | design-system, frontend-patterns |
| `add-component` | "Add a testimonial slider" | component-architecture, motion-master |
| `fix-layout` | "Fix the hero section spacing" | make-interfaces-feel-better |
| `add-animation` | "Add scroll reveal animations" | motion-foundations, motion-patterns |
| `accessibility-audit` | "Audit a11y compliance" | accessibility, frontend-a11y |
| `seo-optimize` | "Improve meta descriptions" | seo |
| `performance-audit` | "Speed up page load" | benchmark, performance-optimization |
| `add-test` | "Write E2E tests for checkout" | e2e-testing, browser-qa |
| `refactor` | "Clean up duplicated CSS" | coding-standards |
| `design-review` | "Review visual consistency" | design-system, frontend-design-direction |
| `add-form` | "Add contact form validation" | frontend-patterns, security-review |
| `api-integration` | "Connect to REST API" | backend-patterns, api-design |
| ... | ... | ... |

#### Multi-Domain Classification

A single task may span multiple domains. Example: "Build an authenticated
dashboard with real-time charts" maps to:

| Domain | Reason |
|--------|--------|
| `frontend` | Page structure, UI components |
| `design` | Visual consistency, layout |
| `backend` | Authentication API, data endpoints |
| `security` | Auth flow, input validation |
| `performance` | Real-time data, chart rendering |

### 6.2 Constraint Detection

The AI agent must extract constraints from the task description:

- **Explicit constraints:** "without changing the nav bar", "mobile only"
- **Implicit constraints:** existing architecture, design system rules,
  protected files, build pipeline requirements
- **Risk signals:** money/payment flows, authentication, data mutation,
  file deletion

---

## 7. Dynamic Skill Intelligence

### 7.1 Discovery

Skills are discovered from two archives:

| Archive | Path | Typical Count |
|---------|------|--------------|
| Global | `~/.config/opencode/skills/` | ~271 skills |
| Project | `.opencode/skills/` | ~6 skills |

Each `SKILL.md` is parsed for: frontmatter (`name`, `description`), trigger
keywords, and domain patterns. Skills are scored against the task using a
weighted algorithm:

| Signal | Weight | Source |
|--------|--------|--------|
| Trigger keyword match | +3 per match | SKILL.md trigger list |
| Domain overlap | +2 per domain | Domain inference from description |
| Word overlap in description | +1 per word | Full-text match |

Top 12 skills are selected. The AI agent must load the top 3–6 most relevant
skills using the `skill` tool before implementation.

### 7.2 Multi-Skill Composition

Tasks matching known composition patterns receive curated skill sets. The
`skill-router.mjs` module defines 25+ composition rules. Examples:

| Task Pattern | Composed Skills |
|-------------|----------------|
| "Build/create a new page" | design-system, frontend-patterns, accessibility, motion-master, component-architecture |
| "Fix/improve hero section" | frontend-design-direction, design-system, motion-master, accessibility |
| "Redesign pricing page" | design-system, frontend-design-direction, accessibility, performance-optimization |
| "Add authentication flow" | security-review, frontend-patterns, accessibility |
| "Setup email notifications" | backend-patterns, security-review |
| "Improve navigation" | design-system, frontend-patterns, accessibility |

### 7.3 Anti-Patterns

- **Never** hardcode skill-to-task mappings outside the composition rule file
- **Never** select a skill because "it worked last time"
- **Never** load more than 6 skills without explicit justification
- **Never** ignore the domain analysis from `analyzeTask()`

---

## 8. Autonomous Command Orchestration

### 8.1 Phase Execution Protocol

For each phase, the AI agent must follow this protocol:

```
1. Call ctx.startPhase(phaseId, label)
2. Call the corresponding pipeline method (e.g., runExplore(ctx))
3. Read the output. If the phase requires AI reasoning:
   a. Read affected files
   b. Apply loaded skills
   c. Produce concrete outputs using tools (write, edit, bash)
4. Verify phase outputs exist and are well-formed
5. Do NOT advance if a fatal dependency failed
6. Display progress indicator: [N/9] Label → status
```

### 8.2 Progress Reporting Format

After each phase completes, the AI agent must output:

```
[1/9] Deep Scan
✓ Completed (1.2s) — Project: OptiFlow OS | Framework: static-site

[2/9] Skill Discovery
✓ Completed (0.3s) — 9 Skills loaded | Agent: tdd-guide

[3/9] Explore
✓ Completed (2.1s) — Specs: 24 | Features: 68 | Pages: 15

...
```

### 8.3 Phase-Specific Instructions

The `getPhaseInstructions(ctx, phaseId)` function in `auto-pipeline.mjs`
returns structured guidance for the AI agent at each phase. The agent must
read and follow these instructions before executing AI-reasoning work.

---

## 9. Shared Pipeline Context

### 9.1 Context Schema

The `PipelineContext` class (`orchestrate/pipeline-context.mjs`) is the
single source of truth. Every phase receives the same object by reference.

```typescript
interface PipelineContext {
  // Identity
  executionId: string;        // "{changeName}-{timestamp}"
  task: string;               // Original task description
  changeName: string;         // Slugified task name
  startedAt: string;          // ISO 8601 timestamp

  // Configuration
  dryRun: boolean;            // --dry-run flag
  skipBuild: boolean;         // --skip-build flag
  autoApprove: boolean;       // Bypass human gates

  // Repository
  branch: string;
  project: {
    name: string;
    framework: string;
    architecture: string;
    totalFiles: number;
    totalLines: number;
  };

  // Intelligence
  skills: string[];           // Top 12 scored skills
  agents: {                   // Routed agents
    primaryAgent: string;
    supportAgents: string[];
  };
  featureId: string | null;
  featureName: string | null;
  affectedSpecs: Array<{ specName: string; confidence: number }>;

  // Execution
  phases: Phase[];            // Ordered phase records
  phaseResults: Record<string, any>;  // Per-phase outputs
  validation: { passed: boolean; failures: string[] };
  errors: Array<{ phase: string; error: string }>;
  warnings: string[];

  // Lifecycle
  status: 'pending' | 'running' | 'done' | 'issues-found' | 'failed';
  completedAt: string | null;
  totalDuration: number;
}
```

### 9.2 Context Lifecycle

1. **Created** by `initPipeline(task, opts)` — immutable metadata set
2. **Enriched** by `runDeepScan()` — project, feature, affected specs
3. **Enriched** by `runSkillDiscovery()` — skills, agents, gates
4. **Enriched** by each subsequent phase — `phaseResults[id]` set
5. **Persisted** by `ctx.persist()` at every phase boundary
6. **Finalized** by `finishPipeline(ctx)` — status, duration, summary

### 9.3 Recovery

If execution is interrupted:

```
const { PipelineContext } = await import('./orchestrate/pipeline-context.mjs');
const ctx = PipelineContext.load('execution-id-here');
// ctx.nextPhaseId tells you which phase to resume from
```

---

## 10. Quality Gates

### 10.1 Gate Definitions

| Gate | Phase | Check |
|------|-------|-------|
| `GATE_SPEC` | PROPOSE | Spec files exist and are well-formed |
| `GATE_BUILD` | VALIDATE | `npm run build` succeeds |
| `GATE_VALIDATE` | VALIDATE | `npm run validate` passes |
| `GATE_TEST` | VALIDATE | `npm test` passes (if configured) |
| `GATE_A11Y` | VALIDATE | Accessibility audit passes |
| `GATE_PERF` | VALIDATE | Performance budget met |
| `GATE_VISUAL` | VALIDATE | Visual regression check |
| `GATE_SECURITY` | ARCHIVE | Security scan passes |
| `GATE_HUMAN` | PROPOSE, ARCHIVE | Human approval checkpoint |

### 10.2 Gate Enforcement

- Gates run in order. First failure stops the gate pipeline.
- `GATE_SPEC` and `GATE_HUMAN` at PROPOSE are blocking — pipeline cannot
  proceed without passing.
- `GATE_BUILD`, `GATE_VALIDATE`, `GATE_TEST` at VALIDATE are blocking for
  production branches (`main`, `staging`). Warnings allowed on feature branches.
- `GATE_SECURITY` at ARCHIVE is blocking on `main`.

---

## 11. Error Recovery

### 11.1 Phase Failure Protocol

```
┌────────────────────────────────────────┐
│ Phase fails                            │
│     │                                  │
│     ├─► ctx.failPhase(id, error)       │
│     │       │                           │
│     │       ├─► Record error in ctx    │
│     │       ├─► Persist state to disk  │
│     │       └─► Log to audit trail     │
│     │                                  │
│     ├─► Is phase FATAL?                │
│     │       │                           │
│     │       ├─ YES → finishPipeline()  │
│     │       │         Report PARTIAL    │
│     │       │         Stop execution   │
│     │       │                          │
│     │       └─ NO  → Log warning       │
│     │                 Continue         │
└────────────────────────────────────────┘
```

### 11.2 Fatal Phases

- **PROPOSE failure:** Cannot generate tasks → no implementation possible
- **APPLY failure:** Implementation incomplete → validation meaningless

### 11.3 Non-Fatal Phases

- **DEEP_SCAN failure:** Partial metadata ok; AI can still assess manually
- **SKILL_DISCOVERY failure:** Fall back to routing rules; fewer skills loaded
- **EXPLORE failure:** AI can read files directly; scan output advisory
- **SYNC failure:** Delta specs may not exist; non-blocking
- **ARCHIVE failure:** Trace/docs may be partial; non-blocking

### 11.4 Resume After Interruption

```js
// Recovery procedure:
// 1. Load persisted context
const ctx = PipelineContext.load(executionId);
if (!ctx) throw new Error('No state to recover');

// 2. Find the last completed phase
const completedPhases = ctx.phases.filter(p => p.status === 'complete');

// 3. Resume from next phase
const nextPhase = ctx.nextPhaseId;
// Re-run from nextPhase onward
```

---

## 12. Safety

### 12.1 File System Safety

| Rule | Enforcement |
|------|------------|
| Max 200 files changed per execution | Checked by `SAFETY_RULES.maxFilesChanged` |
| Protected directories never deleted | `.git`, `node_modules`, `dist`, `orchestrate/.state`, `orchestrate/.cache` |
| Critical files never deleted | `site.json`, `package.json`, `AGENTS.md` |
| Backup before overwrite | `spec-sync.mjs` creates `.bak` files |
| Dry-run mode available | `--dry-run` flag prevents all writes |

### 12.2 Operational Safety

- **Never** proceed past a failed fatal phase
- **Never** modify files the proposal didn't identify
- **Never** delete a spec without human confirmation
- **Never** execute destructive git operations (force push, hard reset)
- **Always** preserve the ability to roll back via git

---

## 13. Observability

### 13.1 Telemetry Captured

Every execution records:

| Metric | Source | Storage |
|--------|--------|---------|
| Execution duration | `metrics.mjs` → `startTimer()` | Console + JSON log |
| Per-phase timing | `ctx.phases[].duration` | Context JSON |
| Skills selected | `ctx.skills` | Context JSON |
| Agents routed | `ctx.agents` | Context JSON |
| Files modified | `git diff --name-only` | Audit log |
| Build status | `execSync` output | Context JSON |
| Validation results | `validate.mjs` output | Context JSON |
| Errors and warnings | `ctx.errors`, `ctx.warnings` | Context JSON |
| Specs synced | `syncToMain()` result | Context JSON |
| Traceability | `generateTrace()` result | Audit log |

### 13.2 Output Artifacts

| Artifact | Path | Format |
|----------|------|--------|
| Execution context | `orchestrate/.state/{id}-context.json` | JSON |
| Phase log | `orchestrate/.state/{id}-log.json` | JSON |
| Execution summary | `orchestrate/.state/execution-summary.jsonl` | JSONL (append) |
| Audit trail | `orchestrate/.audit.jsonl` | JSONL (append) |
| Pipeline state | `orchestrate/.state/pipeline-{id}.json` | JSON |
| Proposal | `openspec/changes/{name}/proposal.md` | Markdown |
| Design | `openspec/changes/{name}/design.md` | Markdown |
| Tasks | `openspec/changes/{name}/tasks.md` | Markdown |
| Delta specs | `openspec/changes/{name}/specs/*.md` | Markdown |

---

## 14. Branch-Aware Behavior

| Branch | Behavior |
|--------|----------|
| `main` | Full quality gates (including `GATE_SECURITY`). Security reviewer required. Doc updates mandatory. |
| `staging` | E2E runner included. `GATE_PERF` enforced. |
| `develop` | Standard pipeline. Code reviewer primary agent. |
| `feature/*` | Lightweight pipeline. Doc updates skipped. `GATE_HUMAN` bypassed. |
| `hotfix/*` | Accelerated pipeline. Only `GATE_BUILD` + `GATE_VALIDATE`. |

---

## 15. Extensibility

### 15.1 Adding a New Phase

1. Add the phase ID to `PHASE_ORDER` in `auto-pipeline.mjs`
2. Implement a `run{PhaseName}(ctx)` method following the existing pattern:
   - Call `ctx.startPhase(id, label)`
   - Execute phase logic
   - Call `ctx.completePhase(id, output)` or `ctx.failPhase(id, error)`
   - Call `ctx.persist()`
3. Add phase-specific instructions to `getPhaseInstructions()`
4. Update this SKILL.md with the new phase documentation

### 15.2 Adding a New Skill Provider

1. Add the directory path to `skill-discovery.mjs` → `scanSkillsDir()` calls
2. Ensure SKILL.md files in the new directory follow the frontmatter format
3. Update `inferDomains()` in `skill-discovery.mjs` if new domain keywords
   are needed

### 15.3 Adding a Quality Gate

1. Implement the gate check in `quality-gate.mjs` → `runGate()` switch
2. Add the gate to the appropriate phase in `gatesForPhase()`
3. Document the gate in Section 10 of this SKILL.md

### 15.4 Integration Points

| Extension Point | Module | Mechanism |
|----------------|--------|-----------|
| New command | `opsx-commands.mjs` | Add case to `runOpsxCommand()` switch |
| New phase pipeline | `pipeline-config/*.yaml` | Create YAML config, add to `PHASE_PIPELINE_MAP` |
| New event listener | `event-bus.mjs` | Register with `on('event', handler)` |
| New hook | `hooks/` directory | Create `.mjs` file, register in `hook-router.mjs` |
| New capability | `capability-analyzer.mjs` | Add intent pattern to taxonomy |

---

## 16. Performance

### 16.1 Optimization Rules

| Rule | Implementation |
|------|---------------|
| Cache immutable metadata | `cache-manager.mjs` — 5-min TTL with SHA-256 keys |
| Reuse parsed skill data | `skill-discovery.mjs` — results cached by task hash |
| Lazy-load heavy resources | `lazy-loader.mjs` — on-demand capability loading |
| Parallelize read-only analysis | File reads, spec parsing, SKILL.md parsing |
| Avoid duplicate scans | `PipelineContext` tracks what's been loaded |
| Limit file scanning depth | `project-analyzer.mjs` — max 10 levels, 300 files |

### 16.2 Benchmarks

| Repository Size | Deep Scan | Skill Discovery | Full Pipeline (dry) |
|----------------|-----------|----------------|---------------------|
| ~30 files (this project) | < 0.5s | < 0.4s | < 2s |
| ~300 files | < 2s | < 1s | < 5s |
| ~3000 files | < 10s | < 3s | < 30s |

---

## 17. Usage Examples

### 17.1 Build a New Page

```
/opsx-auto "Build the Pricing Page"
```

**Pipeline trace:**
1. Deep scan → Project: OptiFlow OS, Framework: static-site
2. Skills → design-system, frontend-patterns, accessibility, motion-master
3. Explore → 24 specs, 68 features, 15 existing pages
4. Propose → Creates pricing page proposal with pricing table, FAQ accordion, CTA
5. Sync → No delta specs (new page)
6. Apply → AI writes `src/pages/pricing.html`, adds to `site.json`
7. Validate → Build passes, validate passes, 0 errors
8. Archive → Traceability matrix generated, docs synced
9. Report → COMPLETE, 8/8 phases passed, 15.3s

### 17.2 Fix a Layout Issue

```
/opsx-auto "Fix the hero section overflow on mobile"
```

**Pipeline trace:**
1. Deep scan → Feature: PAGE-001 | Home Page
2. Skills → make-interfaces-feel-better, design-system-master, coding-standards
3. Explore → Affected specs: design-system, shared-components
4. Propose → Scope: CSS fix only, no new files
5. Sync → No delta specs
6. Apply → AI edits `assets/css/core.css` hero section media query
7. Validate → Build passes, validate passes
8. Archive → Trace: 1 commit, 1 file changed
9. Report → COMPLETE, 4.2s

### 17.3 Dry Run (Planning Only)

```
/opsx-auto --dry-run "Add newsletter subscription flow"
```

**Pipeline trace:**
1. Deep scan → Analysis complete
2. Skills → 9 skills identified, agent routed
3. **Pipeline stops here** — no files created, no changes made
4. Report → Plan saved to `orchestrate/.state/`

---

## 18. Specification Governance

### 18.1 Version Policy

- **Major version** (9.x → 10.0): Phase order changes, context schema breaking
  changes, new mandatory phases
- **Minor version** (9.0 → 9.1): New gates, new composition rules, improved
  scoring algorithms
- **Patch version** (9.0.0 → 9.0.1): Bug fixes, documentation clarifications

### 18.2 Compliance

Implementations claiming `/opsx-auto` compatibility must:

- Execute all 9 phases in order (INIT through REPORT)
- Use `PipelineContext` as the shared execution state
- Persist state at every phase boundary
- Never produce stub/TBD outputs in PROPOSE
- Run real build and validation in VALIDATE
- Produce all output artifacts listed in Section 13.2

---

## 19. References

| Document | Path | Purpose |
|----------|------|---------|
| Command definition | `.opencode/commands/opsx-auto.md` | AI-executable step-by-step instructions |
| State machine | `orchestrate/auto-pipeline.mjs` | Phase methods and context management |
| Context class | `orchestrate/pipeline-context.mjs` | `PipelineContext` implementation |
| Skill discovery | `orchestrate/skill-discovery.mjs` | Global + project skill scanning |
| Capability analyzer | `orchestrate/capability-analyzer.mjs` | 32-intent task taxonomy |
| Spec resolver | `orchestrate/spec-resolver.mjs` | Affected spec resolution |
| Quality gates | `orchestrate/quality-gate.mjs` | Gate implementations and routing |
| Pipeline engine | `orchestrate/pipeline-engine.mjs` | YAML pipeline executor with DAG |
| Project analyzer | `orchestrate/project-analyzer.mjs` | Deep repository analysis |
| OPSX commands | `orchestrate/opsx-commands.mjs` | Real OpenSpec command implementations |
| Design system | `DESIGN.md/` | Design tokens and rules |
| Feature registry | `features/features.json` | 68 registered features |
| Site config | `site.json` | Company data, pages, navigation |
