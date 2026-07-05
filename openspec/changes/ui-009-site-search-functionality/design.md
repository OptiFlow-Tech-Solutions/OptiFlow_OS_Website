# Design: Site Search Functionality (UI-009)

## Architecture

```
┌──────────────────────────────────────────────────┐
│                    BUILD TIME                     │
│                                                  │
│  assemble.mjs                                    │
│       │                                          │
│       ├──► generate-search-index.mjs             │
│       │       │                                  │
│       │       ├── Read dist/*/index.html          │
│       │       ├── Strip HTML → plain text        │
│       │       ├── Extract first 300 chars         │
│       │       └── Write search-index.json (7.5KB)│
│       │                                          │
│       └──► Inject <script src="search.js">       │
│              into every page </head>              │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│                    CLIENT SIDE                    │
│                                                  │
│  User clicks ⌕ or presses Ctrl+K                 │
│       │                                          │
│       ▼                                          │
│  search.js: openModal()                          │
│       │                                          │
│       ├── fetch('/search-index.json')            │
│       │   (cached after first load)              │
│       │                                          │
│       ├── User types 2+ characters               │
│       │       │                                  │
│       │       ▼                                  │
│       │   score(item, query)                     │
│       │   ├── exact title match     → 100        │
│       │   ├── title starts-with     → 90         │
│       │   ├── title contains        → 70         │
│       │   ├── description contains  → 40         │
│       │   └── excerpt contains      → 30 - idx   │
│       │                                          │
│       ├── Sort by score, take top 8              │
│       │                                          │
│       └── renderResults()                        │
│           ├── <mark> highlighting                │
│           ├── Arrow key navigation               │
│           ├── Enter to navigate                  │
│           └── Escape to close                    │
└──────────────────────────────────────────────────┘
```

## Component Tree

```
.search-overlay (#searchModal)        ← z-index: var(--z-search) = 200
  └── .search-panel                   ← max-width: 560px, card surface
        ├── .search-input-wrap        ← icon + input
        │     ├── <svg> search icon
        │     └── <input> #searchInput
        └── .search-results           ← max-height: 360px, scrollable
              └── .search-result * N  ← link cards
                    ├── .search-result-title   ← <mark> highlights
                    └── .search-result-desc    ← <mark> highlights
```

## Data Model

```json
// search-index.json — generated at build time
[
  {
    "url": "/features/",
    "title": "Features — OptiFlow OS",
    "description": "Detailed feature breakdown of OptiFlow OS — task management...",
    "excerpt": "Business Operating System For MSMEs Everything Your Business..."
  }
]
```

## Styling

- Uses existing CSS variables: `--surface`, `--border`, `--fg`, `--muted`, `--fg-soft`, `--fg-disabled`
- Dark mode: all colors derive from CSS variables — auto-adapts
- Match highlights: `color-mix(in oklch, var(--teal) 20%, transparent)` — brand-aligned
- Responsive: full-width on mobile, centered modal on desktop
- Backdrop blur on overlay for depth

## Accessibility

- Search modal has `role="dialog"` and `aria-label="Site search"`
- `aria-hidden="true"` on overlay when closed
- Escape key closes modal
- Arrow keys navigate results
- Focus auto-managed: input receives focus on open
- Keyboard shortcut: `Ctrl+K` / `Cmd+K`

## Decisions

| Decision | Rationale |
|----------|-----------|
| Client-side, not API-driven | 14 pages don't justify a backend. Build-time index is zero-cost. |
| Excerpt capped at 300 chars | Keeps index small (7.5KB). Full pages would be ~200KB for no benefit at this scale. |
| Top 8 results | Reasonable limit for a search overlay. More would require scrolling on mobile. |
| No autocomplete suggestions | Search-as-you-type results serve the same purpose for 14 pages. |
| No filter chips | Filter taxonomy doesn't exist. Add when blog engine ships with categories/tags. |
| JS injected via assemble.mjs | Single injection point instead of editing 20 page files. |
