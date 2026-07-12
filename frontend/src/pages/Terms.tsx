import { Link } from 'react-router-dom';
import { Section } from '../components';
import { site } from '../data';

const sideNavSections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'definitions', label: 'Definitions' },
  { id: 'service-usage', label: 'Service Usage' },
  { id: 'user-responsibilities', label: 'User Responsibilities' },
  { id: 'payment-terms', label: 'Payment Terms' },
  { id: 'intellectual-property', label: 'Intellectual Property' },
  { id: 'data-ownership', label: 'Data Ownership' },
  { id: 'limitation-of-liability', label: 'Limitation of Liability' },
  { id: 'termination', label: 'Termination' },
  { id: 'governing-law', label: 'Governing Law' },
  { id: 'contact', label: 'Contact' },
];

const definitions = [
  { term: 'Platform', desc: 'The OptiFlow OS software-as-a-service platform, including all features, modules, APIs, documentation, mobile applications, and related services.' },
  { term: 'Customer', desc: 'The business entity or individual that creates an OptiFlow account and subscribes to the Platform. The Customer is responsible for all activity under its account.' },
  { term: 'Authorised User', desc: 'Any individual (employee, manager, contractor) granted access to the Platform by the Customer. Each user must have a unique account credential.' },
  { term: 'Business Data', desc: 'All information, tasks, checklists, attendance records, SOPs, reports, employee details, and any other content entered into or generated through the Platform.' },
  { term: 'Subscription', desc: 'The paid plan (Starter, Growth, or Scale) that determines the features, capacity, and support level available, as described on the Pricing page.' },
  { term: 'Setup Fee', desc: 'A one-time charge for initial Platform configuration, data migration, team onboarding, and go-live support, as specified at the time of purchase.' },
  { term: 'Administrator', desc: 'A user designated by the Customer with elevated permissions to manage account settings, user roles, department structure, billing, and Platform configuration.' },
  { term: 'Content', desc: 'All text, files, documents, images, data, and information uploaded, stored, or generated through the Platform by the Customer or its Authorised Users.' },
];

