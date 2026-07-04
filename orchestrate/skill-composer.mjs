/**
 * V13: Skill composer — groups discovered skills by workflow role.
 * Replaces flat skill lists with role-assigned composition.
 * Enables the master agent to pick the best skill per role.
 *
 * @module orchestrate/skill-composer
 */

import { getSkillSuccessBoost } from './skill-evolution.mjs';

/**
 * Workflow role taxonomy.
 * Each role maps skills to a specific phase in the orchestration pipeline.
 */
const WORKFLOW_ROLES = Object.freeze({
  'repo-analyst': {
    label: 'Repository Analyst',
    phase: 'OPSX_EXPLORE',
    domains: ['documentation', 'architecture'],
    description: 'Analyzes codebase structure, dependencies, and existing patterns',
  },
  'planner': {
    label: 'Planner',
    phase: 'OPSX_EXPLORE',
    domains: ['architecture', 'documentation'],
    description: 'Plans implementation approach and identifies risks',
  },
  'designer': {
    label: 'Designer',
    phase: 'OPSX_PROPOSE',
    domains: ['design', 'accessibility', 'frontend'],
    description: 'Creates design specifications and visual architecture',
  },
  'spec-writer': {
    label: 'Spec Writer',
    phase: 'OPSX_PROPOSE',
    domains: ['documentation'],
    description: 'Writes formal specifications and requirements',
  },
  'implementer': {
    label: 'Implementer',
    phase: 'OPSX_APPLY',
    domains: ['frontend', 'backend', 'design'],
    description: 'Writes implementation code',
  },
  'tester': {
    label: 'Tester',
    phase: 'VALIDATE',
    domains: ['testing', 'quality'],
    description: 'Runs tests and reports failures',
  },
  'reviewer': {
    label: 'Reviewer',
    phase: 'VALIDATE',
    domains: ['quality', 'security', 'accessibility', 'performance', 'content'],
    description: 'Reviews code quality, security, and compliance',
  },
  'deployer': {
    label: 'Deployer',
    phase: 'OPSX_ARCHIVE',
    domains: ['deployment', 'infrastructure'],
    description: 'Handles deployment and finalization',
  },
  'documenter': {
    label: 'Documenter',
    phase: 'OPSX_ARCHIVE',
    domains: ['documentation', 'content'],
    description: 'Updates documentation, traceability, archive records',
  },
});

/**
 * Map a skill to one or more workflow roles based on its domains.
 * @param {{name: string, domains: string[], description: string}} skill
 * @returns {string[]}
 */
function mapSkillToRoles(skill) {
  const roles = [];
  const desc = (skill.description || '').toLowerCase();
  const name = (skill.name || '').toLowerCase();

  // Implementer: most skills with frontend/backend/design domains
  if (skill.domains.some((d) => ['frontend', 'backend', 'design', 'api'].includes(d))) {
    roles.push('implementer');
  }

  // Tester: testing/e2e/qa focus
  if (skill.domains.includes('testing') ||
    desc.includes('test') || desc.includes('e2e') || desc.includes('playwright') ||
    name.includes('tdd') || name.includes('test')) {
    roles.push('tester');
  }

  // Reviewer: quality/security/accessibility/perf review
  if (skill.domains.some((d) => ['quality', 'security', 'accessibility', 'performance'].includes(d)) ||
    name.includes('review') || name.includes('audit') || name.includes('verify')) {
    roles.push('reviewer');
  }

  // Designer: design system, visual, animation
  if (skill.domains.includes('design') ||
    desc.includes('design system') || desc.includes('visual design') ||
    name.includes('design') || name.includes('motion') || name.includes('ui-')) {
    roles.push('designer');
  }

  // Planner: architecture, planning
  if (skill.domains.includes('architecture') || name.includes('planner') || name.includes('architect') ||
    desc.includes('architecture') || desc.includes('planning')) {
    roles.push('planner');
  }

  // Documenter: documentation, content
  if (skill.domains.some((d) => ['documentation', 'content'].includes(d)) ||
    name.includes('article') || name.includes('doc')) {
    roles.push('documenter');
  }

  // Deployer
  if (skill.domains.includes('deployment') ||
    desc.includes('deploy') || desc.includes('ci/cd') || desc.includes('release')) {
    roles.push('deployer');
  }

  // Spec writer
  if (skill.domains.includes('documentation') &&
    (desc.includes('spec') || desc.includes('proposal') || desc.includes('requirement'))) {
    roles.push('spec-writer');
  }

  // Repo analyst
  if (skill.domains.includes('architecture') ||
    desc.includes('codebase') || desc.includes('repository') || desc.includes('onboarding')) {
    if (!roles.includes('planner')) roles.push('repo-analyst');
  }

  // Semantic fallback: if only 'implementer' matched, try bigram similarity
  if (roles.length === 1 && roles[0] === 'implementer') {
    const semanticRole = fallbackRoleBySimilarity(skill);
    if (semanticRole && !roles.includes(semanticRole)) {
      roles.push(semanticRole);
    }
  }

  return roles.length ? roles : ['implementer'];
}

