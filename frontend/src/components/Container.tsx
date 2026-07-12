import type { ElementType, ReactNode, HTMLAttributes } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  width?: 'default' | 'narrow';
  as?: ElementType;
  children: ReactNode;
}

export default function Container({
  width = 'default',
  as: Tag = 'div',
  className = '',
  children,
  ...props
}: ContainerProps) {
  const widthClass = width === 'narrow' ? 'container-narrow' : '';
  return (
    <Tag className={`container ${widthClass} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
