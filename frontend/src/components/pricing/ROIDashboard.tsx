import { useRef, useEffect, useState, useCallback } from 'react';
import { DASHBOARD_DATA } from './pricingData';

const MIN_WIDTH_PCT = 4;
const LABEL_THRESHOLD = 15;

export default function ROIDashboard() {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [animated, setAnimated] = useState(false);
  const prefersReduced = useRef(false);

  const maxValue = useRef(0);
  DASHBOARD_DATA.forEach((d) => {
    maxValue.current = Math.max(maxValue.current, d.tradValue, d.optiValue);
  });

  const updateConnectors = useCallback(() => {
    rowRefs.current.forEach((row) => {
      if (!row) return;
      const conn = row.querySelector('.rd-connector') as HTMLElement | null;
      if (!conn) return;
      const fills = row.querySelectorAll('.rd-bar-fill');
      const tradRect = fills[0]?.getBoundingClientRect();
      const optiRect = fills[1]?.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();
      if (!tradRect || !optiRect) return;
      const tradRight = tradRect.left + tradRect.width - rowRect.left;
      const optiRight = optiRect.left + optiRect.width - rowRect.left;
      const start = Math.min(tradRight, optiRight);
      const end = Math.max(tradRight, optiRight);
      conn.style.left = start + 'px';
      conn.style.width = Math.max(0, end - start) + 'px';
    });
  }, []);

  const reveal = useCallback(() => {
    if (animated && !prefersReduced.current) return;
    setAnimated(true);
    updateConnectors();
    if (prefersReduced.current) return;
  }, [animated, updateConnectors]);

  useEffect(() => {
    prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    const el = containerRef.current;
    if (el) {
      observer.observe(el);
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) reveal();
    }

    const onResize = () => {
      updateConnectors();
    };
    window.addEventListener('resize', onResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [reveal, updateConnectors]);

  return (
    <div
      ref={containerRef}
      className="roi-dashboard"
      role="region"
      aria-label="Cost comparison chart"
      style={{
        background: 'linear-gradient(180deg, var(--surface), color-mix(in oklch, var(--fg) 1%, var(--surface)))',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        boxShadow: '0 1px 3px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.04)',
        overflow: 'hidden',
      }}
    >
      <div
        className="rd-header"
        style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, color-mix(in oklch, var(--accent) 5%, transparent), color-mix(in oklch, var(--teal) 4%, transparent))',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          className="rd-eyebrow"
          style={{
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            color: 'var(--teal)',
            marginBottom: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--lime)',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }}
          />
          Live Savings Analysis
        </div>
        <div
          className="rd-savings"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: 'var(--lime)',
            marginBottom: 2,
          }}
        >
          Up to 95%
        </div>
        <div className="rd-savings-label" style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>
          Cost reduction vs traditional per-user SaaS pricing
        </div>
      </div>

      <div className="rd-body" style={{ padding: '16px 20px' }}>
        <div className="rd-section-title" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)', marginBottom: 8 }}>
          Cost by Team Size (Annual)
        </div>

        <div className="rd-compare" role="table" aria-label="Cost comparison by team size">
          <div className="rd-row-head" role="row" style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '4px 0 8px', display: 'flex', alignItems: 'center' }}>
            <span className="rd-row-label" role="columnheader" style={{ flex: '0 0 44px', fontSize: 12, fontWeight: 600, color: 'var(--fg)', textAlign: 'center' }}>
              Team
            </span>
            <span className="rd-row-body" role="columnheader" style={{ flex: 1, fontSize: 10, padding: '0 6px' }}>
              Traditional SaaS &middot; OptiFlow OS
            </span>
          </div>

          {DASHBOARD_DATA.map((row, i) => {
            const tradPct = Math.max(MIN_WIDTH_PCT, (row.tradValue / maxValue.current) * 100);
            const optiPct = Math.max(MIN_WIDTH_PCT, (row.optiValue / maxValue.current) * 100);

            return (
              <div
                key={row.team}
                ref={(el) => { rowRefs.current[i] = el; }}
                className="rd-row"
                role="row"
                tabIndex={0}
                aria-label={`${row.team} users: Traditional SaaS ₹${row.tradLabel}/year, OptiFlow OS ₹${row.optiLabel}/year, save ${row.savePct}`}
                onMouseEnter={() => updateConnectors()}
                onFocus={() => updateConnectors()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '3px 0',
                  borderRadius: 'var(--radius)',
                  position: 'relative',
                  transition: 'background .15s, box-shadow .15s',
                }}
              >
                <span className="rd-row-label" role="rowheader" style={{ flex: '0 0 44px', fontSize: 12, fontWeight: 600, color: 'var(--fg)', textAlign: 'center' }}>
                  {row.team}
                </span>
                <div className="rd-row-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                  <div
                    className="rd-bar-track"
                    style={{
                      width: '100%',
                      height: 18,
                      background: 'oklch(95% 0.004 240)',
                      border: '1px solid rgba(255,255,255,.5)',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,.05)',
                      borderRadius: 999,
                      position: 'relative',
                      overflow: 'visible',
                    }}
                  >
                    <div
                      className="rd-bar-fill traditional"
                      style={{
                        width: animated ? tradPct + '%' : '0%',
                        height: '100%',
                        borderRadius: 999,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        background: 'linear-gradient(180deg, oklch(82% 0.14 70) 0%, oklch(72% 0.16 55) 50%, oklch(62% 0.18 40) 100%)',
                        boxShadow: '0 1px 2px rgba(0,0,0,.08)',
                        transition: prefersReduced.current ? 'none' : 'width 1s cubic-bezier(0.22,1,0.36,1)',
                      }}
                    >
                      <span
                        className="rd-bar-val"
                        style={{
                          background: 'rgba(0,0,0,.45)',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          position: 'absolute',
                          top: '50%',
                          transform: tradPct < LABEL_THRESHOLD ? 'translate(100%, -50%)' : 'translate(0, -50%)',
                          right: tradPct < LABEL_THRESHOLD ? '-6px' : '6px',
                        }}
                      >
                        {row.tradLabel}
                      </span>
                    </div>
                  </div>

                  <div
                    className="rd-bar-track"
                    style={{
                      width: '100%',
                      height: 18,
                      background: 'oklch(95% 0.004 240)',
                      border: '1px solid rgba(255,255,255,.5)',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,.05)',
                      borderRadius: 999,
                      position: 'relative',
                      overflow: 'visible',
                    }}
                  >
                    <div
                      className="rd-bar-fill optiflow"
                      style={{
                        width: animated ? optiPct + '%' : '0%',
                        height: '100%',
                        borderRadius: 999,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        background: 'linear-gradient(180deg, color-mix(in oklch, var(--lime) 90%, oklch(55% 0.14 135)) 0%, var(--lime) 50%, color-mix(in oklch, var(--lime) 70%, black) 100%)',
                        boxShadow: '0 1px 2px rgba(0,0,0,.08)',
                        transition: prefersReduced.current ? 'none' : 'width 1s cubic-bezier(0.22,1,0.36,1)',
                      }}
                    >
                      <span
                        className="rd-bar-val"
                        style={{
                          background: 'rgba(0,0,0,.45)',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          position: 'absolute',
                          top: '50%',
                          transform: optiPct < LABEL_THRESHOLD ? 'translate(100%, -50%)' : 'translate(0, -50%)',
                          right: optiPct < LABEL_THRESHOLD ? '-6px' : '6px',
                        }}
                      >
                        {row.optiLabel}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`rd-save-badge ${animated ? 'visible' : ''}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      paddingLeft: 44,
                      fontSize: 10,
                      fontWeight: 500,
                      color: 'var(--lime)',
                      opacity: prefersReduced.current || animated ? 1 : 0,
                      transform: prefersReduced.current || animated ? 'translateY(0)' : 'translateY(4px)',
                      transition: `opacity .4s ease ${0.3 + i * 0.08}s, transform .4s ease ${0.3 + i * 0.08}s`,
                    }}
                  >
                    <span className="save-arrow" style={{ fontSize: 12 }}>&darr;</span>
                    {row.saveLabel}
                    <span className="save-pct" style={{ background: 'var(--green-soft)', color: 'var(--lime)', padding: '1px 6px', borderRadius: 999, fontSize: 10, fontWeight: 700 }}>
                      {row.savePct}
                    </span>
                  </div>
                </div>

                <div
                  className="rd-tooltip"
                  style={{
                    position: 'absolute',
                    top: -32,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--fg)',
                    color: 'var(--bg)',
                    fontSize: 10,
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    padding: '5px 10px',
                    borderRadius: 6,
                    pointerEvents: 'none',
                    opacity: 0,
                    transition: 'opacity .12s ease, transform .12s ease',
                    zIndex: 10,
                  }}
                >
                  <span style={{ fontWeight: 700 }}>Traditional SaaS</span> {row.tradLabel}/yr &nbsp;&middot;&nbsp;
                  <span style={{ fontWeight: 700 }}>OptiFlow OS</span> {row.optiLabel}/yr &nbsp;&middot;&nbsp;
                  <span style={{ fontWeight: 700 }}>Save</span> {row.savePct}
                </div>

                <div
                  className="rd-connector"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    height: 1,
                    background: 'var(--lime)',
                    opacity: 0,
                    pointerEvents: 'none',
                    zIndex: 2,
                    transition: 'opacity .15s ease',
                  }}
                />
              </div>
            );
          })}
        </div>

        <div
          className="rd-summary"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
            marginTop: 14,
            paddingTop: 14,
            borderTop: '1px solid var(--border)',
          }}
        >
          <div className="rd-stat" style={{ textAlign: 'center' }}>
            <div className="rd-stat-val" style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>No Per-User</div>
            <div className="rd-stat-lbl" style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>Charges</div>
          </div>
          <div className="rd-stat" style={{ textAlign: 'center' }}>
            <div className="rd-stat-val green" style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--lime)' }}>Fixed Annual</div>
            <div className="rd-stat-lbl" style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>Pricing</div>
          </div>
          <div className="rd-stat" style={{ textAlign: 'center' }}>
            <div className="rd-stat-val teal" style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--teal)' }}>Cloud Hosting</div>
            <div className="rd-stat-lbl" style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>Included</div>
          </div>
        </div>
      </div>

      {/* CSS for hover states and dark mode */}
      <style>{`
        .rd-row:hover { background: color-mix(in oklch, var(--fg) 3%, transparent); box-shadow: 0 2px 8px rgba(0,0,0,.04); }
        .rd-row:hover .rd-tooltip, .rd-row:focus-visible .rd-tooltip { opacity: 1 !important; }
        .rd-row:hover .rd-connector { opacity: .35 !important; }
        .rd-row:hover .rd-bar-fill { filter: brightness(1.08); }
        .rd-row:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; border-radius: var(--radius); }
        .rd-save-badge.visible { opacity: 1; transform: translateY(0); }

        [data-theme="dark"] .roi-dashboard {
          background: linear-gradient(180deg, color-mix(in oklch, var(--fg) 3%, transparent), color-mix(in oklch, var(--fg) 2%, transparent));
        }
        [data-theme="dark"] .rd-bar-track { background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.08); box-shadow: inset 0 1px 3px rgba(0,0,0,.2); }
        [data-theme="dark"] .rd-row:hover { background: color-mix(in oklch, var(--fg) 4%, transparent); box-shadow: 0 2px 8px rgba(0,0,0,.15); }
        [data-theme="dark"] .rd-tooltip { background: var(--border); color: var(--fg) !important; }
        [data-theme="dark"] .rd-save-badge .save-pct { background: color-mix(in oklch, var(--lime) 12%, transparent); }

        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
