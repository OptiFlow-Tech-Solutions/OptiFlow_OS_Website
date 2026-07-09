import type { ReactNode } from 'react';

interface ChannelCardProps {
  icon: ReactNode;
  title: string;
  detail: string;
  actionLink?: string;
  actionLabel?: string;
  variant: 'sales' | 'support';
}

export default function ChannelCard({ icon, title, detail, actionLink, actionLabel, variant }: ChannelCardProps) {
  const colors = variant === 'sales'
    ? { bg: 'var(--accent-soft)', fg: 'var(--accent)', linkColor: 'var(--accent)' }
    : { bg: 'var(--teal-soft)', fg: 'var(--teal)', linkColor: 'var(--teal)' };

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '28px 24px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        background: colors.bg, color: colors.fg,
        display: 'grid', placeItems: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{title}</h4>
        <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.5 }}>{detail}</p>
      </div>
      {actionLink && actionLabel && (
        <a
          href={actionLink}
          style={{
            color: colors.linkColor,
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
            marginTop: '4px',
          }}
        >
          {actionLabel}
        </a>
      )}
    </div>
  );
}
