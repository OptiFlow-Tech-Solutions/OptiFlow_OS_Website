#!/usr/bin/env node
/* ═══════════════════════════════════════════
   OptiFlow OS — Build/Assembly Script
   Assembles dist/ from src/ + partials + assets
   ═══════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const SRC = path.join(ROOT, 'src');
const ASSETS = path.join(ROOT, 'assets');
const DIST = path.join(ROOT, 'dist');
const DESIGN_SRC = path.join(ROOT, 'OptiFlow-OS-—-Enterprise-DESIGN.md-Specification-(v5.0)');

const SRC_MAP = {
  'index.html': 'home.html',
  'home/index.html': 'home.html',
  'problem-solutions/index.html': 'problem-solutions.html',
  'product-overview/index.html': 'product-overview.html',
  'features/index.html': 'features.html',
  'feature-showcase/index.html': 'feature-showcase.html',
  'why-optiflow/index.html': 'why-optiflow.html',
  'pricing/index.html': 'pricing.html',
  'newsletter/index.html': 'newsletter.html',
  'faq/index.html': 'faq.html',
  'contact/index.html': 'contact.html',
  'demo-booking/index.html': 'demo-booking.html',
  'privacy-policy/index.html': 'privacy-policy.html',
  'terms/index.html': 'terms.html',
  'competitive-positioning/index.html': 'competitive-positioning.html',
};

const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.json'), 'utf-8'));

function readPartial(name) {
  const fp = path.join(SRC, 'partials', name);
  if (fs.existsSync(fp)) return fs.readFileSync(fp, 'utf-8');
  return '';
}

const navRaw = readPartial('nav.html');
const footerRaw = readPartial('footer.html');
const analyticsRaw = readPartial('analytics.html');

function resolveNav(activePage) {
  return navRaw.replace(/\{\{ACTIVE_PAGE\s*===\s*'([^']+)'\s*\?\s*'([^']*)'\s*:\s*'([^']*)'\}\}/g, (_, label, yes, no) => {
    return label === activePage ? yes : no;
  });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function buildPage(pageInfo) {
  const pageFile = pageInfo.file;
  const srcName = SRC_MAP[pageFile];

  if (!srcName) {
    console.error(`  ✗ No source mapping for: ${pageFile}`);
    return null;
  }

  const srcFile = path.join(SRC, 'pages', srcName);
  if (!fs.existsSync(srcFile)) {
    console.error(`  ✗ Missing source: ${srcFile}`);
    return null;
  }

  const activePage = pageInfo.active || '';

  let html = fs.readFileSync(srcFile, 'utf-8');

  const navHtml = resolveNav(activePage);
  html = html.replace(/<!-- INCLUDE:\s*nav\s*-->/g, navHtml);
  html = html.replace(/<!-- INCLUDE:\s*footer\s*-->/g, footerRaw);
  html = html.replace(/<!-- INCLUDE:\s*analytics\s*-->/g, analyticsRaw);

  const urlPath = pageFile === 'index.html'
    ? ''
    : pageFile.replace('/index.html', '/').replace('.html', '/');
  const pageUrl = `https://${site.domain}/${urlPath}`;

  const reps = {
    '{{SITE_NAME}}': site.name,
    '{{SITE_TAGLINE}}': site.tagline,
    '{{SITE_DESCRIPTION}}': site.description,
    '{{COMPANY}}': site.company,
    '{{PHONE}}': site.phone,
    '{{PHONE_TEL}}': site.phone.replace(/\s/g, ''),
    '{{EMAIL}}': site.email,
    '{{WHATSAPP}}': site.whatsapp,
    '{{LOCATION}}': site.location,
    '{{YEAR}}': String(site.year),
    '{{DOMAIN}}': site.domain,
    '{{PAGE_TITLE}}': pageInfo.title,
    '{{PAGE_DESCRIPTION}}': pageInfo.description,
    '{{PAGE_URL}}': pageUrl,
  };

  for (const [key, value] of Object.entries(reps)) {
    html = html.replaceAll(key, value);
  }

  html = html.replace(
    '<meta name="viewport"',
    '<link rel="manifest" href="/manifest.json" />\n  <meta name="theme-color" content="#0a1628" />\n  <meta name="viewport"'
  );

  html = html.replace(
    /<link rel="icon"([^>]*)\/>/,
    '<link rel="icon"$1/><link rel="apple-touch-icon" href="/assets/img/OptiFlow.Logo.png" />'
  );

  // ponytail: inject SEO meta tags after viewport — canonical, OG, Twitter, robots
  const seoMetas = [
    `<link rel="canonical" href="${pageUrl}" />`,
    `<meta property="og:title" content="${pageInfo.title}">`,
    `<meta property="og:description" content="${pageInfo.description}">`,
    `<meta property="og:url" content="${pageUrl}">`,
    '<meta property="og:site_name" content="OptiFlow OS">',
    '<meta property="og:locale" content="en_IN">',
    '<meta property="og:image:width" content="512">',
    '<meta property="og:image:height" content="512">',
    '<meta name="twitter:image" content="/assets/img/OptiFlow.Logo.png">',
    '<meta name="twitter:image:alt" content="OptiFlow OS Logo">',
    '<meta name="robots" content="index, follow">',
  ].join('\n  ');

  html = html.replace(
    '<meta name="viewport"',
    `${seoMetas}\n  <meta name="viewport"`
  );

  const destDir = pageFile === 'index.html'
    ? DIST
    : path.join(DIST, pageFile.replace('/index.html', '').replace('.html', ''));
  fs.mkdirSync(destDir, { recursive: true });
  const destFile = path.join(destDir, 'index.html');
  fs.writeFileSync(destFile, html, 'utf-8');

  return destFile;
}

function injectJSONLD(pageInfo) {
  const urlPath = pageInfo.file === 'index.html'
    ? ''
    : pageInfo.file.replace('/index.html', '/').replace('.html', '/');
  const pageUrl = `https://${site.domain}/${urlPath}`;
  const logoUrl = `https://${site.domain}/assets/img/${site.logo}`;

  let scripts = '\n  <!-- JSON-LD Structured Data -->\n';

  scripts += `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "${site.name}",
    "url": "https://${site.domain}",
    "logo": "${logoUrl}",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "${site.phone}",
      "contactType": "sales",
      "email": "${site.email}"
    }
  }
  </script>\n`;

  // ponytail: BreadcrumbList — derive from URL path segments
  {
    const crumbs = [{ name: 'Home', url: `https://${site.domain}/` }];
    if (urlPath) {
      const segments = urlPath.replace(/\/$/, '').split('/').filter(Boolean);
      let acc = '';
      for (const seg of segments) {
        acc += `/${seg}`;
        const name = seg.replace(/-/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
        crumbs.push({ name, url: `https://${site.domain}${acc}/` });
      }
    }
    const items = crumbs.map((c, i) =>
      `{"@type": "ListItem", "position": ${i + 1}, "name": "${c.name}", "item": "${c.url}"}`
    ).join(',');
    scripts += `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [${items}]
  }
  </script>\n`;
  }

  if (pageInfo.file === 'faq/index.html') {
    scripts += `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {"@type": "Question", "name": "What is OptiFlow OS?", "acceptedAnswer": {"@type": "Answer", "text": "OptiFlow OS is a Business Operating System built specifically for MSMEs — replacing scattered tools with a single unified platform for tasks, teams, attendance, SOPs, checklists, reporting, and accountability."}},
      {"@type": "Question", "name": "Who is OptiFlow built for?", "acceptedAnswer": {"@type": "Answer", "text": "Indian MSMEs across textile, manufacturing, trading, warehousing, distribution, logistics, and service industries — business owners, operations managers, HR heads, plant supervisors, and team leaders."}},
      {"@type": "Question", "name": "How much does OptiFlow cost?", "acceptedAnswer": {"@type": "Answer", "text": "OptiFlow has three transparent plans — Starter, Growth, and Scale. No per-user charges, no hidden modules. Cloud hosting, updates, and standard support are included in the annual subscription."}},
      {"@type": "Question", "name": "How long does implementation take?", "acceptedAnswer": {"@type": "Answer", "text": "Most businesses go live within 2-4 weeks. The structured onboarding includes Discovery, Setup, Data Migration, Training, and Go-Live phases to minimize operational disruption."}},
      {"@type": "Question", "name": "Is business data secure?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Data is stored on cloud servers in India with DDoS protection, automated daily backups, and role-based access control."}}
    ]
  }
  </script>\n`;
  }

  if (pageInfo.file === 'index.html') {
    scripts += `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "${site.name}",
    "url": "https://${site.domain}",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "${pageUrl}?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
  </script>\n`;
  }

  if (pageInfo.file === 'newsletter/index.html') {
    const today = new Date().toISOString().slice(0, 10);
    scripts += `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${pageInfo.title}",
    "description": "${pageInfo.description}",
    "publisher": {
      "@type": "Organization",
      "name": "${site.name}",
      "logo": {
        "@type": "ImageObject",
        "url": "${logoUrl}"
      }
    },
    "datePublished": "${today}",
    "dateModified": "${today}"
  }
  </script>\n`;
  }

  return scripts;
}

function main() {
  console.log('OptiFlow OS — Building site...\n');

  if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
  fs.mkdirSync(DIST, { recursive: true });

  copyDir(ASSETS, path.join(DIST, 'assets'));

  const designRoot = fs.readdirSync(ROOT).find(d => d.startsWith('OptiFlow-OS'));
  if (designRoot) {
    const realDesignSrc = path.join(ROOT, designRoot);
    const logoDirs = ['', 'logos'];
    let logoFound = false;
    for (const sub of logoDirs) {
      const dir = sub ? path.join(realDesignSrc, sub) : realDesignSrc;
      if (!fs.existsSync(dir)) continue;
      for (const f of fs.readdirSync(dir)) {
        if (f.toLowerCase().endsWith('.png')) {
          fs.copyFileSync(path.join(dir, f), path.join(DIST, 'assets', 'img', f));
          logoFound = true;
        }
      }
      if (logoFound) break;
    }
  }

  let count = 0;
  for (const page of site.pages) {
    const dest = buildPage(page);
    if (dest) {
      console.log(`  ✓ ${page.file}`);
      count++;
    }
  }

  console.log(`\n  Built ${count} pages → dist/\n`);

  generateSitemap();
  generateRobotsTxt();
  generateManifest();
  injectAllJSONLD();
}

function generateSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const page of site.pages) {
    const urlPath = page.file === 'index.html'
      ? ''
      : page.file.replace('/index.html', '/').replace('.html', '/');
    const priority = page.file === 'index.html' ? '0.9' : '0.7';
    xml += '  <url>\n';
    xml += `    <loc>https://${site.domain}/${urlPath}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += `    <priority>${priority}</priority>\n`;
    xml += '  </url>\n';
  }
  xml += '</urlset>\n';
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml, 'utf-8');
  console.log('  ✓ sitemap.xml');
}

function generateRobotsTxt() {
  const robots = `User-agent: *\nAllow: /\n\nSitemap: https://${site.domain}/sitemap.xml\n`;
  fs.writeFileSync(path.join(DIST, 'robots.txt'), robots, 'utf-8');
  console.log('  ✓ robots.txt');
}

function generateManifest() {
  const manifest = {
    name: 'OptiFlow OS',
    short_name: 'OptiFlow',
    start_url: '/',
    display: 'standalone',
    theme_color: '#0a1628',
    background_color: '#0a1628',
    orientation: 'any',
    lang: 'en',
    icons: [
      { src: '/assets/img/OptiFlow.Logo.png', sizes: '192x192', type: 'image/png' },
      { src: '/assets/img/OptiFlow.Logo.png', sizes: '512x512', type: 'image/png' },
    ],
  };
  fs.writeFileSync(path.join(DIST, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('  ✓ manifest.json');
}

function injectAllJSONLD() {
  for (const page of site.pages) {
    const pageFile = page.file;
    const destDir = pageFile === 'index.html'
      ? DIST
      : path.join(DIST, pageFile.replace('/index.html', '').replace('.html', ''));
    const destFile = path.join(destDir, 'index.html');
    if (!fs.existsSync(destFile)) continue;
    let html = fs.readFileSync(destFile, 'utf-8');
    const jsonld = injectJSONLD(page);
    html = html.replace('</head>', `${jsonld}\n</head>`);
    fs.writeFileSync(destFile, html, 'utf-8');
  }
  console.log('  ✓ JSON-LD injected into all pages');
}

// ponytail: minification not needed yet. CSS/JS both under 50KB. Add csso + terser step if they grow.

main();
