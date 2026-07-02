/**
 * Scans the global ECC repository for available skills, agents, MCPs, hooks, commands, and rules.
 * V5: Extended scan sources — skills/ dir, top-level monorepos, .opencode/skills/, .agents/skills/.
 * @module orchestrate/global-repo-scanner
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { resolvePaths, globalRepoExists } from './config-resolver.mjs';
import { get as cacheGet, set as cacheSet } from './cache-manager.mjs';

const CACHE_KEY = 'global-repo-scan';
const CACHE_TTL = 3600000; // 1hr

function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\n---/);
  if (!m) return {};
  const map = {};
  for (const line of m[1].split('\n')) {
    const r = line.match(/^([\w-]+):\s*(.+)/);
    if (r) map[r[1].trim()] = r[2].trim();
  }
  return map;
}

/** Known top-level monorepo skills with their canonical names */
const MONOREPO_MAP = Object.freeze({
  'accessibility-pro': {
    name: 'accessibility-pro',
    description: 'Adobe React Spectrum — WAI-ARIA patterns, 33 component specs, 4 AI coding rules',
    domains: ['accessibility', 'design', 'frontend'],
    source: 'monorepo',
  },
  'motion-master': {
    name: 'motion-master',
    description: 'Framer Motion — React animation library, improve/fix agent skills, 38 implementation plans',
    domains: ['frontend', 'design', 'performance'],
    source: 'monorepo',
  },
  'design-system-master': {
    name: 'design-system-master',
    description: 'shadcn/ui v4 — component library, 6 rule files, CLI docs, 10 project templates',
    domains: ['design', 'frontend'],
    source: 'monorepo',
  },
  'component-architecture': {
    name: 'component-architecture',
    description: 'Bulletproof React — architecture patterns, 12 docs, 3 reference apps, project structure',
    domains: ['frontend', 'design', 'quality'],
    source: 'monorepo',
  },
  'performance-optimization': {
    name: 'performance-optimization',
    description: 'Next.js framework — 17 agent skills, cache optimization, bundle-size patterns',
    domains: ['performance', 'frontend', 'build'],
    source: 'monorepo',
  },
});

const DOMAIN_PATTERNS = [
  ['design', /design|css|color|typography|spacing|component|ui|visual|style|brand/i],
  ['frontend', /frontend|react|vue|angular|component|page|html|dom|browser/i],
  ['backend', /backend|api|server|database|postgres|mysql|endpoint/i],
  ['build', /build|compile|bundle|assemble|dist|deploy/i],
  ['accessibility', /a11y|wcag|aria|contrast|focus|keyboard|screen.reader|accessible/i],
  ['seo', /seo|meta|sitemap|search.engine|ranking|structured.data/i],
  ['content', /content|copy|writing|article|blog|newsletter/i],
  ['quality', /test|validate|lint|check|review|audit|code.quality/i],
  ['security', /security|vuln|xss|csrf|injection|auth|secret|encrypt/i],
  ['performance', /perf|speed|latency|benchmark|lighthouse|core.web/i],
  ['deploy', /deploy|publish|ship|release|cloudflare|netlify|vercel|workers/i],
  ['testing', /test|e2e|playwright|cypress|jest|vitest|spec|coverage/i],
  ['data', /data|database|sql|schema|migration|postgres|mysql|prisma/i],
  ['mobile', /ios|android|swift|kotlin|flutter|react.native/i],
  ['animation', /animate|motion|stagger|reveal|transition|scroll|spring|keyframe/i],
];

function extractDomains(text) {
  const lower = text.toLowerCase();
  return DOMAIN_PATTERNS.filter(([, re]) => re.test(lower)).map(([d]) => d);
}

