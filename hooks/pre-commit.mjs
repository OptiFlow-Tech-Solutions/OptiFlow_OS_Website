#!/usr/bin/env node
/* ═══════════════════════════════════════════
   OptiFlow OS — Pre-Commit Hook
   Scans for debug statements, secrets,
   merge conflicts, and data drift.
   Exits 0 on clean, 1 on issues found.
   ═══════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

let errors = 0;

function fail(msg) { console.error(`  ✗ ${msg}`); errors++; }

function readText(fp) {
  try { return fs.readFileSync(fp, 'utf-8'); } catch { return ''; }
}

function walkSrc(exts, dir = path.join(ROOT, 'src')) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) files.push(...walkSrc(exts, path.join(dir, entry.name)));
    else if (exts.some(e => entry.name.endsWith(e))) files.push(path.join(dir, entry.name));
  }
  return files;
}

console.log('\n─ Pre-Commit Check ─\n');

// 1. console.log / debugger in src/ files
console.log('1. Debug statements');
const srcFiles = walkSrc(['.html', '.mjs', '.js', '.css']);
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
if (!debugFound) console.log('  ✓ no debug statements');

// 2. Hardcoded secrets
console.log('2. Secrets scan');
const secretPatterns = [
  { name: 'API key', re: /(?:api[_\-]?key|apikey|api_secret|secret_key)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}['"]/i },
  { name: 'password literal', re: /(?:password|passwd|pwd)\s*[:=]\s*['"][^'"]+['"]/i },
  { name: 'token', re: /(?:access_token|auth_token|bearer)\s*[:=]\s*['"][A-Za-z0-9_\-.]{16,}['"]/i },
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
if (!secretFound) console.log('  ✓ no secrets found');

// 3. site.json phone matches footer phone (placeholders)
console.log('3. Contact consistency');
const site = JSON.parse(readText(path.join(ROOT, 'site.json')));
const footerHtml = readText(path.join(ROOT, 'src', 'partials', 'footer.html'));

// Footer must use {{PHONE}} placeholder — not hardcoded number
if (!footerHtml.includes('{{PHONE}}') && !footerHtml.includes('{{PHONE_TEL}}')) {
  fail('footer.html: use {{PHONE}} placeholder instead of hardcoded phone number');
} else {
  // Verify no hardcoded Indian mobile remains in footer (catch accidentally re-hardcoded)
  const hardcodedPhone = footerHtml.match(/\+91[\s-]?\d{10}/);
  if (hardcodedPhone) {
    fail(`footer.html: hardcoded phone "${hardcodedPhone[0]}" found — use {{PHONE}} placeholder`);
  } else {
    // Validate site.json phone format
    const sitePhoneDigits = site.phone.replace(/\D/g, '');
    if (sitePhoneDigits.length !== 12 || !sitePhoneDigits.startsWith('91')) {
      fail(`site.json phone "${site.phone}" invalid — expected +91 XXXXXXXXXX`);
    } else {
      console.log('  ✓ phone consistent');
    }
  }
}

// Verify location consistency: no stale "Ahmedabad" in source pages
if (site.location.toLowerCase().includes('surat')) {
  const contactHtml = readText(path.join(ROOT, 'src', 'pages', 'contact.html'));
  if (contactHtml.match(/Ahmedabad/)) {
    fail('contact.html: stale location "Ahmedabad" — replace with {{LOCATION}} or "Surat"');
  }
}

// 4. Merge conflict markers
console.log('4. Merge conflicts');
const allFiles = [...walkSrc(['.html', '.mjs', '.js', '.css', '.json', '.md'], ROOT)];
let conflictFound = false;
for (const f of allFiles) {
  if (f.includes('node_modules') || f.includes('.git')) continue;
  const text = readText(f);
  if (/^<{7}/m.test(text) || /^={7}/m.test(text) || /^>{7}/m.test(text)) {
    fail(`${path.relative(ROOT, f)} merge conflict markers`);
    conflictFound = true;
  }
}
if (!conflictFound) console.log('  ✓ no merge conflicts');

console.log(`\n${errors} issue(s)`);
process.exit(errors > 0 ? 1 : 0);
