export interface FAQCategory {
  id: number;
  name: string;
  slug: string;
  icon: 'product' | 'pricing' | 'security' | 'implementation';
  description: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  categorySlug: string;
}

export interface TroubleshootingSubProblem {
  label: string;
  resolution: {
    title: string;
    desc: string;
    cta: string;
    ctaLabel: string;
  };
}

export interface TroubleshootingCategory {
  label: string;
  problems: Record<string, TroubleshootingSubProblem>;
}

export interface EscalationChannel {
  icon: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  variant: 'primary' | 'secondary';
  isExternal?: boolean;
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 1,
    name: 'Product',
    slug: 'product',
    icon: 'product',
    description: 'Questions about what OptiFlow OS is, what it does, and who it serves.',
  },
  {
    id: 2,
    name: 'Pricing',
    slug: 'pricing',
    icon: 'pricing',
    description: 'Questions about pricing structure, what\'s included, and payment options.',
  },
  {
    id: 3,
    name: 'Security',
    slug: 'security',
    icon: 'security',
    description: 'Questions about data protection, access control, and compliance.',
  },
  {
    id: 4,
    name: 'Implementation',
    slug: 'implementation',
    icon: 'implementation',
    description: 'Questions about onboarding, training, support, and timelines.',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  // Product (12)
  {
    id: 1, question: 'What is OptiFlow OS?', categorySlug: 'product',
    answer: 'OptiFlow OS is a Business Operating System built specifically for MSMEs. It replaces scattered tools — WhatsApp, Excel, phone calls, and manual registers — with a single unified platform where you manage tasks, teams, attendance, SOPs, checklists, reporting, and accountability. Think of it as the operating system your business has been missing.',
  },
  {
    id: 2, question: 'Who is OptiFlow built for?', categorySlug: 'product',
    answer: 'OptiFlow is purpose-built for Indian MSMEs across textile, manufacturing, trading, warehousing, distribution, logistics, and service industries. It\'s designed for business owners, operations managers, HR heads, plant supervisors, and team leaders who need operational visibility without complex enterprise tools.',
  },
  {
    id: 3, question: 'What business problems does OptiFlow solve?', categorySlug: 'product',
    answer: 'Six core problems: (1) Tasks get missed because nothing is tracked, (2) No accountability — work bounces between people, (3) WhatsApp chaos — instructions buried in 20+ chat groups, (4) Excel dependency — spreadsheets live on one person\'s laptop, (5) Zero visibility — you discover problems at month-end, (6) Delayed follow-ups — client and vendor commitments slip through cracks.',
  },
  {
    id: 4, question: 'Can OptiFlow replace WhatsApp-based work management?', categorySlug: 'product',
    answer: 'Yes — this is OptiFlow\'s most common use case. Instead of work scattered across 20+ WhatsApp groups, every task is created, assigned, tracked, verified, and reported inside OptiFlow. You get ownership, deadlines, evidence uploads, and a complete audit trail — nothing gets lost in a chat thread again.',
  },
  {
    id: 5, question: 'Can OptiFlow replace Excel tracking?', categorySlug: 'product',
    answer: 'Absolutely. OptiFlow replaces static spreadsheets with live, real-time data that everyone can access. No version conflicts, no broken formulas, no "who has the latest file" confusion. Reports, attendance, checklists, and task status are updated instantly and visible to everyone with the right permissions.',
  },
  {
    id: 6, question: 'What modules are included?', categorySlug: 'product',
    answer: 'Task Management, Worklists, Checklist Management, Attendance, Leave Management, SOP Library, Training, Helpdesk, Reports & Analytics, Verification, and Notifications. All modules are integrated — tasks link to SOPs, attendance feeds into reports, checklists trigger verifications. It\'s one system, not ten separate tools.',
  },
  {
    id: 7, question: 'Can I customise workflows?', categorySlug: 'product',
    answer: 'Yes. You can define department-specific checklists, custom task workflows, verification chains, and approval hierarchies. OptiFlow is flexible enough to map to how your business actually operates — not the other way around.',
  },
  {
    id: 8, question: 'Is there a mobile app?', categorySlug: 'product',
    answer: 'Yes. OptiFlow works on mobile browsers and is fully responsive — employees can mark attendance, complete checklists, update task status, and upload evidence from any smartphone. No app installation required. GPS attendance and selfie verification work on mobile out of the box.',
  },
  {
    id: 9, question: 'How does task verification work?', categorySlug: 'product',
    answer: 'When a task is completed, the assigned verifier (a manager or captain) must confirm it through the Verification Queue. They can review evidence (photos, checklists, notes), accept the work, or send it back for correction. This creates a closed accountability loop — nothing is "done" until it\'s verified.',
  },
  {
    id: 10, question: 'How does the buddy system work for leave?', categorySlug: 'product',
    answer: 'When an employee applies for leave, they assign a "buddy" — a colleague who will handle their critical tasks during the absence. The buddy receives automatic notifications and task reassignments. This ensures no work stops because one person is away. Leave approval workflows include buddy confirmation before final sign-off.',
  },
  {
    id: 11, question: 'Can multiple departments use the platform?', categorySlug: 'product',
    answer: 'Yes — this is the platform\'s core strength. Production, Quality, HR, Dispatch, Maintenance, Sales — each department gets its own workspace with department-specific checklists, SOPs, and reports. Department-level permissions keep data separate where needed while giving management full cross-department visibility.',
  },
  {
    id: 12, question: 'How does reporting work?', categorySlug: 'product',
    answer: 'Reports are generated in real time — task completion rates, attendance trends, department performance, audit trails, SOP adherence, and verification status. No one needs to compile data manually. Reports are available as dashboards and can be exported. Management gets a daily operational snapshot without a single follow-up call.',
  },

  // Pricing (10)
  {
    id: 13, question: 'Are there any hidden charges?', categorySlug: 'pricing',
    answer: 'No. OptiFlow pricing is completely transparent. What you see on the pricing page is what you pay — one-time setup fee + annual subscription. Cloud hosting, product updates, and standard support are all included. There are no per-user charges, no hidden modules, and no surprise renewal escalations.',
  },
  {
    id: 14, question: 'Do you charge per user?', categorySlug: 'pricing',
    answer: 'No. OptiFlow charges a flat annual fee based on your plan tier, not per user. Unlike most SaaS platforms where adding employees increases your bill, OptiFlow lets you onboard your entire team within your plan\'s capacity at a fixed price. This makes budgeting predictable year after year.',
  },
  {
    id: 15, question: 'What is included in setup fees?', categorySlug: 'pricing',
    answer: 'Your one-time setup fee covers system configuration, department structure setup, initial user onboarding, data migration assistance, and training for your core team. We handle the heavy lifting so your team can start using OptiFlow from day one.',
  },
  {
    id: 16, question: 'What is included in annual pricing?', categorySlug: 'pricing',
    answer: 'Your annual subscription includes unlimited users (within plan capacity), all modules in your plan tier, cloud hosting, product updates, standard support, and access to training resources. There are no additional module fees, no transaction charges, and no support tickets to purchase.',
  },
  {
    id: 17, question: 'Can I upgrade plans later?', categorySlug: 'pricing',
    answer: 'Yes. You can upgrade from Starter to Growth or from Growth to Scale at any time. We pro-rate the upgrade cost based on the remaining subscription period. Upgrading unlocks additional modules, advanced features, and higher priority support — no disruption to your existing operations.',
  },
  {
    id: 18, question: 'Is cloud hosting included?', categorySlug: 'pricing',
    answer: 'Yes. Cloud hosting is included in all plans. You don\'t need servers, IT staff, or infrastructure — OptiFlow runs in the cloud with enterprise-grade reliability. Data is backed up automatically, and the platform receives continuous security updates without any action from your side.',
  },
  {
    id: 19, question: 'Are product updates included?', categorySlug: 'pricing',
    answer: 'Yes. All product updates, new features, and improvements are included in your annual subscription at no extra cost. You always have access to the latest version of OptiFlow — no upgrade fees, no version lock-in.',
  },
  {
    id: 20, question: 'Is support included?', categorySlug: 'pricing',
    answer: 'Yes. Standard support is included in all plans. Growth plan users get priority support; Scale plan users get a dedicated success manager. Support covers technical issues, training questions, and operational guidance.',
  },
  {
    id: 21, question: 'Do you offer custom plans?', categorySlug: 'pricing',
    answer: 'For businesses with 250+ employees or unique multi-location requirements, we offer custom Enterprise plans. Contact our sales team to discuss your specific needs — we\'ll design a plan that matches your scale and complexity.',
  },
  {
    id: 22, question: 'What payment methods are accepted?', categorySlug: 'pricing',
    answer: 'We accept bank transfers, NEFT/RTGS, UPI, cheques, and all major credit/debit cards. Invoices are GST-compliant and can be issued in your company\'s name. Annual subscriptions are billed upfront; setup fees are invoiced separately upon agreement signing.',
  },

  // Security (10)
  {
    id: 23, question: 'How is our data protected?', categorySlug: 'security',
    answer: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Our cloud infrastructure includes DDoS protection, firewalls, intrusion detection, and continuous security monitoring. Regular penetration testing and security audits ensure your business data stays protected.',
  },
  {
    id: 24, question: 'Where is our data stored?', categorySlug: 'security',
    answer: 'Data is stored on secure cloud servers in India, ensuring compliance with Indian data protection regulations and providing low-latency access for Indian businesses. We never store your data outside the country without explicit consent.',
  },
  {
    id: 25, question: 'Who can access business data?', categorySlug: 'security',
    answer: 'Only users you explicitly add to your OptiFlow organisation can access your data — and what they can see is controlled by role-based permissions. Admins see everything, managers see their department, employees see their own work. OptiFlow staff never access customer data without explicit permission for support purposes.',
  },
  {
    id: 26, question: 'Do you offer role-based permissions?', categorySlug: 'security',
    answer: 'Yes. OptiFlow has three distinct roles — Admin, Manager (Captain), and Employee (Doer) — each with precisely defined access. Department-level permissions add a second layer: a Production manager cannot see HR data, and vice versa. You control exactly who sees what.',
  },
  {
    id: 27, question: 'How do audit logs work?', categorySlug: 'security',
    answer: 'Every action in OptiFlow is logged — task creation, assignment, status changes, verifications, approvals, report access, and configuration changes. Each log entry includes who did what, when, and from which IP address. Audit logs are immutable and cannot be deleted or modified by any user.',
  },
  {
    id: 28, question: 'Is user activity tracked?', categorySlug: 'security',
    answer: 'Yes. Activity logs capture login times, IP addresses, actions performed, and data accessed. This helps with security monitoring, compliance, and investigating any suspicious activity. Admins can review activity logs from the admin dashboard.',
  },
  {
    id: 29, question: 'How secure is authentication?', categorySlug: 'security',
    answer: 'Passwords are hashed using bcrypt. We enforce strong password policies, support account lockout after repeated failed attempts, and offer session management control. Admins can force password resets, lock accounts, and view active sessions for their organisation.',
  },
  {
    id: 30, question: 'Do you provide backups?', categorySlug: 'security',
    answer: 'Yes. Your data is backed up automatically every day with point-in-time recovery. Backups are encrypted and stored in a separate secure facility. In the unlikely event of data loss, we can restore your organisation to any point within the last 30 days.',
  },
  {
    id: 31, question: 'Can data be exported?', categorySlug: 'security',
    answer: 'Yes. You can export task records, attendance data, reports, audit logs, and SOPs in CSV and PDF formats at any time. Your data belongs to you — we never hold it hostage. If you ever decide to leave, we\'ll provide a complete data export within 48 hours.',
  },
  {
    id: 32, question: 'What happens if an employee leaves?', categorySlug: 'security',
    answer: 'Admins can immediately deactivate the account, which revokes all access. Any active tasks assigned to that employee are automatically flagged for reassignment. Historical data (completed tasks, audit trail) remains intact — the employee\'s work record is preserved even after their account is deactivated.',
  },

  // Implementation (10)
  {
    id: 33, question: 'How long does implementation take?', categorySlug: 'implementation',
    answer: 'Most businesses go live within 2-4 weeks. The timeline depends on your organisation size and complexity: Discovery (2-3 days), Setup & Configuration (3-5 days), Data Migration (2-5 days), Training (3-5 days), Go-Live (1-2 days). We structure each phase to minimise disruption to your daily operations.',
  },
  {
    id: 34, question: 'How does onboarding work?', categorySlug: 'implementation',
    answer: 'Onboarding is a structured 5-phase process: (1) Discovery — we understand your operations and map them to OptiFlow, (2) Setup — configure departments, roles, checklists, and workflows, (3) Training — hands-on sessions with managers and employees, (4) Parallel Run — your team uses OptiFlow alongside existing systems for 3-5 days, (5) Go-Live — full switchover with our team on standby.',
  },
  {
    id: 35, question: 'Will my team receive training?', categorySlug: 'implementation',
    answer: 'Yes. Training is part of the setup fee. We train your core team (admins/managers) in-depth, and run hands-on sessions for all employees. Training is practical — we use your actual processes, not generic examples. We also provide video tutorials, user guides, and a knowledge base for ongoing reference.',
  },
  {
    id: 36, question: 'Can you migrate data from Excel?', categorySlug: 'implementation',
    answer: 'Yes. We can import structured Excel data — employee lists, department structures, task templates, and checklist definitions — directly into OptiFlow. Our team handles data cleaning and mapping so your historical information isn\'t lost. We\'ll guide you on what data can be migrated and what format it should be in.',
  },
  {
    id: 37, question: 'Can you help structure our processes?', categorySlug: 'implementation',
    answer: 'Yes — this is a core part of our onboarding. During Discovery, we analyse your current workflows and help you design structured processes inside OptiFlow. We don\'t just install software; we help you think through task ownership, verification chains, checklist design, and reporting cadence so your operations improve, not just digitise.',
  },
  {
    id: 38, question: 'Do you provide post-launch support?', categorySlug: 'implementation',
    answer: 'Yes. Standard support is included in all plans. We provide email, phone, and helpdesk-based support during business hours. Growth plan users get priority response times; Scale plan users get a dedicated success manager who proactively monitors adoption and helps optimise workflows over time.',
  },
  {
    id: 39, question: 'Can multiple locations be onboarded?', categorySlug: 'implementation',
    answer: 'Yes. OptiFlow supports multi-branch and multi-location organisations (Scale plan and above). Each location can have its own department structure, attendance policies, and reporting while rolling up into a central management dashboard. We onboard locations sequentially to maintain quality and minimise disruption.',
  },
  {
    id: 40, question: 'What happens during go-live?', categorySlug: 'implementation',
    answer: 'On go-live day, your team stops using old systems and starts using OptiFlow. Our implementation team is on standby (on-site or remote) for the first 1-2 days to handle any questions, fix configuration issues instantly, and ensure a smooth transition. By day 3, your team operates independently with support available on call.',
  },
  {
    id: 41, question: 'How quickly can we start?', categorySlug: 'implementation',
    answer: 'After you sign up, Discovery typically begins within 3-5 business days. The full implementation timeline is 2-4 weeks from kickoff to go-live. For smaller teams (under 25 employees), we\'ve completed implementations in as little as 10 days.',
  },
  {
    id: 42, question: 'What support channels are available?', categorySlug: 'implementation',
    answer: 'Email support (response within 4-8 business hours), phone support (business hours, Growth and above), helpdesk portal (24/7 ticket submission), knowledge base (self-serve articles and video guides), and WhatsApp support for quick questions. Scale plan users also get a dedicated success manager with direct contact.',
  },
];

