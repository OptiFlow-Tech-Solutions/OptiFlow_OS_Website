import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button';

interface EscalationCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  variant?: 'primary' | 'secondary';
  isExternal?: boolean;
}

export default function EscalationCard({
  icon,
  title,
  description,
  ctaLabel,
  ctaHref,
  variant = 'secondary',
  isExternal,
}: EscalationCardProps) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 24,
        textAlign: 'center',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      <div style={{ color: 'var(--accent)', marginBottom: 12 }}>
        {icon}
      </div>
      <h4 style={{ fontSize: 16, marginBottom: 6 }}>{title}</h4>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
        {description}
      </p>
      {isExternal ? (
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--accent)',
            textDecoration: 'none',
            padding: '8px 20px',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            display: 'inline-block',
          }}
        >
          {ctaLabel}
        </a>
      ) : (
        <Button as={Link} to={ctaHref} variant={variant}>
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
