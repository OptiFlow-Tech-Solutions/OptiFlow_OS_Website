# Recovery Guide — id-ui-004-name-toast-notification-system-1783105632902
**Task:** id: UI-004, name: Toast & Notification System
**Failed at:** 2026-07-03T19:07:48.641Z

## Failed Phases
- **VALIDATE**: Lint: Command failed: npm run lint:all; Tests: Error: Cannot find package '@playwright/test' imported from D:\OptiFlow_OS_Website\tests\e2e\playwright.config.js
    at; Gate: GATE_A11Y; Validation LL5 (SEO), LL6 (A11y)

## Recovery Steps

```js
import { PipelineContext } from './orchestrate/auto-pipeline.mjs';
const ctx = PipelineContext.load("id-ui-004-name-toast-notification-system-1783105632902");
if (!ctx) throw new Error("Context not found. Cannot resume.");
// Phases completed: 7
// Next phase to run: VALIDATE
// Fix the underlying issue, then resume with:
// Re-run the failed phases or the remaining pipeline
```

## Suggested Commands

$ npm install @playwright/test
$ npm run lint -- --fix
$ npm run build && npm run validate