# Tasks: ops-001

- [x] Core coordinator with phase detection and pipeline orchestration
- [x] Capability registry for auto-discovery of skills, agents, MCPs, hooks, rules
- [x] Skill router with spec-driven routing
- [x] Agent router with phase-appropriate agent selection
- [x] MCP router for server activation
- [x] Hook router and hook engine
- [x] Pipeline engine with DAG dependency resolution
- [x] L1-L7 validation pipeline
- [x] Quality gate chain (GATE_SPEC → GATE_HUMAN)
- [x] Traceability matrix (spec → task → commit → file)
- [x] Phase detection with skip prevention
- [x] State manager with JSON persistence
- [x] Event bus for pub/sub pipeline events
- [x] Spec resolver for affected-spec detection
- [x] Feature router for feature-ID-based routing
- [x] Pipeline configs: build.yaml, audit.yaml, release.yaml, content.yaml, security.yaml
- [x] `npm run orchestrate` CLI entry point
- [x] Validate result — build passes (0 errors), validate passes (0 errors)