export const TROUBLESHOOTING_TREE: Record<string, TroubleshootingCategory> = {
  login: {
    label: 'Login & Access Problems',
    problems: {
      '0': {
        label: 'Forgot password',
        resolution: {
          title: 'Reset Your Password',
          desc: 'Use the "Forgot Password" link on the login page. You\'ll receive a reset email within 2 minutes. If you don\'t see it, check your spam folder.',
          cta: '/contact/',
          ctaLabel: 'Contact Support',
        },
      },
      '1': {
        label: 'Account locked',
        resolution: {
          title: 'Account Locked?',
          desc: 'After 5 failed login attempts, your account locks for 15 minutes. Contact your Admin to unlock it immediately, or wait and try again.',
          cta: '/contact/',
          ctaLabel: 'Contact Admin',
        },
      },
      '2': {
        label: 'Can\'t log in at all',
        resolution: {
          title: 'Login Troubleshooting',
          desc: 'Check: (1) Are you using the correct email? (2) Is Caps Lock off? (3) Clear your browser cache. If still stuck, our support team can help.',
          cta: '/contact/',
          ctaLabel: 'Contact Support',
        },
      },
    },
  },
  task: {
    label: 'Task & Workflow Issues',
    problems: {
      '0': {
        label: 'Task not showing up',
        resolution: {
          title: 'Task Visibility',
          desc: 'Tasks are filtered by department and role. If you can\'t see a task, check: (1) Are you assigned to it? (2) Is it in your department? (3) Is the filter active?',
          cta: '/features/',
          ctaLabel: 'Learn About Tasks',
        },
      },
      '1': {
        label: 'Can\'t mark task complete',
        resolution: {
          title: 'Task Completion',
          desc: 'Some tasks require evidence or checklist completion before they can be marked done. Check if all required fields are filled. If the task is waiting for verification, only the verifier can mark it complete.',
          cta: '/demo-booking/',
          ctaLabel: 'Book Training',
        },
      },
      '2': {
        label: 'Verification not working',
        resolution: {
          title: 'Verification Issues',
          desc: 'Verification follows a defined chain. If you\'re the assigned verifier, check the Verification Queue. If you\'re not seeing items to verify, your role permissions may need updating — contact your Admin.',
          cta: '/contact/',
          ctaLabel: 'Contact Support',
        },
      },
    },
  },
  attendance: {
    label: 'Attendance & Leave Issues',
    problems: {
      '0': {
        label: 'GPS attendance not working',
        resolution: {
          title: 'GPS Attendance Fix',
          desc: 'Ensure: (1) Location permission is enabled in your browser, (2) You\'re within the geofence radius set by your Admin, (3) Your device GPS is turned on. Try refreshing and marking again.',
          cta: '/features/',
          ctaLabel: 'Attendance Guide',
        },
      },
      '1': {
        label: 'Leave not getting approved',
        resolution: {
          title: 'Leave Approval',
          desc: 'Leave requests follow an approval chain: Buddy confirmation → Manager approval. Check if your buddy has confirmed. If pending for more than 24 hours, follow up with your manager directly.',
          cta: '/demo-booking/',
          ctaLabel: 'See Leave Workflow',
        },
      },
      '2': {
        label: 'Wrong attendance count',
        resolution: {
          title: 'Attendance Correction',
          desc: 'Attendance counts are calculated daily. If your count seems wrong, check: (1) Did you mark both check-in and check-out? (2) Were there any half-day or leave entries? Contact HR for corrections.',
          cta: '/contact/',
          ctaLabel: 'Contact Support',
        },
      },
    },
  },
  report: {
    label: 'Reporting & Data Issues',
    problems: {
      '0': {
        label: 'Reports showing no data',
        resolution: {
          title: 'Empty Reports',
          desc: 'Reports use real-time data. If empty, check: (1) Is the date range correct? (2) Do you have data for that period? (3) Are your department filters set correctly?',
          cta: '/features/',
          ctaLabel: 'Reports Guide',
        },
      },
      '1': {
        label: 'Export not working',
        resolution: {
          title: 'Export Issues',
          desc: 'Exports are available in CSV and PDF. If the download doesn\'t start, check your browser\'s pop-up blocker and download settings. Large reports may take 10-15 seconds to generate.',
          cta: '/contact/',
          ctaLabel: 'Contact Support',
        },
      },
    },
  },
  mobile: {
    label: 'Mobile & App Problems',
    problems: {
      '0': {
        label: 'App not loading',
        resolution: {
          title: 'Mobile Access',
          desc: 'OptiFlow works in any mobile browser — no app installation needed. If the page won\'t load, check your internet connection and try clearing your browser cache. Use Chrome or Firefox for best results.',
          cta: '/demo-booking/',
          ctaLabel: 'Get Setup Help',
        },
      },
      '1': {
        label: 'Selfie verification failing',
        resolution: {
          title: 'Selfie Verification',
          desc: 'Ensure: (1) Your face is clearly visible and well-lit, (2) The camera permission is granted, (3) You\'re not wearing anything that obscures your face. Retry in good lighting conditions.',
          cta: '/contact/',
          ctaLabel: 'Contact Support',
        },
      },
    },
  },
};

