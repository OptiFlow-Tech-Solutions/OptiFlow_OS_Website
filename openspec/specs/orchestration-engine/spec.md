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

---

## V13 Architecture: Next-Generation Master Orchestrator

### Requirement: Master Agent Architecture

The `/opsx-auto` command SHALL function as a single master orchestration agent that coordinates all lifecycle agents (explore, propose, sync, apply, verify, archive) through intelligent orchestration rather than manual phase invocation.

#### Scenario: Single command complete lifecycle

- **GIVEN** the user runs `/opsx-auto "Implement Authentication"`
- **WHEN** the master agent processes the task
- **THEN** the engine SHALL automatically build a unified repository intelligence snapshot
- **AND** the engine SHALL compose skills by workflow role (repo-analyst, designer, implementer, tester, reviewer, deployer)
- **AND** the engine SHALL compose agent teams per lifecycle phase
- **AND** the engine SHALL run controlled goal-oriented iterations until verified completion
- **AND** no manual invocation of `/opsx:explore`, `/opsx:propose`, `/opsx:apply`, `/opsx:verify`, or `/opsx:archive` SHALL be required

### Requirement: Unified Repository Intelligence

The engine SHALL build a single `RepositorySnapshot` aggregating all repository context (project analysis, spec index, feature registry, design system rules, capability registry) through parallel read-only analysis, available to all agents as shared context.

#### Scenario: Parallel intelligence gathering

- **GIVEN** the master agent initializes
- **WHEN** `buildRepositorySnapshot()` is called
- **THEN** project analysis, context loading, and capability registry building SHALL execute in parallel
- **AND** the resulting snapshot SHALL include project metadata (name, framework, architecture, files, lines)
- **AND** the snapshot SHALL include task analysis (intents, domains, roles, skills, confidence)
- **AND** the snapshot SHALL include discovered skills with metadata
- **AND** the snapshot SHALL include agent routing with primary and support agents
- **AND** all agents SHALL access the same snapshot via `ctx.repository`

### Requirement: Lifecycle Agent Contracts

Each lifecycle agent (explore, propose, sync, apply, validate, archive) SHALL have a formal contract defining its responsibilities, inputs, outputs, prerequisites, timeout, retry policy, and handoff rules.

#### Scenario: Contract enforcement

- **GIVEN** the PROPOSE agent is about to execute
- **WHEN** the master agent validates prerequisites
- **THEN** the contract SHALL verify that EXPLORE phase completed successfully
- **AND** required inputs (task, changeName, affectedSpecs, skills) SHALL be present
- **AND** if validation fails, the agent SHALL report missing prerequisites
- **AND** after execution, output validation SHALL verify proposal.md, design.md, and tasks.md exist

### Requirement: Goal-Oriented Iterative Execution

The engine SHALL execute through controlled iterations, each following the pattern: enter → analyze → plan → execute → validate → decide, continuing only while meaningful progress is made and the goal is not yet achieved.

#### Scenario: Iterative progress

- **GIVEN** the pipeline has completed PROPOSE but VALIDATE failed
- **WHEN** the iteration controller evaluates the next iteration
- **THEN** the controller SHALL re-plan: skip completed phases, re-run VALIDATE with fixes
- **AND** the controller SHALL measure progress after each iteration
- **AND** the controller SHALL stop if 3 consecutive iterations show no progress change
- **AND** the controller SHALL stop if the hard cap of 20 iterations is reached

### Requirement: Automatic Skill Intelligence

Skills SHALL be automatically selected without manual intervention. The engine SHALL compose skills into workflow roles, selecting the highest-scoring skill per role rather than returning a flat ranked list.

#### Scenario: Skill composition by role

- **GIVEN** a task requires design and implementation work
- **WHEN** skills are composed
- **THEN** `composeSkills()` SHALL map each skill to workflow roles (designer, implementer, reviewer, etc.)
- **AND** the best skill per role SHALL be selected using domain-weighted scoring
- **AND** each skill SHALL be assigned to at most one role to avoid over-allocation
- **AND** the primary role SHALL be determined from task domain analysis

### Requirement: Dynamic Agent Composition

The engine SHALL dynamically compose agent teams for each lifecycle phase, assigning the best-matching agent from the capability registry to the primary role and selecting support agents by domain relevance.

#### Scenario: Phase-specific agent teams

