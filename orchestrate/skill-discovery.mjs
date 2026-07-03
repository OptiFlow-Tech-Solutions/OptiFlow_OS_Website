/**
 * V6 Global + project skill archive discovery.
 * Dynamically scans ~/.config/opencode/skills/ (271 global skills) and
 * .opencode/skills/ (6 project skills), parses SKILL.md metadata,
 * scores relevance against a task description, and returns top N.
 * @module orchestrate/skill-discovery
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { resolvePaths, globalResourceExists } from './config-resolver.mjs';
import { get as cacheGet, set as cacheSet, hashKey } from './cache-manager.mjs';

const { projectRoot, globalSkillsDir } = resolvePaths();
const PROJECT_SKILLS_DIR = join(projectRoot, '.opencode', 'skills');

/** @typedef {{name: string, path: string, description: string, triggers: string[], domains: string[], score: number}} DiscoveredSkill */

/**
 * Parse frontmatter from a SKILL.md file.
 * @returns {{name: string, description: string, triggers: string[]}}
 */
function parseSkillMd(filePath) {
  let name = '';
  let description = '';
  const triggers = [];
  let inFrontmatter = false;
  let frontmatterDone = false;

  try {
    const lines = readFileSync(filePath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === '---') {
        if (!inFrontmatter) { inFrontmatter = true; continue; }
        if (inFrontmatter) { frontmatterDone = true; continue; }
      }
      if (inFrontmatter && !frontmatterDone) {
        if (trimmed.startsWith('name:')) name = trimmed.replace(/^name:\s*/i, '').replace(/["']/g, '').trim();
        if (trimmed.startsWith('description:')) description = trimmed.replace(/^description:\s*/i, '').trim();
      }
      if (frontmatterDone || !inFrontmatter) {
        const lower = trimmed.toLowerCase();
        if (lower.includes('trigger') && lower.includes(':')) {
          const triggersStr = trimmed.split(':').slice(1).join(':').trim();
          triggers.push(...triggersStr.split(',').map((t) => t.trim().toLowerCase()));
        }
        if (lower.startsWith('use when') || lower.startsWith('use this skill when')) {
          triggers.push(trimmed.replace(/^use\s*(this\s*)?(skill\s*)?when\s*/i, '').trim().toLowerCase());
        }
        // Also capture any quoted patterns in the doc body
        const quotedPatterns = trimmed.match(/`([^`]+)`/g);
        if (quotedPatterns) {
          for (const p of quotedPatterns) {
            triggers.push(p.replace(/`/g, '').trim().toLowerCase());
          }
        }
      }
    }
  } catch { /* corrupted/missing */ }

  return { name, description, triggers };
}

/**
 * Map description and triggers to domains.
 */
function inferDomains(description, triggers) {
  const domainMap = {
    accessibility: ['accessibility', 'a11y', 'wcag', 'aria', 'screen reader', 'keyboard nav'],
    design: ['design', 'css', 'style', 'visual', 'layout', 'color', 'typography', 'component', 'icon', 'ui'],
    frontend: ['frontend', 'react', 'next', 'vue', 'angular', 'component', 'state', 'hook', 'page'],
    backend: ['backend', 'api', 'server', 'express', 'django', 'laravel', 'route', 'endpoint'],
    testing: ['test', 'tdd', 'e2e', 'playwright', 'cypress', 'unit', 'coverage', 'mock'],
    security: ['security', 'auth', 'vuln', 'xss', 'csrf', 'injection', 'secret', 'compliance'],
    performance: ['perf', 'speed', 'optimize', 'lighthouse', 'bundle', 'core web vital'],
    seo: ['seo', 'meta', 'sitemap', 'structured data', 'search engine'],
    deployment: ['deploy', 'publish', 'ship', 'release', 'ci/cd', 'docker', 'cloud'],
    documentation: ['doc', 'readme', 'guide', 'tutorial', 'spec', 'documentation'],
    content: ['content', 'blog', 'article', 'newsletter', 'copy', 'writing', 'marketing'],
    animation: ['animate', 'motion', 'stagger', 'reveal', 'transition', 'spring'],
    data: ['database', 'postgres', 'mysql', 'schema', 'query', 'orm', 'migration'],
    infrastructure: ['docker', 'kubernetes', 'k8s', 'nginx', 'server', 'hosting'],
    git: ['git', 'commit', 'branch', 'pr', 'merge', 'workflow'],
    architecture: ['architecture', 'clean arch', 'hexagonal', 'monolith', 'microservice'],
  };

  const text = (description + ' ' + triggers.join(' ')).toLowerCase();
  const domains = [];
  for (const [domain, keywords] of Object.entries(domainMap)) {
    if (keywords.some((kw) => text.includes(kw))) {
      domains.push(domain);
    }
  }
  return domains.length ? domains : ['general'];
}

