import { useState } from 'react';

interface FAQFeedbackProps {
  faqItemId: number;
}

export default function FAQFeedback({ faqItemId }: FAQFeedbackProps) {
  const [submitted, setSubmitted] = useState<'yes' | 'no' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleVote = async (wasHelpful: boolean) => {
    setSubmitting(true);
    try {
      await fetch('/api/faq/feedback/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faq_item_id: faqItemId, was_helpful: wasHelpful }),
      });
      setSubmitted(wasHelpful ? 'yes' : 'no');
    } catch {
      // ponytail: fire-and-forget; feedback is non-critical
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted === 'yes') {
    return (
      <div style={containerStyle}>
        <div style={{ fontSize: 13, color: 'var(--green)' }}>Thanks for your positive feedback!</div>
      </div>
    );
  }

  if (submitted === 'no') {
    return (
      <div style={containerStyle}>
        <div style={{ fontSize: 13, color: 'var(--green)' }}>Thanks for letting us know.</div>
        <div style={{ fontSize: 14, color: 'var(--fg)', marginTop: 10, padding: '12px 16px', background: 'var(--bg)', borderRadius: 'var(--radius)' }}>
          What were you looking for?{' '}
          <a href="/os/contact/" style={{ color: 'var(--accent)', fontWeight: 600 }}>Contact us</a>
          {' '}or{' '}
          <a href="/os/demo-booking/" style={{ color: 'var(--accent)', fontWeight: 600 }}>book a demo</a>
          {' '}and we&apos;ll help.
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>Was this helpful?</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => handleVote(true)}
          disabled={submitting}
          style={buttonStyle}
        >
          Yes
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={submitting}
          style={buttonStyle}
        >
          No
        </button>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  marginTop: 12,
  paddingTop: 16,
  borderTop: '1px solid var(--border)',
};

const buttonStyle: React.CSSProperties = {
  padding: '6px 18px',
  border: '1px solid var(--border)',
  borderRadius: 8,
  background: 'var(--surface)',
  color: 'var(--muted)',
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  transition: 'color 0.2s, background 0.2s, border-color 0.2s',
};
