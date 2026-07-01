## 1. Shared Utilities

- [x] 1.1 Create `hooks/_utils.mjs` with path constants (`ROOT`, `ASSETS`, `SRC_PAGES`, `SRC_PARTIALS`), `readText(fp)`, `fail(msg)`, `ok(msg)`, `walkDir(dir, exts)`, `findDesignMd()`
- [x] 1.2 Verify `_utils.mjs` exports work by running `node -e "import('./hooks/_utils.mjs').then(m => console.log(Object.keys(m)))"` and confirming all 8 exports

## 2. Refactor Existing Hooks

- [x] 2.1 Refactor `hooks/pre-commit.mjs` to import from `_utils.mjs` instead of defining ROOT, readText, fail, walkSrc locally; re-export or replace `walkSrc` calls with `walkDir`
- [x] 2.2 Refactor `hooks/pre-build.mjs` to import from `_utils.mjs` instead of defining ROOT, ASSETS, SRC_PAGES, SRC_PARTIALS, fail, ok, findDesignMd, findDesignPngs, findAllHtml locally
- [x] 2.3 Refactor `hooks/post-build.mjs` to import from `_utils.mjs` instead of defining ROOT, DIST, fm tBytes, findAllPages, getSize locally (note: `fm tBytes`, `getSize`, `findAllPages` stay — only `ROOT` and `DIST` move)
- [x] 2.4 Refactor `hooks/theme-change.mjs` to import `ROOT`, `findDesignMd` from `_utils.mjs` instead of defining them locally — keep `extractColors` and `cssUsesVarFor` as they are theme-specific

## 3. New Hooks

- [x] 3.1 Add commit message format check to `hooks/pre-commit.mjs`: read `git log -1 --format=%s` during pre-commit, validate against `/^(feat|fix|refactor|docs|test|chore|perf|ci|style)(\(.+\))?: .{1,72}/`, skip on amend (check `GIT_REFLOG_ACTION` or `git rev-parse --verify HEAD` for existing parent)
- [x] 3.2 Add branch name check to `hooks/pre-commit.mjs`: read `git symbolic-ref --short HEAD`, validate against `/^(main|staging|develop|feature\/|fix\/|chore\/|docs\/)/`
- [x] 3.3 Create `hooks/post-merge.mjs`: check `git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD` for `package-lock.json` (run `npm install`), for `site.json`/`assets/css/core.css` (warn rebuild needed)
- [x] 3.4 Create `hooks/pre-push.mjs`: run `npm run lint:all` and `npm run validate` sequentially, exit 0 only if both pass

## 4. Orchestration Engine Fix

- [x] 4.1 Fix `orchestrate/hook-engine.mjs` `executeLifecycle()`: restructure `globalResults` array so it always contains objects `{ran, output}`, not mixed strings. Move the `globalResults.push(hookFile)` before the push of the result object, matching the project hooks pattern
- [x] 4.2 Add `post-merge` and `pre-push` lifecycle events to `lifecycleForPhase()` in `orchestrate/hook-engine.mjs`

## 5. Package Scripts & Husky

- [x] 5.1 Add `"postmerge": "node hooks/post-merge.mjs"` and `"prepush": "node hooks/pre-push.mjs"` to `package.json` scripts
- [x] 5.2 Add `.husky/post-merge` hook file with content `npm run postmerge`
- [x] 5.3 Add `.husky/pre-push` hook file with content `npm run prepush`

## 6. Validation

- [x] 6.1 Run `node hooks/pre-commit.mjs` directly to verify refactored hook still passes all 4 original checks
- [x] 6.2 Run `node hooks/pre-build.mjs` directly to verify refactored hook still passes all 4 checks
- [x] 6.3 Run `node hooks/post-merge.mjs` to verify it handles no-changes scenario gracefully
- [x] 6.4 Run `node hooks/pre-push.mjs` to verify lint + validate pass (or expected fail if lint errors exist)
- [x] 6.5 Run `npm run build && npm run validate` to verify full pipeline still works
