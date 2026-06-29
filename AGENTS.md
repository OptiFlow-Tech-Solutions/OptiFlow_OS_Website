# OptiFlow OS Website — Agent Instructions

## Before any code change
1. Read `site.json` — canonical company data (phone, email, location)
2. Read `DESIGN.md` in the design system folder — exact hex values, typography, voice
3. Always use CSS variables from `core.css`; never hardcode colors
4. Never hardcode company info — use `{{PHONE}}`, `{{EMAIL}}`, `{{YEAR}}` placeholders

## When adding a new page
1. Copy an existing page from `src/pages/` as a template
2. Use `<!-- INCLUDE: nav -->` and `<!-- INCLUDE: footer -->`
3. Link shared assets: `/assets/css/core.css` and `/assets/js/core.js`
4. Page-specific styles go in a `<style>` block in `<head>`
5. Add page metadata to `site.json` pages array
6. Run `npm run build && npm run validate`

## When modifying shared components
1. Edit in `assets/css/core.css` or `assets/js/core.js` — NOT in individual pages
2. Rebuild all pages: `npm run build`
3. Validate: `npm run validate`

## CSS rules
- Colors: always `var(--*)` variables
- Spacing: `var(--gap-*)` variables
- Typography: `.display`, `h1`-`h6`, `.lead`, `.body` classes
- Never put component styles in page files — add them to `core.css`

## Build
- `npm run build` — assembles dist/ from src/
- `npm run validate` — checks links, colors, SEO, consistency
- `npm run dev` — build + serve locally

## Spec-Driven Development (OpenSpec)

Every task SHALL follow the OpenSpec workflow:

### Command flow
1. `/opsx:explore` — research existing specs + codebase before committing
2. `/opsx:propose <change-name>` — generate proposal.md, specs/, design.md, tasks.md
3. `/opsx:apply` — execute tasks.md systematically
4. `/opsx:verify` — verify implementation matches spec deltas
5. `/opsx:archive` — merge deltas back into openspec/specs/

### Gates
- **GATE 1** (after propose): Human reviews and approves spec deltas before implementation
- **GATE 2** (before archive): Human confirms diff summary and commit messages

### Orchestration engine
Use `node orchestrate/coordinator.mjs` to route tasks to the appropriate:
- **Skills** (design-system, seo, accessibility, etc.)
- **Agents** (planner, tdd-guide, code-reviewer, security-reviewer)
- **MCP servers** (context7 for docs, parallel-search for research)

### Traceability
Every implementation SHALL trace back to an OpenSpec requirement:
spec.md → tasks.md → git commit → changed files

## Available commands
- `/orchestrate "description"` — run full OpenSpec pipeline
- `/validate-full` — L1-L7 validation
- `/page-status` — report on all 12 pages
- `npm run orchestrate` — CLI entry point
- `npm run specs:list` — list all capability specs

## Orchestration Engine V3

The orchestration engine auto-discovers specs, skills, agents, MCPs, hooks, and commands. Run a single OpenSpec command and the engine handles everything else:

- **`/opsx:explore`** — Auto-loads all 7 capability specs, discovers global resources, identifies affected specs
- **`/opsx:propose <name>`** — Routes to appropriate agents, generates proposal + design + specs + tasks
- **`/opsx:apply`** — Executes tasks via pipeline engine with DAG support, runs hooks automatically
- **`/opsx:verify`** — Runs full L1-L7 validation pipeline, enforces quality gates
- **`/opsx:archive`** — Syncs delta specs to main, generates traceability matrix, updates docs

### Auto-Discovery
- 67 agents, 271+ skills, 33 MCP servers, 28 hooks, 113 rules — auto-discovered at runtime
- Domain-aware routing: design, frontend, build, accessibility, seo, security
- Branch-aware execution: different pipelines for main, staging, develop, feature/*

### Pipeline Configs
- `build.yaml` — Standard build + validate + test
- `audit.yaml` — Full compliance audit (a11y + SEO + design)
- `release.yaml` — Production release with E2E gates
- `content.yaml` — Newsletter content creation pipeline
- `security.yaml` — Security audit pipeline

### Quality Gates
GATE_SPEC → GATE_BUILD → GATE_VALIDATE → GATE_TEST → GATE_A11Y → GATE_PERF → GATE_SECURITY → GATE_HUMAN

### Traceability
Every implementation traces back to an OpenSpec requirement:
spec.md → tasks.md → git commit → changed files
