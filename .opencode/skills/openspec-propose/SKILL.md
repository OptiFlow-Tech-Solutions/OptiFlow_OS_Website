---
name: openspec-propose
description: >
  Propose a new change with all artifacts generated in one step —
  proposal.md (what & why), design.md (how), tasks.md (implementation steps),
  and delta specs (ADDED/MODIFIED/REMOVED requirements). Supports autonomous
  mode (driven by /opsx-auto) and standalone use. FATAL phase — pipeline stops on failure.
license: MIT
compatibility: OpenSpec >= 1.0, Node.js >= 18
metadata:
  version: "14.0"
  enterprise: true
  generatedBy: "2.1.0"
  triggers:
    - /opsx-propose
    - opsx propose
    - propose
    - create proposal
    - scaffold change
  domains:
    - planning
    - documentation
    - specification
    - design
  orchestration:
    phase: OPSX_PROPOSE
    role: proposal-writer
    isFatal: true
    requires: [OPSX_EXPLORE]
    handoffTo: OPSX_SYNC
    retryPolicy: { maxRetries: 1, backoffMs: 2000 }
  relatedSkills:
    - openspec-auto
    - openspec-explore
    - openspec-sync
  outputContracts:
    required:
      - proposal.md
      - design.md
      - tasks.md
    optional:
      - delta-specs
  changelog: |
    v14.0 (2026-07-04): Enterprise upgrade — enhanced metadata, orchestration contract,
      expanded triggers and domains, output contracts with required/optional distinction.
    v13.0 (2026-07-03): V13 integration — autonomous mode with direct artifact writing.
---

## Purpose

Propose a new OpenSpec change with all required artifacts generated in one step.
This skill creates the change directory, generates proposal.md, design.md, tasks.md,
and delta specs — everything needed before implementation begins.

## Prerequisites

- `openspec` CLI installed and configured
- Exploration phase completed (via `/opsx-explore` or `/opsx-auto`)
- Understanding of which specs, features, and pages are affected
- `openspec new change` command available

## Related Skills

| Skill | Role | When Used |
|-------|------|-----------|
| `openspec-explore` | Pre-proposal understanding | Before proposing — defines scope |
| `openspec-auto` | Autonomous orchestration | When propose is run as Phase 5 |
| `openspec-sync` | Merge delta specs | After proposal creates deltas |
| `openspec-apply` | Implement tasks | After proposal is approved |

Propose a new change - create the change and generate all artifacts in one step.

I'll create a change with artifacts:
- proposal.md (what & why)
- design.md (how)
- tasks.md (implementation steps)

When ready to implement, run /opsx-apply

---

**Input**: The user's request should include a change name (kebab-case) OR a description of what they want to build.

**Autonomous Mode:** When invoked by `/opsx-auto`, the changeName and task description
are provided from the pipeline context. Write artifacts directly — do NOT run
`openspec new change` or `openspec instructions`. The pipeline already set up
the change directory. Create:

1. `openspec/changes/{changeName}/proposal.md` — what, why, scope, affected specs, recommended skills
2. `openspec/changes/{changeName}/design.md` — architecture decisions, design system compliance, component plan
3. `openspec/changes/{changeName}/tasks.md` — concrete, ordered checklist items (max 2hr each)
4. `openspec/changes/{changeName}/specs/*.md` — delta specs for affected capabilities

Follow the project's DESIGN.md rules when writing design.md. Reference existing
page templates from `src/pages/`. Use the feature registry from `features/features.json`
when relevant. After writing, proceed directly to implementation — no pause needed.

**Standalone Mode:** When invoked directly by the user (not from /opsx-auto), follow
the steps below.

**Steps**

1. **If no clear input provided, ask what they want to build**

   Use the **AskUserQuestion tool** (open-ended, no preset options) to ask:
   > "What change do you want to work on? Describe what you want to build or fix."

   From their description, derive a kebab-case name (e.g., "add user authentication" → `add-user-auth`).

   **IMPORTANT**: Do NOT proceed without understanding what the user wants to build.

2. **Create the change directory**
   ```bash
   openspec new change "<name>"
   ```
   This creates a scaffolded change in the planning home resolved by the CLI with `.openspec.yaml`.

