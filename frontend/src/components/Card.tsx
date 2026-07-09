import { type ElementType, type ReactNode, type HTMLAttributes } from 'react';

type CardPadding = 'default' | 'sm' | 'lg';

interface CardProps extends HTMLAttributes<HTMLElement> {
  hover?: boolean;
  padding?: CardPadding;
  as?: ElementType;
  children: ReactNode;
}

const paddings: Record<CardPadding, string> = {
  sm: '12px',
  default: 'var(--gap-md)',
  lg: 'var(--gap-lg)',
};

export default function Card({
  hover = false,
  padding = 'default',
  as: Tag = 'div',
  className = '',
  children,
  style,
  ...props
}: CardProps) {
  const baseClass = hover ? `card-base card-hover ${className}` : `card-base ${className}`;

  return (
    <>
      <Tag
        className={baseClass.trim()}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: paddings[padding],
          boxShadow: 'var(--shadow-card)',
          transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s cubic-bezier(0.22,1,0.36,1), border-color 0.35s',
          ...style,
        }}
        {...props}
      >
        {children}
      </Tag>
      {hover && (
        <style>{`
          .card-hover:hover {
            transform: translateY(-4px) scale(1.01);
            box-shadow: var(--shadow-card-hover);
            border-color: color-mix(in oklch, var(--teal) 30%, var(--border));
          }
          [data-theme="dark"] .card-hover:hover {
            box-shadow: var(--shadow-card-hover), 0 0 24px rgba(39,141,159,.12);
          }
        `}</style>
      )}
    </>
  );
}