export const SEARCH_SUGGESTIONS = [
  'Implementation time',
  'Per-user pricing',
  'Attendance tracking',
  'Data security',
  'Mobile app',
  'Integration',
];

export const FAQ_ESCALATION_CHANNELS: EscalationChannel[] = [
  {
    icon: 'demo',
    title: 'Book a Demo',
    description: 'See OptiFlow in action with a personalised walkthrough.',
    ctaLabel: 'Book Demo',
    ctaHref: '/demo-booking/',
    variant: 'secondary',
  },
  {
    icon: 'email',
    title: 'Email Us',
    description: 'Drop us a message and we\'ll respond within 4-8 business hours.',
    ctaLabel: 'Contact Form',
    ctaHref: '/contact/',
    variant: 'secondary',
  },
  {
    icon: 'whatsapp',
    title: 'WhatsApp',
    description: 'Quick questions? Message us on WhatsApp for a fast response.',
    ctaLabel: 'Chat Now',
    ctaHref: 'https://wa.me/917874677836',
    variant: 'secondary',
    isExternal: true,
  },
  {
    icon: 'phone',
    title: 'Call Us',
    description: 'Talk to our team directly during business hours.',
    ctaLabel: 'Call +91 7874677836',
    ctaHref: 'tel:+917874677836',
    variant: 'secondary',
  },
];
