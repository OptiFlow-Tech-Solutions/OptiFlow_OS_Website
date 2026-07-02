/**
 * Tests for visual-verify.mjs — smoke test for module exports.
 * Full event-capture testing requires the harness (Playwright MCP) in the loop.
 *
 * Usage: node tests/visual-verify.test.mjs
 */

import { startDevServer, stopDevServer, screenshot, checkErrors, interact, verifyPage, setMaxIterations, getDevPort } from '../orchestrate/visual-verify.mjs';

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) { passed++; console.log(`  PASS: ${label}`); }
  else { failed++; console.log(`  FAIL: ${label}`); }
}

console.log('\n=== Visual Verify Smoke Tests ===');

// Config
setMaxIterations(3);
assert(true, 'setMaxIterations(3)');

const port = getDevPort();
assert(port === 3000, `default port = ${port}`);

// screenshot — should not throw
try {
  const r = await screenshot('http://localhost:3000/', 'smoke-test');
  assert(r.taken === true, 'screenshot() returned { taken: true }');
} catch (e) {
  failed++; console.log(`  FAIL: screenshot() threw: ${e.message}`);
}

// checkErrors — should not throw
try {
  const r = await checkErrors('http://localhost:3000/');
  assert(r.checked === true, 'checkErrors() returned { checked: true }');
} catch (e) {
  failed++; console.log(`  FAIL: checkErrors() threw: ${e.message}`);
}

// interact — should not throw
try {
  const r = await interact('http://localhost:3000/', { action: 'click' });
  assert(r.ran === true, 'interact() returned { ran: true }');
} catch (e) {
  failed++; console.log(`  FAIL: interact() threw: ${e.message}`);
}

// startDevServer — may fail if dist/ not built; should not throw
try {
  const r = await startDevServer(3000);
  assert(typeof r.started === 'boolean', `startDevServer() returned started=${r.started}`);
  // Clean up
  await stopDevServer();
  assert(true, 'stopDevServer() completed');
} catch (e) {
  failed++; console.log(`  FAIL: startDevServer/stopDevServer threw: ${e.message}`);
}

// verifyPage — should not throw
try {
  const r = await verifyPage('/', 3000);
  assert(typeof r.passed === 'boolean', 'verifyPage() returned { passed }');
} catch (e) {
  failed++; console.log(`  FAIL: verifyPage() threw: ${e.message}`);
}

console.log(`\n${'='.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed of ${passed + failed} total`);
console.log(`${'='.repeat(40)}\n`);

process.exit(failed > 0 ? 1 : 0);
