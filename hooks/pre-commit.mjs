#!/usr/bin/env node
/* ═══════════════════════════════════════════
   OptiFlow OS — Pre-Commit Hook
   Scans for debug statements, secrets,
   merge conflicts, data drift, commit
   message format, and branch name convention.
   Exits 0 on clean, 1 on issues found.
   ═══════════════════════════════════════════ */
import path from 'node:path';
import { execSync } from 'node:child_process';
import { ROOT, SRC_PAGES, SRC_PARTIALS, readText, fail, ok, walkDir, getErrors } from './_utils.mjs';

console.log('\n─ Pre-Commit Check ─\n');

// 1. console.log / debugger in src/ files
console.log('1. Debug statements');
const srcFiles = walkDir(SRC_PAGES, ['.html', '.mjs', '.js', '.css']).concat(
  walkDir(SRC_PARTIALS, ['.html', '.mjs', '.js', '.css'])
);
const debugPattern = /\bconsole\.(log|warn|error|debug|info)\(/;
let debugFound = false;
for (const f of srcFiles) {
  const text = readText(f);
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const stripped = lines[i].replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    if (debugPattern.test(stripped)) {
      fail(`${path.relative(ROOT, f)}:${i + 1} console statement`);
      debugFound = true;
    }
    if (stripped.includes('debugger') && !stripped.match(/\/\*|\/\/|"/)) {
      fail(`${path.relative(ROOT, f)}:${i + 1} debugger statement`);
      debugFound = true;
    }
  }
}
if (!debugFound) ok('no debug statements');

// 2. Hardcoded secrets
console.log('2. Secrets scan');
const secretPatterns = [
  { name: 'API key', re: /(?:api[-_]?key|apikey|api_secret|secret_key)\s*[:=]\s*['"][A-Za-z0-9_-]{16,}['"]/i },
  { name: 'password literal', re: /(?:password|passwd|pwd)\s*[:=]\s*['"][^'"]+['"]/i },
  { name: 'token', re: /(?:access_token|auth_token|bearer)\s*[:=]\s*['"][A-Za-z0-9_.-]{16,}['"]/i },
  { name: 'private key', re: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/ },
];
let secretFound = false;
for (const f of srcFiles) {
  const text = readText(f);
  for (const { name, re } of secretPatterns) {
    if (re.test(text)) {
      fail(`${path.relative(ROOT, f)} possible ${name}`);
      secretFound = true;
    }
  }
}
if (!secretFound) ok('no secrets found');

// 3. site.json phone matches footer phone (placeholders)
console.log('3. Contact consistency');
const site = JSON.parse(readText(path.join(ROOT, 'site.json')));
const footerHtml = readText(path.join(SRC_PARTIALS, 'footer.html'));

if (!footerHtml.includes('{{PHONE}}') && !footerHtml.includes('{{PHONE_TEL}}')) {
  fail('footer.html: use {{PHONE}} placeholder instead of hardcoded phone number');
} else {
  const hardcodedPhone = footerHtml.match(/\+91[\s-]?\d{10}/);
  if (hardcodedPhone) {
    fail(`footer.html: hardcoded phone "${hardcodedPhone[0]}" found — use {{PHONE}} placeholder`);
  } else {
    const sitePhoneDigits = site.phone.replace(/\D/g, '');
    if (sitePhoneDigits.length !== 12 || !sitePhoneDigits.startsWith('91')) {
      fail(`site.json phone "${site.phone}" invalid — expected +91 XXXXXXXXXX`);
    } else {
      ok('phone consistent');
    }
  }
}

if (site.location.toLowerCase().includes('surat')) {
  const contactHtml = readText(path.join(SRC_PAGES, 'contact.html'));
  if (contactHtml.match(/Ahmedabad/)) {
    fail('contact.html: stale location "Ahmedabad" — replace with {{LOCATION}} or "Surat"');
  }
}

// 4. Merge conflict markers
console.log('4. Merge conflicts');
const allFiles = [
  ...walkDir(SRC_PAGES, ['.html', '.mjs', '.js', '.css', '.json', '.md']),
  ...walkDir(SRC_PARTIALS, ['.html', '.mjs', '.js', '.css', '.json', '.md']),
  ...walkDir(path.join(ROOT, 'scripts'), ['.mjs']),
  ...walkDir(path.join(ROOT, 'hooks'), ['.mjs']),
  ...walkDir(path.join(ROOT, 'functions'), ['.js']),
];
let conflictFound = false;
for (const f of allFiles) {
  if (f.includes('node_modules') || f.includes('.git')) continue;
  const text = readText(f);
  if (/^<{7}/m.test(text) || /^={7}/m.test(text) || /^>{7}/m.test(text)) {
    fail(`${path.relative(ROOT, f)} merge conflict markers`);
    conflictFound = true;
  }
}
if (!conflictFound) ok('no merge conflicts');

// 5. Commit message format (Conventional Commits)
console.log('5. Commit message format');
const isAmend = process.env.GIT_REFLOG_ACTION?.includes('rebase') ||
  (() => { try { execSync('git rev-parse --verify HEAD', { encoding: 'utf-8', cwd: ROOT }); return true; } catch { return false; } })();
if (isAmend) {
  ok('amend — skipping');
} else {
  const msgFile = process.env.GIT_DIR
    ? path.join(process.env.GIT_DIR, 'COMMIT_EDITMSG')
    : path.join(ROOT, '.git', 'COMMIT_EDITMSG');
  try {
    const msg = readText(msgFile).split('\n')[0].trim();
    const commitRe = /^(feat|fix|refactor|docs|test|chore|perf|ci|style)(\(.+\))?: .{1,72}/;
    if (commitRe.test(msg)) {
      ok(msg);
    } else {
      fail(`commit message must match: type(scope): description`);
      console.log('  Allowed types: feat, fix, refactor, docs, test, chore, perf, ci, style');
    }
  } catch {
    fail('could not read commit message');
  }
}

// 6. Branch name convention
console.log('6. Branch name');
try {
  const branch = execSync('git symbolic-ref --short HEAD', { encoding: 'utf-8', cwd: ROOT }).trim();
  const branchRe = /^(main|staging|develop|feature\/|fix\/|chore\/|docs\/)/;
  if (branchRe.test(branch)) {
    ok(branch);
  } else {
    fail(`branch "${branch}" not allowed`);
    console.log('  Allowed: main, staging, develop, feature/*, fix/*, chore/*, docs/*');
  }
} catch {
  fail('could not read branch name');
}

const errs = getErrors();
console.log(`\n${errs} issue(s)`);
process.exit(errs > 0 ? 1 : 0);
