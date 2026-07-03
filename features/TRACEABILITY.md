# Traceability

Every Feature ID is the single source of truth. The orchestration engine auto-resolves everything from the Feature ID using the project context:

```
Feature ID → specs → source files → tests → build config → hooks → skills → agents → validation rules → quality gates
```

No manual traceability matrix is maintained. Run `/opsx:feature <ID>` and the engine handles all resolution automatically from:

- `openspec/specs/` — capability specifications
- `src/pages/` — source files
- `tests/e2e/` — test suites
- `orchestrate/pipeline-config/` — pipeline definitions
- `hooks/` — git hook scripts
- `site.json` — canonical site data
- `features/features.json` — flat feature inventory (76 features)
- `features/VSI.md` — master vertical slice index
- `features/DASHBOARD.md` — project status overview
