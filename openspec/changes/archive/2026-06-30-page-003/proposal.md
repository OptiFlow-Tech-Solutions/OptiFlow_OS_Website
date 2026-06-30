# PAGE-003: Product Overview

## Summary

The Product Overview page is the main platform exploration page — a 12-section deep-dive into every module, persona panel, workflow, and security feature of OptiFlow OS. It serves as the primary product information destination for prospects evaluating the full platform.

## Why

After understanding the problem (PAGE-002), prospects need to see exactly what OptiFlow OS does. This page transforms abstract promises ("one platform to run your business") into concrete modules, workflow flows, role-based panels, and permission matrices that answer "what does it actually do for me?"

## Capabilities

1. **Hero with Dashboard Mockup** — Floating animated dashboard card showing live KPI preview (completion %, tasks/month, attendance count, SOP adherence). Trust indicators: Built for MSMEs, Fast Deployment, Easy Adoption, High Accountability.

2. **Chaos-to-System Transform Flow** — Three-stage flow (Traditional Operations → OptiFlow OS → Systemised Operations) with color-coded stage cards and animated arrows.

3. **Product Vision Grid** — 6-card grid covering Single Source of Truth, Operational Excellence, Business Scalability, Process-Driven Culture, Visibility & Accountability, Owner Independence.

4. **Interactive Platform Architecture Diagram** — Radial hub-and-spoke diagram with 12 module nodes. Hover/Focus reveals tooltip with module name, description, and benefit. Includes SVG connection lines. Fully accessible with keyboard navigation and ARIA labels.

5. **Core Modules Spotlight** — 6 spotlight module cards (Task Management, Attendance, SOP Library, Reports & Analytics, Worklists, Checklist Management) with expandable "Show all 12 modules" toggle revealing 6 additional cards (Leave Management, Training, Inventory, Meetings, Verification, Notifications).

6. **Admin Panel** — Business owner visibility dashboard. 7 feature checkmarks (User Management, Role Management, Branch & Department, Attendance Monitoring, Executive Reports, Audit Trails, System Configuration). Dashboard preview with live metrics. 3 benefit cards for See/Control/Measure.

7. **Captain Panel** — Manager/supervisor dashboard with verification queue, team reports, leave approvals, performance visibility. Right-to-left layout direction swap.

8. **Doer Panel** — Employee workspace showing task center, attendance, checklists, leave requests, training, meetings. Desktop/Mobile device badges.

9. **Workflow Engine** — 5-step linear flow (Create → Assign → Execute → Verify → Report) with color-coded step numbers, connectors, and real-world examples for each step.

10. **Reporting Engine** — 4 KPI stat cards (92% completion, 87% on-time, 100% audit trail, ₹3.2L saved). 6 report type cards in a grid.

11. **Security & Permissions** — Role-based access matrix (Employee/Manager/Admin × 8 modules). 3 security feature cards: Role-Based Access, Audit Trails, Secure Authentication.

12. **CTA Section** — Gradient CTA section with Book Free Demo and Watch Product Tour buttons. Trust indicators.

## Scope

- Applies to: `src/pages/product-overview.html`
- Built to: `dist/product-overview/index.html`
- Active nav: Product
- Dependencies: core.css, core.js, nav component, footer component
- Interactive: Architecture hover tooltips, module expand/collapse toggle

## Affected Specs

- `marketing-pages` — Page inventory, metadata, navigation, footer, scroll-reveal
- `design-system` — CSS custom properties, dark mode, responsive breakpoints, z-index
- `dark-mode` — Full dark theme support for all 12 page sections
- `shared-components` — nav + footer injection, core.js animations
- `accessibility` — ARIA labels, keyboard navigation, skip link
- `build-pipeline` — Build assembly, SEO meta injection
