/**
 * Parses OpenSpec spec.md files (BDD format) into structured data.
 * @module orchestrate/spec-parser
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = resolve(import.meta.dirname || '.', '..');
const SPECS_DIR = resolve(ROOT, 'openspec', 'specs');

const DOMAINS = [
  ['design', /color|css|typography|spacing|component|button|card|grid/i],
  ['frontend', /page|html|nav|footer|render/i],
  ['build', /build|assemble|dist|compile/i],
  ['accessibility', /a11y|wcag|aria|contrast|focus|keyboard|screen.reader/i],
  ['seo', /seo|meta|og:|twitter:|sitemap|description|title/i],
  ['content', /content|copy|writing|text/i],
  ['quality', /test|validate|lint|check|review/i],
  ['security', /security|vuln|xss|csrf|injection/i],
  ['dark-mode', /dark|theme|light/i],
];

function detectDomains(text) {
  return DOMAINS.filter(([, re]) => re.test(text)).map(([d]) => d);
}

function parseScenario(block) {
  const lines = block.split('\n');
  const name = lines[0].trim();
  let given = '', when = '', then = '';
  for (const line of lines) {
    const m = line.match(/-\s+\*\*(GIVEN|WHEN|THEN)\*\*\s+(.*)/);
    if (m) {
      if (m[1] === 'GIVEN') given += (given ? ' ' : '') + m[2];
      else if (m[1] === 'WHEN') when += (when ? ' ' : '') + m[2];
      else if (m[1] === 'THEN') then += (then ? ' ' : '') + m[2];
    }
  }
  return { name, given, when, then };
}

/**
 * Parse a single spec.md file into structured data.
 * @param {string} content - Raw markdown content
 * @param {string} specName - Name of the spec (folder name)
 * @returns {{name: string, requirements: Array<{name: string, description: string, scenarios: Array<{name: string, given: string, when: string, then: string}>}>, domains: string[], requirementCount: number, scenarioCount: number}}
 */
export function parseSpec(content, specName) {
  const requirements = [];
  for (const block of content.split(/^### Requirement:/m).slice(1)) {
    const lines = block.split('\n');
    const name = lines[0].trim();
    const desc = lines.slice(1).map((l) => l.trim()).filter(Boolean)
      .filter((l) => !l.startsWith('####')).join(' ');
    const scenarios = block.split(/#### Scenario:/).slice(1).map(parseScenario);
    requirements.push({ name, description: desc, scenarios });
  }
  const allText = requirements.map((r) => r.name + ' ' + r.description).join(' ');
  return {
    name: specName, requirements,
    domains: [...new Set(detectDomains(allText))],
    requirementCount: requirements.length,
    scenarioCount: requirements.reduce((s, r) => s + r.scenarios.length, 0),
  };
}

/**
 * Parse all spec.md files from openspec/specs/ directory.
 * @param {string} [specsDir] - Path to specs directory (defaults to openspec/specs/)
 * @returns {Array<ReturnType<typeof parseSpec>>}
 */
export function parseAllSpecs(specsDir = SPECS_DIR) {
  if (!existsSync(specsDir)) return [];
  return readdirSync(specsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const fp = join(specsDir, d.name, 'spec.md');
      return existsSync(fp) ? parseSpec(readFileSync(fp, 'utf-8'), d.name) : null;
    }).filter(Boolean);
}
