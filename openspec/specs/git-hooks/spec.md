# Git Hooks & Automation

## Purpose

Standardized hook system with shared utilities, commit message/branch name enforcement, post-merge dependency checks, and pre-push validation gate.

## Requirements

### Requirement: Shared hook utilities

The system SHALL provide a `hooks/_utils.mjs` module exporting common utilities used by all hook scripts: `ROOT`, `ASSETS`, `SRC_PAGES`, `SRC_PARTIALS` path constants; `readText(fp)` file reader; `fail(msg)` and `ok(msg)` logging helpers; `walkDir(dir, exts)` recursive file walker; and `findDesignMd()` DESIGN.md locator.

#### Scenario: All hooks import shared utilities

- **WHEN** any hook script in `hooks/` is executed
- **THEN** it SHALL import path constants and helpers from `hooks/_utils.mjs` instead of defining its own `ROOT`, `readText`, `fail`, `ok`, `walkSrc`, or `findDesignMd` functions

#### Scenario: walkDir filters by extension

- **WHEN** `walkDir('/path/to/dir', ['.html', '.css'])` is called
- **THEN** only files ending in `.html` or `.css` SHALL be returned
- **AND** subdirectories SHALL be traversed recursively
- **AND** directories that don't exist SHALL return an empty array

### Requirement: Commit message format enforcement

The pre-commit hook SHALL validate that the commit message follows the Conventional Commits format: `type(scope): description` where type is one of `feat|fix|refactor|docs|test|chore|perf|ci|style`.

#### Scenario: Valid commit message passes

- **WHEN** `git commit -m "feat: add post-merge hook"` is executed
- **THEN** the pre-commit hook SHALL pass the commit message check

#### Scenario: Invalid commit message fails

- **WHEN** `git commit -m "added post-merge hook"` is executed
- **THEN** the pre-commit hook SHALL fail with an error listing the allowed types

#### Scenario: Scoped commit message passes

- **WHEN** `git commit -m "fix(hooks): resolve globalResults ordering"` is executed
- **THEN** the pre-commit hook SHALL pass the commit message check

#### Scenario: Amend commits bypass message check

- **WHEN** `git commit --amend` is executed
- **THEN** the commit message check SHALL be skipped

### Requirement: Branch name convention enforcement

The pre-commit hook SHALL validate that the current branch name matches one of the allowed patterns: `main`, `staging`, `develop`, `feature/*`, `fix/*`, `chore/*`, `docs/*`.

#### Scenario: Valid branch name passes

- **WHEN** a commit is made on branch `feature/new-hooks`
- **THEN** the pre-commit hook SHALL pass the branch name check

#### Scenario: Invalid branch name fails

- **WHEN** a commit is made on branch `random-stuff`
- **THEN** the pre-commit hook SHALL fail with an error listing allowed branch prefixes

#### Scenario: Main branch passes

- **WHEN** a commit is made on branch `main`
- **THEN** the pre-commit hook SHALL pass the branch name check without requiring a prefix

### Requirement: Post-merge dependency drift detection

The system SHALL include a post-merge hook at `hooks/post-merge.mjs` that detects changes to `package-lock.json` since the merge and runs `npm install` if needed.

#### Scenario: No lockfile change skips install

- **WHEN** a merge does NOT change `package-lock.json`
- **THEN** the post-merge hook SHALL exit silently with code 0

#### Scenario: Lockfile changed runs install

- **WHEN** a merge changes `package-lock.json`
- **THEN** the post-merge hook SHALL run `npm install`
- **AND** SHALL report success or failure

#### Scenario: Install failure warns but does not block

- **WHEN** `npm install` fails during post-merge (e.g., network error)
- **THEN** the hook SHALL warn the user but exit with code 0

#### Scenario: Site data or CSS changed triggers rebuild warning

- **WHEN** a merge changes `site.json` or `assets/css/core.css`
- **THEN** the post-merge hook SHALL warn the user to run `npm run build`

### Requirement: Pre-push validation gate

The system SHALL include a pre-push hook at `hooks/pre-push.mjs` that runs lint and validate checks before allowing a push to proceed.

#### Scenario: Clean lint and validate allows push

- **WHEN** `git push` is executed and `npm run lint:all && npm run validate` both pass
- **THEN** the push SHALL proceed

#### Scenario: Lint failure blocks push

- **WHEN** `git push` is executed and linting finds errors
- **THEN** the hook SHALL exit with code 1
- **AND** the push SHALL be blocked

#### Scenario: Validate failure blocks push

- **WHEN** `git push` is executed and validation finds errors
- **THEN** the hook SHALL exit with code 1
- **AND** the push SHALL be blocked

### Requirement: Hook lifecycle integration

The orchestration engine's `hook-engine.mjs` SHALL include post-merge and pre-push events in the lifecycle phase mappings.

#### Scenario: Apply phase includes post-merge

- **WHEN** the orchestration engine runs the `apply` phase
- **THEN** the lifecycle SHALL include `post-merge` in addition to existing `pre-build`, `post-build`, and `theme-change`

#### Scenario: globalResults ordering is fixed

- **WHEN** `executeLifecycle` processes global hooks
- **THEN** the `globalResults` array SHALL contain results in deterministic order matching project hooks behavior
