---
name: openspec-sync
description: >
  Sync delta specs from a change to main capability specs using intelligent
  partial-merge logic. Supports ADDED/MODIFIED/REMOVED/RENAMED requirements
  with conflict resolution. Agent-driven — reads deltas, edits main specs directly.
  Skips automatically if no delta specs exist.
license: MIT
compatibility: OpenSpec >= 1.0, Node.js >= 18
metadata:
  version: "14.0"
  enterprise: true
  generatedBy: "2.1.0"
  triggers:
    - /opsx-sync
    - opsx sync
    - sync specs
    - merge specs
    - update main specs
  domains:
    - documentation
    - synchronization
    - maintenance
    - specification
  orchestration:
    phase: OPSX_SYNC
    role: spec-synchronizer
    isFatal: false
    requires: [OPSX_PROPOSE]
    handoffTo: OPSX_APPLY
    retryPolicy: { maxRetries: 3, backoffMs: 500 }
  relatedSkills:
    - openspec-auto
    - openspec-propose
    - openspec-archive
  outputContracts:
    optional:
      - synced-specs (merged delta specs into main)
      - sync summary (count of synced vs skipped)
  changelog: |
    v14.0 (2026-07-04): Enterprise upgrade — enhanced metadata, orchestration contract,
      expanded triggers and domains, output contracts.
    v13.0 (2026-07-03): V13 integration — autonomous mode with auto-skip for empty deltas.
---

## Purpose

Sync delta specs from a change to main specs. This is an **agent-driven** operation —
read delta specs and directly edit main specs to apply changes using intelligent
partial-merge logic.

## Prerequisites

- An active change with delta specs under `specs/` directory
- Main specs at `openspec/specs/<capability>/spec.md` (may not exist — created as needed)
- `openspec status --change "<name>" --json` available

## Related Skills

| Skill | Role | When Used |
|-------|------|-----------|
| `openspec-propose` | Create delta specs | Before sync — deltas must exist |
| `openspec-auto` | Autonomous orchestration | When sync is run as Phase 6 |
| `openspec-archive` | Archive after sync | After implementation and sync |

Sync delta specs from a change to main specs.

This is an **agent-driven** operation - you will read delta specs and directly edit main specs to apply the changes. This allows intelligent merging (e.g., adding a scenario without copying the entire requirement).

**Input**: Optionally specify a change name. If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **If no change name provided, prompt for selection**

   Run `openspec list --json` to get available changes. Use the **AskUserQuestion tool** to let the user select.

   Show changes that have delta specs (under `specs/` directory).

   **IMPORTANT**: Do NOT guess or auto-select a change. Always let the user choose.

2. **Resolve change context**

   Run:
   ```bash
   openspec status --change "<name>" --json
   ```

   If status reports `actionContext.mode: "workspace-planning"`, explain that workspace spec sync is not supported in this slice and STOP. Do not fall back to repo-local paths or edit linked repos.

3. **Find delta specs**

   Use `artifactPaths.specs.existingOutputPaths` from the status JSON as the list of delta spec files.

   Each delta spec file contains sections like:
   - `## ADDED Requirements` - New requirements to add
   - `## MODIFIED Requirements` - Changes to existing requirements
   - `## REMOVED Requirements` - Requirements to remove
   - `## RENAMED Requirements` - Requirements to rename (FROM:/TO: format)

   If no delta specs found, inform user and stop.

