# `/opsx-auto` — Master Orchestration Command

<!-- canonical: .opencode/skills/openspec-auto/SKILL.md -->

## Single-Command Spec-Driven Development

Execute `/opsx-auto` with any natural language request. The orchestration engine performs the complete lifecycle autonomously:

1. Deep-scans the entire codebase
2. Discovers relevant skills from the global + project archive
3. Executes explore → propose → sync → apply → validate → archive

No manual selection required.

## Usage

```bash
/opsx-auto                              # Interactive: describe your task
/opsx-auto "Build the Pricing Page"
/opsx-auto "Implement Authentication"
/opsx-auto "Fix the Dashboard layout"
/opsx-auto "Create an Inventory Module"
/opsx-auto "Redesign the Hero Section"
/opsx-auto --dry-run "Add newsletter subscription flow"
/opsx-auto --skip-build "Improve the navigation bar"
```

## Execution Pipeline (8 Phases)

```
1. DEEP_SCAN       Read entire codebase, detect project context
                       └─ framework, architecture, TODOs, FIXMEs, stale docs

2. SKILL_DISCOVERY Scan global (~271) + project skills, score relevance
                       └─ auto-select only the most relevant skills

3. OPSX_EXPLORE    Inspect repository, map modules, understand dependencies

4. OPSX_PROPOSE    Generate implementation proposal with affected specs

5. OPSX_SYNC       Auto-merge delta specs to main (silent)

6. OPSX_APPLY      Execute implementation incrementally

7. VALIDATE        Build + lint + test + quality gates
                       └─ auto-fix where safe, report otherwise

8. OPSX_ARCHIVE    Store execution metadata, sync docs, generate traceability
```

## What Happens

| Phase | Action |
|-------|--------|
| DEEP_SCAN | Scans src/, assets/, hooks/, reads package.json, detects framework/architecture, finds TODOs/FIXMEs, identifies stale docs and partial features |
| SKILL_DISCOVERY | Scans `~/.config/opencode/skills/` (271 global skills) + `.opencode/skills/` (6 project skills), parses SKILL.md metadata, scores relevance against task |
| OPSX_EXPLORE | Loads specs, scans codebase, discovers context |
| OPSX_PROPOSE | Creates proposal.md, design.md, tasks.md in `openspec/changes/<name>/` |
| OPSX_SYNC | Merges delta specs into `openspec/specs/` with intelligent ADDED/MODIFIED/REMOVED handling |
| OPSX_APPLY | Implements tasks incrementally from tasks.md |
| VALIDATE | Runs `npm run build`, `npm run validate`, lint, tests, and quality gates |
| OPSX_ARCHIVE | Syncs specs, generates traceability matrix, syncs docs, saves execution state |

## Options

| Flag | Effect |
|------|--------|
| `--dry-run` | Plan only, don't execute |
| `--skip-build` | Skip build/validate/test phases |

## Auto-Discovery

The engine auto-discovers and routes to:
- **Skills**: ~271 global + 6 project — scored and filtered to top 12 most relevant
- **Agents**: 33 available — routed by domain and tier
- **MCPs**: 14 available — context7, parallel-search, playwright, chrome-devtools, etc.
- **Hooks**: pre-build, post-build, pre-commit, post-merge, theme-change
- **Pipelines**: 8 YAML configs (build, apply, verify, audit, security, explore, propose, archive)

## Branch Awareness

| Branch | Behavior |
|--------|----------|
| `main` | Security reviewer + full quality gates |
| `staging` | E2E runner included |
| `feature/*` | Lightweight, skips doc updates |
| `develop` | Standard pipeline with code review |

## Safety Guarantees

The engine never:
- Deletes unrelated files
- Overwrites user work without proposal
- Duplicates existing implementations
- Bypasses validation gates
- Applies changes without repository understanding
- Proceeds after a failed phase

## Logging

Every execution produces:
- Console output with per-phase status (✔/✗/○)
- JSON execution log at `orchestrate/.state/<executionId>-log.json`
- Summary appended to `orchestrate/.state/execution-summary.jsonl`
- Audit trail in `orchestrate/.audit.jsonl`
