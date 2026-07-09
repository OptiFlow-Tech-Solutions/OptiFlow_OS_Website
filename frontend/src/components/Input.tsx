import { type ReactNode, type InputHTMLAttributes } from 'react';

type InputVariant = 'default' | 'error';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  icon?: ReactNode;
}

export default function Input({
  variant = 'default',
  icon,
  className = '',
  disabled,
  readOnly,
  style,
  ...props
}: InputProps) {
  const isError = variant === 'error';

  const baseStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    fontSize: 'var(--fs-body)',
    fontFamily: 'var(--font-body)',
    background: 'var(--surface)',
    color: 'var(--fg)',
    border: isError
      ? '1px solid color-mix(in oklch, oklch(60% 0.15 25) 25%, transparent)'
      : '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
    ...(icon ? { paddingLeft: '40px' } : {}),
    ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
    ...(readOnly ? { cursor: 'default' } : {}),
    ...style,
  };

  if (isError && !disabled) {
    baseStyle.background = 'color-mix(in oklch, oklch(60% 0.15 25) 6%, transparent)';
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {icon && (
        <span
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--muted)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {icon}
        </span>
      )}
      <input
        className={className}
        style={baseStyle}
        disabled={disabled}
        readOnly={readOnly}
        {...props}
      />
    </div>
  );
}
