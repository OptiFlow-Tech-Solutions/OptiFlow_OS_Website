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
      }
    }
  } catch { /* corrupted/missing */ }

  return { name, description, triggers };
}

/**
 * Map description and triggers to domains.
 */
function inferDomains(description, triggers) {
  // ponytail: only use discriminating keywords — avoid "component", "design"
  // which appear in nearly every SKILL.md and cause domain pollution
  const domainMap = {
    accessibility: ['accessibility', 'a11y', 'wcag', 'aria', 'screen reader'],
    design: ['design system', 'design token', 'ui kit', 'color palette', 'typography', 'visual design', 'css variable', 'oklch'],
    frontend: ['landing page', 'static site', 'html page', 'marketing page', 'web component', 'browser'],
    backend: ['api endpoint', 'serverless', 'express', 'django', 'laravel', 'spring boot'],
    testing: ['playwright', 'cypress', 'e2e test', 'unit test', 'snapshot test'],
    security: ['vulnerability', 'xss', 'csrf', 'injection', 'secret', 'penetration test'],
    performance: ['lighthouse', 'core web vital', 'bundle size', 'slow load'],
    seo: ['seo', 'sitemap', 'structured data', 'meta tag', 'search engine'],
    deployment: ['deploy', 'ci/cd', 'docker', 'cloudflare', 'netlify', 'vercel'],
    documentation: ['spec.md', 'readme', 'proposal', 'design.md', 'architecture decision'],
    content: ['blog', 'newsletter', 'article', 'copywriting', 'content marketing'],
    animation: ['keyframe', 'framer motion', 'stagger', 'spring', 'gsap'],
    data: ['postgres', 'mysql', 'schema', 'orm', 'prisma', 'migration'],
    infrastructure: ['kubernetes', 'k8s', 'nginx', 'load balancer'],
    git: ['git hook', 'commit', 'branch', 'merge', 'pull request'],
    architecture: ['hexagonal', 'clean architecture', 'microservice', 'monolith'],
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
 * Score a skill against a task description using TF-IDF-like weighting.
 * Common words that appear in many skill descriptions are downweighted.
 */
function scoreSkill(skill, taskLower, domains, idfMap) {
  let score = 0;
  for (const t of skill.triggers) {
    if (taskLower.includes(t)) score += 3;
  }
  for (const d of skill.domains) {
    if (domains.includes(d)) score += 2;
  }
  const descLower = skill.description.toLowerCase();
  const taskWords = taskLower.split(/\s+/).filter((w) => w.length > 3);
  for (const word of taskWords) {
    if (descLower.includes(word)) {
      const idf = idfMap[word] || 1;
      score += Math.round(1 / Math.max(idf, 1));
    }
  }
  return score;
}

/**
 * Build inverse document frequency map from all skill descriptions.
 * Words that appear in many skills get lower weight.
 */
function buildIdfMap(allSkills) {
  const docCount = allSkills.length || 1;
  const freq = {};
  for (const s of allSkills) {
    const words = new Set(s.description.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
    for (const w of words) freq[w] = (freq[w] || 0) + 1;
  }
  return freq;
}

/**
 * Discover and score skills from both global and project archives.
 * Results cached for 5 minutes.
 *
 * @param {string} taskDescription
 * @param {string[]} domains — domains from analyzeTask()
 * @param {number} [limit=10]
 * @param {object} [projectInfo] — { framework, architecture, featureId } from ctx.project
 * @returns {string[]} — skill names, sorted by relevance
 */
export function discoverSkills(taskDescription, domains = [], limit = 10, projectInfo = {}) {
  const cacheKey = `skill-discovery:${hashKey(taskDescription + JSON.stringify(projectInfo))}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const taskLower = taskDescription.toLowerCase();
  const allSkills = [];

  // Global skills (~/.config/opencode/skills/) — pre-filter by domain relevance
  if (globalResourceExists('skills')) {
    const globals = scanSkillsDir(globalSkillsDir);
    const relevantGlobals = domains.length > 0
      ? globals.filter((s) => s.domains.some((d) => domains.includes(d)))
      : globals;
    allSkills.push(...relevantGlobals);
  }

  // Project skills (.opencode/skills/) — boost them (always included)
  const projectSkills = scanSkillsDir(PROJECT_SKILLS_DIR);
  for (const ps of projectSkills) {
    ps._isProject = true;
    allSkills.push(ps);
  }

  // Score and sort with IDF weighting
  const idfMap = buildIdfMap(allSkills);
  const scored = allSkills
    .map((s) => {
      let baseScore = scoreSkill(s, taskLower, domains, idfMap);
      if (s._isProject) baseScore *= 5;
      // Architecture-aware boosting: prefer skills matching the project stack
      if (projectInfo.framework) {
        const desc = s.description.toLowerCase();
        const fw = projectInfo.framework.toLowerCase();
        if (fw === 'static-site' && (desc.includes('static') || desc.includes('html') || desc.includes('css') || desc.includes('vanilla'))) baseScore *= 3;
        if (fw === 'react' && desc.includes('react')) baseScore *= 3;
        if (fw === 'vue' && (desc.includes('vue') || desc.includes('nuxt'))) baseScore *= 3;
      }
      if (projectInfo.featureId && s.triggers.some((t) => t.includes(projectInfo.featureId.toLowerCase()))) baseScore *= 2;
      return { ...s, score: baseScore };
    })
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
    const globals = scanSkillsDir(globalSkillsDir);
    const relevantGlobals = domains.length > 0
      ? globals.filter((s) => s.domains.some((d) => domains.includes(d)))
      : globals;
    allSkills.push(...relevantGlobals);
  }
  const projectSkills = scanSkillsDir(PROJECT_SKILLS_DIR);
  for (const ps of projectSkills) {
    ps._isProject = true;
    allSkills.push(ps);
  }

  const idfMap = buildIdfMap(allSkills);
  return allSkills
    .map((s) => {
      let baseScore = scoreSkill(s, taskLower, domains, idfMap);
      if (s._isProject) baseScore *= 5;
      return { ...s, score: baseScore };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
