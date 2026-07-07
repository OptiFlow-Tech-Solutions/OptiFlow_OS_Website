## 1. CSS Deduplication

- [x] 1.1 Add shared error page CSS classes (`.error-section`, `.error-card`, `.error-code`, `.error-actions`, `.error-contact` + dark mode and mobile responsive overrides) to `assets/css/core.css`
- [x] 1.2 Remove shared error page CSS from `src/pages/404.html` `<style>` block, keeping only `.error-suggestions` styles

## 2. Finalize 500 Page

- [x] 2.1 Update `src/pages/500.html` `<style>` block to remove shared CSS (now in core.css), keeping only page-specific overrides if any
- [x] 2.2 Verify the 500 page uses correct structure: error-code (500), heading ("Something Went Wrong"), lead text, CTA buttons ("Go to Homepage" + "Contact Support"), contact block with `{{EMAIL}}` and `{{PHONE}}` placeholders
- [x] 2.3 Verify all placeholders are correct: `{{PAGE_TITLE}}`, `{{PAGE_DESCRIPTION}}`, `{{EMAIL}}`, `{{PHONE}}`, `{{PHONE_TEL}}`

## 3. Build and Validate

- [x] 3.1 Run `npm run build` to generate `dist/500/index.html` and rebuild all pages with shared CSS
- [x] 3.2 Run `npm run validate` to verify links, colors, SEO, and consistency
- [x] 3.3 Spot-check both `/404/` and `/500/` in the built dist output for visual correctness and no regressions
