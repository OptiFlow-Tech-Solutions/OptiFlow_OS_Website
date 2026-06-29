# Orchestration Engine

## Purpose

Define the orchestration engine that auto-discovers global resources (specs, skills, agents, MCPs, hooks, rules), routes work via spec-driven paths, and executes multi-gate validation pipelines with full traceability from requirements to production.

## Requirements

### Requirement: Auto-Discovery

The engine SHALL auto-discover all global repository resources at startup, including skills, agents, MCP servers, hooks, rules, and capability specs.

#### Scenario: Resource index on explore

- **GIVEN** the `/opsx:explore` command is invoked
- **WHEN** the engine initializes
- **THEN** all 67 agents, 271+ skills, 33 MCP servers, 28 hooks, and 113 rules SHALL be indexed
- **AND** each resource SHALL be tagged with its domain (design, frontend, build, accessibility, seo, security)
- **AND** all 7 capability specs SHALL be loaded into the routing matrix

#### Scenario: Branch-aware context

- **GIVEN** the current git branch is `feature/new-page`
- **WHEN** the engine auto-discovers resources
- **THEN** the pipeline SHALL select the feature-branch pipeline configuration (skip E2E, run full unit + integration)
- **AND** the production guard SHALL be enforced (block release.yaml on non-main branches)

### Requirement: Spec-Driven Routing

The engine SHALL route skills, agents, and MCPs to tasks based on which capability specs are affected by the change.

#### Scenario: Design system change routing

- **GIVEN** a change affects `openspec/specs/design-system/spec.md`
- **WHEN** `/opsx:propose design-update` is executed
- **THEN** the engine SHALL route to the design-system skill and the planner agent
- **AND** the design-system MCP server SHALL be activated for validation

#### Scenario: Multi-spec change routing

- **GIVEN** a change affects both `seo` and `accessibility` specs
- **WHEN** `/opsx:apply` is executed
- **THEN** the engine SHALL route to seo + accessibility skills in parallel
- **AND** the code-reviewer and security-reviewer agents SHALL both review the output

### Requirement: Pipeline Execution

The engine SHALL execute YAML pipeline definitions with DAG (directed acyclic graph) support, resolving dependencies and running independent stages in parallel.

#### Scenario: Build pipeline DAG

- **GIVEN** the `build.yaml` pipeline defines stages: build → validate → test
- **WHEN** the pipeline is executed
- **THEN** validate SHALL wait for build to complete
- **AND** test SHALL wait for validate to complete
- **AND** each stage failure SHALL halt subsequent stages

#### Scenario: Audit pipeline parallelism

- **GIVEN** the `audit.yaml` pipeline defines parallel stages: a11y-audit, seo-audit, design-audit
- **WHEN** the pipeline is executed
- **THEN** all three audit stages SHALL run simultaneously
- **AND** the pipeline SHALL complete only when all stages finish
- **AND** any stage failure SHALL be reported with the stage name and error detail

### Requirement: Validation Pipeline

The engine SHALL support L1 through L7 validation levels, each gating on the previous level's success.

#### Scenario: Full L1-L7 validation

- **GIVEN** the `/validate-full` command is invoked
- **WHEN** the validation pipeline runs
- **THEN** L1 (lint) SHALL run first; failure halts the pipeline
- **AND** L2 (build) SHALL run after L1 passes
- **AND** L3 (unit tests) SHALL run after L2 passes
- **AND** L4 (integration) SHALL run after L3 passes
- **AND** L5 (a11y audit) SHALL run after L4 passes
- **AND** L6 (SEO audit) SHALL run after L5 passes
- **AND** L7 (E2E tests) SHALL run after L6 passes

#### Scenario: Partial validation

- **GIVEN** validation level L4 is requested
- **WHEN** the validation pipeline runs
- **THEN** only L1 through L4 SHALL execute
- **AND** L5-L7 SHALL be skipped

### Requirement: Quality Gates

The engine SHALL enforce multi-gate quality enforcement: GATE_SPEC → GATE_BUILD → GATE_VALIDATE → GATE_TEST → GATE_A11Y → GATE_PERF → GATE_SECURITY → GATE_HUMAN.

#### Scenario: Gate chain enforcement

- **GIVEN** a change passes GATE_SPEC but fails GATE_BUILD
- **WHEN** the quality pipeline runs
- **THEN** the change SHALL stop at GATE_BUILD
- **AND** the failure reason SHALL be emitted
- **AND** no subsequent gates SHALL execute

#### Scenario: Human gate override

- **GIVEN** all automated gates pass except GATE_HUMAN
- **WHEN** the human reviewer is pending
- **THEN** the pipeline SHALL emit a review-required notice
- **AND** execution SHALL resume only after human approval

### Requirement: Traceability

The engine SHALL link specs to tasks, tasks to git commits, and commits to changed files, producing a full traceability matrix.

#### Scenario: Commit traceability

- **GIVEN** a task from `openspec/changes/update-header/tasks.md` is completed
- **WHEN** the task is committed as `feat: update nav header`
- **THEN** the traceability matrix SHALL record: `spec.md#header-requirement → tasks.md#T3 → commit abc123 → src/pages/index.html`
- **AND** any unlinked commit SHALL be flagged during `/opsx:verify`

#### Scenario: Archive traceability report

- **GIVEN** a change is archived via `/opsx:archive`
- **WHEN** the archive process completes
- **THEN** a traceability report SHALL be generated listing all spec deltas merged
- **AND** the report SHALL include the full chain for each delta

### Requirement: Phase Detection

The engine SHALL detect the correct OpenSpec phase from the current change state (explore, propose, apply, verify, archive) and prevent phase-skipping.

#### Scenario: Must explore before propose

- **GIVEN** no prior `/opsx:explore` has been run
- **WHEN** `/opsx:propose new-feature` is invoked
- **THEN** the engine SHALL warn that exploration has not been done
- **AND** the engine SHALL auto-run explore before proceeding

#### Scenario: Must verify before archive

- **GIVEN** a change has been applied but not verified
- **WHEN** `/opsx:archive` is invoked
- **THEN** the engine SHALL reject the archive request
- **AND** the engine SHALL emit: "Run /opsx:verify first"

### Requirement: Command Auto-Orchestration

The user SHALL run a single OpenSpec command; the engine SHALL handle all subordinate routing, validation, and quality gating automatically.

#### Scenario: Single command full pipeline

- **GIVEN** the user runs `/orchestrate "add testimonial section to homepage"`
- **WHEN** the orchestration engine processes the request
- **THEN** the engine SHALL auto-discover affected specs (marketing-pages, design-system, shared-components)
- **AND** the engine SHALL route to planner → tdd-guide → code-reviewer → security-reviewer in sequence
- **AND** the engine SHALL run pre-build validation before any code changes
- **AND** the engine SHALL run post-build validation after implementation
- **AND** the engine SHALL enforce all quality gates before completion

#### Scenario: Command chain execution

- **GIVEN** the `/opsx:apply` command is invoked
- **WHEN** tasks.md contains tasks tagged with `@agent:tdd-guide`, `@skill:design-system`, `@mcp:context7`
- **THEN** the engine SHALL route each task to the specified resource
- **AND** tasks with no explicit routing SHALL be auto-routed based on affected specs
- **AND** the engine SHALL run hooks for each file change automatically
