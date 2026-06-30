# Design: PAGE-001 — Home Page

## Page Layout

```
┌──────────────────────────────────────────┐
│  NAV (sticky, glass blur on scroll)      │
├──────────────────────────────────────────┤
│  S01: HERO                               │
│  ├─ Hook badge + typewriter headline     │
│  ├─ Lead paragraph + CTA buttons         │
│  ├─ Trust signals (4 check items)        │
│  └─ Dashboard mockup (glass card)        │
├──────────────────────────────────────────┤
│  S02: TRUST BAR                          │
│  ├─ 4 animated counter stats             │
│  └─ Infinite logo scroll                 │
├──────────────────────────────────────────┤
│  S03: THE PROBLEM (6 problem cards)      │
├──────────────────────────────────────────┤
│  S04: COST OF INACTION (dark section)    │
│  └─ 5 impact cards with tilt effect      │
├──────────────────────────────────────────┤
│  S05: SOLUTION                           │
│  ├─ Before → OptiFlow → After stages     │
│  └─ Module pill tags                     │
├──────────────────────────────────────────┤
│  S06: PRODUCT SNAPSHOT (8 module cards)  │
├──────────────────────────────────────────┤
│  S07: HOW IT WORKS (4 steps)             │
├──────────────────────────────────────────┤
│  S08: FEATURES (8 feature cards)         │
├──────────────────────────────────────────┤
│  S09: INDUSTRIES (7 industry cards)      │
├──────────────────────────────────────────┤
│  S10: WHY OPTIFLOW (comparison table)    │
├──────────────────────────────────────────┤
│  S11: TESTIMONIALS (3 quotes + stats)    │
├──────────────────────────────────────────┤
│  S12: FINAL CTA (dark section)           │
├──────────────────────────────────────────┤
│  S13: FAQ PREVIEW (5 accordion items)    │
├──────────────────────────────────────────┤
│  FOOTER (5-column brand footer)          │
├──────────────────────────────────────────┤
│  Sticky CTA, WhatsApp float,             │
│  Scroll-to-top, Exit-intent popup        │
└──────────────────────────────────────────┘
```

## Design Tokens Used

- Colors: all via `var(--*)` CSS variables
- Typography: Inter (display/body), JetBrains Mono (counters)
- Hero background: `#F8FAFC` light / `#0F172A` dark
- Accent gradient: `#1B4D81` → `#278D9F`
- Green/Lime for success indicators

## Interactive Features

| Feature | Implementation |
|---------|---------------|
| Typewriter headline | JS, 5 rotating phrases, pauses on tab blur |
| Mouse glow | 700px radial gradient tracking cursor |
| Dashboard parallax | CSS transform on mousemove |
| Card tilt | 3D perspective transforms |
| Scroll reveal | IntersectionObserver via core.js |
| Animated counters | easeOutExpo via core.js |
| Exit-intent popup | mouseleave at top of viewport |
| FAQ accordion | CSS grid transition via core.js |
| Sticky CTA | Scroll-based visibility via core.js |
| Theme toggle | localStorage persisted |
