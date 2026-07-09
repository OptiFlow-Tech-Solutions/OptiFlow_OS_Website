import { useState } from 'react';
import { Link } from 'react-router-dom';
import Section from '../Section';
import Button from '../Button';

const FAQS = [
  { q: 'What is OptiFlow OS?', a: 'OptiFlow OS is a Business Operating System built for MSMEs. It replaces WhatsApp, Excel, and manual tracking with one platform that manages tasks, attendance, SOPs, leave, reports, and accountability — giving owners complete visibility from a single dashboard.' },
  { q: 'How quickly can we go live?', a: 'Most businesses go live in 2-4 weeks. The platform is designed for fast adoption — no IT team needed, no complex setup. We provide guided onboarding and training for your team.' },
  { q: 'Can it really replace WhatsApp and Excel?', a: 'Yes. Every task, attendance record, checklist, and approval moves out of WhatsApp groups and spreadsheets into OptiFlow — where it\'s searchable, trackable, and auditable. Our customers report saving 2-4 hours per manager per day.' },
  { q: 'Do you charge per user?', a: 'No. OptiFlow has simple, fixed annual pricing based on team size — not per-user charges. No hidden costs, no surprise invoices. Cloud hosting and product updates are included.' },
  { q: 'Is our business data secure?', a: 'Absolutely. Data is encrypted in transit and at rest, hosted on secure cloud infrastructure in India. Role-based access ensures every user sees only what they should. Full audit logs track every action.' },
];

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default function FAQPreview() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <Section heading="Frequently Asked Questions">
      <div className="faq-list">
        {FAQS.map((faq, i) => (
          <div key={i} className={`faq-item reveal ${openIdx === i ? 'open' : ''}`}>
            <button className="faq-question" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
              <span>{faq.q}</span>
              <span className="faq-icon"><PlusIcon /></span>
            </button>
            <div className="faq-answer">
              <div><p>{faq.a}</p></div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Button as={Link} to="/faq" variant="secondary">View All FAQs</Button>
      </div>
    </Section>
  );
}
