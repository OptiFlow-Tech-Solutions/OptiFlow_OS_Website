import { useState, type ReactNode, useId } from 'react';

interface FAQItem {
  question: string;
  answer: ReactNode;
}

const ChevronIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function FAQAccordion({
  items,
  className = '',
}: {
  items: FAQItem[];
  className?: string;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div
      className={`faq-list ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--gap-sm)',
      }}
    >
      {items.map((item, i) => {
        const isOpen = openIdx === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-btn-${i}`;

        return (
          <div
            key={i}
            className={`faq-item ${isOpen ? 'open' : ''}`}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
              background: 'var(--surface)',
            }}
          >
            <button
              id={buttonId}
              className="faq-question"
              onClick={() => setOpenIdx(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 24px',
                fontSize: 16,
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                color: 'var(--fg)',
                fontFamily: 'inherit',
                background: 'none',
                border: 0,
                transition: 'color 0.2s',
              }}
            >
              <span>{item.question}</span>
              <span
                style={{
                  color: 'var(--muted)',
                  transition: 'transform 0.3s ease',
                  transform: isOpen ? 'rotate(180deg)' : 'none',
                  flexShrink: 0,
                  marginLeft: 12,
                }}
              >
                <ChevronIcon />
              </span>
            </button>
            <div
              id={panelId}
              className="faq-answer"
              role="region"
              aria-labelledby={buttonId}
              style={{
                padding: '0 24px',
                display: 'grid',
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                transition: 'grid-template-rows 0.35s ease',
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7, paddingBottom: 20 }}>
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <style>{`
        .faq-question:hover { color: var(--teal); }
        .faq-item.open .faq-question svg { color: var(--teal); }
      `}</style>
    </div>
  );
}
