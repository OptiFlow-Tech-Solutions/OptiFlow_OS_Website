## Tasks: Cookie Consent & Privacy Compliance

### 1. Core CSS: cookie consent banner + modal styles
- [ ] Add `.cookie-consent` (fixed bottom bar) styles to `core.css`
- [ ] Add `.cookie-modal` (overlay + card) styles to `core.css`
- [ ] Add toggle switch styles (`.cookie-toggle`) to `core.css`
- [ ] Add `@keyframes cookieSlideUp` animation
- [ ] Add `@media (prefers-reduced-motion)` rule
- [ ] Add responsive breakpoints (1024px, 768px, 480px)

### 2. Core JS: cookie consent logic
- [ ] Add `CookieConsent` module to `core.js`
- [ ] Check `localStorage.optiflow-cookie-consent` on load
- [ ] Show/hide banner based on consent state
- [ ] Handle Accept All, Reject Non-Essential clicks
- [ ] Handle Manage Preferences modal open/close
- [ ] Handle toggle switches + Save Preferences
- [ ] Handle "Cookie Settings" footer link trigger

### 3. Cookie consent partial
- [ ] Create `src/partials/cookie-consent.html` (banner HTML + modal HTML)
- [ ] Banner: message, privacy policy link, Accept All button, Manage Preferences link
- [ ] Modal: category toggles with descriptions, Save button

### 4. Build system
- [ ] Add `cookie-consent` include to `scripts/assemble.mjs`
- [ ] Add z-index variables `--z-cookie-banner: 103` and `--z-cookie-modal: 104` to `core.css`

### 5. Footer update
- [ ] Add "Cookie Settings" link to `src/partials/footer.html` Resources column

### 6. Page source updates
- [ ] Add `<!-- INCLUDE: cookie-consent -->` before `</body>` in all 16 page source files

### 7. Feature registry
- [ ] Update `features/features.json`: set UI-005 status from `pending` to `complete`

### 8. Delta spec
- [ ] Create `specs/cookie-consent/spec.md` with requirements and BDD scenarios

### 9. Validation
- [ ] `npm run build` — all pages assemble with cookie consent
- [ ] `npm run validate` — no broken links or inconsistencies
- [ ] Verify banner appears on first visit, hidden after consent
- [ ] Verify dark mode renders correctly
- [ ] Verify WCAG AA contrast on all text
