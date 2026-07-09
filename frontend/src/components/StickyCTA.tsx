import { Link } from 'react-router-dom';
import useScrollPosition from '../hooks/useScrollPosition';

export default function StickyCTA() {
  const scrollY = useScrollPosition();
  const visible = scrollY > window.innerHeight;

  return (
    <Link
      to="/demo-booking"
      className={`sticky-cta${visible ? ' visible' : ''}`}
    >
      Book Demo
      <span className="sticky-arrow">&rarr;</span>
    </Link>
  );
}
