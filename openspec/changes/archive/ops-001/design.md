# Design: ops-001

## Architecture
Vertical Slice Architecture: each OpenSpec phase maps to an independent pipeline stage. The coordinator (`orchestrate/coordinator.mjs`) auto-discovers resources and routes to specialized router modules.

## Module Map
| Module | Responsibility |
|--------|---------------|
| `coordinator.mjs` | Entry point, phase orchestration |
| `capability-registry.mjs` | Auto-discover skills, agents, MCPs, hooks |
| `skill-router.mjs` | Route tasks to matching skills |
| `agent-router.mjs` | Route tasks to specialized agents |
| `mcp-router.mjs` | Route to MCP servers |
| `hook-router.mjs` | Route to hook triggers |
| `pipeline-engine.mjs` | DAG-based pipeline execution |
| `validation-pipeline.mjs` | L1-L7 validation levels |
| `quality-gate.mjs` | GATE_SPEC → GATE_HUMAN chain |
| `traceability.mjs` | Spec → task → commit → file chain |
| `phase-detector.mjs` | Detect current phase, prevent skipping |
| `state-manager.mjs` | Persist pipeline state |
| `event-bus.mjs` | Pub/sub for pipeline events |
| `spec-resolver.mjs` | Resolve affected specs from change |
| `feature-router.mjs` | Route by feature ID prefix |

## Pipeline Configs
- `build.yaml` — Standard build + validate + test
- `audit.yaml` — Full a11y + SEO + design audit
- `release.yaml` — Production release with E2E gates
- `content.yaml` — Newsletter content creation
- `security.yaml` — Security audit

## Decisions
- Node.js ESM modules for all orchestrator code
- YAML for pipeline definitions (human-readable, DAG-native)
- In-memory state with JSON persistence (no external DB)
- Branch-aware pipeline selection
