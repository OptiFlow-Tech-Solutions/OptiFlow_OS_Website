## Context

The pricing page (`src/pages/pricing.html`) is already built and deployed. It follows the standard page template: nav include, footer include, core.css, core.js. Page-specific styles live in a `<style>` block. The page has interactive JavaScript for the ROI calculator with two range sliders.

## Goals / Non-Goals

**Goals:**
- Clean up redundant `.stagger` CSS that duplicates core.css functionality
- Verify all 10 sections have correct dark mode overrides
- Verify all cross-links resolve

**Non-Goals:**
- No layout changes, no content changes, no new sections
- No core.css or core.js modifications
- No pricing tier changes

## Decisions

### Use core.css stagger classes instead of page-specific stagger
Core.css already provides `.stagger-3`, `.stagger-4`, `.stagger-5` classes with proper animation delays. The page-specific `.stagger` class (lines 60-68) is redundant for the pricing cards grid (3 items) and implementation steps (5 items). The trust bar counters use core.js counter animation, not stagger.

### Keep cost-chart CSS intact despite hardcoded hex
The cost comparison chart uses `#dc2626`/`#f97316` (red/orange gradient for traditional) and `#54B89A`/`#99D271` (green gradient for OptiFlow). These are intentionally distinct from the main color palette and represent "expensive" vs "savings" — keeping them is cleaner than adding red/orange tokens to the design system just for one chart.
