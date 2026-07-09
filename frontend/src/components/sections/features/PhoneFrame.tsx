interface PhoneFrameProps {
  title: string;
  rows: number[];
  buttonColor?: string;
  extra?: string;
}

export default function PhoneFrame({ title, rows, buttonColor = 'var(--accent)', extra }: PhoneFrameProps) {
  return (
    <div className="phone-frame" style={{
      width: 240,
      borderRadius: 32,
      background: 'var(--surface)',
      border: '2px solid var(--border)',
      padding: '16px 8px',
      margin: '0 auto',
      boxShadow: '0 8px 40px color-mix(in oklch, var(--fg) 6%, transparent)',
    }}>
      <div className="phone-notch" style={{
        width: 80,
        height: 24,
        background: 'var(--fg)',
        borderRadius: '0 0 16px 16px',
        margin: '-8px auto 16px',
      }} />
      <div style={{ fontWeight: 700, fontSize: 11, textAlign: 'center', marginBottom: 12, color: 'var(--accent)' }}>
        {title}
      </div>

      {extra && (
        <>
          <div style={{
            width: 50, height: 50, borderRadius: '50%',
            background: buttonColor, margin: '0 auto 14px',
            opacity: 0.9,
          }} />
          <div style={{ width: '70%', height: 8, background: 'var(--border)', borderRadius: 4, margin: '0 auto 10px' }} />
          <div style={{ fontSize: 10, textAlign: 'center', color: 'var(--muted)', marginBottom: 10 }}>
            {extra}
          </div>
        </>
      )}

      {rows.map((w, i) => (
        <div key={i} style={{
          height: 8,
          background: 'var(--border)',
          borderRadius: 4,
          marginBottom: 10,
          width: `${w}%`,
        }} />
      ))}

      <div style={{
        marginTop: 14,
        height: 28,
        borderRadius: 14,
        background: buttonColor,
        opacity: 0.5,
      }} />
    </div>
  );
}
