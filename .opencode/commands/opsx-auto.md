# `/opsx-auto` — Autonomous Spec-Driven Development Orchestration

<!-- canonical: .opencode/skills/openspec-auto/SKILL.md -->

## EXECUTION IS MANDATORY — DO NOT STOP UNTIL DONE

When the user invokes `/opsx-auto "<task>"`, you MUST execute ALL 8 phases
sequentially in a single session. Do NOT ask for confirmation between phases.
Do NOT stop after planning. Continue until the final report is produced.

## Usage

```
/opsx-auto "Build the Pricing Page"
/opsx-auto "Implement Authentication"
/opsx-auto "Fix the Dashboard layout"
/opsx-auto --dry-run "Plan newsletter subscription"
/opsx-auto --skip-build "Improve navigation"
```

## Mandatory Execution Loop

### STEP 0: Load the Engine

```js
// Load the state-machine engine
const mod = await import('./orchestrate/auto-pipeline.mjs');

// Initialize — this creates the execution context
const ctx = mod.initPipeline("TASK_DESCRIPTION", {
  dryRun: false,        // true if --dry-run flag present
  skipBuild: false,     // true if --skip-build flag present
});
```

### STEP 1: Deep Scan — ALWAYS run first

```js
mod.runDeepScan(ctx);
```

Read the output. Note the project name, framework, architecture, feature ID,
TODOs, FIXMEs, and affected specs. These inform all downstream phases.

### STEP 2: Skill Discovery — ALWAYS run second

```js
mod.runSkillDiscovery(ctx);
```

Read the output. Note which skills were selected, which agent is primary,
and which quality gates apply. Load the selected skills using the `skill` tool.

Important: `ctx.skills` now contains the list. Load at least the top 3 skills:
```js
// For each skill in ctx.skills (up to top 6), load it:
// use the skill tool with the skill name
```

### STEP 3: Explore — study the codebase

```js
await mod.runExplore(ctx);
```

This scans specs, features, and pages. Read the output to understand:
- Which specs are affected
- Which features are relevant
- Which pages exist

The AI MUST also directly read:
- `site.json` — company data, pages, navigation
- `DESIGN.md/` directory — design system rules
- `openspec/specs/` — affected spec files
- `features/features.json` — feature registry
- Affected page files from `src/pages/`

The AI MUST read the design system:
- Colors: always use CSS variable references from DESIGN.md
- Spacing: use gap variables
- Typography: use defined classes
- Never hardcode values found in DESIGN.md

### STEP 4: Propose — create the plan

```js
await mod.runPropose(ctx);
```

This creates:
- `openspec/changes/<name>/proposal.md`
- `openspec/changes/<name>/design.md`
- `openspec/changes/<name>/tasks.md`

The AI MUST then REVIEW and ENRICH these files with domain-specific detail:
- Read each generated file
- Add concrete, actionable specifics
- Replace any "TBD" with real content
- Ensure design.md references exact DESIGN.md rules
- Ensure tasks.md has concrete, ordered, verifiable checklist items
- Create delta specs in `openspec/changes/<name>/specs/`

### STEP 5: Sync — merge delta specs to main

```js
await mod.runSync(ctx);
```

This auto-merges delta specs. The AI agent should verify the merge was clean.
If any delta specs exist in `openspec/changes/<name>/specs/`, they are now
merged into `openspec/specs/`.

### STEP 6: Apply — implement the tasks

```js
await mod.runApply(ctx);
```

This is the core implementation phase. The AI agent MUST:

1. Read `openspec/changes/<name>/tasks.md` — this is the TODO list
2. For each unchecked task, implement it using tools (write, edit, bash)
3. Follow ALL design rules from DESIGN.md EXACTLY:
   - Colors: `var(--*)` only
   - Spacing: `var(--gap-*)` only
   - Typography: `.display`, `h1`-`h6`, `.lead`, `.body` classes
   - Never hardcode hex values
   - Never hardcode company info (phone, email, year)
   - Include nav/footer via INCLUDE directives
4. After each file change, verify the page assembles correctly
5. Load relevant skills from `ctx.skills` before implementation (design-system, frontend-patterns, etc.)
6. Mark each task `[x]` in tasks.md when complete

### STEP 7: Validate — build, lint, test, gates

```js
await mod.runValidate(ctx);
```

This runs the REAL build and validation:
- `node scripts/assemble.mjs` (build)
- `node scripts/validate.mjs` (validate)
- `npm run lint` (if available)
- `npm test` (if available)
- Quality gates

If validation fails, the AI agent MUST fix the issues and re-run validation.

### STEP 8: Archive — finalize and trace

```js
await mod.runArchive(ctx);
```

This syncs specs to main, generates traceability, and syncs docs.

### STEP 9: Report — produce the final summary

```js
const report = mod.finishPipeline(ctx);
console.log(JSON.stringify(report, null, 2));
```

Display the final report to the user. Show:
- Status (COMPLETE or PARTIAL)
- Phases passed vs failed
- Total duration
- Project, framework, skills used

## Fault Tolerance

If ANY phase fails:
1. `ctx.failPhase()` has already been called — state is preserved on disk
2. Log the error clearly
3. If the failure is in PROPOSE or APPLY: STOP — these are fatal
4. If the failure is in EXPLORE, SYNC, or ARCHIVE: continue with a warning
5. Call `finishPipeline(ctx)` to produce a partial report
6. Do NOT proceed to downstream phases if a required dependency failed

## Live Progress Format

After each phase, display:
```
[1/8] Deep Scan
✓ Completed (1.2s)

[2/8] Skill Discovery
✓ Loaded 9 Skills (0.3s)

[3/8] Explore
✓ Completed (2.1s)
...
```

## Options

| Flag | Effect |
|------|--------|
| `--dry-run` | Plan only. Stop after phase 2 (Skill Discovery). |
| `--skip-build` | Skip phase 7 validation (build/lint/test). |

## Safety

- Max 200 files changed per execution
- Protected dirs never deleted: .git, node_modules, dist, orchestrate/.state
- Critical files never deleted: site.json, package.json, AGENTS.md
- Every phase persisted to disk for recovery

## Recovery

If the session is interrupted, resume with:
```js
const ctx = PipelineContext.load("EXECUTION_ID");
// ctx.phases shows what's done; ctx.nextPhaseId shows what's next
```

## Output Files

Every execution produces:
- `orchestrate/.state/<executionId>-context.json` — full execution context
- `orchestrate/.state/<executionId>-log.json` — structured phase log
- `orchestrate/.state/execution-summary.jsonl` — append-only summary
- `orchestrate/.audit.jsonl` — immutable audit trail
- `openspec/changes/<name>/proposal.md` — proposal
- `openspec/changes/<name>/design.md` — design decisions
- `openspec/changes/<name>/tasks.md` — task checklist
- `openspec/changes/<name>/specs/` — delta specs
