/**
 * Tests for auto-pipeline.mjs — resolution logic benchmarks.
 * Does NOT exercise the full pipeline, only the resolution and routing logic.
 *
 * Usage: node tests/auto-pipeline.test.mjs
 */

import { resolveFeatureFromTask } from '../orchestrate/feature-router.mjs';
import { analyzeTask } from '../orchestrate/capability-analyzer.mjs';
import { composeSkills } from '../orchestrate/skill-router.mjs';
import { routeAgents } from '../orchestrate/agent-router.mjs';
import { loadFullContext } from '../orchestrate/context-loader.mjs';

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) { passed++; console.log(`  PASS: ${label}`); }
  else { failed++; console.log(`  FAIL: ${label}`); }
}

// ── Feature resolution tests ──

console.log('\n=== Feature Resolution ===');

const tests = [
  { input: 'Build the Pricing Page', expectedId: 'PAGE-006' },
  { input: 'Implement Authentication', expectedId: 'API-002' },
  { input: 'Fix the Dashboard', expectedId: 'API-003' },
  { input: 'Redesign the Hero Section', expectedId: 'PAGE-001' },
  { input: 'Create the Inventory Module', expectedId: 'PAGE-003' }, // maps to product overview
  { input: 'Improve the Navigation Bar', expectedId: 'SYS-002' },
  { input: 'Add newsletter subscription', expectedId: 'PAGE-007' },
  { input: 'Build Demo Booking page', expectedId: 'LEAD-001' },
  { input: 'Fix contact form', expectedId: 'LEAD-002' },
  { input: 'Set up email notifications', expectedId: 'API-004' },
  { input: 'Add accessibility compliance', expectedId: 'QA-001' },
  { input: 'Run SEO optimization', expectedId: 'SYS-005' },
  { input: 'Fix responsive layout', expectedId: 'QA-003' },
  { input: 'Update competitive positioning', expectedId: 'PAGE-005' },
  { input: 'Add dark mode support', expectedId: 'SYS-001' },
];

for (const { input, expectedId } of tests) {
  const result = resolveFeatureFromTask(input);
  const match = result.featureId === expectedId;
  assert(match, `${input} → ${result.featureId}${result.featureId !== expectedId ? ` (expected ${expectedId})` : ''} (${(result.confidence * 100).toFixed(0)}%)`);
}

// ── Intent analysis tests ──

console.log('\n=== Intent Analysis ===');

const intentTests = [
  { input: 'Build the Pricing Page', expectedIntent: ['pricing-page', 'create-page'] },
  { input: 'Fix the Hero Section', expectedIntent: ['hero-redesign'] },
  { input: 'Add newsletter subscription', expectedIntent: ['newsletter-add'] },
  { input: 'Set up email notifications', expectedIntent: ['email-setup'] },
  { input: 'Fix broken layout', expectedIntent: ['layout-fix'] },
  { input: 'Improve the nav bar', expectedIntent: ['nav-improve'] },
  { input: 'Build an API endpoint', expectedIntent: ['api-build'] },
];

for (const { input, expectedIntent } of intentTests) {
  const analysis = analyzeTask(input);
  const match = expectedIntent.some((ei) => analysis.intents.includes(ei));
  assert(match, `${input} → intents: ${analysis.intents.join(', ')} (expected one of: ${expectedIntent.join(', ')})`);
}

// ── Skill composition tests ──

console.log('\n=== Skill Composition ===');

const skillTests = [
  { input: 'Build a new landing page', minSkills: 3 },
  { input: 'Fix hero section', minSkills: 2 },
  { input: 'Build pricing page', minSkills: 2 },
  { input: 'Setup email notifications', minSkills: 1 },
];

for (const { input, minSkills } of skillTests) {
  const skills = composeSkills(input);
  assert(skills ? skills.length >= minSkills : false, `${input} → ${skills ? skills.length : 0} skills (min ${minSkills})`);
}

// ── Agent routing tests ──

console.log('\n=== Agent Routing ===');

const agentTests = [
  { input: 'Build Pricing Page', domains: ['frontend', 'design'] },
  { input: 'Implement Authentication', domains: ['frontend', 'security', 'backend'] },
  { input: 'Fix the Dashboard', domains: ['frontend', 'quality'] },
  { input: 'Set up email', domains: ['backend', 'api'] },
];

for (const { input, domains } of agentTests) {
  const route = routeAgents(domains, 'standard', 'main', input);
  assert(route.primaryAgent !== 'tdd-guide' || route.supportAgents.length > 0,
    `${input} → primary: ${route.primaryAgent}, support: [${route.supportAgents.join(', ') || 'none'}]`);
}

// ── Context loading test ──

console.log('\n=== Context Loading ===');

const context = loadFullContext('Build the Pricing Page');
assert(context.site !== null, 'site.json loaded');
assert(context.design !== null, 'DESIGN.md loaded');
assert(context.features !== null, 'features.json loaded');
assert(context.specs.length > 0, `specs loaded: ${context.specs.length}`);
assert(context.affected.length > 0, `affected specs: ${context.affected.length}`);

// ── Summary ──

console.log(`\n${'='.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed of ${passed + failed} total`);
console.log(`${'='.repeat(40)}\n`);

process.exit(failed > 0 ? 1 : 0);
