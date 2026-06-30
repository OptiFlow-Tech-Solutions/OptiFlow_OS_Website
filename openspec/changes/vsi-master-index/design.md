# Design: VSI Master Index

## Architecture Decisions

### 1. Hierarchical ID Scheme

```
F-010 (Parent Feature: page-home)
├── F-010-C-001 (Child Feature: hero-section)
│   ├── T-010-001 (Task: typewriter-text)
│   ├── T-010-002 (Task: dashboard-mockup)
│   └── T-010-003 (Task: mouse-glow)
├── F-010-C-002 (Child Feature: trust-bar)
│   ├── T-010-004 (Task: scrolling-logo-strip)
│   └── T-010-005 (Task: logo-fade-edges)
└── ...
```

**Pattern:** `F-{page}-C-{child}` for child features, `T-{page}-{task}` for tasks.

### 2. Data Model (features.json Extension)

Each feature entry gains optional `childFeatures` array:

```json
{
  "id": "F-010",
  "childFeatures": [{
    "id": "F-010-C-001",
    "name": "hero-section",
    "description": "Hero with typewriter, dashboard, mouse glow",
    "priority": "critical",
    "status": "complete",
    "tasks": [{
      "id": "T-010-001",
      "name": "typewriter-text",
      "description": "Cycling typewriter animation",
      "dependencies": ["F-003"],
      "sourceFiles": ["src/pages/home.html"],
      "lineRef": "L120-L180",
      "acceptanceCriteria": [...],
      "specs": ["marketing-pages"],
      "skills": ["frontend-patterns"],
      "agents": ["tdd-guide"],
      "priority": "critical",
      "status": "complete"
    }]
  }]
}
```

### 3. VSI.md Document Structure

```
# Master Vertical Slice Index
├── Project Overview
├── Phase Map (6 phases)
├── Feature Inventory Matrix (all 39 features)
├── Per-Page Breakdown (12 sections)
│   ├── Parent Feature details
│   ├── Child Feature Tree
│   ├── Task Registry Table
│   └── Component-to-Source Mapping
├── Dependency Graph
├── Traceability Matrix
├── Implementation Order
├── Milestone Map
└── Validation Checkpoints
```

### 4. Feature Router Extension

Three new exports on `feature-router.mjs`:

- `resolveFeatureHierarchy(featureId)` — returns full parent→children→tasks tree
- `getChildFeature(featureId, childId)` — specific child lookup
- `getTask(featureId, taskId)` — specific task lookup
- `resolveFeatureTree()` — existing, unmodified API

### 5. Coordinator Display Enhancement

`/opsx:feature F-010` now shows hierarchical tree instead of flat display.
`/opsx:feature list --tree` renders the full VSI tree for all pages.
