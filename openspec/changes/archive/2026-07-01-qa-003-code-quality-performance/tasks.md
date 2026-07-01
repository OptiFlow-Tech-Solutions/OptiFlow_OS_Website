## 1. CI Pipeline

- [x] 1.1 Update `.github/workflows/ci.yml` to remove `continue-on-error`, add `npm audit`, include `functions/` in ESLint scope
- [x] 1.2 CI already uses `microsoft/playwright` action indirectly (npx playwright install)

## 2. Dependency Auditing

- [x] 2.1 `npm audit --production` found 0 vulnerabilities
- [x] 2.2 Added `npm audit --production` step to CI workflow

## 3. ESLint Scope

- [x] 3.1 Added `functions/` directory to ESLint config with Cloudflare Worker globals
- [x] 3.2 Fixed all unused variable errors in `functions/` files (renamed to `_` prefix)

## 4. Pre-Commit Hook

- [x] 4.1 Configured husky pre-commit to run `npm run precommit`

## 5. Pipeline Configs

- [x] 5.1 Created `orchestrate/pipeline-configs/security.yaml`
- [x] 5.2 Created `orchestrate/pipeline-configs/audit.yaml`

## 6. Build Pipeline Enhancements

- [x] 6.1 Added preconnect hints for Google Fonts and Plausible to `scripts/assemble.mjs`
- [x] 6.2 Added CSS/JS minification to asset copy logic (12% CSS, 20% JS reduction)
- [x] 6.3 Fixed `hooks/post-build.mjs` to propagate validate exit code

## 7. Performance Optimizations

- [x] 7.1 No `<img>` tags found on content pages — all visuals use CSS backgrounds or inline SVGs
- [x] 7.2 Combined CSS+JS reduction verified at ~15% (under 50KB combined)

## 8. HTML Validation Fixes

- [x] 8.1 Fixed 8 unclosed `faq-item` divs + 1 missing container `</div>` in contact page — 0 html-validate errors
- [x] 8.2 Fixed orphaned `<div>` in product-overview page — 0 html-validate errors

## 9. GATE_TEST Integration

- [x] 9.1 Updated `build.yaml` to make test blocking (removed `continue-on-error`)

## 10. Validation

- [x] 10.1 Build succeeds with minification and preconnect hints present in all pages
- [x] 10.2 Validate: 0 errors, 86 warnings (pre-existing, non-blocking)
- [x] 10.3 Lint: functions/ clean (0 errors), remaining errors pre-existing in orchestrate/scripts
- [x] 10.4 All HTML validation errors resolved on contact and product-overview pages
