import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import { Section, Card, Container, Button } from '../components';

// ─── SVG Icons ───

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CheckSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 28, height: 28 }}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const CheckIcon2 = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
    <path d="M2 20h20M6 16V8l3-3h6l3 3v8M10 16v-4h4v4M8 16h8" />
  </svg>
);

// ─── Data ───

const PAIN_POINTS = [
  'Missed follow-ups that cost you repeat business',
  'WhatsApp forwards replacing real accountability',
  'Excel files with 15 versions — no one knows which is final',
  'Key employee on leave — entire process stops',
  { label: 'Textile:', text: 'Shift QC checklist skipped — an entire dye batch rejected' },
  { label: 'Manufacturing:', text: 'CNC preventive maintenance missed — 3 hours of halted production' },
  { label: 'Trading:', text: 'Sales quotation follow-up forgotten for 11 days — ₹3.2L order lost' },
  { label: 'Logistics:', text: 'Dispatch team used the wrong pick-list version — goods returned' },
];

const CHAOS_SOURCES = ['WhatsApp', 'Excel Sheets', 'Phone Calls', 'Manual Registers', 'Verbal Instructions', 'Sticky Notes'];

const TRUST_METRICS = [
  { num: '500+', label: 'Businesses Served' },
  { num: '10,000+', label: 'Tasks Managed Daily' },
  { num: '10,000+', label: 'Active Users' },
  { num: '1,200+', label: 'Departments Managed' },
];

const INDUSTRY_CARDS = [
  { industry: 'Textile', title: 'QC Checklist Skipped — Batch Rejected', desc: 'Morning shift skipped pre-production checklist on finishing line. Wrong chemical ratio for 4 hours. Entire dye lot rejected by buyer.', impact: '₹42,000 fabric scrapped', roi: 'Fix this: automated checklist with timestamp verification — never skip again' },
  { industry: 'Textile', title: '3-Shift Attendance — 3 Hours Daily to Reconcile', desc: '85 workers across morning, afternoon, and night shifts. HR spends 3 hours every day matching WhatsApp messages to paper registers. Overtime disputes every month.', impact: '₹28K/month in incorrect payouts', roi: 'Fix this: digital clock-in with auto-shift mapping — zero reconciliation' },
  { industry: 'Manufacturing', title: 'Machine Preventive Maintenance Missed', desc: "Scheduled PM for CNC-4 was on the supervisor's memory. He was on leave. Machine broke down at 2 PM. 3 hours of production lost, 2 orders delayed.", impact: '₹65K in delayed shipments + idle labor', roi: 'Fix this: scheduled checklist calendar — auto-escalate when missed' },
  { industry: 'Manufacturing', title: 'Purchase Approval Buried in WhatsApp', desc: "Raw material below safety stock. Purchase request forwarded to owner's chat — buried under 47 other messages. Production halted for 6 hours waiting for sign-off.", impact: '6 hours of idle production line', roi: 'Fix this: approval workflow with auto-reminders — sign-offs in minutes' },
  { industry: 'Trading', title: 'Sales Follow-Up Lost — Order Goes to Competitor', desc: 'Quote sent to client, no CRM. Follow-up forgotten for 11 days. Client signed with a competitor. ₹3.2L order value lost — plus the relationship.', impact: '₹3.2L order lost', roi: 'Fix this: auto-reminders on every quotation — zero missed follow-ups' },
  { industry: 'Logistics', title: 'Dispatch Pick-List — Wrong Version Used', desc: 'Pick-list printed from Excel v11. Supervisor had updated v12 on his laptop. Wrong SKU loaded onto truck. Return + re-delivery. Client upset.', impact: '₹28K returns + re-delivery cost', roi: 'Fix this: live worklists — everyone sees the same version, always' },
];

const COST_STATS = [
  { num: '₹5—20L', label: 'Revenue lost annually to missed follow-ups and delayed invoices', note: 'Fully recoverable with structured workflows' },
  { num: '60—100', label: 'Hours per month wasted on status chasing, rework, and manual updates', note: 'Equivalent to hiring 2 additional operators' },
  { num: '40%', label: "Of an owner's day spent on follow-ups — not strategy, not growth", note: 'Your most expensive resource doing admin work' },
];

const MODULE_TAGS = ['Task Management', 'Worklists', 'Attendance', 'Leaves', 'SOPs & Checklists', 'Reports & Analytics', 'Helpdesk', 'Dashboards'];

