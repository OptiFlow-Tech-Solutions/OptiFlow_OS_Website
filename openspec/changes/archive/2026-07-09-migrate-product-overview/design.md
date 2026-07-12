## Context

The OptiFlow OS website is undergoing a gradual migration from static HTML (`src/pages/*.html`) to a React SPA (`frontend/src/pages/*.tsx`). The Product Overview page is the 3rd of 14 pages being migrated, following Home and Features. The static page contains 12 sections with significant interactive elements (tab switching, SVG tooltips, expandable grids, chip toggling, scroll reveals).

**Current state:**
- Static HTML: `src/pages/product-overview.html` (973 lines, fully complete)
- React skeleton: `frontend/src/pages/ProductOverview.tsx` (14 lines, placeholder)
- Route: `/product-overview` already registered in `frontend/src/routes.ts`
- Shared components available: `Section`, `Container`, `Card`, `Button`, `PageLayout`
- Design tokens available via `design-tokens.css` and `GlobalStyles`
- Pattern established by Home and Features pages for structure

**Constraints:**
- Must use CSS variables from the design system (`--accent`, `--teal`, `--green`, etc.) — no hardcoded colors
- Must use `<Section>` component, not raw `<section className="section">`
- Must use `<Button as={Link} to="...">` for all CTAs
- Content must match static HTML exactly (headings, text, structure)
- Page-specific styles go in a co-located styles component

## Goals / Non-Goals

**Goals:**
- Port all 12 sections with identical content, layout, and interactivity
- Implement all 5 interactive elements with React state (tabs, KPIs, chips, tooltips, expand/collapse)
- Create reusable data module so content lives separate from presentation
- Match dark mode and responsive behavior exactly
- Follow established patterns from Features and Home pages

**Non-Goals:**
- No backend or API changes (pure frontend)
- No new shared components (page-specific components only)
- No changes to the static HTML (it stays as the source of truth during migration)
- No animation library — CSS-only animations matching the original

## Decisions

### Decision 1: Page-specific components in `components/product-overview/`

Components that are ONLY used by this page go in a dedicated subdirectory. Components that become shared later can be promoted.

**Rationale:** Features page uses `components/sections/features/` pattern. Following it keeps the component tree organized and avoids premature abstraction.

**Alternatives considered:**
- Inline everything in `ProductOverview.tsx` — would create a 600+ line file, harder to maintain
- Put in `components/sections/` directly — but these are single-use, not true shared sections

### Decision 2: Styles in a dedicated `ProductOverviewStyles.tsx` component

A single `<style>` component renders all page-specific CSS, following the Features page pattern (`FeaturesStyles.tsx`). This keeps the page component lean and the CSS co-located.

**Alternatives considered:**
- CSS module (`.module.css`) — not used elsewhere in the project, would break consistency
- Tailwind inline — many complex selectors (hover states, dark mode, responsive) are cleaner in CSS

### Decision 3: SVG architecture diagram uses React refs + inline event handlers

Instead of the original's `querySelectorAll` + `getBoundingClientRect()` approach, each node is a `<div>` positioned with CSS, and tooltip visibility/position is managed via `useState` and refs.

**Architecture:**
```
ArchitectureDiagram
├── SVG layer (12 dashed connector lines)
├── Hub (centered gradient circle)
├── Node components (12, positioned absolutely)
│   └── onMouseEnter → show tooltip
│   └── onMouseLeave → hide tooltip
└── Tooltip (positioned absolutely, visibility toggled)
```

**Tooltip edge-case handling:** Before showing, check if tooltip would overflow viewport right/bottom edges. If so, flip position (show above instead of below, or left instead of right).

**Alternatives considered:**
- Canvas-based rendering — over-engineered for 12 static nodes
- CSS-only tooltips (no JS positioning) — can't dynamically position near viewport edges

### Decision 4: Data module follows `features.ts` pattern

Module data, demo panel content, architecture node metadata, and panel content live in `data/productOverview.ts`. Each entry has typed interfaces matching the structure of the static HTML content.

**Rationale:** The Features page already has a well-structured `data/features.ts` with TypeScript interfaces. Reusing the pattern keeps data discoverable and type-safe.

### Decision 5: Panel sections use a generic `PanelSection` component

Admin, Captain, and Doer panels share identical structure: features list (left) + dashboard mockup (right) + 3 benefit cards (bottom). A single parameterized component handles all three, with a `reverse` prop for the Captain panel's rtl layout.

**Component API:**
```tsx
<PanelSection
  title="Complete Business Visibility For Owners &amp; Admins"
  lead="See everything. Control everything..."
  features={[...]}        // { text: string }[]
  dashboardRows={[...]}   // { label: string, value: string }[]
  benefits={[...]}        // { icon: string, title: string, description: string }[]
  badge?: { text: string, colors: string[] }  // Only for Doer panel
  reverse?: boolean       // Only for Captain panel
/>
```

**Alternatives considered:**
- Three separate components (AdminPanel, CaptainPanel, DoerPanel) — 3x the code for identical structure
- Inline the 3 panels — repetitive, harder to maintain

## Risks / Trade-offs

- **[SVG tooltip positioning]** Viewport edge tooltips could clip → Mitigation: JS position check before rendering; if tooltip would overflow right edge, render on left side of node; if would overflow bottom, render above
- **[Module expand/collapse animation]** CSS `grid-template-rows: 0fr → 1fr` requires `overflow: hidden` wrapper → Mitigation: Same pattern as original HTML, tested across browsers
- **[Content drift]** Static HTML and React page could diverge over time → Mitigation: The static HTML remains the source of truth during migration; final validation step compares both
- **[Bundle size]** Adding 6 page-specific components and a data module → Mitigation: All components are lazy-loaded via the route config's `lazy(() => import(...))` pattern; page-specific data is tree-shakeable