/**
 * Character bigram Jaccard similarity — lightweight semantic proxy.
 * Used as fallback when keyword matching fails to assign a specific role.
 */
function bigramSimilarity(a, b) {
  const bigrams = (s) => {
    const set = new Set();
    for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2));
    return set;
  };
  const aSet = bigrams(a);
  const bSet = bigrams(b);
  const intersection = new Set([...aSet].filter((x) => bSet.has(x)));
  const union = new Set([...aSet, ...bSet]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

function fallbackRoleBySimilarity(skill) {
  const text = `${skill.name} ${skill.description}`.toLowerCase();
  const roleTexts = {
    'repo-analyst': 'analyze codebase repository structure dependencies architecture',
    planner: 'plan architecture approach design strategy',
    designer: 'design system visual ui ux layout colors typography',
    documenter: 'documentation docs readme article write update',
    deployer: 'deploy publish release ci cd build pipeline',
  };

  let bestRole = null;
  let bestScore = 0;
  for (const [role, roleText] of Object.entries(roleTexts)) {
    const score = bigramSimilarity(text, roleText);
    if (score > bestScore && score > 0.1) {
      bestScore = score;
      bestRole = role;
    }
  }
  return bestRole;
}

/**
 * Compose skills into workflow roles for a given task.
 * Each role gets the best-matching skill. A skill can serve multiple roles.
 *
 * @param {object[]} skillMetadata — from getDiscoveredSkillMetadata()
 * @param {string[]} domains — task domains
 * @param {string} phaseId — current phase being composed for
 * @returns {{byRole: Record<string, object[]>, bestPerRole: Record<string, object|null>, primaryRole: string}}
 */
export function composeSkills(skillMetadata = [], domains = [], phaseId = null) {
  const byRole = {};
  const bestPerRole = {};

  // Determine which roles are relevant for the current phase
  const phaseRelevantRoles = phaseId
    ? Object.entries(WORKFLOW_ROLES)
      .filter(([, role]) => role.phase === phaseId || !phaseId)
      .map(([key]) => key)
    : Object.keys(WORKFLOW_ROLES);

  // Assign each skill to its matched roles
  for (const skill of skillMetadata) {
    const roles = mapSkillToRoles(skill);
    for (const role of roles) {
      if (!byRole[role]) byRole[role] = [];
      byRole[role].push(skill);
    }
  }

  // Score: higher-scored skills preferred, but avoid assigning same skill to all roles
  // Apply success boost from skill evolution history
  let boost = {};
  try { boost = getSkillSuccessBoost(); } catch { /* skill-evolution unavailable */ }
  const usedSkills = new Set();

  for (const role of phaseRelevantRoles) {
    const candidates = (byRole[role] || [])
      .map((s) => {
        const boostMultiplier = boost[s.name] || 1.0;
        return { ...s, score: (s.score || 0) * boostMultiplier };
      })
      .filter((s) => !usedSkills.has(s.name))
      .sort((a, b) => (b.score || 0) - (a.score || 0));

    if (candidates.length > 0) {
      bestPerRole[role] = candidates[0];
      usedSkills.add(candidates[0].name);
    } else {
      bestPerRole[role] = null;
    }
  }

  // Determine primary role based on task domains
  let primaryRole = 'implementer';
  const domainRoleMap = {
    design: 'designer', accessibility: 'designer',
    performance: 'reviewer', security: 'reviewer',
    testing: 'tester', quality: 'reviewer',
    deployment: 'deployer', infrastructure: 'deployer',
    content: 'documenter', documentation: 'spec-writer',
    seo: 'implementer', frontend: 'implementer', backend: 'implementer',
  };

  for (const domain of domains) {
    const mapped = domainRoleMap[domain];
    if (mapped && bestPerRole[mapped]) {
      primaryRole = mapped;
      break;
    }
  }

  return { byRole, bestPerRole, primaryRole };
}

/**
 * Get the workflow roles relevant to a given pipeline phase.
 * @param {string} phaseId
 * @returns {{roleId: string, label: string}[]}
 */
export function rolesForPhase(phaseId) {
  return Object.entries(WORKFLOW_ROLES)
    .filter(([, r]) => r.phase === phaseId)
    .map(([roleId, r]) => ({ roleId, label: r.label }));
}

export { WORKFLOW_ROLES };
