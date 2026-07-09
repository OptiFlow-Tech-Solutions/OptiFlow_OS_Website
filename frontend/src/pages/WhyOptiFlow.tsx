import { useRef } from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import { useTypewriter } from '../hooks/useTypewriter';
import { useMouseGlow } from '../hooks/useMouseGlow';
import { useCountUp } from '../hooks/useCountUp';
import { Section, Card, Container, Button } from '../components';
import ComparisonTable from '../components/sections/ComparisonTable';

// ─── SVG Icons ───

const CheckSmall = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowDown = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="9" y1="2" x2="9" y2="14" />
    <polyline points="4,10 9,15 14,10" />
  </svg>
);

const ChatIcon2 = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 22, height: 22 }}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const SpreadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 22, height: 22 }}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 22, height: 22 }}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const PeopleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 22, height: 22 }}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 22, height: 22 }}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const DocIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 22, height: 22 }}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const MonitorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 26, height: 26 }}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const VerifiedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 26, height: 26 }}>
    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <polyline points="17 11 19 13 23 9" />
  </svg>
);

const PulseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 26, height: 26 }}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 24, height: 24 }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 24, height: 24 }}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const ReloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 24, height: 24 }}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const SupportIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 24, height: 24 }}>
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.5">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const RoleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.5">
    <path d="M15 14c.8.8 1.3 1.9 1.3 3.1V18H7.7v-.9c0-1.2.5-2.3 1.3-3.1M12 13a3 3 0 100-6 3 3 0 000 6z" />
    <path d="M5 20v-1a7 7 0 0114 0v1" />
  </svg>
);

const MobileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.5">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12" y2="18.01" />
  </svg>
);

// ─── Typewriter Phrases ───

const WOF_PHRASES = [
  'Turn Chaos Into Complete Control.',
  'Build A Team That Owns Results.',
  'See Every Operation In Real Time.',
  'Scale With Systems, Not Stress.',
  'Work On Your Business, Not In It.',
];

// ─── Data ───

const PROBLEM_CARDS = [
  { icon: ChatIcon2, title: 'WhatsApp Dependency', desc: 'Tasks assigned in group chats vanish. No ownership, no tracking, no accountability — just endless scrolling.', impact: '73% of MSMEs lose tasks in chat', solution: 'OptiFlow: Every task has an owner, deadline, and audit trail.' },
  { icon: SpreadIcon, title: 'Excel Dependency', desc: "Version conflicts, formula errors, manual updates — spreadsheets weren't built for real-time operations.", impact: 'Version conflicts cause 12% of errors', solution: 'OptiFlow: Live data, zero version conflicts, real-time dashboards.' },
  { icon: ClockIcon, title: 'Manual Follow-Ups', desc: 'Owners and managers spend hours daily chasing status updates instead of growing the business.', impact: '60-100 hrs/month lost to follow-ups', solution: 'OptiFlow: Automated reminders, real-time dashboards — zero follow-ups needed.' },
  { icon: PeopleIcon, title: 'Employee Dependency', desc: 'When key employees leave, processes leave with them. Knowledge lives in their heads, not in a system.', impact: '5-8 day disruption per departure', solution: 'OptiFlow: SOPs, checklists, and workflows capture institutional knowledge permanently.' },
  { icon: EyeIcon, title: 'No Visibility', desc: "Owners have no real-time view of what's happening across departments, shifts, or locations.", impact: 'Blind spots cost ₹5-20L/year', solution: 'OptiFlow: Live dashboards — see every department, every task, every outcome in real time.' },
  { icon: DocIcon, title: 'No Accountability', desc: 'When tasks can be denied or forgotten, there is no reliable system to track who did what and when.', impact: 'Zero audit trail for compliance', solution: 'OptiFlow: Complete audit logs — who did what, when, with full evidence trail.' },
];

