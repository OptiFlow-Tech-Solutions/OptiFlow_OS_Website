---
name: openspec-auto
description: Intelligent auto-orchestration for Spec-Driven Development. Single entry point — analyzes natural language, auto-selects skills/agents/MCPs/hooks, executes full OpenSpec lifecycle, builds, validates, visually verifies, and auto-fixes. No manual selection required.
version: 1.0.0
triggers:
  - /opsx-auto
  - opsx auto
  - auto pipeline
  - spec-driven auto
  - auto orchestrate
  - intelligent entry point
  - single command orchestrator
domains:
  - orchestration
  - spec-driven
  - automation
  - quality
---

# OpenSpec Auto — Intelligent Entry Point for Spec-Driven Development

## Purpose

This skill transforms `/opsx-auto` into the single, intelligent entry point for all Spec-Driven Development workflows. Given any natural language task description, it auto-discovers the complete implementation context, selects all required capabilities, and executes the full OpenSpec lifecycle — all without manual selection.

## Entry Point

The primary entry function is `orchestrate/auto-pipeline.mjs`, called via `coordinator.mjs`'s `run()` function with `auto: true`.

## What It Does

1. Analyzes the task using the capability taxonomy (30+ intents)
2. Resolves the feature ID from the natural language description
3. Loads full project context (site.json, DESIGN.md, all 23 specs, 28 features)
4. Auto-selects skills using multi-skill composition rules
5. Auto-selects agents using domain + capability matching
6. Auto-selects MCP servers based on task phase and domains
7. Auto-selects hooks for the phase
8. Executes explore → propose → apply → verify → archive (fully automated)
9. Runs build + validate + quality gates
10. Starts dev server, visually verifies via Playwright MCP
11. Auto-fixes discovered issues (up to 3 iterations)
12. Cleans up and reports final status

## Execution Flow

```
/opsx-auto → analyze → resolve feature → load context → select capabilities
  → explore → propose → apply → build → visual verify → auto-fix loop
  → verify → archive → cleanup → report
```

## Integration

This skill integrates with:
- `orchestrate/coordinator.mjs` — main entry point
- `orchestrate/auto-pipeline.mjs` — the brain module
- `orchestrate/visual-verify.mjs` — visual verification via event bus
- `orchestrate/capability-analyzer.mjs` — intent detection
- `orchestrate/feature-router.mjs` — feature resolution
- `orchestrate/skill-router.mjs` — skill composition
- `orchestrate/agent-router.mjs` — agent selection
- `orchestrate/mcp-router.mjs` — MCP routing
- `orchestrate/hook-router.mjs` — hook selection
- `orchestrate/opsx-commands.mjs` — OpenSpec lifecycle
- `orchestrate/quality-gate.mjs` — quality enforcement
- `orchestrate/context-loader.mjs` — project context loading

## Constraints

- Must not break existing `/opsx-explore`, `/opsx-propose`, `/opsx-apply`, `/opsx-verify`, `/opsx-archive`, `/opsx-sync` commands
- Must maintain backward compatibility with `orchestrateOpenSpec()`, `runPhase()`, `featureOrchestrate()`, `featureFullPipeline()`
- Auto mode is additive — old explicit mode still works
- Visual verification loop maxes at 3 iterations to prevent infinite loops
