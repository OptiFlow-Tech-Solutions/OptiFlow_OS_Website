## Context

The static `home.html` (677 lines, 13 sections, 7 JavaScript behaviors) is the most-visited page on optiflow.in. The React frontend currently has a 14-line placeholder in `Home.tsx`. All shared infrastructure (Section, Card, Button, Nav, Footer, PageLayout, ThemeProvider, GlobalStyles, routes, Vite config) is already built and proven across other pages.

This migration is the largest single-page port in the project. It establishes the pattern for the remaining 13 pages and must demonstrate pixel-perfect visual parity at 5 breakpoints.

**Constraints:**
- Must use existing shared components (Section, Card, Button) per `shared-components` spec
- Must match static HTML pixel-for-pixel including all animations
- No new dependencies (the project has only React 19 + React Router 7.5 + Tailwind 4.3)
- Must support dark mode via `[data-theme="dark"]` attribute
- Must respect `prefers-reduced-motion: reduce`

## Goals / Non-Goals

**Goals:**
- Replace placeholder Home.tsx with a full 13-section home page
- Port all 7 JavaScript behaviors (typewriter, mouse glow, card tilt, dashboard parallax, exit intent, scroll reveal, FAQ accordion) to React hooks
- Achieve visual parity with static HTML at 5 breakpoints (1200, 1024, 768, 480, 360)
- Add scroll-triggered counter animation for trust metrics (net-new feature present in acceptance criteria)
- Establish a reusable pattern for page-specific CSS injection (HomeStyles component)
- Keep all text content identical to static HTML

**Non-Goals:**
- Content changes or copy updates (pure migration)
- Adding new sections or features beyond what exists in home.html
- Backend integration (static for migration phase)
- Internationalization, analytics changes, or SEO restructure
- Migration of remaining 13 pages (scope is home page only)
- Adding a motion/animation library (zero new dependencies)

## Decisions

### Decision 1: 13 individual section components (not a configurable card grid)

**Chosen:** Each of the 13 sections gets its own component file in `frontend/src/components/sections/`.

**Rationale:** While 7 sections share a grid-of-cards pattern (problems, modules, features, industries, testimonials), each has unique CSS classes, icon treatments, badge styles, and hover behaviors. Abstracting into a generic `CardGrid` would require a complex variant/config system that adds indirection without reducing line count meaningfully. The shared Card, Section, and Button components already eliminate the structural repetition. The remaining per-section uniqueness (specific icons, colors, text content) is content, not boilerplate.

**Alternatives considered:**
- Single `CardGrid` with `variant` prop: Would require ~15 variant-specific CSS blocks, a data-driven config object mapping each variant to icon sets and styling, and complex TypeScript types. Added abstraction cost exceeds duplication savings.

### Decision 2: HomeStyles component with injected `<style>` tag

**Chosen:** Page-specific CSS lives in a `HomeStyles.tsx` component that renders a `<style>` tag, following the existing `GlobalStyles.tsx` pattern.

**Rationale:** The home page has ~250 lines of CSS that is truly page-specific (hero gradients, dashboard mockup, floating widget positions, card tilt perspective, exit overlay). This is not reusable across pages. The existing GlobalStyles.tsx already uses this pattern for global styles. Keeping the same approach avoids introducing a new CSS mechanism (CSS Modules, styled-components) and keeps all dependencies at zero.

HomeStyles is rendered inside the Home page component, so its styles are removed from the DOM when navigating away — no style leakage to other pages.

**Alternatives considered:**
- **CSS Modules (Home.module.css):** Would require Vite CSS modules config, introduces a new styling paradigm in a project already using 4 CSS approaches, breaks the established injected `<style>` convention.
- **Tailwind-only:** Tailwind cannot express radial gradients, CSS animations/keyframes, perspective transforms, backdrop-filter, CSS masks, or complex pseudo-element decorations. The hero background alone requires `radial-gradient()` and `::before`/`::after` pseudo-elements.

### Decision 3: Individual animation hooks (not inline effects, not monolithic hook)

**Chosen:** One file per hook: `useTypewriter`, `useMouseGlow`, `useCardTilt`, `useParallax`, `useCountUp`, `useScrollReveal`.

**Rationale:** Each hook handles a single concern with a clean interface. The rAF-throttling pattern is already established in the existing `useScrollPosition` hook. Individual hooks are independently testable, and the hook directory already exists at `frontend/src/hooks/`. Even though these hooks are currently used only by the home page, they represent the start of an animation hook library that other pages may adopt.

**Alternatives considered:**
- **Inline useEffect in components:** Would make HeroSection 200+ lines with mixed concerns (layout + animation logic). Hooks are a well-understood React pattern and don't add cognitive overhead.
- **Single `useHomeAnimations` hook:** Monolithic, hard to test individual behaviors, couples all animations to a single lifecycle.

### Decision 4: Scroll reveal via IntersectionObserver hook, not vanilla JS

**Chosen:** A `useScrollReveal` hook using IntersectionObserver to add the `.visible` class to `.reveal` elements, compatible with the existing CSS in GlobalStyles.tsx.

**Rationale:** The original home.html relies on `core.js` (loaded via `<script src="/assets/js/core.js">`) for scroll reveal. The React app already has GlobalStyles.tsx with the `.reveal` / `.stagger-*` CSS classes. A React hook that observes elements with these classes and toggles `.visible` is the idiomatic React approach. No external library needed.

### Decision 5: Inline content data (not extracted JSON/YAML)

**Chosen:** All card content (headings, descriptions, ROI text, icons) is written directly in JSX, not in external data files.

**Rationale:** This is a content migration, not a CMS build. The content is unlikely to change independently of the component structure. External data files add indirection without benefit at this stage. If content becomes dynamic later, extraction is straightforward.

**Alternatives considered:**
- **Data files (JSON/YAML):** Premature abstraction. The structure differs per section (problems have impact+ROI, modules have outcome+benefit, features have ROI, industries have challenge+solution). No single data schema fits all. Would need 5+ separate interfaces.

### Decision 6: SVG icons inline in JSX (not icon library)

**Chosen:** Icons from home.html are copied as inline SVG JSX elements. No icon library (lucide-react, heroicons, etc.) is added.

**Rationale:** Zero new dependencies. The project intentionally keeps dependencies minimal (3 production deps). The existing SVGs in home.html are simple, lightweight, and already match the design. Adding an icon library for ~30 icons used on one page would increase bundle size for no functional gain.

## Risks / Trade-offs

- **Animation timing drift:** rAF-based animations may differ subtly across React renders vs vanilla DOM manipulation. → Mitigation: Use identical rAF throttling pattern from existing `useScrollPosition`, test side-by-side.
- **HomeStyles injection on every render:** The `<style>` tag re-injects on mount. → Mitigation: HomeStyles is a separate component rendered once; React reconciles the `<style>` content efficiently. PonyTail: this is how GlobalStyles already works across the entire app.
- **Counter animation scope creep:** `useCountUp` is net-new work not present in the original HTML. → Mitigation: Keep it simple (requestAnimationFrame + IntersectionObserver, no easing curves, ~30 lines). If it blocks migration, defer as separate task.
- **Mobile parity gaps:** Floating widgets, mouse glow, and card tilt are desktop-only behaviors. → Mitigation: Already handled in home.html responsive CSS — port the same media query rules.
- **Bundle size increase:** 13 section components + 6 hooks + HomeStyles adds ~30-40KB uncompressed. → Acceptable trade-off for the primary landing page.

## Open Questions

None. All design decisions are resolved in this document.
