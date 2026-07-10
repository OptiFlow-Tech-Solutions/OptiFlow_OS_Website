import { useState, useMemo } from 'react';
import { CALCULATOR, calcSavings, fmtINR, fmtINRLakhs } from './pricingData';

export default function ROICalculator() {
  const [teamSize, setTeamSize] = useState<number>(CALCULATOR.teamSize.default);
  const [perUserCost, setPerUserCost] = useState<number>(CALCULATOR.perUserCost.default);

  const result = useMemo(() => calcSavings(teamSize, perUserCost), [teamSize, perUserCost]);

  return (
    <div
      className="roi-calc"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: 40,
        maxWidth: 960,
        margin: '0 auto',
      }}
    >
      <div className="pc-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: 32, alignItems: 'start' }}>
        {/* Inputs */}
        <div className="pc-col" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="pc-field" style={{ display: 'flex', flexDirection: 'column' }}>
            <label className="pc-label" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Team Size
            </label>
            <input
              type="range"
              className="pc-slider"
              min={CALCULATOR.teamSize.min}
              max={CALCULATOR.teamSize.max}
              step={CALCULATOR.teamSize.step}
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)', height: 6, borderRadius: 3, background: 'var(--border)', outline: 'none', appearance: 'none' }}
            />
            <div className="pc-range-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
              <span>{CALCULATOR.teamSize.min}</span>
              <span className="pc-range-cur" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--fg)' }}>
                {teamSize} employees
              </span>
              <span>{CALCULATOR.teamSize.max}</span>
            </div>
          </div>

          <div className="pc-field" style={{ display: 'flex', flexDirection: 'column' }}>
            <label className="pc-label" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Per-User Monthly SaaS Cost (₹)
            </label>
            <input
              type="range"
              className="pc-slider"
              min={CALCULATOR.perUserCost.min}
              max={CALCULATOR.perUserCost.max}
              step={CALCULATOR.perUserCost.step}
              value={perUserCost}
              onChange={(e) => setPerUserCost(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)', height: 6, borderRadius: 3, background: 'var(--border)', outline: 'none', appearance: 'none' }}
            />
            <div className="pc-range-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
              <span>₹{CALCULATOR.perUserCost.min}</span>
              <span className="pc-range-cur" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--fg)' }}>
                ₹{perUserCost.toLocaleString('en-IN')}/user/mo
              </span>
              <span>₹{CALCULATOR.perUserCost.max.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Plan badge */}
          <div className="pc-plan-badge" style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
            background: 'var(--teal-soft)', borderRadius: 'var(--radius)',
            border: '1px solid color-mix(in oklch, var(--teal) 20%, transparent)', marginTop: 4,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--teal)' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--teal)' }}>{result.plan.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>
                {fmtINR(result.plan.annual)}/yr &middot; {result.plan.teamSlug}
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="pc-col" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="pc-bd-section" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="pc-bd-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="pc-bd-l" style={{ fontSize: 13, color: 'var(--muted)' }}>Traditional SaaS (Annual)</span>
              <span className="pc-bd-v pc-bd-red" style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600, color: 'oklch(50% 0.14 25)' }}>
                {fmtINR(result.tradAnnual)}
              </span>
            </div>
            <div className="pc-bd-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="pc-bd-l" style={{ fontSize: 13, color: 'var(--muted)' }}>OptiFlow (Annual + Setup)</span>
              <span className="pc-bd-v pc-bd-green" style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600, color: 'var(--lime)' }}>
                {fmtINR(result.optiTotal)}
              </span>
            </div>
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
          <div className="pc-bd-section" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="pc-bd-row pc-bd-highlight" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 4 }}>
              <span className="pc-bd-l" style={{ fontSize: 13, color: 'var(--muted)' }}>You Save</span>
              <span className="pc-bd-v pc-bd-lime" style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: 'var(--lime)' }}>
                {fmtINR(result.savings)}
              </span>
            </div>
            <div className="pc-bd-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="pc-bd-l" style={{ fontSize: 13, color: 'var(--muted)' }}>Cost Reduction</span>
              <span className="pc-bd-v pc-bd-bold" style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600, color: 'var(--fg)' }}>
                {result.pct}%
              </span>
            </div>
          </div>
        </div>

        {/* Savings card + matrix */}
        <div className="pc-col" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="pc-save-card" style={{
            background: 'linear-gradient(135deg, var(--green-soft), color-mix(in oklch, var(--lime) 6%, transparent))',
            border: '1px solid color-mix(in oklch, var(--lime) 20%, transparent)',
            borderRadius: 'var(--radius-lg)',
            padding: 24,
            textAlign: 'center',
          }}>
            <div style={{ color: 'var(--lime)', marginBottom: 8 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: 'var(--lime)', lineHeight: 1.1 }}>
              {fmtINRLakhs(result.savings)}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Annual Savings
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
              vs traditional per-user pricing
            </div>
          </div>

          <div className="pc-matrix" style={{
            display: 'flex', flexDirection: 'column',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          }}>
            {[
              { key: 'Team', val: teamSize.toString() },
              { key: 'Per-User', val: `${fmtINR(perUserCost)}/mo` },
              { key: 'Plan', val: result.plan.name },
              { key: 'Effective/User', val: `${fmtINR(result.effectivePerUser)}/mo` },
            ].map((row) => (
              <div key={row.key} className="pc-matrix-row" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 16px', borderBottom: '1px solid var(--border)',
              }}>
                <span className="pc-matrix-key" style={{ fontSize: 13, color: 'var(--muted)' }}>{row.key}</span>
                <span className="pc-matrix-val" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>
                  {row.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .pc-matrix-row:last-child { border-bottom: none; }
        [data-theme="dark"] .roi-calc { background: color-mix(in oklch, var(--fg) 4%, transparent); }

        @media (max-width: 1024px) {
          .pc-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .pc-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
