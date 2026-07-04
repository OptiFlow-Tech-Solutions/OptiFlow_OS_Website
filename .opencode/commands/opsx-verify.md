---
description: >
  Verify that implementation matches spec deltas and passes all quality checks.
  Runs build, validation, lint, tests, task completion, spec sync, quality gates,
  and design compliance checks. Produces structured pass/fail report.
version: "14.0"
enterprise: true
triggers:
  - /opsx-verify
  - opsx verify
  - verify change
domains:
  - quality
  - testing
  - validation
  - verification
role: quality-verifier
orchestratedBy: /opsx-auto
orchestrationContract: OPSX_VERIFY
---

<!-- canonical: .opencode/skills/openspec-verify/SKILL.md -->

# `/opsx-verify` — Verification Agent

## Role

**Quality Verifier** — Phase 11 of the 13-stage Enterprise Orchestration lifecycle.

## Orchestration Status

This command is a **coordinated lifecycle agent** under the Master Orchestrator (`/opsx-auto`).
When `/opsx-auto` runs, this phase executes automatically before archive as a standalone
verification gate.

This command remains fully functional as a **standalone operation** for manual use, debugging, and single-phase workflows.

## Contract

| Property | Value |
|----------|-------|
| Phase ID | `OPSX_VERIFY` |
| Role | `standalone-verifier` |
| Is Fatal | No |
| Requires | `OPSX_APPLY` |
| Produces | verification-report |
| Handoff To | `OPSX_ARCHIVE` |
| Retry Policy | 2 retries, 2s backoff |

## Usage

```
/opsx-verify add-auth
/opsx-verify
```

## Behavior

Verify that an implementation matches the spec deltas and passes all quality checks.

## Verification Checks (8)

1. **Build verification** — `npm run build`
2. **Validation** — `npm run validate`
3. **Lint** — `npm run lint:all`
4. **Tests** — `npm test`
5. **Task completion** — Count `[x]` vs `[ ]` in tasks.md
6. **Spec delta sync** — Compare delta specs with main specs
7. **Quality gates** — BUILD → VALIDATE → TEST → A11Y → PERF
8. **Design compliance** — `hooks/theme-change.mjs`

## Report Format

```
## Verification Report: <change-name>

**Build:** ✓ Passed
**Validate:** ✓ Passed (0 errors, 3 warnings)
**Lint:** ✓ Passed
**Tests:** ✓ 28/28 passed
**Tasks:** 7/7 complete ✓
**Spec Sync:** ✓ All deltas synced
**Quality Gates:** BUILD ✓ | VALIDATE ✓ | TEST ✓ | A11Y ✓ | PERF ✓
**Design:** ✓ All color tokens mapped to CSS variables

─────────────────────────────────
**Result: PASS** — Ready for archive
```

## Guardrails

- Run all checks even if early checks fail (collect all issues)
- Always show a clear pass/fail result
- If the change has no delta specs, skip spec sync check (report as N/A)
- If tests don't exist, report as "Not configured"
- Never archive on behalf of the user — verification informs, archive decides
