/**
 * Resolves which pages need rebuilding based on changed file globs.
 * Mirrors the SRC_MAP from assemble.mjs for page name resolution.
 * @module orchestrate/dependency-resolver
 */

/**
 * Maps dist output paths to src page filenames (synced with scripts/assemble.mjs).
 * The 12 unique page source files.
 * @type {Readonly<Record<string, string>>}
 */
export const SRC_MAP = Object.freeze({
  'index.html': 'home.html',
  'home/index.html': 'home.html',
  'problem-solutions/index.html': 'problem-solutions.html',
  'product-overview/index.html': 'product-overview.html',
  'features/index.html': 'features.html',
  'why-optiflow/index.html': 'why-optiflow.html',
  'pricing/index.html': 'pricing.html',
  'newsletter/index.html': 'blog.html',
  'faq/index.html': 'faq.html',
  'contact/index.html': 'contact.html',
  'demo-booking/index.html': 'demo-booking.html',
  'privacy-policy/index.html': 'privacy-policy.html',
  'terms/index.html': 'terms.html',
});

const ALL_PAGES = Object.freeze([...new Set(Object.values(SRC_MAP))]);

const GLOBAL_FILES = new Set([
  'site.json',
  'assets/css/core.css',
  'assets/js/core.js',
  'src/partials/nav.html',
  'src/partials/footer.html',
]);

/**
 * Normalize a changed file path by stripping leading segments to match our globs.
 * @param {string} filePath
 * @returns {string}
 */
function normalizePath(filePath) {
  const cleaned = filePath.replace(/\\/g, '/').replace(/^\//, '');
  const segments = ['site.json', 'assets/', 'src/'];
  for (const seg of segments) {
    const idx = cleaned.indexOf(seg);
    if (idx !== -1) return cleaned.slice(idx);
  }
  return cleaned;
}

/**
 * Resolve which pages need rebuilding given a list of changed files.
 * @param {string[]} changedFiles - List of changed file paths (globs or absolute)
 * @returns {{pagesToRebuild: string[], reason: string}}
 */
export function resolveDependencies(changedFiles) {
  const normalized = changedFiles.map(normalizePath);

  for (const fp of normalized) {
    if (GLOBAL_FILES.has(fp)) {
      return {
        pagesToRebuild: [...ALL_PAGES],
        reason: `${fp} changed — affects all ${ALL_PAGES.length} pages`,
      };
    }
    if (fp.startsWith('assets/css/core.css')) {
      return {
        pagesToRebuild: [...ALL_PAGES],
        reason: 'core.css changed — all pages must be rebuilt',
      };
    }
    if (fp.startsWith('assets/js/core.js')) {
      return {
        pagesToRebuild: [...ALL_PAGES],
        reason: 'core.js changed — all pages must be rebuilt',
      };
    }
    if (fp.startsWith('src/partials/nav.html')) {
      return {
        pagesToRebuild: [...ALL_PAGES],
        reason: 'nav.html changed — all pages must be rebuilt',
      };
    }
    if (fp.startsWith('src/partials/footer.html')) {
      return {
        pagesToRebuild: [...ALL_PAGES],
        reason: 'footer.html changed — all pages must be rebuilt',
      };
    }
  }

  const pages = new Set();
  for (const fp of normalized) {
    const match = fp.match(/src\/pages\/([a-z-]+)\.html$/);
    if (match) {
      pages.add(`${match[1]}.html`);
    }
  }

  if (pages.size === 0) {
    return { pagesToRebuild: [...ALL_PAGES], reason: 'unrecognized files changed — rebuilding all pages' };
  }

  return {
    pagesToRebuild: [...pages],
    reason: `${pages.size} page(s) directly changed`,
  };
}
