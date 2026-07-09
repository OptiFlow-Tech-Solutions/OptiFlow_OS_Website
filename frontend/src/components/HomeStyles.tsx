export default function HomeStyles() {
  return (
    <style>{`
      .hero { padding-top: calc(var(--nav-h) + 60px); padding-bottom: 80px; overflow: hidden; position: relative; background: #F8FAFC; box-shadow: inset 0 -1px 0 rgba(15,23,42,.06); }
      .hero::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 70% 50% at 50% 30%, rgba(39,141,159,.04) 0%, transparent 70%); pointer-events: none; z-index: 0; }
      [data-theme="dark"] .hero { background: #0F172A; }
      [data-theme="dark"] .hero .noise-overlay { display: block; z-index: 1; opacity: .04; }
      [data-theme="dark"] .hero::after { opacity: .06; background: radial-gradient(ellipse 70% 40% at 50% 50%, rgba(39,141,159,.10) 0%, transparent 70%); }
      [data-theme="dark"] .hero-content h1 { color: rgba(255,255,255,.80); text-shadow: 0 2px 14px rgba(0,0,0,.40), 0 1px 3px rgba(0,0,0,.30); }
      [data-theme="dark"] .hero h1, [data-theme="dark"] .hero h2, [data-theme="dark"] .hero h3 { color: rgba(255,255,255,.80); }
      [data-theme="dark"] .hero p, [data-theme="dark"] .hero li { color: rgba(255,255,255,.68); }
      [data-theme="dark"] .hero .lead { color: rgba(255,255,255,.62); }
      [data-theme="dark"] .hero .eyebrow { color: var(--lime); }
      .hero-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 64px; align-items: center; position: relative; z-index: 2; }
      .hero-content { position: relative; z-index: 2; }
      .hero-content h1 { margin-bottom: 20px; min-height: 1.2em; color: #0F172A; text-shadow: 0 2px 12px rgba(15,23,42,.10), 0 1px 2px rgba(15,23,42,.06); }
      .highlight-gradient { background: linear-gradient(135deg, var(--accent), var(--teal)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      .tw-cursor { display: inline-block; width:3px; height:0.8em; background:#FF3B3B; border-radius:2px; animation:twBlink 0.8s steps(1) infinite; vertical-align:middle; margin-left:4px; }
      @keyframes twBlink { 50% { opacity: 0; } }
      @media (prefers-reduced-motion: reduce) { .tw-cursor { animation: none; opacity: 1; } }
      .hero-content .lead { margin-bottom: 32px; }
      .hero-cta { display: flex; gap: var(--gap-sm); flex-wrap: wrap; margin-bottom: 40px; }
      .hero-trust { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .hero-trust span { display: flex; align-items: center; gap: 6px; font-size: 14px; color: var(--muted); }
      [data-theme="dark"] .hero-trust span { color: rgba(255,255,255,.70); }
      .hero-trust svg { color: var(--green); flex-shrink: 0; }
      [data-theme="dark"] .hero .btn-secondary { background: rgba(255,255,255,.12); border-color: rgba(255,255,255,.20); color: white; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
      [data-theme="dark"] .hero .btn-secondary:hover { background: rgba(255,255,255,.18); border-color: rgba(255,255,255,.35); }

      .hook-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 999px; background: var(--fg-soft); color: var(--fg); font-size: 13px; font-weight: 600; margin-bottom: 20px; border: 1px solid var(--border); }
      [data-theme="dark"] .hook-badge { background: rgba(255,255,255,.10); color: rgba(255,255,255,.90); border: 1px solid rgba(255,255,255,.15); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
      .hook-badge svg { width: 14px; height: 14px; color: var(--green); }
      [data-theme="dark"] .hook-badge svg { color: var(--lime); }

      .mouse-glow { position: absolute; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(27,77,129,.15) 0%, rgba(39,141,159,.08) 35%, rgba(84,184,154,.04) 55%, transparent 70%); pointer-events: none; transform: translate(-50%,-50%); z-index: 1; opacity: 0; transition: opacity 0.4s ease; }
      .mouse-glow.active { opacity: 1; }
      [data-theme="dark"] .mouse-glow { background: radial-gradient(circle, rgba(39,141,159,.22) 0%, rgba(27,77,129,.10) 40%, transparent 65%); }

      .dashboard-mockup { position: relative; background: rgba(255,255,255,.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,.50); border-radius: var(--radius-xl); padding: 20px; box-shadow: var(--shadow-elevated), 0 0 0 1px rgba(255,255,255,.20) inset; }
      [data-theme="dark"] .dashboard-mockup { background: rgba(15,23,42,.75); border-color: rgba(255,255,255,.10); }
      .dash-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px; border-bottom: 1px solid rgba(0,0,0,.08); margin-bottom: 16px; }
      [data-theme="dark"] .dash-header { border-color: rgba(255,255,255,.08); }
      .dash-header h4 { font-size: 14px; font-weight: 600; color: #0F172A; margin: 0; }
      [data-theme="dark"] .dash-header h4 { color: var(--fg); }
      .dash-dots { display: flex; gap: 6px; }
      .dash-dots span { width: 9px; height: 9px; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,.15); }
      .dash-dots span:nth-child(1) { background: #FF5F57; }
      .dash-dots span:nth-child(2) { background: #FFBD2E; }
      .dash-dots span:nth-child(3) { background: #28C840; }
      .dash-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
      .dash-kpi { background: rgba(0,0,0,.03); border-radius: var(--radius); padding: 14px; border: 1px solid rgba(0,0,0,.04); }
      [data-theme="dark"] .dash-kpi { background: rgba(255,255,255,.05); border-color: rgba(255,255,255,.06); }
      .dash-kpi-label { font-size: 11px; color: var(--muted); margin-bottom: 4px; }
      .dash-kpi-value { font-family: var(--font-mono); font-size: 20px; font-weight: 700; color: #0F172A; }
      [data-theme="dark"] .dash-kpi-value { color: var(--fg); }
      .dash-kpi-change { font-size: 11px; color: var(--green); margin-top: 2px; }
      .dash-chart { background: rgba(0,0,0,.03); border-radius: var(--radius); padding: 16px; margin-bottom: 12px; border: 1px solid rgba(0,0,0,.04); }
      [data-theme="dark"] .dash-chart { background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.08); }
      .dash-table-row { display: grid; grid-template-columns: 2fr 1fr 1fr 80px; gap: 8px; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,.06); font-size: 12px; align-items: center; color: #0F172A; }
      [data-theme="dark"] .dash-table-row { border-color: rgba(255,255,255,.06); color: var(--fg); }
      .dash-table-row:last-child { border-bottom: 0; }
      .dash-table-row.header { color: var(--muted); font-weight: 500; font-size: 11px; }
      .dash-status { display: inline-flex; padding: 2px 10px; border-radius: 999px; font-size: 10px; font-weight: 500; }
      .dash-status.active { background: rgba(84,184,154,.15); color: oklch(35% 0.12 145); }
      .dash-status.pending { background: rgba(240,171,0,.12); color: oklch(45% 0.10 85); }
      [data-theme="dark"] .dash-status.active { color: oklch(72% 0.12 145); }
      [data-theme="dark"] .dash-status.pending { color: oklch(72% 0.10 85); }

      .floating-widget { position: absolute; background: rgba(255,255,255,.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,.50); border-radius: var(--radius); padding: 12px 16px; box-shadow: var(--shadow-elevated); font-size: 13px; animation: floatWidget 4s ease-in-out infinite; z-index: 3; }
      [data-theme="dark"] .floating-widget { background: rgba(15,23,42,.80); border-color: rgba(255,255,255,.10); }
      .floating-widget.w1 { top: -18px; right: -24px; animation-delay: 0s; }
      .floating-widget.w2 { bottom: 48px; left: -32px; animation-delay: 1.3s; }
      .floating-widget.w3 { bottom: -10px; right: 50px; animation-delay: 2.6s; }
      @keyframes floatWidget { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      .fw-label { font-size: 11px; color: var(--muted); }
      .fw-value { font-family: var(--font-mono); font-weight: 700; font-size: 16px; color: #0F172A; }
      [data-theme="dark"] .fw-value { color: var(--fg); }

      .trust-bar { padding-block: 48px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--surface); overflow: hidden; }
      .trust-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--gap-lg); text-align: center; margin-bottom: 24px; }
      .trust-metric-value { font-family: var(--font-mono); font-size: 36px; font-weight: 700; color: var(--accent); }
      .trust-metric-label { font-size: 13px; color: var(--muted); margin-top: 4px; }
      .trust-logos { display: flex; align-items: center; gap: 56px; opacity: 0.5; animation: logoScroll 30s linear infinite; width: max-content; }
      .trust-logos-wrap { overflow: hidden; -webkit-mask: linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%); }
      .trust-logo { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--muted); letter-spacing: -0.02em; white-space: nowrap; }
      @keyframes logoScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

      .problem-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap-lg); }
      .problem-card { padding: 32px; }
      .problem-icon { width: 44px; height: 44px; display: grid; place-items: center; background: oklch(96% 0.01 230); border-radius: var(--radius); margin-bottom: 20px; color: var(--accent); box-shadow: 0 2px 6px rgba(27,77,129,.08); }
      .problem-icon svg { width: 22px; height: 22px; }
      .problem-card h3 { margin-bottom: 8px; color: var(--fg); }
      .problem-desc { color: var(--muted); font-size: 14px; line-height: 1.5; margin-bottom: 12px; }
      .problem-impact { font-size: 12px; color: var(--accent); font-weight: 500; background: var(--accent-soft); display: inline-block; padding: 4px 10px; border-radius: 999px; }
      .problem-roi { font-size: 13px; color: var(--green); font-weight: 600; margin-top: 8px; }
      [data-theme="dark"] .problem-icon { background: rgba(255,255,255,.08); color: var(--teal); box-shadow: 0 2px 6px rgba(0,0,0,.25); }
      [data-theme="dark"] .problem-card h3 { color: var(--fg); }
      [data-theme="dark"] .problem-desc { color: var(--muted); }
      [data-theme="dark"] .problem-impact { color: oklch(78% 0.06 220); background: rgba(39,141,159,.18); }
      [data-theme="dark"] .problem-card:hover .problem-icon { background: rgba(255,255,255,.12); color: var(--teal); }
      [data-theme="dark"] .problem-roi { color: var(--lime); }

      .impact-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: var(--gap-md); }
      .impact-card { text-align: center; padding: 24px 16px; }
      .impact-card h3 { color: white; }
      .impact-card p { font-size: 13px; color: rgba(255,255,255,.55); }
      .impact-cost { margin-top: 12px; font-family: var(--font-mono); font-size: 14px; color: var(--lime); font-weight: 600; }

      .solution-visual { display: flex; flex-direction: column; align-items: center; gap: 24px; margin-top: 48px; }
      .solution-stage { padding: 20px 40px; border-radius: var(--radius-lg); font-weight: 600; font-size: 18px; text-align: center; }
      .solution-stage.chaos { background: rgba(200,80,30,.08); color: oklch(40% 0.10 25); border: 1px solid rgba(200,80,30,.15); box-shadow: 0 2px 8px rgba(200,80,30,.06); }
      .solution-stage.optiflow { background: linear-gradient(135deg, #1B4D81, #278D9F); color: white; font-size: 22px; padding: 28px 56px; box-shadow: var(--shadow-elevated), 0 0 40px rgba(27,77,129,.20); }
      .solution-stage.excellence { background: rgba(84,184,154,.10); color: oklch(30% 0.10 145); border: 1px solid rgba(84,184,154,.25); }
      [data-theme="dark"] .solution-stage.chaos { color: rgba(255,255,255,.80); background: rgba(200,80,30,.15); border-color: rgba(200,80,30,.25); }
      [data-theme="dark"] .solution-stage.excellence { color: rgba(255,255,255,.80); background: rgba(84,184,154,.16); border-color: rgba(84,184,154,.30); }
      .solution-arrow { color: var(--muted); font-size: 24px; }
      .solution-modules { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 24px; }
      .solution-module { padding: 8px 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 999px; font-size: 13px; font-weight: 500; box-shadow: 0 1px 3px rgba(15,23,42,.04); transition: color 0.2s, background 0.2s, box-shadow 0.2s; }
      .solution-module:hover { border-color: var(--accent); color: var(--accent); box-shadow: var(--shadow-card); }

      .module-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--gap-lg); }
      .module-card { text-align: center; padding: 32px 20px; }
      .module-icon { width: 52px; height: 52px; display: grid; place-items: center; background: linear-gradient(135deg, var(--accent-soft), var(--teal-soft)); border-radius: var(--radius-lg); margin: 0 auto 16px; color: var(--teal); box-shadow: 0 2px 8px rgba(39,141,159,.10); }
      .module-icon svg { width: 24px; height: 24px; }
      .module-card h3 { font-size: 16px; margin-bottom: 8px; color: var(--fg); }
      .module-desc { font-size: 13px; color: var(--muted); line-height: 1.5; }
      .module-benefit { font-size: 12px; color: var(--green); font-weight: 500; margin-top: 8px; }
      [data-theme="dark"] .module-card h3 { color: var(--fg); }
      [data-theme="dark"] .module-desc { color: var(--muted); }
      [data-theme="dark"] .module-icon { background: rgba(39,141,159,.12); color: var(--teal); }
      [data-theme="dark"] .module-benefit { color: var(--lime); }

      .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--gap-lg); position: relative; }
      .steps::before { content: ''; position: absolute; top: 32px; left: 10%; right: 10%; height: 2px; background: linear-gradient(90deg, var(--accent), var(--teal), var(--green), var(--lime)); border-radius: 2px; box-shadow: 0 1px 4px rgba(27,77,129,.15); }
      .step { text-align: center; position: relative; }
      .step-number { width: 64px; height: 64px; display: grid; place-items: center; background: var(--surface); border: 2px solid var(--accent); border-radius: 50%; margin: 0 auto 20px; font-family: var(--font-mono); font-size: 20px; font-weight: 700; color: var(--accent); position: relative; z-index: 2; box-shadow: var(--shadow-card), inset 0 2px 4px rgba(255,255,255,.60); transition: color 0.25s, background 0.25s, box-shadow 0.25s; }
      .step:hover .step-number { background: var(--accent); color: white; box-shadow: var(--shadow-elevated), 0 0 20px rgba(27,77,129,.20); }
      .step h3 { font-size: 16px; margin-bottom: 8px; color: var(--fg); }
      .step p { font-size: 13px; color: var(--muted); }
      .step-outcome { font-size: 12px; color: var(--green); font-weight: 500; margin-top: 6px; }
      [data-theme="dark"] .step p { color: var(--muted); }
      [data-theme="dark"] .step-outcome { color: var(--lime); }
      [data-theme="dark"] .step-number { border-color: var(--lime); color: var(--lime); }
      [data-theme="dark"] .step:hover .step-number { background: var(--lime); color: var(--fg); }

      .feature-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--gap-lg); }
      .feature-item { padding: 24px; }
      .feature-mark { width: 40px; height: 40px; display: grid; place-items: center; background: var(--accent-soft); border-radius: var(--radius); margin-bottom: 16px; color: var(--accent); box-shadow: 0 1px 4px rgba(27,77,129,.08); }
      .feature-mark svg { width: 20px; height: 20px; }
      .feature-item h3 { font-size: 16px; margin-bottom: 4px; color: var(--fg); }
      .feature-desc { font-size: 13px; color: var(--muted); line-height: 1.5; }
      .feature-roi { font-size: 12px; color: var(--accent); font-weight: 500; margin-top: 6px; }
      [data-theme="dark"] .feature-item h3 { color: var(--fg); }
      [data-theme="dark"] .feature-mark { color: var(--lime); background: rgba(39,141,159,.12); }
      [data-theme="dark"] .feature-roi { color: var(--lime); }

      .industry-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--gap-lg); }
      .industry-card { padding: 28px; text-align: center; }
      .industry-icon { width: 56px; height: 56px; display: grid; place-items: center; background: linear-gradient(135deg, var(--accent-soft), var(--teal-soft)); border-radius: var(--radius-lg); margin: 0 auto 16px; color: var(--accent); box-shadow: 0 2px 8px rgba(27,77,129,.08); }
      .industry-icon svg { width: 26px; height: 26px; }
      .industry-card h3 { font-size: 16px; margin-bottom: 6px; color: var(--fg); }
      .ind-challenge { font-size: 12px; color: var(--muted); margin-bottom: 8px; line-height: 1.4; }
      .ind-solution { font-size: 13px; color: var(--green); font-weight: 500; }
      [data-theme="dark"] .industry-card h3 { color: var(--fg); }
      [data-theme="dark"] .ind-challenge { color: rgba(255,255,255,.55); }
      [data-theme="dark"] .ind-solution { color: var(--lime); }
      [data-theme="dark"] .industry-icon { background: rgba(39,141,159,.12); color: var(--lime); }

      .comparison-table .traditional { color: var(--muted); font-size: 13px; }
      .comparison-table .optiflow-col { color: var(--fg); font-weight: 500; font-size: 13px; }
      [data-theme="dark"] .section-dark .comparison-table .traditional { color: rgba(255,255,255,.50); }
      [data-theme="dark"] .section-dark .comparison-table .optiflow-col { color: rgba(255,255,255,.92); }

      .testimonial-avatar::after { content: ''; position: absolute; inset: 0; border-radius: 50%; background: linear-gradient(180deg, rgba(255,255,255,.15) 0%, transparent 60%); pointer-events: none; }
      .testimonial-outcome { font-size: 12px; color: var(--green); font-weight: 500; margin-top: 12px; }

      .card-tilt { perspective: 800px; }
      .card-tilt > .card-base, .card-tilt > .card { transform-style: preserve-3d; will-change: transform; }

      .whatsapp-float { position: fixed; bottom: 88px; right: 32px; z-index: 198; width: 52px; height: 52px; border-radius: 50%; background: #25D366; color: white; display: grid; place-items: center; cursor: pointer; box-shadow: var(--shadow-elevated); transition: transform 0.25s ease, box-shadow 0.25s ease; text-decoration: none; }
      .whatsapp-float:hover { transform: scale(1.08); box-shadow: var(--shadow-button-hover); }
      .whatsapp-float:active { transform: scale(0.94); }
      .whatsapp-float svg { width: 26px; height: 26px; }
      @media (max-width: 480px) { .whatsapp-float { bottom: 72px; right: 20px; } }

      .exit-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(15,23,42,.50); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.4s ease; }
      .exit-overlay.active { opacity: 1; pointer-events: auto; }
      .exit-card { background: var(--surface); border-radius: var(--radius-xl); padding: 40px; max-width: 480px; width: calc(100% - 64px); text-align: center; box-shadow: var(--shadow-elevated); position: relative; animation: exitFadeIn 0.4s cubic-bezier(0.22, 0.61, 0.36, 1); }
      @keyframes exitFadeIn { from { opacity: 0; transform: translateY(24px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
      .exit-card h2 { margin-bottom: 12px; }
      .exit-card .lead { margin-bottom: 28px; }
      .exit-card .btn-primary { width: 100%; justify-content: center; }
      .exit-close { position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border-radius: 50%; background: var(--fg-soft); display: grid; place-items: center; cursor: pointer; transition: background 0.2s ease; border: 0; font-family: inherit; font-size: 16px; color: var(--muted); }
      .exit-close:hover { background: var(--border); }
      [data-theme="dark"] .exit-overlay { background: rgba(15,23,42,.70); }

      @media (max-width: 1024px) {
        .hero-grid { grid-template-columns: 1fr; gap: 40px; }
        .hero { padding-top: calc(var(--nav-h) + 40px); padding-bottom: 40px; }
        .dash-kpis { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 768px) {
        .hero { padding-top: calc(var(--nav-h) + 24px); }
        .hero-content h1 { margin-bottom: 14px; }
        .hero-content .lead { font-size: 16px; margin-bottom: 24px; }
        .hero-trust { gap: 8px; }
        .hero-trust span { font-size: 12px; }
        .dash-kpis { grid-template-columns: repeat(2, 1fr); }
        .floating-widget { display: none; }
      }
      @media (max-width: 480px) {
        .hero { padding-top: calc(var(--nav-h) + 16px); }
        .hero-cta { flex-direction: column; }
        .dash-kpis { grid-template-columns: repeat(2, 1fr); gap: 8px; }
        .dash-kpi-value { font-size: 16px; }
        .problem-grid { grid-template-columns: 1fr; }
        .mouse-glow { display: none; }
      }
    `}</style>
  );
}