3. **Get the artifact build order**
   ```bash
   openspec status --change "<name>" --json
   ```
   Parse the JSON to get:
   - `applyRequires`: array of artifact IDs needed before implementation (e.g., `["tasks"]`)
   - `artifacts`: list of all artifacts with their status and dependencies
   - `planningHome`, `changeRoot`, `artifactPaths`, and `actionContext`: path and scope context. Use these instead of assuming repo-local paths.

4. **Create artifacts in sequence until apply-ready**

   Use the **TodoWrite tool** to track progress through the artifacts.

   Loop through artifacts in dependency order (artifacts with no pending dependencies first):

   a. **For each artifact that is `ready` (dependencies satisfied)**:
      - Get instructions:
        ```bash
        openspec instructions <artifact-id> --change "<name>" --json
        ```
      - The instructions JSON includes:
        - `context`: Project background (constraints for you - do NOT include in output)
        - `rules`: Artifact-specific rules (constraints for you - do NOT include in output)
        - `template`: The structure to use for your output file
        - `instruction`: Schema-specific guidance for this artifact type
        - `resolvedOutputPath`: Resolved path or pattern to write the artifact
        - `dependencies`: Completed artifacts to read for context
      - Read any completed dependency files for context
      - Create the artifact file using `template` as the structure and write it to `resolvedOutputPath`
      - Apply `context` and `rules` as constraints - but do NOT copy them into the file
      - Show brief progress: "Created <artifact-id>"

    b. **Continue until all `applyRequires` artifacts are complete**
       - After creating each artifact, re-run `openspec status --change "<name>" --json`
       - Check if every artifact ID in `applyRequires` has `status: "done"` in the artifacts array
       - Stop when all `applyRequires` artifacts are done
       - **V12: If any artifact fails to generate after 3 attempts, pause and report.**

    c. **If an artifact requires user input** (unclear context):
      - Use **AskUserQuestion tool** to clarify
      - Then continue with creation

5. **Show final status**
   ```bash
   openspec status --change "<name>"
   ```

**Output**

After completing all artifacts, summarize:
- Change name and location
- List of artifacts created with brief descriptions
- What's ready: "All artifacts created! Ready for implementation."
- Prompt: "Run `/opsx-apply` or ask me to implement to start working on the tasks."

**Artifact Creation Guidelines**

- Follow the `instruction` field from `openspec instructions` for each artifact type
- The schema defines what each artifact should contain - follow it
- Read dependency artifacts for context before creating new ones
- Use `template` as the structure for your output file - fill in its sections
- **IMPORTANT**: `context` and `rules` are constraints for YOU, not content for the file
  - Do NOT copy `<context>`, `<rules>`, `<project_context>` blocks into the artifact
  - These guide what you write, but should never appear in the output

**Guardrails**
- Create ALL artifacts needed for implementation (as defined by schema's `apply.requires`)
- Always read dependency artifacts before creating a new one
- If context is critically unclear, ask the user - but prefer making reasonable decisions to keep momentum
- If a change with that name already exists, ask if user wants to continue it or create a new one
- Verify each artifact file exists after writing before proceeding to next

## Anti-Patterns

- **DO NOT** skip reading dependency artifacts before creating a new one
- **DO NOT** copy `<context>` or `<rules>` blocks into artifact files — they are for you only
- **DO NOT** skip the `openspec instructions` step — it provides the schema driving artifact structure
- **DO NOT** create artifacts before running `openspec new change` (in standalone mode)
- **DO NOT** assume repo-local paths — always use `planningHome`, `changeRoot`, and `artifactPaths` from status JSON

## V13 Enterprise Integration

### Agent Contract

This skill is managed by the V13 Master Orchestrator (`auto-pipeline-v13.mjs`) via the LIFECYCLE_CONTRACTS in `agent-contracts.mjs`.

**Contract Summary:**
- **Role:** proposal-writer
- **Fatal:** Yes
- **Prerequisites:** OPSX_EXPLORE
- **Produces:** proposal.md, design.md, tasks.md, delta-specs
- **Handoff:** OPSX_SYNC
- **Retry Policy:** 1 retry, 2s backoff
- **Recovery Strategy:** Re-analyze task and regenerate proposal artifacts with corrected scope.

### Success Criteria
- All three artifacts (proposal.md, design.md, tasks.md) exist and are valid

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
| v2.0 | 2026-07 | Added metadata (triggers, domains), Prerequisites, Related Skills, retry limit on artifact creation, Anti-Patterns. |
| v1.0 | 2026-06 | Initial propose with artifact generation pipeline, artifact creation guidelines. |
