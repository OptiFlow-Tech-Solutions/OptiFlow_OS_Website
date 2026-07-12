interface FeatureProblemProps {
  children: string;
}

export default function FeatureProblem({ children }: FeatureProblemProps) {
  return (
    <div style={{
      background: 'color-mix(in oklch, var(--accent) 3%, var(--bg))',
      borderLeft: '3px solid var(--accent)',
      padding: '16px 20px',
      borderRadius: '0 var(--radius) var(--radius) 0',
      marginBottom: 'var(--gap-md)',
      fontSize: 14,
      color: 'var(--muted)',
    }}>
      <strong style={{ color: 'var(--fg)' }}>The Problem:</strong> {children}
    </div>
  );
}
