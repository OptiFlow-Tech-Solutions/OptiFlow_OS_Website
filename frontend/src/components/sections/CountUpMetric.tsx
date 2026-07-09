import { useCountUp } from '../../hooks/useCountUp';

interface CountUpMetricProps {
  target: number;
  label: string;
  suffix?: string;
}

export default function CountUpMetric({ target, label, suffix = '' }: CountUpMetricProps) {
  const { display, ref } = useCountUp(target, { suffix });

  return (
    <div className="reveal">
      <div className="trust-metric-value num" ref={ref}>{display || target.toLocaleString()}{suffix}</div>
      <div className="trust-metric-label">{label}</div>
    </div>
  );
}
