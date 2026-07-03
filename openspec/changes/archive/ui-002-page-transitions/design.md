# Design: Page Transition Animations (UI-002)

## Architecture

```
core.css                                core.js
  │                                        │
  ├─ @keyframes pageEnter                  ├─ DOMContentLoaded → add .page-enter-active
  │   (fade-in + slide-up 10px)            │
  │                                        ├─ Internal-link click handler:
  ├─ @keyframes pageExit                   │   1. preventDefault
  │   (fade-out)                           │   2. add .page-exit-active to body
  │                                        │   3. 300ms later → window.location = href
  ├─ .page-enter-active body               │
  │   animation: pageEnter 0.35s           ├─ reduced-motion: skip both
  │                                        │
  ├─ .page-exit-active body                │
  │   animation: pageExit 0.25s            │
  │                                        │
  └─ @media (prefers-reduced-motion)       │
       { both classes → no animation }     │
```

## Enter Animation

- **Duration**: 350ms (matches `--transition-slow`)
- **Easing**: `--ease-out` (cubic-bezier(0.22, 1, 0.36, 1))
- **Transform**: translateY(10px → 0), opacity(0 → 1)
- **Target**: `<body>` when `.page-enter-active` is set
- **Trigger**: `DOMContentLoaded` event in core.js

## Exit Animation

- **Duration**: 250ms (matches `--transition-base`)
- **Easing**: `--ease-in` (cubic-bezier(0.64, 0, 0.78, 0))
- **Transform**: opacity(1 → 0)
- **Target**: `<body>` when `.page-exit-active` is set
- **Trigger**: Click on internal navigation link (`<a>` with same-origin href)

## Exit Link Detection

```
Internal link = same-origin, not hash-only, not download, not target="_blank", not mailto/tel
```

## Reduced Motion

Both animations skipped entirely when `prefers-reduced-motion: reduce` is active. The page-enter-active animation-duration is set to 0.01ms, and the exit handler checks the media query before applying its class.
