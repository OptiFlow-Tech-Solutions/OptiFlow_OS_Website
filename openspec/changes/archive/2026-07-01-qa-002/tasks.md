# Tasks: QA-002 Testing Suite

- [ ] **T1: Verify existing test suite passes** — Run `npm run test` (build + serve + Playwright), confirm all 5 specs pass across 4 browser projects
- [ ] **T2: Add testing-suite capability spec** — Create `openspec/specs/testing-suite/spec.md` with requirements for test organization, coverage, and quality gates
- [ ] **T3: Wire tests into CI pipeline spec** — Update `build-pipeline` spec to require `npm test` as a PR validation step alongside build/validate/lint
- [ ] **T4: Create GitHub Actions CI workflow** — `.github/workflows/pr-checks.yml` running build → validate → lint → test on PRs to main
- [ ] **T5: Verify quality gate integration** — Confirm GATE_TEST runs and passes through orchestration engine
- [ ] **T6: Validate HTML errors in dist/** — Fix pre-existing close-order errors in contact/index.html and product-overview/index.html
