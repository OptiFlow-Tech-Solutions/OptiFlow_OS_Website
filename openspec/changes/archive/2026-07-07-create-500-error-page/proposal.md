## Why

The 500 error page source already exists (`src/pages/500.html`) and is registered in `site.json`, but predates the 404 page implementation. Since the 404 page (FE-001) was completed with a dedicated pass that defined the shared error page pattern, the 500 page now needs to be finalized — CSS deduplication, visual consistency with the 404, and build validation — to reach the same production quality.

## What Changes

- Move shared error page CSS (`.error-section`, `.error-card`, `.error-code`, `.error-actions`, `.error-contact`) from both `500.html` and `404.html` inline `<style>` blocks into `assets/css/core.css`
- Add `error-contact` to the 500 page layout (it exists inline but needs review for consistency with 404)
- Ensure the 500 page uses the correct CTA pair: "Go to Homepage" + "Contact Support" (not "Book a Demo" — appropriate for server errors)
- Verify all placeholders are correct (`{{EMAIL}}`, `{{PHONE}}`, `{{PHONE_TEL}}`), dark mode works, responsiveness is intact, and `noindex` is set
- Build the project (`npm run build`) to generate `dist/500.html`
- Validate the output (`npm run validate`)

## Capabilities

### New Capabilities
- `500-error-page`: A polished, production-ready 500 Internal Server Error page that follows the shared error page pattern established by the 404 page, with proper CSS variables, dark mode, responsiveness, contact info, and build integration.

### Modified Capabilities
- `404-error-page`: The 404 error page's inline CSS for shared error components (`.error-section`, `.error-card`, `.error-code`, `.error-actions`, `.error-contact`) will be deduplicated to `core.css`. No visible change to the 404 page — purely a CSS organization change.

## Impact

- **Source**: `src/pages/500.html` (modify), `src/pages/404.html` (modify — remove shared CSS), `assets/css/core.css` (add shared error page styles)
- **Build**: `dist/500.html` will be generated for the first time via `npm run build`
- **Validation**: `npm run validate` will verify the new page passes all checks
