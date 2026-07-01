## Context

The project has 4 hook scripts in `hooks/` (pre-commit, pre-build, post-build, theme-change), each duplicating ~20 lines of filesystem utilities. The orchestration engine's `hook-engine.mjs` maps lifecycle phases to hook events but has a bug in `globalResults` construction. Only a pre-commit hook exists in `.husky/`. No commit message, branch name, or push validation exists.

## Goals / Non-Goals

**Goals:**
- Extract duplicated utility code (ROOT resolution, `readText`, `fail/ok`, `walkDir`, `findDesignMd`) into a single `hooks/_utils.mjs` module
- Fix the `hook-engine.mjs` globalResults ordering bug
- Add commit message format enforcement to pre-commit
- Add branch name convention validation to pre-commit
- Add post-merge hook for dependency drift detection
- Add pre-push hook for lint + validate gate

**Non-Goals:**
- Auto-fix commit messages (only validates)
- Block local commits without internet (all checks are local)
- Replace husky with a different hook manager
- Add pre-commit auto-formatting or auto-linting (only scans)

## Decisions

### Decision 1: Single `_utils.mjs` module over individual shared files

**Chosen:** One `hooks/_utils.mjs` exporting `ROOT`, `ASSETS`, `SRC_PAGES`, `SRC_PARTIALS`, `readText()`, `fail()`, `ok()`, `walkDir()`, `findDesignMd()`.

**Alternatives considered:**
- `hooks/lib/` directory with separate files: over-engineering for 4 consumers
- Inline duplication (current state): maintainability pain

### Decision 2: Commit message regex over commitlint

**Chosen:** Simple regex `/^(feat|fix|refactor|docs|test|chore|perf|ci|style)(\(.+\))?: .{1,72}/` — no dependency needed. Already matches existing `.prettierrc` conventions.

**Alternatives considered:**
- `@commitlint/cli` + `@commitlint/config-conventional`: adds 2 dev dependencies for a simple regex
- No enforcement: quality gap

### Decision 3: Branch name convention: main|staging|develop|feature/*|fix/*|chore/*|docs/*

**Chosen:** Whitelist of known branch prefixes plus wildcard patterns. Local branches only (unpushed branches validated too). Uses `git symbolic-ref --short HEAD` (no `git branch --show-current` for broader Git version support).

**Alternatives considered:**
- Validate remote branch only: doesn't catch mistakes before push
- Full semantic branch naming: over-constraining for a small team

### Decision 4: Post-merge runs `npm install` only when `package-lock.json` changed

**Chosen:** Check `git diff-tree` between HEAD and ORIG_HEAD for `package-lock.json`. If changed, run `npm install` with a timeout. If stale, warn but don't fail.

**Rationale:** Catches the most common post-merge failure (missing/outdated node_modules). Silent success otherwise.

### Decision 5: Pre-push runs lint (not full build)

**Chosen:** Pre-push runs `npm run lint:all && npm run validate` — fast enough for a push gate (~5s), catches the most common CI failures before they waste CI minutes.

**Alternatives considered:**
- Full `npm run build && npm test`: too slow for pre-push (~30s+), better left to CI
- No pre-push gate: wastes CI minutes on preventable failures

### Decision 6: hook-engine.mjs lifecycle mapping

Add `post-merge` to the `apply` phase lifecycle, and add `pre-push` to a new `pre-commit` lifecycle event `gate`. New mapping:
- `apply`: `['pre-build', 'post-build', 'theme-change', 'post-merge']`
- `gate`: `['lint', 'validate', 'pre-push']`

## Risks / Trade-offs

- **[Risk] Pre-commit is slower now** (regex checks for commit message + branch name add ~100ms) → Non-issue: negligible vs existing 4-check scan
- **[Risk] Post-merge `npm install` could fail on network issues** → Wraps in try/catch, warns instead of blocking
- **[Risk] Branch name validation could surprise developers** → Error message includes the allowed patterns list

## Open Questions

None — all decisions settled above.
