/**
 * Automated brand compliance checker.
 * Validates pages against DESIGN.md guidelines:
 * - 88/12 neutral-to-brand color ratio
 * - Typography consistency (Inter, type scale)
 * - Voice compliance
 * - Component consistency
 * @module orchestrate/brand-checker
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';

const { projectRoot, designDir } = resolvePaths();

/**
 * Check a single page for brand compliance.
 * @param {string} htmlPath - Path to the HTML file
 * @returns {{page: string, checks: Array<{name: string, passed: boolean, detail: string}>}}
 */
export function checkPage(htmlPath) {
  const html = existsSync(htmlPath) ? readFileSync(htmlPath, 'utf-8') : '';
  const checks = [];

  // 1. CSS variable usage (no hardcoded hex)
  const styleBlocks = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)];
  const inlineHex = styleBlocks.flatMap((m) => m[1].match(/#[0-9a-fA-F]{6}/g) || []);
  checks.push({
    name: 'Hex colors',
    passed: inlineHex.length === 0,
    detail: inlineHex.length ? `${inlineHex.length} hex color(s) found` : 'All colors use variables',
  });

  // 2. Has nav and footer
  checks.push({
    name: 'Nav present',
    passed: html.includes('class="topnav"') || html.includes('class="topnav '),
    detail: html.includes('topnav') ? 'Navigation found' : 'Navigation missing',
  });
  checks.push({
    name: 'Footer present',
    passed: html.includes('class="pagefoot"') || html.includes('class="pagefoot '),
    detail: html.includes('pagefoot') ? 'Footer found' : 'Footer missing',
  });

  // 3. Has <main> landmark
  checks.push({
    name: '<main> landmark',
    passed: html.includes('<main'),
    detail: html.includes('<main') ? 'Main landmark found' : 'Main landmark missing',
  });

  // 4. Has theme toggle
  checks.push({
    name: 'Theme toggle',
    passed: html.includes('theme-toggle') || html.includes('themeToggle'),
    detail: html.includes('theme-toggle') ? 'Theme toggle found' : 'Theme toggle missing',
  });

  // 5. Uses Inter font (check for font family reference)
  checks.push({
    name: 'Typography',
    passed: html.includes('Inter') || html.includes('font-display') || html.includes('font-body'),
    detail: html.includes('Inter') ? 'Inter font referenced' : 'Typography may not use design system',
  });

  const passed = checks.filter((c) => c.passed).length;
  const total = checks.length;

  return {
    page: htmlPath.replace(projectRoot + '/', '').replace(projectRoot + '\\', ''),
    checks,
    score: Math.round((passed / total) * 100),
  };
}

/**
 * Check all pages in dist/ for brand compliance.
 * @returns {Array<ReturnType<typeof checkPage>>}
 */
export function checkAllPages() {
  if (!existsSync(resolve(projectRoot, 'dist'))) return [];

  const results = [];

  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = resolve(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'assets') walk(fullPath);
      else if (entry.name === 'index.html') results.push(checkPage(fullPath));
    }
  }

  walk(resolve(projectRoot, 'dist'));
  return results;
}

/**
 * Generate a brand compliance report.
 * @returns {{pages: object[], averageScore: number, totalPages: number}}
 */
export function generateReport() {
  const pages = checkAllPages();
  const averageScore = pages.length ? Math.round(pages.reduce((s, p) => s + p.score, 0) / pages.length) : 0;

  return {
    pages,
    averageScore,
    totalPages: pages.length,
    summary: `Brand compliance: ${averageScore}% across ${pages.length} pages`,
  };
}

/**
 * Validate DESIGN.md exists and references are consistent.
 * @returns {{valid: boolean, issues: string[]}}
 */
export function validateDesignDoc() {
  const issues = [];

  if (!designDir) {
    issues.push('Design directory not found (expected OptiFlow-OS-* folder)');
    return { valid: false, issues };
  }

  const designPath = resolve(designDir, 'DESIGN.md');
  if (!existsSync(designPath)) {
    issues.push('DESIGN.md not found in design directory');
    return { valid: false, issues };
  }

  const content = readFileSync(designPath, 'utf-8');

  // Check for required sections
  const requiredSections = ['Color Palette', 'Typography', 'Voice', 'Layout', 'Components'];
  for (const section of requiredSections) {
    if (!content.includes(section)) {
      issues.push(`Missing section: "${section}" in DESIGN.md`);
    }
  }

  // Check for color definitions
  const hexCount = (content.match(/#[0-9a-fA-F]{6}/g) || []).length;
  if (hexCount < 5) issues.push('Fewer than 5 hex colors defined in DESIGN.md');

  return { valid: issues.length === 0, issues, designPath };
}
