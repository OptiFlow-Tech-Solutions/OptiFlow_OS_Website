# Tasks: PAGE-001 — Home Page

## Phase 1: Verification

- [x] **T1**: Run `npm run build` — confirm home page assembles at `dist/index.html` with 0 errors
- [x] **T2**: Run `npm run validate` — confirm 0 errors on home page
- [x] **T3**: Verify placeholders (`{{PAGE_TITLE}}`, `{{PAGE_DESCRIPTION}}`, `{{WHATSAPP}}`) resolve correctly
- [x] **T4**: Verify `<!-- INCLUDE: nav -->` and `<!-- INCLUDE: footer -->` inject correctly
- [x] **T5**: Verify SEO tags: canonical URL, OG tags, Twitter card, robots meta
- [x] **T6**: Verify accessibility: skip-link, semantic landmarks, focus-visible styles, reduced-motion support
- [x] **T7**: Verify all 13 sections render with dark mode coverage

## Phase 2: Compliance

- [x] **T8**: Confirm no hardcoded company info (uses `{{PHONE}}`, `{{EMAIL}}`, `{{YEAR}}` placeholders)
- [x] **T9**: Confirm CSS variables used for all colors (no hardcoded hex in content)
- [x] **T10**: Confirm shared scripts not duplicated (sticky CTA, scroll-to-top, reveal, FAQ handled by core.js)

## Summary

All tasks complete. Home page (77.6 KB, 13 sections) passes build with 0 errors. No changes needed.
