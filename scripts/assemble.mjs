#!/usr/bin/env node
/* ═══════════════════════════════════════════
   OptiFlow OS — Build/Assembly Script
   Assembles dist/ from src/ + partials + assets
   ═══════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// ponytail: sharp for WebP/AVIF image optimization. Only loaded when images exist.
let sharp;
async function getSharp() {
  if (!sharp) {
    try { sharp = (await import('sharp')).default; } catch { return null; }
  }
  return sharp;
}

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const SRC = path.join(ROOT, 'src');
const ASSETS = path.join(ROOT, 'assets');
const DIST = path.join(ROOT, 'dist');

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
  'admin/index.html': 'admin.html',
  'offline/index.html': 'offline.html',
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
const cookieConsentRaw = readPartial('cookie-consent.html');

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
  html = html.replace(/<!-- INCLUDE:\s*cookie-consent\s*-->/g, cookieConsentRaw);

  const swRegistration = `<script>if('serviceWorker' in navigator){var t;navigator.serviceWorker.register('/sw.js',{scope:'/'}).then(function(r){r.addEventListener('updatefound',function(){var w=r.installing;w.addEventListener('statechange',function(){if(w.state==='installed'&&navigator.serviceWorker.controller&&!t){t=1;var d=document.createElement('div');d.className='pwa-update-toast';d.setAttribute('role','alert');d.innerHTML='<span>New version available.</span><button onclick="this.parentElement.remove();window.location.reload()" style="cursor:pointer;background:rgba(255,255,255,.15);color:#fff;border:none;padding:6px 14px;border-radius:4px;font-weight:600">Refresh</button>';d.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9999;background:var(--accent,oklch(33% 0.09 255));color:#fff;padding:10px 20px;border-radius:8px;display:flex;align-items:center;gap:12px;font-size:14px;box-shadow:0 2px 20px rgba(0,0,0,.25)';document.body.appendChild(d)}})})})}</script>`;
  const searchScript = '<script src="/assets/js/search.js" defer></script>';
  html = html.replace('</head>', `${searchScript}\n${swRegistration}\n</head>`);

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
    '{{PUBLISHED_DATE}}': new Date().toISOString(),
  };

  for (const [key, value] of Object.entries(reps)) {
    html = html.replaceAll(key, value);
  }

  html = html.replace(
    '<meta name="viewport"',
    '<link rel="manifest" href="/manifest.json" />\n  <meta name="theme-color" content="#0a1628" />\n  <link rel="preconnect" href="https://fonts.googleapis.com" />\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n  <link rel="preconnect" href="https://plausible.io" />\n  <meta name="viewport"'
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
    `<meta property="og:image" content="https://${site.domain}/assets/img/${site.logo}">`,
    '<meta property="og:site_name" content="OptiFlow OS">',
    '<meta property="og:locale" content="en_IN">',
    '<meta property="og:image:width" content="512">',
    '<meta property="og:image:height" content="512">',
    `<meta name="twitter:image" content="https://${site.domain}/assets/img/${site.logo}">`,
    '<meta name="twitter:image:alt" content="OptiFlow OS Logo">',
    `<meta name="robots" content="${pageInfo.noindex ? 'noindex, nofollow' : 'index, follow'}">`,
  ].filter(Boolean).join('\n  ');

  html = html.replace(
    '<meta name="viewport"',
    `${seoMetas}\n  <meta name="viewport"`
  );

  if (process.env.OPTIFLOW_LIVE_RELOAD) {
    html = html.replace('</head>', '<script>let _lt=0,_init=!1;setInterval(()=>{fetch("/rebuild.txt?"+Date.now()).then(r=>r.text()).then(v=>{let n=+v.trim();if(!_init){_lt=n;_init=!0;return}if(n>_lt){_lt=n;location.reload()}}).catch(()=>{})},800)</script>\n</head>');
  }

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

async function optimizeImages() {
  const imgDir = path.join(DIST, 'assets', 'img');
  if (!fs.existsSync(imgDir)) return;

  const s = await getSharp();
  if (!s) { console.log('  ⚠ sharp not available, skipping image optimization'); return; }

  const formats = [
    { ext: 'webp', opts: { quality: 85 } },
    { ext: 'avif', opts: { quality: 65, effort: 4 } },
  ];

  const files = fs.readdirSync(imgDir).filter(f => /\.(png|jpe?g)$/i.test(f) && !f.includes('.webp') && !f.includes('.avif'));
  let count = 0;

  for (const file of files) {
    const src = path.join(imgDir, file);
    const base = file.replace(/\.(png|jpe?g)$/i, '');
    for (const { ext, opts } of formats) {
      const dest = path.join(imgDir, `${base}.${ext}`);
      if (fs.existsSync(dest)) continue;
      try {
        await s(src)[ext](opts).toFile(dest);
        count++;
      } catch (e) {
        console.log(`  ⚠ Failed to convert ${file} → ${ext}: ${e.message}`);
      }
    }
  }

  if (count > 0) console.log(`  ✓ Optimized ${count} image${count > 1 ? 's' : ''} (WebP + AVIF)`);
}

async function main() {
  console.log('OptiFlow OS — Building site...\n');

  if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
  fs.mkdirSync(DIST, { recursive: true });

  copyDir(ASSETS, path.join(DIST, 'assets'));

  const FUNCTIONS_DIR = path.join(ROOT, 'functions');
  if (fs.existsSync(FUNCTIONS_DIR)) copyDir(FUNCTIONS_DIR, path.join(DIST, 'functions'));

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
  generateServiceWorker();
  injectAllJSONLD();
  generateSearchIndex();
}

function generateSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const page of site.pages) {
    if (page.noindex) continue;
    const urlPath = page.file === 'index.html'
      ? ''
      : page.file.replace('/index.html', '/').replace('.html', '/');
    const priority = page.file === 'index.html' ? '0.9' : '0.7';
    let changefreq = 'weekly';
    if (page.file === 'index.html') changefreq = 'daily';
    if (page.file.includes('privacy-policy') || page.file.includes('terms')) changefreq = 'monthly';
    xml += '  <url>\n';
    xml += `    <loc>https://${site.domain}/${urlPath}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
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
    description: 'Business Execution Operating System for Indian MSMEs',
    start_url: '/',
    display: 'standalone',
    theme_color: '#0a1628',
    background_color: '#0a1628',
    orientation: 'any',
    lang: 'en-IN',
    dir: 'ltr',
    scope: '/',
    id: '/?app=optiflow',
    categories: ['business', 'productivity'],
    shortcuts: [
      {
        name: 'Book a Demo',
        short_name: 'Demo',
        description: 'Book a free personalized demo',
        url: '/demo-booking/',
        icons: [{ src: '/assets/img/OptiFlow.Logo.png', sizes: '96x96', type: 'image/png' }],
      },
      {
        name: 'View Pricing',
        short_name: 'Pricing',
        description: 'See plans and pricing',
        url: '/pricing/',
        icons: [{ src: '/assets/img/OptiFlow.Logo.png', sizes: '96x96', type: 'image/png' }],
      },
    ],
    icons: [
      { src: '/assets/img/OptiFlow.Logo.png', sizes: '48x48', type: 'image/png' },
      { src: '/assets/img/OptiFlow.Logo.png', sizes: '72x72', type: 'image/png' },
      { src: '/assets/img/OptiFlow.Logo.png', sizes: '96x96', type: 'image/png' },
      { src: '/assets/img/OptiFlow.Logo.png', sizes: '144x144', type: 'image/png' },
      { src: '/assets/img/OptiFlow.Logo.png', sizes: '192x192', type: 'image/png' },
      { src: '/assets/img/OptiFlow.Logo.png', sizes: '512x512', type: 'image/png' },
      { src: '/assets/img/OptiFlow.Logo.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/assets/img/OptiFlow.Logo.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  fs.writeFileSync(path.join(DIST, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('  ✓ manifest.json');
}

function generateServiceWorker() {
  const swSrc = path.join(ASSETS, 'js', 'sw.js');
  if (!fs.existsSync(swSrc)) { console.log('  ⚠ sw.js not found, skipping'); return; }
  const version = Date.now().toString(36);
  let sw = fs.readFileSync(swSrc, 'utf-8');
  sw = sw.replace(/\{\{SW_VERSION\}\}/g, version);
  fs.writeFileSync(path.join(DIST, 'sw.js'), sw, 'utf-8');
  console.log('  ✓ sw.js (v' + version + ')');
}

function generateSearchIndex() {
  import('./generate-search-index.mjs').catch(function(e) {
    console.log('  ⚠ search index generation failed: ' + e.message);
  });
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

// ponytail: simple regex minification for CSS/JS. Both under 50KB. Add csso + terser if they grow.
function minifyCSS(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '')  // remove comments
    .replace(/;\s*/g, ';')              // collapse whitespace after semicolons
    .replace(/{\s*/g, '{')             // collapse whitespace after braces
    .replace(/}\s*/g, '}')             // collapse whitespace before closing braces
    .replace(/:\s*/g, ':')             // collapse whitespace after colons
    .replace(/,\s*/g, ',')             // collapse whitespace after commas
    .replace(/\n\s*/g, '\n')           // trim leading whitespace on lines
    .replace(/[\t ]{2,}/g, ' ')        // collapse multiple spaces/tabs
    .replace(/\n{2,}/g, '\n')          // collapse multiple newlines
    .trim();
}

