## Why

The FAQ page currently offers 42 static questions across 4 categories with search. Users who don't find their answer have only two options: book a demo or contact support. Adding self-service capabilities reduces support ticket volume, improves user satisfaction, and converts FAQ visitors into informed prospects who are closer to purchase.

## What Changes

- Add a "Help Yourself" self-service toolbar at the top of the page with quick-access cards (Video Tutorials, SOP Library, Guided Setup, Troubleshooting)
- Add "Was this helpful?" yes/no feedback buttons on every FAQ answer with a follow-up prompt
- Add related-question links at the bottom of each answer to navigate to adjacent topics
- Add a self-diagnostic troubleshooting widget: a guided 3-step selector (issue category → specific problem → resolution with action link)
- Add a "Still need help?" escalation section that surfaces contact options, demo booking, and WhatsApp directly within the FAQ flow
- Enhance the search to show result count and highlight matching terms
- Update `site.json` FAQ page metadata to reflect self-service capabilities

## Capabilities

### New Capabilities
- `faq-self-service`: Interactive self-help tools on the FAQ page — feedback buttons, related questions, troubleshooting widget, and guided escalation paths

### Modified Capabilities
- `marketing-pages`: FAQ page gains interactive self-service components; the page moves from purely static Q&A to an interactive help center

## Impact

- `src/pages/faq.html` — main page file gets new sections and JS
- `assets/css/core.css` — new component styles (feedback buttons, related links, troubleshooting widget, help toolbar)
- `site.json` — updated FAQ page description
