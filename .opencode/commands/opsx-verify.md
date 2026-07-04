---
description: Verify implementation matches spec deltas — run validation, tests, and quality gates
---

<!-- canonical: .opencode/skills/openspec-verify/SKILL.md -->

Verify that an implementation matches the spec deltas and passes all quality checks.

**Input**: Optionally specify a change name after `/opsx-verify` (e.g., `/opsx-verify add-auth`). If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **Select the change**

   If a name is provided, use it. Otherwise:
   - Infer from conversation context if the user mentioned a change
   - Auto-select if only one active change exists
   - If ambiguous, run `openspec list --json` to get available changes and use the **AskUserQuestion tool** to let the user select

   Always announce: "Verifying change: <name>".

2. **Check status**

   ```bash
   openspec status --change "<name>" --json
   ```

   Parse the JSON to understand:
   - `schemaName`, `planningHome`, `changeRoot`, `actionContext`
   - Which artifacts exist and their status

3. **Run comprehensive verification**

   Execute in order, reporting each result:

   a. **Build verification** — `npm run build`
   b. **Validation** — `npm run validate`
   c. **Lint** — `npm run lint:all`
   d. **Tests** — `npm test` (if available)
   e. **Task completion** — Read `tasks.md`, count `- [x]` vs `- [ ]`
   f. **Spec delta sync** — Compare delta specs with main specs, report drift
   g. **Quality gates** — Run GATE_BUILD → GATE_VALIDATE → GATE_TEST → GATE_A11Y → GATE_PERF
   h. **Design compliance** — Run `node hooks/theme-change.mjs`

4. **Produce verification report**

   Show a structured report:

   ```
   ## Verification Report: <change-name>

   **Build:** ✓ Passed
   **Validate:** ✓ Passed (0 errors, 3 warnings)
   **Lint:** ✓ Passed
   **Tests:** ✓ 28/28 passed (3 projects)
   **Tasks:** 7/7 complete ✓
   **Spec Sync:** ✓ All deltas synced to main specs
   **Quality Gates:** BUILD ✓ | VALIDATE ✓ | TEST ✓ | A11Y ✓ | PERF ✓
   **Design:** ✓ All color tokens mapped to CSS variables

   ─────────────────────────────────
   **Result: PASS** — Ready for archive
   ```

   Or if issues found:

   ```
   ## Verification Report: <change-name>

   **Build:** ✗ Failed — missing closing tag in src/pages/pricing.html:247
   **Result: FAIL** — Fix issues and re-verify
   ```

5. **If verification fails**

   - Report exactly what failed and where
   - Offer to fix automatically if the fix is clear
   - Suggest next steps

**Guardrails**
- Run all checks even if early checks fail (collect all issues)
- Always show a clear pass/fail result
- If the change has no delta specs, skip spec sync check (report as N/A)
- If tests don't exist, report as "Not configured"
- Never archive on behalf of the user — verification informs, archive decides