const ROI_STATS = [
  { target: 80, suffix: '%', label: 'Reduced Follow-Ups', desc: 'Managers recover 60-100 hours/month previously spent on status calls and WhatsApp chasing.' },
  { target: 95, suffix: '%', label: 'Accountability Improvement', desc: "Clear ownership + audit trail = tasks don't fall through cracks anymore." },
  { target: 100, suffix: '%', label: 'Visibility Improvement', desc: 'Real-time dashboards replace "what\'s happening?" calls with live operational data.' },
  { target: 40, suffix: '%', label: 'Faster Task Execution', desc: 'Structured assignment + automated reminders cut task completion time nearly in half.' },
  { target: 120, suffix: '+', prefix: '', label: 'Hours Saved / Month', desc: 'Average hours recovered per manager per month — redirect to growth, not chasing.' },
  { target: 3, suffix: '', label: 'Month Payback Period', desc: 'Most businesses recover their investment within the first quarter of operations.' },
  { target: 92, suffix: '%', label: 'Task Completion Rate', desc: 'Structured tracking drives completion from ~60% (manual) to over 90%.' },
  { target: 100, suffix: '%', label: 'Audit Readiness', desc: 'Complete digital trail — every action logged, every task verifiable, zero audit stress.' },
];

const COMP_COLUMNS = [
  { key: 'capability', label: 'Capability' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'excel', label: 'Excel' },
  { key: 'generic', label: 'Generic Task Tools' },
  { key: 'traditional', label: 'Traditional Systems' },
  { key: 'optiflow', label: 'OptiFlow OS', highlight: true },
];

const COMP_ROWS = [
  { capability: { type: 'text' as const, value: 'Task Ownership' }, whatsapp: { type: 'cross' as const }, excel: { type: 'cross' as const }, generic: { type: 'check' as const }, traditional: { type: 'check' as const }, optiflow: { type: 'check' as const } },
  { capability: { type: 'text' as const, value: 'Accountability System' }, whatsapp: { type: 'cross' as const }, excel: { type: 'cross' as const }, generic: { type: 'cross' as const }, traditional: { type: 'check' as const }, optiflow: { type: 'check' as const } },
  { capability: { type: 'text' as const, value: 'Real-Time Visibility' }, whatsapp: { type: 'cross' as const }, excel: { type: 'cross' as const }, generic: { type: 'check' as const }, traditional: { type: 'check' as const }, optiflow: { type: 'check' as const } },
  { capability: { type: 'text' as const, value: 'Attendance' }, whatsapp: { type: 'cross' as const }, excel: { type: 'cross' as const }, generic: { type: 'cross' as const }, traditional: { type: 'check' as const }, optiflow: { type: 'check' as const } },
  { capability: { type: 'text' as const, value: 'Approval Workflows' }, whatsapp: { type: 'cross' as const }, excel: { type: 'cross' as const }, generic: { type: 'cross' as const }, traditional: { type: 'check' as const }, optiflow: { type: 'check' as const } },
  { capability: { type: 'text' as const, value: 'Reporting & Analytics' }, whatsapp: { type: 'cross' as const }, excel: { type: 'cross' as const }, generic: { type: 'cross' as const }, traditional: { type: 'check' as const }, optiflow: { type: 'check' as const } },
  { capability: { type: 'text' as const, value: 'SOP Library' }, whatsapp: { type: 'cross' as const }, excel: { type: 'cross' as const }, generic: { type: 'cross' as const }, traditional: { type: 'cross' as const }, optiflow: { type: 'check' as const } },
  { capability: { type: 'text' as const, value: 'Training Management' }, whatsapp: { type: 'cross' as const }, excel: { type: 'cross' as const }, generic: { type: 'cross' as const }, traditional: { type: 'cross' as const }, optiflow: { type: 'check' as const } },
  { capability: { type: 'text' as const, value: 'Audit Logs' }, whatsapp: { type: 'cross' as const }, excel: { type: 'cross' as const }, generic: { type: 'cross' as const }, traditional: { type: 'check' as const }, optiflow: { type: 'check' as const } },
  { capability: { type: 'text' as const, value: 'Scalability' }, whatsapp: { type: 'cross' as const }, excel: { type: 'cross' as const }, generic: { type: 'check' as const }, traditional: { type: 'check' as const }, optiflow: { type: 'check' as const } },
  { capability: { type: 'text' as const, value: 'MSME Focused' }, whatsapp: { type: 'cross' as const }, excel: { type: 'cross' as const }, generic: { type: 'cross' as const }, traditional: { type: 'cross' as const }, optiflow: { type: 'check' as const } },
];

