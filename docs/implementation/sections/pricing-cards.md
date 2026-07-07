# Pricing Cards
- **Status:** partial | **Used On:** pricing.html
- **Priority:** medium

## Feature IDs
- UX-004 — style extraction

## Pending Improvements
- [ ] Extract card styles to `core.css` (UX-004)

## Dependencies / Implementation Notes
3 plan cards (Starter / Growth / Scale) in a 3-column grid. Each card contains: plan name, price, feature list with checkmarks, CTA button. The middle/recommended plan has a highlight/accent treatment. Styles currently inlined in `pricing.html` — needs extraction to `.pricing-card` class in `core.css`.
