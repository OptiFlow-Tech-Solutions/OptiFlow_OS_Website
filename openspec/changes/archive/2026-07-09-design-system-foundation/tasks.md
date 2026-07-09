## 1. Design Tokens

- [x] 1.1 Create `frontend/src/styles/design-tokens.css` extracting all `:root` CSS custom properties from `assets/css/core.css` (colors, typography, spacing, shadows, z-index, transitions, border-radius)
- [x] 1.2 Include `[data-theme="dark"]` overrides matching `core.css` dark mode values
- [x] 1.3 Add `@supports (color: oklch(0 0 0))` fallback block with sRGB approximations for `--bg`, `--surface`, `--fg`, `--accent`, `--teal`
- [x] 1.4 Verify token values match `core.css` — spot-check 10 random tokens across both files

## 2. Tailwind Configuration

- [x] 2.1 Update `frontend/tailwind.config.ts` (or `vite.config.ts` if using Tailwind v4 CSS config) to extend theme with `var()` references for all `design-tokens.css` colors, spacing, fontFamily, borderRadius, boxShadow
- [x] 2.2 Configure `darkMode: ['selector', '[data-theme="dark"]']` to enable `dark:` variant classes
- [x] 2.3 Verify `npm run build` succeeds with token-mapped classes available (spot-check `bg-accent`, `text-teal`, `gap-lg`)

## 3. Theme Provider

- [x] 3.1 Create `frontend/src/components/ThemeProvider.tsx` with React context storing `theme` state (`"light"` | `"dark"`)
- [x] 3.2 Implement `useTheme()` hook returning `{ theme, toggleTheme }`
- [x] 3.3 On mount: read `localStorage.theme`, fall back to `matchMedia('(prefers-color-scheme: dark)')`, set `data-theme` on `document.documentElement`
- [x] 3.4 `toggleTheme()`: flip theme, update `localStorage`, update `data-theme` attribute
- [x] 3.5 Add `aria-live="polite"` region announcing theme changes for screen readers

## 4. Global Styles

- [x] 4.1 Create `frontend/src/components/GlobalStyles.tsx` rendering a `<style>` tag or CSS import with:
  - CSS reset (`box-sizing`, `html` background/scroll, `body` base styles)
  - Typography base (`h1`–`h3`, `.lead`, `.eyebrow`, `.meta`, `.num` matching `core.css`)
  - Focus-visible outline (`2px solid var(--teal)`, 2px offset)
  - `.noise-overlay` class (SVG data URI, matching `core.css`)
  - `.skip-link` class (visually hidden until focused)
  - `.sr-only` utility class
  - `prefers-reduced-motion: reduce` media query
- [x] 4.2 Add scroll-reveal CSS classes: `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale` with visibility transitions, and `.reveal-delay-1` through `.reveal-delay-4` variants
- [x] 4.3 Add stagger classes: `.stagger-3`, `.stagger-4`, `.stagger-5` with nth-child delays matching `core.css`
- [x] 4.4 Add form state classes: `.form-submitting`, `.form-success`, `.form-error` with loader animation, success message, and error message styles matching `core.css`
- [x] 4.5 Add `.btn-glow::before` animation keyframe

## 5. Container Component

- [x] 5.1 Create `frontend/src/components/Container.tsx` — renders a `<div>` with `max-width: var(--container)`, `margin-inline: auto`, `padding-inline: var(--gutter)`
- [x] 5.2 Support `width` prop: `"default"` (1200px) and `"narrow"` (800px)
- [x] 5.3 Support `className` prop for composition, `as` prop for semantic HTML elements

## 6. Section Component

- [x] 6.1 Create `frontend/src/components/Section.tsx` — renders `<section>` with vertical padding (`padding-block: clamp(56px, 8vw, var(--gap-2xl))`), `scroll-margin-top: var(--nav-h)`, contains an inner Container
- [x] 6.2 Support `heading` and `lead` props rendering a section-header block with `h2` + decorative `::after` gradient underline
- [x] 6.3 Support `background` prop: `"default"` (transparent), `"surface"` (surface background), `"dark"` (dark section with white headings, muted lead, teal eyebrow, semi-transparent cards)
- [x] 6.4 Support `width` prop passed through to inner Container
- [x] 6.5 Support `className` and `id` props

## 7. Button Component

- [x] 7.1 Create `frontend/src/components/Button.tsx` matching `shared-components` spec API: `variant` (`"primary"` | `"secondary"` | `"outline"`), `size` (`"default"` | `"lg"`), `as` prop for rendering as `<Link>` or `<button>`
- [x] 7.2 Primary variant: gradient background (`oklch(33% 0.09 255) → oklch(42% 0.09 238)`), white text, box-shadow, hover lift + shine effect, active press
- [x] 7.3 Secondary variant: semi-transparent white background, backdrop blur, border, hover lift + shadow
- [x] 7.4 Add `glow` boolean prop enabling `.btn-glow` animated border effect
- [x] 7.5 Support `className`, `disabled`, and all native button/ anchor attributes

## 8. Card Component

- [x] 8.1 Create `frontend/src/components/Card.tsx` matching `shared-components` spec API: `hover` prop, `padding` prop (`"default"` | `"sm"` | `"lg"`)
- [x] 8.2 Default: `var(--surface)` background, `var(--border)` border, `var(--radius-lg)` radius, `var(--shadow-card)` shadow, `var(--gap-md)` padding
- [x] 8.3 Hover variant: `translateY(-4px) scale(1.01)`, increased shadow, teal-tinted border
- [x] 8.4 Support `className`, `as` prop for semantic elements

## 9. Input Component

- [x] 9.1 Create `frontend/src/components/Input.tsx` with `variant` prop (`"default"` | `"error"`)
- [x] 9.2 Default: `var(--surface)` background, `var(--border)` border, `var(--radius)` radius, `var(--fs-body)` font size, full width
- [x] 9.3 Error variant: red-tinted border and background matching `.form-error-msg` token
- [x] 9.4 Support `icon` prop rendering an SVG/component on the leading side
- [x] 9.5 Support `disabled`, `readOnly`, `className`, and all native input attributes (`type`, `name`, `placeholder`, `required`, `aria-*`)

## 10. Integration & Exports

- [x] 10.1 Create `frontend/src/components/index.ts` barrel export re-exporting Button, Card, Section, Container, Input, ThemeProvider, GlobalStyles, useTheme
- [x] 10.2 Update `frontend/src/main.tsx`: import `design-tokens.css`, wrap `<App />` in `<ThemeProvider>` and render `<GlobalStyles />`
- [x] 10.3 Verify the Home page placeholder renders with design tokens applied (body background, font, colors all from tokens)
- [x] 10.4 Verify dark mode toggle works in browser (toggle → `data-theme` changes → colors update)
- [x] 10.5 Run `npm run build` and verify no TypeScript errors
