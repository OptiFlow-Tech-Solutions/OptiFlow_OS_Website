import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTypewriter } from '../../hooks/useTypewriter';
import { useMouseGlow } from '../../hooks/useMouseGlow';
import { useParallax } from '../../hooks/useParallax';
import Button from '../Button';

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HookCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const BULLETS = [
  'Zero IT Team Needed',
  'Results In Days, Not Months',
  'Built For Indian Businesses',
  'Trusted Across 7 Industries',
];

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const { text, isCursorVisible } = useTypewriter();
  const glow = useMouseGlow(heroRef);
  const dashTransform = useParallax();

  return (
    <section className="section hero" ref={heroRef}>
      <div className="noise-overlay" />
      <div
        className={`mouse-glow ${glow.isActive ? 'active' : ''}`}
        style={{ left: glow.x, top: glow.y }}
      />
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hook-badge reveal">
              <HookCheck />
              Stop Losing Time on Manual Processes
            </div>
            <h1 className="reveal reveal-delay-1">
              <span id="typewriterText" aria-live="polite" style={{ color: 'rgb(239, 68, 68)' }}>
                {text}
              </span>
              <span
                className="tw-cursor"
                aria-hidden="true"
                style={{ opacity: isCursorVisible ? 1 : 0 }}
              >
                |
              </span>
            </h1>
            <p className="lead reveal reveal-delay-2">
              OptiFlow OS replaces scattered messages and spreadsheets with a single operating system — giving you complete visibility, reliable accountability, and the operational efficiency to scale your business without adding headcount.
            </p>
            <div className="hero-cta reveal reveal-delay-3">
              <Button as={Link} to="/demo-booking" variant="primary" size="lg" glow>
                Book Your Demo — It&apos;s Free
              </Button>
              <Button as={Link} to="/product-overview" variant="secondary" size="lg">
                See OptiFlow In Action
              </Button>
            </div>
            <div className="hero-trust reveal reveal-delay-3">
              {BULLETS.map((b) => (
                <span key={b}><CheckIcon /> {b}</span>
              ))}
            </div>
          </div>
          <div className="reveal reveal-delay-2" id="dashWrap">
            <div className="dashboard-mockup" id="dashboard" style={{ transform: dashTransform }}>
              <div className="dash-header">
                <h4>OptiFlow Dashboard — Today</h4>
                <div className="dash-dots"><span /><span /><span /></div>
              </div>
              <div className="dash-kpis">
                <div className="dash-kpi">
                  <div className="dash-kpi-label">Active Tasks</div>
                  <div className="dash-kpi-value num">1,247</div>
                  <div className="dash-kpi-change">↑ 12% vs last month</div>
                </div>
                <div className="dash-kpi">
                  <div className="dash-kpi-label">Team Members</div>
                  <div className="dash-kpi-value num">86</div>
                  <div className="dash-kpi-change">↑ 4% growth</div>
                </div>
                <div className="dash-kpi">
                  <div className="dash-kpi-label">Completion Rate</div>
                  <div className="dash-kpi-value num" style={{ color: 'var(--green)' }}>94%</div>
                  <div className="dash-kpi-change">↑ 8% improvement</div>
                </div>
                <div className="dash-kpi">
                  <div className="dash-kpi-label">On-Time Delivery</div>
                  <div className="dash-kpi-value num" style={{ color: 'var(--green)' }}>97%</div>
                  <div className="dash-kpi-change">↑ 2% gain</div>
                </div>
              </div>
              <div className="dash-chart">
                <svg viewBox="0 0 440 100" preserveAspectRatio="none" style={{ width: '100%', height: 80 }}>
                  <defs>
                    <linearGradient id="dag" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1B4D81" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#1B4D81" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,80 Q30,80 40,68 T80,45 T120,55 T160,30 T200,40 T240,18 T280,35 T320,22 T360,12 T400,28 T440,8" fill="none" stroke="#1B4D81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M0,80 Q30,80 40,68 T80,45 T120,55 T160,30 T200,40 T240,18 T280,35 T320,22 T360,12 T400,28 T440,8 L440,100 L0,100 Z" fill="url(#dag)" />
                </svg>
              </div>
              <div className="dash-table-row header">
                <span>Task</span><span>Assignee</span><span>Due</span><span>Status</span>
              </div>
              <div className="dash-table-row">
                <span>Quality check — Batch #412</span><span>Rajesh K.</span><span className="num">Today</span><span className="dash-status active">Active</span>
              </div>
              <div className="dash-table-row">
                <span>Client follow-up — Apex Textiles</span><span>Priya M.</span><span className="num">Tomorrow</span><span className="dash-status pending">Pending</span>
              </div>
              <div className="dash-table-row">
                <span>SOP update — Warehouse</span><span>Amit S.</span><span className="num">Jun 26</span><span className="dash-status active">Active</span>
              </div>
              <div className="floating-widget w1">
                <div className="fw-label">Tasks Completed Today</div>
                <div className="fw-value num">24</div>
              </div>
              <div className="floating-widget w2">
                <div className="fw-label">On-Time Rate</div>
                <div className="fw-value num" style={{ color: 'var(--green)' }}>96%</div>
              </div>
              <div className="floating-widget w3">
                <div className="fw-label">Pending Actions</div>
                <div className="fw-value num" style={{ color: 'var(--teal)' }}>3</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
