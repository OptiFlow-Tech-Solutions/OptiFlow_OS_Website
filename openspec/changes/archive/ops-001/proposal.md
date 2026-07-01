# ops-001: Orchestration Engine

## Summary
Implement the auto-discovery orchestration engine that routes OpenSpec commands through skills, agents, MCPs, hooks, and quality gates with full traceability from spec to production.

## Scope
- Auto-discover all 67+ agents, 271+ skills, 33 MCP servers, 28 hooks, and 113 rules
- Spec-driven routing to skills, agents, and MCPs
- YAML pipeline execution with DAG dependency support
- L1-L7 validation pipeline with quality gates
- Full traceability: spec → task → commit → changed files
- Phase detection to prevent skipping
- Single-command orchestration (`/opsx-auto`, `/orchestrate`)

## Affected Specs
- `orchestration-engine` — core engine implementation
- `build-pipeline` — pipeline config integration
- `spec-driven-development` — command routing
