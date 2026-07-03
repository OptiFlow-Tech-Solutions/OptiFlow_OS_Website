---
name: openspec-auto
description: Master orchestration command — autonomous end-to-end spec-driven development lifecycle. Deep-scans codebase, discovers skills from global + project archives, executes explore → propose → sync → apply → validate → archive.
license: MIT
compatibility: Requires openspec CLI, Node.js >= 18.
metadata:
  author: openspec
  version: "7.0"
  generatedBy: "1.4.1"
  triggers:
    - /opsx-auto
    - opsx auto
    - auto pipeline
    - spec-driven auto
    - auto orchestrate
    - intelligent entry point
    - single command orchestrator
    - master orchestration
    - auto lifecycle
  domains:
    - orchestration
    - spec-driven
    - automation
    - quality
    - meta
---

# `/opsx-auto` — Master Orchestration

This is the **single intelligent entry point** for all Spec-Driven Development. Given any natural language task description, it auto-discovers the complete implementation context, dynamically selects the most relevant skills from the global (~271) and project (6) skill archives, and executes the full OpenSpec lifecycle — all without manual selection.

## When to Use

- Any task that requires full lifecycle execution
- "Build the Pricing Page"
- "Implement Authentication"
- "Fix the Dashboard layout"
- "Create an Inventory Module"
- "Redesign the Hero Section"
- "Add newsletter subscription flow"

## Architecture

This is an **orchestration skill** — it coordinates existing skills, agents, MCPs, and hooks. It does not duplicate any logic.

```
User task description
    │
    ▼
coordinator.mjs → run(taskDescription)
    │
    ▼
auto-pipeline.mjs (8-phase brain)
    │
    ├── Phase 1: DEEP_SCAN      → project-analyzer.mjs + context-loader.mjs
    ├── Phase 2: SKILL_DISCOVERY → skill-discovery.mjs + capability-analyzer.mjs
    ├── Phase 3: OPSX_EXPLORE    → runOpsxCommand('explore')
    ├── Phase 4: OPSX_PROPOSE    → runOpsxCommand('propose')
    ├── Phase 5: OPSX_SYNC       → runOpsxCommand('sync')
    ├── Phase 6: OPSX_APPLY      → runOpsxCommand('apply')
    ├── Phase 7: VALIDATE        → build + lint + test + quality gates
    └── Phase 8: OPSX_ARCHIVE    → runOpsxCommand('archive')
```

## Skill Discovery

In Phase 2, the engine scans:
- `~/.config/opencode/skills/` — 271 global ECC skills
- `.opencode/skills/` — 6 project-specific skills

Each SKILL.md is parsed for:
- Frontmatter name/description
- Trigger keywords
- Domain-specific patterns

Skills are scored against the task description by:
1. Trigger keyword match (+3 per match)
2. Domain overlap with analyzed domains (+2 per match)
3. Word overlap in description (+1 per match)

Only the top 12 most relevant skills are selected.

## Safety Rules

- Never delete files in protected directories
- Never overwrite user work without proposal
- Never duplicate existing implementations
- Never bypass validation gates
- Stop pipeline safely on any phase failure
- Always preserve project integrity

## Constraints

- Must not break existing explicit commands (`/opsx-explore`, `/opsx-propose`, etc.)
- Auto mode is additive — individual commands remain independently executable
- Validation auto-fix attempts limited to 3 iterations
- Maximum 200 files changed per execution

## Output

Every execution produces:
- Live console output with per-phase status indicators (✔/✗/○)
- `orchestrate/.state/<executionId>-log.json` — full structured log
- `orchestrate/.state/execution-summary.jsonl` — append-only summary
- `orchestrate/.audit.jsonl` — immutable audit trail