const PVP_ROWS = [
  { people: 'Owner follows up every task', proc: 'Auto-assigned', outcome: 'Tasks have owners by default' },
  { people: 'Attendance tracked manually', proc: '100% accurate', outcome: 'Digital attendance + self-service leave' },
  { people: 'Approvals stuck in chat groups', proc: 'Instant', outcome: 'Approval workflows, not chat forwards' },
  { people: 'Reports compiled manually', proc: 'One click', outcome: 'Real-time dashboards, always current' },
  { people: "SOPs in people's heads", proc: 'Audit-ready', outcome: 'Documented SOP library, versioned' },
  { people: 'No visibility without calling', proc: 'Live dashboard', outcome: 'One screen shows everything' },
  { people: 'Growth adds chaos', proc: 'Scalable', outcome: 'Systems handle complexity, not people' },
];

const BEFORE_ITEMS = [
  'Tasks tracked in WhatsApp groups',
  'Attendance on paper registers',
  'Approvals take 3 days',
  'Reports compiled manually each month',
  "SOPs in people's heads",
  'Owner chases every update',
  'Growth = more chaos',
];

const AFTER_ITEMS = [
  'Every task has an owner + deadline',
  'Digital clock-in with live dashboard',
  'Approvals done in minutes',
  'Real-time reports — one click',
  'SOP library — accessible to everyone',
  'One dashboard shows everything',
  'Growth = more structured',
];

// ─── Pain Point Carousel ───

function PainPointCarousel() {
  const [curr, setCurr] = useState(0);
  const items = PAIN_POINTS;
  const prefersReduced = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReduced.current = mq.matches;
    if (mq.matches) return;

    const id = setInterval(() => {
      if (!document.hidden) setCurr((c) => (c + 1) % items.length);
    }, 3000);
    return () => clearInterval(id);
  }, [items.length]);

  return (
    <div className="pp-track">
      {items.map((item, i) => {
        const isText = typeof item === 'string';
        return (
          <span
            key={i}
            className={`pp-item${i === curr ? ' active' : ''}`}
            style={prefersReduced.current ? { opacity: 1, position: 'relative', transform: 'none' } : undefined}
          >
            {isText ? (
              item
            ) : (
              <>
                <span className="pp-accent">{(item as { label: string }).label}</span>{' '}
                {(item as { text: string }).text}
              </>
            )}
          </span>
        );
      })}
    </div>
  );
}

// ─── Page ───

