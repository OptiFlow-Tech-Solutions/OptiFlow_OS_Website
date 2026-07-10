import { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Section, Container, FAQAccordion } from '../components';
import FAQSearch from '../components/faq/FAQSearch';
import FAQCategoryTabs from '../components/faq/FAQCategoryTabs';
import HelpCard from '../components/faq/HelpCard';
import EscalationCard from '../components/faq/EscalationCard';
import TroubleshootingWizard from '../components/faq/TroubleshootingWizard';
import FAQFeedback from '../components/faq/FAQFeedback';
import { FAQ_ITEMS, FAQ_CATEGORIES } from '../data/faq';
import { site } from '../data/site';

const icons = {
  video: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  ),
  sop: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  ),
  setup: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  troubleshoot: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  demo: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  email: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  whatsapp: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  ),
  phone: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  ),
  product: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  pricing: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  ),
  security: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  implementation: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
};

const categoryIcons: Record<string, React.ReactNode> = {
  product: icons.product,
  pricing: icons.pricing,
  security: icons.security,
  implementation: icons.implementation,
};

const microCTAs: Record<string, { text: string; link: string; label: string; primary?: boolean }> = {
  product: {
    text: 'Ready to see the product in action? Book a personalised demo and we\'ll walk you through every module relevant to your business.',
    link: '/demo-booking/',
    label: 'Book Demo',
    primary: true,
  },
  pricing: {
    text: 'Want to see pricing side-by-side? Visit our pricing page to compare plans and calculate your estimated savings.',
    link: '/pricing/',
    label: 'View Pricing',
  },
  security: {
    text: 'Have specific security requirements? Talk to our team about your compliance needs — we\'ll walk you through our security architecture.',
    link: '/contact/',
    label: 'Contact Security Team',
  },
  implementation: {
    text: 'Ready to start? Book a demo and we\'ll walk you through the implementation process — from discovery to go-live.',
    link: '/demo-booking/',
    label: 'Book Demo',
    primary: true,
  },
};

