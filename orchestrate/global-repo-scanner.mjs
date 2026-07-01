/**
 * Scans the global ECC repository for available skills, agents, MCPs, hooks, commands, and rules.
 * V4: Dynamic path resolution, deep capability extraction from agent/skill definitions.
 * @module orchestrate/global-repo-scanner
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
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

/**
 * Extract capabilities from a skill's SKILL.md content.
 * Looks for: description, keywords, domain patterns, trigger conditions.
 */
function extractSkillCapabilities(text, fm) {
  const capabilities = [];
  const lower = text.toLowerCase();

  // Domain detection from skill text
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
  ];

  for (const [domain, re] of DOMAIN_PATTERNS) {
    if (re.test(lower)) capabilities.push(domain);
  }

  // Extract trigger phrases (when this skill should be used)
  const triggerSection = lower.match(/triggers?:?\s*\n([\s\S]*?)(?:\n\n|\n#|$)/);
  const triggers = triggerSection
    ? triggerSection[1].split('\n').map((l) => l.replace(/^[-*]\s*/, '').trim()).filter(Boolean)
    : [];

  return {
    domains: [...new Set(capabilities)],
    triggers,
    description: fm.description || '',
    version: fm.version || '1.0',
  };
}

/**
 * Extract capabilities from agent definitions.
 */
function extractAgentCapabilities(agent) {
  const desc = (agent.description || '').toLowerCase();
  const capabilities = [];

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

  for (const [role, re] of ROLE_PATTERNS) {
    if (re.test(desc)) capabilities.push(role);
  }

  return {
    roles: [...new Set(capabilities)],
    description: agent.description || '',
    model: agent.model || '',
  };
}

function scanSkills(globalSkillsDir) {
  if (!existsSync(globalSkillsDir)) return [];
  return readdirSync(globalSkillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const skillFile = join(globalSkillsDir, d.name, 'SKILL.md');
      if (!existsSync(skillFile)) return null;
      const text = readFileSync(skillFile, 'utf-8');
      const fm = parseFrontmatter(text);
      const capabilities = extractSkillCapabilities(text, fm);
      return {
        name: fm.name || d.name,
        path: skillFile,
        description: fm.description || '',
        keywords: (fm.description || '').toLowerCase().split(/[\s,]+/).filter(Boolean),
        domains: capabilities.domains,
        triggers: capabilities.triggers,
        version: capabilities.version,
      };
    })
    .filter(Boolean);
}

function scanAgents(globalAgentsCfg) {
  if (!existsSync(globalAgentsCfg)) return [];
  let obj;
  try { obj = JSON.parse(readFileSync(globalAgentsCfg, 'utf-8')); } catch { return []; }
  return Object.entries(obj.agent || {}).map(([name, a]) => ({
    name,
    description: a.description || '',
    model: a.model || '',
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
    name,
    type: m.url ? 'remote' : 'local',
    enabled: !!m.enabled,
  }));
}

function scanHooks(globalHooksDir) {
  const cfgPath = join(globalHooksDir, 'hooks.json');
  if (!existsSync(cfgPath)) return [];
  let obj;
  try { obj = JSON.parse(readFileSync(cfgPath, 'utf-8')); } catch { return []; }
  const hooks = [];
  for (const [event, entries] of Object.entries(obj.hooks || {})) {
    for (const entry of entries) {
      hooks.push({ id: entry.id || '', event, description: entry.description || '' });
    }
  }
  return hooks;
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
  return {
    skills: scanSkills(paths.globalSkillsDir),
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
