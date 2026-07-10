import { Link } from 'react-router-dom';
import { Section, Card } from '../components';
import { site } from '../data';

const sideNavSections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'information-collection', label: 'Information Collection' },
  { id: 'data-usage', label: 'Data Usage' },
  { id: 'data-storage', label: 'Data Storage' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'third-party', label: 'Third-Party Services' },
  { id: 'user-rights', label: 'Your Rights' },
  { id: 'security', label: 'Security' },
  { id: 'contact', label: 'Contact' },
];

export default function PrivacyPolicy() {
  return (
    <>
      <section className="hero-section reveal" style={{ animation: 'none' }}>
        <div className="container">
          <span className="eyebrow">LEGAL &amp; COMPLIANCE</span>
          <h1>Privacy Policy</h1>
          <p className="lead">Your privacy and data security are fundamental to how we build OptiFlow. This policy explains what data we collect, how we use it, and how we protect it.</p>
          <div className="hero-meta">
            <span>Version: 1.0</span>
            <span>Effective: 1 January 2026</span>
            <span>Last updated: 1 June 2026</span>
          </div>
        </div>
      </section>

      <div className="content-layout">
        <aside className="side-nav" id="sideNav">
          <h4>On this page</h4>
          {sideNavSections.map((s) => (
            <a key={s.id} href={`#${s.id}`}>{s.label}</a>
          ))}
        </aside>

        <div className="content-body">
          <Section id="introduction" className="content-card reveal">
            <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>Introduction</h2>
            <p>This Privacy Policy describes how OptiFlow ("we", "us", or "our") collects, uses, stores, and protects information when you access our website (optiflow.in) or use the OptiFlow OS platform ("the Platform").</p>
            <p>This policy applies to:</p>
            <ul>
              <li><strong>Business customers</strong> — MSME owners, founders, and authorised administrators who create an OptiFlow account and use the Platform to manage their business operations.</li>
              <li><strong>End users</strong> — employees, managers, and other personnel who access the Platform under a business customer's account.</li>
              <li><strong>Website visitors</strong> — anyone who browses optiflow.in, submits a contact form, or books a demo.</li>
            </ul>
            <p>By using OptiFlow, you agree to the practices described in this policy. If you do not agree, please discontinue use of the Platform and contact us to delete your data.</p>
            <div className="info-block">
              <h4>Our commitment</h4>
              <p>We do not sell personal data. We do not use your business operational data for advertising, competitor analysis, or any purpose beyond delivering and improving the OptiFlow Platform. Your business data is your business data.</p>
            </div>
          </Section>

          <Section id="information-collection" className="content-card reveal">
            <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>Information We Collect</h2>
            <p>We collect only the information necessary to operate the Platform, provide support, and improve our services.</p>
            <div className="info-block"><h4>Account information</h4><p>When you register, we collect your full name, company name, email address, phone number, and industry type. This is required to set up your account, verify your identity, and provide relevant onboarding.</p></div>
            <div className="info-block"><h4>Business operational data</h4><p>As you use the Platform, we store the data you enter: tasks, checklists, attendance records, leave requests, SOP documents, reports, and team member details. This data is stored so you and your authorised users can access, search, and report on it.</p></div>
            <div className="info-block"><h4>Employee information</h4><p>When a business customer adds team members, we store names, employee IDs, department assignments, attendance records, and task activity. This data belongs to the business customer, who acts as the data controller.</p></div>
            <div className="info-block"><h4>Technical information</h4><p>We automatically collect device type, browser type, IP address, login timestamps, and Platform usage patterns (pages viewed, features used). This helps us monitor Platform health and improve the user experience.</p></div>
            <div className="info-block"><h4>Communication information</h4><p>When you contact us via email, phone, demo booking form, or support channels, we store the communication content and metadata to resolve your query.</p></div>
          </Section>

          <Section id="data-usage" className="content-card reveal">
            <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>How We Use Your Information</h2>
            <p>Every use of your data serves a specific, legitimate purpose tied directly to operating and improving the Platform:</p>
            <div className="data-flow">
              <div className="flow-node">You</div>
              <div className="flow-arrow">&rarr;</div>
              <div className="flow-node highlight">OptiFlow Platform</div>
              <div className="flow-arrow">&rarr;</div>
              <div className="flow-node">Your Business Operations</div>
            </div>
            <ul>
              <li><strong>Platform operations</strong> — storing and displaying your tasks, attendance, checklists, SOPs, reports, and team data.</li>
              <li><strong>Authentication and security</strong> — verifying user identity during login and enforcing role-based access controls.</li>
              <li><strong>Reporting and analytics</strong> — generating the reports, dashboards, and analytics that you see inside the Platform using only your own data.</li>
              <li><strong>Customer support</strong> — accessing relevant account information when you contact us for help.</li>
              <li><strong>Product improvement</strong> — analysing aggregated, anonymised usage patterns to guide product development.</li>
              <li><strong>Compliance and legal obligations</strong> — responding to lawful requests and enforcing our Terms of Service.</li>
            </ul>
          </Section>

          <Section id="data-storage" className="content-card reveal">
            <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>Data Storage and Retention</h2>
            <div className="info-block"><h4>Infrastructure</h4><p>OptiFlow is hosted on secure cloud infrastructure located in India. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Our hosting provider maintains SOC 2 Type II and ISO 27001 certifications.</p></div>
            <div className="info-block"><h4>Automated backups</h4><p>Your data is backed up every 6 hours with 30-day retention. In the unlikely event of a system failure, we can restore your data to a point no more than 6 hours old.</p></div>
            <div className="info-block"><h4>Retention periods</h4><p>Active account data is retained as long as your account is active. When you close your account, we retain your data for 90 days, after which it is permanently deleted from all systems.</p></div>
            <div className="info-block"><h4>Business continuity</h4><p>We maintain a disaster recovery plan with a recovery time objective (RTO) of 4 hours and a recovery point objective (RPO) of 6 hours. Our infrastructure is designed for 99.9% uptime.</p></div>
          </Section>

          <Section id="cookies" className="content-card reveal">
            <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="4.93" y1="4.93" x2="9.17" y2="9.17" /><line x1="14.83" y1="14.83" x2="19.07" y2="19.07" /><line x1="14.83" y1="9.17" x2="19.07" y2="4.93" /></svg>Cookies and Similar Technologies</h2>
            <p>We use a minimal set of cookies and local storage to make the Platform and website work correctly. We do not use tracking cookies for advertising or cross-site profiling.</p>
            <div className="cookie-grid">
              <Card className="cookie-card"><div className="cookie-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="16" height="12" rx="2" /><circle cx="7" cy="10" r="1.5" /><circle cx="13" cy="10" r="1.5" /></svg></div><h4>Essential</h4><p>Required for authentication, session management, and Platform functionality. Cannot be disabled.</p></Card>
              <Card className="cookie-card"><div className="cookie-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="8" /><circle cx="10" cy="10" r="5" /><circle cx="10" cy="10" r="2" /></svg></div><h4>Analytics</h4><p>Anonymous usage data to help us improve the Platform. No personal data collected.</p></Card>
              <Card className="cookie-card"><div className="cookie-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2v16M2 10h16" /><polyline points="7 5 10 2 13 5" /><polyline points="7 15 10 18 13 15" /></svg></div><h4>Performance</h4><p>Measures page load times and error rates. Helps us keep the Platform fast and reliable.</p></Card>
              <Card className="cookie-card"><div className="cookie-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="14" height="14" rx="3" /><line x1="8" y1="10" x2="12" y2="10" /></svg></div><h4>Preferences</h4><p>Remembers your theme preference (light/dark mode) and language settings.</p></Card>
            </div>
            <p style={{ marginTop: 24 }}>You can manage cookie preferences through your browser settings. Disabling essential cookies may affect Platform functionality.</p>
          </Section>

          <Section id="third-party" className="content-card reveal">
            <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>Third-Party Services</h2>
            <p>We use a small number of trusted service providers to operate the Platform. Each provider is carefully vetted for security and data handling practices.</p>
            <div className="info-block"><h4>Cloud hosting</h4><p>Platform infrastructure and data storage. Location: India. SOC 2 Type II and ISO 27001 certified.</p></div>
            <div className="info-block"><h4>Email delivery</h4><p>Notification emails and system communications. Only email addresses and notification content are transmitted.</p></div>
            <div className="info-block"><h4>Analytics</h4><p>Anonymous website and Platform usage analytics. IP addresses are anonymised before processing.</p></div>
            <div className="info-block"><h4>Payment processing</h4><p>Subscription payments are processed through a PCI-DSS compliant provider. OptiFlow does not store your full credit card or bank account details.</p></div>
          </Section>

          <Section id="user-rights" className="content-card reveal">
            <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" /></svg>Your Rights</h2>
            <p>You have the following rights regarding your personal data. For employee data held under a business customer's account, please contact your employer (the data controller) first — we can assist them in fulfilling your request.</p>
            <div className="rights-grid">
              <Card><div className="rights-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="8" /><circle cx="10" cy="10" r="3" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="10" y1="16" x2="10" y2="18" /></svg></div><h4>Access your data</h4><p>Request a copy of the personal data we hold about you.</p></Card>
              <Card><div className="rights-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="14" height="14" rx="3" /><line x1="7" y1="8" x2="10" y2="11" /><line x1="10" y1="11" x2="13" y2="7" /></svg></div><h4>Correct or update</h4><p>Ask us to fix inaccurate or incomplete information.</p></Card>
              <Card><div className="rights-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="12" height="12" rx="2" /><line x1="7" y1="7" x2="13" y2="13" /><line x1="13" y1="7" x2="7" y2="13" /></svg></div><h4>Request deletion</h4><p>Request that we delete your personal data, subject to legal obligations.</p></Card>
              <Card><div className="rights-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="14" height="11" rx="2" /><polyline points="7 9 10 12 13 9" /><line x1="10" y1="12" x2="10" y2="4" /></svg></div><h4>Export your data</h4><p>Request a portable copy of your data in a standard format (CSV, JSON).</p></Card>
              <Card><div className="rights-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="8" /><line x1="10" y1="6" x2="10" y2="14" /><line x1="6" y1="10" x2="14" y2="10" /></svg></div><h4>Withdraw consent</h4><p>Withdraw consent for non-essential data processing at any time.</p></Card>
              <Card><div className="rights-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="14" height="10" rx="2" /><polyline points="3 8 10 12 17 8" /></svg></div><h4>Communication preferences</h4><p>Opt out of non-essential emails while keeping Platform notifications active.</p></Card>
            </div>
          </Section>

          <Section id="security" className="content-card reveal">
            <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>How We Protect Your Information</h2>
            <p>Security is not an add-on — it's built into every layer of the OptiFlow Platform.</p>
            <div className="security-grid">
              <Card className="security-card"><div className="security-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="8" width="14" height="9" rx="2" /><path d="M7 8V6a3 3 0 0 1 6 0v2" /><circle cx="10" cy="12.5" r="1" /></svg></div><h4>Role-based access</h4><p>Every user sees only what their role permits. Admin, Manager, and Employee roles have distinct access levels.</p></Card>
              <Card className="security-card"><div className="security-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="16" height="16" rx="3" /><line x1="2" y1="6" x2="18" y2="6" /><line x1="6" y1="2" x2="6" y2="6" /></svg></div><h4>Encryption</h4><p>All data is encrypted at rest (AES-256) and in transit (TLS 1.3).</p></Card>
              <Card className="security-card"><div className="security-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="14" height="12" rx="2" /><line x1="7" y1="8" x2="13" y2="8" /><line x1="7" y1="12" x2="11" y2="12" /></svg></div><h4>Audit logs</h4><p>Every action — login, task update, report generation, permission change — is logged with timestamp and user identity.</p></Card>
              <Card className="security-card"><div className="security-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="8" /><path d="M10 5v5l3 3" /></svg></div><h4>Monitoring</h4><p>24/7 automated monitoring for suspicious activity, with alerts to our security team and the account administrator.</p></Card>
              <Card className="security-card"><div className="security-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h12v12H4z" /><path d="M4 4l4 4M4 4l4-4M4 4L0 8" /><circle cx="14" cy="14" r="4" /><path d="M14 12v4M12 14h4" /></svg></div><h4>Regular backups</h4><p>Automated backups every 6 hours with 30-day retention. Monthly restoration tests.</p></Card>
              <Card className="security-card"><div className="security-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="8" /><line x1="10" y1="5" x2="10" y2="15" /><line x1="5" y1="10" x2="15" y2="10" /></svg></div><h4>Access restrictions</h4><p>Only essential OptiFlow personnel have access to production systems, and all access is logged and reviewed.</p></Card>
            </div>
          </Section>

          <Section id="contact" className="content-card reveal">
            <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>Questions About Privacy?</h2>
            <p>If you have questions about this Privacy Policy, want to exercise your data rights, or need to report a privacy concern, please contact us:</p>
            <div className="contact-card">
              <div className="contact-item"><div className="ci-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="14" height="10" rx="2" /><polyline points="3 8 10 12 17 8" /></svg></div><h4>Privacy email</h4><p><a href={`mailto:${site.email}`}>{site.email}</a></p></div>
              <div className="contact-item"><div className="ci-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="8" /><circle cx="10" cy="10" r="3" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="10" y1="16" x2="10" y2="18" /></svg></div><h4>Support email</h4><p><a href={`mailto:${site.email}`}>{site.email}</a></p></div>
              <div className="contact-item"><div className="ci-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="16" height="14" rx="2" /><line x1="6" y1="7" x2="14" y2="7" /><line x1="6" y1="11" x2="14" y2="11" /></svg></div><h4>Contact form</h4><p><Link to="/contact">Contact us page</Link></p></div>
            </div>
            <div className="info-block" style={{ marginTop: 24 }}>
              <h4>Response expectations</h4>
              <p>We aim to acknowledge all privacy-related inquiries within 1 business day and provide a substantive response within 5 business days. For urgent data access or deletion requests, we prioritise resolution within 48 hours.</p>
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}
