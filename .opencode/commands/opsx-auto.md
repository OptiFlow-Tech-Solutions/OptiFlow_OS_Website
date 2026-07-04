---
description: >
  Single intelligent entry point for the complete Spec-Driven Development lifecycle.
  One command. Zero manual phase invocation. Full autonomous orchestration.
version: "14.0"
enterprise: true
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
---

<!-- canonical: .opencode/skills/openspec-auto/SKILL.md -->

# `/opsx-auto` — Enterprise Master Orchestrator v14

## One Command. Everything Done.

```
/opsx-auto "<task>"
```

The developer executes only this. Nothing else is required.

## What Happens

The Enterprise Master Orchestrator autonomously executes the complete
engineering lifecycle — 13 stages, zero manual intervention:

```
  ┌─────────────────────────────────────────────────────────────┐
  │                 ENTERPRISE ORCHESTRATION v14                │
  │                                                              │
  │  1.  Repository Intelligence     ── parallel read-only scan │
  │  2.  Task Understanding          ── intent + domain analysis│
  │  3.  Repository Analysis         ── specs, features, pages  │
  │  4.  Skill Discovery             ── 277+ skills scored      │
  │  5.  Agent Composition           ── per-phase agent teams   │
  │  6.  Explore                     ── codebase understanding  │
  │  7.  Propose                     ── proposal + design + tasks│
  │  8.  Sync                        ── delta → main spec merge │
  │  9.  Apply                       ── implementation          │
  │ 10.  Validate                    ── build + lint + L1-L7    │
  │ 11.  Verify                      ── standalone verification │
  │ 12.  Archive                     ── sync + trace + finalize │
  │ 13.  Completion Report           ── enterprise telemetry    │
  │                                                              │
  │  Safety: max 20 iterations, staleness detection,             │
  │  circuit breaker, shared memory, checkpoint recovery         │
  └─────────────────────────────────────────────────────────────┘
```

## Architecture

```
/opsx-auto (Master Orchestrator)
  │
  ├─ Phase 0: Repository Snapshot (parallel)
  │   ├─ Project Analyzer
  │   ├─ Context Loader
  │   └─ Capability Registry
  │
  ├─ Phase 0.5: Intelligence Composition
  │   ├─ Skill Composer (9 workflow roles)
  │   └─ Agent Composer (7 phase teams)
  │
  └─ Goal-Oriented Iteration Loop
      ├─ ANALYZE  → planIteration()
      ├─ PLAN     → validatePrerequisites()
      ├─ EXECUTE  → run phases in priority order
      ├─ VALIDATE → measureProgress()
      └─ DECIDE   → goalMet? archive : iterate
```

## Lifecycle Commands

The following commands remain independently executable for manual use,
debugging, or single-phase workflows. When `/opsx-auto` runs, they operate
as **coordinated child agents** under the Master Orchestrator:

| Command | Phase | Role | Standalone |
|---------|-------|------|------------|
| `/opsx-explore` | Explore | Repository Analyst | Yes |
| `/opsx-propose` | Propose | Proposal Writer | Yes |
| `/opsx-sync` | Sync | Spec Synchronizer | Yes |
| `/opsx-apply` | Apply | Implementer | Yes |
| `/opsx-verify` | Verify | Quality Verifier | Yes |
| `/opsx-archive` | Archive | Archivist | Yes |

## Entry Point

```
JS Runtime: orchestrate/auto-pipeline-v13.mjs
CLI:        node orchestrate/coordinator.mjs "<task>"
Import:     import { autoFullPipelineV13 } from './orchestrate/auto-pipeline-v13.mjs'
Legacy:     --v12 flag for V12 linear waterfall
```

## Options

| Flag | Effect |
|------|--------|
| `--dry-run` | Build repository snapshot, compose skills/agents, stop |
| `--skip-build` | Skip validation/verify phases |
| `--plan` | Stop after propose for human review (plan-only mode) |
| `--v12` | Use legacy V12 linear waterfall pipeline |
| `--feature-sync` | Sync feature dashboards only |
| `--feature-report` | Generate enterprise feature report |

## Recovery

```
node orchestrate/coordinator.mjs "<same task>"  # auto-resumes from state
```

Or manually:
```
const ctx = resumePipelineV13(executionId);
// ctx.nextPhaseId → resume from here
```

## Observability

| Output | Location |
|--------|----------|
| Execution state | `orchestrate/.state/{executionId}-context.json` |
| Recovery guide | `orchestrate/.state/{executionId}-recovery.md` |
| Audit trail | `orchestrate/.audit.jsonl` |
| Telemetry dashboard | `orchestrate/.telemetry/dashboard.html` |
| Execution records | `orchestrate/.telemetry/executions.jsonl` |
| Telemetry summary | `orchestrate/.telemetry/telemetry-summary.json` |

## Traceability

Every implementation traces back to an OpenSpec requirement:

```
spec.md → proposal.md → tasks.md → git commit → changed files
```

## Shared Memory

All lifecycle agents read and write the same execution context:

- **Findings** — cross-phase analysis results
- **Decisions** — architectural choices with rationale
- **Risks** — severity-ranked risk registry
- **Assumptions** — tracked for validation

## Quality Gates

```
GATE_SPEC → GATE_BUILD → GATE_VALIDATE → GATE_TEST
→ GATE_A11Y → GATE_PERF → GATE_SECURITY → GATE_HUMAN
```

## Human Gates

Only two gates interrupt autonomous execution:

1. **GATE 1**: Proposal Review — after explore + propose
2. **GATE 2**: Archive Confirmation — before final archive
