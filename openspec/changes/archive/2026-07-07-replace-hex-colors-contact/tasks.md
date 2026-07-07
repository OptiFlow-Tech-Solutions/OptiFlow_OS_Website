## 1. Replace hex colors in the contact page SVG

- [x] 1.1 Replace `stroke="#1B4D81"` with `stroke="var(--accent)"` in the hero illustration SVG (`src/pages/contact.html`, line 276)
- [x] 1.2 Replace `fill="#1B4D81"` with `fill="var(--accent)"` in the same SVG's `<path>` element (line 276)

## 2. Verify no hex colors remain on the contact page

- [x] 2.1 Run `grep` for hex color patterns (`#[0-9A-Fa-f]{3,8}` excluding data URIs) in `src/pages/contact.html` — expect zero CSS-color hex matches (only data-URI hex in form-select icons should remain)
- [x] 2.2 Confirm the SVG renders visually identical in both light and dark themes

## 3. Rebuild and validate

- [x] 3.1 Run `npm run build`
- [x] 3.2 Run `npm run validate` — must pass with zero errors
- [x] 3.3 Spot-check `dist/pages/contact.html` for correct `var(--accent)` usage in the built output
