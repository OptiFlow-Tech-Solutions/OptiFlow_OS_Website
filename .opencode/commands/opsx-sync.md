---
description: >
  Sync delta specs from a change to main capability specs. Agent-driven
  intelligent partial-merge with conflict resolution.
version: "14.0"
enterprise: true
triggers:
  - /opsx-sync
  - opsx sync
  - sync specs
domains:
  - documentation
  - specification
  - synchronization
role: spec-synchronizer
orchestratedBy: /opsx-auto
orchestrationContract: OPSX_SYNC
---

<!-- canonical: .opencode/skills/openspec-sync/SKILL.md -->

# `/opsx-sync` — Sync Agent

## Role

**Spec Synchronizer** — Phase 8 of the 13-stage Enterprise Orchestration lifecycle.

## Orchestration Status

This command is a **coordinated lifecycle agent** under the Master Orchestrator (`/opsx-auto`).
When `/opsx-auto` runs, this phase executes automatically after proposal. If no delta specs
exist, this phase is skipped automatically.

This command remains fully functional as a **standalone operation** for manual use, debugging, and single-phase workflows.

## Contract

| Property | Value |
|----------|-------|
| Phase ID | `OPSX_SYNC` |
| Role | `spec-synchronizer` |
| Is Fatal | No |
| Requires | `OPSX_PROPOSE` |
| Produces | synced-specs |
| Handoff To | `OPSX_APPLY` |
| Retry Policy | 3 retries, 500ms backoff |

## Usage

```
/opsx-sync add-auth
/opsx-sync
```

## Behavior

Sync delta specs from a change to main specs using intelligent partial-merge logic.

This is an **agent-driven** operation — you read delta specs and directly edit main specs to apply the changes. This allows intelligent merging (e.g., adding a scenario without copying the entire requirement).

## Steps

1. **Prompt for change selection** (if not provided)
2. **Resolve change context**: `openspec status --change "<name>" --json`
3. **Find delta specs** from `artifactPaths.specs.existingOutputPaths`
4. **For each delta spec, apply changes to main specs**:
   - **ADDED**: Add new requirements
   - **MODIFIED**: Update existing requirements (preserve unmentioned content)
   - **REMOVED**: Remove requirement blocks
   - **RENAMED**: FROM → TO rename

## Key Principle: Intelligent Merging

Unlike programmatic merging, you can apply **partial updates**:
- To add a scenario, just include that scenario under MODIFIED — don't copy existing scenarios
- The delta represents *intent*, not a wholesale replacement
- Use your judgment to merge changes sensibly

## Guardrails

- Read both delta and main specs before making changes
- Preserve existing content not mentioned in delta
- If something is unclear, ask for clarification
- The operation should be idempotent — running twice should give same result