function extractTriggers(text) {
  const lower = text.toLowerCase();
  const s = lower.match(/triggers?:?\s*\n([\s\S]*?)(?:\n\n|\n#|$)/);
  return s ? s[1].split('\n').map((l) => l.replace(/^[-*]\s*/, '').trim()).filter(Boolean) : [];
}

function extractSkillCapabilities(text, fm) {
  return {
    domains: [...new Set(extractDomains(text))],
    triggers: extractTriggers(text),
    description: fm.description || '',
    version: fm.version || '1.0',
  };
}

function extractAgentCapabilities(agent) {
  const desc = (agent.description || '').toLowerCase();
  const ROLE_PATTERNS = [
    ['planning', /plan|architect|design|blueprint|roadmap|strategy/i],
    ['implementation', /implement|code|build|develop|write|create/i],
    ['testing', /test|e2e|playwright|coverage|spec|verify/i],
    ['review', /review|audit|inspect|examine/i],
    ['security', /security|vuln|threat|attack|protect/i],
    ['debugging', /debug|fix|resolve|troubleshoot|error|bug/i],
    ['documentation', /doc|readme|guide|tutorial|spec/i],
    ['operations', /deploy|release|monitor|operate|run/i],
    ['refactoring', /refactor|clean|improve|optimize|restructure/i],
    ['analysis', /analyze|research|investigate|explore|understand/i],
  ];
  const roles = ROLE_PATTERNS.filter(([, re]) => re.test(desc)).map(([r]) => r);
  return { roles: [...new Set(roles)], description: agent.description || '', model: agent.model || '' };
}

// ── Standard skills/ dir scan ──

function scanSkills(globalSkillsDir) {
  if (!existsSync(globalSkillsDir)) return [];
  return readdirSync(globalSkillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const skillFile = join(globalSkillsDir, d.name, 'SKILL.md');
      if (!existsSync(skillFile)) return null;
      const text = readFileSync(skillFile, 'utf-8');
      const fm = parseFrontmatter(text);
      const cap = extractSkillCapabilities(text, fm);
      return {
        name: fm.name || d.name, path: skillFile,
        description: fm.description || '',
        keywords: (fm.description || '').toLowerCase().split(/[\s,]+/).filter(Boolean),
        domains: cap.domains, triggers: cap.triggers, version: cap.version,
        source: 'skills-dir',
      };
    })
    .filter(Boolean);
}

// ── Top-level monorepo scan ──

function scanMonorepos(globalRoot) {
  if (!existsSync(globalRoot)) return [];
  return Object.entries(MONOREPO_MAP)
    .filter(([dir]) => existsSync(join(globalRoot, dir)))
    .map(([dir, meta]) => scanMonorepo(join(globalRoot, dir), dir, meta))
    .filter(Boolean)
    .flat();
}

function scanMonorepo(rootPath, dirName, meta) {
  const entries = [];
  const skillFiles = findFilesRecursive(rootPath, 'SKILL.md');
  const agentFiles = findFilesRecursive(rootPath, 'AGENTS.md');
  const claudeFiles = findFilesRecursive(rootPath, 'CLAUDE.md');
  const ruleFiles = [
    ...findFilesRecursive(rootPath, null, (p) => p.endsWith('.mdc')),
    ...findFilesRecursive(rootPath, null, (p) => p.includes('rules') && p.endsWith('.md')),
  ];

  // Main skill entry — use first available file, or fallback to metadata
  const bestPath = skillFiles[0] || agentFiles[0] || claudeFiles[0];
  entries.push({
    name: meta.name,
    path: bestPath || join(rootPath, 'SKILL.md'),
    description: meta.description,
    keywords: meta.description.toLowerCase().split(/[\s,]+/).filter(Boolean),
    domains: meta.domains,
    triggers: [],
    version: '1.0',
    source: meta.source,
    sourceRoot: rootPath,
    resourceCounts: {
      skillFiles: skillFiles.length,
      agentFiles: agentFiles.length,
      ruleFiles: ruleFiles.length,
    },
  });

  // Index each discovered SKILL.md as a sub-capability
  for (const sf of skillFiles) {
    try {
      const text = readFileSync(sf, 'utf-8');
      const fm = parseFrontmatter(text);
      const cap = extractSkillCapabilities(text, fm);
      const subKey = sf.replace(rootPath, '').replace(/\\/g, '/');
      entries.push({
        name: fm.name || `${meta.name}/${subKey}`,
        path: sf,
        description: fm.description || `Sub-skill in ${meta.name}`,
        keywords: (fm.description || '').toLowerCase().split(/[\s,]+/).filter(Boolean),
        domains: cap.domains,
        triggers: cap.triggers,
        version: cap.version,
        source: meta.source,
        parent: meta.name,
        isSubSkill: true,
      });
    } catch { /* skip unreadable */ }
  }

  // Index agent/CLAUDE docs
  for (const af of [...agentFiles, ...claudeFiles]) {
    const subKey = af.replace(rootPath, '').replace(/\\/g, '/');
    entries.push({
      name: `${meta.name}${subKey}`,
      path: af,
      description: `Agent guide for ${meta.name}`,
      keywords: [meta.name, 'guide', 'agent'],
      domains: meta.domains,
      triggers: [],
      version: '1.0',
      source: meta.source,
      parent: meta.name,
      isAgentDoc: true,
    });
  }

  // Index rule files
  for (const rf of ruleFiles) {
    const rel = rf.replace(rootPath, '').replace(/\\/g, '/');
    entries.push({
      name: `${meta.name}${rel}`,
      path: rf,
      description: `Coding rule for ${meta.name}`,
      keywords: [meta.name, 'rule', ...extractDomains(readFileSync(rf, 'utf-8'))],
      domains: extractDomains(readFileSync(rf, 'utf-8')),
      triggers: [],
      version: '1.0',
      source: meta.source,
      parent: meta.name,
      isRule: true,
    });
  }

  return entries;
}

function findFilesRecursive(root, filename, extraFilter) {
  const results = [];
  try { _walk(root, root, true); } catch { /* skip */ }
  return results;

  function _walk(dir, base, topLevel) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith('.git') || e.name === 'node_modules' || e.name === 'dist') continue;
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        if (!topLevel && e.name.startsWith('.')) continue;
        _walk(full, base, false);
      } else if (e.isFile()) {
        if (filename && e.name === filename) results.push(full);
        if (extraFilter && extraFilter(full)) results.push(full);
      }
    }
  }
}

