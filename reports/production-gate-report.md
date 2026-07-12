# Production Gate Report
**Generated:** 2026-07-08T06:22:06.778Z
**Duration:** 11831ms
**Score:** 89/100 (FAIL)

## Score Breakdown

| Section | Score | Weight | Checks | Pass | Fail | Skip |
|---------|-------|--------|--------|------|------|------|
| code_quality | 67 | 10 | 3 | 2 | 1 | 0 |
| frontend | 90 | 10 | 3 | 3 | 0 | 0 |
| testing | 100 | 15 | 1 | 1 | 0 | 1 |
| accessibility | 100 | 5 | 1 | 1 | 0 | 1 |
| security | 70 | 20 | 5 | 4 | 1 | 0 |
| performance | 100 | 10 | 3 | 3 | 0 | 0 |
| docker | 100 | 10 | 3 | 3 | 0 | 3 |
| backend | 100 | 10 | 4 | 4 | 0 | 4 |
| database | 100 | 10 | 3 | 3 | 0 | 3 |
| documentation | 77 | 5 | 3 | 2 | 1 | 0 |

## Detailed Results

### code_quality

**❌ Full ESLint validation** — Score: 0/10
  - FAIL: ESLint found issues
  - INFO: 
D:\OptiFlow_OS_Website\scripts\validate.mjs
  247:52  error  Redundant double negation  no-extra-boolean-cast

✖ 1 problem (1 error, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.



**✅ Full Stylelint validation** — Score: 10/10
  - PASS: Stylelint passed

**✅ HTML validation** — Score: 10/10
  - PASS: HTML validation passed

### frontend

**✅ Build succeeds** — Score: 10/10
  - PASS: Build successful

**✅ Validation script** — Score: 7/10
  - WARN: minor validation issues (hardcoded colors, short descriptions)
  - PARTIAL (70%): 1 error(s), fix in follow-up
  - INFO: 
─ Link Check ─

─ Hardcoded Colors ─
  ⚠ Hardcoded #0a1628 in 404\index.html
  ⚠ Hardcoded #0a1628 in 500\index.html
  ⚠ Hardcoded #0a1628 in os\competitive-positioning\index.html
  ⚠ Hardcoded #0a1628 in os\contact\index.html
  ⚠ Hardcoded #0a1628 in os\demo-booking\index.html
  ⚠ Hardcoded #0a1628 in os\faq\index.html
  ⚠ Hardcoded #0a1628 in os\feature-showcase\index.html
  ⚠ Hardcoded #0a1628 in os\features\index.html
  ⚠ Hardcoded #f0a020 in os\features\index.html
  ⚠ Hardcoded #0a1628 in 

**✅ All routes resolve** — Score: 10/10
  - PASS: All 16 routes resolve

### testing

**⏸ E2E tests (Playwright)** — Score: 10/10
  - SKIP: SKIP_TESTS=1

### accessibility

**⏸ Axe-core accessibility** — Score: 10/10
  - SKIP: local mode — accessibility validated in CI

### security

**✅ Secrets present in build** — Score: 10/10
  - PASS: No secrets found in dist

**✅ Dependency vulnerabilities** — Score: 10/10
  - PASS: No high/critical vulnerabilities

**❌ CSRF protection (forms)** — Score: 0/10
  - INFO: os\contact\index.html: no visible CSRF token
  - INFO: os\demo-booking\index.html: no visible CSRF token
  - INFO: os\newsletter\index.html: no visible CSRF token
  - FAIL: CSRF tokens missing

**✅ Content Security Policy** — Score: 10/10
  - PASS: CSP header configured in nginx.conf

**✅ CORS configuration** — Score: 5/10
  - WARN: CORS headers not in nginx.conf
  - PARTIAL (50%): should be configured for API backend

### performance

**✅ Total bundle size** — Score: 10/10
  - PASS: Total: 1.3 MB

**✅ Image optimization** — Score: 10/10
  - PASS: All 3 images under 500 KB

**✅ Compression (gzip/brotli)** — Score: 10/10
  - PASS: Compression configured

### docker

**⏸ Docker build** — Score: 10/10
  - SKIP: SKIP_DOCKER=1

**⏸ Docker healthcheck** — Score: 10/10
  - SKIP: SKIP_DOCKER=1

**⏸ Container startup** — Score: 10/10
  - SKIP: SKIP_DOCKER=1

### backend

**⏸ Django system checks** — Score: 10/10
  - SKIP: Django dependencies not installed

**⏸ REST API endpoints** — Score: 10/10
  - SKIP: requires running server

**⏸ Authentication flow** — Score: 10/10
  - SKIP: requires running server

**⏸ Error handling** — Score: 10/10
  - SKIP: requires running server

### database

**⏸ PostgreSQL connectivity** — Score: 10/10
  - SKIP: requires DATABASE_URL

**⏸ Pending migrations** — Score: 10/10
  - SKIP: requires DATABASE_URL

**⏸ Database constraints** — Score: 10/10
  - SKIP: requires DATABASE_URL

### documentation

**✅ Changelog exists** — Score: 10/10
  - PASS: CHANGELOG.md found

**❌ API documentation** — Score: 3/10
  - WARN: API documentation not found
  - PARTIAL (30%): should exist for active backend

**✅ Production gate docs** — Score: 10/10
  - PASS: PRODUCTION_GATE.md found
