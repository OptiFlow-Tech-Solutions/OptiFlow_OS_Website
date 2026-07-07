## 1. Fix em dash corruption in CSS/HTML comments

Replace `â"€` → `&mdash;` in all affected source files. CSS comments with section separators like `/* â"€â"€â"€ Hero â"€â"€â"€ */` should become `/* &mdash;&mdash;&mdash; Hero &mdash;&mdash;&mdash; */`.

- [x] 1.1 Replace `â"€` with `&mdash;` in `src/pages/home.html` (120 occurrences)
- [x] 1.2 Replace `â"€` with `&mdash;` in `src/pages/contact.html` (48 occurrences)
- [x] 1.3 Replace `â"€` with `&mdash;` in `src/pages/competitive-positioning.html` (60 occurrences)
- [x] 1.4 Replace `â"€` with `&mdash;` in `src/pages/why-optiflow.html` (84 occurrences)
- [x] 1.5 Replace `â"€` with `&mdash;` in `src/pages/terms.html` (96 occurrences)
- [x] 1.6 Replace `â"€` with `&mdash;` in `src/pages/product-overview.html` (65 occurrences)
- [x] 1.7 Replace `â"€` with `&mdash;` in `src/pages/problem-solutions.html` (102 occurrences)
- [x] 1.8 Replace `â"€` with `&mdash;` in `src/pages/privacy-policy.html` (102 occurrences)
- [x] 1.9 Replace `â"€` with `&mdash;` in `src/pages/pricing.html` (66 occurrences)
- [x] 1.10 Replace `â"€` with `&mdash;` in `src/pages/features.html` (0 — no corruption found)
- [x] 1.11 Replace `â"€` with `&mdash;` in `src/pages/feature-showcase.html` (0 — no corruption found)
- [x] 1.12 Replace `â"€` with `&mdash;` in `src/pages/faq.html` (66 occurrences)
- [x] 1.13 Replace `â"€` with `&mdash;` in `src/pages/demo-booking.html` (96 occurrences)
- [x] 1.14 Replace `â"€` with `&mdash;` in `src/pages/newsletter.html` (0 — no corruption found)

## 2. Fix middle dot corruption

Replace `Â·` → `&middot;` in text content.

- [x] 2.1 Replace `Â·` with `&middot;` in `src/pages/home.html` (10 occurrences)
- [x] 2.2 Replace `Â·` with `&middot;` in `src/pages/pricing.html` (12 occurrences)

## 3. Fix arrow character corruption

Replace corrupted arrows with proper HTML entities.

- [x] 3.1 Replace `â†'` with `&rarr;` in `src/pages/home.html` (0 — no right arrow corruption found in home.html)
- [x] 3.2 Replace `â†"` with `&darr;` in `src/pages/home.html` (2 occurrences)
- [x] 3.3 Replace `â†'` with `&uarr;` in `src/pages/home.html` (4 occurrences)
- [x] 3.4 Replace corrupted arrows in `src/pages/problem-solutions.html` (6 right arrows fixed)

## 4. Verify zero corruption remains

- [x] 4.1 Run `grep` for `â` across `src/pages/**/*.html` — confirmed zero matches
- [x] 4.2 Search for raw broken byte sequences in all src HTML files — confirmed none remain

## 5. Rebuild and validate

- [x] 5.1 Run `npm run build` — build succeeded (16 pages)
- [x] 5.2 Run `npm run validate` — 0 errors, 31 pre-existing warnings (unrelated)
- [x] 5.3 Spot-check built pages in `dist/` for correct rendering of `&mdash;`, `&middot;`, and arrow entities — all present, no `â` sequences remain
