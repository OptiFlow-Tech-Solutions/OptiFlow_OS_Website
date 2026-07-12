## 1. Animation Hooks

- [x] 1.1 Create `useScrollReveal` hook — IntersectionObserver that adds `.visible` class to `.reveal` elements, compatible with existing `.stagger-3`/`.stagger-4`/`.stagger-5` CSS classes in GlobalStyles
- [x] 1.2 Create `useTypewriter` hook — rAF-based type/delete cycle through 5 phrases, 60ms type speed, 30ms delete speed, 2200ms hold, pauses on tab blur, returns `{ text, isCursorVisible }`
- [x] 1.3 Create `useMouseGlow` hook — rAF-throttled mouse position tracking within container, returns `{ x, y, isActive }`
- [x] 1.4 Create `useParallax` hook — rAF-throttled global mousemove → translateX/Y (max 16px/12px), returns `{ transform }`
- [x] 1.5 Create `useCardTilt` hook — rAF-throttled mousemove on container → rotateX/rotateY (max 12deg), resets on mouseleave, returns a ref callback
- [x] 1.6 Create `useCountUp` hook — IntersectionObserver-triggered counter animation with rAF, supports prefix/suffix formatting, fires once, respects reduced-motion

## 2. Home-Specific Styles

- [x] 2.1 Create `HomeStyles.tsx` component — injected `<style>` tag with all home-specific CSS matching home.html `<style>` block: hero background/gradient/noise, hook badge, typewriter cursor, mouse glow, hero grid, dashboard mockup (KPI cards, chart, table, floating widgets with float animations), trust bar (metrics, logo scroll), problem cards, impact cards, solution stages, module cards, steps connector line, feature cards, industry cards, comparison table extras, testimonial extras, card tilt, WhatsApp float, exit overlay, and all responsive overrides at 1024/768/480px
- [x] 2.2 Add `[data-theme="dark"]` overrides for all home-specific styles matching home.html dark mode CSS
- [x] 2.3 Add `@media (prefers-reduced-motion: reduce)` overrides disabling animations, matching home.html patterns

## 3. Section Components — Simple (static content only)

- [x] 3.1 Create `TrustBar.tsx` — 4 metrics + scrolling industry logo marquee with CSS infinite animation
- [x] 3.2 Create `SolutionFlow.tsx` — 3-stage vertical flow (Chaos → OptiFlow → Excellence) with module pill tags
- [x] 3.3 Create `HowItWorks.tsx` — 4 step circles with gradient connector line, description and outcome per step
- [x] 3.4 Create `WhyOptiflowComparison.tsx` — 9-row comparison table (Traditional vs OptiFlow) with green check marks, dark section background
- [x] 3.5 Create `CTASection.tsx` — heading, lead, 2 buttons, 4 trust bullets using `.cta-section` styling from GlobalStyles
- [x] 3.6 Create `FAQPreview.tsx` — 5 FAQ accordion items with expand/collapse behavior, "View All FAQs" link
- [x] 3.7 Create `TestimonialSection.tsx` — 3 testimonial cards (quote, avatar, author, outcome) + 4-metric stats bar

## 4. Section Components — Card Grids (shared pattern)

- [x] 4.1 Create `ProblemSection.tsx` — section header + 3x2 grid of 6 problem cards (icon, description, impact badge, ROI)
- [x] 4.2 Create `ProductSnapshot.tsx` — section header + 4x2 grid of 8 module cards (gradient icon, description, outcome)
- [x] 4.3 Create `FeatureSection.tsx` — section header + 4x2 grid of 8 feature cards (icon mark, description, ROI)
- [x] 4.4 Create `IndustrySection.tsx` — section header + 4x2 grid of 7 industry cards (icon, challenge, solution)

## 5. Section Components — Complex (with animations)

- [x] 5.1 Create `HeroSection.tsx` — hook badge, typewriter h1, lead, 2 CTA buttons, 4 trust bullets, dashboard mockup (KPI cards, SVG chart, task table, 3 floating widgets), mouse glow overlay, hero entry reveal staggered animation. Uses `useTypewriter`, `useMouseGlow`, `useParallax`
- [x] 5.2 Create `CostOfInaction.tsx` — dark section background, section header, 5 impact cards with `useCardTilt` 3D hover effect

## 6. Overlay Components

- [x] 6.1 Create `ExitOverlay.tsx` — fixed backdrop-blur overlay triggered on mouseleave after 400px scroll, closes on button/backdrop click, fires only once per session
- [x] 6.2 Create `WhatsAppFloat.tsx` — fixed floating button linking to `https://wa.me/{{WHATSAPP}}`, opens in new tab, positioned bottom-right

## 7. Integration

- [x] 7.1 Rewrite `Home.tsx` — import and compose all 13 section components + HomeStyles + ExitOverlay + WhatsAppFloat + ScrollReveal hook, render in order matching home.html structure
- [x] 7.2 Add `useScrollReveal` call in Home.tsx to initialize scroll-triggered reveal animations for all sections
- [x] 7.3 Add `useCountUp` to TrustBar metrics for counter animation on scroll-into-view

## 8. Verification

- [x] 8.1 Run `npm run frontend:build` — verify TypeScript compilation with zero errors
- [x] 8.2 Run `npm run frontend:dev` — visually inspect all 13 sections at 5 breakpoints (1200, 1024, 768, 480, 360) for layout correctness
- [x] 8.3 Test dark mode toggle — verify all sections render correctly in dark theme
- [x] 8.4 Test animations: typewriter cycles 5 phrases, mouse glow tracks cursor, card tilt transforms on hover, dashboard parallax responds to mouse, exit overlay fires on mouseleave, scroll reveal triggers on scroll
- [x] 8.5 Test reduced motion: verify animations disable when `prefers-reduced-motion: reduce` is active
- [x] 8.6 Verify all CTAs use `<Button as={Link}>` pattern and link to correct routes
- [x] 8.7 Verify all sections use `<Section>` component (no raw `<section className="section">`)
- [x] 8.8 Verify all cards use `<Card>` component (no raw `<div className="card">`)
- [x] 8.9 Run `npm run validate` — confirm no regressions in static site validation
