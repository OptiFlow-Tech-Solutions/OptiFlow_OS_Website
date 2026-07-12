import { type ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      {icon ?? (
        <div style={{ color: 'var(--muted)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      )}
      <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--fg)' }}>{title}</h3>
      <p style={{ color: 'var(--muted)', maxWidth: '36ch', lineHeight: 1.6 }}>{description}</p>
      {action && (
        <button onClick={action.onClick} className="btn btn-primary" style={{ marginTop: 8 }}>
          {action.label}
        </button>
      )}
    </div>
  );
}