export default function ProblemSolutions() {
  const heroRef = useRef<HTMLElement>(null);
  useScrollReveal();

  return (
    <>
      <style>{`
        .ps-hero { padding-top: var(--nav-h); padding-bottom: 64px; overflow: hidden; position: relative; background: var(--bg); }
        .ps-hero::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; height: 600px; background: radial-gradient(ellipse at center, color-mix(in oklch, var(--teal) 6%, transparent) 0%, transparent 70%); pointer-events: none; border-radius: 50%; }
        .ps-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        .ps-hero-content { position: relative; z-index: 2; }
        .ps-hero-content h1 { margin-bottom: 16px; }
        .ps-hero-content .lead { margin-bottom: 28px; }
        .ps-hero-cta { display: flex; gap: var(--gap-sm); flex-wrap: wrap; margin-bottom: 32px; }
        .ps-hero-trust { display: flex; flex-wrap: wrap; gap: 10px 24px; }
        .ps-hero-trust span { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; color: var(--muted); font-weight: 500; }
        .ps-hero-trust svg { color: var(--green); }
        .hook-badge2 { display: inline-flex; align-items: center; gap: 8px; background: var(--teal-soft); border: 1px solid color-mix(in oklch, var(--teal) 30%, transparent); border-radius: 100px; padding: 6px 16px; font-size: 13px; font-weight: 600; color: var(--teal); margin-bottom: 20px; }
        [data-theme="dark"] .hook-badge2 { background: color-mix(in oklch, var(--teal) 18%, transparent); border-color: color-mix(in oklch, var(--teal) 35%, transparent); }

        .chaos-visual2 { position: relative; display: flex; align-items: center; justify-content: center; }
        .chaos-items2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; max-width: 380px; margin: 0 auto; }
        .chaos-bubble2 { padding: 14px 16px; border-radius: 10px; font-size: 13px; font-weight: 500; text-align: center; white-space: nowrap; }
        .chaos-bubble2:nth-child(odd) { animation: floatChaos2 3s ease-in-out infinite; }
        .chaos-bubble2:nth-child(even) { animation: floatChaos2 3s ease-in-out infinite; animation-delay: 1.5s; }
        .chaos-bubble2.wa { background: color-mix(in oklch, var(--green) 15%, transparent); color: var(--green); }
        .chaos-bubble2.excel { background: color-mix(in oklch, var(--teal) 15%, transparent); color: var(--teal); }
        .chaos-bubble2.missed { background: color-mix(in oklch, var(--danger) 12%, transparent); color: var(--danger); }
        .chaos-bubble2.conf { background: var(--teal-soft); color: var(--muted); }
        .chaos-bubble2.delay { background: color-mix(in oklch, var(--accent) 12%, transparent); color: var(--accent); }
        @keyframes floatChaos2 { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-8px) scale(1.02); } }
        @media (prefers-reduced-motion: reduce) { .chaos-bubble2 { animation: none !important; } }

        .pain-points2 { background: var(--surface); border-block: 1px solid var(--border); padding: 28px 4px; }
        .pp-track { display: flex; align-items: center; justify-content: center; min-height: 60px; position: relative; }
        .pp-item { font-family: var(--font-display); font-size: clamp(19px, 2.3vw, 26px); font-weight: 600; color: var(--fg); text-align: center; opacity: 0; transition: opacity 0.5s ease, transform 0.5s ease; transform: translateY(8px); position: absolute; pointer-events: none; width: 100%; padding-inline: var(--gutter); }
        .pp-item.active { opacity: 1; transform: translateY(0); position: relative; }
        .pp-accent { color: var(--teal); }

        .trust-bar2 { padding-block: 32px; text-align: center; }
        .trust-metrics2 { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--gap-lg); }
        .trust-metric2 { text-align: center; }
        .trust-metric2 .num { font-family: var(--font-mono); font-size: 28px; font-weight: 700; color: var(--accent); margin-bottom: 4px; }
        .trust-metric2 .tm-label { font-size: 14px; color: var(--muted); font-weight: 500; }

        .industry-tag2 { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
        .industry-tag2 span { font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.06em; }
        .impact-tag2 { display: inline-block; margin-top: var(--gap-sm); font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: var(--danger); background: color-mix(in oklch, var(--danger) 10%, transparent); padding: 3px 10px; border-radius: 6px; }
        [data-theme="dark"] .impact-tag2 { background: color-mix(in oklch, var(--danger) 16%, transparent); }
        .roi-line2 { margin-top: 8px; font-size: 14px; font-weight: 600; color: var(--teal); }
        [data-theme="dark"] .roi-line2 { color: var(--teal); }

        .chat-mock2 { background: color-mix(in oklch, var(--green) 6%, transparent); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px 16px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 420px; margin: 0 auto; }
        [data-theme="dark"] .chat-mock2 { background: color-mix(in oklch, var(--green) 8%, transparent); border-color: var(--border); }
        .chat-header2 { display: flex; align-items: center; gap: 10px; padding-bottom: 12px; border-bottom: 1px solid var(--border); margin-bottom: 12px; color: var(--green); font-weight: 700; font-size: 14px; }
        .group-icon2 { width: 36px; height: 36px; border-radius: 50%; background: var(--green); display: grid; place-items: center; color: white; font-size: 14px; flex-shrink: 0; }
        .chat-msg2 { margin-bottom: 10px; max-width: 82%; padding: 8px 12px; border-radius: 10px; font-size: 13px; line-height: 1.4; }
        .chat-msg2.sent { background: color-mix(in oklch, var(--green) 20%, transparent); color: var(--fg); margin-left: auto; border-bottom-right-radius: 2px; }
        [data-theme="dark"] .chat-msg2.sent { background: color-mix(in oklch, var(--green) 22%, transparent); color: var(--fg); }
        .chat-msg2.recv { background: var(--surface); border: 1px solid var(--border); margin-right: auto; border-bottom-left-radius: 2px; color: var(--muted); }
        [data-theme="dark"] .chat-msg2.recv { background: var(--surface); border-color: var(--border); color: var(--muted); }
        .sender2 { font-size: 11px; font-weight: 600; color: var(--teal); margin-bottom: 2px; display: block; }

        .chaos-map2 { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: center; gap: var(--gap-md); max-width: 900px; margin: 0 auto; }
        .chaos-sources2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .chaos-src { padding: 14px 16px; border-radius: var(--radius); font-size: 14px; font-weight: 600; text-align: center; animation: floatChaos2 3s ease-in-out infinite; color: var(--muted); background: color-mix(in oklch, var(--fg) 5%, transparent); border: 1px solid var(--border); }
        .chaos-src:nth-child(odd) { animation-delay: 0s; }
        .chaos-src:nth-child(even) { animation-delay: 1.5s; }
        .chaos-src:nth-child(3n+1) { color: var(--green); background: color-mix(in oklch, var(--green) 10%, transparent); border-color: color-mix(in oklch, var(--green) 25%, transparent); }
        .chaos-src:nth-child(3n+2) { color: var(--teal); background: var(--teal-soft); border-color: color-mix(in oklch, var(--teal) 25%, transparent); }
        .chaos-src:nth-child(3n+3) { color: var(--danger); background: color-mix(in oklch, var(--danger) 8%, transparent); border-color: color-mix(in oklch, var(--danger) 20%, transparent); }
        [data-theme="dark"] .chaos-src { background: color-mix(in oklch, var(--fg) 4%, transparent); border-color: var(--border); }
        .chaos-funnel2 { display: grid; place-items: center; }
        .chaos-funnel2 .arrow2 { width: 28px; height: 28px; color: var(--muted); opacity: 0.5; }
        .chaos-core2 { display: grid; place-items: center; gap: 12px; }
        .core-tag2 { padding: 14px 32px; border-radius: var(--radius-lg); font-family: var(--font-display); font-size: 22px; font-weight: 700; background: color-mix(in oklch, var(--danger) 12%, transparent); color: var(--danger); border: 2px dashed var(--danger); letter-spacing: 0.04em; position: relative; }
        .core-sub2 { font-size: 13px; color: var(--muted); text-align: center; }
        .chaos-resolve2 { display: grid; place-items: center; gap: 8px; }
        .resolve-tag2 { padding: 14px 32px; border-radius: var(--radius-lg); font-family: var(--font-display); font-size: 22px; font-weight: 700; background: var(--accent-soft); color: var(--accent); border: 2px solid var(--accent); }
        .resolve-sub2 { font-size: 14px; font-weight: 600; color: var(--green); text-align: center; }

        .stats-panel2 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap-md); max-width: 800px; margin: 0 auto; }
        .stat-block2 { text-align: center; padding: 28px 20px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); }
        [data-theme="dark"] .stat-block2 { background: color-mix(in oklch, var(--fg) 3%, transparent); border-color: var(--border); }
        .stat-num2 { font-family: var(--font-mono); font-size: clamp(32px, 4.5vw, 48px); font-weight: 700; color: var(--accent); line-height: 1.1; }
        .stat-label2 { font-size: 14px; color: var(--muted); margin-top: 6px; font-weight: 500; }
        .stat-note2 { font-size: 12px; color: var(--green); margin-top: 4px; font-weight: 600; }

        .compact-compare2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); border-radius: var(--radius-lg); overflow: hidden; max-width: 800px; margin: 0 auto; }
        .compact-col2 { padding: 20px 24px; background: var(--surface); }
        .compact-col2.bad { border-right: 3px solid var(--danger); }
        .compact-col2.good { border-left: 3px solid var(--green); margin-left: -1px; }
        .compact-col2 h4 { font-size: 16px; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
        .compact-col2.bad h4 { color: var(--danger); }
        .compact-col2.good h4 { color: var(--green); }
        .compact-row2 { display: flex; align-items: center; gap: 10px; padding: 8px 0; font-size: 14px; color: var(--fg); }
        [data-theme="dark"] .compact-row2 { color: var(--muted); }
        .compact-row2 .dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .compact-col2.bad .dot { background: var(--danger); }
        .compact-col2.good .dot { background: var(--green); }

        .sol-flow2 { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: center; gap: var(--gap-md); max-width: 700px; margin: 0 auto var(--gap-xl); }
        .sf-node2 { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; text-align: center; }
        [data-theme="dark"] .sf-node2 { background: var(--surface); border-color: var(--border); }
        .sf-label2 { font-weight: 700; font-size: 17px; margin-bottom: 4px; }
        .sf-sub2 { font-size: 13px; color: var(--muted); }
        .sf-node2.chaos2 { background: color-mix(in oklch, var(--danger) 8%, transparent); border-color: color-mix(in oklch, var(--danger) 25%, transparent); }
        [data-theme="dark"] .sf-node2.chaos2 { background: color-mix(in oklch, var(--danger) 12%, transparent); border-color: color-mix(in oklch, var(--danger) 30%, transparent); }
        .sf-node2.chaos2 .sf-label2 { color: var(--danger); }
        .sf-node2.hero2 { background: var(--accent-soft); border-color: var(--accent); }
        [data-theme="dark"] .sf-node2.hero2 { background: color-mix(in oklch, var(--accent) 16%, transparent); }
        .sf-node2.hero2 .sf-label2 { color: var(--accent); }
        .sf-node2.result2 { background: color-mix(in oklch, var(--green) 8%, transparent); border-color: var(--green); }
        [data-theme="dark"] .sf-node2.result2 { background: color-mix(in oklch, var(--green) 14%, transparent); border-color: var(--green); }
        .sf-node2.result2 .sf-label2 { color: var(--green); }
        .sf-arrow2 { display: grid; place-items: center; color: var(--muted); }
        .sf-arrow2 svg { width: 28px; height: 28px; }
        .module-tags2 { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; max-width: 700px; margin: 0 auto; }
        .module-tag2 { padding: 6px 14px; border-radius: 100px; font-size: 13px; font-weight: 600; background: var(--teal-soft); color: var(--teal); border: 1px solid color-mix(in oklch, var(--teal) 20%, transparent); }
        [data-theme="dark"] .module-tag2 { background: color-mix(in oklch, var(--teal) 18%, transparent); border-color: color-mix(in oklch, var(--teal) 28%, transparent); }

        .pvp-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gap-lg); max-width: 800px; margin: 0 auto; }
        .pvp-col2 { border-radius: var(--radius-lg); overflow: hidden; }
        .pvp-col2.people { border: 1px solid var(--danger); }
        .pvp-col2.process { border: 1px solid var(--green); }
        .pvp-head2 { padding: 16px 20px; font-weight: 700; font-size: 17px; text-align: center; }
        .pvp-col2.people .pvp-head2 { background: color-mix(in oklch, var(--danger) 10%, transparent); color: var(--danger); }
        .pvp-col2.process .pvp-head2 { background: color-mix(in oklch, var(--green) 12%, transparent); color: var(--green); }
        .pvp-row2 { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid var(--border); padding: 12px 16px; font-size: 14px; align-items: center; }
        [data-theme="dark"] .pvp-row2 { border-color: var(--border); }
        .pvp-row2:last-child { border-bottom: 0; }
        .pvp-row2 span:first-child { text-align: left; padding-right: 14px; }
        .pvp-row2 span:last-child { text-align: right; padding-left: 14px; font-weight: 700; }
        .pvp-col2.people .pvp-row2 span { color: var(--danger); }
        .pvp-col2.process .pvp-row2 span:first-child { color: var(--green); padding-right: 14px; }
        .pvp-col2.process .pvp-row2 span:last-child { color: var(--fg); padding-left: 14px; font-weight: 400; text-align: left; }
        [data-theme="dark"] .pvp-col2.people .pvp-row2 span { color: color-mix(in oklch, var(--danger) 85%, white); }
        [data-theme="dark"] .pvp-col2.process .pvp-row2 span:first-child { color: var(--green); }
        .pvp-label2 { font-weight: 600; padding: 10px 16px; background: color-mix(in oklch, var(--fg) 4%, transparent); font-size: 14px; color: var(--fg); }
        [data-theme="dark"] .pvp-label2 { background: color-mix(in oklch, var(--fg) 6%, transparent); }

        .section-dark2 .stat-num2 { color: var(--fg); }
        .section-dark2 .stat-note2 { color: var(--green); }
        .section-dark2 .card { background: color-mix(in oklch, white 6%, transparent); border-color: color-mix(in oklch, white 16%, transparent); color: white; }
        .section-dark2 .card p { color: color-mix(in oklch, white 70%, transparent); }
        .section-dark2 .card h3 { color: white; }
        .section-dark2 .impact-tag2 { background: color-mix(in oklch, var(--danger) 20%, transparent); }

        .compare-wrap2 { position: relative; max-width: 700px; margin: 0 auto; border-radius: var(--radius-lg); overflow: hidden; }
        .compare-pane2 { display: grid; grid-template-columns: 1fr 1fr; }
        .compare-col2 { padding: 28px 24px; }
        .compare-col2.before { background: color-mix(in oklch, var(--danger) 6%, transparent); }
        [data-theme="dark"] .compare-col2.before { background: color-mix(in oklch, var(--danger) 8%, transparent); }
        .compare-col2.after { background: color-mix(in oklch, var(--green) 6%, transparent); }
        [data-theme="dark"] .compare-col2.after { background: color-mix(in oklch, var(--green) 8%, transparent); }
        .compare-col2 h4 { margin-bottom: 16px; font-size: 20px; display: flex; align-items: center; gap: 8px; }
        .compare-col2.before h4 { color: var(--danger); }
        .compare-col2.after h4 { color: var(--green); }
        .compare-item2 { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 15px; }
        [data-theme="dark"] .compare-item2 { border-color: var(--border); color: var(--muted); }
        .compare-item2:last-child { border-bottom: 0; }
        .compare-item2 svg { width: 18px; height: 18px; flex-shrink: 0; margin-top: 1px; }
        .compare-col2.before .compare-item2 svg { color: var(--danger); }
        .compare-col2.after .compare-item2 svg { color: var(--green); }

        .micro-cta2 { text-align: center; padding-block: 24px; }

        @media (max-width: 1024px) {
          .ps-hero-grid { grid-template-columns: 1fr; gap: 40px; }
          .sol-flow2, .pvp-grid2 { grid-template-columns: 1fr; }
          .chaos-map2 { grid-template-columns: 1fr; gap: var(--gap-sm); }
          .sf-arrow2 { transform: rotate(90deg); text-align: center; }
          .compare-pane2 { grid-template-columns: 1fr; }
          .trust-metrics2 { grid-template-columns: repeat(2, 1fr); }
          .chaos-visual2 { margin-top: 20px; }
          .chat-mock2 { max-width: 100%; }
        }
        @media (max-width: 768px) {
          .stats-panel2 { grid-template-columns: 1fr; }
          .compact-compare2 { grid-template-columns: 1fr; }
          .trust-metrics2 { grid-template-columns: 1fr 1fr; gap: var(--gap-md); }
          .ps-hero-grid { gap: 32px; }
          .ps-hero-cta { flex-direction: column; }
          .ps-hero-cta .btn { width: 100%; justify-content: center; }
          .chaos-visual2 { margin-top: 12px; }
        }
        @media (max-width: 480px) {
          .trust-metrics2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <main id="content" role="main">

        {/* 01: HERO */}
        <section className="section ps-hero" ref={heroRef}>
          <Container>
            <div className="ps-hero-grid">
              <div className="ps-hero-content reveal">
                <div className="hook-badge2">
                  <AlertIcon /> Business Challenges MSMEs Face Every Day
                </div>
                <h1>How Many Tasks Did Your Team Miss Today?</h1>
                <p className="lead">Purchase approvals stuck in chat groups. Sales follow-ups buried. Production checklists skipped, quality slips, customers walk. OptiFlow OS replaces manual chaos with structured systems so you stop chasing and start growing.</p>
                <div className="ps-hero-cta">
                  <Button as={Link} to="/demo-booking" variant="primary" size="lg">Book Free Demo</Button>
                  <Button as={Link} to="#growth" variant="secondary" size="lg">Explore The Problems</Button>
                </div>
                <div className="ps-hero-trust">
                  <span><CheckSvg /> Built For MSMEs</span>
                  <span><CheckSvg /> Fast Deployment</span>
                  <span><CheckSvg /> Easy Adoption</span>
                  <span><CheckSvg /> Process-Driven Growth</span>
                </div>
              </div>
              <div className="chaos-visual2 reveal">
                <div className="chaos-items2">
                  <div className="chaos-bubble2 wa">WhatsApp Forward</div>
                  <div className="chaos-bubble2 excel">Excel Sheet v12</div>
                  <div className="chaos-bubble2 missed">Task Missed</div>
                  <div className="chaos-bubble2 conf">Who is handling?</div>
                  <div className="chaos-bubble2 delay">Follow-up 3 days late</div>
                  <div className="chaos-bubble2 missed">Missing Approvals</div>
                  <div className="chaos-bubble2 conf">No status update</div>
                  <div className="chaos-bubble2 delay">Wrong version used</div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 02: PAIN POINTS CAROUSEL */}
        <section className="pain-points2">
          <PainPointCarousel />
        </section>

        {/* 02B: CHAOS MAP */}
        <Section heading="This Is How Most MSMEs Operate Today" lead="WhatsApp forwards. Excel sheets. Phone calls. Manual registers. Verbal instructions. Everything scattered across people and devices — no single source of truth.">
          <div className="chaos-map2 reveal">
            <div className="chaos-sources2">
              {CHAOS_SOURCES.map((s) => <div key={s} className="chaos-src">{s}</div>)}
            </div>
            <div className="chaos-funnel2"><div className="arrow2"><ArrowRight /></div></div>
            <div className="chaos-core2">
              <div className="core-tag2">CHAOS</div>
              <div className="core-sub2">No ownership. No visibility. No audit trail.</div>
            </div>
            <div className="chaos-funnel2"><div className="arrow2"><ArrowRight /></div></div>
            <div className="chaos-resolve2">
              <div className="resolve-tag2">OptiFlow OS</div>
              <div className="resolve-sub2">Single Source of Truth</div>
            </div>
          </div>
        </Section>

        {/* 03: TRUST BAR */}
        <section className="trust-bar2 reveal">
          <Container>
            <div className="trust-metrics2">
              {TRUST_METRICS.map((m) => (
                <div key={m.label} className="trust-metric2">
                  <div className="num">{m.num}</div>
                  <div className="tm-label">{m.label}</div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* 04: INDUSTRY PROBLEM CARDS */}
        <Section id="growth" heading={'"That\'s Exactly My Business"'} lead="Real scenarios from textile, manufacturing, trading, and logistics MSMEs — and what they cost every month.">
          <div className="grid-3 stagger">
            {INDUSTRY_CARDS.map((c, i) => (
              <Card key={i} hover>
                <div className="industry-tag2"><span>{c.industry}</span></div>
                <h3>{c.title}</h3>
                <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.55 }}>{c.desc}</p>
                <span className="impact-tag2">{c.impact}</span>
                <p className="roi-line2">{c.roi}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* 05: WHATSAPP + EXCEL */}
        <Section heading="WhatsApp Is Great for Chatting. Not for Running a Business." lead="These are the two tools most MSMEs use to manage operations — and exactly why growth breaks.">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap-xl)', alignItems: 'start' }}>
            <div>
              <div className="chat-mock2">
                <div className="chat-header2">
                  <div className="group-icon2"><ChatIcon /></div>
                  Operations Group
                </div>
                <div className="chat-msg2 sent"><span className="sender2">Owner</span> Production update for today?</div>
                <div className="chat-msg2 recv"><span className="sender2">Supervisor</span> Running, will share by evening</div>
                <div className="chat-msg2 sent"><span className="sender2">Owner</span> Who is handling the inspection checklist?</div>
                <div className="chat-msg2 recv"><span className="sender2">QC Manager</span> I think Ramesh checked yesterday</div>
                <div className="chat-msg2 recv"><span className="sender2">HR</span> 3 people on leave, no backup assigned</div>
                <div className="chat-msg2 sent"><span className="sender2">Owner</span> Purchase approval for Vendor X pending since Tuesday — anyone?</div>
                <div className="chat-msg2 recv"><span className="sender2">Finance</span> Wasn't that already approved last week?</div>
              </div>
            </div>
            <div>
              <h3 style={{ marginBottom: 16 }}>The Real Cost of Chat-Based Operations</h3>
              <Card style={{ marginBottom: 12 }}>
                <h3 style={{ fontSize: 16 }}>Tasks Get Lost</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)' }}>Messages scroll. Priorities vanish. Follow-ups consume 60% of the owner's day.</p>
                <span className="impact-tag2">Lost: 12-20 working hours/month</span>
              </Card>
              <Card style={{ marginBottom: 12 }}>
                <h3 style={{ fontSize: 16 }}>No Audit Trail</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)' }}>When something goes wrong, there's no record. No proof. No accountability.</p>
                <span className="impact-tag2">Compliance Gap</span>
              </Card>
              <Card>
                <h3 style={{ fontSize: 16 }}>Zero Visibility</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)' }}>Excel files sit on laptops. WhatsApp messages are ephemeral. You can't see the big picture.</p>
                <span className="impact-tag2">Blind Spot</span>
                <p className="roi-line2">Fix this: move from 20 chat groups to one operating system</p>
              </Card>
            </div>
          </div>
          <div className="micro-cta2 reveal">
            <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 12 }}>Ready to move from chat chaos to structured operations?</p>
            <Button as={Link} to="/demo-booking" variant="primary" size="lg">Book Your Demo — It&apos;s Free</Button>
          </div>
        </Section>

        {/* 06: COST OF DOING NOTHING */}
        <Section background="dark" heading="The Cost of Doing Nothing" lead="Every month without structured systems leaks time, money, and growth.">
          <div className="stats-panel2 stagger">
            {COST_STATS.map((s) => (
              <div key={s.label} className="stat-block2">
                <div className="stat-num2">{s.num}</div>
                <div className="stat-label2">{s.label}</div>
                <div className="stat-note2">{s.note}</div>
              </div>
            ))}
          </div>
          <div className="micro-cta2 reveal" style={{ marginTop: 32 }}>
            <p style={{ fontSize: 16, color: 'var(--muted)', marginBottom: 14, maxWidth: 480, marginInline: 'auto' }}>Stop bleeding ₹5—20L every year. See how OptiFlow plugs every leak.</p>
            <Button as={Link} to="/demo-booking" variant="primary" size="lg">Get Your Free Operations Audit</Button>
            <span style={{ marginLeft: 12 }}>
              <Button as={Link} to="/product-overview" variant="secondary" size="lg">See The Platform</Button>
            </span>
          </div>
        </Section>

        {/* 07: SOLUTION FLOW */}
        <Section heading="From Chaos to Operational Excellence" lead="OptiFlow OS replaces disconnected tools with one system that gives every task an owner, deadline, and status.">
          <div className="sol-flow2 reveal">
            <div className="sf-node2 chaos2"><div className="sf-label2">Business Chaos</div><div className="sf-sub2">WhatsApp → Excel → Calls → Memory</div></div>
            <div className="sf-arrow2"><ArrowRight /></div>
            <div className="sf-node2 hero2"><div className="sf-label2">OptiFlow OS</div><div className="sf-sub2">Single Source of Truth</div></div>
            <div className="sf-arrow2"><ArrowRight /></div>
            <div className="sf-node2 result2"><div className="sf-label2">Process-Driven Business</div><div className="sf-sub2">Predictable → Accountable → Scalable</div></div>
          </div>
          <div className="module-tags2 reveal">
            {MODULE_TAGS.map((t) => <span key={t} className="module-tag2">{t}</span>)}
          </div>
        </Section>

        {/* 08: PEOPLE VS PROCESS */}
        <Section heading="People-Driven vs Process-Driven" lead="The fundamental shift every MSME must make to scale.">
          <div className="pvp-grid2 reveal">
            <div className="pvp-col2 people">
              <div className="pvp-head2">People-Driven Business</div>
              <div className="pvp-label2">Comparison</div>
              {PVP_ROWS.map((r, i) => (
                <div key={i} className="pvp-row2"><span>{r.people}</span><span>{r.proc}</span></div>
              ))}
            </div>
            <div className="pvp-col2 process">
              <div className="pvp-head2">Process-Driven Business</div>
              <div className="pvp-label2">Outcome</div>
              {PVP_ROWS.map((r, i) => (
                <div key={i} className="pvp-row2"><span>{r.proc}</span><span>{r.outcome}</span></div>
              ))}
            </div>
          </div>
        </Section>

        {/* 09: BEFORE & AFTER */}
        <Section heading="Before OptiFlow vs After OptiFlow" lead="The same business. Two very different ways of operating.">
          <div className="compact-compare2 reveal">
            <div className="compact-col2 bad">
              <h4><XIcon /> Before OptiFlow</h4>
              {BEFORE_ITEMS.map((t, i) => <div key={i} className="compact-row2"><span className="dot" /> {t}</div>)}
            </div>
            <div className="compact-col2 good">
              <h4><CheckIcon2 /> After OptiFlow</h4>
              {AFTER_ITEMS.map((t, i) => <div key={i} className="compact-row2"><span className="dot" /> {t}</div>)}
            </div>
          </div>
        </Section>

        {/* 10: CTA */}
        <Section background="surface" heading="Imagine Running Your Business Without Constant Follow-Ups." lead="See every task. Track every team. Build systems that scale. We'll show you how in 30 minutes.">
          <div style={{ display: 'flex', gap: 'var(--gap-sm)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button as={Link} to="/demo-booking" variant="primary" size="lg">Book Free Demo</Button>
            <Button as={Link} to="/product-overview" variant="secondary" size="lg">Watch Product Tour</Button>
          </div>
        </Section>

      </main>
    </>
  );
}
