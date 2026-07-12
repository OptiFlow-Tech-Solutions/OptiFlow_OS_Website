const modules = [
  { label: 'Tasks', top: '8%', left: '12%', delay: 0 },
  { label: 'Checklists', top: '8%', right: '12%', delay: -0.8 },
  { label: 'Attendance', top: '30%', left: '0%', delay: -1.6 },
  { label: 'SOPs', top: '30%', right: '0%', delay: -2.4 },
  { label: 'Reports', bottom: '30%', left: '0%', delay: -3.2 },
  { label: 'Worklists', bottom: '30%', right: '0%', delay: -4 },
  { label: 'Leaves', bottom: '8%', left: '12%', delay: -4.8 },
  { label: 'Training', bottom: '8%', right: '12%', delay: -5.2 },
];

export default function EcosystemHub() {
  return (
    <>
      <style>{`
        @keyframes hubGlow { 0%,100% { opacity: 0.3; } 50% { opacity: 0.7; } }
        @keyframes orbitFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>
      <div className="hero-ecosystem" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        minHeight: 380,
      }}>
        <div style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), var(--teal))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: 13,
          textAlign: 'center',
          zIndex: 2,
          lineHeight: 1.2,
          position: 'relative',
        }}>
          OptiFlow<br />OS
          <div style={{
            content: '""',
            position: 'absolute',
            inset: -12,
            borderRadius: '50%',
            background: 'color-mix(in oklch, var(--accent) 40%, transparent)',
            animation: 'hubGlow 3s ease-in-out infinite',
            zIndex: -1,
          }} />
        </div>

        {modules.map((mod, i) => {
          const style: React.CSSProperties = {
            position: 'absolute',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '10px 16px',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--fg)',
            boxShadow: '0 4px 16px color-mix(in oklch, var(--fg) 4%, transparent)',
            animation: `orbitFloat 6s ease-in-out infinite`,
            animationDelay: `${mod.delay}s`,
            whiteSpace: 'nowrap',
          };
          if (mod.top !== undefined) style.top = mod.top;
          if (mod.bottom !== undefined) style.bottom = mod.bottom;
          if (mod.left !== undefined) style.left = mod.left;
          if (mod.right !== undefined) style.right = mod.right;
          return <div key={i} style={style}>{mod.label}</div>;
        })}
      </div>
    </>
  );
}
