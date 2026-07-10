import { useRef } from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import { useTypewriter } from '../hooks/useTypewriter';
import { useMouseGlow } from '../hooks/useMouseGlow';
import { useCountUp } from '../hooks/useCountUp';
import { Section, Card, Container, Button } from '../components';
import ComparisonTable from '../components/sections/ComparisonTable';
import './WhyOptiFlow.css';

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
      <Card className="text-center p-8">
        <div className="font-mono text-[40px] font-bold text-accent mb-2">{display}</div>
        <div className="text-sm font-semibold mb-1.5">{label}</div>
        <p className="text-xs text-muted leading-relaxed">{desc}</p>
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
      <main id="content" role="main">

        {/* 01: HERO */}
        <section className="section wof-hero" ref={heroRef}>
          <div className={`mouse-glow2 ${glow.isActive ? 'active' : ''}`} style={{ left: glow.x, top: glow.y }} />
          <Container className="relative z-10">
            <div className="wof-hero-grid">
              <div className="wof-hero-content">
                <h1 className="reveal reveal-delay-1 mt-0 min-h-[1.2em] text-[#84cc16]" aria-live="polite">
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
              <div className="reveal reveal-delay-2 relative">
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
            <Card className="reveal text-center py-9 px-7">
              <div className="w-12 h-12 rounded-xl bg-teal-soft grid place-items-center mx-auto mb-4"><SettingsIcon /></div>
              <h3>Simple Interface</h3>
              <p className="text-sm text-muted mt-2 leading-relaxed">Works like the apps your team already uses — no confusing menus, no training manuals needed.</p>
            </Card>
            <Card className="reveal text-center py-9 px-7">
              <div className="w-12 h-12 rounded-xl bg-teal-soft grid place-items-center mx-auto mb-4"><RoleIcon /></div>
              <h3>Role-Based Views</h3>
              <p className="text-sm text-muted mt-2 leading-relaxed">Admin, Captain, or Doer — each person sees exactly what they need. Nothing more, nothing less.</p>
            </Card>
            <Card className="reveal text-center py-9 px-7">
              <div className="w-12 h-12 rounded-xl bg-teal-soft grid place-items-center mx-auto mb-4"><MobileIcon /></div>
              <h3>Mobile First</h3>
              <p className="text-sm text-muted mt-2 leading-relaxed">Attendance, tasks, approvals, reports — everything works on your phone. No desktop required.</p>
            </Card>
          </div>
          <div className="adoption-stats2 reveal">
            <div><div className="adoption-stat-value2 num">90%+</div><div className="adoption-stat-label2">Adoption Rate</div></div>
            <div><div className="adoption-stat-value2 num text-green">&lt; 7 days</div><div className="adoption-stat-label2">Average Team Onboarding</div></div>
            <div><div className="adoption-stat-value2 num text-teal">3 roles</div><div className="adoption-stat-label2">Admin / Captain / Doer</div></div>
            <div><div className="adoption-stat-value2 num text-lime">24/7</div><div className="adoption-stat-label2">Accessible Anywhere</div></div>
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
          <div className="roi-grid-auto">
            {ROI_STATS.map((s, i) => <ROICard key={i} {...s} />)}
          </div>
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
            <div><div className="testimonial-stat-value num text-accent">80%</div><div className="testimonial-stat-label">Reduced Follow-Ups</div></div>
            <div><div className="testimonial-stat-value num text-green">95%</div><div className="testimonial-stat-label">Accountability Improvement</div></div>
            <div><div className="testimonial-stat-value num text-teal">92%</div><div className="testimonial-stat-label">Process Compliance</div></div>
            <div><div className="testimonial-stat-value num text-lime">100%</div><div className="testimonial-stat-label">Team Visibility</div></div>
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
          <div className="reveal reveal-delay-2 flex gap-[var(--gap-sm)] justify-center flex-wrap">
            <Button as={Link} to="/demo-booking" variant="primary" size="lg" glow>Book Free Demo</Button>
            <Button as={Link} to="/product-overview" variant="secondary" size="lg">Watch Product Tour</Button>
            <Button as={Link} to="/competitive-positioning" variant="secondary" size="lg">Compare vs Alternatives</Button>
          </div>
          <div className="flex gap-10 justify-center flex-wrap mt-10 text-sm opacity-90 reveal reveal-delay-3">
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
