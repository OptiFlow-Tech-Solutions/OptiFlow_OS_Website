#!/usr/bin/env node
/* ═══════════════════════════════════════════
   OptiFlow OS — Pre-Orchestrate Hook v13.0
   Validates orchestration engine prerequisites
   before /opsx-auto execution.
   Exits 0 on ready, 1 on missing prerequisites.
   ═══════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ORCHESTRATE, ok, fail, warn, hookBanner, getErrors, getWarnings, readText } from './_utils.mjs';

hookBanner('Pre-Orchestrate Validation');

// 1. Verify orchestration engine files exist
console.log('1. Orchestration Engine');
const requiredModules = [
  'auto-pipeline-v13.mjs',
  'auto-pipeline.mjs',
  'pipeline-context.mjs',
  'pipeline-engine.mjs',
  'state-manager.mjs',
  'skill-discovery.mjs',
  'capability-analyzer.mjs',
  'agent-router.mjs',
  'quality-gate.mjs',
  'validation-pipeline.mjs',
  'progress-tracker.mjs',
  'opsx-commands.mjs',
  'coordinator.mjs',
];
const missing = [];
for (const mod of requiredModules) {
  const fp = path.join(ORCHESTRATE, mod);
  if (fs.existsSync(fp)) {
    ok(`${mod}`);
  } else {
    fail(`${mod} missing`);
    missing.push(mod);
  }
}

// 2. Verify V13 modules
console.log('2. V13 Enterprise Modules');
const v13Modules = [
  'repository-snapshot.mjs',
  'agent-contracts.mjs',
  'execution-strategy.mjs',
  'skill-composer.mjs',
  'agent-composer.mjs',
  'iteration-controller.mjs',
  'telemetry.mjs',
];
for (const mod of v13Modules) {
  const fp = path.join(ORCHESTRATE, mod);
  if (fs.existsSync(fp)) {
    ok(`${mod}`);
  } else {
    fail(`${mod} missing (V13 module)`);
    missing.push(mod);
  }
}

// 3. Verify OpenSpec structure
console.log('3. OpenSpec Structure');
const openspecDir = path.join(ROOT, 'openspec');
const specsDir = path.join(openspecDir, 'specs');
const changesDir = path.join(openspecDir, 'changes');

if (fs.existsSync(openspecDir)) ok('openspec/');
else fail('openspec/ directory missing');
if (fs.existsSync(specsDir)) ok('openspec/specs/');
else fail('openspec/specs/ directory missing');
if (fs.existsSync(changesDir)) ok('openspec/changes/');
else fail('openspec/changes/ directory missing');

// 4. Verify state directory is writable
console.log('4. State Directory');
const stateDir = path.join(ORCHESTRATE, '.state');
if (fs.existsSync(stateDir)) {
  ok('orchestrate/.state/ exists');
} else {
  try {
    fs.mkdirSync(stateDir, { recursive: true });
    ok('orchestrate/.state/ created');
  } catch {
    fail('orchestrate/.state/ not writable');
  }
}

// 5. Verify Node.js version
console.log('5. Runtime Environment');
const nodeVersion = process.versions.node;
const major = parseInt(nodeVersion.split('.')[0], 10);
if (major >= 18) {
  ok(`Node.js ${nodeVersion}`);
} else {
  fail(`Node.js ${nodeVersion} — minimum 18 required`);
}

const pkgPath = path.join(ROOT, 'package.json');
if (fs.existsSync(pkgPath)) {
  ok('package.json found');
} else {
  fail('package.json not found');
}

// 6. Verify site.json and features
console.log('6. Project Data');
const sitePath = path.join(ROOT, 'site.json');
if (fs.existsSync(sitePath)) {
  ok('site.json');
} else {
  fail('site.json missing');
}

const featuresPath = path.join(ROOT, 'features', 'features.json');
if (fs.existsSync(featuresPath)) {
  ok('features/features.json');
} else {
  fail('features/features.json missing');
}

console.log(`\n${getErrors()} error(s), ${getWarnings()} warning(s)`);
process.exit(getErrors() > 0 ? 1 : 0);
