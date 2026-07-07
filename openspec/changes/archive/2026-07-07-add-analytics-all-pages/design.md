## Context

The site uses Plausible (privacy-first, cookieless) for analytics. The Plausible script is defined in `src/partials/analytics.html` and injected into pages via two mechanisms in `scripts/assemble.mjs`:

1. **Include directive replacement** (L94): `<!-- INCLUDE: analytics -->` → only `competitive-positioning.html` uses this
2. **Ponytail auto-injection** (L157): `html.replace('</head>', analyticsRaw)` → applies to all 16 pages as a fallback

Mechanism #2 ensures analytics loads everywhere, but it's an undocumented hack. The documented pattern is `<!-- INCLUDE: analytics -->`. Additionally, `core.js` captures UTM parameters (L181-188) but discards them — they are never attached to any analytics event. No conversion events exist.

## Goals / Non-Goals

**Goals:**
- Add `<!-- INCLUDE: analytics -->` to all 16 source pages, making the pattern consistent
- Remove the ponytail auto-injection fallback (L156-157) since it becomes redundant
- Add `window.plausible()` custom event calls for conversions: demo booking, contact form, newsletter sign-up, pricing CTA
- Wire existing UTM capture to Plausible events so campaign attribution works
- Graceful degradation when Plausible is blocked (ad blockers, network failure)

**Non-Goals:**
- Cookie consent banner (separate task: IMP-0033 / FE-003)
- Error tracking / Sentry integration (separate task: DEV-002)
- Plausible dashboard or goal configuration (that's done in the Plausible UI)
- Analytics for the product app itself (this is marketing-site only)
- Server-side analytics or API-level telemetry

## Decisions

### 1. Include directives over ponytail auto-injection

**Rationale**: The `<!-- INCLUDE: analytics -->` pattern is documented in AGENTS.md and used by the other partials (nav, footer). The ponytail auto-injection was a quick fix. Moving to explicit includes makes the pattern visible in source, easier to audit, and removes the dual-injection risk (currently analytics is injected twice on competitive-positioning — once via include directive on L94, once via ponytail on L157).

**Alternative considered**: Keep the auto-injection and remove the include directive. Rejected — the include pattern is the documented standard for all other partials.

### 2. `trackEvent()` helper in core.js

A single `trackEvent(name, props?)` function that wraps `window.plausible()` with a null guard.

```js
function trackEvent(name, props) {
  if (typeof window.plausible === 'function') {
    window.plausible(name, { props: props || {} });
  }
}
```

**Rationale**: Centralizes the Plausible API call, adds the null guard, and keeps event names consistent. All conversion tracking in `core.js` calls through this single function.

### 3. UTM wiring at submission time

`getUTMParams()` already exists and reads UTM params from the URL. The existing `submitForm()` function already calls `getUTMParams()` for server-side submission. We'll extend `submitForm()` to also pass UTM params to `trackEvent()` on successful form submission, so campaign attribution flows to Plausible without additional client-side work.

### 4. Event naming convention

Use Plausible's recommended `Verb + Object` pattern:
- `Submit Demo Booking`
- `Submit Contact Form`
- `Sign Up Newsletter`
- `Click Pricing CTA`

Plausible auto-groups events by name in the dashboard.

### 5. Graceful degradation

The `trackEvent()` null guard ensures that if Plausible is blocked by an ad blocker or fails to load, no JS errors surface. The site functions normally without analytics — analytics is an enhancement, not a requirement.

## Risks / Trade-offs

- **Duplicate events on competitive-positioning** → Remove ponytail auto-injection, keep include directive only; one injection path guarantees single event fire
- **Ad blockers strip Plausible** → Null guard in `trackEvent()`; metrics will be undercounted but no errors thrown. This is inherent to any client-side analytics
- **Plausible `script.js` not loaded before core.js fires events** → `trackEvent()` is a wrapper, events fired before Plausible loads are silently dropped. Plausible is deferred anyway so this is unlikely; we fire events on user interaction (click, form submit), not on page load
- **Event naming drift** → Single `trackEvent()` function with string literal event names in known call sites prevents ad-hoc naming
