import { type ElementType, type ReactNode, type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'default' | 'lg';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  glow?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    as?: 'button';
  };

type ButtonAsLink = ButtonBaseProps & {
  as: ElementType;
  to?: string;
  href?: string;
  [key: string]: unknown;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseClasses =
  'inline-flex items-center gap-2 font-semibold whitespace-nowrap relative overflow-hidden cursor-pointer border-0 font-[inherit] transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)]';

const sizeClasses: Record<ButtonSize, string> = {
  default: 'px-6 py-3 text-[15px] rounded-[var(--radius)]',
  lg: 'px-8 py-4 text-[16px] rounded-[var(--radius-lg)]',
};

function variantStyle(variant: ButtonVariant): React.CSSProperties {
  switch (variant) {
    case 'primary':
      return {
        background:
          'linear-gradient(135deg, oklch(33% 0.09 255) 0%, oklch(42% 0.09 238) 50%, oklch(33% 0.09 255) 100%)',
        backgroundSize: '200% 200%',
        color: 'white',
        boxShadow: 'var(--shadow-button), 0 0 0 1px rgb(27 77 129 / 25%)',
      };
    case 'secondary':
      return {
        background: 'rgba(255,255,255,.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        color: 'var(--fg)',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 3px rgba(15,23,42,.04)',
      };
    case 'outline':
      return {
        background: 'transparent',
        color: 'var(--accent)',
        border: '1px solid var(--accent)',
      };
  }
}

export default function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'default',
    glow = false,
    icon,
    children,
    className = '',
    as: Tag,
    ...rest
  } = props;

  const Comp: ElementType = Tag || 'button';
  const isLink = Comp !== 'button';
  const finalClassName = `${baseClasses} ${sizeClasses[size]} ${glow ? 'btn-glow' : ''} ${className}`.trim();

  return (
    <Comp
      className={finalClassName}
      style={variantStyle(variant)}
      {...(isLink ? (rest as Record<string, unknown>) : (rest as ButtonHTMLAttributes<HTMLButtonElement>))}
    >
      {icon}
      {children}
    </Comp>
  );
}
