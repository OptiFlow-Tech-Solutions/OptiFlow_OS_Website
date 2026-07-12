## Context

The React SPA (`frontend/`) has a complete component ecosystem: `Section`, `Card`, `Button`, `Container`, `FeatureNav`, `FeatureCTA`, `DashboardPreview`, `PhoneFrame`, `EcosystemHub`, `ComparisonTable`, and `FeaturesStyles`. The Features page (118 lines) demonstrates the established pattern — data-driven sections composed from shared components with inline styles using CSS variables.

Both FeatureShowcase.tsx and CompetitivePositioning.tsx are currently 14-line stubs. Their static HTML counterparts (`src/pages/feature-showcase.html`, 535L; `src/pages/competitive-positioning.html`, 391L) contain the canonical content. Routes are already registered in `routes.ts`.

The existing `FeatureSection` component handles 7 layout types but none matches the Showcase pattern (problem+cost → 2 solutions → 3 metrics → dual device preview). The `ComparisonTable` component already supports the exact matrix format needed for competitive positioning (check/cross/text cells, sticky headers, horizontal scroll, dark mode).

## Goals / Non-Goals

**Goals:**
- FeatureShowcase page renders all 6 transformations with content matching static HTML
- CompetitivePositioning page renders quadrant, matrix, cost cards, and standout cards matching static HTML
- All new components follow existing patterns: inline styles with CSS variables, TypeScript interfaces, no external dependencies
- Reuse FeatureNav, EcosystemHub, FeatureCTA, DashboardPreview, PhoneFrame, ComparisonTable without modification
- Separate data files for showcase and competitive data (clean separation from features.ts)

**Non-Goals:**
- Modifying the static HTML build pipeline
- Modifying existing FeatureSection component
- Adding new npm dependencies or CSS frameworks
- Backend, database, or API changes
- Animation beyond what's in static HTML (scroll reveal via useScrollReveal hook, orbit float via CSS keyframes)

## Decisions

### Decision 1: Standalone ShowcaseTransform component vs. extending FeatureSection

**Chosen: Standalone `ShowcaseTransform` component.**

The FeatureSection component already has 7 layout branches. Adding an 8th ("showcase") would increase its complexity and create a data model tension — the showcase needs `cost`, `solutions` (exactly 2), `metrics` (exactly 3), `phoneFrame`, and a dual visual layout, none of which fit `FeatureEntry`. A standalone component keeps FeatureSection stable and gives ShowcaseTransform a clean, purpose-specific interface.

**Alternatives considered:**
- Extending FeatureSection: Would require adding optional fields to `FeatureEntry` that only 6 of 12 entries use, and another layout branch. Rejected — violates single responsibility and bloats a shared component.
- Fully inline implementation in FeatureShowcase.tsx: Would duplicate the layout 6 times. Rejected — violates DRY.

### Decision 2: Separate data files vs. extending features.ts

**Chosen: Separate `showcase.ts` and `competitive.ts` data files.**

The showcase data is structurally different from `FeatureEntry` (requires cost, exactly 2 solutions, exactly 3 metrics, phone frame). The competitive data (quadrant, matrix, cost cards, standouts) has no overlap with any existing data model. Separate files keep concerns isolated and make content updates straightforward.

**Alternatives considered:**
- Inline data in page components: Would make pages long and content updates hard to find. Rejected.
- Extending `data/index.ts` barrel export: Accepted — new data files will be re-exported from the barrel.

### Decision 3: QuadrantGrid as reusable vs. page-specific

**Chosen: Component under `components/sections/competitive/QuadrantGrid.tsx` with a configurable interface.**

While currently only used once, the quadrant grid pattern is distinct enough to warrant its own component. The interface accepts quadrant entries (`label`, `title`, `weaknesses`, `advantage`) and center overlay props, making it reusable if needed for other comparison pages.

### Decision 4: Cost comparison styling approach

**Chosen: Match the static HTML's visual design using CSS variables where possible, with explicit light/dark overrides.**

The static HTML uses hardcoded hex values for cost cards (`#fff`, `#111827`, `#4B5563`). The React version will use `var(--surface)` and `var(--fg)` for the base theme, with `[data-theme="dark"]` overrides matching the static HTML's dark mode. The green "Best Value" border and badge will use `var(--green)`.

### Decision 5: Feature matrix uses existing ComparisonTable

**Chosen: Reuse `ComparisonTable` component with competitive positioning data.**

The ComparisonTable component already supports all needed cell types (check, cross, text), sticky headers, horizontal scroll, and dark mode. The 13-row × 5-column matrix maps directly to its interface. No modifications needed.

## Risks / Trade-offs

- **Matrix horizontal overflow on mobile** → `ComparisonTable` already wraps in `overflow-x: auto` with `-webkit-overflow-scrolling: touch` and min-width 900px. Accepted trade-off: scrollable tables are standard UX for comparison pages on mobile.
- **Quadrant responsiveness** → Static HTML already has mobile breakpoints (single column, center overlay becomes static block). Replicate these in the component.
- **Content parity with static HTML** → Some static HTML content uses inline HTML entities (`&mdash;`, `&rsquo;`). React JSX handles these natively. Validate visually against static HTML.
- **PhoneFrame mockup fidelity** → The existing PhoneFrame component renders abstract row bars. This is intentional — the static HTML uses the same abstract phone frames. No design fidelity loss.
- **FeatureShowcase nav uses 6 items while Features nav uses 12** → Same FeatureNav component, different item array. No risk.
