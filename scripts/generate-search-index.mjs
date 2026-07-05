#!/usr/bin/env node
/* ═══════════════════════════════════════════
   OptiFlow OS — Search Index Generator
   Generates search-index.json from dist/ HTML
   ═══════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const JSON_PATH = path.join(DIST, 'search-index.json');

function stripHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractContent(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const text = main ? stripHtml(main[1]) : stripHtml(html);
  return text.slice(0, 300);
}

function generate() {
  const siteData = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.json'), 'utf-8'));
  const index = [];

  for (const page of siteData.pages) {
    if (page.noindex) continue;

    const urlPath = page.file === 'index.html'
      ? ''
      : page.file.replace('/index.html', '/').replace('.html', '/');

    const distDir = page.file === 'index.html'
      ? DIST
      : path.join(DIST, page.file.replace('/index.html', '').replace('.html', ''));
    const distFile = path.join(distDir, 'index.html');

    let excerpt = '';
    if (fs.existsSync(distFile)) {
      excerpt = extractContent(fs.readFileSync(distFile, 'utf-8'));
    }

    index.push({
      url: '/' + urlPath,
      title: page.title,
      description: page.description,
      excerpt,
    });
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(index), 'utf-8');
  const kb = (fs.statSync(JSON_PATH).size / 1024).toFixed(1);
  console.log(`  \u2713 search-index.json (${kb} KB, ${index.length} pages)`);
}

generate();
