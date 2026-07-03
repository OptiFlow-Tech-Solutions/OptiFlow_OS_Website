# `/opsx-auto` — Autonomous Spec-Driven Development

<!-- canonical: .opencode/skills/openspec-auto/SKILL.md -->

## One Command

```
/opsx-auto "<task>"
```

Everything else happens automatically.

## What You Must Do

Load the full skill specification from `.opencode/skills/openspec-auto/SKILL.md` and
execute the autonomous orchestration pipeline. The JS runtime entry point is
`orchestrate/auto-pipeline.mjs`.

Call `autoFullPipeline(taskDescription, opts)` or drive the phases manually
via `initPipeline` → `runDeepScan` → `runSkillDiscovery` → explore → propose
→ sync → apply → validate → archive → `finishPipeline`.

## Options

| Flag | Effect |
|------|--------|
| `--dry-run` | Stop after Skill Discovery |
| `--skip-build` | Skip validation phase |

## Recovery

```
resumePipeline(executionId) — from orchestrate/.state/{id}-context.json
```
