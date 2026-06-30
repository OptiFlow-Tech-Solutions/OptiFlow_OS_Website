## 1. CSS Cleanup

- [x] 1.1 Remove redundant `.stagger > *` animation rules (lines 134–140) from `src/pages/newsletter.html` `<style>` block

## 2. HTML Class Updates

- [x] 2.1 Replace `.stagger` with `.stagger-4` on Trust Metrics `.trust-metrics` container (line 222)
- [x] 2.2 Replace `.stagger` with `.stagger-3` on Categories `.grid-3` container (line 293)
- [x] 2.3 Replace `.stagger` with `.stagger-3` on Latest Articles `.grid-3` container (line 347)
- [x] 2.4 Replace `.stagger` with `.stagger-4` on Popular Articles `.stagger` container (line 413)
- [x] 2.5 Replace `.stagger` with `.stagger-3` on Resources Hub `.grid-3` container (line 500)

## 3. Verification

- [x] 3.1 Build: `npm run build` — verify no errors (14 pages built, 0 errors)
- [x] 3.2 Validate: `npm run validate` — verify no new warnings related to newsletter page (same shared warnings, no regressions)
