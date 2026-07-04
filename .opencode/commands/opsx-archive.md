---
description: >
  Archive a completed OpenSpec change from changes/ to archive/YYYY-MM-DD-<name>/.
  Syncs specs, generates traceability, updates documentation, produces completion record.
version: "14.0"
enterprise: true
triggers:
  - /opsx-archive
  - opsx archive
  - archive change
domains:
  - documentation
  - finalization
  - archive
role: archivist
orchestratedBy: /opsx-auto
orchestrationContract: OPSX_ARCHIVE
---

<!-- canonical: .opencode/skills/openspec-archive/SKILL.md -->

# `/opsx-archive` — Archive Agent

## Role

**Archivist** — Phase 12 of the 13-stage Enterprise Orchestration lifecycle.

## Orchestration Status

This command is a **coordinated lifecycle agent** under the Master Orchestrator (`/opsx-auto`).
When `/opsx-auto` runs, this phase executes automatically after validation passes.
It is the terminal phase of the lifecycle.

This command remains fully functional as a **standalone operation** for manual use, debugging, and single-phase workflows.

## Contract

| Property | Value |
|----------|-------|
| Phase ID | `OPSX_ARCHIVE` |
| Role | `archivist` |
| Is Fatal | No |
| Requires | `VALIDATE` or `OPSX_VERIFY` |
| Produces | archive-record, traceability.md |
| Handoff To | (terminal — end of lifecycle) |
| Retry Policy | 2 retries, 1s backoff |

## Usage

```
/opsx-archive add-auth
/opsx-archive
```

## Behavior

Archive a completed change in the experimental workflow.

## Steps

1. **Prompt for change selection** (no auto-select)
2. **Check artifact completion status**: `openspec status --change "<name>" --json`
3. **Check task completion** — count `[ ]` vs `[x]`
4. **Assess delta spec sync state** — offer sync if deltas exist
5. **Perform the archive** — move change to `archive/YYYY-MM-DD-<name>/`
6. **Generate master archive index** at `archive/index.json`

## Post-Archive Verification

- All artifacts exist (proposal.md, design.md, tasks.md, traceability.md)
- All tasks checked `[x]`
- Build passes
- Traceability chain is complete (spec → task → commit → file)
- Archive index updated

## Guardrails

- Always prompt for change selection if not provided
- Use artifact graph (openspec status --json) for completion checking
- Don't block archive on warnings — just inform and confirm
- Preserve .openspec.yaml when moving to archive
- Show clear summary of what happened
- If delta specs exist, always sync before archive

## Autonomous Mode (from `/opsx-auto`)

When driven by the Master Orchestrator:
- Skips confirmation if `autoApprove` is set
- Runs spec sync automatically
- Generates traceability automatically
- Generates archive index automatically