const TESTIMONIALS = [
  { initials: 'AK', name: 'Amit Kumar', role: 'Director, Vertex Manufacturing', quote: '"We reduced follow-up calls from 4-5 per task to zero. Our managers now spend time improving operations instead of chasing status updates."', outcome: 'Result: 80% reduction in follow-up time, ₹4.2L annual savings' },
  { initials: 'NS', name: 'Neha Sharma', role: 'Operations Head, Apex Textiles', quote: '"Before OptiFlow, we had SOPs in a binder nobody opened. Now every checklist is tracked, verified, and linked to actual task completion."', outcome: 'Result: 95% SOP compliance, audit-ready in under 5 minutes' },
  { initials: 'RP', name: 'Rajesh Patel', role: 'Founder, SwiftLog Logistics', quote: '"The biggest win for us was the WhatsApp chaos ending. No more searching through 15 group chats to find what was assigned to whom."', outcome: 'Result: 100% task tracking, zero lost assignments in 6 months' },
];

// ─── CountUp Card ───

function ROICard({ target, suffix = '', prefix = '', label, desc }: { target: number; suffix?: string; prefix?: string; label: string; desc: string }) {
  const { display, ref } = useCountUp(target, { suffix, prefix, duration: 1500 });
  return (
    <div ref={ref}>
      <Card style={{ textAlign: 'center', padding: '32px 20px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>{display}</div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{label}</div>
        <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</p>
      </Card>
    </div>
  );
}

// ─── Page ───

export default function WhyOptiFlow() {
  const heroRef = useRef<HTMLElement>(null);
  const { text, isCursorVisible } = useTypewriter(WOF_PHRASES, { typeSpeed: 50, deleteSpeed: 22, holdDuration: 2500 });
  const glow = useMouseGlow(heroRef);
  useScrollReveal();

  return (
    <>
      <style>{`
        .wof-hero { padding-top: calc(var(--nav-h) + 60px); padding-bottom: 80px; overflow: hidden; position: relative; }
        .wof-hero::before { content: ''; position: absolute; top: -50%; right: -20%; width: 80%; height: 150%; background: radial-gradient(ellipse at center, color-mix(in oklch, var(--teal) 8%, transparent) 0%, transparent 70%); pointer-events: none; }
        .wof-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .wof-hero-content { position: relative; z-index: 2; }
        .wof-hero-content h1 { margin-bottom: 20px; }
        .wof-hero-content .lead { margin-bottom: 32px; }
        .wof-hero-cta { display: flex; gap: var(--gap-sm); flex-wrap: wrap; margin-bottom: 40px; }
        .wof-hero-trust { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .wof-hero-trust span { display: flex; align-items: center; gap: 6px; font-size: 14px; color: var(--muted); }
        .wof-hero-trust svg { color: var(--green); flex-shrink: 0; }
        .mouse-glow2 { position: absolute; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, color-mix(in oklch, var(--accent) 12%, transparent) 0%, transparent 60%); pointer-events: none; transform: translate(-50%, -50%); z-index: 0; opacity: 0; transition: opacity 0.3s; }
        .mouse-glow2.active { opacity: 1; }
        .tw-cursor2 { display: inline-block; width: 3px; height: 0.8em; background: #84cc16; margin-left: 4px; vertical-align: middle; }

        .transform-visual2 { display: flex; flex-direction: column; align-items: center; gap: 16px; position: relative; z-index: 2; }
        .transform-stage2 { padding: 20px 36px; border-radius: var(--radius-lg); font-weight: 600; font-size: 18px; text-align: center; width: 100%; max-width: 360px; }
        .transform-stage2.chaos2 { background: oklch(90% 0.06 25); color: #0F172A; border: 1px solid oklch(80% 0.08 25); }
        [data-theme="dark"] .transform-stage2.chaos2 { background: rgba(200,80,30,.16); color: rgba(255,255,255,.88); border-color: rgba(200,80,30,.30); }
        .transform-stage2.of { background: linear-gradient(135deg, var(--accent), var(--teal)); color: white; font-size: 22px; padding: 28px 48px; box-shadow: 0 8px 32px color-mix(in oklch, var(--accent) 30%, transparent); animation: wofPulse 3s ease-in-out infinite; }
        @keyframes wofPulse { 0%, 100% { box-shadow: 0 8px 32px color-mix(in oklch, var(--accent) 30%, transparent); } 50% { box-shadow: 0 12px 48px color-mix(in oklch, var(--accent) 45%, transparent); } }
        .transform-stage2.excellence2 { background: var(--green-soft); color: #0F172A; border: 1px solid color-mix(in oklch, var(--green) 30%, transparent); }
        [data-theme="dark"] .transform-stage2.excellence2 { background: rgba(84,184,154,.16); color: rgba(255,255,255,.88); border-color: rgba(84,184,154,.30); }
        .transform-arrow2 { color: var(--muted); font-size: 24px; }
        .transform-kpi2 { position: absolute; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 10px 14px; font-size: 12px; box-shadow: 0 6px 20px color-mix(in oklch, var(--fg) 8%, transparent); animation: floatKPI2 4s ease-in-out infinite; }
        .transform-kpi2.t1 { top: 10px; left: -80px; animation-delay: 0s; }
        .transform-kpi2.t2 { top: 60px; right: -80px; animation-delay: 1.3s; }
        .transform-kpi2.t3 { bottom: 10px; left: -60px; animation-delay: 2.6s; }
        @keyframes floatKPI2 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .tk-value2 { font-family: var(--font-mono); font-weight: 700; color: var(--accent); }
        .tk-label2 { color: var(--muted); }

        .problem-card2 { padding: 32px; }
        .problem-icon2 { width: 44px; height: 44px; display: grid; place-items: center; background: oklch(96% 0.01 230); border-radius: var(--radius); margin-bottom: 20px; color: var(--accent); box-shadow: 0 2px 6px rgba(27,77,129,.08); }
        [data-theme="dark"] .problem-icon2 { background: rgba(255,255,255,.08); color: var(--teal); box-shadow: 0 2px 6px rgba(0,0,0,.25); }
        .problem-card2 h3 { margin-bottom: 8px; }
        [data-theme="dark"] .problem-card2 h3 { color: var(--fg); }
        .problem-desc2 { color: var(--muted); font-size: 14px; line-height: 1.5; margin-bottom: 12px; }
        [data-theme="dark"] .problem-desc2 { color: var(--muted); }
        .problem-impact2 { font-size: 12px; color: var(--accent); font-weight: 500; background: var(--accent-soft); display: inline-block; padding: 4px 10px; border-radius: 999px; }
        [data-theme="dark"] .problem-impact2 { color: oklch(78% 0.06 220); background: rgba(39,141,159,.18); }
        .problem-solution2 { font-size: 13px; color: var(--green); font-weight: 600; margin-top: 8px; }

        .designer-card2 { text-align: center; padding: 32px 24px; }
        .designer-icon2 { width: 56px; height: 56px; display: grid; place-items: center; background: linear-gradient(135deg, color-mix(in oklch, var(--bg) 10%, transparent), color-mix(in oklch, var(--green) 20%, transparent)); border-radius: var(--radius-lg); margin: 0 auto 16px; color: var(--green); }
        .designer-card2 h3 { margin-bottom: 8px; font-size: 16px; color: var(--fg); }
        .designer-card2 p { font-size: 13px; color: color-mix(in oklch, var(--bg) 60%, transparent); line-height: 1.5; }

        .timeline2 { position: relative; max-width: 900px; margin: 0 auto; padding: 0; }
        .timeline2::before { content: ''; position: absolute; top: 0; bottom: 0; left: 50%; width: 2px; background: linear-gradient(180deg, var(--accent), var(--teal), var(--green)); transform: translateX(-50%); }
        .timeline-item2 { display: flex; align-items: center; margin-bottom: 32px; position: relative; }
        .timeline-item2:nth-child(odd) { flex-direction: row; padding-right: 52%; }
        .timeline-item2:nth-child(even) { flex-direction: row-reverse; padding-left: 52%; }
        .timeline-dot2 { width: 48px; height: 48px; border-radius: 50%; background: var(--surface); border: 2px solid var(--accent); display: grid; place-items: center; font-family: var(--font-mono); font-weight: 700; color: var(--accent); position: absolute; left: 50%; transform: translateX(-50%); z-index: 2; flex-shrink: 0; }
        .timeline-content2 { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; }
        .timeline-content2 h3 { font-size: 16px; margin-bottom: 4px; }
        .timeline-content2 p { font-size: 13px; color: var(--muted); }

        .trust-grid2 { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--gap-lg); text-align: center; }
        .trust-item2 { padding: 28px 16px; }
        .trust-item-icon2 { width: 48px; height: 48px; display: grid; place-items: center; background: var(--accent-soft); border-radius: var(--radius-lg); margin: 0 auto 16px; color: var(--accent); }
        .trust-item2 h3 { font-size: 15px; margin-bottom: 4px; }
        .trust-item2 p { font-size: 12px; color: var(--muted); }

        .adoption-stats2 { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--gap-lg); margin-top: 56px; text-align: center; }
        .adoption-stat-value2 { font-family: var(--font-mono); font-size: clamp(28px, 4vw, 40px); font-weight: 700; color: var(--accent); margin-bottom: 4px; }
        .adoption-stat-label2 { font-size: 14px; color: var(--muted); font-weight: 500; }

        @media (max-width: 1024px) {
          .wof-hero-grid { grid-template-columns: 1fr; gap: 40px; }
          .wof-hero { padding-top: calc(var(--nav-h) + 40px); padding-bottom: 40px; }
          .transform-kpi2 { display: none; }
          .trust-grid2 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .wof-hero { padding-top: calc(var(--nav-h) + 24px); }
          .wof-hero-trust { grid-template-columns: 1fr; }
          .timeline2::before { left: 24px; }
          .timeline-item2 { padding: 0 0 0 56px !important; flex-direction: row !important; margin-bottom: 24px; }
          .timeline-dot2 { left: 24px; width: 40px; height: 40px; font-size: 14px; }
          .transform-visual2 { gap: 12px; }
        }
        @media (max-width: 480px) {
          .wof-hero-cta { flex-direction: column; }
          .transform-stage2 { font-size: 14px; padding: 14px 20px; }
          .transform-stage2.of { font-size: 16px; padding: 18px 28px; }
          .trust-grid2 { grid-template-columns: 1fr; }
          .adoption-stats2 { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <main id="content" role="main">

        {/* 01: HERO */}
        <section className="section wof-hero" ref={heroRef}>
          <div className={`mouse-glow2 ${glow.isActive ? 'active' : ''}`} style={{ left: glow.x, top: glow.y }} />
          <Container style={{ position: 'relative', zIndex: 1 }}>
            <div className="wof-hero-grid">
              <div className="wof-hero-content">
                <h1 className="reveal reveal-delay-1" style={{ marginTop: 0, minHeight: '1.2em', color: '#84cc16' }} aria-live="polite">
                  <span id="twText">{text}</span>
                  <span className="tw-cursor2" style={{ opacity: isCursorVisible ? 1 : 0 }}>|</span>
                </h1>
                <p className="lead reveal reveal-delay-2">Most business software is built for large enterprises and then modified for smaller businesses. OptiFlow was designed from the ground up for the operational realities of Indian MSMEs — where WhatsApp, Excel, and manual follow-ups still run the floor.</p>
                <div className="wof-hero-cta reveal reveal-delay-3">
                  <Button as={Link} to="/demo-booking" variant="primary" size="lg" glow>Book Free Demo</Button>
                  <Button as={Link} to="/product-overview" variant="secondary" size="lg">Watch Product Tour</Button>
                </div>
                <div className="wof-hero-trust reveal reveal-delay-3">
                  <span><CheckSmall /> MSME Focused</span>
                  <span><CheckSmall /> Fast Deployment</span>
                  <span><CheckSmall /> Easy Adoption</span>
                  <span><CheckSmall /> Process Driven Operations</span>
                </div>
              </div>
              <div className="reveal reveal-delay-2" style={{ position: 'relative' }}>
                <div className="transform-visual2">
                  <div className="transform-stage2 chaos2">Traditional Business Chaos</div>
                  <div className="transform-arrow2"><ArrowDown /></div>
                  <div className="transform-stage2 of">OptiFlow OS</div>
                  <div className="transform-arrow2"><ArrowDown /></div>
                  <div className="transform-stage2 excellence2">Process Driven Operations</div>
                  <div className="transform-kpi2 t1"><div className="tk-label2">Reduced Follow-Ups</div><div className="tk-value2 num">80%</div></div>
                  <div className="transform-kpi2 t2"><div className="tk-label2">Improved Accountability</div><div className="tk-value2 num">95%</div></div>
                  <div className="transform-kpi2 t3"><div className="tk-label2">Time Saved / Month</div><div className="tk-value2 num">120+ hrs</div></div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 02: PROBLEM CARDS */}
        <Section heading="Purpose Built For Growing Businesses" lead="Designed around how Indian MSMEs actually operate — not how a Silicon Valley product manager imagines they should.">
          <div className="grid-3 stagger">
            {PROBLEM_CARDS.map((c, i) => (
              <Card key={i} hover className="problem-card2 reveal">
                <div className="problem-icon2"><c.icon /></div>
                <h3>{c.title}</h3>
                <p className="problem-desc2">{c.desc}</p>
                <span className="problem-impact2">{c.impact}</span>
                <p className="problem-solution2">{c.solution}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* 03: DESIGNER CARDS */}
        <Section background="dark" heading="Built By People Who Understand Operations" lead="OptiFlow is not a generic productivity tool. It was designed around real operational workflows, accountability systems, delegation structures, and process execution — from the factory floor to the owner's desk.">
          <div className="grid-3 stagger">
            <Card className="designer-card2 reveal">
              <div className="designer-icon2"><MonitorIcon /></div>
              <h3>Designed For Daily Operations</h3>
              <p>Tasks, checklists, attendance, approvals — built around what happens on the floor every single day, not abstract project management concepts.</p>
            </Card>
            <Card className="designer-card2 reveal">
              <div className="designer-icon2"><VerifiedIcon /></div>
              <h3>Built For Real Accountability</h3>
              <p>WWHWE framework — every task has Who, What, How, When, and Evidence. No ambiguity, no excuses, no missed work.</p>
            </Card>
            <Card className="designer-card2 reveal">
              <div className="designer-icon2"><PulseIcon /></div>
              <h3>Practical. Easy. Relevant.</h3>
              <p>Simple enough for frontline employees. Powerful enough for business owners. Zero training needed for basic tasks — designed for real adoption.</p>
            </Card>
          </div>
        </Section>

        {/* 04: EASY ADOPTION */}
        <Section heading="Software Only Works If People Actually Use It" lead="Designed to be simple enough for frontline employees while powerful enough for business owners.">
          <div className="grid-3 stagger">
            <Card className="reveal" style={{ textAlign: 'center', padding: '36px 28px' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'color-mix(in oklch,var(--teal),transparent 88%)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}><SettingsIcon /></div>
              <h3>Simple Interface</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 8, lineHeight: 1.65 }}>Works like the apps your team already uses — no confusing menus, no training manuals needed.</p>
            </Card>
            <Card className="reveal" style={{ textAlign: 'center', padding: '36px 28px' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'color-mix(in oklch,var(--teal),transparent 88%)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}><RoleIcon /></div>
              <h3>Role-Based Views</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 8, lineHeight: 1.65 }}>Admin, Captain, or Doer — each person sees exactly what they need. Nothing more, nothing less.</p>
            </Card>
            <Card className="reveal" style={{ textAlign: 'center', padding: '36px 28px' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'color-mix(in oklch,var(--teal),transparent 88%)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}><MobileIcon /></div>
              <h3>Mobile First</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 8, lineHeight: 1.65 }}>Attendance, tasks, approvals, reports — everything works on your phone. No desktop required.</p>
            </Card>
          </div>
          <div className="adoption-stats2 reveal">
            <div><div className="adoption-stat-value2 num">90%+</div><div className="adoption-stat-label2">Adoption Rate</div></div>
            <div><div className="adoption-stat-value2 num" style={{ color: 'var(--green)' }}>&lt; 7 days</div><div className="adoption-stat-label2">Average Team Onboarding</div></div>
            <div><div className="adoption-stat-value2 num" style={{ color: 'var(--teal)' }}>3 roles</div><div className="adoption-stat-label2">Admin / Captain / Doer</div></div>
            <div><div className="adoption-stat-value2 num" style={{ color: 'var(--lime)' }}>24/7</div><div className="adoption-stat-label2">Accessible Anywhere</div></div>
          </div>
        </Section>

        {/* 05: TIMELINE */}
        <Section background="dark" heading="Go Live Faster Than Traditional Systems" lead="Weeks, not months. Structured rollout designed specifically for MSME operations — minimal disruption to your daily business.">
          <div className="timeline2 reveal">
            {[
              { num: 1, title: 'Discovery & Setup', desc: 'We map your existing processes and configure OptiFlow to match how your business actually works.' },
              { num: 2, title: 'Configuration', desc: 'Departments, roles, checklists, SOPs, and workflows set up in days — not months.' },
              { num: 3, title: 'Team Training', desc: 'Role-based training sessions — each person learns only what they need. No information overload.' },
              { num: 4, title: 'Go Live & Support', desc: 'Dedicated support during transition. Your team is never alone during the first critical weeks.' },
            ].map((item, i) => (
              <div key={i} className={`timeline-item2 reveal${i > 0 ? ` reveal-delay-${i}` : ''}`}>
                <div className="timeline-dot2">{item.num}</div>
                <div className="timeline-content2">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 06: ROI STATS */}
        <Section heading="Operational Improvements That Pay For Themselves" lead="Every rupee invested in process-driven operations returns measurable business value. Here's what OptiFlow customers consistently achieve.">
          <div className="roi-grid-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--gap-lg)' }}>
            {ROI_STATS.map((s, i) => <ROICard key={i} {...s} />)}
          </div>
          <style>{`
            @media (max-width: 1024px) { .roi-grid-auto { grid-template-columns: repeat(2, 1fr) !important; } }
            @media (max-width: 480px) { .roi-grid-auto { grid-template-columns: 1fr !important; } }
          `}</style>
        </Section>

        {/* 07: COMPARISON TABLE */}
        <Section background="dark" heading="Why Businesses Choose OptiFlow" lead="There are many ways to manage work. Only one was purpose-built for MSME operations.">
          <ComparisonTable columns={COMP_COLUMNS} rows={COMP_ROWS} />
        </Section>

        {/* 08: CUSTOMER RESULTS */}
        <Section heading="Real Business Outcomes" lead="See what operational excellence looks like for MSMEs that made the switch.">
          <div className="testimonial-grid stagger">
            {TESTIMONIALS.map((t, i) => (
              <Card key={i} className="testimonial-card reveal">
                <p className="testimonial-quote">{t.quote}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initials}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
                <p className="testimonial-outcome">{t.outcome}</p>
              </Card>
            ))}
          </div>
          <div className="testimonial-stats reveal">
            <div><div className="testimonial-stat-value num" style={{ color: 'var(--accent)' }}>80%</div><div className="testimonial-stat-label">Reduced Follow-Ups</div></div>
            <div><div className="testimonial-stat-value num" style={{ color: 'var(--green)' }}>95%</div><div className="testimonial-stat-label">Accountability Improvement</div></div>
            <div><div className="testimonial-stat-value num" style={{ color: 'var(--teal)' }}>92%</div><div className="testimonial-stat-label">Process Compliance</div></div>
            <div><div className="testimonial-stat-value num" style={{ color: 'var(--lime)' }}>100%</div><div className="testimonial-stat-label">Team Visibility</div></div>
          </div>
        </Section>

        {/* 09: TRUST ELEMENTS */}
        <Section heading="Built On Trust, Visibility, And Accountability" lead="The foundation every business needs to scale with confidence.">
          <div className="trust-grid2 stagger">
            <Card className="trust-item2 reveal"><div className="trust-item-icon2"><ShieldIcon /></div><h3>Role Based Permissions</h3><p>Admin, Captain, Doer — each role sees only what they need. No data leakage between departments.</p></Card>
            <Card className="trust-item2 reveal"><div className="trust-item-icon2"><LockIcon /></div><h3>Complete Audit Trails</h3><p>Every action logged. Who did what, when, from where — full digital record for compliance.</p></Card>
            <Card className="trust-item2 reveal"><div className="trust-item-icon2"><ReloadIcon /></div><h3>99.9% System Reliability</h3><p>Enterprise-grade infrastructure with MSME simplicity. Your operations never stop.</p></Card>
            <Card className="trust-item2 reveal"><div className="trust-item-icon2"><SupportIcon /></div><h3>Dedicated Support</h3><p>Not a chatbot. Not a ticket queue. Real humans who understand MSME operations, available when you need them.</p></Card>
          </div>
        </Section>

        {/* 10: FINAL CTA */}
        <Section background="surface" heading="Ready To Build A Process Driven Business?" lead="Discover how OptiFlow helps MSMEs improve accountability, visibility, execution, and growth through one unified operating system — built specifically for businesses like yours.">
          <div className="reveal reveal-delay-2" style={{ display: 'flex', gap: 'var(--gap-sm)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button as={Link} to="/demo-booking" variant="primary" size="lg" glow>Book Free Demo</Button>
            <Button as={Link} to="/product-overview" variant="secondary" size="lg">Watch Product Tour</Button>
            <Button as={Link} to="/competitive-positioning" variant="secondary" size="lg">Compare vs Alternatives</Button>
          </div>
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap', marginTop: 40, fontSize: 14, opacity: 0.9 }} className="reveal reveal-delay-3">
            <span><CheckSmall /> MSME Focused</span>
            <span><CheckSmall /> Fast Deployment</span>
            <span><CheckSmall /> Easy Adoption</span>
            <span><CheckSmall /> Dedicated Support</span>
          </div>
        </Section>

      </main>
    </>
  );
}
