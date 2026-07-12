export default function ProductOverviewStyles() {
  return (
    <style>{`
      /* === Hero & Dashboard Mockups === */
      .hero { padding-top: calc(var(--nav-h) + 60px); padding-bottom: 80px; overflow: hidden; position: relative; }
      .hero::before { content: ''; position: absolute; top: -50%; right: -20%; width: 80%; height: 150%; background: radial-gradient(ellipse at center, color-mix(in oklch, var(--teal) 8%, transparent) 0%, transparent 70%); pointer-events: none; }
      .hero-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 64px; align-items: center; }
      .hero-content { position: relative; z-index: 2; }
      .hero-content h1 { margin-bottom: 20px; }
      .hero-content .lead { margin-bottom: 32px; }
      .hero-cta { display: flex; gap: var(--gap-sm); flex-wrap: wrap; margin-bottom: 40px; }
      .hero-trust { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px 24px; }
      .hero-trust-item { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 500; color: var(--muted); }
      .hero-trust-item svg { flex-shrink: 0; width: 18px; height: 18px; color: var(--green); }
      .hero-dashboard { position: relative; z-index: 2; }
      .dash-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px 24px; box-shadow: 0 4px 24px color-mix(in oklch, var(--fg) 8%, transparent); }
      .dash-kpi { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap-sm); margin-bottom: var(--gap-md); }
      .dash-kpi-item { text-align: center; padding: 12px 8px; border-radius: var(--radius); background: color-mix(in oklch, var(--teal) 5%, var(--bg)); }
      .dash-kpi-val { font-family: var(--font-mono); font-size: 22px; font-weight: 700; color: var(--accent); }
      .dash-kpi-label { font-size: 11px; color: var(--muted); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
      .dash-chart { background: color-mix(in oklch, var(--fg) 3%, var(--bg)); border-radius: var(--radius); padding: 16px; margin-bottom: var(--gap-sm); }
      .dash-chart-bar { height: 6px; border-radius: 3px; background: linear-gradient(90deg, var(--accent), var(--teal)); margin-bottom: 12px; }
      .dash-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--gap-sm); }
      .dash-widget { background: color-mix(in oklch, var(--fg) 3%, var(--bg)); border-radius: var(--radius); padding: 14px; }
      .dash-widget h4 { font-size: 13px; font-weight: 500; color: var(--muted); margin: 0 0 8px; }
      .dash-widget .w-val { font-family: var(--font-mono); font-size: 20px; font-weight: 700; color: var(--fg); }
      .dash-table { width: 100%; text-align: left; font-size: 12px; border-collapse: collapse; }
      .dash-table th, .dash-table td { padding: 6px 8px; }
      .dash-table th { color: var(--muted); font-weight: 500; border-bottom: 1px solid var(--border); }
      .dash-table td { border-bottom: 1px solid color-mix(in oklch, var(--border) 50%, transparent); }
      .dash-badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 500; }
      .dash-badge.done { background: color-mix(in oklch, var(--green) 15%, transparent); color: var(--green); }
      .dash-badge.wip { background: color-mix(in oklch, var(--teal) 15%, transparent); color: var(--teal); }
      .float-anim { animation: floatDash 5s ease-in-out infinite; }
      @keyframes floatDash { 0%, 100% { transform: translateY(0) scale(1) rotate(0deg); } 50% { transform: translateY(-10px) scale(1.01) rotate(-0.5deg); } }

      /* === Interactive Demo Mockups === */
      .demo-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: var(--gap-md); padding: 0 4px; }
      .demo-tab { padding: 8px 16px; border-radius: var(--radius) var(--radius) 0 0; font-size: 13px; font-weight: 500; color: var(--muted); cursor: pointer; transition: color 0.2s, background 0.2s; border: 1px solid transparent; border-bottom: none; margin-bottom: -1px; }
      .demo-tab:hover { color: var(--fg); background: var(--accent-soft); }
      .demo-tab.active { color: var(--accent); background: var(--surface); border-color: var(--border); font-weight: 600; }
      .demo-panel { display: none; animation: demoFadeIn 0.3s var(--ease-out); }
      .demo-panel.active { display: block; }
      @keyframes demoFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

      /* === Transform Flow === */
      .transform-flow { display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap; margin: 32px 0; }
      .transform-stage { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 32px 24px; text-align: center; min-width: 180px; flex: 1; max-width: 260px; transition: transform 0.3s ease; }
      .transform-stage:hover { transform: translateY(-3px); box-shadow: 0 8px 32px color-mix(in oklch, var(--fg) 5%, transparent); }
      .transform-stage.chaos { border-color: color-mix(in oklch, red 25%, transparent); background: color-mix(in oklch, red 4%, transparent); }
      .transform-stage.optiflow { border-color: var(--accent); background: color-mix(in oklch, var(--accent) 6%, transparent); }
      .transform-stage.system { border-color: var(--green); background: color-mix(in oklch, var(--green) 6%, transparent); }
      .transform-arrow { display: flex; align-items: center; color: var(--teal); flex-shrink: 0; }
      .transform-arrow svg { width: 32px; height: 32px; animation: arrowPulse 1.5s ease-in-out infinite; }
      @keyframes arrowPulse { 0%, 100% { transform: translateX(0); opacity: 0.5; } 50% { transform: translateX(6px); opacity: 1; } }
      .transform-tag { display: inline-flex; gap: 6px; align-items: center; font-size: 12px; color: var(--muted); margin-top: 8px; }
      .transform-tag::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--fg); opacity: 0.25; }

      /* === Architecture Diagram === */
      .arch-diagram { position: relative; display: flex; align-items: center; justify-content: center; min-height: 420px; margin: 40px 0; }
      .arch-hub { position: relative; z-index: 2; width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--teal)); display: grid; place-items: center; color: white; font-weight: 700; font-size: 15px; text-align: center; line-height: 1.2; box-shadow: 0 8px 32px color-mix(in oklch, var(--accent) 35%, transparent); animation: hubPulse 3s ease-in-out infinite; }
      @keyframes hubPulse { 0%, 100% { box-shadow: 0 8px 32px color-mix(in oklch, var(--accent) 35%, transparent); } 50% { box-shadow: 0 8px 48px color-mix(in oklch, var(--accent) 55%, transparent); } }
      .arch-connections { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
      .arch-node { position: absolute; z-index: 3; cursor: pointer; width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--border); background: var(--surface); display: grid; place-items: center; font-size: 14px; transition: opacity 0.25s ease, transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease; }
      .arch-node:hover, .arch-node:focus-visible { border-color: var(--teal); box-shadow: 0 0 0 6px color-mix(in oklch, var(--teal) 12%, transparent); transform: scale(1.15); background: color-mix(in oklch, var(--teal) 8%, var(--surface)); }

      /* === Core Modules === */
      .module-spotlight { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--gap-md); }
      .module-card:hover { border-color: color-mix(in oklch, var(--teal) 30%, var(--border)); box-shadow: 0 8px 28px color-mix(in oklch, var(--fg) 5%, transparent); transform: translateY(-2px); }

      /* === Panels === */
      .panel-layout { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gap-xl); align-items: center; }
      .panel-visual { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-xl); padding: 28px; box-shadow: 0 4px 24px color-mix(in oklch, var(--fg) 6%, transparent); }

      /* === Workflow === */
      .workflow-flow { display: flex; align-items: flex-start; justify-content: center; gap: 12px; margin: 40px 0; flex-wrap: wrap; }
      .workflow-step:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 12px 32px color-mix(in oklch, var(--fg) 6%, transparent); }
      .workflow-connector { display: flex; align-items: center; color: var(--border); flex-shrink: 0; padding-top: 42px; }

      /* === Reporting === */
      .report-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--gap-md); margin-bottom: var(--gap-lg); }
      .report-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap-sm); }
      .report-item { display: flex; align-items: center; gap: 10px; padding: 14px; background: color-mix(in oklch, var(--fg) 3%, var(--bg)); border-radius: var(--radius); font-size: 14px; font-weight: 500; transition: background 0.2s ease; }
      .report-item:hover { background: color-mix(in oklch, var(--teal) 8%, var(--bg)); }
      .report-item svg { width: 18px; height: 18px; color: var(--teal); flex-shrink: 0; }

      /* === Security & Permissions === */
      .perm-matrix { overflow-x: auto; margin: 32px 0; }
      .perm-matrix table { width: 100%; border-collapse: collapse; font-size: 13px; }
      .perm-matrix th, .perm-matrix td { padding: 12px 14px; text-align: left; border-bottom: 1px solid var(--border); }
      .perm-matrix th { font-weight: 600; color: var(--accent); font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
      .perm-matrix td:first-child, .perm-matrix th:first-child { font-weight: 600; }
      .perm-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
      .perm-badge.full { background: color-mix(in oklch, var(--green) 15%, transparent); color: var(--green); }
      .perm-badge.limited { background: color-mix(in oklch, var(--teal) 15%, transparent); color: var(--teal); }
      .perm-badge.none { background: color-mix(in oklch, var(--fg) 6%, transparent); color: var(--muted); }
      .sec-feats { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap-md); margin-top: var(--gap-lg); }
      .sec-feat { text-align: center; padding: 20px; border-radius: var(--radius); border: 1px solid var(--border); }
      .sec-feat svg { width: 28px; height: 28px; color: var(--teal); margin-bottom: 12px; }

      /* === CTA Section === */
      .cta-section { background: linear-gradient(135deg, var(--accent), color-mix(in oklch, var(--accent) 50%, var(--teal)), var(--teal)); color: white; text-align: center; padding-block: clamp(64px, 10vw, 100px); position: relative; overflow: hidden; }
      .cta-section::before { content: ''; position: absolute; inset: 0; background: url('/assets/img/OptiFlow.Logo.png') center / 300px no-repeat; opacity: 0.04; }
      .cta-section .container { position: relative; z-index: 2; }
      .cta-section h2 { color: white; margin-bottom: 16px; }
      .cta-section .lead { color: color-mix(in oklch, white 80%, transparent); margin: 0 auto 32px; }
      .cta-btns { display: flex; justify-content: center; gap: var(--gap-sm); flex-wrap: wrap; margin-bottom: 36px; }
      .cta-section .btn-primary { background: white; color: var(--accent); }
      .cta-section .btn-secondary { background: transparent; color: white; border-color: color-mix(in oklch, white 40%, transparent); }
      .cta-section .btn-secondary:hover { border-color: white; background: color-mix(in oklch, white 12%, transparent); }
      .cta-trust { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; font-size: 13px; color: color-mix(in oklch, white 70%, transparent); }
      .cta-trust-item { display: flex; align-items: center; gap: 6px; }

      /* === Animations === */
      .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
      .reveal.visible { opacity: 1; transform: translateY(0); }
      .stagger > * { opacity: 0; transform: translateY(24px); transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
      .stagger.visible > *:nth-child(1) { transition-delay: 0.05s; }
      .stagger.visible > *:nth-child(2) { transition-delay: 0.1s; }
      .stagger.visible > *:nth-child(3) { transition-delay: 0.15s; }
      .stagger.visible > *:nth-child(4) { transition-delay: 0.2s; }
      .stagger.visible > *:nth-child(5) { transition-delay: 0.25s; }
      .stagger.visible > *:nth-child(6) { transition-delay: 0.3s; }
      .stagger.visible > * { opacity: 1; transform: translateY(0); }

      /* === Dark Mode === */
      [data-theme="dark"] .arch-connections line { stroke: oklch(42% 0.012 250); }
      [data-theme="dark"] .arch-node { background: var(--surface); border-color: oklch(42% 0.012 250); color: var(--fg); }
      [data-theme="dark"] .arch-node:hover, [data-theme="dark"] .arch-node:focus-visible { border-color: var(--teal); box-shadow: 0 0 0 6px color-mix(in oklch, var(--teal) 18%, transparent); }
      [data-theme="dark"] .transform-stage { background: var(--surface); border-color: var(--border); }
      [data-theme="dark"] .transform-stage.chaos { background: oklch(18% 0.04 20); border-color: oklch(35% 0.06 20); }
      [data-theme="dark"] .transform-stage.optiflow { background: color-mix(in oklch, var(--accent) 15%, transparent); border-color: color-mix(in oklch, var(--accent) 40%, transparent); }
      [data-theme="dark"] .transform-stage.system { background: color-mix(in oklch, var(--green) 12%, transparent); border-color: color-mix(in oklch, var(--green) 35%, transparent); }
      [data-theme="dark"] .module-card { background: var(--surface); border-color: var(--border); }
      [data-theme="dark"] .module-card:hover { border-color: color-mix(in oklch, var(--teal) 40%, var(--border)); }
      [data-theme="dark"] .module-body h4 { color: var(--fg); }
      [data-theme="dark"] .show-all-btn { border-color: color-mix(in oklch, var(--accent) 50%, transparent); color: var(--accent); }
      [data-theme="dark"] .panel-visual { background: var(--surface); border-color: var(--border); }
      [data-theme="dark"] .panel-visual .vis-row { border-bottom-color: var(--border); color: var(--fg); }
      [data-theme="dark"] .panel-benefit { background: color-mix(in oklch, var(--teal) 10%, transparent); }
      [data-theme="dark"] .panel-benefit h5 { color: var(--fg); }
      [data-theme="dark"] .workflow-step { background: var(--surface); border-color: var(--border); }
      [data-theme="dark"] .workflow-connector { color: oklch(45% 0.012 250); }
      [data-theme="dark"] .workflow-step h4 { color: var(--fg); }
      [data-theme="dark"] .report-kpi { background: var(--surface); }
      [data-theme="dark"] .report-item { background: color-mix(in oklch, var(--fg) 6%, transparent); }
      [data-theme="dark"] .report-item:hover { background: color-mix(in oklch, var(--teal) 14%, transparent); }
      [data-theme="dark"] .sec-feat { background: var(--surface); border-color: var(--border); }
      [data-theme="dark"] .sec-feat h4 { color: var(--fg); }
      [data-theme="dark"] .perm-matrix th { color: var(--accent); }
      [data-theme="dark"] .perm-badge.none { background: color-mix(in oklch, var(--fg) 10%, transparent); color: var(--muted); }
      [data-theme="dark"] .dash-card { background: var(--surface); border-color: var(--border); }
      [data-theme="dark"] .dash-chart { background: color-mix(in oklch, var(--fg) 6%, transparent); }
      [data-theme="dark"] .dash-widget { background: color-mix(in oklch, var(--fg) 6%, transparent); }
      [data-theme="dark"] .dash-widget .w-val { color: var(--fg); }
      [data-theme="dark"] .dash-kpi-item { background: color-mix(in oklch, var(--teal) 8%, transparent); }
      [data-theme="dark"] .cta-section { background: linear-gradient(135deg, var(--accent), color-mix(in oklch, var(--accent) 50%, var(--teal)), var(--teal)); }
      [data-theme="dark"] .cta-section .btn-primary { background: oklch(95% 0.002 240); color: var(--accent); }
      [data-theme="dark"] .demo-tab.active { background: var(--surface); border-color: var(--border); color: var(--accent); }
      [data-theme="dark"] .demo-tab:hover { color: var(--fg); background: color-mix(in oklch, var(--accent) 12%, transparent); }

      /* === Responsive === */
      @media (max-width: 1024px) {
        .hero-grid { grid-template-columns: 1fr; gap: 48px; }
        .panel-layout { grid-template-columns: 1fr; gap: 32px; }
        .module-spotlight { grid-template-columns: 1fr; }
        .module-expand-grid { grid-template-columns: repeat(2, 1fr); }
        .arch-diagram { min-height: 340px; }
        .workflow-flow { flex-direction: column; align-items: center; }
        .workflow-connector { transform: rotate(90deg); padding-top: 0; }
        .workflow-step { max-width: 100%; width: 100%; }
        .report-kpis { grid-template-columns: repeat(2, 1fr); }
        .report-list { grid-template-columns: repeat(2, 1fr); }
        .sec-feats { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 768px) {
        .panel-benefits { grid-template-columns: 1fr; }
        .report-kpis { grid-template-columns: repeat(2, 1fr); }
        .sec-feats { grid-template-columns: 1fr; }
        .transform-flow { flex-direction: column; }
        .transform-arrow { transform: rotate(90deg); }
        .dash-kpi { grid-template-columns: repeat(3, 1fr); }
        .hero-dashboard .dash-grid-2 { grid-template-columns: 1fr; }
      }
      @media (max-width: 480px) {
        .hero-trust { grid-template-columns: 1fr; }
        .hero-cta { flex-direction: column; }
        .dash-kpi { grid-template-columns: repeat(2, 1fr); }
        .cta-btns { flex-direction: column; }
        .cta-trust { flex-direction: column; gap: 12px; }
        .report-list { grid-template-columns: 1fr; }
        .module-expand-grid { grid-template-columns: 1fr; }
      }
    `}</style>
  );
}
