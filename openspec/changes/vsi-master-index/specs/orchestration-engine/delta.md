# Delta: Orchestration Engine — Hierarchical Feature Resolution

> Source: `openspec/specs/orchestration-engine/spec.md`
> Change: `vsi-master-index`

## Added Requirements

### Requirement: Hierarchical Feature Resolution

The engine SHALL support resolution of child features and tasks within a parent feature's hierarchical structure as defined in `features/features.json`.

#### Scenario: Child feature lookup

- **GIVEN** a parent feature F-010 (page-home) with child feature F-010-C-001 (hero-section)
- **WHEN** `resolveFeatureHierarchy("F-010")` is invoked
- **THEN** the returned context SHALL include the full tree of 14 child features
- **AND** each child feature SHALL include its tasks array
- **AND** the total task count for the feature SHALL be reported

#### Scenario: Task-level context reconstruction

- **GIVEN** task T-010-001 (typewriter-text) within child feature F-010-C-001
- **WHEN** `getTask("F-010", "T-010-001")` is invoked
- **THEN** the task object SHALL include: id, name, description, dependencies, sourceFiles, acceptanceCriteria, specs, skills, agents
- **AND** the parent feature and child feature IDs SHALL be included in the result

#### Scenario: Hierarchical tree display

- **GIVEN** `/opsx:feature F-010 --tree` is invoked
- **WHEN** the coordinator renders feature details
- **THEN** the output SHALL show the hierarchical tree: parent → child features → tasks
- **AND** each node SHALL display its status (complete/in-progress/pending)

### Requirement: Master Vertical Slice Index

The system SHALL maintain a Master Vertical Slice Index (`features/VSI.md`) that serves as the single implementation roadmap documenting the hierarchical decomposition of all features.

#### Scenario: VSI contains all pages

- **GIVEN** `features/VSI.md` is generated
- **WHEN** the document is inspected
- **THEN** it SHALL contain a per-page breakdown section for all 12 marketing pages
- **AND** each section SHALL list child features with their task counts
- **AND** the dependency graph SHALL be included
- **AND** the traceability matrix SHALL map tasks to source files

#### Scenario: VSI stays in sync with feature registry

- **GIVEN** `features/features.json` contains the canonical feature data
- **WHEN** `npm run validate` is executed
- **THEN** VSI.md's feature counts SHALL be verified against features.json
- **AND** discrepancies SHALL be reported as warnings
