import type { DashboardData, PhoneFrameData } from './features';

export interface ShowcaseSolution {
  heading: string;
  body: string;
}

export interface ShowcaseMetric {
  val: string;
  lbl: string;
}

export interface ShowcaseCTA {
  text: string;
  link: string;
  label: string;
}

export interface ShowcaseEntry {
  id: string;
  label: string;
  heading: string;
  lead: string;
  problem: string;
  cost: string;
  solutions: ShowcaseSolution[];
  metrics: ShowcaseMetric[];
  dashboard: DashboardData;
  phoneFrame?: PhoneFrameData;
  visualSide: 'left' | 'right';
  cta: ShowcaseCTA;
  /** Extra content rendered between CTA and dashboard for special layouts (e.g. leave buddy block) */
  extraVisual?: true;
}

const showcase: ShowcaseEntry[] = [
  {
    id: 'task',
    label: 'Tasks',
    heading: 'From WhatsApp Chaos To Verified Execution.',
    lead: 'Stop losing tasks in group chats. Every assignment gets an owner, a deadline, evidence, and verification — with real-time visibility for the owner.',
    problem: '"Did you do what I asked?" — the most repeated question in MSMEs. Tasks are assigned verbally or in WhatsApp groups. By lunch, 40% are forgotten. Zero traceability. Zero accountability.',
    cost: 'Cost: 2-4 hours/day in follow-ups',
    solutions: [
      { heading: 'WWHWE Framework', body: 'What, Who, How, When, Evidence — every task created with a complete brief. No ambiguity, no back-and-forth.' },
      { heading: 'Verification Workflow', body: 'Captain approves or rejects each task. Nothing is "done" until it\'s verified. Closed-loop execution.' },
    ],
    metrics: [
      { val: '94%', lbl: 'On-Time Rate' },
      { val: '0', lbl: 'Missed Tasks' },
      { val: '3.5hrs', lbl: 'Saved Daily' },
    ],
    dashboard: {
      metrics: [
        { val: '142', lbl: 'Active Tasks' },
        { val: '28', lbl: 'Done Today' },
        { val: '94%', lbl: 'On-Time' },
      ],
      cols: 4,
      rows: [
        { cols: ['QC inspection — Line 3', 'Ramesh K.', 'Today', 'done'] },
        { cols: ['Update SOP v2.1', 'Priya M.', 'Tomorrow', 'done'] },
        { cols: ['Vendor dispatch — #482', 'Anil S.', 'Jun 26', 'pending'] },
        { cols: ['Attendance reconciliation', 'Deepa R.', 'Today', 'pending'] },
      ],
    },
    phoneFrame: {
      title: 'My Tasks — Today',
      rows: [90, 95, 75, 100, 85, 65],
      buttonColor: 'var(--accent)',
    },
    visualSide: 'right',
    cta: { text: 'Stop chasing people for updates. Every task tracked, every outcome verified.', link: '/os/demo-booking/', label: 'See Task Management Live' },
  },
  {
    id: 'attendance',
    label: 'Attendance',
    heading: 'Attendance You Can Trust. Payroll You Don\'t Question.',
    lead: 'GPS-based check-in, selfie verification, and shift tracking that eliminates buddy punching and gives HR payroll-ready data every month.',
    problem: '"How many people actually came today?" requires 3 phone calls to answer. Buddy punching is common. Payroll takes hours of manual reconciliation.',
    cost: 'Cost: 6-8 hours/month on payroll',
    solutions: [
      { heading: 'GPS + Selfie Check-In', body: 'Field staff punch in from locations. Selfie confirms identity. No one can punch for someone else.' },
      { heading: 'Shift Auto-Assignment', body: 'Morning, General, Evening, Night — assigned automatically. Late arrivals flagged instantly.' },
    ],
    metrics: [
      { val: '100%', lbl: 'Payroll Accuracy' },
      { val: '0', lbl: 'Buddy Punches' },
      { val: '6hrs', lbl: 'Saved Monthly' },
    ],
    dashboard: {
      metrics: [
        { val: '47', lbl: 'Present' },
        { val: '6', lbl: 'On Leave' },
        { val: '2', lbl: 'Late' },
      ],
      cols: 4,
      rows: [
        { cols: ['Rajesh P.', 'Morning', '8:52 AM', 'On-site'] },
        { cols: ['Meena S.', 'Morning', '9:03 AM', 'On-site'] },
        { cols: ['Vikram D.', 'General', '9:58 AM', 'WFH'] },
        { cols: ['Anita K.', 'Evening', '—', 'muted:Not yet'] },
      ],
    },
    phoneFrame: {
      title: 'Attendance',
      rows: [70, 60, 80],
      buttonColor: 'var(--green)',
      extra: 'Punched in at 8:52 AM',
    },
    visualSide: 'left',
    cta: { text: 'Real-time attendance visibility. Zero payroll disputes.', link: '/os/demo-booking/', label: 'Explore Attendance' },
  },
  {
    id: 'sop',
    label: 'SOPs',
    heading: 'Don\'t Let Your Best Operator\'s Knowledge Walk Out The Door.',
    lead: 'Capture every process, version every update, and track who acknowledged each SOP. When your star operator takes leave, the process stays.',
    problem: '"Only Rajesh knows how to set up Line 3." Rajesh takes a sick day. Production drops to 60%. Why? Because the process lived in his head — not in the system.',
    cost: 'Cost: ₹12,000+ per incident in lost output',
    solutions: [
      { heading: 'Central SOP Library', body: 'Searchable by department, keyword, or linked task. Every process documented and accessible to everyone.' },
      { heading: 'Version Control + Ack Tracking', body: 'Every edit is versioned. Track who read and acknowledged each version. Prove training compliance.' },
    ],
    metrics: [
      { val: '3x', lbl: 'Faster Onboarding' },
      { val: '47', lbl: 'SOPs Live' },
      { val: '0%', lbl: 'Knowledge Loss' },
    ],
    dashboard: {
      metrics: [
        { val: '47', lbl: 'Published SOPs' },
        { val: '12', lbl: 'Departments' },
        { val: 'v2.4', lbl: 'Latest Version' },
      ],
      cols: 5,
      rows: [
        { cols: ['Machine startup — Line 1', 'Production', 'v2.4', 'ack:18/18'] },
        { cols: ['Dispatch quality gate', 'Logistics', 'v1.8', 'ack:12/12'] },
        { cols: ['Purchase approval flow', 'Admin', 'v3.1', 'ack:14/16'] },
      ],
    },
    phoneFrame: {
      title: 'SOP: Machine Setup',
      rows: [50, 90, 85, 70, 100, 80, 60],
    },
    visualSide: 'right',
    cta: { text: 'Institutional knowledge belongs in the system, not in one person\'s head.', link: '/os/demo-booking/', label: 'Explore SOP Library' },
  },
  {
    id: 'reports',
    label: 'Reports',
    heading: 'From Gut-Feel Decisions To Data-Driven Management.',
    lead: 'Task completion rates, attendance trends, department performance, SOP adherence — every metric you need to run a data-driven MSME on one dashboard.',
    problem: '"Which department is performing?" can\'t be answered without spending 3 hours in Excel. Most MSMEs run on gut feel — not data.',
    cost: 'Cost: Blind spots across departments',
    solutions: [
      { heading: 'Daily Task Reports', body: 'Assigned, completed, delayed, escalated — per person, per department. Exportable in one click.' },
      { heading: 'Performance Dashboards', body: 'Compare departments, spot bottlenecks, celebrate top performers. Decisions backed by data, not instinct.' },
    ],
    metrics: [
      { val: '₹3.2L', lbl: 'Saved This Quarter' },
      { val: '100%', lbl: 'Audit Ready' },
      { val: '3hrs', lbl: 'Reporting Saved/Week' },
    ],
    dashboard: {
      metrics: [
        { val: '92%', lbl: 'Task Completion' },
        { val: '87%', lbl: 'On-Time Delivery' },
        { val: '100%', lbl: 'Audit Trail' },
        { val: '₹3.2L', lbl: 'Saved (Q2)' },
      ],
      cols: 4,
      rows: [],
    },
    visualSide: 'right',
    cta: { text: 'Stop guessing. Start measuring. Every decision backed by data.', link: '/os/demo-booking/', label: 'See Reports Live' },
  },
  {
    id: 'checklist',
    label: 'Checklists',
    heading: 'Never Miss A Daily Discipline Again.',
    lead: 'Recurring checklists auto-generate on schedule. Every item confirmed. Every gap visible. Turn operational discipline from memory-dependent to system-automatic.',
    problem: 'A production manager forgets the morning QC checklist. By noon, 3 hours of defective output has been produced — and no one knew until the customer complained.',
    cost: 'Cost: ₹12,000+ in material waste per incident',
    solutions: [
      { heading: 'Auto-Generated Checklists', body: 'Daily, weekly, monthly checklists appear automatically. No one needs to remember to start them.' },
      { heading: 'Real-Time Compliance Gaps', body: 'Supervisor dashboard shows which departments completed checklists and which haven\'t — instantly.' },
    ],
    metrics: [
      { val: '98%', lbl: 'Adherence Rate' },
      { val: '18', lbl: 'Active Checklists' },
      { val: '0', lbl: 'Missed QC Incidents' },
    ],
    dashboard: {
      metrics: [
        { val: '18', lbl: 'Active' },
        { val: '98%', lbl: 'Adherence' },
        { val: '847', lbl: 'Checks/Week' },
      ],
      cols: 4,
      rows: [
        { cols: ['Shop floor opening', 'Production', 'Daily', 'bar:52'] },
        { cols: ['Machine maint — Line 1', 'Maintenance', 'Weekly', 'bar:32'] },
        { cols: ['Dispatch quality gate', 'Logistics', 'Daily', 'bar:42'] },
      ],
    },
    phoneFrame: {
      title: 'Today\'s Checklist',
      rows: [90, 85, 75, 95],
    },
    visualSide: 'right',
    cta: { text: 'Operational discipline, automated. Zero manual reminders.', link: '/os/demo-booking/', label: 'Explore Checklists' },
  },
  {
    id: 'leave',
    label: 'Leave',
    heading: 'Leave Shouldn\'t Mean Lost Work.',
    lead: 'When someone takes leave, their tasks auto-reassign to a designated buddy. Critical checklists don\'t stall. Operations continue without the owner making panicked phone calls.',
    problem: 'A key operator takes 2 days off. 3 critical tasks stall. 2 checklists go undone. The production line loses 4 hours of productive time because no one knew what was pending.',
    cost: 'Cost: 4+ hours of lost productivity per leave event',
    solutions: [
      { heading: 'Buddy Auto-Assignment', body: 'When leave is approved, active tasks auto-reassign. Buddy gets notified. No gap. No panic.' },
      { heading: 'Leave Calendar + Analytics', body: 'Team visibility. Managers plan around absence, not react to it. Leave patterns inform hiring.' },
    ],
    metrics: [
      { val: '0', lbl: 'Lost Work Hours' },
      { val: '100%', lbl: 'Task Continuity' },
      { val: 'Instant', lbl: 'Reassignment' },
    ],
    dashboard: {
      cols: 3,
      rows: [
        { cols: ['QC — Batch #T-482', 'Ruchi Mehta', 'done'] },
        { cols: ['Checklist — shop floor', 'Ruchi Mehta', 'pending'] },
        { cols: ['Vendor follow-up — ABC', 'Ruchi Mehta', 'pending'] },
      ],
    },
    phoneFrame: {
      title: 'Leave Request',
      rows: [60, 80, 70, 50],
      buttonColor: 'var(--green)',
      extra: 'Jun 28-29 (2 days)',
    },
    extraVisual: true,
    visualSide: 'left',
    cta: { text: 'Leave without losing momentum. Every task keeps moving.', link: '/os/demo-booking/', label: 'See Leave Management' },
  },
];

export default showcase;
