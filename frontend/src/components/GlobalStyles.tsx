export default function GlobalStyles() {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; }

      html {
        -webkit-text-size-adjust: 100%;
        background: var(--bg);
        scroll-behavior: smooth;
      }

      body {
        margin: 0;
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--fs-body);
        line-height: 1.6;
        text-rendering: optimizelegibility;
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
        transition: background 0.35s, color 0.35s;
      }

      img, svg { display: block; max-width: 100%; }
      a { color: inherit; text-decoration: none; }
      p, h1, h2, h3 { margin: 0; text-wrap: pretty; }
      h1, h2, h3 { color: var(--fg); }

      h1 {
        font-family: var(--font-display);
        font-size: var(--fs-h1);
        line-height: 1.08;
        letter-spacing: -0.025em;
        font-weight: 700;
      }
      h2 {
        font-family: var(--font-display);
        font-size: var(--fs-h2);
        line-height: 1.12;
        letter-spacing: -0.02em;
        font-weight: 700;
      }
      h3 {
        font-size: var(--fs-h3);
        font-weight: 600;
        line-height: 1.3;
        letter-spacing: -0.01em;
      }

      [data-theme="dark"] h1, [data-theme="dark"] h2, [data-theme="dark"] h3 { color: var(--fg); }

      .lead { font-size: var(--fs-lead); line-height: 1.6; color: var(--muted); max-width: 60ch; }
      .eyebrow { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--teal); font-weight: 500; margin: 0 0 var(--gap-md); }
      .meta { font-family: var(--font-mono); font-size: var(--fs-meta); color: var(--muted); }
      .num { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }

      :focus-visible { outline: 2px solid var(--teal); outline-offset: 2px; border-radius: 4px; }
      .faq-question:focus-visible { outline: 2px solid var(--teal); outline-offset: -2px; border-radius: var(--radius); }
      .card:focus-within { border-color: var(--teal); box-shadow: var(--shadow-card-hover), 0 0 0 2px var(--teal-soft); }
      .btn:focus-visible { outline: 2px solid var(--teal); outline-offset: 3px; }
      .nav-link:focus-visible, .react-nav-link:focus-visible { outline: 2px solid var(--teal); outline-offset: 0; border-radius: 6px; }
      .theme-toggle:focus-visible, .react-nav-theme-toggle:focus-visible { outline: 2px solid var(--teal); outline-offset: 3px; }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0,0,0,0);
        white-space: nowrap;
        border-width: 0;
      }

      .skip-link {
        position: absolute;
        top: -100%;
        left: 16px;
        padding: 8px 16px;
        background: var(--accent);
        color: white;
        font-weight: 600;
        border-radius: 6px;
        z-index: var(--z-skip-link);
      }
      .skip-link:focus { top: 8px; }

      .noise-overlay {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: var(--z-base);
        opacity: var(--noise-opacity);
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        background-size: 256px 256px;
      }

      .reveal { opacity: 0; transform: translateY(var(--motion-distance, 28px)); transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out); will-change: opacity, transform; }
      .reveal.visible { opacity: 1; transform: translateY(0); }
      .reveal-left { opacity: 0; transform: translateX(calc(-1 * var(--motion-distance, 28px))); transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out); will-change: opacity, transform; }
      .reveal-left.visible { opacity: 1; transform: translateX(0); }
      .reveal-right { opacity: 0; transform: translateX(var(--motion-distance, 28px)); transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out); will-change: opacity, transform; }
      .reveal-right.visible { opacity: 1; transform: translateX(0); }
      .reveal-scale { opacity: 0; transform: scale(0.94); transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out); will-change: opacity, transform; }
      .reveal-scale.visible { opacity: 1; transform: scale(1); }

      .reveal-delay-1 { transition-delay: 0.1s; }
      .reveal-delay-2 { transition-delay: 0.2s; }
      .reveal-delay-3 { transition-delay: 0.3s; }
      .reveal-delay-4 { transition-delay: 0.4s; }

      .stagger-3 > *:nth-child(1) { transition-delay: 0s; }
      .stagger-3 > *:nth-child(2) { transition-delay: 0.1s; }
      .stagger-3 > *:nth-child(3) { transition-delay: 0.2s; }
      .stagger-3 > *:nth-child(4) { transition-delay: 0.3s; }
      .stagger-3 > *:nth-child(5) { transition-delay: 0.4s; }
      .stagger-3 > *:nth-child(6) { transition-delay: 0.5s; }

      .stagger-4 > *:nth-child(1) { transition-delay: 0s; }
      .stagger-4 > *:nth-child(2) { transition-delay: 0.08s; }
      .stagger-4 > *:nth-child(3) { transition-delay: 0.16s; }
      .stagger-4 > *:nth-child(4) { transition-delay: 0.24s; }
      .stagger-4 > *:nth-child(5) { transition-delay: 0.32s; }
      .stagger-4 > *:nth-child(6) { transition-delay: 0.40s; }
      .stagger-4 > *:nth-child(7) { transition-delay: 0.48s; }
      .stagger-4 > *:nth-child(8) { transition-delay: 0.56s; }

      .stagger-5 > *:nth-child(1) { transition-delay: 0s; }
      .stagger-5 > *:nth-child(2) { transition-delay: 0.06s; }
      .stagger-5 > *:nth-child(3) { transition-delay: 0.12s; }
      .stagger-5 > *:nth-child(4) { transition-delay: 0.18s; }
      .stagger-5 > *:nth-child(5) { transition-delay: 0.24s; }

      .section-header {
        text-align: center;
        max-width: 600px;
        margin: 0 auto 56px;
      }
      .section-header .lead { margin: 12px auto 0; }
      .section-header h2 { position: relative; display: inline-block; }
      .section-header h2::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 48px;
        height: 3px;
        background: linear-gradient(90deg, var(--accent), var(--teal));
        border-radius: 2px;
      }
      [data-theme="dark"] .section-header h2::after {
        background: linear-gradient(90deg, var(--lime), var(--teal));
      }

      .section-dark {
        background: oklch(12% 0.018 250);
        color: var(--bg);
      }
      .section-dark .container { position: relative; z-index: var(--z-content); }
      .section-dark .eyebrow { color: var(--green); }
      .section-dark .lead { color: color-mix(in oklch, var(--bg) 70%, transparent); }
      .section-dark h2, .section-dark h3 { color: white; }
      .section-dark .card { background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.14); }
      .section-dark .card:hover { border-color: rgba(84,184,154,.40); background: rgba(255,255,255,.12); }
      [data-theme="dark"] .section-dark { background: oklch(12% 0.018 250); }
      [data-theme="dark"] .section-dark h2, [data-theme="dark"] .section-dark h3 { color: var(--fg); }
      [data-theme="dark"] .section-dark .lead { color: var(--muted); }
      [data-theme="dark"] .section-dark .card { background: var(--surface); border-color: var(--border); }

      .btn-glow { position: relative; }
      .btn-glow::before {
        content: '';
        position: absolute;
        inset: -3px;
        border-radius: inherit;
        background: linear-gradient(135deg, var(--accent), var(--teal), var(--green), var(--teal), var(--accent));
        background-size: 300% 300%;
        z-index: -1;
        opacity: 0;
        transition: opacity 0.4s ease;
        pointer-events: none;
      }
      .btn-glow:hover::before { opacity: 1; }
      @keyframes btnGlowSpin {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      form.form-submitting .form-fields,
      form.form-submitting .btn { opacity: 0.6; pointer-events: none; }
      form.form-submitting .btn { cursor: wait; position: relative; color: transparent; }
      form.form-submitting .btn::before {
        content: '';
        position: absolute;
        inset: calc(50% - 10px) auto auto calc(50% - 10px);
        width: 20px;
        height: 20px;
        border: 2px solid white;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }

      form.form-success .form-fields { display: none; }
      form.form-success .form-success-msg {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--gap-md);
        padding: var(--gap-lg) 0;
        text-align: center;
      }
      form.form-success .form-success-msg h4 { font-size: var(--fs-lead); font-weight: 600; }
      form.form-success .form-success-msg p { color: var(--muted); max-width: 360px; }

      .form-success-msg { display: none; }

      .form-error-msg {
        display: none;
        align-items: center;
        gap: var(--gap-sm);
        padding: var(--gap-sm) var(--gap-md);
        background: color-mix(in oklch, oklch(60% 0.15 25) 12%, transparent);
        border: 1px solid color-mix(in oklch, oklch(60% 0.15 25) 25%, transparent);
        border-radius: var(--radius);
        color: oklch(50% 0.14 25);
        font-size: 14px;
        font-weight: 500;
        margin-bottom: var(--gap-md);
      }
      .form-error-retry { display: none; }

      form.form-error .form-error-msg { display: flex; }
      form.form-error .form-error-retry { display: inline-flex; }
      form.form-error .btn[type="submit"] { display: none; }
      [data-theme="dark"] .form-error-msg {
        background: color-mix(in oklch, oklch(55% 0.14 25) 14%, transparent);
        border-color: color-mix(in oklch, oklch(55% 0.14 25) 30%, transparent);
        color: oklch(65% 0.12 25);
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
        .reveal, .stagger-3 > *, .stagger-4 > *, .stagger-5 > *,
        .hero-content h1, .hero-content .lead, .hero-content .hero-cta > *,
        .hero-trust { opacity: 1; transform: none; }
        .btn-glow::before, .trust-logos, .cta-section::after { animation: none; }
      }
    `}</style>
  );
}
