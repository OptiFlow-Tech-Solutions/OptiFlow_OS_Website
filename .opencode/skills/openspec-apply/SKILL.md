---
name: openspec-apply
description: >
  Implement tasks from an OpenSpec change's tasks.md. Supports autonomous mode
  (driven by /opsx-auto) with sequential task execution, build-after-change,
  error classification (recoverable/design/dependency/environment), stagnation
  detection, and retry limits. Also supports standalone mode via openspec CLI.
  FATAL phase — pipeline stops on unrecoverable failure.
license: MIT
compatibility: OpenSpec >= 1.0, Node.js >= 18
metadata:
  version: "14.0"
  enterprise: true
  generatedBy: "2.1.0"
  triggers:
    - /opsx-apply
    - opsx apply
    - apply
    - implement
    - execute tasks
  domains:
    - implementation
    - development
    - build
    - code-generation
  orchestration:
    phase: OPSX_APPLY
    role: implementer
    isFatal: true
    requires: [OPSX_PROPOSE]
    handoffTo: VALIDATE
    retryPolicy: { maxRetries: 1, backoffMs: 3000 }
  relatedSkills:
    - openspec-auto
    - openspec-propose
    - openspec-verify
  outputContracts:
    optional:
      - implementation (code changes)
      - build-output (build results)
      - task progress (completed task count)
  changelog: |
    v14.0 (2026-07-04): Enterprise upgrade — enhanced metadata, orchestration contract,
      expanded triggers and domains, output contracts.
    v13.0 (2026-07-03): V13 integration — autonomous mode with retry limits and stagnation detection.
---

## Purpose

Implement the tasks defined in an OpenSpec change's `tasks.md`. This skill handles
both autonomous execution (driven by `/opsx-auto`) and standalone use where the
user directs implementation manually.

## Prerequisites

- `openspec/` change directory with `tasks.md` containing checkbox items
- `proposal.md` and `design.md` artifacts for context
- `npm run build && npm run validate` available for verification
- V12: Task loop includes retry limits (3 per task) and stagnation detection

## Related Skills

| Skill | Role | When Used |
|-------|------|-----------|
| `openspec-propose` | Create tasks.md | Before apply — defines what to implement |
| `openspec-auto` | Autonomous orchestration | When apply is run as Phase 7 |
| `openspec-verify` | Verify completed work | After all tasks done |
| `openspec-archive` | Archive completed change | After verification |

Implement tasks from an OpenSpec change.

**Input**: Optionally specify a change name. If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Autonomous Mode:** When invoked by `/opsx-auto`, the change context is already
loaded. The pipeline has already created proposal.md, design.md, and tasks.md.
Your job:

1. Read tasks.md to understand all remaining work
2. Work through each `- [ ]` item sequentially
3. Follow DESIGN.md rules exactly: CSS variables, placeholders, includes, typography
4. Build after each file change: `npm run build && npm run validate`
5. Mark each task `- [x]` as completed
6. Continue until ALL tasks are `- [x]` or a blocker is encountered
7. If blocked: fix the issue, re-build, continue. Only pause for genuine ambiguity.
8. Report progress after each task: "✓ Task 3/7 complete"
9. When all tasks done: do NOT suggest archive — the autonomous pipeline handles it.

Do NOT stop between tasks. Do NOT ask "shall I continue?" Just keep going until
all tasks are complete or an unrecoverable blocker occurs.

**Retry Limits (V12):**
- Each individual task may be retried up to **3 times** if it fails.
- If a task fails 3 times with the same error, mark it as blocked and pause.
- If 3 consecutive tasks each fail identically (no task makes forward progress),
  the loop is stalled — pause and report stagnation.
- Record the retry count per task; a different error on the same task resets the counter.

**Standalone Mode:** When invoked directly by the user, follow the steps below.

**Steps**

1. **Select the change**

   If a name is provided, use it. Otherwise:
   - Infer from conversation context if the user mentioned a change
   - Auto-select if only one active change exists
   - If ambiguous, run `openspec list --json` to get available changes and use the **AskUserQuestion tool** to let the user select

   Always announce: "Using change: <name>" and how to override (e.g., `/opsx-apply <other>`).

2. **Check status to understand the schema**
   ```bash
   openspec status --change "<name>" --json
   ```
   Parse the JSON to understand:
   - `schemaName`: The workflow being used (e.g., "spec-driven")
   - `planningHome`, `changeRoot`, and `actionContext`: planning scope and edit constraints
   - Which artifact contains the tasks (typically "tasks" for spec-driven, check status for others)

3. **Get apply instructions**

   ```bash
   openspec instructions apply --change "<name>" --json
   ```

   This returns:
   - `contextFiles`: artifact ID -> array of concrete file paths (varies by schema - could be proposal/specs/design/tasks or spec/tests/implementation/docs)
   - Progress (total, complete, remaining)
   - Task list with status
   - Dynamic instruction based on current state

   **Handle states:**
   - If `state: "blocked"` (missing artifacts): show message, suggest using openspec-continue-change
   - If `state: "all_done"`: congratulate, suggest archive
   - Otherwise: proceed to implementation

   **Workspace guard:** If status JSON reports `actionContext.mode: "workspace-planning"` and `allowedEditRoots` is empty, explain that full workspace apply is not supported in this slice. Treat linked repos and folders as read-only context, ask the user to select an affected area through an explicit implementation workflow, and STOP before editing files.

