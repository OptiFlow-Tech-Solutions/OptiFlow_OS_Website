---
description: >
  Implement tasks from an OpenSpec change. Reads tasks.md, executes each task,
  builds after changes, marks completion. Supports autonomous and standalone modes.
version: "14.0"
enterprise: true
triggers:
  - /opsx-apply
  - opsx apply
  - implement
domains:
  - implementation
  - development
  - build
role: implementer
orchestratedBy: /opsx-auto
orchestrationContract: OPSX_APPLY
---

<!-- canonical: .opencode/skills/openspec-apply/SKILL.md -->

# `/opsx-apply` — Implementation Agent

## Role

**Implementer** — Phase 9 of the 13-stage Enterprise Orchestration lifecycle. **[FATAL PHASE]**

## Orchestration Status

This command is a **coordinated lifecycle agent** under the Master Orchestrator (`/opsx-auto`).
When `/opsx-auto` runs, this phase executes automatically. If this phase fails, the pipeline stops
because it is marked as fatal — implementation failures halt the pipeline.

This command remains fully functional as a **standalone operation** for manual use, debugging, and single-phase workflows.

## Contract

| Property | Value |
|----------|-------|
| Phase ID | `OPSX_APPLY` |
| Role | `implementer` |
| Is Fatal | **Yes** |
| Requires | `OPSX_PROPOSE` |
| Produces | implementation, build-output |
| Handoff To | `VALIDATE` |
| Retry Policy | 1 retry, 3s backoff |

## Usage

```
/opsx-apply add-auth
/opsx-apply
```

## Behavior

Implement tasks from an OpenSpec change's `tasks.md`.

## Autonomous Mode (from `/opsx-auto`)

- Reads tasks.md directly
- Works through tasks sequentially
- Builds after each implementation change
- Marks tasks as `[x]` after completion
- Continues until all tasks done or blocked
- Error classification: recoverable, design error, dependency error, environment error
- Stagnation detection: 3 consecutive failures → pause
- Retry limit: 3 retries per task

## Standalone Mode

1. **Select the change** — infer from context or prompt
2. **Check status**: `openspec status --change "<name>" --json`
3. **Get apply instructions**: `openspec instructions apply --change "<name>" --json`
4. **Read context files** from the instructions output
5. **Implement tasks** in a loop until done or blocked

## Guardrails

- Keep going through tasks until done or blocked
- Always read context files before starting
- If task is ambiguous, pause and ask before implementing
- If implementation reveals issues, pause and suggest artifact updates
- Keep code changes minimal and scoped to each task
- Update task checkbox immediately after completing each task
- Pause on errors, blockers, or unclear requirements — don't guess
