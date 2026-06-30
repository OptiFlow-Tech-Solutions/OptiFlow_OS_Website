# Delta: Accessibility → PAGE-001 Home Page

## Change: Verification

### WCAG 2.2 Level AA

- **CONFIRMED**: Skip-to-content link present as first focusable element
- **CONFIRMED**: Semantic landmarks: `<header>` (nav), `<main id="content">`, `<footer>`
- **CONFIRMED**: Focus-visible styles defined in core.css (2px solid teal outline)
- **CONFIRMED**: `aria-label` on WhatsApp float ("Chat on WhatsApp"), scroll-top button ("Scroll to top"), exit-close button ("Close")
- **CONFIRMED**: `aria-live="polite"` on typewriter text for screen reader updates
- **CONFIRMED**: FAQ accordion uses `aria-expanded` toggle (via core.js)

### Reduced Motion

- **CONFIRMED**: Typewriter cursor blink animation has `@media (prefers-reduced-motion: reduce)` override
- **CONFIRMED**: core.css disables all animations/reveals under `prefers-reduced-motion`

### Keyboard Navigation

- **CONFIRMED**: All links and buttons are natively focusable
- **CONFIRMED**: Mobile drawer Escape key handling (via core.js)
