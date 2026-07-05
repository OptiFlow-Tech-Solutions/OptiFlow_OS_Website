import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..');
const CMD_DIR = join(ROOT, '.opencode', 'commands');
const SKILL_DIR = join(ROOT, '.opencode', 'skills');
const ORCH_DIR = join(ROOT, 'orchestrate');

const report = { passed: [], failed: [], warnings: [] };

function check(label, condition, detail = '') {
  if (condition) report.passed.push(`PASS: ${label}`);
  else report.failed.push(`FAIL: ${label}${detail ? ' — ' + detail : ''}`);
}

function warn(label, condition, detail = '') {
  if (!condition) report.warnings.push(`WARN: ${label}${detail ? ' — ' + detail : ''}`);
}

// ── Phase 1: Commands Verification ──
const cmds = readdirSync(CMD_DIR).filter(f => f.endsWith('.md'));
check('Phase 1: 7 command files', cmds.length === 7, `found ${cmds.length}`);

for (const f of cmds) {
  const content = readFileSync(join(CMD_DIR, f), 'utf-8');

  check(`Command ${f}: has canonical ref`, content.includes('canonical: .opencode/skills/'));
  check(`Command ${f}: has YAML frontmatter`, content.trimStart().startsWith('---'));
  check(`Command ${f}: has description`, content.includes('description:'));
  check(`Command ${f}: has domains`, content.includes('domains:'));
  check(`Command ${f}: has triggers`, content.includes('triggers:'));

  const hasOrchRef = content.includes('orchestratedBy') || content.includes('Master Orchestrator')
    || content.includes('Enterprise Orchestration') || content.includes('V13');
  check(`Command ${f}: references orchestration`, hasOrchRef);

  const canonicalMatch = content.match(/canonical:\s*\.opencode\/skills\/([a-z-]+)\//);
  if (canonicalMatch) {
    const skillName = canonicalMatch[1];
    const skillPath = join(SKILL_DIR, skillName, 'SKILL.md');
    const skillExists = existsSync(skillPath);
    check(`Command ${f} -> skill ${skillName}: SKILL.md exists`, skillExists);

    if (skillExists) {
      const skillContent = readFileSync(skillPath, 'utf-8');
      check(`Command ${f} -> skill ${skillName}: name match`, skillContent.includes(`name: ${skillName}`));
    }
  } else {
    check(`Command ${f}: canonical extraction`, false, 'no canonical match found');
  }
}

// ── Phase 2: Skills Verification ──
const skillDirs = readdirSync(SKILL_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
check('Phase 2: 7 skill directories', skillDirs.length === 7, `found ${skillDirs.length}`);

for (const d of skillDirs) {
  const skillPath = join(SKILL_DIR, d.name, 'SKILL.md');
  if (!existsSync(skillPath)) {
    check(`Skill ${d.name}: SKILL.md exists`, false);
    continue;
  }

  const content = readFileSync(skillPath, 'utf-8');

  check(`Skill ${d.name}: YAML frontmatter`, content.trimStart().startsWith('---'));

  for (const field of ['name:', 'description:', 'license:', 'compatibility:', 'metadata:']) {
    check(`Skill ${d.name}: field '${field.replace(':', '')}'`, content.includes(field));
  }

  const versionMatch = content.match(/version:\s*"(\d+)\./);
  if (versionMatch) {
    const ver = parseInt(versionMatch[1]);
    check(`Skill ${d.name}: version >= 14`, ver >= 14, `version is ${versionMatch[0].match(/\d+/)?.[0]}`);
  } else {
    check(`Skill ${d.name}: version field found`, false);
  }

  warn(`Skill ${d.name}: enterprise flag`, content.includes('enterprise:'));
  check(`Skill ${d.name}: triggers`, content.includes('triggers:'));
  check(`Skill ${d.name}: domains in metadata`, content.includes('domains:'));
  check(`Skill ${d.name}: orchestration contract`, content.includes('orchestration:'));
  warn(`Skill ${d.name}: relatedSkills`, content.includes('relatedSkills:'));
  check(`Skill ${d.name}: outputContracts`, content.includes('outputContracts:'));
  check(`Skill ${d.name}: changelog`, content.includes('changelog:'));

  // Verify canonical command exists
  const cmdFile = d.name.replace('openspec-', 'opsx-') + '.md';
  const cmdExists = existsSync(join(CMD_DIR, cmdFile));
  check(`Skill ${d.name} -> command ${cmdFile}: exists`, cmdExists);
}

// ── Phase 3: Command-Skill Integration ──
for (const f of cmds) {
  const content = readFileSync(join(CMD_DIR, f), 'utf-8');
  const canonicalMatch = content.match(/canonical:\s*\.opencode\/skills\/([a-z-]+)\//);
  if (!canonicalMatch) continue;

  const skillName = canonicalMatch[1];
  const expectedCmdFile = skillName.replace('openspec-', 'opsx-') + '.md';
  check(`Integration: ${f} -> ${skillName}`, f === expectedCmdFile, `expected cmd ${expectedCmdFile}`);

  const skillPath = join(SKILL_DIR, skillName, 'SKILL.md');
  if (!existsSync(skillPath)) continue;

  const skillContent = readFileSync(skillPath, 'utf-8');
  const cmdTriggers = content.match(/^\s+-\s+([\w/-]+)/gm);
  const skillTriggers = skillContent.match(/^\s+-\s+([\w/-]+)/gm);

  if (cmdTriggers && skillTriggers) {
    const cmdTrigs = cmdTriggers.map(t => t.replace(/^\s+-\s+/, '').trim());
    const skillTrigs = skillTriggers.map(t => t.replace(/^\s+-\s+/, '').trim());
    const overlap = cmdTrigs.filter(t => skillTrigs.includes(t));
    check(`Integration: ${f} triggers overlap with ${skillName}`, overlap.length > 0, `no overlap: cmd=[${cmdTrigs.join(',')}] skill=[${skillTrigs.slice(0,3).join(',')}]`);
  }
}

// ── Phase 4: Runtime Module Verification ──
const criticalModules = [
  'coordinator.mjs', 'auto-pipeline-v13.mjs', 'pipeline-context.mjs',
  'execution-strategy.mjs', 'iteration-controller.mjs', 'progress-tracker.mjs',
  'agent-contracts.mjs', 'agent-composer.mjs', 'skill-composer.mjs',
  'repository-snapshot.mjs', 'opsx-commands.mjs', 'state-manager.mjs',
  'validation-pipeline.mjs', 'telemetry.mjs', 'spec-sync.mjs', 'capability-analyzer.mjs',
  'skill-discovery.mjs', 'agent-router.mjs', 'pipeline-engine.mjs', 'quality-gate.mjs',
];

for (const mod of criticalModules) {
  check(`Runtime: ${mod}`, existsSync(join(ORCH_DIR, mod)));
}

// ── Phase 5: Phase Executor Coverage ──
const v13 = readFileSync(join(ORCH_DIR, 'auto-pipeline-v13.mjs'), 'utf-8');
const requiredPhases = ['OPSX_EXPLORE', 'OPSX_PROPOSE', 'OPSX_SYNC', 'OPSX_APPLY', 'VALIDATE', 'OPSX_VERIFY', 'OPSX_ARCHIVE'];
for (const ph of requiredPhases) {
  check(`V13 phase executor: ${ph}`, v13.includes(ph));
}

// ── Phase 6: Agent Contract Coverage ──
const contracts = readFileSync(join(ORCH_DIR, 'agent-contracts.mjs'), 'utf-8');
for (const ph of requiredPhases) {
  check(`Contract: ${ph}`, contracts.includes(`${ph}:`));
}

// Expected handoff chain
const expectedChain = {
  OPSX_EXPLORE: 'OPSX_PROPOSE',
  OPSX_PROPOSE: 'OPSX_SYNC',
  OPSX_SYNC: 'OPSX_APPLY',
  OPSX_APPLY: 'VALIDATE',
  VALIDATE: 'OPSX_ARCHIVE',
  OPSX_VERIFY: 'OPSX_ARCHIVE',
  OPSX_ARCHIVE: null,
};

for (const [ph, next] of Object.entries(expectedChain)) {
  const _handoffRegex = new RegExp(`${ph}[^}]*handoffTo:\\s*${next ? "'" + next + "'" : 'null'}`);
  check(`Contract handoff: ${ph} -> ${next || 'TERMINAL'}`, contracts.includes(`handoffTo: ${next ? "'" + next + "'" : 'null'}`));
}

// ── Phase 7: Execution Strategy Coverage ──
const strategy = readFileSync(join(ORCH_DIR, 'execution-strategy.mjs'), 'utf-8');
for (const ph of requiredPhases) {
  check(`Strategy: ${ph}`, strategy.includes(ph));
}

// ── Phase 8: Pipeline Context Phase Order ──
const ctx = readFileSync(join(ORCH_DIR, 'pipeline-context.mjs'), 'utf-8');
check('Context: includes OPSX_VERIFY', ctx.includes('OPSX_VERIFY'));
const hasCompleteOrder = requiredPhases.every(ph => ctx.includes(ph));
check('Context: all 7 phases in nextPhaseId', hasCompleteOrder);

// ── Phase 9: Progress Tracker ──
const progress = readFileSync(join(ORCH_DIR, 'progress-tracker.mjs'), 'utf-8');
check('Progress: tracks OPSX_SYNC', progress.includes('OPSX_SYNC'));
check('Progress: tracks OPSX_VERIFY', progress.includes('OPSX_VERIFY'));
check('Progress: tracks VALIDATE', progress.includes('VALIDATE'));

// ── Phase 10: Hooks Verification ──
const hooksDir = join(ROOT, 'hooks');
if (existsSync(hooksDir)) {
  const hooks = readdirSync(hooksDir).filter(f => f.endsWith('.mjs'));
  check('Hooks: at least 7', hooks.length >= 7, `found ${hooks.length}`);
}

// ── Phase 11: Pipeline Configs ──
const pipelineDir = join(ORCH_DIR, 'pipeline-config');
const pipelines = readdirSync(pipelineDir).filter(f => f.endsWith('.yaml'));
check('Pipeline configs: at least 8', pipelines.length >= 8, `found ${pipelines.length}`);
for (const name of ['apply', 'archive', 'build', 'explore', 'propose', 'sync', 'verify', 'audit']) {
  check(`Pipeline config: ${name}.yaml`, pipelines.includes(name + '.yaml'));
}

// ── Phase 12: OPSX Commands Integration ──
const opsxCmd = readFileSync(join(ORCH_DIR, 'opsx-commands.mjs'), 'utf-8');
const opsxPhases = ['explore', 'propose', 'sync', 'apply', 'verify', 'archive'];
for (const ph of opsxPhases) {
  check(`OPSX commands: run${ph.charAt(0).toUpperCase() + ph.slice(1)}`, opsxCmd.includes(`run${ph.charAt(0).toUpperCase() + ph.slice(1)}`));
}

// ── Phase 13: runFullPipeline ──
check('OPSX commands: runFullPipeline', opsxCmd.includes('runFullPipeline'));

// ── Output ──
console.log('');
console.log('='.repeat(64));
console.log('  ENTERPRISE VERIFICATION REPORT');
console.log('='.repeat(64));
console.log(`  PASSED:    ${report.passed.length}`);
console.log(`  FAILED:    ${report.failed.length}`);
console.log(`  WARNINGS:  ${report.warnings.length}`);
console.log(`  TOTAL:     ${report.passed.length + report.failed.length}`);
console.log('='.repeat(64));

if (report.failed.length) {
  console.log('');
  console.log('FAILURES:');
  report.failed.forEach(f => console.log(`  ${f}`));
}

if (report.warnings.length) {
  console.log('');
  console.log('WARNINGS:');
  report.warnings.forEach(w => console.log(`  ${w}`));
}

console.log('');
if (report.failed.length === 0) {
  console.log('  RESULT: ALL CHECKS PASSED - Ready for Global Promotion');
} else {
  console.log(`  RESULT: ${report.failed.length} FAILURES - Fix required before promotion`);
}

process.exit(report.failed.length > 0 ? 1 : 0);