4. **Read context files**

   Read every file path listed under `contextFiles` from the apply instructions output.
   The files depend on the schema being used:
   - **spec-driven**: proposal, specs, design, tasks
   - Other schemas: follow the contextFiles from CLI output

5. **Show current progress**

   Display:
   - Schema being used
   - Progress: "N/M tasks complete"
   - Remaining tasks overview
   - Dynamic instruction from CLI

6. **Implement tasks (loop until done or blocked)**

   For each pending task:
   - Show which task is being worked on
   - Make the code changes required
   - Keep changes minimal and focused
   - Mark task complete in the tasks file: `- [ ]` → `- [x]`
   - Continue to next task

   **Retry per task (V12):**
   - If a task fails, retry up to **3 times** before marking it blocked.
   - Track retry count per task; a different error resets the counter.
   - On 3rd failure with the same root error: mark `- [!]` (blocked) and pause.

   **Stagnation detection (V12):**
   - If 3 consecutive tasks fail without any task being marked complete,
     the loop has stalled — pause and report stagnation.
   - A successful task completion resets the stagnation counter.

   **Pause if:**
   - Task is unclear → ask for clarification
   - Implementation reveals a design issue → suggest updating artifacts
   - Error or blocker encountered → report and wait for guidance
   - Task failed 3 times with same error → mark blocked, pause
   - 3 consecutive tasks failed with no progress → report stagnation, pause
   - User interrupts

7. **On completion or pause, show status**

   Display:
   - Tasks completed this session
   - Overall progress: "N/M tasks complete"
   - If all done: suggest archive
   - If paused: explain why and wait for guidance

**Output During Implementation**

```
## Implementing: <change-name> (schema: <schema-name>)

Working on task 3/7: <task description>
[...implementation happening...]
✓ Task complete

Working on task 4/7: <task description>
[...implementation happening...]
✓ Task complete
```

**Output On Completion**

```
## Implementation Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 7/7 tasks complete ✓

### Completed This Session
- [x] Task 1
- [x] Task 2
...

All tasks complete! Ready to archive this change.
```

**Output On Pause (Issue Encountered)**

```
## Implementation Paused

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 4/7 tasks complete

### Issue Encountered
<description of the issue>

**Options:**
1. <option 1>
2. <option 2>
3. Other approach

What would you like to do?
```

- **When to escalate**: After max retries or stagnation — pause and wait for human guidance

**Error Classification (V12):**

| Error Type | Example | Action |
|-----------|---------|--------|
| **Recoverable** | Build error (missing tag) | Fix, rebuild, retry |
| **Design error** | Approach is wrong for the requirement | Pause, update design.md, get approval |
| **Dependency error** | Blocked by incomplete upstream task | Skip, flag dependency, continue with others |
| **Environment error** | npm not found, disk full | Pause immediately, report, do not retry |

**Guardrails**
- Keep going through tasks until done or blocked
- Always read context files before starting (from the apply instructions output)
- If task is ambiguous, pause and ask before implementing
- If implementation reveals issues, pause and suggest artifact updates
- Keep code changes minimal and scoped to each task
- Update task checkbox immediately after completing each task
- Pause on errors, blockers, or unclear requirements - don't guess
- Use contextFiles from CLI output, don't assume specific file names
- Max 3 retries per task with the same root error before marking blocked
- Track stagnation: 3 consecutive task failures without progress = pause

**Fluid Workflow Integration**

This skill supports the "actions on a change" model:

- **Can be invoked anytime**: Before all artifacts are done (if tasks exist), after partial implementation, interleaved with other actions
- **Allows artifact updates**: If implementation reveals design issues, suggest updating artifacts - not phase-locked, work fluidly

## Anti-Patterns

- **DO NOT** skip building after changes — unverified changes accumulate silently
- **DO NOT** treat all errors equally — classify before retrying (recoverable vs design vs environment)
- **DO NOT** continue after 3 consecutive task failures without progress — pause and report stagnation
- **DO NOT** implement tasks before reading context files from the apply instructions output
- **DO NOT** mark tasks complete without verifying — check `npm run build && npm run validate` first

## V13 Enterprise Integration

### Agent Contract

This skill is managed by the V13 Master Orchestrator (`auto-pipeline-v13.mjs`) via the LIFECYCLE_CONTRACTS in `agent-contracts.mjs`.

**Contract Summary:**
- **Role:** implementer
- **Fatal:** Yes
- **Prerequisites:** OPSX_PROPOSE
- **Produces:** implementation, build-output
- **Handoff:** VALIDATE
- **Retry Policy:** 1 retry, 3s backoff
- **Recovery Strategy:** Check tasks.md for remaining tasks. Re-run failed build/validation commands.

### Success Criteria
- All tasks in tasks.md marked [x] complete

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
| v2.0 | 2026-07 | Added metadata (triggers, domains), V12 retry limits + stagnation detection, error classification, Anti-Patterns. |
| v1.0 | 2026-06 | Initial apply with autonomous/standalone modes, task loop, fluid workflow integration. |
