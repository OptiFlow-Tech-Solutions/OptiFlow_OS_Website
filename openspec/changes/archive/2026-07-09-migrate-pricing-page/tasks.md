## 1. Setup & Data

- [x] 1.1 Create `frontend/src/components/pricing/` directory
- [x] 1.2 Create `frontend/src/components/pricing/pricingData.ts` with plan constants (Starter: 49000/25000, Growth: 79000/40000, Scale: 149000/75000), comparison matrix rows (15 features across 3 sections), timeline steps (5 items), and FAQ items (7 Q&A pairs)
- [x] 1.3 Verify design tokens exist in `design-tokens.css` for all needed variables (--lime, --green, --teal, --accent, --border, --surface, --muted, --fg)

## 2. ROI Dashboard Component

- [x] 2.1 Create `ROIDashboard.tsx` with 5 team-size data points (10: ₹1.44L/₹49K, 25: ₹3.60L/₹49K, 50: ₹7.20L/₹79K, 100: ₹14.4L/₹1.49L, 200: ₹28.8L/₹1.49L) and savings values (66%, 86%, 89%, 90%, 95%)
- [x] 2.2 Implement proportional bar widths: `(value / maxValue) * 100` with 4% minimum, using CSS `width` style + transition
- [x] 2.3 Implement label positioning: inside bar (right: 6px) at ≥15% width, outside (translateX 100%) at <15%
- [x] 2.4 Implement hover tooltips showing traditional, OptiFlow, and save% values with 120ms fade transition
- [x] 2.5 Implement connector lines using `useRef` + `ResizeObserver` to calculate position between bar right edges, visible on hover
- [x] 2.6 Implement savings badges with staggered entrance animation (0/80/160/240/320ms delays) via IntersectionObserver
- [x] 2.7 Implement summary row (No Per-User Charges, Fixed Annual Pricing, Cloud Hosting Included)
- [x] 2.8 Add ARIA attributes: `role="region"`, `aria-label`, `role="table"`, `role="rowheader"`, `role="columnheader"`
- [x] 2.9 Handle `prefers-reduced-motion`: disable bar transitions, show badges immediately

## 3. Pricing Cards

- [x] 3.1 Create `PricingCard.tsx` component with props: `plan` (name), `price`, `setupFee`, `teamRange`, `businessValue` (5 items), `coreModules` (list), `featured`, `href`
- [x] 3.2 Style featured card with teal border, glow shadow, gradient background, and "Most Popular" badge
- [x] 3.3 Style standard cards with surface background, border, hover elevation (translateY -4px)
- [x] 3.4 Render three cards in Pricing.tsx using plan data constants

## 4. Comparison Matrix

- [x] 4.1 Create `ComparisonMatrix.tsx` rendering a 4-column grid (label + Starter/Growth/Scale) from matrix data
- [x] 4.2 Implement cell states: yes (checkmark SVG + "Included"), limited (info icon + text), no (em dash with muted styling)
- [x] 4.3 Implement section labels (Core Platform, Automation & Scale, Support) between row groups
- [x] 4.4 Wrap matrix in dark-background section matching HTML section-dark treatment
- [x] 4.5 Row hover highlight with subtle background transition (200ms)

## 5. ROI Calculator

- [x] 5.1 Create `ROICalculator.tsx` with two controlled range inputs (teamSize: 5-200 step 1, perUserCost: 199-5000 step 50)
- [x] 5.2 Implement `useMemo` derived values: traditionalAnnual, planSelection (by team-size thresholds), optiFlowTotal, savings, savingsPct, effectivePerUser
- [x] 5.3 Implement plan badge showing current plan name, annual price, and user range
- [x] 5.4 Implement cost breakdown with traditional (red), OptiFlow (green), savings (lime), and percentage
- [x] 5.5 Implement savings card with large lakh-format amount (e.g., "₹4.8L")
- [x] 5.6 Implement summary matrix (Team, Per-User, Plan, Effective/User) with live values
- [x] 5.7 Use `toLocaleString('en-IN')` for all monetary displays (Indian number format)
- [x] 5.8 Handle edge case: `Math.max(0, savings)` to prevent negative savings at low team/cost combos

## 6. Implementation Timeline

- [x] 6.1 Create `ImplementationTimeline.tsx` rendering 5 steps (Discovery, Setup, Configuration, Training, Go Live) with descriptions
- [x] 6.2 Style numbered circles with accent-to-teal gradient, floating animation (3s ease-in-out, staggered delays)
- [x] 6.3 Implement connecting lines between steps using CSS `::after` pseudo-elements with gradient, visible on IntersectionObserver
- [x] 6.4 Hover elevation: translateY(-6px), increased shadow, accent border
- [x] 6.5 Three metric cards below timeline (2-4 weeks, 90%+ adoption, Dedicated support)
- [x] 6.6 Responsive: 5→3 columns at 1024px, single column at 768px, no connectors on mobile

## 7. Pricing FAQ

- [x] 7.1 Create `PricingFAQ.tsx` with 7 Q&A items from the static HTML
- [x] 7.2 Implement accordion: click toggles open/close with chevron rotation, answer expands via grid-template-rows transition
- [x] 7.3 Use existing FAQ styling pattern from core.css (`.faq-item`, `.faq-question`, `.faq-answer` classes)

## 8. Page Assembly

- [x] 8.1 Update `Pricing.tsx` to compose all sections: Hero (incl. ROIDashboard), Philosophy cards, TrustBar, Pricing Cards, ComparisonMatrix, ROICalculator, ImplementationTimeline, Security section, PricingFAQ, CTASection
- [x] 8.2 Wire up "Compare Plans" hero CTA to scroll to pricing cards section
- [x] 8.3 Style hero section: two-column grid (text LHS, dashboard RHS), trust badges row, staggered entrance animation
- [x] 8.4 Style philosophy section: 4-card grid (Unlimited Users, Predictable Budgeting, Cloud Hosting Included, Updates Included)
- [x] 8.5 Style security section: dark background, 3 icon cards (Role-Based Access, Audit Logs, Secure Infrastructure)
- [x] 8.6 Add `<SEOHead>` with pricing page title and description

## 9. Validation

- [x] 9.1 Run `cd frontend && npm run build` (tsc + vite build) and fix any type errors
- [x] 9.2 Verify ROI bar chart proportions correct (max value = 100%, others proportional)
- [x] 9.3 Verify calculator: team slider 5→200 changes plan Starter→Growth→Scale at correct thresholds
- [x] 9.4 Verify calculator: per-user cost ₹199→₹5000 increases savings proportionally
- [x] 9.5 Verify calculator: savings never negative (`Math.max(0, ...)`)
- [x] 9.6 Verify "Most Popular" badge only on Growth card
- [x] 9.7 Verify comparison matrix has all 15 features across 3 sections with correct checkmarks
- [x] 9.8 Verify FAQ accordion opens/closes on click with smooth transition
- [x] 9.9 Verify dark mode: toggle theme and confirm all sections adapt correctly
- [x] 9.10 Verify responsive: check 1024px, 768px, 480px breakpoints