export default function Terms() {
  return (
    <>
      <section className="hero-section reveal" style={{ animation: 'none' }}>
        <div className="container">
          <span className="eyebrow">LEGAL &amp; GOVERNANCE</span>
          <h1>Terms &amp; Conditions</h1>
          <p className="lead">These Terms govern your use of the OptiFlow OS platform. By using OptiFlow, you agree to these terms. They define the rights, responsibilities, and obligations of everyone who uses the Platform.</p>
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
            <p>These Terms &amp; Conditions ("Terms") form a legally binding agreement between you ("Customer", "you", or "your") and OptiFlow ("we", "us", or "our") governing your access to and use of the OptiFlow OS platform.</p>
            <p><strong>By creating an account, accessing, or using the Platform, you confirm that you have read, understood, and agree to be bound by these Terms.</strong> If you are entering into these Terms on behalf of a company or other legal entity, you represent that you have the authority to bind that entity.</p>
            <p>If you do not agree to these Terms, you must not create an account or use the Platform.</p>
            <p>These Terms apply to:</p>
            <ul>
              <li><strong>Business customers</strong> — any MSME, company, or organisation that creates an OptiFlow account to manage its business operations.</li>
              <li><strong>Authorised users</strong> — employees, managers, contractors granted access to the Platform by a business customer.</li>
              <li><strong>Website visitors</strong> — anyone browsing optiflow.in or submitting forms on the website.</li>
            </ul>
            <p>We may update these Terms from time to time. Material changes will be communicated by email and via an in-Platform notice at least 15 days before taking effect.</p>
            <div className="info-block">
              <h4>Supplementary documents</h4>
              <p>These Terms incorporate by reference our <Link to="/privacy-policy">Privacy Policy</Link>, which explains how we collect, use, and protect your data.</p>
            </div>
          </Section>

          <Section id="definitions" className="content-card reveal">
            <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>Definitions</h2>
            <div className="def-grid">
              {definitions.map((d) => (
                <div className="def-card" key={d.term}>
                  <div className="def-term">{d.term}</div>
                  <p className="def-desc">{d.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="service-usage" className="content-card reveal">
            <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }}><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>Service Usage</h2>
            <p>OptiFlow grants you a limited, non-exclusive, non-transferable, revocable right to access and use the Platform during the Subscription Term, subject to these Terms.</p>
            <div className="info-block"><h4>Permitted use</h4><p>You may use the Platform to manage your business operations: create and assign tasks, track attendance, manage SOPs, run reports, and use all features included in your Subscription plan.</p></div>
            <div className="info-block"><h4>Restrictions</h4><p>You may not resell, sublicense, reverse engineer, or otherwise attempt to extract the source code of the Platform. You may not use the Platform for any unlawful purpose or in violation of any applicable laws or regulations.</p></div>
            <div className="info-block"><h4>Account security</h4><p>You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately of any unauthorised access to your account.</p></div>
          </Section>

          <Section id="user-responsibilities" className="content-card reveal">
            <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>User Responsibilities</h2>
            <ul>
              <li><strong>Compliance with laws</strong> — You must comply with all applicable laws, including data protection laws, when using the Platform.</li>
              <li><strong>Content responsibility</strong> — You are solely responsible for the accuracy, quality, and legality of all Content uploaded to the Platform.</li>
              <li><strong>Employee data</strong> — If you upload employee personal data, you must have obtained necessary consents or have a lawful basis for processing.</li>
              <li><strong>Platform integrity</strong> — You must not attempt to disrupt, overload, or compromise the Platform's security or availability.</li>
              <li><strong>User management</strong> — The Administrator is responsible for managing user access, promptly removing accounts of departing employees, and maintaining accurate user records.</li>
            </ul>
          </Section>

          <Section id="payment-terms" className="content-card reveal">
            <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>Payment Terms</h2>
            <div className="info-block"><h4>Subscription fees</h4><p>Fees are based on the selected plan and are charged annually in advance. Current pricing is published on our <Link to="/pricing">Pricing page</Link>.</p></div>
            <div className="info-block"><h4>Setup fee</h4><p>A one-time setup fee covers initial configuration, data migration, and team onboarding as specified during purchase.</p></div>
            <div className="info-block"><h4>Payment methods</h4><p>We accept payments via bank transfer, UPI, and major credit/debit cards through a PCI-DSS compliant payment processor. OptiFlow does not store payment card details.</p></div>
            <div className="info-block"><h4>Refund policy</h4><p>If you cancel within the first 30 days of your initial subscription, you are eligible for a full refund of the annual subscription fee (setup fees are non-refundable). After 30 days, refunds are prorated based on the months remaining in the subscription year, less any discounts applied.</p></div>
          </Section>

          <Section id="intellectual-property" className="content-card reveal">
            <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>Intellectual Property</h2>
            <div className="info-block"><h4>Our IP</h4><p>OptiFlow retains all rights, title, and interest in the Platform, including all software, algorithms, designs, documentation, trademarks, and any improvements or modifications.</p></div>
            <div className="info-block"><h4>Your Content</h4><p>You retain all rights to your Business Data and Content. You grant OptiFlow a limited license to host, display, and process your Content solely as necessary to provide the Platform.</p></div>
            <div className="info-block"><h4>Feedback</h4><p>Any suggestions, feature requests, or feedback you provide may be used by OptiFlow without obligation or compensation.</p></div>
          </Section>

          <Section id="data-ownership" className="content-card reveal">
            <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }}><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>Data Ownership</h2>
            <div className="ownership-diagram">
              <div className="od-node accent">Your Business Data</div>
              <div className="od-arrow">&rarr;</div>
              <div className="od-node">OptiFlow Platform</div>
              <div className="od-arrow">&rarr;</div>
              <div className="od-node accent">You Own It</div>
            </div>
            <ul>
              <li><strong>You own your data</strong> — All Business Data belongs to you. OptiFlow does not claim any ownership rights over your Content.</li>
              <li><strong>Data portability</strong> — Upon request, we will export your Business Data in a standard format (CSV, JSON) within 30 days.</li>
              <li><strong>Data deletion</strong> — Upon termination, your Business Data is permanently deleted within 90 days, subject to legal obligations.</li>
            </ul>
            <div className="commitment-badge"><h3>Our commitment: We never sell, share, or mine your business operational data.</h3><p>Your tasks, checklists, SOPs, and reports are yours alone.</p></div>
          </Section>

          <Section id="limitation-of-liability" className="content-card reveal">
            <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>Limitation of Liability</h2>
            <p>To the maximum extent permitted by law:</p>
            <ul>
              <li>OptiFlow's total liability for any claim arising from these Terms or the use of the Platform shall not exceed the fees paid by you in the 12 months preceding the claim.</li>
              <li>OptiFlow shall not be liable for indirect, incidental, special, consequential, or punitive damages, including lost profits or business interruption.</li>
              <li>OptiFlow provides the Platform "as is" without warranty of any kind, express or implied, except as explicitly stated in these Terms.</li>
            </ul>
            <div className="info-block"><h4>Service level</h4><p>OptiFlow commits to 99.9% Platform uptime during business hours (9 AM—8 PM IST, Monday—Saturday), measured monthly. If uptime falls below this threshold, you may be eligible for service credits.</p></div>
          </Section>

          <Section id="termination" className="content-card reveal">
            <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>Termination</h2>
            <ul>
              <li><strong>By you</strong> — You may terminate your account at any time with 30 days written notice. Fees for the remainder of the subscription period are non-refundable except as provided in the Refund Policy.</li>
              <li><strong>By us</strong> — We may suspend or terminate your access if you materially breach these Terms and fail to remedy within 30 days of written notice. In cases of illegal activity, we may terminate immediately.</li>
              <li><strong>Effect of termination</strong> — Upon termination, your access to the Platform ceases. You may export your data within 30 days of termination. After 90 days, your data is permanently deleted.</li>
            </ul>
          </Section>

          <Section id="governing-law" className="content-card reveal">
            <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Surat, Gujarat, India.</p>
            <div className="info-block"><h4>Dispute resolution</h4><p>Before initiating formal legal proceedings, both parties agree to attempt to resolve disputes through good-faith negotiation for a period of at least 30 days.</p></div>
          </Section>

          <Section id="contact" className="content-card reveal">
            <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>Questions About These Terms?</h2>
            <p>If you have questions about these Terms, need clarification, or want to report a violation, please contact us:</p>
            <div className="contact-grid">
              <div className="contact-item"><div className="ci-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="14" height="10" rx="2" /><polyline points="3 8 10 12 17 8" /></svg></div><h4>Legal email</h4><p><a href={`mailto:${site.email}`}>{site.email}</a></p></div>
              <div className="contact-item"><div className="ci-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="8" /><circle cx="10" cy="10" r="3" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="10" y1="16" x2="10" y2="18" /></svg></div><h4>Support</h4><p><a href="mailto:info@optiflow.co.in">info@optiflow.co.in</a></p></div>
              <div className="contact-item"><div className="ci-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="16" height="14" rx="2" /><line x1="6" y1="7" x2="14" y2="7" /><line x1="6" y1="11" x2="14" y2="11" /></svg></div><h4>Contact form</h4><p><Link to="/contact">Contact us page</Link></p></div>
            </div>
            <div className="info-block" style={{ marginTop: 24 }}>
              <h4>Response expectations</h4>
              <p>We aim to respond to all legal inquiries within 2 business days. For billing or account issues, we respond within 1 business day.</p>
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}
