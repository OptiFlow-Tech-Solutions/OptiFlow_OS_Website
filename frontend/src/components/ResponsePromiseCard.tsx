import type { ReactNode } from 'react';

interface ResponsePromiseCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function ResponsePromiseCard({ icon, title, description }: ResponsePromiseCardProps) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '12px',
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        background: 'var(--green-soft)', color: 'var(--green)',
        display: 'grid', placeItems: 'center',
      }}>
        {icon}
      </div>
      <div>
        <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{title}</h4>
        <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: 1.5 }}>{description}</p>
      </div>
    </div>
  );
}