/**
 * Scan a skills directory for SKILL.md files.
 * @returns {DiscoveredSkill[]}
 */
function scanSkillsDir(dir) {
  if (!existsSync(dir)) return [];
  const skills = [];
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const skillMd = join(dir, entry.name, 'SKILL.md');
      if (!existsSync(skillMd)) continue;
      const parsed = parseSkillMd(skillMd);
      if (!parsed.name) parsed.name = entry.name;
      const domains = inferDomains(parsed.description, parsed.triggers);
      skills.push({
        name: parsed.name,
        path: skillMd,
        description: parsed.description,
        triggers: parsed.triggers,
        domains,
        score: 0,
      });
    }
  } catch { /* permission */ }
  return skills;
}

/**
 * Score a skill against a task description.
 */
function scoreSkill(skill, taskLower, domains) {
  let score = 0;
  for (const t of skill.triggers) {
    if (taskLower.includes(t)) score += 3;
  }
  for (const d of skill.domains) {
    if (domains.includes(d)) score += 2;
  }
  const descLower = skill.description.toLowerCase();
  for (const word of taskLower.split(/\s+/).filter((w) => w.length > 2)) {
    if (descLower.includes(word)) score += 1;
  }
  return score;
}

/**
 * Discover and score skills from both global and project archives.
 * Results cached for 5 minutes.
 *
 * @param {string} taskDescription
 * @param {string[]} domains — domains from analyzeTask()
 * @param {number} [limit=10]
 * @returns {string[]} — skill names, sorted by relevance
 */
export function discoverSkills(taskDescription, domains = [], limit = 10) {
  const cacheKey = `skill-discovery:${hashKey(taskDescription)}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const taskLower = taskDescription.toLowerCase();
  const allSkills = [];

  // Global skills (~/.config/opencode/skills/)
  if (globalResourceExists('skills')) {
    allSkills.push(...scanSkillsDir(globalSkillsDir));
  }

  // Project skills (.opencode/skills/)
  allSkills.push(...scanSkillsDir(PROJECT_SKILLS_DIR));

  // Score and sort
  const scored = allSkills
    .map((s) => ({ ...s, score: scoreSkill(s, taskLower, domains) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const result = scored.slice(0, limit).map((s) => s.name);
  cacheSet(cacheKey, result, { ttl: 300000 });
  return result;
}

/**
 * Get the full metadata for discovered skills (not just names).
 * @returns {DiscoveredSkill[]}
 */
export function getDiscoveredSkillMetadata(taskDescription, domains = [], limit = 10) {
  const taskLower = taskDescription.toLowerCase();
  const allSkills = [];

  if (globalResourceExists('skills')) {
    allSkills.push(...scanSkillsDir(globalSkillsDir));
  }
  allSkills.push(...scanSkillsDir(PROJECT_SKILLS_DIR));

  return allSkills
    .map((s) => ({ ...s, score: scoreSkill(s, taskLower, domains) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