export default function FAQ() {
  const [activeTab, setActiveTab] = useState('all');
  const accordionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    FAQ_CATEGORIES.forEach((cat) => {
      counts[cat.slug] = FAQ_ITEMS.filter((item) => item.categorySlug === cat.slug).length;
    });
    return counts;
  }, []);

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return FAQ_ITEMS;
    return FAQ_ITEMS.filter((item) => item.categorySlug === activeTab);
  }, [activeTab]);

  const itemsByCategory = useMemo(() => {
    const map: Record<string, typeof FAQ_ITEMS> = {};
    FAQ_CATEGORIES.forEach((cat) => {
      map[cat.slug] = filteredItems.filter((item) => item.categorySlug === cat.slug);
    });
    return map;
  }, [filteredItems]);

  const handleSearchResult = (faqId: number) => {
    const item = FAQ_ITEMS.find((f) => f.id === faqId);
    if (item) {
      setActiveTab(item.categorySlug);
      setTimeout(() => {
        const el = accordionRefs.current[faqId];
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const visibleCategories = FAQ_CATEGORIES.filter((cat) => itemsByCategory[cat.slug].length > 0);

  return (
    <main id="content">
      {/* Hero */}
      <Section>
        <Container width="narrow" style={{ textAlign: 'center' }}>
          <p className="eyebrow" style={{ textAlign: 'center' }}>Frequently Asked Questions</p>
          <h1>Questions About OptiFlow? We&apos;ve Got Answers.</h1>
          <p className="lead" style={{ marginBottom: 32 }}>
            Everything you need to know about OptiFlow OS — product, pricing, security, implementation, support, and business impact. Your objections, answered.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
            {['MSME Focused', 'Transparent Pricing', 'Dedicated Support', 'Fast Implementation'].map((badge) => (
              <span key={badge} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--muted)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3 3 7-7" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {badge}
              </span>
            ))}
          </div>

          <FAQSearch onResultClick={handleSearchResult} />

          <FAQCategoryTabs
            active={activeTab}
            activeCount={FAQ_ITEMS.length}
            categoryCounts={categoryCounts}
            onChange={setActiveTab}
          />
        </Container>
      </Section>

      {/* Self-Service Toolbar */}
      <Section>
        <Container>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--gap-md)',
            }}
          >
            <HelpCard icon={icons.video} title="Video Tutorials" description="Watch step-by-step videos on task management, attendance, checklists, and reporting." ctaLabel="Browse Tutorials" ctaHref="/features/" />
            <HelpCard icon={icons.sop} title="SOP Library" description="Access standard operating procedures, checklists, and workflow templates." ctaLabel="Explore Library" ctaHref="/product-overview/" />
            <HelpCard icon={icons.setup} title="Guided Setup" description="Follow our structured setup guide to configure departments, roles, and workflows." ctaLabel="Start Setup" ctaHref="/demo-booking/" />
            <HelpCard icon={icons.troubleshoot} title="Troubleshooting" description="Diagnose common issues with our guided selector — find your problem and fix it fast." ctaLabel="Diagnose Now" ctaHref="#troubleshoot" />
          </div>
        </Container>
      </Section>

      {/* FAQ Categories */}
      <Section>
        <Container>
          {visibleCategories.map((category) => (
            <div key={category.slug} style={{ marginBottom: 'var(--gap-xl)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 24,
                  paddingBottom: 16,
                  borderBottom: '2px solid var(--border)',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    display: 'grid',
                    placeItems: 'center',
                    background: 'var(--accent-soft)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--accent)',
                    flexShrink: 0,
                  }}
                >
                  {categoryIcons[category.slug]}
                </div>
                <h2 style={{ fontSize: 24 }}>{category.name} Questions</h2>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--muted)', marginLeft: 'auto' }}>
                  {itemsByCategory[category.slug].length} questions
                </span>
              </div>

              <FAQAccordion
                items={itemsByCategory[category.slug].map((item) => ({
                  question: item.question,
                  answer: (
                    <div>
                      <p>{item.answer}</p>
                      <FAQFeedback faqItemId={item.id} />
                    </div>
                  ),
                }))}
              />

              {microCTAs[category.slug] && activeTab !== 'all' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '20px 28px',
                    background: 'var(--bg)',
                    borderRadius: 'var(--radius-lg)',
                    marginTop: 32,
                    flexWrap: 'wrap',
                  }}
                >
                  <p style={{ fontSize: 14, color: 'var(--muted)', flex: 1 }}>
                    <strong>{microCTAs[category.slug].text.split('.')[0]}.</strong>
                    {' '}{microCTAs[category.slug].text.split('.').slice(1).join('.')}
                  </p>
                  <Link
                    to={microCTAs[category.slug].link}
                    style={{
                      display: 'inline-block',
                      padding: '10px 24px',
                      background: microCTAs[category.slug].primary ? 'var(--accent)' : 'transparent',
                      color: microCTAs[category.slug].primary ? 'white' : 'var(--accent)',
                      border: microCTAs[category.slug].primary ? 'none' : '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: 'none',
                      flexShrink: 0,
                    }}
                  >
                    {microCTAs[category.slug].label}
                  </Link>
                </div>
              )}
            </div>
          ))}

          {/* Micro-CTAs when "all" tab is active */}
          {activeTab === 'all' && visibleCategories.map((category) => {
            const cta = microCTAs[category.slug];
            if (!cta) return null;
            return (
              <div
                key={`cta-${category.slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '20px 28px',
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius-lg)',
                  marginTop: 24,
                  marginBottom: 24,
                  flexWrap: 'wrap',
                }}
              >
                <p style={{ fontSize: 14, color: 'var(--muted)', flex: 1 }}>
                  <strong>{cta.text.split('.')[0]}.</strong>
                  {' '}{cta.text.split('.').slice(1).join('.')}
                </p>
                <Link
                  to={cta.link}
                  style={{
                    display: 'inline-block',
                    padding: '10px 24px',
                    background: cta.primary ? 'var(--accent)' : 'transparent',
                    color: cta.primary ? 'white' : 'var(--accent)',
                    border: cta.primary ? 'none' : '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: 'none',
                    flexShrink: 0,
                  }}
                >
                  {cta.label}
                </Link>
              </div>
            );
          })}
        </Container>
      </Section>

      {/* Troubleshooting Wizard */}
      <Section id="troubleshoot" heading="What Issue Are You Facing?" lead="Tell us what's wrong, and we'll guide you to the right solution." eyebrow="Self-Diagnostic Tool">
        <Container>
          <TroubleshootingWizard />
        </Container>
      </Section>

      {/* Escalation */}
      <Section heading="Still Need Help?" lead="If you couldn't find what you're looking for, our team is ready to help through any channel you prefer." eyebrow="We're Here for You">
        <Container>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'var(--gap-md)',
            }}
          >
            <EscalationCard icon={icons.demo} title="Book a Demo" description="See OptiFlow in action with a personalised walkthrough." ctaLabel="Book Demo" ctaHref="/demo-booking/" />
            <EscalationCard icon={icons.email} title="Email Us" description="Drop us a message and we'll respond within 4-8 business hours." ctaLabel="Contact Form" ctaHref="/contact/" />
            <EscalationCard icon={icons.whatsapp} title="WhatsApp" description="Quick questions? Message us on WhatsApp for a fast response." ctaLabel="Chat Now" ctaHref={`https://wa.me/${site.whatsapp}`} isExternal />
            <EscalationCard icon={icons.phone} title="Call Us" description={`Talk to our team directly during business hours at ${site.phone}.`} ctaLabel={`Call ${site.phone}`} ctaHref={`tel:${site.phoneTel}`} isExternal />
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section background="surface">
        <Container width="narrow" style={{ textAlign: 'center' }}>
          <h2>Still Have Questions? Let&apos;s Talk About Your Business.</h2>
          <p className="lead" style={{ marginBottom: 32 }}>
            Book a personalised demo and see how OptiFlow can improve accountability, visibility, execution, and operational control for your specific operation.
          </p>
          <div style={{ display: 'flex', gap: 'var(--gap-sm)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/demo-booking/"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: 'var(--accent)',
                color: 'white',
                borderRadius: 'var(--radius)',
                fontSize: 16,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'box-shadow 0.2s',
              }}
            >
              Book Free Demo
            </Link>
            <Link
              to="/contact/"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: 'transparent',
                color: 'var(--accent)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: 16,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Contact Our Team
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginTop: 24 }}>
            {['MSME Focused', 'Fast Response', 'Transparent Pricing', 'Dedicated Support'].map((item) => (
              <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--muted)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3 3 7-7" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