// ── .opencode/skills/ and .agents/skills/ scan ──

function scanDotSkills(skillsDir) {
  if (!existsSync(skillsDir)) return [];
  return readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const skillFile = join(skillsDir, d.name, 'SKILL.md');
      if (!existsSync(skillFile)) return null;
      const text = readFileSync(skillFile, 'utf-8');
      const fm = parseFrontmatter(text);
      const cap = extractSkillCapabilities(text, fm);
      return {
        name: fm.name || d.name, path: skillFile,
        description: fm.description || '',
        keywords: (fm.description || '').toLowerCase().split(/[\s,]+/).filter(Boolean),
        domains: cap.domains, triggers: cap.triggers, version: cap.version,
        source: 'dot-skills',
      };
    })
    .filter(Boolean);
}

// ── Legacy scanners ──

function scanAgents(globalAgentsCfg) {
  if (!existsSync(globalAgentsCfg)) return [];
  let obj;
  try { obj = JSON.parse(readFileSync(globalAgentsCfg, 'utf-8')); } catch { return []; }
  return Object.entries(obj.agent || {}).map(([name, a]) => ({
    name, description: a.description || '', model: a.model || '',
    capabilities: extractAgentCapabilities(a),
  }));
}

function scanMCP(globalMcpCfg) {
  if (!existsSync(globalMcpCfg)) return [];
  let obj;
  try {
    const raw = readFileSync(globalMcpCfg, 'utf-8');
    const cleaned = raw.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    obj = JSON.parse(cleaned);
  } catch { return []; }
  return Object.entries(obj.mcp || {}).map(([name, m]) => ({
    name, type: m.url ? 'remote' : 'local', enabled: !!m.enabled,
  }));
}

function scanHooks(globalHooksDir) {
  const cfgPath = join(globalHooksDir, 'hooks.json');
  if (!existsSync(cfgPath)) return [];
  let obj;
  try { obj = JSON.parse(readFileSync(cfgPath, 'utf-8')); } catch { return []; }
  return Object.entries(obj.hooks || {}).flatMap(([event, entries]) =>
    entries.map((e) => ({ id: e.id || '', event, description: e.description || '' }))
  );
}

function scanCommands(globalCommandsDir) {
  if (!existsSync(globalCommandsDir)) return [];
  return readdirSync(globalCommandsDir, { withFileTypes: true })
    .filter((f) => f.isFile() && f.name.endsWith('.md'))
    .map((f) => {
      const text = readFileSync(join(globalCommandsDir, f.name), 'utf-8');
      const fm = parseFrontmatter(text);
      return { name: f.name.replace(/\.md$/, ''), description: fm.description || '' };
    });
}

export function scanGlobalRepo() {
  if (!globalRepoExists()) return { skills: [], agents: [], mcpServers: [], hooks: [], commands: [], rules: [] };

  const paths = resolvePaths();
  const standardSkills = scanSkills(paths.globalSkillsDir);
  const monorepoSkills = scanMonorepos(paths.globalRoot);
  const dotOpencodeSkills = scanDotSkills(join(paths.globalRoot, '.opencode', 'skills'));
  const dotAgentsSkills = scanDotSkills(join(paths.globalRoot, '.agents', 'skills'));

  // Deduplicate: prefer monorepo entries, then standard, then dot-skills
  const seen = new Set();
  const allSkills = [];
  for (const s of [...monorepoSkills, ...standardSkills, ...dotOpencodeSkills, ...dotAgentsSkills]) {
    if (seen.has(s.name)) continue;
    seen.add(s.name);
    allSkills.push(s);
  }

  return {
    skills: allSkills,
    agents: scanAgents(paths.globalAgentsCfg),
    mcpServers: scanMCP(paths.globalMcpCfg),
    hooks: scanHooks(paths.globalHooksDir),
    commands: scanCommands(paths.globalCommandsDir),
    rules: [],
  };
}

export function cachedScan() {
  const cached = cacheGet(CACHE_KEY);
  if (cached) return cached;

  const result = scanGlobalRepo();
  cacheSet(CACHE_KEY, result, { ttl: CACHE_TTL });
  return result;
}
