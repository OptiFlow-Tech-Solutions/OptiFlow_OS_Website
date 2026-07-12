## 1. Foundation — Design Token Reconciliation

- [x] 1.1 Update `design-tokens.css` `:root` block: replace all Oklch color values with DESIGN.md hex values (`--accent: #1B4D81`, `--teal: #278D9F`, `--green: #54B89A`, `--lime: #99D271`, `--bg: #F8FAFC`, `--surface: #FFFFFF`, `--fg: #0F172A`, `--muted: #475569`)
- [x] 1.2 Update `design-tokens.css` `[data-theme="dark"]` block: replace Oklch dark-mode overrides with hex equivalents matching DESIGN.md intent
- [x] 1.3 Recalculate soft/accent tokens (`--accent-soft`, `--teal-soft`, etc.) using `color-mix()` with hex inputs
- [x] 1.4 Update font tokens: `--font-display` and `--font-body` to use `'Inter'` as primary; update `--font-mono` to use `'JetBrains Mono'`
- [x] 1.5 Add Inter font loading via `<link>` in `frontend/index.html` (weights 400, 500, 600, 700; `font-display: swap`)
- [x] 1.6 Update type scale tokens: replace `clamp()` values with fixed px DESIGN.md values (`--fs-h1: 52px` through `--fs-caption: 14px`)
- [x] 1.7 Add responsive media queries for type scale reduction at 1024px and 768px breakpoints
- [x] 1.8 Update `--container` from `1200px` to `1320px`
- [x] 1.9 Remove the `@supports (color: oklch(...))` fallback block (no longer needed)
- [x] 1.10 Run `npm run frontend:dev` and visually verify the token changes render correctly in both light and dark themes

## 2. Style Consistency — Eliminate Competing Patterns

- [x] 2.1 Audit all 15 page files for inline `style={{}}` objects containing layout/color properties; document each instance
- [x] 2.2 Audit all page files for JSX-injected `<style>{}` blocks; document each instance
- [x] 2.3 Convert Pricing page inline styles to Tailwind utility classes
- [x] 2.4 Extract Pricing page `<style>{}` block into `Pricing.css`, import at page level
- [x] 2.5 Convert ProblemSolutions page inline styles to Tailwind utility classes
- [x] 2.6 Audit and convert inline styles on Contact, FAQ, DemoBooking, Features, FeatureShowcase, WhyOptiFlow, ProductOverview, Newsletter, CompetitivePositioning, PrivacyPolicy, Terms, NotFound pages
- [x] 2.7 Move `HomeStyles.tsx` CSS to `Home.css`, update Home.tsx to import the CSS file, remove `HomeStyles.tsx`
- [x] 2.8 Add ESLint rule to flag inline `style={{}}` objects (with allowlist for dynamic values like parallax transforms)
- [x] 2.9 Run `npm run lint` and fix all flagged inline style violations

## 3. UI Audit — Page-by-Page Against Originals

- [x] 3.1 Audit Home page against `src/pages/home.html` and DESIGN.md; document all issues
- [x] 3.2 Audit ProblemSolutions page against HTML original; document all issues
- [x] 3.3 Audit ProductOverview page against HTML original; document all issues
- [x] 3.4 Audit Features page against HTML original; document all issues
- [x] 3.5 Audit FeatureShowcase page against HTML original; document all issues
- [x] 3.6 Audit WhyOptiFlow page against HTML original; document all issues
- [x] 3.7 Audit Pricing page against HTML original; document all issues
- [x] 3.8 Audit Newsletter page against HTML original; document all issues
- [x] 3.9 Audit FAQ page against HTML original; document all issues
- [x] 3.10 Audit Contact page against HTML original; document all issues
- [x] 3.11 Audit DemoBooking page against HTML original; document all issues
- [x] 3.12 Audit PrivacyPolicy page against HTML original; document all issues
- [x] 3.13 Audit Terms page against HTML original; document all issues
- [x] 3.14 Audit CompetitivePositioning page against HTML original; document all issues
- [x] 3.15 Audit NotFound page against `src/pages/404.html`; document all issues
- [x] 3.16 Run the React app and check browser console for errors across all pages; document every error and warning

## 4. Shared Component Polish

- [x] 4.1 Add CSS transitions to Button component: `background-color`, `border-color`, `box-shadow`, `transform` with `var(--transition-base)` and `var(--ease-out)`
- [x] 4.2 Add active state to Button: `transform: scale(0.97)` on `:active`
- [x] 4.3 Add hover transition to Card component: smooth `box-shadow` and `transform` elevation
- [x] 4.4 Add focus transition to Input component: `border-color` and `box-shadow` on `:focus-visible`
- [x] 4.5 Add dropdown animation to Nav component: `opacity` + `translateY()` on Resources dropdown
- [x] 4.6 Verify Section component `reveal` prop integrates with existing useScrollReveal hook
- [x] 4.7 Verify all shared components render correctly with new design tokens

## 5. Page Fixes — Home Page

