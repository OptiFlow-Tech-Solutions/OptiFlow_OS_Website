export default function DashboardMockup() {
  return (
    <div className="dash-main" style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px',
      boxShadow: '0 20px 60px color-mix(in oklch, var(--fg) 8%, transparent)',
      animation: 'floatDashboard 6s ease-in-out infinite',
    }}>
      <style>{`
        @keyframes floatDashboard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .dash-main { animation: none; }
        }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <KPI label="Tasks On Track" value="94%" color="var(--accent)" />
        <KPI label="Team Attendance" value="47" color="var(--accent)" />
      </div>

      <Chart />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
        <KPI label="SOP Compliance" value="98%" color="var(--accent)" />
        <div style={{
          background: 'color-mix(in oklch, var(--fg) 3%, transparent)',
          borderRadius: 'var(--radius)',
          padding: '14px',
        }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--muted)', marginBottom: '4px' }}>
            Monthly Savings
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 700, color: 'var(--green)' }}>
            ₹2.8L
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      background: 'color-mix(in oklch, var(--fg) 3%, transparent)',
      borderRadius: 'var(--radius)',
      padding: '14px',
    }}>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--muted)', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 700, color }}>
        {value}
      </div>
    </div>
  );
}

function Chart() {
  const heights = ['40%', '65%', '50%', '72%', '45%', '58%', '68%'];
  const colors = ['var(--accent)', 'var(--teal)', 'var(--accent)', 'var(--teal)', 'var(--accent)', 'var(--teal)', 'var(--accent)'];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div style={{
      background: 'color-mix(in oklch, var(--fg) 3%, transparent)',
      borderRadius: 'var(--radius)',
      padding: '16px',
    }}>
      <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px' }}>
        Weekly Task Completion
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '60px', paddingTop: '8px' }}>
        {heights.map((h, i) => (
          <div
            key={i}
            style={{ flex: 1, height: h, borderRadius: '4px 4px 0 0', background: colors[i] }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '10px', color: 'var(--muted)' }}>
        {labels.map((l) => (
          <span key={l} style={{ flex: 1, textAlign: 'center' }}>{l}</span>
        ))}
      </div>
    </div>
  );
}
