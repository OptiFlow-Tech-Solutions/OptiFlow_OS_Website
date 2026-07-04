---
description: >
  Propose a new change — create it and generate all artifacts in one step
  (proposal.md, design.md, tasks.md, delta specs).
version: "14.0"
enterprise: true
triggers:
  - /opsx-propose
  - opsx propose
  - propose change
domains:
  - planning
  - documentation
  - specification
role: proposal-writer
orchestratedBy: /opsx-auto
orchestrationContract: OPSX_PROPOSE
---

<!-- canonical: .opencode/skills/openspec-propose/SKILL.md -->

# `/opsx-propose` — Proposal Agent

## Role

**Proposal Writer** — Phase 7 of the 13-stage Enterprise Orchestration lifecycle. **[FATAL PHASE]**

## Orchestration Status

This command is a **coordinated lifecycle agent** under the Master Orchestrator (`/opsx-auto`).
When `/opsx-auto` runs, this phase executes automatically. If this phase fails, the pipeline stops
because it is marked as fatal — the implementation cannot proceed without a proposal.

This command remains fully functional as a **standalone operation** for manual use, debugging, and single-phase workflows.

## Contract

| Property | Value |
|----------|-------|
| Phase ID | `OPSX_PROPOSE` |
| Role | `proposal-writer` |
| Is Fatal | **Yes** |
| Requires | `OPSX_EXPLORE` |
| Produces | proposal.md, design.md, tasks.md, delta-specs |
| Handoff To | `OPSX_SYNC` |
| Retry Policy | 1 retry, 2s backoff |

## Usage

```
/opsx-propose add-user-auth
/opsx-propose "Build a responsive pricing page"
/opsx-propose
```

## Behavior

Propose a new change — create the change and generate all artifacts in one step.

Creates artifacts:
- **proposal.md** — what & why
- **design.md** — how (architecture, decisions)
- **tasks.md** — implementation steps (checklist)
- **specs/** — delta specs (ADDED/MODIFIED/REMOVED requirements)

**Input**: The argument after `/opsx-propose` is the change name (kebab-case), OR a description of what the user wants to build.

## Steps

1. **If no input provided, ask what they want to build**
2. **Create the change directory**: `openspec new change "<name>"`
3. **Get the artifact build order**: `openspec status --change "<name>" --json`
4. **Create artifacts in sequence until apply-ready**

## Guardrails

- Create ALL artifacts needed for implementation
- Always read dependency artifacts before creating a new one
- If context is critically unclear, ask the user — but prefer making reasonable decisions
- If a change with that name already exists, ask if user wants to continue or create new
- Verify each artifact file exists after writing

## Autonomous Mode (from `/opsx-auto`)

When driven by the Master Orchestrator:
- Writes artifacts directly (no CLI commands)
- References existing page templates and feature registry
- Skips human gate if `autoApprove` is set
- Proceeds directly to implementation after artifacts are created
