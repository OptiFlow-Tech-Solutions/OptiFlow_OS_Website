const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 14, height: 14, color: 'var(--green)', flexShrink: 0, strokeWidth: 2 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

interface FeatureBenefitsProps {
  items: string[];
}

export default function FeatureBenefits({ items }: FeatureBenefitsProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${Math.min(items.length, 2)}, 1fr)`,
      gap: 'var(--gap-xs)',
      marginTop: 'var(--gap-md)',
    }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--muted)' }}>
          <CheckIcon />
          {item}
        </div>
      ))}
    </div>
  );
}
