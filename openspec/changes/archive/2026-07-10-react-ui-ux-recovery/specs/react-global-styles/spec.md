# react-global-styles (delta)

## ADDED Requirements

### Requirement: GlobalStyles enforces no inline style conflicts
The GlobalStyles component SHALL include CSS reset rules that prevent conflicts between Tailwind utility classes and any legacy styling patterns. It SHALL NOT duplicate styles that Tailwind's preflight or the design token theme already provide.

#### Scenario: No duplicate reset rules
- **WHEN** comparing GlobalStyles output with Tailwind preflight
- **THEN** no CSS property is set by both systems to conflicting values

### Requirement: Reduced-motion preserves accessibility for animations
The reduced-motion media query in GlobalStyles SHALL disable all CSS transitions and animations across the entire site, including page transitions defined in `transitions.css`.

#### Scenario: Page transitions disabled
- **WHEN** user has `prefers-reduced-motion: reduce` enabled and navigates between pages
- **THEN** `transitions.css` animations have `animation-duration: 0.01ms` and no visual motion occurs

### Requirement: Sticky footer layout is enforced globally
GlobalStyles SHALL include the sticky footer CSS (`html, body, #root { min-height: 100vh; } #root { display: flex; flex-direction: column; }`) to ensure the footer stays at the bottom of short pages.

#### Scenario: Footer at bottom on short pages
- **WHEN** viewing a short-content page (e.g., Privacy Policy)
- **THEN** the footer renders at the bottom of the viewport, not floating mid-page
