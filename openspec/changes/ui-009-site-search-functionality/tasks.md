# Tasks: Site Search Functionality (UI-009)

## Implementation Checklist

- [x] Create `scripts/generate-search-index.mjs` — build-time index generator that extracts content from dist HTML
- [x] Create `assets/js/search.js` — client-side search engine with scoring, highlighting, keyboard navigation
- [x] Add search CSS to `assets/css/core.css` — overlay, panel, input, result card, highlight, empty state styles
- [x] Add `--z-search: 200` CSS variable to `core.css`
- [x] Add search toggle button to `src/partials/nav.html` — ⌕ icon next to theme toggle
- [x] Add search modal markup to `src/partials/nav.html` — overlay + panel + input + results container
- [x] Update `scripts/assemble.mjs` — inject `<script src="/assets/js/search.js" defer>` into all pages
- [x] Update `scripts/assemble.mjs` — call `generateSearchIndex()` after page build
- [x] Build and verify — 0 errors, search-index.json generated (7.5 KB, 14 pages)
- [x] Validate — 0 errors, no new warnings introduced

## Verification

| Check | Result |
|-------|--------|
| `npm run build` | Pass — all 16 pages built |
| `npm run validate` | Pass — 0 errors |
| `dist/search-index.json` | Exists — 7.5 KB, 14 indexed pages |
| `dist/assets/js/search.js` | Exists — injected into all pages |
| Search toggle in nav | Present on all 14 public pages |
| Search modal markup | Present on all 14 public pages |
| `Ctrl+K` shortcut | Wired in search.js |
| Dark mode | Auto-adapts via CSS variables |
| `aria-*` attributes | role="dialog", aria-label, aria-hidden |
