import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import { Section, Card, Container, Button } from '../components';
import './ProblemSolutions.css';

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
                <p className="text-[15px] text-muted leading-relaxed">{c.desc}</p>
                <span className="impact-tag2">{c.impact}</span>
                <p className="roi-line2">{c.roi}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* 05: WHATSAPP + EXCEL */}
        <Section heading="WhatsApp Is Great for Chatting. Not for Running a Business." lead="These are the two tools most MSMEs use to manage operations — and exactly why growth breaks.">
          <div className="grid grid-cols-2 gap-[var(--gap-xl)] items-start">
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
              <h3 className="mb-4">The Real Cost of Chat-Based Operations</h3>
              <Card className="mb-3">
                <h3 className="text-base">Tasks Get Lost</h3>
                <p className="text-sm text-muted">Messages scroll. Priorities vanish. Follow-ups consume 60% of the owner's day.</p>
                <span className="impact-tag2">Lost: 12-20 working hours/month</span>
              </Card>
              <Card className="mb-3">
                <h3 className="text-base">No Audit Trail</h3>
                <p className="text-sm text-muted">When something goes wrong, there's no record. No proof. No accountability.</p>
                <span className="impact-tag2">Compliance Gap</span>
              </Card>
              <Card>
                <h3 className="text-base">Zero Visibility</h3>
                <p className="text-sm text-muted">Excel files sit on laptops. WhatsApp messages are ephemeral. You can't see the big picture.</p>
                <span className="impact-tag2">Blind Spot</span>
                <p className="roi-line2">Fix this: move from 20 chat groups to one operating system</p>
              </Card>
            </div>
          </div>
          <div className="micro-cta2 reveal">
            <p className="text-[15px] text-muted mb-3">Ready to move from chat chaos to structured operations?</p>
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
          <div className="micro-cta2 reveal mt-8">
            <p className="text-base text-muted mb-3.5 max-w-[480px] mx-auto">Stop bleeding ₹5—20L every year. See how OptiFlow plugs every leak.</p>
            <Button as={Link} to="/demo-booking" variant="primary" size="lg">Get Your Free Operations Audit</Button>
            <span className="ml-3">
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
          <div className="flex gap-[var(--gap-sm)] justify-center flex-wrap">
            <Button as={Link} to="/demo-booking" variant="primary" size="lg">Book Free Demo</Button>
            <Button as={Link} to="/product-overview" variant="secondary" size="lg">Watch Product Tour</Button>
          </div>
        </Section>

      </main>
    </>
  );
}
