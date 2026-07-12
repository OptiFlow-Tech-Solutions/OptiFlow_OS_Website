import { Link } from 'react-router-dom';
import Button from '../Button';

interface PricingCardProps {
  name: string;
  teamRange: string;
  annual: number;
  setupFee: number;
  businessValue: string[];
  coreModules: string[];
  featured: boolean;
  href: string;
}

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function fmtINR(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}

export default function PricingCard({ name, teamRange, annual, setupFee, businessValue, coreModules, featured, href }: PricingCardProps) {
  return (
    <div
      className={`pricing-card ${featured ? 'featured' : ''}`}
      style={{
        background: featured
          ? 'linear-gradient(180deg, var(--surface) 0%, var(--teal-soft) 100%)'
          : 'var(--surface)',
        border: featured ? 'none' : '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '36px 32px',
        position: 'relative',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default',
      }}
    >
      {featured && (
        <div
          className="pc-badge"
          style={{
            position: 'absolute',
            top: -14,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, var(--accent), var(--teal))',
            color: 'white',
            padding: '6px 20px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}
        >
          Most Popular
        </div>
      )}
      <h3
        className="pc-name"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 4,
          color: featured ? 'var(--teal)' : 'var(--fg)',
        }}
      >
        {name}
      </h3>
      <p className="pc-team" style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
        {teamRange}
      </p>
      <div className="pc-pricing" style={{ marginBottom: 8 }}>
        <span className="pc-currency" style={{ fontSize: 18, fontWeight: 600, verticalAlign: 'top', position: 'relative', top: 8 }}>
          ₹
        </span>
        <span className="pc-price" style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 700, lineHeight: 1 }}>
          {annual.toLocaleString('en-IN')}
        </span>
        <span className="pc-period" style={{ fontSize: 14, color: 'var(--muted)' }}>/year</span>
      </div>
      <p className="pc-setup" style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 6 }}>
        + <span style={{ fontWeight: 600, color: 'var(--fg)' }}>{fmtINR(setupFee)}</span> one-time implementation
      </p>

      <p className="pc-label" style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 'var(--gap-sm)' }}>
        Business Value
      </p>
      <ul className="pc-features" style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {businessValue.map((v, i) => (
          <li key={i} style={{ fontSize: 14, display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.5 }}>
            <span style={{ color: 'var(--green)', flexShrink: 0, marginTop: 2 }}><CheckIcon /></span>
            <span>{v}</span>
          </li>
        ))}
      </ul>

      <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '20px 0' }} />

      <p className="pc-label" style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 'var(--gap-sm)' }}>
        {featured ? 'Everything in Starter +' : 'Core Modules'}
      </p>
      <ul className="pc-features" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {coreModules.map((m, i) => (
          <li key={i} style={{ fontSize: 14, lineHeight: 1.5 }}>{m}</li>
        ))}
      </ul>

      <Button
        as={Link}
        to={href}
        variant="primary"
        size="default"
        glow
        style={{
          width: '100%',
          marginTop: 20,
          ...(featured ? { background: 'linear-gradient(135deg, var(--teal), var(--accent))' } : {}),
        }}
      >
        Book Free Demo
      </Button>

      <style>{`
        .pricing-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px color-mix(in oklch, var(--fg) 8%, transparent); }
        .pricing-card.featured { box-shadow: 0 0 0 1px var(--teal), 0 24px 64px color-mix(in oklch, var(--teal) 12%, transparent); }
        [data-theme="dark"] .pricing-card.featured { box-shadow: 0 0 0 2px var(--teal), 0 24px 64px color-mix(in oklch, var(--teal) 16%, transparent); }
      `}</style>
    </div>
  );
}
