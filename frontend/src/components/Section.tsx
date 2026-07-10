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
  const isSurface = background === 'surface';

  const bgClass = isDark ? 'section-dark' : isSurface ? 'bg-surface' : '';
  const sectionClass = `section ${bgClass} ${className}`.trim();

  return (
    <section className={sectionClass} {...props}>
      {isDark && <div className="noise-overlay" />}
      <Container width={isDark ? 'default' : width}>
        {(heading || lead || eyebrow) && (
          <div className="section-header reveal">
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
