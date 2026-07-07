## Context

The 404 error page source template already exists at `src/pages/404.html`. It is built by `scripts/assemble.mjs` into `dist/404/index.html` and registered in `site.json` with `noindex: true`. The 500 error page (`src/pages/500.html`) serves as the reference pattern for error pages in this codebase.

The current 404 page is functional but has minor inconsistencies with the 500 page pattern:
- Error code color uses `var(--accent)` instead of `var(--teal)` (500 uses teal)
- No contact information block (500 includes email + phone placeholders)
- Both pages share the same `.error-section` / `.error-card` structure

No new dependencies, no architecture changes, no new build steps.

## Goals / Non-Goals

**Goals:**
- Consistent error page design language across 404 and 500 pages
- Add contact info block to 404 page ({{EMAIL}}, {{PHONE}} placeholders)
- Maintain existing responsive design, dark mode, and animation classes
- Pass `npm run validate` after changes

**Non-Goals:**
- Redesigning the page from scratch
- Adding illustrations, search bars, or interactive features
- Changing the build pipeline or site.json
- Touching the 500 page

## Decisions

1. **Follow 500 page pattern for contact info** — The 500 page already defines the contact info block pattern with {{EMAIL}}, {{PHONE}}, and a response time note. Reuse that exact block on 404 for consistency.

2. **Keep the suggestions section** — The 404 page's "You might be looking for" link list is useful and unique to 404. Keep it alongside the new contact block.

3. **CSS variable consistency** — Match 500's use of `var(--teal)` for the error code color. Currently 404 uses `var(--accent)`. This is a design system decision — error pages should share the same accent treatment.

4. **No component extraction** — Both pages use inline `<style>` blocks per project convention. Do not extract shared error styles to core.css as part of this change. ponytail: extracting ~20 lines of shared CSS between 2 pages doesn't pay for itself.

## Risks / Trade-offs

- **Low risk**: These are cosmetic/informational changes to a static HTML page. No JS logic, no API calls, no state management.
- **Visual regression**: Changing error-code color from `var(--accent)` to `var(--teal)` will change the visual appearance. This is intentional to match 500.
