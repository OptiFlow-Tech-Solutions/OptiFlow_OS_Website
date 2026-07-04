# Recovery Guide — ui-005-cookie-consent-privacy-compliance-1783156858511
**Task:** UI-005: Cookie Consent & Privacy Compliance
**Failed at:** 2026-07-04T09:27:34.462Z

## Failed Phases
- **VALIDATE**: Tests: Error: Cannot find package '@playwright/test' imported from D:\OptiFlow_OS_Website\tests\e2e\playwright.config.js
    at; Gate: GATE_A11Y; Validation LL5 (SEO), LL6 (A11y)

## Recovery Steps

```js
import { PipelineContext } from './orchestrate/auto-pipeline.mjs';
const ctx = PipelineContext.load("ui-005-cookie-consent-privacy-compliance-1783156858511");
if (!ctx) throw new Error("Context not found. Cannot resume.");
// Phases completed: 3
// Next phase to run: OPSX_EXPLORE
// Fix the underlying issue, then resume with:
// Re-run the failed phases or the remaining pipeline
```

## Suggested Commands

$ npm install @playwright/test
$ npm run build && npm run validate