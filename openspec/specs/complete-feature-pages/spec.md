# complete-feature-pages

## Purpose

Ensure the Features and FeatureShowcase React pages render all their content sections — not placeholder stubs. The original migration left ~85% of these pages as placeholder text that read "Full feature section migrated from static HTML."

## Requirements

### Requirement: Features page has all 11 feature sections
The Features page SHALL render complete content for all 11 feature sections: Task Management, Checklist, Delegation, Worklists, Attendance, Leave Management, SOP Management, Training, Helpdesk, Reports & Analytics, and Notifications & Mobile.

#### Scenario: Task Management section renders
- **WHEN** user navigates to `/os/features`
- **THEN** the Task Management section displays a problem box, a 3-column card grid, and a dashboard preview table

#### Scenario: Remaining 10 feature sections render full content
- **WHEN** user navigates to `/os/features`
- **THEN** each of the 10 remaining sections displays a problem box, card grid, dashboard preview, and CTA matching the pattern established by the Task Management section

#### Scenario: No placeholder text visible
- **WHEN** user navigates to `/os/features`
- **THEN** no text reading "Full feature section migrated from static HTML" is visible on the page

### Requirement: FeatureShowcase page has all 6 transformation sections
The FeatureShowcase page SHALL render complete before/after transformation content for all 6 sections: T01 Task Management through T06 Leave Management.

#### Scenario: T01 Task Management section renders
- **WHEN** user navigates to `/os/feature-showcase`
- **THEN** the T01 section displays a ProblemBox, before/after card grid, dashboard metrics, and table preview

#### Scenario: Remaining 5 transformation sections render full content
- **WHEN** user navigates to `/os/feature-showcase`
- **THEN** each of T02 through T06 displays a complete before/after transformation matching their old HTML content

#### Scenario: No placeholder text visible
- **WHEN** user navigates to `/os/feature-showcase`
- **THEN** no text reading "Full before/after transformation section migrated from static HTML" is visible on the page

### Requirement: Content matches old HTML source
The content in completed Features and FeatureShowcase sections SHALL match the text, headings, and structure of the corresponding sections in the old HTML source pages.

#### Scenario: Section headings match old HTML
- **WHEN** comparing any completed React feature section heading with the corresponding heading in the old HTML
- **THEN** the text content is identical

#### Scenario: All list items and paragraphs are preserved
- **WHEN** comparing any completed React feature section with its old HTML counterpart
- **THEN** all list items, paragraphs, and structured data are present