- [x] 5.1 Fix typewriter text color: remove hardcoded `rgb(239, 68, 68)`, use `highlight-gradient` class with brand gradient
- [x] 5.2 Fix HeroSection layout: ensure hero grid, container, and responsive breakpoints work with 1320px container
- [x] 5.3 Fix TrustBar: verify metrics grid, logo scroll animation with gradient mask
- [x] 5.4 Fix ProblemSection: verify 3-column grid, card styling, dark mode
- [x] 5.5 Fix CostOfInaction: verify 5-column grid, card tilt, dark mode background
- [x] 5.6 Fix SolutionFlow: verify chaos→OptiFlow→excellence stages, gradient, arrows
- [x] 5.7 Fix ProductSnapshot: verify 4-column module grid, icons, benefit tags
- [x] 5.8 Fix HowItWorks: verify 4-step layout, gradient connector line, step number hover
- [x] 5.9 Fix FeatureSection: verify 4-column feature grid, icons, ROI tags
- [x] 5.10 Fix IndustrySection: verify 4-column industry grid, icons
- [x] 5.11 Fix WhyOptiflowComparison: verify comparison table, dark mode column colors
- [x] 5.12 Fix TestimonialSection: verify card layout, avatar gradient
- [x] 5.13 Fix CTASection: verify layout, button styling, dark mode
- [x] 5.14 Fix FAQPreview: verify accordion behavior, icon rotation
- [x] 5.15 Fix ExitOverlay: verify backdrop blur, entrance animation, close button
- [x] 5.16 Fix WhatsAppFloat: verify positioning, hover scale, mobile repositioning

## 6. Page Fixes — All Other Pages

- [x] 6.1 Fix ProblemSolutions: hero, pain carousel, chaos map, industry cards, WhatsApp mockup, cost stats, solution flow, comparison table
- [x] 6.2 Fix ProductOverview: module spotlight, demo tabs, panel section, workflow engine, architecture diagram
- [x] 6.3 Fix Features: all 11 feature sections, feature navigation, ecosystem hub, dashboard preview
- [x] 6.4 Fix FeatureShowcase: all 6 transformation sections, before/after cards, phone frame
- [x] 6.5 Fix WhyOptiFlow: hero typewriter, problem cards, designer cards, timeline, counters, comparison table, testimonials
- [x] 6.6 Fix Pricing: hero with ROI dashboard, pricing cards, comparison matrix, ROI calculator, implementation timeline, FAQ, CTA
- [x] 6.7 Fix Newsletter: layout, form, content sections
- [x] 6.8 Fix FAQ: accordion categories, search, self-service tools
- [x] 6.9 Fix Contact: form validation, office info, channel cards, response promise
- [x] 6.10 Fix DemoBooking: form, calendar widget, timeline, benefit cards, FAQ accordion
- [x] 6.11 Fix PrivacyPolicy: typography, content sections, readability
- [x] 6.12 Fix Terms: typography, content sections, readability
- [x] 6.13 Fix CompetitivePositioning: quadrant grid, feature matrix, cost comparison
- [x] 6.14 Fix NotFound (404): layout, illustration, navigation links

## 7. Responsive Verification

- [x] 7.1 Verify all 15 pages at 320px viewport: no horizontal overflow, readable text
- [x] 7.2 Verify all 15 pages at 480px viewport: single-column grids, stacked cards, readable typography
- [x] 7.3 Verify all 15 pages at 768px viewport: 2-column grids where appropriate, hamburger nav, correct padding
- [x] 7.4 Verify all 15 pages at 1024px viewport: desktop transitions, correct grid columns
- [x] 7.5 Verify all 15 pages at 1200px and 1440px viewports: max-width container, centered content
- [x] 7.6 Fix any responsive issues found in verification steps 7.1-7.5
- [x] 7.7 Verify Nav mobile drawer: opens on hamburger click, closes on link click, closes on Escape
- [x] 7.8 Verify StickyCTA and WhatsAppFloat: correct positioning at all breakpoints

## 8. Animation & Micro-Interactions

- [x] 8.1 Add hover transitions to all Button instances (primary, secondary, outline)
- [x] 8.2 Add hover elevation to all Card instances
- [x] 8.3 Add dropdown open/close animation to Nav Resources menu
- [x] 8.4 Add focus ring transition to all Input components
- [x] 8.5 Add hover underline animation to all nav links
- [x] 8.6 Add fade-in animation to page sections on scroll (verify useScrollReveal hook works everywhere)
- [x] 8.7 Verify card tilt, mouse glow, parallax, and typewriter hooks still function
- [x] 8.8 Add hover scale to social media icons in Footer
- [x] 8.9 Verify all animations respect `prefers-reduced-motion: reduce`

## 9. Architecture Cleanup

- [x] 9.1 Extract duplicated pricing card patterns into shared `PricingCard` (verify only Pricing page uses it; leave if single-use)
- [x] 9.2 Extract duplicated comparison table patterns into shared `ComparisonTable` component
- [x] 9.3 Remove unused components, hooks, and data exports
- [x] 9.4 Verify all barrel exports (`index.ts` files) are accurate and complete
- [x] 9.5 Remove dead CSS from `global-ui.css` that duplicates Tailwind utilities

## 10. Verification & Quality Gates

- [x] 10.1 Run `npm run frontend:build` — verify zero TypeScript errors and successful Vite build
- [x] 10.2 Run `npm run lint` in frontend — verify zero lint errors (ESLint + stylelint)
- [x] 10.3 Navigate all 15 pages in browser — verify zero console errors
- [x] 10.4 Run Lighthouse audit on key pages (Home, Pricing, DemoBooking) — verify accessibility score 90+
- [x] 10.5 Run existing Playwright E2E tests — verify all pass
- [x] 10.6 Side-by-side comparison of all 15 React pages against original HTML — verify React version matches or exceeds original
- [x] 10.7 Verify dark mode on all 15 pages — correct colors, contrast, readability
- [x] 10.8 Verify all interactive elements work: nav links, CTAs, forms, accordions, modals, WhatsApp float, exit overlay
- [x] 10.9 Verify SEO: all 15 pages have correct `<title>`, `meta description`, Open Graph tags, and canonical URLs
- [x] 10.10 Verify all links in Nav, Footer, and page content resolve correctly (no 404s within the SPA)
