## 1. Remove page-level `--green` overrides

- [x] 1.1 Remove `--green` override from `features.html` `<style>` block: delete `--green: oklch(44% 0.13 155);` from `:root` and `--green: oklch(76% 0.14 145);` from `[data-theme="dark"]`
- [x] 1.2 Remove `--green` override from `feature-showcase.html` `<style>` block: delete `--green: oklch(44% 0.13 155);` from `:root` and `--green: oklch(76% 0.14 145);` from `[data-theme="dark"]`

## 2. Fix pricing page — growth indicators to `var(--lime)`

- [x] 2.1 ROI dashboard savings amount: `color: var(--green)` → `color: var(--lime)`
- [x] 2.2 ROI dashboard pulse dot: `background: var(--green)` → `background: var(--lime)`
- [x] 2.3 ROI dashboard connector line: `background: var(--green)` → `background: var(--lime)`
- [x] 2.4 ROI stats green values: `.rd-stat-val.green { color: var(--green) }` → `{ color: var(--lime) }`
- [x] 2.5 Save badge/save pct: `color: var(--green)` → `color: var(--lime)`, background stays `var(--green-soft)`
- [x] 2.6 Save card block: `background`, `border`, `color` references to `var(--green)` → `var(--lime)` equivalents
- [x] 2.7 Save card dark mode: `.save-pct background` `var(--green)` → `var(--lime)`
- [x] 2.8 Cloud hosting card icon: `color:var(--green)` → `color:var(--lime)`
- [x] 2.9 Counter display "500K tasks": `color:var(--green)` → `color:var(--lime)`
- [x] 2.10 ROI calc `pc-bd-green`: `color: var(--green)` → `color: var(--lime)`

## 3. Replace hardcoded green hex values in pricing page

- [x] 3.1 OptiFlow bar fill gradient (light mode): replaced hardcoded hex with `var(--lime)`-based color-mix
- [x] 3.2 OptiFlow bar fill gradient (dark mode): replaced hardcoded rgba with `var(--lime)`-based color-mix

## 4. Build and validate

- [x] 4.1 Run `npm run build` to regenerate all pages
- [x] 4.2 Run `npm run validate` to check for broken links, color consistency, and design system compliance
- [x] 4.3 Visually verify pricing, features, and feature-showcase pages in both light and dark mode
