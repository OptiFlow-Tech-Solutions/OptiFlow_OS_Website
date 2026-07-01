## Context

The project has solid quality tooling configured (ESLint, Stylelint, html-validate, Playwright E2E) but nothing is automated. The build-pipeline spec has required CI since inception but no `.github/workflows/` directory exists. QA-001 and QA-002 established a11y compliance and test infrastructure; QA-003 automates enforcement and optimizes delivery.

## Goals / Non-Goals

**Goals:**
- GitHub Actions CI workflow running build → validate → lint → test → audit
- Resource hints (preconnect) for Google Fonts and Plausible
- Build-time CSS/JS minification (currently ~26KB CSS + ~18KB JS, no framework needed)
- Fix pre-existing HTML validation errors in contact and product-overview pages
- Add `functions/` directory to ESLint scope
- Wire GATE_TEST into orchestration pipeline
- Create `security.yaml` and `audit.yaml` pipeline configs

**Non-Goals:**
- Unit test suite (beyond scope — E2E tests cover all pages)
- Image format conversion (WebP/AVIF)
- CSS code-splitting per page
- Gating validation on warnings (explicitly kept as non-blocking per spec)
- Automated deploy from CI (Netlify/Cloudflare handle deploys independently)

## Decisions

1. **Minification approach: raw string replacement** — No Terser/CSSNano dependency. CSS and JS are each under 50KB. Simple regex-based whitespace/comment removal in the build script is sufficient. Add a full minifier only when size grows beyond threshold.

2. **Preconnect injection in assemble.mjs** — Build pipeline already injects SEO meta, JSON-LD, canonical URLs. Preconnect hints follow the same pattern rather than requiring page template changes.

3. **CI uses GitHub-hosted runners** — No custom runners needed. E2E tests require Playwright browsers; using `microsoft/playwright` GitHub Action for browser installation.

4. **Husky for pre-commit hooks** — Already a common pattern. Install as dev dependency, configure `.husky/pre-commit` to run `npm run precommit`. No lint-staged needed (pre-commit already only scans staged files).

5. **Exit code enforcement in post-build** — Currently `post-build.mjs` catches validate errors silently. Change to propagate non-zero exit codes so CI can detect build failures.

## Risks / Trade-offs

- [Minification without source maps] → Debugging production assets harder. Mitigation: dev mode (`npm run dev`) serves unminified source files.
- [CI adds ~5 min to each PR] → Acceptable for quality enforcement; 10 min timeout provides headroom.
- [npm audit may flag false positives] → Use `--production` flag to scope to runtime deps only. Manual override possible on PR basis.
- [Husky requires Node.js locally] → Already required for build pipeline. No new dependency on developer machines.
