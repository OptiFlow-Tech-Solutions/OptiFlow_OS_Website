# Design: Site Navigation & Structure (SYS-002)

## Decisions

### 1. Footer placeholders → build-time injection

Footer currently has `+91 7874677836`, `hello@optiflow.in`, `2026` hardcoded. Replace with `{{PHONE}}`, `{{EMAIL}}`, `{{YEAR}}` — the build pipeline already supports this via `assemble.mjs`.

### 2. Skip-to-content link

```html
<a class="skip-link" href="#main-content">Skip to content</a>
```

Positioned as first focusable element in `<body>`. Styled in `core.css`:
- Hidden off-screen until focused
- On focus: visible, centered at top, z-index above nav

### 3. Resources dropdown — slim down

```
Before: Newsletter, FAQ, Privacy Policy, Terms & Conditions
After:  Newsletter, FAQ
```

Privacy Policy and Terms remain in footer only. This matches standard practice — legal pages don't belong in primary nav.

### 4. Mobile drawer — active class

Apply same `.active` class resolution to mobile drawer links. Currently only desktop nav gets active detection.

### 5. File rename: blog.html → newsletter.html

```javascript
// assemble.mjs SRC_MAP change:
- 'newsletter/index.html': 'blog.html',
+ 'newsletter/index.html': 'newsletter.html',
```

### 6. Nav CTA — single CTA

Both CTAs currently link to `/demo-booking/`. Keep only "Book Demo" — the primary CTA. "Watch Demo" is redundant with the page content itself.

```html
<!-- Before -->
<a href="/demo-booking/" class="btn btn-ghost">Watch Demo</a>
<a href="/demo-booking/" class="btn btn-primary btn-glow">Book Demo</a>

<!-- After -->
<a href="/demo-booking/" class="btn btn-primary btn-glow">Book Demo</a>
```

## Visuals

```
┌──────────────────────────────────────────────────────────────┐
│ [skip-link] (hidden until Tab)                               │
├──────────────────────────────────────────────────────────────┤
│  🏠 OptiFlow   Home Solutions Product Features ...  🌙 Demo  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  <main id="main-content">                                    │
│    ...                                                       │
│  </main>                                                     │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  Footer: {{PHONE}} {{EMAIL}} © {{YEAR}}                     │
└──────────────────────────────────────────────────────────────┘
```
