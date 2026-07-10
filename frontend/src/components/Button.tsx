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
  'inline-flex items-center gap-2 font-semibold whitespace-nowrap relative overflow-hidden cursor-pointer border-0 font-[inherit] transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.97]';

const sizeClasses: Record<ButtonSize, string> = {
  default: 'px-6 py-3 text-[15px] rounded-[var(--radius)]',
  lg: 'px-8 py-4 text-[16px] rounded-[var(--radius-lg)]',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
};

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
  const finalClassName = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${glow ? 'btn-glow' : ''} ${className}`.trim();

  return (
    <Comp
      className={finalClassName}
      {...(isLink ? (rest as Record<string, unknown>) : (rest as ButtonHTMLAttributes<HTMLButtonElement>))}
    >
      {icon}
      {children}
    </Comp>
  );
}
