import { type ElementType, type ReactNode, type HTMLAttributes } from 'react';

type CardPadding = 'default' | 'sm' | 'lg';

interface CardProps extends HTMLAttributes<HTMLElement> {
  hover?: boolean;
  padding?: CardPadding;
  as?: ElementType;
  children: ReactNode;
}

export default function Card({
  hover = false,
  padding = 'default',
  as: Tag = 'div',
  className = '',
  children,
  ...props
}: CardProps) {
  const padClass = padding === 'sm' ? 'card-pad-sm' : padding === 'lg' ? 'card-pad-lg' : '';
  const baseClass = hover ? `card card-hover ${padClass} ${className}` : `card ${padClass} ${className}`;

  return (
    <Tag className={baseClass.trim()} {...props}>
      {children}
    </Tag>
  );
}
