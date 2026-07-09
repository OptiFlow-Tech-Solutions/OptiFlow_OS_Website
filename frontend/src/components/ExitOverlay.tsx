import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

export default function ExitOverlay() {
  const [active, setActive] = useState(false);
  const [fired, setFired] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (!fired && e.clientY <= 0 && window.scrollY > 400) {
      setFired(true);
      setActive(true);
    }
  }, [fired]);

  useEffect(() => {
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [handleMouseLeave]);

  const close = () => setActive(false);
  const onOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) close();
  };

  return (
    <div className={`exit-overlay ${active ? 'active' : ''}`} onClick={onOverlayClick}>
      <div className="exit-card">
        <button className="exit-close" onClick={close} aria-label="Close">×</button>
        <span className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>Before you go</span>
        <h2>See How Much Time Your Business Could Save</h2>
        <p className="lead">
          Book a free 15-minute demo and see OptiFlow working with real business scenarios — tailored to your industry.
        </p>
        <Button as={Link} to="/demo-booking" variant="primary" size="lg" style={{ width: '100%', justifyContent: 'center' }}>
          Book Your Free Demo
        </Button>
      </div>
    </div>
  );
}
