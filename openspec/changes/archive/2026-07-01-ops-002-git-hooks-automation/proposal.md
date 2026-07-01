## Why

The existing 4 hook scripts (`pre-commit`, `pre-build`, `post-build`, `theme-change`) each duplicate ~20 lines of filesystem utilities (ROOT resolution, `readText`, `walkSrc`). The pre-commit hook only scans, never auto-fixes. The orchestration engine's `hook-engine.mjs` has a structural bug where `globalResults` is populated in the wrong order. No commit-message or branch-name conventions are enforced. Post-merge dependency checks are absent.

## What Changes

- Extract shared hook utilities (`ROOT`, `readText`, `fail/ok`, `walkDir`, `findDesignMd`) into a single `hooks/_utils.mjs` module, removing the duplicated code from all 4 existing hooks
- Fix the `hook-engine.mjs` bug: `globalResults` array construction is out of order (results are pushed before the hook name string, mixing types)
- Add commit message convention enforcement to pre-commit (`feat|fix|refactor|docs|test|chore|perf|ci`)
- Add branch name convention validation to pre-commit (`main|staging|develop|feature/*|fix/*|chore/*|docs/*`)
- Add `hooks/post-merge.mjs`: runs `npm install` if `package-lock.json` changed, warns if `site.json` or `core.css` changed (needs rebuild)
- Add `hooks/pre-push.mjs`: runs lint + validate before push (guards CI from preventable failures)

## Capabilities

### New Capabilities
- `git-hooks`: standardized hook system with shared utilities, commit message/branch name enforcement, post-merge dependency checks, and pre-push validation gate

### Modified Capabilities
- `code-quality-pipeline`: pre-commit hook now enforces commit message format AND branch name conventions (new requirements added to existing pre-commit spec)
- `build-pipeline`: post-merge and pre-push hooks added to the build lifecycle (new hook integration points)

## Impact

- `hooks/_utils.mjs` (new): shared utility module
- `hooks/pre-commit.mjs`: refactor to use _utils, add commit/branch checks
- `hooks/pre-build.mjs`: refactor to use _utils
- `hooks/post-build.mjs`: refactor to use _utils
- `hooks/theme-change.mjs`: refactor to use _utils
- `hooks/post-merge.mjs` (new): dependency drift detection
- `hooks/pre-push.mjs` (new): pre-push validation gate
- `orchestrate/hook-engine.mjs`: fix globalResults bug, add post-merge + pre-push lifecycle events
- `package.json`: add `postmerge` and `prepush` npm scripts
- `.husky/`: add `post-merge` and `pre-push` hooks
- `openspec/specs/code-quality-pipeline/spec.md`: delta for new requirements
- `openspec/specs/build-pipeline/spec.md`: delta for new hook integration points
