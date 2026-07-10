import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Section, Container, Button,
  BookingForm, CalendarWidget, DashboardMockup,
} from '../components';
import type { BookingFormHandle } from '../components/BookingForm';
import './DemoBooking.css';

const WHY_BOOK_CARDS = [
  {
    icon: 'monitor',
    iconColor: 'blue',
    title: 'See The Platform Live',
    body: 'Watch a real product walkthrough — not a pre-recorded video. See exactly how it works.',
  },
  {
    icon: 'settings',
    iconColor: 'teal',
    title: 'Get MSME-Specific Recommendations',
    body: 'See exactly how OptiFlow applies to your industry — textile, manufacturing, trading, and more.',
  },
  {
    icon: 'chart',
    iconColor: 'green',
    title: 'Evaluate ROI Opportunities',
    body: 'Understand the real cost savings, productivity gains, and operational improvements for your business.',
  },
  {
    icon: 'doc',
    iconColor: 'blue',
    title: 'Ask Questions Directly',
    body: 'Discuss your specific operational challenges with a product expert. Get answers, not a script.',
  },
  {
    icon: 'wallet',
    iconColor: 'teal',
    title: 'Explore Process Improvements',
    body: 'Identify the operational gaps in your current workflows and see how to close them.',
  },
  {
    icon: 'check',
    iconColor: 'green',
    title: 'Walk Away With A Plan',
    body: 'Leave the call with a clear implementation roadmap tailored to your team size and industry.',
  },
];

const TIMELINE_STEPS = [
  { step: 1, title: 'Business Discovery', body: 'We learn about your team size, industry, current workflows, and key operational challenges.' },
  { step: 2, title: 'Platform Walkthrough', body: 'Guided tour of the core modules — Tasks, Attendance, SOPs, Reports, and more.' },
  { step: 3, title: 'Use Case Demonstration', body: 'See real workflows mapped to your industry — production checklists, dispatch tracking, leave management.' },
  { step: 4, title: 'Workflow Mapping', body: "We map your existing processes to OptiFlow's system. You'll see how your daily work flows through the platform." },
  { step: 5, title: 'Questions & Answers', body: 'Open discussion. Ask about pricing, implementation, team training, mobile access — whatever matters to you.' },
  { step: 6, title: 'Implementation Roadmap', body: 'Walk away with a clear timeline: setup, team onboarding, go-live date, and success milestones.' },
];

const WALK_AWAY_CARDS = [
  { icon: 'search', iconColor: 'blue', title: 'Operational Gap Analysis', body: 'Identify exactly where your current operations break down — and what to fix first for maximum impact.' },
  { icon: 'clipboard', iconColor: 'teal', title: 'Visibility Framework', body: 'A structured approach to getting real-time visibility across tasks, teams, and departments.' },
  { icon: 'chart', iconColor: 'green', title: 'Implementation Roadmap', body: 'A clear step-by-step plan: Discovery → Setup → Training → Go Live — tailored to your team size and timeline.' },
  { icon: 'layers', iconColor: 'blue', title: 'Platform Evaluation Guide', body: 'A comparison framework to evaluate OptiFlow against your current tools — WhatsApp, Excel, or other software.' },
  { icon: 'users', iconColor: 'teal', title: 'Accountability Framework', body: 'How to move from "I thought he did it" to complete task ownership across your entire team.' },
  { icon: 'trending', iconColor: 'green', title: 'Scaling Recommendations', body: 'Practical advice on when to add modules, hire with systems, and scale processes without breaking them.' },
];

const FAQ_ITEMS = [
  { q: 'Is the demo free?', a: 'Yes — completely free. No payment details, no commitment, no pressure. It\'s a conversation about your operations and how OptiFlow can help.' },
  { q: 'How long does the demo take?', a: '30 to 45 minutes. We respect your time — the session is structured and focused. You\'ll walk away with a clear understanding and a roadmap.' },
  { q: 'Do I need technical knowledge?', a: 'Not at all. OptiFlow is built for business owners and frontline teams — if you can use WhatsApp, you can use OptiFlow. We handle the technical side.' },
  { q: 'Can the demo be customized for my industry?', a: 'Absolutely. The demo is tailored to your sector — whether you run a textile unit, a trading business, a warehouse, or a service operation. We show what matters to you.' },
  { q: 'Will I see real product screens?', a: 'Yes. This is a live walkthrough of the actual OptiFlow platform — not slides, not mockups. You\'ll see the real dashboard, task center, attendance module, and more.' },
  { q: 'Can my team join the call?', a: 'Yes — invite your operations manager, HR head, or any key team member. Decision-makers and day-to-day operators are both welcome.' },
  { q: 'How quickly can we get started after the demo?', a: 'Most businesses go live within 4 to 7 days. We handle the setup, import your data, train your team, and get you operational — fast.' },
  { q: 'What happens after the demo?', a: 'No pressure. You\'ll receive a summary of what we discussed, a tailored implementation plan, and pricing options. You decide if and when to move forward.' },
];