- **GIVEN** a task with security implications on the main branch
- **WHEN** agent teams are composed for each phase
- **THEN** OPSX_EXPLORE SHALL receive a planner agent
- **AND** OPSX_PROPOSE SHALL receive a planner agent
- **AND** OPSX_APPLY SHALL receive a tdd-guide agent with code-reviewer support
- **AND** VALIDATE SHALL receive a tdd-guide agent with code-reviewer and security-reviewer support
- **AND** the main branch context SHALL add a security-reviewer to support

### Requirement: Adaptive Phase Planning

The engine SHALL dynamically decide which phases to run each iteration based on task context, phase completion status, and current progress, rather than executing a fixed linear sequence.

#### Scenario: Phase skipping

- **GIVEN** a task that modifies existing pages (no new capabilities)
- **WHEN** the execution strategy plans the iteration
- **THEN** OPSX_EXPLORE SHALL skip if recently completed
- **AND** OPSX_SYNC SHALL skip if no delta specs exist
- **AND** VALIDATE SHALL skip if --skip-build flag is set
- **AND** OPSX_ARCHIVE SHALL only run after VALIDATE passes

### Requirement: Shared Memory for Cross-Phase Reasoning

The engine SHALL maintain shared memory across phases, where agents record findings, decisions, risks, and assumptions that subsequent agents can read for context.

#### Scenario: Findings propagation

- **GIVEN** the EXPLORE agent records findings about affected specs
- **WHEN** the PROPOSE agent executes
- **THEN** it SHALL read findings from `ctx.sharedMemory.findings`
- **AND** it SHALL incorporate previous decisions from `ctx.sharedMemory.decisions`
- **AND** it SHALL consider risks identified by `ctx.sharedMemory.risks`
- **AND** findings, decisions, risks, and assumptions SHALL persist across state saves

### Requirement: Enterprise Telemetry

The engine SHALL export structured telemetry data including execution history, performance trends, audit reports, and success/failure statistics for enterprise observability.

#### Scenario: Telemetry export

- **GIVEN** multiple pipeline executions have completed
- **WHEN** `exportTelemetry()` is called
- **THEN** the engine SHALL aggregate all execution states into a summary JSON
- **AND** the engine SHALL write per-execution records to a JSONL file
- **AND** the summary SHALL include success rates, average durations, and agent usage statistics
- **AND** all telemetry data SHALL be stored in `orchestrate/.telemetry/`

---

## V13 Module Map

| Module | Purpose | Version |
|--------|---------|---------|
| `auto-pipeline-v13.mjs` | Master orchestrator with goal-oriented loop | V13 |
| `iteration-controller.mjs` | Controlled iterative execution (enter→analyze→plan→execute→validate→decide) | V13 |
| `execution-strategy.mjs` | Adaptive phase planning with dynamic skip/retry decisions | V13 |
| `repository-snapshot.mjs` | Unified repository intelligence with parallel analysis | V13 |
| `agent-contracts.mjs` | Formal lifecycle agent contracts with input/output validation | V13 |
| `skill-composer.mjs` | Role-assigned skill composition (9 workflow roles) | V13 |
| `agent-composer.mjs` | Phase-assigned agent team composition | V13 |
| `telemetry.mjs` | Enterprise telemetry export and audit reporting | V13 |
| `pipeline-context.mjs` | Shared execution context with shared memory | V11→V13 |
| `auto-pipeline.mjs` | Legacy V12 linear waterfall (maintained for backward compatibility) | V12 |
| `pipeline-engine.mjs` | DAG-based YAML pipeline executor with circuit breakers | V4 |
| `state-manager.mjs` | State persistence, checkpoint recovery, TTL cleanup | V8 |
| `skill-discovery.mjs` | TF-IDF skill discovery and scoring | V6 |
| `capability-analyzer.mjs` | Task intent detection with 31-intent taxonomy | V5 |
| `agent-router.mjs` | Capability-aware agent selection | V4 |
| `quality-gate.mjs` | 8-gate quality enforcement chain | V4 |
| `validation-pipeline.mjs` | L1-L7 multi-level validation with auto-fix | V5 |
| `progress-tracker.mjs` | 10-signal goal-oriented progress measurement | V11 |
| `coordinator.mjs` | Unified entry point (V12 + V13 API) | V13 |
