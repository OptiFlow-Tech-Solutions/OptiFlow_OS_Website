import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Section, Container, Button, MetaHead } from '../components';
import TrustBar from '../components/sections/TrustBar';
import ROIDashboard from '../components/pricing/ROIDashboard';
import PricingCard from '../components/pricing/PricingCard';
import ComparisonMatrix from '../components/pricing/ComparisonMatrix';
import ROICalculator from '../components/pricing/ROICalculator';
import ImplementationTimeline from '../components/pricing/ImplementationTimeline';
import PricingFAQ from '../components/pricing/PricingFAQ';
import { PLANS, PHILOSOPHY_CARDS, SECURITY_CARDS, TRUST_BADGES_PRICING } from '../components/pricing/pricingData';
import './Pricing.css';

/* SVG icons for philosophy & security cards */
const iconPaths: Record<string, ReactNode> = {
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  cloud: <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>,
  refresh: <><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  audit: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
};

const iconColors: Record<string, string> = {
  users: 'var(--accent)', calendar: 'var(--teal)', cloud: 'var(--lime)', refresh: 'var(--lime)',
  lock: 'var(--accent)', audit: 'var(--teal)', shield: 'var(--green)',
};

function IconSvg({ name }: { name: string }) {
  return (
    <svg style={{ width: 32, height: 32, margin: '0 auto 12px', color: iconColors[name] || 'var(--accent)', display: 'block' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      {iconPaths[name]}
    </svg>
  );
}

const CheckSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function Pricing() {
  const scrollToPlans = () => {
    document.querySelector('.pricing-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <MetaHead />

      {/* S01: Hero */}
      <section className="pricing-hero">
        <div className="pricing-hero-glow" />
        <Container>
          <div className="pricing-hero-grid">
            <div className="pricing-hero-content">
              <h1>Simple, Predictable Pricing. No Per-User Charges.</h1>
              <p className="lead pricing-hero-lead">
                One annual investment covers your entire team. Cloud hosting, product updates, and support included. No hidden fees — just a predictable path to operational excellence.
              </p>
              <div className="pricing-hero-cta">
                <Button variant="primary" size="lg" onClick={scrollToPlans}>Compare Plans</Button>
                <Button as={Link} to="/demo-booking" variant="secondary" size="lg">Book Demo</Button>
              </div>
              <div className="pricing-hero-badges">
                {TRUST_BADGES_PRICING.map((badge: string) => (
                  <span key={badge} className="pricing-hero-badge">
                    <span style={{ color: 'var(--green)', display: 'flex' }}><CheckSvg /></span>
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="pricing-hero-visual">
              <ROIDashboard />
            </div>
          </div>
        </Container>
      </section>

      {/* S02: Pricing Philosophy */}
      <Section background="surface">
        <div className="pricing-section-header reveal">
          <h2>Built Around Business Value, Not User Counts</h2>
          <p className="lead">Most SaaS tools charge per user — the bigger your team, the higher the bill. OptiFlow was designed differently: one fixed annual investment that covers your entire team so you can scale without surprise costs.</p>
        </div>
        <Container width="narrow">
          <div className="pricing-grid-4 stagger-4 reveal">
            {PHILOSOPHY_CARDS.map((card: typeof PHILOSOPHY_CARDS[number]) => (
              <div key={card.title} className="card pricing-card-centered">
                <IconSvg name={card.icon} />
                <h4 className="pricing-card-title">{card.title}</h4>
                <p className="pricing-card-desc">{card.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Trust Bar */}
      <TrustBar />

      {/* S03+S04: Pricing Plans */}
      <Section eyebrow="PRICING PLANS" heading="Choose the plan built for your scale" lead="Annual pricing. One-time implementation. Everything included.">
        <div className="pricing-plan-grid stagger-3 reveal">
          {PLANS.map((plan: typeof PLANS[number]) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              teamRange={plan.teamRange}
              annual={plan.annual}
              setupFee={plan.setupFee}
              businessValue={plan.businessValue}
              coreModules={plan.features}
              featured={plan.featured}
              href="/demo-booking"
            />
          ))}
        </div>
      </Section>

      {/* S05: Comparison Matrix */}
      <Section heading="Compare Plans Side By Side" lead="Find the plan that fits your business scale and needs." background="dark">
        <ComparisonMatrix />
      </Section>

      {/* S06: ROI Calculator */}
      <Section heading="See How Much You Save With OptiFlow" lead="Adjust team size and typical per-user SaaS cost to compare traditional pricing against OptiFlow's fixed annual plans.">
        <ROICalculator />
      </Section>

      {/* S07: Implementation */}
      <Section heading="Implementation & Onboarding" lead="A structured rollout designed for MSMEs — discovery to go-live in weeks, not months." background="surface">
        <ImplementationTimeline />
      </Section>

      {/* S08: Security */}
      <Section heading="Built-In Security. Included With Every Plan." lead="Role-based access, audit logs, secure infrastructure — the same security enterprises demand, designed for MSME simplicity." background="dark">
        <Container width="narrow">
          <div className="pricing-grid-3 stagger-3 reveal">
            {SECURITY_CARDS.map((card: typeof SECURITY_CARDS[number]) => (
              <div key={card.title} className="card pricing-card-centered">
                <IconSvg name={card.icon} />
                <h3 className="pricing-card-title-lg">{card.title}</h3>
                <p className="pricing-card-desc">{card.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* S09: FAQ */}
      <Section heading="Frequently Asked Questions">
        <PricingFAQ />
      </Section>

      {/* S10: CTA */}
      <Section className="pricing-cta" background="dark">
        <div className="pricing-cta-inner reveal">
          <h2>Build a Structured, Accountable, Scalable Operation</h2>
          <p className="lead pricing-cta-lead">
            See how OptiFlow can help your business improve visibility, accountability, execution, and growth — starting at ₹49,000/year.
          </p>
          <div className="pricing-cta-actions">
            <Button as={Link} to="/demo-booking" variant="primary" size="lg" glow>Book Free Demo</Button>
            <Button as={Link} to="/contact" variant="secondary" size="lg">Talk To An Expert</Button>
          </div>
          <div className="pricing-cta-badges">
            {['No Hidden Costs', 'Fixed Annual Pricing', 'Cloud Hosting Included', 'MSME Focused'].map((b) => (
              <span key={b} className="pricing-cta-badge">
                <CheckSvg />
                {b}
              </span>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
