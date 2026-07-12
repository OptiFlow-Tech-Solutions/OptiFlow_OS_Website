import { Link } from 'react-router-dom';
import Section from '../Section';
import Button from '../Button';
import FAQAccordion from './FAQAccordion';

const FAQS = [
  { q: 'What is OptiFlow OS?', a: 'OptiFlow OS is a Business Operating System built for MSMEs. It replaces WhatsApp, Excel, and manual tracking with one platform that manages tasks, attendance, SOPs, leave, reports, and accountability — giving owners complete visibility from a single dashboard.' },
  { q: 'How quickly can we go live?', a: 'Most businesses go live in 2-4 weeks. The platform is designed for fast adoption — no IT team needed, no complex setup. We provide guided onboarding and training for your team.' },
  { q: 'Can it really replace WhatsApp and Excel?', a: 'Yes. Every task, attendance record, checklist, and approval moves out of WhatsApp groups and spreadsheets into OptiFlow — where it\'s searchable, trackable, and auditable. Our customers report saving 2-4 hours per manager per day.' },
  { q: 'Do you charge per user?', a: 'No. OptiFlow has simple, fixed annual pricing based on team size — not per-user charges. No hidden costs, no surprise invoices. Cloud hosting and product updates are included.' },
  { q: 'Is our business data secure?', a: 'Absolutely. Data is encrypted in transit and at rest, hosted on secure cloud infrastructure in India. Role-based access ensures every user sees only what they should. Full audit logs track every action.' },
];

export default function FAQPreview() {
  return (
    <Section heading="Frequently Asked Questions">
      <FAQAccordion
        items={FAQS.map((faq) => ({ question: faq.q, answer: <p>{faq.a}</p> }))}
      />
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Button as={Link} to="/faq" variant="secondary">View All FAQs</Button>
      </div>
    </Section>
  );
}
