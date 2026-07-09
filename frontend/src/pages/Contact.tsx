import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Section, Container, Button } from '../components';
import ContactForm from '../components/ContactForm';
import ChannelCard from '../components/ChannelCard';
import OfficeInfo from '../components/OfficeInfo';
import ResponsePromiseCard from '../components/ResponsePromiseCard';
import TrustBar from '../components/sections/TrustBar';
import { site } from '../data/site';

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '60px', height: '60px', color: 'var(--accent)' }}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const WhatsappIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const SupportIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const PortalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ZapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const contactFAQs = [
  {
    q: 'How quickly will I get a response?',
    a: 'We respond to sales and general enquiries within one business day. Support queries are typically answered within 4–8 hours during business hours (Mon–Sat, 10 AM – 7 PM IST). Critical issues receive priority escalation.',
  },
  {
    q: 'How do I schedule a demo?',
    a: 'You can book a demo directly through our Book a Demo page, or reach out via phone, email, or WhatsApp. We\'ll work with you to find a time that fits your schedule and tailor the demo to your industry.',
  },
  {
    q: 'Which industries do you support?',
    a: 'OptiFlow OS supports Textile, Manufacturing, Trading, Warehousing, Distribution, Logistics, Service, and more. If your industry isn\'t listed, reach out — our platform is configurable for most operational MSMEs.',
  },
  {
    q: 'How long does implementation take?',
    a: 'Most businesses go live in 2–4 weeks. We provide guided onboarding, team training, and workflow setup. No IT team or technical expertise required.',
  },
  {
    q: 'Can my team be involved in the discussion?',
    a: 'Absolutely. We encourage involving your operations manager, floor supervisor, or team leads in demos and discussions — they often have the most valuable input on day-to-day challenges.',
  },
  {
    q: 'What happens after I submit the contact form?',
    a: 'Your enquiry is sent to our team immediately. You\'ll receive a confirmation email within minutes. A team member will review your details and reach out within one business day via your preferred contact method.',
  },
  {
    q: 'Do you provide post-go-live support?',
    a: 'Yes. Every OptiFlow OS subscription includes dedicated support. We offer onboarding assistance, training sessions, regular check-ins, and priority support for any issues that arise after you go live.',
  },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* S01 Hero */}
      <Section>
        <Container>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--gap-2xl)',
            alignItems: 'center',
          }}>
            <div>
              <div style={{
                display: 'inline-block',
                padding: '6px 18px',
                borderRadius: '100px',
                background: 'var(--accent-soft)',
                color: 'var(--accent)',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}>
                Get In Touch
              </div>
              <h1 style={{ fontSize: 'var(--fs-h1)', fontWeight: 700, lineHeight: 1.15, marginBottom: '12px' }}>
                Let's talk about your operations
              </h1>
              <p className="lead" style={{ marginBottom: '32px', maxWidth: '480px' }}>
                Whether you need a demo, have a sales question, or need support — we're here to help. Reach out and we'll respond within one business day.
              </p>
              <div style={{ display: 'flex', gap: 'var(--gap-sm)', flexWrap: 'wrap' }}>
                <Button
                  as="button"
                  size="lg"
                  glow
                  onClick={() => {
                    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Send Message
                </Button>
                <Button as={Link} to="/demo-booking" variant="secondary" size="lg">
                  Book a Demo
                </Button>
              </div>
            </div>

            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              position: 'relative',
              minHeight: '320px',
            }}>
              <div style={{
                width: '96px', height: '96px',
                borderRadius: '50%',
                background: 'var(--accent-soft)',
                display: 'grid', placeItems: 'center',
              }}>
                <ChatIcon />
              </div>
              <div style={{
                display: 'flex', gap: 'var(--gap-lg)',
                flexWrap: 'wrap', justifyContent: 'center',
              }}>
                {[
                  { value: site.stats.businesses, label: 'Businesses' },
                  { value: '< 24 Hours', label: 'Avg Response' },
                  { value: site.stats.users, label: 'Users' },
                ].map((stat, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent)' }}>{stat.value}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* S02 Contact Form */}
      <Section id="contact-form" heading="Send Us a Message" lead="Fill out the form below and we'll get back to you within one business day." background="surface">
        <Container width="narrow">
          <ContactForm />
        </Container>
      </Section>

      {/* S03 Sales Channels */}
      <Section heading="Sales Inquiries" lead="Ready to explore OptiFlow OS? Choose how you'd like to connect.">
        <Container>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--gap-lg)',
            maxWidth: '900px',
            marginInline: 'auto',
          }}>
            <ChannelCard
              variant="sales"
              icon={<PhoneIcon />}
              title="Call Us"
              detail={site.phone}
              actionLink={`tel:${site.phoneTel}`}
              actionLabel="Call Now"
            />
            <ChannelCard
              variant="sales"
              icon={<MailIcon />}
              title="Email Us"
              detail={site.email}
              actionLink={`mailto:${site.email}`}
              actionLabel="Send Email"
            />
            <ChannelCard
              variant="sales"
              icon={<WhatsappIcon />}
              title="WhatsApp"
              detail={`Chat with us on WhatsApp`}
              actionLink={`https://wa.me/${site.whatsapp}`}
              actionLabel="Start Chat"
            />
          </div>
        </Container>
      </Section>

      {/* S04 Support Channels */}
      <Section heading="Support" lead="Existing customer? We're here to help." background="surface">
        <Container>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--gap-lg)',
            maxWidth: '900px',
            marginInline: 'auto',
          }}>
            <ChannelCard
              variant="support"
              icon={<SupportIcon />}
              title="Support Email"
              detail="support@optiflow.co.in"
              actionLink="mailto:support@optiflow.co.in"
              actionLabel="Email Support"
            />
            <ChannelCard
              variant="support"
              icon={<PortalIcon />}
              title="Helpdesk Portal"
              detail="Log in to submit and track support tickets"
              actionLabel="Open Helpdesk"
              actionLink="#"
            />
            <ChannelCard
              variant="support"
              icon={<BookIcon />}
              title="Knowledge Base"
              detail="Browse guides, tutorials, and FAQs"
              actionLabel="Browse Articles"
              actionLink="#"
            />
          </div>
        </Container>
      </Section>

      {/* S05 Office Info */}
      <Section heading="Our Office">
        <Container>
          <OfficeInfo />
        </Container>
      </Section>

      {/* S06 Response Promises */}
      <Section heading="Response Promises" lead="Here's when you can expect to hear from us." background="surface">
        <Container>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'var(--gap-lg)',
            maxWidth: '1000px',
            marginInline: 'auto',
          }}>
            <ResponsePromiseCard
              icon={<ClockIcon />}
              title="Sales Inquiries"
              description={`We'll get back to you within ${site.response.sales}.`}
            />
            <ResponsePromiseCard
              icon={<ShieldIcon />}
              title="Technical Support"
              description={`Our support team responds within ${site.response.support} during business hours.`}
            />
            <ResponsePromiseCard
              icon={<ZapIcon />}
              title="Critical Issues"
              description={site.response.critical}
            />
            <ResponsePromiseCard
              icon={<ChatIcon />}
              title="Demo Requests"
              description={site.response.demo}
            />
          </div>
        </Container>
      </Section>

      {/* S07 Trust Bar */}
      <TrustBar />

      {/* S08 FAQ */}
      <Section heading="Frequently Asked Questions" background="surface">
        <Container width="narrow">
          <div className="faq-list">
            {contactFAQs.map((faq, i) => (
              <div key={i} className={`faq-item reveal ${openFaq === i ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span className="faq-icon"><PlusIcon /></span>
                </button>
                <div className="faq-answer">
                  <div><p>{faq.a}</p></div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* S09 Final CTA */}
      <Section className="cta-section">
        <div className="reveal">
          <h2>Ready To Transform Your Operations?</h2>
        </div>
        <p className="lead reveal reveal-delay-1">
          Start with a free demo — see how OptiFlow OS brings visibility, accountability, and growth to your business.
        </p>
        <div className="reveal reveal-delay-2" style={{ display: 'flex', gap: 'var(--gap-sm)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
          <Button as={Link} to="/demo-booking" variant="primary" size="lg" glow>Book Free Demo</Button>
          <Button as="button" variant="secondary" size="lg" onClick={() => {
            document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
          }}>Send Message</Button>
        </div>
        <div className="hero-trust reveal reveal-delay-3" style={{ gridTemplateColumns: 'repeat(4,1fr)', margin: '40px auto 0', justifyContent: 'center', maxWidth: 600 }}>
          {['Fast Deployment', 'MSME Focused', 'Dedicated Support', 'Easy Adoption'].map((b) => (
            <span key={b}><CheckIcon /> {b}</span>
          ))}
        </div>
      </Section>
    </>
  );
}
