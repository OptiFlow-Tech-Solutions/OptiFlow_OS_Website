## Tasks: Cookie Consent & Privacy Compliance

### 1. Core CSS: cookie consent banner + modal styles
- [x] Add `.cookie-consent` (fixed bottom bar) styles to `core.css`
- [x] Add `.cookie-modal` (overlay + card) styles to `core.css`
- [x] Add toggle switch styles (`.cookie-toggle`) to `core.css`
- [x] Add `@keyframes cookieSlideUp` animation
- [x] Add `@media (prefers-reduced-motion)` rule
- [x] Add responsive breakpoints (1024px, 768px, 480px)

### 2. Core JS: cookie consent logic
- [x] Add `CookieConsent` module to `core.js`
- [x] Check `localStorage.optiflow-cookie-consent` on load
- [x] Show/hide banner based on consent state
- [x] Handle Accept All, Reject Non-Essential clicks
- [x] Handle Manage Preferences modal open/close
- [x] Handle toggle switches + Save Preferences
- [x] Handle "Cookie Settings" footer link trigger

### 3. Cookie consent partial
- [x] Create `src/partials/cookie-consent.html` (banner HTML + modal HTML)
- [x] Banner: message, privacy policy link, Accept All button, Manage Preferences link
- [x] Modal: category toggles with descriptions, Save button

### 4. Build system
- [x] Add `cookie-consent` include to `scripts/assemble.mjs`
- [x] Add z-index variables `--z-cookie-banner: 103` and `--z-cookie-modal: 104` to `core.css`

### 5. Footer update
- [x] Add "Cookie Settings" link to `src/partials/footer.html` Resources column

### 6. Page source updates
- [x] Add `<!-- INCLUDE: cookie-consent -->` before `</body>` in all 15 page source files
- [x] Fix missing `</body>` in `newsletter.html`

### 7. Feature registry
- [x] Update `features/features.json`: set UI-005 status from `pending` to `complete`

### 8. Delta spec
- [x] Create `specs/cookie-consent/spec.md` with requirements and BDD scenarios

### 9. Validation
- [x] `npm run build` — all 15 pages assembled with cookie consent
- [x] `npm run validate` — 0 errors, 31 pre-existing warnings (no new issues)
- [x] Cookie consent banner verified in dist/ (index, admin, newsletter, privacy-policy)
- [x] Cookie Settings footer link verified in all 15 dist pages
- [x] Cookie consent uses CSS variables throughout (no hardcoded colors)
