interface SkeletonProps {
  variant?: 'text' | 'card' | 'avatar';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export default function Skeleton({ variant = 'text', width, height, className = '' }: SkeletonProps) {
  const baseStyle: React.CSSProperties = {
    background: 'var(--fg-soft)',
    borderRadius: 'var(--radius)',
    animation: 'skeletonPulse 1.5s ease-in-out infinite',
    width,
    height,
  };

  if (variant === 'avatar') {
    return (
      <div
        className={className}
        style={{
          ...baseStyle,
          width: width ?? 44,
          height: height ?? 44,
          borderRadius: '50%',
        }}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={className}
        style={{
          ...baseStyle,
          width: width ?? '100%',
          height: height ?? 200,
        }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        ...baseStyle,
        width: width ?? '100%',
        height: height ?? 16,
      }}
    />
  );
}
