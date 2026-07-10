import FAQAccordion from '../sections/FAQAccordion';
import { PRICING_FAQS } from './pricingData';

export default function PricingFAQ() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <FAQAccordion
        items={PRICING_FAQS.map((faq) => ({ question: faq.q, answer: <p>{faq.a}</p> }))}
      />
    </div>
  );
}
