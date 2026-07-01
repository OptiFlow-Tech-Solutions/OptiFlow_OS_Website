## Why

The site has solid linting and testing tooling configured but lacks automation — no CI pipeline, no automated quality gates, and no performance optimization beyond basic Lighthouse thresholds. QA-001 and QA-002 laid groundwork for a11y compliance and test infrastructure, but the build pipeline spec's CI requirement remains unimplemented. QA-003 bridges the gap: automate quality enforcement and optimize delivery performance.

## What Changes

- Add GitHub Actions CI workflow running build → validate → lint → test on every PR
- Add `npm audit` step for dependency vulnerability scanning
- Inject `<link rel="preconnect">` resource hints for Google Fonts and Plausible analytics
- Add `loading="lazy"` to below-fold images across content-heavy pages
- Enable CSS/JS minification in the build pipeline (both now under 50KB, but growing)
- Add `functions/` directory to ESLint scope (currently only `.mjs` files)
- Fix remaining pre-existing HTML validation errors on contact and product-overview pages
- Create `security.yaml` and `audit.yaml` pipeline configs for the orchestration engine
- Wire GATE_TEST into the orchestration pipeline

## Capabilities

### New Capabilities

- `code-quality-pipeline`: Automated CI with linting, testing, dependency auditing, and quality gates enforced on every PR
- `performance-optimization`: Resource hints, lazy image loading, minification, and delivery performance improvements

### Modified Capabilities

- `build-pipeline`: Add minification step, preconnect hint injection, and enforce build failure on validation errors
- `testing-suite`: Wire E2E tests into CI pipeline with build-before-test requirement
- `platform-monitoring`: Add `npm audit` dependency vulnerability scanning capability

## Impact

- New `.github/workflows/pr-checks.yml` file
- Modified `scripts/assemble.mjs` (minification, preconnect injection)
- Modified `eslint.config.js` (add `functions/` scope)
- Modified `scripts/validate.mjs` and `hooks/post-build.mjs` (exit code enforcement)
- New `orchestrate/pipeline-configs/security.yaml` and `audit.yaml`
- Modified dist HTML pages: contact, product-overview (HTML fixes), all pages (performance)
