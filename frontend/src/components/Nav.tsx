import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import Button from './Button';
import useScrollPosition from '../hooks/useScrollPosition';
import './Nav.css';

interface NavLink {
  label: string;
  href: string;
}

interface NavDropdown {
  label: string;
  items: NavLink[];
}

interface NavCTA {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '/os/' },
  { label: 'Solutions', href: '/os/problem-solutions/' },
  { label: 'Product', href: '/os/product-overview/' },
  { label: 'Features', href: '/os/features/' },
  { label: 'Showcase', href: '/os/feature-showcase/' },
  { label: 'Why OptiFlow', href: '/os/why-optiflow/' },
  { label: 'Pricing', href: '/os/pricing/' },
  { label: 'Contact', href: '/os/contact/' },
];

const navDropdown: NavDropdown = {
  label: 'Resources',
  items: [
    { label: 'Newsletter', href: '/os/newsletter/' },
    { label: 'FAQ', href: '/os/faq/' },
    { label: 'Competitive Positioning', href: '/os/competitive-positioning/' },
  ],
};

const navCTA: NavCTA = { label: 'Book Demo', href: '/os/demo-booking/' };

// ponytail: map routes to active labels for useLocation matching.
// Add label+path pairs here as new pages get routes.
const routeToActive: Record<string, string> = {
  '/': 'Home',
  '/problem-solutions': 'Solutions',
  '/product-overview': 'Product',
  '/features': 'Features',
  '/feature-showcase': 'Showcase',
  '/why-optiflow': 'Why OptiFlow',
  '/pricing': 'Pricing',
  '/contact': 'Contact',
  '/newsletter': 'Resources',
  '/faq': 'Resources',
  '/competitive-positioning': 'Resources',
  '/privacy-policy': 'Resources',
  '/terms': 'Resources',
};

function resolveActiveClass(pathname: string, linkLabel: string, dropdownLabel: string): boolean {
  if (routeToActive[pathname] === linkLabel) return true;
  if (linkLabel === dropdownLabel && routeToActive[pathname] === dropdownLabel) return true;
  return false;
}

export default function Nav() {
  const { pathname } = useLocation();
  const { toggleTheme } = useTheme();
  const scrollY = useScrollPosition();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && drawerOpen) {
        closeDrawer();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen, closeDrawer]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const scrolled = scrollY > 20;

  return (
    <>
      <header
        className={`react-nav${scrolled ? ' scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="react-nav-inner">
          <Link to="/" className="react-nav-logo">
            <img
              className="react-nav-logo-img"
              src="/assets/img/OptiFlow.Logo.png"
              alt="OptiFlow"
              width="32"
              height="32"
              loading="eager"
              fetchPriority="high"
            />
            OptiFlow
          </Link>

          <nav className="react-nav-desktop">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href.replace(/^\/os/, '')}
                className={`react-nav-link${resolveActiveClass(pathname, link.label, navDropdown.label) ? ' active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="react-nav-dropdown">
              <span className={`react-nav-link${resolveActiveClass(pathname, '', navDropdown.label) ? ' active' : ''}`}>
                {navDropdown.label}{' '}
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} aria-hidden="true">
                  <polyline points="1,1 5,5 9,1" />
                </svg>
              </span>
              <div className="react-nav-dropdown-menu">
                {navDropdown.items.map((item) => (
                  <Link key={item.label} to={item.href.replace(/^\/os/, '')}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="react-nav-cta">
            <button
              className="react-nav-theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            </button>
            <Button variant="primary" glow as={Link} to={navCTA.href.replace(/^\/os/, '')}>
              {navCTA.label}
            </Button>
          </div>

          <button
            className={`react-nav-hamburger${drawerOpen ? ' open' : ''}`}
            onClick={() => drawerOpen ? closeDrawer() : openDrawer()}
            aria-label="Toggle menu"
            aria-expanded={drawerOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <div
        className={`react-nav-overlay${drawerOpen ? ' active' : ''}`}
        onClick={closeDrawer}
      />

      <div className={`react-nav-drawer${drawerOpen ? ' open' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.href.replace(/^\/os/, '')}
            className={`react-nav-link${resolveActiveClass(pathname, link.label, navDropdown.label) ? ' active' : ''}`}
            onClick={closeDrawer}
          >
            {link.label}
          </Link>
        ))}
        <div className="react-nav-dropdown">
          <span className="react-nav-link" style={{ cursor: 'default' }}>
            {navDropdown.label}
          </span>
          <div className="react-nav-dropdown-menu">
            {navDropdown.items.map((item) => (
              <Link key={item.label} to={item.href.replace(/^\/os/, '')} onClick={closeDrawer}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="react-nav-drawer-cta">
          <Button variant="primary" as={Link} to={navCTA.href.replace(/^\/os/, '')} onClick={closeDrawer} className="w-full justify-center">
            {navCTA.label}
          </Button>
        </div>
      </div>
    </>
  );
}
