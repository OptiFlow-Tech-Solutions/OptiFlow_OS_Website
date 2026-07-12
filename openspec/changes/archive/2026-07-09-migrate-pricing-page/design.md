## Context

The pricing page is currently a 1043-line static HTML file (`src/pages/pricing.html`) with embedded vanilla JS for the ROI calculator and bar chart animations. The React frontend (`frontend/`) already has a 14-line `Pricing.tsx` stub, shared components (`Section`, `Container`, `Card`, `Button`, `TrustBar`, `CTASection`), design tokens in `design-tokens.css`, and Tailwind 4.

The page consists of 10 logical sections. Four are reusable shared components already (`TrustBar`, `CTASection`). Six require new pricing-specific components.

## Goals / Non-Goals

**Goals:**
- Full fidelity: content, math, and visual behavior match the static HTML exactly
- Component decomposition: each logical section becomes a focused React component
- CSS bars over chart library: no new dependency for the bar chart
- Real-time calculator: sliders update all derived values immediately via React state
- Dark mode: all new components respect `[data-theme="dark"]` via existing design tokens

**Non-Goals:**
- Monthly/yearly pricing toggle (HTML doesn't have one)
- Server-side SSR for the pricing page
- A/B testing infrastructure for plan variants
- Adding recharts or any chart library

## Decisions

### Decision 1: CSS width bars over chart library

**Chosen:** Use `style={{ width: `${pct}%` }}` inline styles on divs, mirroring the HTML approach.

**Alternatives considered:**
- *Recharts (react-chart):* Adds ~200KB. Overkill for 5 horizontal bars with no axes/labels. The HTML already works with CSS transitions.
- *Canvas-based:* More complex, lost accessibility (the HTML bars have `role="table"` + ARIA labels).

**Rationale:** Ponytail ladder — CSS transitions already work, no library needed. The bar chart is a comparison visual, not a general-purpose chart. If future pages need charts, add recharts then.

### Decision 2: Single Pricing.tsx page composes all sections

**Chosen:** `Pricing.tsx` imports and arranges each section component. No route children.

**Rationale:** Matches the existing pattern — `Home.tsx` does the same with its 13 sections. The pricing page is a single route, not a mini-app.

### Decision 3: Bar connector lines use ResizeObserver + useRef

**Chosen:** Each `ComparisonRow` gets a ref. A `useEffect` with `ResizeObserver` calculates connector line position on resize/hover. Alternative: CSS-only positioning failed in the HTML version due to the bars being CSS-percentage-based and labels overflowing.

**Rationale:** The HTML version uses `getBoundingClientRect()` on every hover + resize. React-ifying this with refs and a single ResizeObserver is cleaner and matches the existing `useParallax` pattern.

### Decision 4: Calculator math uses useMemo

**Chosen:** Derived values (traditionalAnnual, planInfo, savings, effectivePerUser) computed via `useMemo` reacting to the two slider states.

**Rationale:** The calculator has 8+ derived values from 2 inputs. `useMemo` avoids recomputation on unrelated re-renders while keeping the logic colocated and readable.

### Decision 5: Plan data and comparison matrix data are static constants

**Chosen:** Plan pricing and feature matrix rows defined as `const` arrays in the component files (or a sibling `pricingData.ts`). No props for plan data — these don't change.

**Rationale:** No API backend. Data is static business logic. Colocating with the component keeps it simple. Separate data file only if >100 lines of data (the comparison matrix rows are ~25 entries).

### Decision 6: Animations use CSS classes + IntersectionObserver

**Chosen:** Staggered entrance animations via CSS `animation-delay` on `nth-child` selectors + IntersectionObserver to trigger when sections enter viewport.

**Rationale:** The existing `useScrollReveal` hook and `reveal`/`stagger-*` CSS classes already handle this. The bar chart animation uses CSS transitions on `width`. No framer-motion needed.

## Risks / Trade-offs

- **[Chart precision at boundaries]:** Bars use `Math.max(4, (value / max) * 100)` for minimum width. Labels reposition at <15%. This logic is from the HTML — port it directly.
  - *Mitigation:* Use the exact same MIN_WIDTH_PCT (4) and label threshold (15) from the HTML. Test with extreme values (5 users at ₹199 vs 200 users at ₹5,000).

- **[ResizeObserver performance]:** Connector lines recalculate on every resize. With only 5 rows, negligible.
  - *Mitigation:* Throttle if needed, but 5 rows won't cause issues.

- **[Dark mode consistency]:** The HTML has ~20 dark-mode overrides in a `[data-theme="dark"]` block. These migrate to Tailwind `dark:` variants or CSS custom property references.
  - *Mitigation:* Use existing design tokens (`var(--border)`, `var(--surface)`, `var(--fg)`) which already have dark mode variants in `design-tokens.css`. Only add component-specific overrides where tokens don't cover.
