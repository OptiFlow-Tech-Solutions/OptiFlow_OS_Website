# Footer
- **Status:** complete | **Used On:** all 16 pages
- **Priority:** medium

## Feature IDs
- CNT-003 — social links (completed)
- ACC-001 — aria-hidden
- ACC-003 — ARIA labels

## Pending Improvements
- [ ] None currently

## Dependencies / Implementation Notes
Present in `src/partials/footer.html` (27 lines). Includes: 5-column grid, brand column, product/solutions/resources/contact link groups, social icons (LinkedIn, X, YouTube), theme toggle. Uses `{{PHONE}}`, `{{EMAIL}}`, `{{YEAR}}` placeholders resolved from `site.json` at build time.
