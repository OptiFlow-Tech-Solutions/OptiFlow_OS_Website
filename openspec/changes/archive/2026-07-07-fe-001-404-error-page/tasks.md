## 1. Update 404 page template

- [x] 1.1 Change error code color from `var(--accent)` to `var(--teal)` in the inline `<style>` block to match 500 page
- [x] 1.2 Add `.error-contact` CSS class (and dark mode variant) — copy from 500 page's inline styles
- [x] 1.3 Add contact info HTML block after the suggestions section — email, phone, and response time note using `{{EMAIL}}`, `{{PHONE}}` placeholders
- [x] 1.4 Rename `.error-suggestions` heading block to fit alongside contact info (both use `.reveal` class)

## 2. Build and validate

- [x] 2.1 Run `npm run build` to assemble dist/
- [x] 2.2 Run `npm run validate` and fix any issues
- [x] 2.3 Verify 404 page in browser: confirm error code color is teal, contact info shows correct data, responsive and dark mode work
