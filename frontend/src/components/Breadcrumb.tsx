import { Link, useLocation } from 'react-router-dom';

function slugToLabel(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

interface Crumb {
  label: string;
  path: string;
}

function buildCrumbs(pathname: string): Crumb[] {
  if (pathname === '/' || pathname === '') return [];

  const segments = pathname.split('/').filter(Boolean);

  const crumbs: Crumb[] = [];
  let accumulated = '';

  for (let i = 0; i < segments.length; i++) {
    accumulated += `/${segments[i]}`;
    crumbs.push({
      label: slugToLabel(segments[i]),
      path: accumulated,
    });
  }

  return crumbs;
}

export default function Breadcrumb() {
  const { pathname } = useLocation();
  const crumbs = buildCrumbs(pathname);

  if (crumbs.length === 0) return null;

  breadcrumbList(crumbs);

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol>
        <li>
          <Link to="/">Home</Link>
        </li>
        {crumbs.map((crumb, i) => (
          <li key={crumb.path}>
            {i < crumbs.length - 1 ? (
              <Link to={crumb.path}>{crumb.label}</Link>
            ) : (
              <span aria-current="page">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ponytail: one-liner JSON-LD injection via script tag
function breadcrumbList(crumbs: Crumb[]) {
  const existing = document.getElementById('breadcrumb-ld');
  if (existing) existing.remove();

  const items = [
    { '@type': 'ListItem', position: 1, item: { '@id': `${window.location.origin}/os/`, name: 'Home' } },
    ...crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 2,
      item: { '@id': `${window.location.origin}/os${c.path}`, name: c.label },
    })),
  ];

  const script = document.createElement('script');
  script.id = 'breadcrumb-ld';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  });
  document.head.appendChild(script);
}
