import { useEffect, useState } from 'react';

interface FeatureNavProps {
  items: { id: string; label: string }[];
  activeId: string | null;
}

export default function FeatureNav({ items, activeId }: FeatureNavProps) {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`feature-nav${stuck ? ' stuck' : ''}`}
      style={{
        position: 'fixed',
        top: 'var(--nav-h)',
        left: 0,
        right: 0,
        zIndex: 99,
        height: 'var(--fnav-h)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        transition: 'box-shadow .3s',
        scrollbarWidth: 'none',
        boxShadow: stuck ? '0 2px 16px color-mix(in oklch, var(--fg) 5%, transparent)' : undefined,
      }}
    >
      <div style={{
        display: 'flex',
        gap: 4,
        paddingInline: 'var(--gutter)',
        minWidth: 'max-content',
        margin: '0 auto',
      }}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollTo(item.id)}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius)',
              fontSize: 13,
              fontWeight: activeId === item.id ? 600 : 500,
              color: activeId === item.id ? 'white' : 'var(--muted)',
              background: activeId === item.id ? 'var(--accent)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              letterSpacing: '-.01em',
              transition: 'color 0.2s, background 0.2s, border-color 0.2s',
              fontFamily: 'inherit',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
