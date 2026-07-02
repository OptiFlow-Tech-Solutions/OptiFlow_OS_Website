# `/opsx-auto` — Intelligent Spec-Driven Development Entry Point

## Single-Command Orchestration

Execute `/opsx-auto` with any natural language request. The orchestration engine automatically analyzes the request, determines what needs to be built, selects the appropriate capabilities, executes the complete Spec-Driven Development lifecycle, and produces a fully implemented, tested, and validated feature.

No manual selection of skills, agents, hooks, commands, MCPs, or OpenSpec phases required.

## Usage

```bash
/opsx-auto                              # Start, then describe what you want

Build the Pricing Page.
Implement Authentication.
Fix the Dashboard layout.
Create an Inventory Module.
Redesign the Hero Section.
Add newsletter subscription flow.
Improve the navigation bar.
Set up email notifications.
```

## What Happens

When you run `/opsx-auto` with a task description, the engine:

1. **Analyzes intent** — extracts domains, roles, and capabilities from natural language
2. **Resolves the feature** — maps the description to a registered Feature ID
3. **Loads full context** — site.json, DESIGN.md, all 23 capability specs, all 28 features
4. **Auto-selects capabilities** — skills, agents, MCPs, hooks, commands
5. **Executes full OpenSpec lifecycle** — explore → propose → apply → verify → archive (auto-approved)
6. **Builds & validates** — runs npm build + validate
7. **Verifies visually** — starts dev server, opens browser via Playwright MCP, checks layout
8. **Auto-fixes issues** — detects and resolves problems, re-verifies (up to 3 iterations)
9. **Cleans up** — stops dev server, syncs documentation, reports status

## Auto-Discovery

The engine auto-discovers and routes to:
- **Skills**: 67 available (monorepo: ui-ux-pro-max, motion-master, design-system-master, component-architecture, performance-optimization, accessibility-pro, frontend-design + 55+ standard ECC skills)
- **Agents**: 33 available (tdd-guide, planner, code-reviewer, security-reviewer, architect, e2e-runner, build-error-resolver, + 26 more)
- **MCPs**: 14 available (context7, parallel-search, chrome-devtools, playwright, magic, sequential-thinking, memory, token-optimizer, cloudflare-docs, + 5 more)
- **Hooks**: Pre-build, post-build, pre-commit, post-merge, theme-change
- **Pipelines**: 8 YAML configs (build, apply, verify, audit, security, explore, propose, archive)

## Branch Awareness

Different behavior per branch:
- `main` — includes security reviewer, full quality gates
- `staging` — includes E2E runner
- `feature/*` — lightweight, skips doc updates
- `develop` — standard pipeline with code review
