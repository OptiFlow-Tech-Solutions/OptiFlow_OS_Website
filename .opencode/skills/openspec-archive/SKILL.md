---
name: openspec-archive
description: Archive a completed change in the experimental workflow. Use when the user wants to finalize and archive a change after implementation is complete.
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "2.0"
  generatedBy: "2.0.0"
  triggers:
    - /opsx-archive
    - opsx archive
    - archive change
    - finalize change
  domains:
    - orchestration
    - spec-driven-development
    - lifecycle
    - meta
---

## Purpose

Archive a completed OpenSpec change — move it from the active `changes/` directory
to `archive/YYYY-MM-DD-<name>/`, preserving the full change record with artifacts,
specs, and traceability.

## Prerequisites

- An active change in `openspec/changes/` with artifacts (proposal.md, design.md, tasks.md)
- Implementation verified (via `/opsx-verify` or manual validation)
- `openspec status --change "<name>" --json` available
- No conflicting archive target (same date + name)

## Related Skills

| Skill | Role | When Used |
|-------|------|-----------|
| `openspec-verify` | Pre-archive verification | Before archiving — confirms readiness |
| `openspec-sync` | Final spec sync | During archive — assessed before moving |
| `openspec-auto` | Autonomous orchestration | When archive is run as Phase 9 |
| `openspec-apply` | Implementation | Before archive — must be complete |

Archive a completed change in the experimental workflow.

**Input**: Optionally specify a change name. If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **If no change name provided, prompt for selection**

   Run `openspec list --json` to get available changes. Use the **AskUserQuestion tool** to let the user select.

   Show only active changes (not already archived).
   Include the schema used for each change if available.

   **IMPORTANT**: Do NOT guess or auto-select a change. Always let the user choose.

2. **Check artifact completion status**

   Run `openspec status --change "<name>" --json` to check artifact completion.

   Parse the JSON to understand:
   - `schemaName`: The workflow being used
   - `planningHome`, `changeRoot`, `artifactPaths`, and `actionContext`: path and scope context
   - `artifacts`: List of artifacts with their status (`done` or other)

   If status reports `actionContext.mode: "workspace-planning"`, explain that workspace archive is not supported in this slice and STOP. Do not move workspace changes into repo-local archives or edit linked repos.

   **If any artifacts are not `done`:**
   - Display warning listing incomplete artifacts
   - Use **AskUserQuestion tool** to confirm user wants to proceed
   - Proceed if user confirms

3. **Check task completion status**

   Read the tasks file (typically `tasks.md`) to check for incomplete tasks.

   Count tasks marked with `- [ ]` (incomplete) vs `- [x]` (complete).

   **If incomplete tasks found:**
   - Display warning showing count of incomplete tasks
   - Use **AskUserQuestion tool** to confirm user wants to proceed
   - Proceed if user confirms

   **If no tasks file exists:** Proceed without task-related warning.

4. **Assess delta spec sync state**

   Use `artifactPaths.specs.existingOutputPaths` from status JSON to check for delta specs. If none exist, proceed without sync prompt.

   **If delta specs exist:**
   - Compare each delta spec with its corresponding main spec at `openspec/specs/<capability>/spec.md`
   - Determine what changes would be applied (adds, modifications, removals, renames)
   - Show a combined summary before prompting

   **Prompt options:**
   - If changes needed: "Sync now (recommended)", "Archive without syncing"
   - If already synced: "Archive now", "Sync anyway", "Cancel"

   If user chooses sync, use Task tool (subagent_type: "general-purpose", prompt: "Use Skill tool to invoke openspec-sync-specs for change '<name>'. Delta spec analysis: <include the analyzed delta spec summary>"). Proceed to archive regardless of choice.

5. **Perform the archive**

   Create an `archive` directory under `planningHome.changesDir` if it doesn't exist:
   ```bash
   mkdir -p "<planningHome.changesDir>/archive"
   ```

   Generate target name using current date: `YYYY-MM-DD-<change-name>`

   **Check if target already exists:**
   - If yes: Fail with error, suggest renaming existing archive or using different date
   - If no: Move `changeRoot` to the archive directory

   ```bash
   mv "<changeRoot>" "<planningHome.changesDir>/archive/YYYY-MM-DD-<name>"
   ```

6. **Display summary**

   Show archive completion summary including:
   - Change name
   - Schema that was used
   - Archive location
   - Whether specs were synced (if applicable)
   - Note about any warnings (incomplete artifacts/tasks)

**Output On Success**

```
## Archive Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** the archive path derived from `planningHome.changesDir`/YYYY-MM-DD-<name>/
**Specs:** ✓ Synced to main specs (or "No delta specs" or "Sync skipped")

All artifacts complete. All tasks complete.
```

**Guardrails**
- Always prompt for change selection if not provided
- Use artifact graph (openspec status --json) for completion checking
- Don't block archive on warnings - just inform and confirm
- Preserve .openspec.yaml when moving to archive (it moves with the directory)
- Show clear summary of what happened
- If sync is requested, use openspec-sync-specs approach (agent-driven)
- If delta specs exist, always run the sync assessment and show the combined summary before prompting

### Autonomous Mode

When invoked by `/opsx-auto`, the archive phase:
1. Has already passed all validation gates
2. Runs sync assessment automatically
3. May skip human confirmation if `autoApprove` is enabled
4. Produces a verification report via `verifyCompletion()` before finalizing

### Post-Archive Verification

After archiving, verify:
- The change directory no longer exists under `openspec/changes/`
- The archive directory exists under `openspec/changes/archive/YYYY-MM-DD-<name>/`
- `traceability.md` was generated (if applicable)
- Feature registry status is updated (if `features/features.json` has the feature)

## Anti-Patterns

- **DO NOT** archive without verifying implementation first — run `/opsx-verify` before archiving
- **DO NOT** archive with uncommitted changes — use `git status` to check
- **DO NOT** force archive when delta specs are unsynced — always offer sync first
- **DO NOT** archive without checking for target collision — same date + name = error
- **DO NOT** skip the artifact completion check — warn if artifacts are incomplete

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| v2.0 | 2026-07 | Added metadata consistency, Prerequisites, Related Skills, Autonomous Mode section, post-archive verification, Anti-Patterns. |
| v1.0 | 2026-06 | Initial archive with sync assessment, date-named archives, warning system, collision handling. |
