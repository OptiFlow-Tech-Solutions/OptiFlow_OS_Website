## 1. Audit — Inventory All Broken Sequences

- [x] 1.1 Run grep for `â€|â‚¹|Ã—` across all `src/**/*.html` and capture the full list of affected files and line counts

## 2. Fix Em Dash Sequences

- [x] 2.1 Replace `â€"` with `&mdash;` in `competitive-positioning.html`
- [x] 2.2 Replace `â€"` with `&mdash;` in `demo-booking.html`
- [x] 2.3 Replace `â€"` with `&mdash;` in `contact.html`
- [x] 2.4 Replace `â€"` with `&mdash;` in `why-optiflow.html`
- [x] 2.5 Replace `â€"` with `&mdash;` in `terms.html`
- [x] 2.6 Replace `â€"` with `&mdash;` in `faq.html`
- [x] 2.7 Replace `â€"` with `&mdash;` in `product-overview.html`
- [x] 2.8 Replace `â€"` with `&mdash;` in `feature-showcase.html`
- [x] 2.9 Replace `â€"` with `&mdash;` in any remaining affected page files
- [x] 2.10 Replace `â€"` with `&mdash;` in partials if any are affected

## 3. Fix Rupee Sign Sequences

- [x] 3.1 Replace `â‚¹` with `&#8377;` in `competitive-positioning.html`
- [x] 3.2 Replace `â‚¹` with `&#8377;` in `demo-booking.html`
- [x] 3.3 Replace `â‚¹` with `&#8377;` in `why-optiflow.html`
- [x] 3.4 Replace `â‚¹` with `&#8377;` in `feature-showcase.html`
- [x] 3.5 Replace `â‚¹` with `&#8377;` in any remaining affected pages

## 4. Fix Multiplication Sign Sequences

- [x] 4.1 Replace `Ã—` with `&times;` in `competitive-positioning.html`
- [x] 4.2 Replace `Ã—` with `&times;` in any remaining affected pages

## 5. Verify — Zero Broken Sequences

- [x] 5.1 Run grep for `â€|â‚¹|Ã—` across `src/**/*.html` and confirm zero matches
- [x] 5.2 Run `npm run build` and confirm successful assembly of all 17 dist pages
- [x] 5.3 Run `npm run validate` and confirm zero encoding-related errors
- [x] 5.4 Spot-check 3 random dist pages to visually confirm em dashes, rupee signs, and multiplication signs render correctly
