# VSI Master Index — Vertical Slice Architecture for All 12 Pages

## Summary

Create the Master Vertical Slice Index (VSI) that decomposes the entire OptiFlow OS marketing website into a hierarchical spec-driven implementation roadmap. Each of the 12 pages becomes a Parent Feature, broken down into child features (page sections) and tasks (components). The VSI serves as both documentation of existing work and the forward-looking standard for all future development.

## Motivation

The feature registry (`features/features.json`) currently defines 39 flat features without hierarchical decomposition. The orchestration engine (`feature-router.mjs`) can auto-resolve context from a Feature ID but operates only at the flat feature level. This change introduces:

- Full hierarchical breakdown: Page → Child Feature → Task
- Single implementation roadmap: `features/VSI.md`
- Task-level traceability to OpenSpec specs, source files, and commits
- Enhanced orchestration engine that understands and displays the hierarchy

## Scope

1. Create `features/VSI.md` — Master Vertical Slice Index with complete feature inventory
2. Extend `features/features.json` with `childFeatures` and `tasks` arrays
3. Update `orchestrate/feature-router.mjs` with `resolveFeatureHierarchy()`, `getChildFeature()`, `getTask()`
4. Update `orchestrate/coordinator.mjs` with VSI-aware display methods
5. Update `features/TRACEABILITY.md` with hierarchical links
6. Create delta spec for orchestration-engine capability

## Affected Specs

- `openspec/specs/orchestration-engine/spec.md` — new requirement for hierarchical feature resolution
- `openspec/specs/marketing-pages/spec.md` — page structure maps to child features

## Non-Goals

- No changes to the 12 page HTML source files
- No new OpenSpec phases — uses existing explore/propose/apply/verify/archive
- No task-level orchestration routing (Feature ID remains primary entry point)
