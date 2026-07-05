# Proposal: Site Search Functionality (UI-009)

## Summary

Add client-side site search to the OptiFlow OS marketing website. A search icon in the navigation bar opens a modal overlay with a text input. Users can search across all 14 public pages by title, description, and content excerpt. Results are ranked and highlighted inline.

## Motivation

The site has 14 public marketing pages covering product features, pricing, solutions, FAQs, and resources. Users arriving with specific questions need a fast way to find the right page without scanning navigation menus. The site's existing `schema.org/SearchAction` structured data was already declared on the home page, but no actual search UI existed.

## Architecture Decision: Client-Side Over API-Driven

The original spec (UI-009) envisioned a backend-driven search with autocomplete and filters, depending on API-005 (Cloudflare KV database) and SYS-003 (interactive runtime). This proposal intentionally deviates:

| Aspect | Original Spec | Built |
|--------|-------------|-------|
| Search backend | KV-powered API endpoint | Build-time JSON index |
| Autocomplete | Yes | No (search-as-you-type results instead) |
| Filters | Category/section filters | No (not needed at 14 pages) |
| Full-text depth | Full page content | 300-char excerpts |

**Rationale:** A 14-page marketing site does not need a KV-backed search API. The client-side approach is zero-cost (no API calls, no backend), instant (preloaded JSON), and right-sized. If the blog engine (CONTENT-003) adds hundreds of pages, the backend path can be revisited.

## What Changes

| Area | Change |
|------|--------|
| `scripts/generate-search-index.mjs` | **New.** Build-time script that extracts content from dist/ HTML and generates `search-index.json` |
| `assets/js/search.js` | **New.** Client-side search engine — loads index, ranks by relevance, renders highlighted results |
| `assets/css/core.css` | **Add.** Search overlay, input, result card, and highlight styles (~40 lines) |
| `src/partials/nav.html` | **Add.** Search toggle button (⌕ icon) and search modal overlay markup |
| `scripts/assemble.mjs` | **Modify.** Inject `search.js` into all pages, call index generator after build |

## Affected Specs

- `build-pipeline` — search index generation step added
- `shared-components` — search UI added to nav partial
- `marketing-pages` — search JS automatically injected into all pages

## Risks

- **Low risk.** Client-side only — no breaking changes to existing infrastructure
- **No new dependencies.** Vanilla JS, no npm packages
- **Index staleness.** Search index is rebuilt on every `npm run build` — always in sync with content
