import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface HelpCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export default function HelpCard({ icon, title, description, ctaLabel, ctaHref }: HelpCardProps) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 24px',
        textAlign: 'center',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          display: 'grid',
          placeItems: 'center',
          margin: '0 auto 16px',
          background: 'var(--accent-soft)',
          borderRadius: 'var(--radius)',
          color: 'var(--accent)',
        }}
      >
        {icon}
      </div>
      <h3 style={{ fontSize: 18, marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.5 }}>
        {description}
      </p>
      <Link
        to={ctaHref}
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--accent)',
          textDecoration: 'none',
          padding: '8px 20px',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          display: 'inline-block',
          transition: 'color 0.2s, border-color 0.2s',
        }}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