4. **For each delta spec, apply changes to main specs**

   For each repo-local capability delta spec path returned by the CLI:

   a. **Read the delta spec** to understand the intended changes

   b. **Read the main spec** at `openspec/specs/<capability>/spec.md` (may not exist yet)

   c. **Apply changes intelligently**:

      **ADDED Requirements:**
      - If requirement doesn't exist in main spec → add it
      - If requirement already exists → update it to match (treat as implicit MODIFIED)

      **MODIFIED Requirements:**
      - Find the requirement in main spec
      - Apply the changes - this can be:
        - Adding new scenarios (don't need to copy existing ones)
        - Modifying existing scenarios
        - Changing the requirement description
      - Preserve scenarios/content not mentioned in the delta

      **REMOVED Requirements:**
      - Remove the entire requirement block from main spec

      **RENAMED Requirements:**
      - Find the FROM requirement, rename to TO

   d. **Create new main spec** if capability doesn't exist yet:
      - Create `openspec/specs/<capability>/spec.md`
      - Add Purpose section (can be brief, mark as TBD)
      - Add Requirements section with the ADDED requirements

5. **Show summary**

   After applying all changes, summarize:
   - Which capabilities were updated
   - What changes were made (requirements added/modified/removed/renamed)

**Delta Spec Format Reference**

```markdown
## ADDED Requirements

### Requirement: New Feature
The system SHALL do something new.

#### Scenario: Basic case
- **WHEN** user does X
- **THEN** system does Y

## MODIFIED Requirements

### Requirement: Existing Feature
#### Scenario: New scenario to add
- **WHEN** user does A
- **THEN** system does B

## REMOVED Requirements

### Requirement: Deprecated Feature

## RENAMED Requirements

- FROM: `### Requirement: Old Name`
- TO: `### Requirement: New Name`
```

**Key Principle: Intelligent Merging**

Unlike programmatic merging, you can apply **partial updates**:
- To add a scenario, just include that scenario under MODIFIED - don't copy existing scenarios
- The delta represents *intent*, not a wholesale replacement
- Use your judgment to merge changes sensibly

**Output On Success**

```
## Specs Synced: <change-name>

Updated main specs:

**<capability-1>**:
- Added requirement: "New Feature"
- Modified requirement: "Existing Feature" (added 1 scenario)

**<capability-2>**:
- Created new spec file
- Added requirement: "Another Feature"

Main specs are now updated. The change remains active - archive when implementation is complete.
```

**Guardrails**
- Read both delta and main specs before making changes
- Preserve existing content not mentioned in delta
- If something is unclear, ask for clarification
- Show what you're changing as you go
- The operation should be idempotent - running twice should give same result

### Conflict Resolution

If the main spec has been modified **after** the delta spec was written (e.g., by
another synced change), a conflict may arise. Follow this strategy:

1. **Detect**: Compare the delta spec's target requirement with the current main spec content. If the main spec has diverged (different scenarios, wording, or structure), flag a potential conflict.
2. **Resolve additively**: For ADDED requirements, if the requirement name already exists but the content differs, treat as MODIFIED — merge the new scenarios into the existing requirement.
3. **Resolve conservatively**: For MODIFIED requirements, if the target section in main has changed significantly, warn the user: "Main spec for <capability> has diverged since this delta was written. Show both versions before merging."
4. **Never silently overwrite**: If unsure whether the existing content is intentional, ask before replacing.

## Anti-Patterns

- **DO NOT** overwrite main spec content not mentioned in the delta — partial updates only
- **DO NOT** skip reading the main spec before applying changes — you need current state
- **DO NOT** assume the delta format — validate sections (ADDED/MODIFIED/REMOVED/RENAMED) exist
- **DO NOT** sync without user selection when multiple changes exist — always let user choose
- **DO NOT** proceed if workspace-planning mode is detected — stop and explain

## V13 Enterprise Integration

### Agent Contract

This skill is managed by the V13 Master Orchestrator (`auto-pipeline-v13.mjs`) via the LIFECYCLE_CONTRACTS in `agent-contracts.mjs`.

**Contract Summary:**
- **Role:** spec-synchronizer
- **Fatal:** No
- **Prerequisites:** OPSX_PROPOSE
- **Produces:** synced-specs
- **Handoff:** OPSX_APPLY
- **Retry Policy:** 3 retries, 500ms backoff
- **Recovery Strategy:** Check for merge conflicts in delta specs. Re-validate sync metadata.

### Success Criteria
- Delta specs merged to main without conflicts

### V13 Runtime Integration

When invoked by `/opsx-auto`, this phase:
1. Receives shared context from the master orchestrator
2. Validates prerequisites via `validatePrerequisites()` 
3. Records findings/decisions/risks to `ctx.sharedMemory`
4. Hands off to the next phase via contract

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| v13.0 | 2026-07 | V13 enterprise integration: agent contract with LIFECYCLE_CONTRACTS, master orchestrator handoff, shared memory context, retry/recovery policies. |
| v2.0 | 2026-07 | Added metadata consistency, Prerequisites, Related Skills, conflict resolution strategy, Anti-Patterns. |
| v1.0 | 2026-06 | Initial sync with intelligent merging, delta spec format reference, idempotency guardrail. |
