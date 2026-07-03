# Design: UI-003 Skeleton Loading & Empty States

## Decisions

### CSS-only approach (no JS for static pages)
Skeleton loaders use CSS `@keyframes shimmer` already defined in core.css. No additional animations needed. Static page skeletons are pure HTML/CSS — they serve as progressive enhancement patterns and UX demos.

### Existing infrastructure reused
All skeleton and empty-state CSS classes were built into core.css (lines 485-575) during initial design system setup. JS helpers `showSkeleton()`, `hideSkeleton()`, `emptyState()` exist in core.js (lines 297-328). This change only adds HTML markup and minimal JS for the category filter interaction.

### Skeleton types used
- `.skeleton-card` — article cards, resource cards
- `.skeleton-text` / `.skeleton-heading` — text placeholders
- `.skeleton-list` — wrapper for multiple items
- `.skeleton-hidden` — utility to hide loaded content

### Empty state patterns
Used when:
- Category filter returns no matching articles
- No data is available in a list
- Form submission encounters an unrecoverable error

### Accessibility
- Skeletons use `aria-hidden="true"` to hide from screen readers
- Empty states include descriptive text and optional CTA button
- `prefers-reduced-motion` disables shimmer animation (already in core.css)

### Form states (existing, verified)
- `.form-submitting` — spinner on submit button, dims form (core.css:335-348, core.js:222)
- `.form-success` — hides fields, shows success message (core.css:349-356)
- `.form-error` — shows error + retry button (core.css:357-369)