const TRUST_METRICS = [
  { value: '500', label: 'Businesses Served' },
  { value: '10000+', label: 'Active Users' },
  { value: '500000+', label: 'Tasks Managed' },
  { value: '1200', label: 'Departments Managed' },
];

const iconSvg = (name: string) => {
  const map: Record<string, React.ReactNode> = {
    monitor: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: '22px', height: '22px' }}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>,
    settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: '22px', height: '22px' }}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>,
    chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: '22px', height: '22px' }}><path d="M12 20V10M18 20V4M6 20v-4" /></svg>,
    doc: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: '22px', height: '22px' }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
    wallet: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: '22px', height: '22px' }}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4" /></svg>,
    check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: '22px', height: '22px' }}><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
    search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: '22px', height: '22px' }}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>,
    clipboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: '22px', height: '22px' }}><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>,
    layers: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: '22px', height: '22px' }}><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>,
    users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: '22px', height: '22px' }}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
    trending: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: '22px', height: '22px' }}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
  };
  return map[name] || null;
};

const iconColorMap: Record<string, { bg: string; color: string }> = {
  blue: { bg: 'var(--accent-soft)', color: 'var(--accent)' },
  teal: { bg: 'var(--teal-soft)', color: 'var(--teal)' },
  green: { bg: 'var(--green-soft)', color: 'var(--green)' },
};

function BenefitIcon({ name, color }: { name: string; color: 'blue' | 'teal' | 'green' }) {
  const c = iconColorMap[color];
  return (
    <div
      className="w-12 h-12 rounded-[var(--radius)] grid place-items-center shrink-0"
      style={{ background: c.bg, color: c.color }}
    >
      {iconSvg(name)}
    </div>
  );
}

function FAQItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  return (
    <details className="faq-item border-b border-border" open={defaultOpen}>
      <summary className="flex justify-between items-center py-5 cursor-pointer text-[17px] font-semibold text-fg">
        {q}
        <svg className="faq-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ flexShrink: 0, color: 'var(--muted)', transition: 'transform 0.3s ease' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </summary>
      <p className="text-muted text-[15px] leading-relaxed pb-5">{a}</p>
    </details>
  );
}

