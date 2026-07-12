export default function FeaturesStyles() {
  return (
    <style>{`
      :root { --fnav-h: 52px; }
      html { scroll-padding-top: calc(var(--nav-h) + var(--fnav-h) + 20px); }

      .feature-nav::-webkit-scrollbar { display: none; }

      .hero {
        padding-top: calc(var(--nav-h) + 68px);
        padding-bottom: 80px;
        overflow: hidden;
        position: relative;
      }
      .hero::before {
        content: ''; position: absolute; top: -40%; right: -20%;
        width: 80%; height: 140%;
        background: radial-gradient(ellipse at center, color-mix(in oklch, var(--teal) 7%, transparent) 0%, transparent 70%);
        pointer-events: none;
      }
      .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
      .hero-content { position: relative; z-index: 2; }
      .hero-content h1 { margin-bottom: 18px; }
      .hero-content .lead { margin-bottom: 28px; }
      .hero-cta { display: flex; gap: var(--gap-sm); flex-wrap: wrap; margin-bottom: 32px; }
      .hero-trust { display: grid; grid-template-columns: 1fr 1fr; gap: 6px var(--gap-lg); }
      .hero-trust span { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--muted); }
      .hero-trust svg { width: 15px; height: 15px; color: var(--green); flex-shrink: 0; stroke-width: 2; }
      .hero-visual { position: relative; z-index: 1; }

      .feature-section { scroll-margin-top: calc(var(--nav-h) + var(--fnav-h) + 32px); }

      .feature-hero { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gap-xl); align-items: start; }

      .feature-problem {
        background: color-mix(in oklch, var(--accent) 3%, var(--bg));
        border-left: 3px solid var(--accent);
        padding: 16px 20px;
        border-radius: 0 var(--radius) var(--radius) 0;
        margin-bottom: var(--gap-md);
        font-size: 14px;
        color: var(--muted);
      }
      .feature-problem strong { color: var(--fg); }
      .feature-benefits { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gap-xs); margin-top: var(--gap-md); }
      .feature-benefit-item { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--muted); }
      .feature-benefit-item svg { width: 14px; height: 14px; color: var(--green); flex-shrink: 0; stroke-width: 2; }

      .dashboard-metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: var(--gap-sm);
        margin-bottom: var(--gap-md);
      }
      .dash-table { width: 100%; border-collapse: collapse; font-size: 13px; }
      .dash-table th { text-align: left; color: var(--muted); font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; padding: 8px 10px; border-bottom: 1px solid var(--border); }
      .dash-table td { padding: 10px; border-bottom: 1px solid var(--border); }
      .dash-bar { display: inline-block; height: 6px; border-radius: 3px; background: var(--accent); }

      .process-steps-wrapper { display: flex; gap: 0; position: relative; }
      .process-steps-wrapper > div { flex: 1; text-align: center; position: relative; padding-top: 32px; }

      .phone-notch { width: 80px; height: 24px; background: var(--fg); border-radius: 0 0 16px 16px; margin: -8px auto 16px; }

      .feature-cta {
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 20px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: var(--gap-md);
        margin-top: var(--gap-lg);
      }
      .feature-cta p { font-weight: 600; font-size: 15px; }

      [data-theme="dark"] .card { background: var(--surface); border-color: var(--border); box-shadow: 0 1px 3px rgba(0,0,0,.18), 0 0 1px rgba(255,255,255,.04); }
      [data-theme="dark"] .card:hover { border-color: color-mix(in oklch, var(--teal) 25%, var(--border)); box-shadow: 0 12px 40px color-mix(in oklch, white 3%, transparent), 0 0 18px rgba(39,141,159,.10); }
      [data-theme="dark"] .btn-secondary { background: var(--surface); border-color: var(--border); color: var(--fg); }
      [data-theme="dark"] .btn-secondary:hover { border-color: var(--fg); }
      [data-theme="dark"] .btn-ghost { color: var(--muted); }
      [data-theme="dark"] .dashboard-preview { background: oklch(16% 0.018 245); border-color: var(--border); }
      [data-theme="dark"] .phone-frame { background: oklch(21% 0.018 245); }
      [data-theme="dark"] .feature-cta { background: var(--surface); border-color: var(--border); }

      @media (max-width: 1024px) {
        .hero-grid, .feature-hero { grid-template-columns: 1fr; gap: var(--gap-xl); }
        .hero-visual { order: -1; }
        .hero-ecosystem { min-height: 300px; }
        .process-steps-wrapper { flex-wrap: wrap; gap: var(--gap-md); }
        .process-steps-wrapper > div { flex: 1 1 45%; }
      }
      @media (max-width: 768px) {
        .hero-cta { flex-direction: column; }
        .hero-trust { grid-template-columns: 1fr; }
        .feature-cta { flex-direction: column; text-align: center; }
      }
      @media (max-width: 480px) {
        .phone-frame { width: 200px; border-radius: 26px; padding: 12px 6px; }
        .feature-benefits { grid-template-columns: 1fr; }
      }
    `}</style>
  );
}
