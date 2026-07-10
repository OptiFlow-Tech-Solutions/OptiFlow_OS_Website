import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import Button from './Button';
import useScrollPosition from '../hooks/useScrollPosition';
import { navLinks, navDropdown, navCTA } from '../data';
import './Nav.css';

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (drawerOpen) {
          closeDrawer();
        }
        if (dropdownOpen) {
          setDropdownOpen(false);
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen, dropdownOpen, closeDrawer]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const firstLink = drawerRef.current?.querySelector('a');
        firstLink?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

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
                to={link.href}
                className={`react-nav-link${resolveActiveClass(pathname, link.label, navDropdown.label) ? ' active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="react-nav-dropdown" ref={dropdownRef}>
              <button
                className={`react-nav-link${resolveActiveClass(pathname, '', navDropdown.label) ? ' active' : ''}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setDropdownOpen(!dropdownOpen);
                  }
                }}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
              >
                {navDropdown.label}{' '}
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} aria-hidden="true">
                  <polyline points="1,1 5,5 9,1" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="react-nav-dropdown-menu">
                  {navDropdown.items.map((item) => (
                    <Link key={item.label} to={item.href} onClick={() => setDropdownOpen(false)}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="react-nav-cta">
            <button
              className="react-nav-theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            </button>
            <Button variant="primary" glow as={Link} to={navCTA.href}>
              {navCTA.label}
            </Button>
          </div>

          <button
            ref={hamburgerRef}
            className={`react-nav-hamburger${drawerOpen ? ' open' : ''}`}
            onClick={() => drawerOpen ? closeDrawer() : openDrawer()}
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={drawerOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <div
        className={`react-nav-overlay${drawerOpen ? ' active' : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <div ref={drawerRef} className={`react-nav-drawer${drawerOpen ? ' open' : ''}`} role="dialog" aria-label="Mobile navigation" aria-modal={drawerOpen}>
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.href}
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
              <Link key={item.label} to={item.href} onClick={closeDrawer}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="react-nav-drawer-cta">
          <Button variant="primary" as={Link} to={navCTA.href} onClick={closeDrawer} className="w-full justify-center">
            {navCTA.label}
          </Button>
        </div>
      </div>
    </>
  );
}
