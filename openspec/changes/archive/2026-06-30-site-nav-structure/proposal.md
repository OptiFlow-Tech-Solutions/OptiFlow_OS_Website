# Proposal: Site Navigation & Structure (SYS-002)

## Why

The current navigation and site structure has several quality gaps that degrade UX and violate our own specs:

1. **Footer hardcodes data** — phone, email, and year are hardcoded instead of using `{{PHONE}}`, `{{EMAIL}}`, `{{YEAR}}` placeholders, breaking the single-source-of-truth principle.
2. **No skip-to-content link** — the `marketing-pages` spec requires it but it's missing.
3. **Redundant nav CTAs** — both "Watch Demo" and "Book Demo" link to `/demo-booking/`.
4. **Mobile drawer missing active indicators** — desktop nav shows active state, mobile doesn't.
5. **Source file naming confusion** — `blog.html` serves as the newsletter page; should be `newsletter.html`.
6. **Resources dropdown clutter** — Privacy Policy and Terms in primary nav is noise. Move to footer-only.

## What Changes

| Area | Change | Impact |
|------|--------|--------|
| `src/partials/footer.html` | Use `{{PHONE}}`, `{{EMAIL}}`, `{{YEAR}}` | Build pipeline |
| `src/partials/nav.html` | Add skip-to-content + mobile active states + slim Resources dropdown | Shared components |
| `src/pages/blog.html` | Rename to `newsletter.html` | Marketing pages |
| `scripts/assemble.mjs` | Update SRC_MAP for rename | Build pipeline |
| `site.json` | Remove legal pages from Resources dropdown | Config |

## What Stays

- 12-page count unchanged
- All URL paths unchanged
- Nav dropdown pattern unchanged (just trimmed)
- Core component behavior (sticky, glass, theme toggle) unchanged

## Risks

- **Low risk**: Footer placeholder change is mechanical
- **Low risk**: Nav changes are additive (skip-to-content) or trimming (Resources)
- **No risk**: File rename is self-contained in build map
