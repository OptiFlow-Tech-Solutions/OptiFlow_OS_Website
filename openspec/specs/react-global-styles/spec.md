# react-global-styles

## Purpose

React `GlobalStyles` component that injects CSS reset, typography base styles, utility classes, scroll-reveal animations, and reduced-motion support — mirroring the base styles from `assets/css/core.css`.

## Requirements

### Requirement: GlobalStyles component applies CSS reset and typography
The system SHALL provide a `GlobalStyles` React component that injects CSS reset rules, typography base styles, and utility classes matching `core.css` base styles.

#### Scenario: CSS reset is applied
- **WHEN** `GlobalStyles` is rendered in the component tree
- **THEN** `*, *::before, *::after { box-sizing: border-box }` rule is active on the page

#### Scenario: Body styles match core.css
- **WHEN** `GlobalStyles` is rendered
- **THEN** `body` has `margin: 0`, `font-family: var(--font-body)`, `font-size: var(--fs-body)`, `line-height: 1.6`, `background: var(--bg)`, `color: var(--fg)`, and web font rendering optimizations

#### Scenario: Heading styles match core.css
- **WHEN** `GlobalStyles` is rendered
- **THEN** `h1` uses `var(--font-display)`, `var(--fs-h1)`, `letter-spacing: -0.025em`, `font-weight: 700`
- **THEN** `h2` uses `var(--font-display)`, `var(--fs-h2)`, `letter-spacing: -0.02em`, `font-weight: 700`
- **THEN** `h3` uses `var(--fs-h3)`, `font-weight: 600`, `letter-spacing: -0.01em`

#### Scenario: Utility text classes are available
- **WHEN** elements use `.lead`, `.eyebrow`, `.meta`, or `.num` classes
- **THEN** they render with matching typography from `core.css` (lead: `var(--fs-lead)` muted, eyebrow: mono uppercase teal, meta: mono muted, num: tabular-nums)

#### Scenario: Focus-visible style matches core.css
- **WHEN** any element receives `:focus-visible`
- **THEN** it shows a 2px solid `var(--teal)` outline with 2px offset and 4px border-radius

### Requirement: Noise texture overlay class is available
The system SHALL provide a `.noise-overlay` CSS class creating a subtle SVG-noise texture matching `core.css`.

#### Scenario: Noise overlay renders
- **WHEN** a `<div className="noise-overlay">` is rendered inside a positioned parent
- **THEN** it displays the fractal-noise SVG pattern at `var(--noise-opacity)` opacity

### Requirement: Skip-link utility class is available
The system SHALL provide a `.skip-link` CSS class for keyboard accessibility navigation matching `core.css`.

#### Scenario: Skip link is visually hidden until focused
- **WHEN** a skip link has class `skip-link`
- **THEN** it is positioned off-screen (`top: -100%`) and becomes visible on `:focus` (`top: 8px`)

### Requirement: Reduced-motion media query
The `GlobalStyles` component SHALL include a `prefers-reduced-motion: reduce` media query that disables all animations and transitions, and forces reveal elements to be visible.

#### Scenario: Animations disabled when reduced-motion is preferred
- **WHEN** user has `prefers-reduced-motion: reduce` enabled and `GlobalStyles` is rendered
- **THEN** all animations and transitions have `duration: 0.01ms`, scroll behavior is `auto`, and `.reveal` elements have `opacity: 1; transform: none`

### Requirement: sr-only utility class is available
The system SHALL provide a `.sr-only` CSS class for screen-reader-only content.

#### Scenario: sr-only content is hidden visually but accessible
- **WHEN** an element has `className="sr-only"`
- **THEN** it is not visible on screen but is present in the accessibility tree

### Requirement: Scroll-reveal animation classes are available
The system SHALL provide CSS classes for scroll-triggered reveal animations: `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale`, and stagger variants.

#### Scenario: Reveal elements animate on visibility
- **WHEN** an element with `className="reveal"` scrolls into the viewport
- **THEN** it transitions from `opacity: 0; translateY(var(--motion-distance))` to `opacity: 1; translateY(0)` over 0.7s

#### Scenario: Staggered children animate sequentially
- **WHEN** a container with `className="stagger-3"` has 3 children with `className="reveal"`
- **THEN** children animate with delays of 0s, 0.1s, and 0.2s respectively

#### Scenario: Directional reveals work
- **WHEN** an element with `className="reveal-left"` scrolls into view
- **THEN** it transitions from `translateX(-28px)` to `translateX(0)`
- **WHEN** an element with `className="reveal-right"` scrolls into view
- **THEN** it transitions from `translateX(28px)` to `translateX(0)`

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