export default function DemoBooking() {
  const formRef = useRef<BookingFormHandle>(null);

  const handleDateSlotChange = (date?: string, slot?: string) => {
    formRef.current?.setDateAndSlot(date, slot);
  };

  const handleCalendarConfirm = () => {
    formRef.current?.submit();
  };

  return (
    <>
      {/* S01: HERO */}
      <section className="hero-demo">
        <div className="container">
          <div className="hero-grid-demo" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
            <div>
              <div className="hero-badge">
                <span className="dot" />
                LIVE PRODUCT DEMONSTRATION
              </div>
              <h1>See How OptiFlow Can Transform Your Operations.</h1>
              <p className="lead mb-8">
                Book a personalized demo and discover how OptiFlow helps MSMEs improve accountability, visibility, execution, and growth — built specifically for businesses like yours.
              </p>
              <div className="hero-cta-row" style={{ display: 'flex', gap: 'var(--gap-sm)', flexWrap: 'wrap', marginBottom: '32px' }}>
                <Button as={Link} to="#book" size="lg" glow>Book Your Demo</Button>
                <Button as={Link} to="/os/product-overview" variant="secondary" size="lg">Watch Product Tour</Button>
              </div>
              <div className="trust-row">
                <span><span className="chk">&#10003;</span> Personalized Demo</span>
                <span><span className="chk">&#10003;</span> MSME Focused</span>
                <span><span className="chk">&#10003;</span> No Technical Setup</span>
                <span><span className="chk">&#10003;</span> Business Consultation Included</span>
              </div>
            </div>
            <div className="max-w-[500px] mx-auto">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* S02: WHY BOOK A DEMO */}
      <Section heading="Why Business Owners Book A Demo" lead="A 30-minute session that can fundamentally change how you think about business operations.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--gap-lg)' }}>
          {WHY_BOOK_CARDS.map((card, i) => (
            <div key={i} className="bg-surface border border-border rounded-[var(--radius-lg)] p-[var(--gap-md)] flex gap-4 items-start" style={{ boxShadow: 'var(--shadow-card)' }}>
              <BenefitIcon name={card.icon} color={card.iconColor as 'blue' | 'teal' | 'green'} />
              <div>
                <h3 className="mb-1">{card.title}</h3>
                <p className="text-muted text-sm">{card.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* TRUST BAR */}
      <div className="bg-surface border-y border-border py-10 text-center">
        <Container>
          <div className="trust-metrics-row" style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
            {TRUST_METRICS.map((m) => (
              <div key={m.label}>
                <div className="trust-metric-val">{m.value}</div>
                <div className="trust-metric-label">{m.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* S03: WHAT YOU'LL EXPERIENCE */}
      <Section
        heading="What You'll Experience During The Demo"
        lead="A structured walkthrough designed to answer your questions and show how OptiFlow fits your business."
      >
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-[6px] px-[18px] py-[10px] rounded-full bg-accent-soft text-accent font-mono text-[13px] font-semibold">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.7 }}>
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            Duration: 30–45 Minutes
          </span>
        </div>

        <div className="relative max-w-[900px] mx-auto">
          <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-gradient-to-b from-accent to-teal" />
          {TIMELINE_STEPS.map((step, i) => (
            <div key={i} className="tl-step">
              <div className="tl-num">{step.step}</div>
              <div>
                <h3 className="font-display tracking-tight">{step.title}</h3>
                <p className="text-muted text-[15px]">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* S04: WHAT YOU WALK AWAY WITH */}
      <Section background="surface" heading="What You Will Walk Away With" lead="More than a product tour — a complete operational assessment for your business.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--gap-lg)' }}>
          {WALK_AWAY_CARDS.map((card, i) => (
            <div key={i} className="bg-bg border border-border rounded-[var(--radius-lg)] p-[var(--gap-md)]" style={{ boxShadow: 'var(--shadow-card)' }}>
              <BenefitIcon name={card.icon} color={card.iconColor as 'blue' | 'teal' | 'green'} />
              <h3 className="mt-3 mb-1.5">{card.title}</h3>
              <p className="text-muted text-sm">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* S05: BOOKING FORM */}
      <div id="book">
        <Section heading="Schedule Your Personalized Demo" lead="Tell us a little about your business. We'll tailor the demo to your industry and operational needs." width="narrow">
          <div className="limited-banner">
            <span className="blink" />
            Limited demo slots available this week. Book now to secure your preferred time.
          </div>
          <BookingForm ref={formRef} />
        </Section>
      </div>

      {/* S06: CALENDAR */}
      <Section heading="Choose A Time That Works For You" lead="Select a date and a time slot. All times shown in Indian Standard Time (IST)." width="narrow">
        <CalendarWidget
          onDateSlotChange={handleDateSlotChange}
          onConfirm={handleCalendarConfirm}
        />
      </Section>

      {/* S07: FAQ */}
      <Section heading="Frequently Asked Questions">
        <div className="max-w-[800px] mx-auto">
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} defaultOpen={i === 0} />
          ))}
        </div>
      </Section>

      {/* S08: FINAL CTA */}
      <section className="cta-section-page">
        <div className="cta-inner container">
          <h2 className="text-white">Ready To See OptiFlow In Action?</h2>
          <p className="lead text-muted max-w-[700px] mx-auto my-4">
            Book a personalized demo and discover how OptiFlow can help your business become more accountable, visible, efficient, and scalable.
          </p>
          <div className="cta-ctas">
            <Button as={Link} to="#book" size="lg" glow>Book Free Demo</Button>
            <Button as={Link} to="/os/contact" variant="secondary" size="lg">Talk To A Consultant</Button>
          </div>
          <div className="cta-trust">
            <span>&#10003; MSME Focused</span>
            <span>&#10003; Personalized Consultation</span>
            <span>&#10003; Fast Implementation</span>
            <span>&#10003; Dedicated Support</span>
          </div>
        </div>
      </section>
    </>
  );
}
