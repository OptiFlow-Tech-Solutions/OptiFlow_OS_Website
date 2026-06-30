# Tasks: VSI Master Index

## Phase: Apply

### T-001: Create features/VSI.md skeleton
- [x] Create document with project overview, phase map, feature inventory table
- [x] Add per-page breakdown section stubs for all 12 pages
- [x] Add dependency graph, traceability matrix, milestones
- **Files:** `features/VSI.md`
- **Deps:** none
- **AC:** VSI.md exists with complete skeleton structure

### T-002: Populate F-010 page-home child features + tasks
- [x] Decompose home page into 14 child features (hero, trust-bar, problems, etc.)
- [x] Define ~35 tasks with acceptance criteria, source file mappings, skill/agent routing
- **Files:** `features/features.json` (F-010 entry), `features/VSI.md`
- **Deps:** T-001
- **AC:** F-010 has 14 child features with all tasks defined

### T-003: Populate F-011 page-features child features + tasks
- [x] Decompose features page into 14 child features (sub-nav, hero, 12 module sections)
- [x] Define ~48 tasks
- **Files:** `features/features.json` (F-011 entry)
- **Deps:** T-001
- **AC:** F-011 has 14 child features with all tasks defined

### T-004: Populate F-012 page-pricing child features + tasks
- [x] Decompose pricing page into 6 child features, ~20 tasks
- **Files:** `features/features.json` (F-012 entry)
- **Deps:** T-001
- **AC:** F-012 child features and tasks defined

### T-005: Populate F-013 page-product-overview child features + tasks
- [x] Decompose into 9 child features, ~25 tasks
- **Deps:** T-001

### T-006: Populate F-014 page-why-optiflow child features + tasks
- [x] Decompose into 8 child features, ~22 tasks
- **Deps:** T-001

### T-007: Populate F-015 page-problem-solutions child features + tasks
- [x] Decompose into 6 child features, ~18 tasks
- **Deps:** T-001

### T-008: Populate F-016 page-demo-booking child features + tasks
- [x] Decompose into 7 child features, ~20 tasks
- **Deps:** T-001

### T-009: Populate F-017 page-contact child features + tasks
- [x] Decompose into 7 child features, ~18 tasks
- **Deps:** T-001

### T-010: Populate F-018 page-faq child features + tasks
- [x] Decompose into 6 child features, ~50 tasks
- **Deps:** T-001

### T-011: Populate F-019 page-newsletter child features + tasks
- [x] Decompose into 7 child features, ~22 tasks
- **Deps:** T-001

### T-012: Populate F-020 page-privacy-policy child features + tasks
- [x] Decompose into 3 child features, ~15 tasks
- **Deps:** T-001

### T-013: Populate F-021 page-terms child features + tasks
- [x] Decompose into 3 child features, ~12 tasks
- **Deps:** T-001

### T-014: Extend feature-router.mjs with hierarchy support
- [x] Add `resolveFeatureHierarchy(featureId)` export
- [x] Add `getChildFeature(featureId, childId)` export
- [x] Add `getTask(featureId, taskId)` export
- [x] Add `featuresByModule()` export (existing, verify)
- **Files:** `orchestrate/feature-router.mjs`
- **Deps:** T-002
- **AC:** All new exports work with any Feature ID

### T-015: Update coordinator.mjs — VSI-aware display
- [x] Add `summarizeFeatureHierarchy()` for tree display
- [x] Update `featureShow(featureId)` to show hierarchy
- [x] Add `featureListTree()` for full tree rendering
- **Files:** `orchestrate/coordinator.mjs`
- **Deps:** T-014
- **AC:** `/opsx:feature F-010` shows hierarchical tree

### T-016: Generate full VSI.md from features.json data
- [x] Generate per-page breakdown sections with child features and tasks
- [x] Generate dependency graph from hierarchical data
- [x] Generate traceability matrix with task→source file mappings
- **Files:** `features/VSI.md`
- **Deps:** T-002 through T-013
- **AC:** VSI.md contains complete hierarchical breakdown for all 12 pages

### T-017: Update TRACEABILITY.md with hierarchical links
- [x] Add child feature IDs to the Feature Index table
- [x] Add task-level file mappings
- [x] Add spec→child feature→task chain
- **Files:** `features/TRACEABILITY.md`
- **Deps:** T-016
- **AC:** TRACEABILITY.md references child features and tasks

### T-018: Create delta spec for orchestration-engine
- [x] Add requirement for hierarchical feature resolution
- [x] Add scenarios for child feature and task lookup
- **Files:** `openspec/changes/vsi-master-index/specs/orchestration-engine/delta.md`
- **Deps:** T-014
- **AC:** Delta spec exists with new requirements

### T-019: Build, validate, and verify
- [ ] Run `npm run build && npm run validate`
- [ ] Run `npm test` (Playwright E2E)
- [ ] Verify all existing functionality unchanged
- **Deps:** T-014, T-015
- **AC:** All 12 pages build successfully, all tests pass

## Verification Checklist

- [ ] `features/VSI.md` exists with full hierarchical breakdown
- [ ] `features/features.json` extended with `childFeatures` for all 12 pages
- [ ] `feature-router.mjs` exports hierarchy functions
- [ ] `coordinator.mjs` displays tree view
- [ ] `npm run build` completes successfully
- [ ] `npm run validate` passes
- [ ] `npm test` passes (Playwright E2E)
- [ ] Delta spec ready for archive
