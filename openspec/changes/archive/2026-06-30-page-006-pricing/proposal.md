## Why

The pricing page is the primary conversion page where buyers decide whether to book a demo or contact sales. The page already exists with 10 sections (hero, philosophy, trust bar, plans, comparison, ROI calculator, implementation, security, FAQ, CTA), interactive ROI calculator, and full dark mode support. This change formalizes the page as an OpenSpec-governed artifact, cleans up a redundant CSS block, and standardizes the page title.

## What Changes

- Remove redundant page-specific `.stagger` CSS (lines 60-68) — core.css already provides `.stagger-3`/`.stagger-4`/`.stagger-5` classes
- Replace `.stagger` usage in the page with appropriate `.stagger-*` classes from core.css
- Verify cross-links to `/demo-booking/`, `/contact/`, `/competitive-positioning/`, `/faq/`
- Verify dark mode coverage for all 10 sections
- Build + validate

## Capabilities

### Modified Capabilities
- `marketing-pages`: Pricing page source cleanup (~10 lines removed). `site.json` page entry updated with new title.
