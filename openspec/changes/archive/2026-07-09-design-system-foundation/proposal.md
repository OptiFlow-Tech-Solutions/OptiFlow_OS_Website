## Why

The React SPA scaffold exists (F-ARCH-001) but has zero design system integration — components render with no styles, no design tokens are accessible, and every future feature would independently reinvent visual primitives. The 513-line `core.css` already defines a complete design system (Oklch color space, typography scale, spacing rhythm, component classes, animations, dark mode). This change bridges that existing system into React so the 16-page migration can proceed with visual consistency.

## What Changes

- Extract CSS custom properties from `core.css` into a standalone `design-tokens.css` (light + dark mode variables)
- Create `ThemeProvider` React context with `useTheme` hook, dark mode toggle, localStorage persistence, and `prefers-color-scheme` detection
- Create `GlobalStyles` component applying CSS reset, typography, focus indicators, noise texture, and scroll-reveal animation classes
- Implement shared React components matching existing `core.css` component classes: **Button**, **Card**, **Section**, **Container**, **Input** (with form states)
- Map design tokens to Tailwind CSS 4 configuration via `var()` references (per `tailwind-theme` spec)
- Port scroll-reveal animations (`.reveal`, `.stagger-*`) and reduced-motion support into React-compatible form
- All colors use `var(--*)` references; no hardcoded hex values
- All components fully typed with TypeScript

## Capabilities

### New Capabilities

- `react-design-tokens`: Standalone CSS file (`design-tokens.css`) with all CSS custom properties from `core.css` — colors, typography, spacing, shadows, z-index, transitions/easing, border-radius. Light and dark mode scoped via `:root` and `[data-theme="dark"]`. Serves as the single source of truth for all design values.
- `react-theme-provider`: React context (`ThemeProvider`) + `useTheme` hook managing `data-theme` attribute on `<html>`. Persists selection to localStorage. Detects `prefers-color-scheme` on first visit. Provides `toggleTheme()` function.
- `react-global-styles`: React component rendering CSS reset, typography base styles (`h1`-`h3`, `.lead`, `.eyebrow`, `.meta`, `.num`), `:focus-visible` outlines, noise texture (SVG data URI), `.skip-link` accessibility helper, reduced-motion media query, and `.sr-only` utility.

### Modified Capabilities

- `shared-components`: Add **Input** component requirements (variants: default, error; states: disabled, readonly, with icon; ported form states: `.form-submitting`, `.form-success`, `.form-error`). Add **Container** component requirements (max-width wrapper with configurable width). Neither component is currently in the spec.
- `tailwind-theme`: No requirement changes. This change implements the existing spec — mapping tokens to Tailwind config with `var()` references and `darkMode: ['selector', '[data-theme="dark"]']`.

## Impact

- **New files**: `frontend/src/styles/design-tokens.css`, `frontend/src/styles/global.css`, `frontend/src/components/ThemeProvider.tsx`, `frontend/src/components/GlobalStyles.tsx`, `frontend/src/components/Button.tsx`, `frontend/src/components/Card.tsx`, `frontend/src/components/Section.tsx`, `frontend/src/components/Container.tsx`, `frontend/src/components/Input.tsx`, component barrel exports, Tailwind config update
- **Modified files**: `frontend/src/main.tsx` (wrap app in ThemeProvider + GlobalStyles), `frontend/src/App.tsx` (may need no changes)
- **Dependencies**: None new. Tailwind CSS 4 already in `frontend/package.json` per react-scaffold spec
- **No backend, database, or API changes**
- **Legacy untouched**: `assets/css/core.css`, `src/pages/`, `scripts/assemble.mjs` remain unchanged
