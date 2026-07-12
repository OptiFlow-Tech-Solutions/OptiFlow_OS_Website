import { Link } from 'react-router-dom';
import { Button } from '../../index';

interface FeatureCTAProps {
  text: string;
  link: string;
  label: string;
}

export default function FeatureCTA({ text, link, label }: FeatureCTAProps) {
  return (
    <div style={{
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 'var(--gap-md)',
      marginTop: 'var(--gap-lg)',
    }}>
      <p style={{ fontWeight: 600, fontSize: 15, margin: 0 }}>{text}</p>
      <Button as={Link} to={link}>{label}</Button>
    </div>
  );
}
