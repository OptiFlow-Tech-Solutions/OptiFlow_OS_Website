## Design: Cookie Consent & Privacy Compliance

### 1. Banner Layout

Fixed bottom bar (`position: fixed; bottom: 0; z-index: 103` — above sticky CTA at 102):

```
┌──────────────────────────────────────────────────────────────┐
│  🍪  We use essential cookies for site functionality.        │
│     See our Privacy Policy for details.                      │
│              [Reject Non-Essential]  [Accept All Cookies]     │
└──────────────────────────────────────────────────────────────┘
```

- Left: Cookie icon + message text
- Center: Link to `/privacy-policy/`
- Right: Two buttons (ghost + primary)
- Optional: "Manage Preferences" link opens modal

### 2. Manage Preferences Modal

Full-screen overlay modal (z-index: 104) with category toggles:

| Category     | Description                    | Toggle  |
|-------------|-------------------------------|---------|
| Essential    | Theme, auth, form submissions  | Locked ON |
| Analytics    | Anonymized usage stats (Plausible) | Toggle |
| Preferences  | FAQ feedback, UI choices       | Toggle |

- "Essential" toggle is always on and disabled
- "Save Preferences" button commits choices
- "Accept All" shortcut at top
- Close on overlay click or Escape key

### 3. Storage

`localStorage` key: `optiflow-cookie-consent`

```json
{ "essential": true, "analytics": true|false, "preferences": true|false, "acceptedAt": "ISO8601" }
```

### 4. Footer Link

Add "Cookie Settings" link in footer Resources column, after "Terms & Conditions".

Clicking "Cookie Settings" reopens the preferences modal (even if already consented).

### 5. CSS Design Tokens

All colors use core.css variables:
- Banner bg: `var(--surface)`
- Banner border-top: `var(--border)`
- Text: `var(--fg)` / `var(--muted)`
- Button primary: `var(--accent)`
- Button ghost: transparent with `var(--border)` outline
- Modal overlay: `rgba(0,0,0,0.5)`
- Modal bg: `var(--surface)`
- Toggle on: `var(--accent)`
- Toggle off: `var(--border)`
- Border radius: `var(--radius-lg)` for modal, `var(--radius)` for toggles

Dark mode inherits from `[data-theme="dark"]` core vars — no additional overrides needed for standard surfaces.

### 6. Z-Index Stack

```
--z-sticky: 90     (sticky CTAs, progress bar)
--z-nav: 100       (navigation)
--z-drawer: 101    (mobile drawer)
--z-cookie-banner: 103
--z-cookie-modal: 104  (above banner)
--z-skip-link: 1000
```

### 7. Assembly Strategy

Inject cookie consent via `<!-- INCLUDE: cookie-consent -->` in `scripts/assemble.mjs` — the build script already reads all partials and replaces includes. Add the include directive to all 16 page source files (one line each). The cookie consent partial (`src/partials/cookie-consent.html`) contains the banner + modal HTML.

Cookie consent JS lives in `core.js` because it runs on every page. CSS lives in `core.css` for the same reason.

### 8. Motion

- Banner slides up from bottom on first render: `@keyframes cookieSlideUp`
- Modal fades in: `opacity 0 → 1` with backdrop blur
- Reduced motion: `prefers-reduced-motion` disables animation
