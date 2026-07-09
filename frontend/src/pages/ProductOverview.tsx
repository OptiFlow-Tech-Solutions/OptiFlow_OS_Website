import { Link } from 'react-router-dom';
import { Section, Button, Card } from '../components';
import MetaHead from '../components/MetaHead';
import ProductOverviewStyles from '../components/product-overview/ProductOverviewStyles';
import ArchitectureDiagram from '../components/product-overview/ArchitectureDiagram';
import ModuleSpotlight from '../components/product-overview/ModuleSpotlight';
import PanelSection from '../components/product-overview/PanelSection';
import WorkflowEngine from '../components/product-overview/WorkflowEngine';
import DemoTabs from '../components/product-overview/DemoTabs';
import {
  visionCards,
  adminPanel,
  captainPanel,
  doerPanel,
  reportTypes,
  permissionRows,
} from '../data';

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 18, height: 18, color: 'var(--green)', flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const reportSvgs: Record<string, React.ReactNode> = {
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  'chart-line': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  'doc-text': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  'bar-chart': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
};

export default function ProductOverview() {
  return (
    <>
      <MetaHead />
      <ProductOverviewStyles />

      {/* S01: Hero */}
      <section className="hero" data-screen-label="01 Hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="eyebrow">BUSINESS OPERATING SYSTEM FOR MSMEs</div>
              <h1>One Platform To Run Your Entire Business.</h1>
              <p className="lead">
                Manage Tasks, Teams, SOPs, Attendance, Workflows, Reporting, Accountability, and Operations from a single operating system built specifically for MSMEs.
              </p>
              <div className="hero-cta">
                <Button as={Link} to="/os/demo-booking/" size="lg">Book Demo</Button>
                <Button as={Link} to="/os/product-overview/" variant="secondary" size="lg">Watch Platform Tour</Button>
              </div>
              <div className="hero-trust">
                <div className="hero-trust-item"><CheckIcon /> Built For MSMEs</div>
                <div className="hero-trust-item"><CheckIcon /> Fast Deployment</div>
                <div className="hero-trust-item"><CheckIcon /> Easy Adoption</div>
                <div className="hero-trust-item"><CheckIcon /> High Accountability</div>
              </div>
            </div>
            <div className="hero-dashboard">
              <DemoTabs />
            </div>
          </div>
        </div>
      </section>

      {/* S02: What Is OptiFlow */}
      <Section heading="What Is OptiFlow OS?" lead="A Business Operating System that transforms organisations from people-dependent operations into process-driven enterprises." data-screen-label="02 What Is OptiFlow">
        <div className="transform-flow reveal">
          <div className="transform-stage chaos">
            <h3 style={{ fontSize: 18, color: 'color-mix(in oklch, red 70%, white)', margin: '0 0 8px' }}>Traditional Operations</h3>
            <div className="transform-tag">WhatsApp</div>
            <div className="transform-tag">Excel</div>
            <div className="transform-tag">Calls</div>
            <div className="transform-tag">Manual Follow-ups</div>
          </div>
          <div className="transform-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
          <div className="transform-stage optiflow">
            <h3 style={{ fontSize: 18, color: 'var(--accent)', margin: '0 0 8px' }}>OptiFlow OS</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>One centralised platform replacing scattered tools, messages, and spreadsheets.</p>
          </div>
          <div className="transform-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
          <div className="transform-stage system">
            <h3 style={{ fontSize: 18, color: 'var(--green)', margin: '0 0 8px' }}>Systemised Operations</h3>
            <div className="transform-tag">Predictable</div>
            <div className="transform-tag">Accountable</div>
            <div className="transform-tag">Scalable</div>
            <div className="transform-tag">Audit-Ready</div>
          </div>
        </div>
      </Section>

      {/* S03: Product Vision */}
      <Section heading="Building The Operating System For Growing Businesses" lead="A single platform that gives every business &mdash; regardless of size &mdash; the same operational discipline as the world's best-run companies." data-screen-label="03 Product Vision">
        <div className="grid-3 stagger reveal" style={{ marginTop: 32 }}>
          {visionCards.map((card, i) => (
            <Card key={i}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{card.icon}</div>
              <h3>{card.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 8 }}>{card.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* S04: Platform Architecture */}
      <Section heading="How The Entire Platform Works Together" lead="Hover over any module to see how it connects to the OptiFlow OS hub." data-screen-label="04 Platform Architecture">
        <ArchitectureDiagram />
      </Section>

      {/* S05: Core Modules */}
      <Section heading="Everything You Need To Run Operations" lead="Spotlight on the 6 modules MSMEs use most. Every module is built for Indian business workflows." data-screen-label="05 Core Modules">
        <ModuleSpotlight />
      </Section>

      {/* S06: Admin Panel */}
      <Section heading={adminPanel.heading} lead={adminPanel.lead} data-screen-label="06 Admin Panel">
        <div className="reveal">
          <PanelSection data={adminPanel} />
        </div>
      </Section>

      {/* S07: Captain Panel */}
      <Section heading={captainPanel.heading} lead={captainPanel.lead} data-screen-label="07 Captain Panel">
        <div className="reveal">
          <PanelSection data={captainPanel} />
        </div>
      </Section>

      {/* S08: Doer Panel */}
      <Section heading={doerPanel.heading} lead={doerPanel.lead} data-screen-label="08 Doer Panel">
        <div className="reveal">
          <PanelSection data={doerPanel} />
        </div>
      </Section>

      {/* S09: Workflow Engine */}
      <Section heading="Turn Business Processes Into Repeatable Systems" lead="Every business has processes. OptiFlow turns them into automated workflows that run without the owner or manager pushing every step." data-screen-label="09 Workflow Engine">
        <div className="reveal">
          <WorkflowEngine />
        </div>
      </Section>

      {/* S10: Reporting Engine */}
      <Section heading="Data-Driven Decisions Start Here" lead="Every action in OptiFlow generates data. Every data point feeds reports. Every report drives better decisions." data-screen-label="10 Reporting Engine">
        <div className="report-kpis reveal">
          <div className="report-kpi"><div className="rkpi-val">92%</div><div className="rkpi-label">Task Completion Rate</div></div>
          <div className="report-kpi"><div className="rkpi-val">87%</div><div className="rkpi-label">On-Time Delivery</div></div>
          <div className="report-kpi"><div className="rkpi-val">100%</div><div className="rkpi-label">Audit Trail Coverage</div></div>
          <div className="report-kpi"><div className="rkpi-val num">{'\u20B9'}3.2L</div><div className="rkpi-label">Cost Saved This Month</div></div>
        </div>
        <div className="report-list reveal">
          {reportTypes.map((r, i) => (
            <div key={i} className="report-item">
              {reportSvgs[r.icon]}
              {r.label}
            </div>
          ))}
        </div>
      </Section>

      {/* S11: Security & Permissions */}
      <Section heading="Enterprise Security. MSME Simplicity." lead="Role-based access, audit trails, and data protection &mdash; built for business owners who need control without complexity." data-screen-label="11 Security & Permissions">
        <div className="perm-matrix reveal">
          <table>
            <thead>
              <tr><th>Module</th><th>Employee</th><th>Manager</th><th>Admin</th></tr>
            </thead>
            <tbody>
              {permissionRows.map((row, i) => (
                <tr key={i}>
                  <td>{row.module}</td>
                  <td><span className={`perm-badge ${row.employee.access}`}>{row.employee.text}</span></td>
                  <td><span className={`perm-badge ${row.manager.access}`}>{row.manager.text}</span></td>
                  <td><span className={`perm-badge ${row.admin.access}`}>{row.admin.text}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sec-feats reveal">
          <div className="sec-feat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <h4>Role-Based Access</h4>
            <p>Three roles &mdash; Admin, Captain, Doer &mdash; with granular module-level permissions that match real business hierarchy.</p>
          </div>
          <div className="sec-feat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            <h4>Audit Trails</h4>
            <p>Every action &mdash; task creation, modification, deletion, verification &mdash; is logged with timestamp, user, and IP address.</p>
          </div>
          <div className="sec-feat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <h4>Secure Authentication</h4>
            <p>Username + password with account lockout protection. Optional biometric auth on mobile. Session timeout.</p>
          </div>
        </div>
      </Section>

      {/* S12: CTA */}
      <section className="cta-section" data-screen-label="12 CTA">
        <div className="container">
          <h2>Ready To See OptiFlow In Action?</h2>
          <p className="lead">
            Discover how OptiFlow helps MSMEs build systems, improve accountability, and scale operations &mdash; without adding management layers.
          </p>
          <div className="cta-btns">
            <Button as={Link} to="/os/demo-booking/" size="lg">Book Free Demo</Button>
            <Button as={Link} to="/os/product-overview/" variant="secondary" size="lg">Watch Product Tour</Button>
          </div>
          <div className="cta-trust">
            <div className="cta-trust-item">{'\u2713'} Fast Deployment</div>
            <div className="cta-trust-item">{'\u2713'} MSME Focused</div>
            <div className="cta-trust-item">{'\u2713'} Dedicated Support</div>
            <div className="cta-trust-item">{'\u2713'} Easy Adoption</div>
          </div>
        </div>
      </section>
    </>
  );
}
