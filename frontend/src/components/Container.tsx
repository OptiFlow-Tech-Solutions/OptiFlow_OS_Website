import type { ElementType, ReactNode, HTMLAttributes } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  width?: 'default' | 'narrow';
  as?: ElementType;
  children: ReactNode;
}

const widths: Record<string, string> = {
  default: 'var(--container)',
  narrow: '800px',
};

export default function Container({
  width = 'default',
  as: Tag = 'div',
  className = '',
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={className}
      style={{
        maxWidth: widths[width],
        marginInline: 'auto',
        paddingInline: 'var(--gutter)',
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
