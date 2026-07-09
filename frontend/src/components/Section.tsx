import type { ReactNode, HTMLAttributes } from 'react';
import Container from './Container';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  heading?: string;
  lead?: string;
  background?: 'default' | 'surface' | 'dark';
  width?: 'default' | 'narrow';
  eyebrow?: string;
  children: ReactNode;
}

export default function Section({
  heading,
  lead,
  background = 'default',
  width = 'default',
  eyebrow,
  className = '',
  children,
  ...props
}: SectionProps) {
  const isDark = background === 'dark';

  let bgStyle: React.CSSProperties = {};
  let sectionClass = className;

  if (background === 'surface') {
    bgStyle = { background: 'var(--surface)' };
  }
  if (isDark) {
    sectionClass = `${className} section-dark`.trim();
  }

  return (
    <section
      className={sectionClass}
      style={{
        paddingBlock: 'clamp(56px, 8vw, var(--gap-2xl))',
        position: 'relative',
        scrollMarginTop: 'var(--nav-h)',
        ...bgStyle,
      }}
      {...props}
    >
      <Container width={isDark ? 'default' : width}>
        {(heading || lead || eyebrow) && (
          <div className="section-header">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {heading && <h2>{heading}</h2>}
            {lead && <p className="lead">{lead}</p>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
