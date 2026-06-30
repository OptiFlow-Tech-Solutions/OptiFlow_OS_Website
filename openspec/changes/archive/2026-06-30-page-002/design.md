# Design: PAGE-002 Problem & Solutions

## Architecture

Single-page static HTML with 10 content sections connected by a narrative thread: problem diagnosis → cost quantification → solution introduction → transformation proof.

## Section Flow

| # | Section | Purpose | Visual |
|---|---------|---------|--------|
| 01 | Hero | Hook with "How Many Tasks Did Your Team Miss Today?" + chaos bubble animation | 2-col grid: copy left, floating bubbles right |
| 02 | Pain Points | Animated carousel of 8 rotating pain points | Full-width surface band |
| 02B | Chaos Map | Operational chaos sources funneling into OptiFlow OS | 5-col flow diagram (sources → chaos → resolve) |
| 03 | Trust Bar | Social proof metrics | 4-column trust metrics |
| 04 | Industry Problems | 6 cards with real scenarios and ₹ impact | 3-column card grid |
| 05 | WhatsApp + Excel | Chat mockup + cost-of-chaos dissection | 2-column (mockup left, analysis right) |
| 06 | Cost of Doing Nothing | Quantified losses | 3 stat blocks on dark section background |
| 07 | Solution Flow | Linear transformation diagram + module tags | 3-node flow with arrow connectors |
| 08 | People vs Process | Side-by-side attribute comparison | 2-column PvP grid |
| 09 | Before/After | Compact comparison | 2-column compact compare with dot indicators |
| 10 | CTA | Conversion close | Gradient CTA section with dual CTAs |

## Design Tokens Used

All colors use CSS custom properties from core.css. No hardcoded hex values in production output.

- **Accent**: `var(--accent)` for trust numbers, module tags, hero-node label
- **Teal**: `var(--teal)` for hook badge, industry tags, roi-lines, module tags
- **Green**: `var(--green)` for success states, trust checkmarks, process-driven highlights
- **Danger**: `var(--danger)` for impact tags, before/danger states, chaos indicators
- **Muted**: `var(--muted)` for secondary text, labels, sub-text

## Responsive Strategy

- `max-width: 1024px` — Hero stack, solution flow stack, chaos map stack, arrow rotation (90deg), 2-col cards
- `max-width: 768px` — Stats stack to 1-col, compact compare stack, trust 2-col
- `max-width: 480px` — Trust 1-col

## Dark Mode

Full `[data-theme="dark"]` overrides for all 10 sections including card surfaces, chat mockup, stat blocks, comparison panels, and chaos bubbles. All use `color-mix()` with CSS variables — no hardcoded dark hex values.

## Page-Specific Script

Single `setInterval`-based pain-point rotator cycling 8 items every 3s, paused on `document.hidden`. All other behaviors (scroll reveal, stagger, sticky CTA, theme toggle, nav scroll) delegated to core.js.

## Performance

- `prefers-reduced-motion: reduce` disables all chaos-bubble, pp-item, and core-tag animations
- CSS-only animations (floatChaos, pulseWarn) — zero JavaScript animation overhead
- Pain-point rotator uses `document.hidden` guard for visibility pause