function minifyJS(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '')  // remove block comments
    .replace(/\/\/[^\n]*/g, '')        // remove line comments
    .replace(/;\s*/g, ';')             // collapse whitespace after semicolons
    .replace(/{\s*/g, '{')             // collapse whitespace after braces
    .replace(/}\s*/g, '}')             // collapse whitespace before closing braces
    .replace(/:\s*/g, ':')             // collapse whitespace after colons
    .replace(/,\s*/g, ',')             // collapse whitespace after commas
    .replace(/\n\s*/g, '\n')           // trim leading whitespace on lines
    .replace(/[\t ]{2,}/g, ' ')        // collapse multiple spaces/tabs
    .replace(/\n{2,}/g, '\n')          // collapse multiple newlines
    .trim();
}

// Apply minification to copied CSS/JS in dist
{
  const distCss = path.join(DIST, 'assets', 'css', 'core.css');
  const distJs = path.join(DIST, 'assets', 'js', 'core.js');
  if (fs.existsSync(distCss)) {
    const raw = fs.readFileSync(distCss, 'utf-8');
    fs.writeFileSync(distCss, minifyCSS(raw), 'utf-8');
    const pct = ((1 - fs.statSync(distCss).size / raw.length) * 100).toFixed(0);
    console.log(`  ✓ core.css minified (${pct}% reduction)`);
  }
  if (fs.existsSync(distJs)) {
    const raw = fs.readFileSync(distJs, 'utf-8');
    fs.writeFileSync(distJs, minifyJS(raw), 'utf-8');
    const pct = ((1 - fs.statSync(distJs).size / raw.length) * 100).toFixed(0);
    console.log(`  ✓ core.js minified (${pct}% reduction)`);
  }
}

main().then(() => optimizeImages());
