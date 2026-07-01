## 1. Page Source

- [x] 1.1 Create `src/pages/privacy-policy.html` with full HTML structure, inline CSS, and page-specific JS
- [x] 1.2 Implement hero section with eyebrow, title, lead paragraph, and version/effective/updated metadata
- [x] 1.3 Implement side navigation with sticky positioning and 9 section links
- [x] 1.4 Implement 9 content sections: Introduction, Information Collection, Data Usage, Data Storage, Cookies, Third-Party Services, Your Rights, Security, Contact
- [x] 1.5 Implement reading progress bar with scroll-based width update
- [x] 1.6 Implement cookie classification grid (4 types), user rights grid (6 rights), security features grid (6 features)
- [x] 1.7 Implement data flow diagram (You → Platform → Operations)
- [x] 1.8 Implement contact section with 3 contact methods using `{{EMAIL}}` placeholder
- [x] 1.9 Add print stylesheet (`@media print`)
- [x] 1.10 Add dark mode overrides for all page-specific components
- [x] 1.11 Add responsive breakpoints (1024px, 768px, 480px)

## 2. Site Configuration

- [x] 2.1 Add privacy-policy entry to `site.json` pages array with title, description, and active field
- [x] 2.2 Add `privacy-policy/index.html` → `privacy-policy.html` to `SRC_MAP` in `scripts/assemble.mjs`
- [x] 2.3 Verify footer Resources column includes Privacy Policy link

## 3. Shared Component Usage

- [x] 3.1 Use `<!-- INCLUDE: nav -->` and `<!-- INCLUDE: footer -->` includes
- [x] 3.2 Use `{{PAGE_TITLE}}`, `{{PAGE_DESCRIPTION}}`, `{{EMAIL}}`, `{{PHONE}}`, `{{COMPANY}}`, `{{YEAR}}` placeholders
- [x] 3.3 Use `core.css` for CSS variables and `core.js` for shared functionality
- [x] 3.4 Use sticky CTA via core.js (render element, core.js handles visibility)
- [x] 3.5 Ensure no duplicate scroll/animation/form logic in page-specific scripts

## 4. Verification

- [x] 4.1 Run `npm run build` — confirm privacy-policy page assembles without errors
- [x] 4.2 Run `npm run validate` — confirm no link errors, SEO issues, or data consistency warnings for privacy-policy
- [x] 4.3 Verify `<title>` and `<meta name="description">` resolve correctly from `site.json`
- [x] 4.4 Verify all `{{PLACEHOLDER}}` variables resolve to correct values in assembled output
