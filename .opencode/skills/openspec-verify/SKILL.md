---
name: openspec-verify
description: Verify that an implementation matches spec deltas — run build, validation, tests, quality gates, and design compliance checks. Use when the user wants to verify a change before archiving or after implementation.
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "2.0"
  generatedBy: "2.0.0"
  triggers:
    - /opsx-verify
    - opsx verify
    - verify change
    - validate change
    - check implementation
  domains:
    - verification
    - quality-assurance
    - validation
    - spec-driven-development
    - meta
---

## Purpose

Comprehensively verify that an implementation matches spec deltas and passes all
quality checks. Runs 8 verification checks (build, validate, lint, tests, tasks,
spec sync, quality gates, design compliance) and produces a structured pass/fail report.

## Prerequisites

- Built distribution (`dist/`) or ability to run `npm run build`
- `npm run validate` script available
- `npm test` for Playwright tests (optional — skipped if not configured)
- Access to `openspec status --change "<name>" --json`

## Related Skills

| Skill | Role | When Used |
|-------|------|-----------|
| `openspec-apply` | Task implementation | Before verify — must be complete |
| `openspec-auto` | Autonomous orchestration | When verify is handled by VALIDATE phase |
| `openspec-archive` | Archive after verification | After verify passes |
| `openspec-sync` | Spec sync check | During verify — checks delta drift |

Verify that an implementation matches spec deltas and passes all quality checks.

**Input**: Optionally specify a change name. If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Autonomous Mode:** When invoked by `/opsx-auto`, the verification is already handled
by the VALIDATE and OPSX_ARCHIVE phases. This skill is for standalone verification
outside the autonomous pipeline — typically before manual archive or after partial implementation.

**Standalone Mode:** When invoked directly by the user, follow the steps below.

**Steps**

1. **Select the change**

   If a name is provided, use it. Otherwise:
   - Infer from conversation context if the user mentioned a change
   - Auto-select if only one active change exists
   - If ambiguous, run `openspec list --json` to get available changes and use the **AskUserQuestion tool** to let the user select

   Always announce: "Verifying change: <name>".

2. **Check status**

   Run `openspec status --change "<name>" --json`.

   Parse the JSON to understand the change's schema, artifact status, and scope.
   Use `changeRoot` for reading artifacts.

3. **Run comprehensive verification**

   Execute all checks. Continue even if early checks fail — collect the full picture.

   a. **Build verification**
   ```bash
   npm run build
   ```
   If build fails, note the specific error.

   b. **Validation**
   ```bash
   npm run validate
   ```
   Report error count and warning count separately. Warnings do not block verification.

   c. **Lint**
   ```bash
   npm run lint:all
   ```
   If lint is not configured, skip.

   d. **Tests**
   ```bash
   npm test
   ```
   If tests are not configured, report "Not configured".

   e. **Task completion**
   Read `tasks.md`. Count total tasks (`- [ ]` + `- [x]`) and completed tasks (`- [x]`).
   Report: "N/M tasks complete (X%)".

   f. **Spec delta sync status**
   Check if `specs/` directory exists under the change. If it does:
   - Compare each delta spec with its corresponding main spec at `openspec/specs/<capability>/spec.md`
   - Report any drift (requirements in delta not reflected in main)

   g. **Quality gates**
   Run the following gates in order:
   - GATE_BUILD: `node scripts/assemble.mjs`
   - GATE_VALIDATE: `node scripts/validate.mjs`
   - GATE_TEST: `npx playwright test` (if test suite exists)
   - GATE_A11Y: `npx playwright test tests/e2e/a11y.spec.js` (if exists)
   - GATE_PERF: Check dist/ size

   h. **Design compliance**
   ```bash
   node hooks/theme-change.mjs
   ```
   Verify all DESIGN.md color tokens map to CSS variables in core.css.

4. **Produce verification report**

   ```
   ## Verification Report: <change-name>

   ─── Checks ───
   **Build:**      ✓ / ✗ <detail>
   **Validate:**   ✓ / ✗ <detail>
   **Lint:**       ✓ / ✗ / N/A
   **Tests:**      ✓ / ✗ / N/A
   **Tasks:**      N/M complete (X%)
   **Spec Sync:**  ✓ / Drift detected / N/A
   **Gates:**      BUILD ✓ | VALIDATE ✓ | TEST ✓ | A11Y ✓ | PERF ✓
   **Design:**     ✓ / ✗ <detail>

   ─── Result ───
   **PASS** — Ready for archive

   or

   **FAIL** — X check(s) failed. See details above.
   ```

**Output On Pass**

```
## Verification Report: <change-name>

**Build:**      ✓ Passed
**Validate:**   ✓ Passed (0 errors, 3 warnings)
**Lint:**       ✓ Passed
**Tests:**      ✓ 28/28 passed (4 projects)
**Tasks:**      7/7 complete ✓
**Spec Sync:**  ✓ All deltas synced to main specs
**Gates:**      BUILD ✓ | VALIDATE ✓ | TEST ✓ | A11Y ✓ | PERF ✓
**Design:**     ✓ All 12 color tokens mapped to CSS variables

─────────────────────
**Result: PASS** — Ready for archive
```

**Output On Fail**

```
## Verification Report: <change-name>

**Build:**      ✓ Passed
**Validate:**   ✗ 1 error: broken link /why-optiflow/ in dist/features/index.html
**Lint:**       N/A
**Tests:**      ✗ 1 failed: pricing page 200 check timed out
**Tasks:**      5/7 complete (71%)
**Spec Sync:**  ✓ Synced
**Gates:**      BUILD ✓ | VALIDATE ✗ | TEST ✗ | A11Y ⏭ | PERF ⏭
**Design:**     ✓ Passed

─────────────────────
**Result: FAIL** — 3 checks failed
**Issues to fix:**
1. Fix broken link in features page
2. Fix pricing page test timeout
3. Complete 2 remaining tasks
```

**Guardrails**
- Run ALL checks regardless of earlier failures — collect the full picture
- Distinguish between errors (blocking) and warnings (informational)
- If the change has no delta specs, report "N/A" for spec sync — not an error
- If Playwright tests don't exist, report "Not configured" — not an error
- If the design hook (`hooks/theme-change.mjs`) doesn't exist, report "N/A"
- Never archive on behalf of the user — verification informs, archive decides
- Report exact errors so the user can fix them without re-reading spec files

**Recovery Guidance**

If verification fails, offer specific fix suggestions:
- Build failure → show the exact error line and file
- Validate failure → show the exact check that failed (link, color, SEO, etc.)
- Test failure → show which test and the error message
- Task incomplete → list remaining tasks
- Gate failure → show which gate and why

## Anti-Patterns

- **DO NOT** stop at the first failure — collect all issues to give the full picture
- **DO NOT** archive immediately after verification passes — let the user decide
- **DO NOT** report "Not configured" as a failure — missing optional checks are informational
- **DO NOT** skip the spec sync check when delta specs exist — drift is a real bug
- **DO NOT** overwrite previous verification reports — save each as `verification-<timestamp>.md`

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| v2.0 | 2026-07 | Initial release. 8 verification checks, structured pass/fail report, recovery guidance, anti-patterns. |
