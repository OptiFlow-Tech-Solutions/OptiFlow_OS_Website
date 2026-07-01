## Context

The FAQ page (`src/pages/faq.html`, 308 lines) currently has a hero with search, 4 category tabs, 42 static FAQ items in accordions, micro-CTAs between sections, and a bottom CTA. The page uses core.css for accordion components and has inline JS for category filtering and client-side search. It is a purely static Q&A page — no interactive self-service tools.

## Goals / Non-Goals

**Goals:**
- Add self-service toolbar with quick-access cards (Video Tutorials, SOP Library, Guided Setup, Troubleshooting)
- Add yes/no feedback buttons on each FAQ answer with follow-up prompt
- Add related-question links at the bottom of each answer
- Add a guided troubleshooting widget (3-step selector: category → problem → resolution)
- Add "Still need help?" escalation section before the CTA
- Enhance search to show match count and highlight terms

**Non-Goals:**
- No backend/API — all self-service tools are client-side only
- No chatbot or AI agent
- No new external dependencies
- No changes to nav, footer, or other shared components
- No changes to FAQ content (questions/answers remain as-is)

## Decisions

1. **Vanilla JS only** — All interactivity uses plain JavaScript (no frameworks). Matches existing codebase pattern. All code in page-level `<script>` blocks, same as current FAQ page JS.

2. **New components in page `<style>` block, then promote to `core.css`** — FAQ-specific components (feedback buttons, related links, troubleshooting widget) start in the page's `<style>` block. If they prove reusable elsewhere, promote to `core.css`. This follows the AGENTS.md rule of not putting component styles in page files except when page-specific.

3. **Feedback state persistence via localStorage** — "Was this helpful?" votes persist per-question in `localStorage` so users don't see the prompt again for already-voted items. Key format: `faq-feedback-{question-index}`.

4. **Troubleshooting widget as a `<select>`-driven decision tree** — Three cascading selects (Category → Problem → Resolution). The simplest approach that works. No complex UI — just native `<select>` elements styled to match the design system. Avoids the complexity of a custom component.

5. **Related questions as static data** — A JavaScript object mapping each question index to 2-3 related questions, injected after DOM load. Simpler than trying to compute related questions algorithmically.

6. **Search enhancement: live count + mark wrapping** — Add a `.search-count` element showing "X matches" and wrap matched text in `<mark>` tags for visual highlighting. Uses existing search logic, just adds display.

## Risks / Trade-offs

- [Related question links break if FAQ order changes] → Index-based mapping; if questions are reordered, update the `relatedMap` object in JS
- [localStorage feedback data is browser-specific] → This is intentional — feedback is anonymous and per-browser; no backend needed
- [Troubleshooting content may become stale] → Resolutions link to existing pages (demo, contact, pricing) rather than containing duplicated content
