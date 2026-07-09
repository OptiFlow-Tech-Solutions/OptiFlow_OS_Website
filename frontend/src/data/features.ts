export interface FeatureCard {
  heading: string;
  body: string;
}

export interface DashboardMetric {
  val: string;
  lbl: string;
}

export interface DashboardRow {
  cols: string[];
}

export interface DashboardData {
  metrics?: DashboardMetric[];
  cols: number;
  rows: DashboardRow[];
}

export interface PhoneFrameData {
  title: string;
  rows: number[];
  buttonColor?: string;
  extra?: string;
}

export type FeatureLayout = 'content-right' | 'content-left' | 'grid-only' | 'process-steps' | 'dashboard-top' | 'mobile';

export interface FeatureEntry {
  id: string;
  label: string;
  heading: string;
  lead: string;
  problem?: string;
  cards: FeatureCard[];
  benefits?: string[];
  cta: { text: string; link: string; label: string };
  dashboard?: DashboardData;
  dashboardSide?: 'left' | 'right';
  processSteps?: { label: string; example: string; active: boolean }[];
  phoneFrames?: PhoneFrameData[];
  layout: FeatureLayout;
}

const features: FeatureEntry[] = [
  {
    id: 'task',
    label: 'Task Mgmt',
    heading: 'Never Lose Track Of Work Again.',
    lead: 'Tasks get forgotten in WhatsApp and verbal communication. OptiFlow gives every task an owner, a deadline, and a verifiable outcome.',
    problem: '&ldquo;Did you do what I asked?&rdquo; is the most repeated question in MSMEs. Verbal task assignment has zero traceability.',
    cards: [
      { heading: 'WWHWE Framework', body: 'What, Who, How, When, Evidence — every task has a complete brief at creation.' },
      { heading: 'Priority &amp; Due Dates', body: 'Urgent, High, Medium, Low — sort and filter by what matters now.' },
      { heading: 'Evidence Uploads', body: 'Photos, PDFs, screenshots — proof of completion attached to every task.' },
      { heading: 'Verification Workflow', body: 'Captain approves or rejects each task before it\'s counted as done.' },
    ],
    benefits: ['Clear Ownership', 'Faster Execution', 'Better Accountability', 'Zero Follow-Ups'],
    cta: { text: 'Stop chasing people for updates. Start seeing exactly what&rsquo;s done.', link: '/os/demo-booking/', label: 'See Task Management Live' },
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
        { cols: ['Vendor dispatch — Order #482', 'Anil S.', 'Jun 26', 'pending'] },
        { cols: ['Attendance reconciliation', 'Deepa R.', 'Today', 'pending'] },
      ],
    },
    dashboardSide: 'right',
    layout: 'content-right',
  },
  {
    id: 'checklist',
    label: 'Checklists',
    heading: 'Build Consistency Into Daily Operations.',
    lead: 'Recurring work shouldn&rsquo;t need to be remembered. Checklists turn daily discipline into automatic habits.',
    problem: 'A production manager forgets the morning QC checklist. By noon, 3 hours of defective output has been produced. Cost: ₹12,000+ in material waste.',
    cards: [
      { heading: 'Daily / Weekly / Monthly', body: 'Checklists auto-generate on schedule. No one needs to remember to start them.' },
      { heading: 'Verification Gates', body: 'Every checklist item must be confirmed. Supervisor sees gaps in real time.' },
      { heading: 'Completion Tracking', body: 'Visual dashboards show which departments are compliant and which are slipping.' },
      { heading: 'Recurring Tasks', body: 'Link checklists to recurring tasks — each morning&rsquo;s checklist creates real tracked work.' },
    ],
    benefits: ['Reduced Errors', 'Process Compliance', 'Operational Discipline'],
    cta: { text: 'Turn daily discipline into automatic systems. Zero manual reminders.', link: '/os/demo-booking/', label: 'Explore Checklists' },
    dashboard: {
      metrics: [
        { val: '18', lbl: 'Active Checklists' },
        { val: '98%', lbl: 'Adherence' },
        { val: '847', lbl: 'Checks This Week' },
      ],
      cols: 4,
      rows: [
        { cols: ['Shop floor opening checklist', 'Production', 'Daily', 'bar:52'] },
        { cols: ['Machine maintenance — Line 1', 'Maintenance', 'Weekly', 'bar:32'] },
        { cols: ['Dispatch quality gate', 'Logistics', 'Daily', 'bar:42'] },
        { cols: ['Month-end inventory check', 'Warehouse', 'Monthly', 'bar:18'] },
      ],
    },
    dashboardSide: 'left',
    layout: 'content-left',
  },
  {
    id: 'delegation',
    label: 'Delegation',
    heading: 'Turn Every Assignment Into Accountability.',
    lead: 'Delegation without verification is just hope. OptiFlow&rsquo;s Delegation Engine closes the loop — assign, execute, verify, report.',
    cards: [
      { heading: 'Delegation Tracker', body: 'Every delegated task has a status: Assigned, In Progress, Submitted, Verified, or Escalated. No task disappears into a black hole.' },
      { heading: 'Verification Queue', body: 'Captains see all tasks awaiting verification in one queue. Approve or reject with one click. Evidence is right there.' },
      { heading: 'Ownership Tracking', body: 'Reports show who completed what, on time vs late, verified vs rejected. Accountability becomes data, not opinion.' },
    ],
    processSteps: [
      { label: 'Create', example: 'Captain assigns task with deadline + evidence requirement', active: true },
      { label: 'Assign Doer', example: 'Task appears in doer&rsquo;s worklist with full context', active: true },
      { label: 'Verify', example: 'Captain approves or rejects based on evidence uploaded', active: false },
      { label: 'Report', example: 'Completion rate visible in real-time dashboard', active: false },
    ],
    cta: { text: 'Delegation without verification is hope. OptiFlow closes every loop.', link: '/os/demo-booking/', label: 'See Delegation In Action' },
    layout: 'process-steps',
  },
  {
    id: 'worklists',
    label: 'Worklists',
    heading: 'One Place For Every Task.',
    lead: 'No more searching WhatsApp, Excel, and memory. The unified Worklist shows every task, checklist, approval, and alert in one screen.',
    problem: 'A doer has tasks in 4 different WhatsApp groups, 2 Excel sheets, and the owner&rsquo;s verbal instructions. Half get forgotten by lunch.',
    cards: [
      { heading: 'Tasks', body: 'Assigned with priority, due date, evidence requirements' },
      { heading: 'Checklists', body: 'Daily and recurring — auto-generated, time-bound' },
      { heading: 'Approvals', body: 'Leave requests, purchase approvals, SOP changes' },
    ],
    benefits: ['Reduced Context Switching', 'Single Source Of Truth', 'Improved Productivity'],
    cta: { text: 'One screen. Every piece of work. Zero confusion.', link: '/os/demo-booking/', label: 'Try Worklists Demo' },
    dashboard: {
      cols: 4,
      rows: [
        { cols: ['accent:Task', 'QC report — Order #921', 'Today 4PM', 'red:High'] },
        { cols: ['teal:Checklist', 'Opening checklist', 'Today 9AM', 'done'] },
        { cols: ['green:Approval', 'Leave — Sanjay T.', 'Tomorrow', 'yellow:Medium'] },
        { cols: ['accent:Task', 'Dispatch schedule update', 'Today 6PM', 'red:High'] },
      ],
    },
    dashboardSide: 'right',
    layout: 'content-right',
  },
  {
    id: 'attendance',
    label: 'Attendance',
    heading: 'Attendance Built For Real Operations.',
    lead: 'GPS-based attendance for field and on-site teams. Selfie verification. Shift tracking. All in one dashboard that HR actually trusts.',
    problem: '&ldquo;How many people actually came to work today?&rdquo; — a question the owner shouldn&rsquo;t need to ask 3 people to answer.',
    cards: [
      { heading: 'GPS Attendance', body: 'Field staff punch in from client locations. Geo-tagged, verifiable.' },
      { heading: 'Selfie Verification', body: 'Photo check-in confirms the right person is at the right place.' },
      { heading: 'Shift Tracking', body: 'Morning, general, evening, night — auto-assigned, auto-tracked.' },
      { heading: 'Payroll-Ready Reports', body: 'Present, absent, late, overtime — exported for payroll in one click.' },
    ],
    benefits: ['Accurate Records', 'Zero Buddy Punching', 'Payroll Accuracy'],
    cta: { text: 'Know who showed up, who didn&rsquo;t, and where — in real time.', link: '/os/demo-booking/', label: 'Explore Attendance' },
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
    dashboardSide: 'left',
    layout: 'content-left',
  },
  {
    id: 'leave',
    label: 'Leave',
    heading: 'Leave Management Without Work Stoppage.',
    lead: 'When someone takes leave, their tasks don&rsquo;t disappear. OptiFlow&rsquo;s Buddy System automatically reassigns work so operations continue uninterrupted.',
    problem: 'A key operator takes leave. No one knows which checklist they were running. Three tasks stall. Production loses 2 hours of line time.',
    cards: [
      { heading: 'Buddy Assignment', body: 'When leave is approved, active tasks auto-reassign to the designated buddy. No gap.' },
      { heading: 'Leave Calendar', body: 'Whole team visible — managers plan around absence, not react to it.' },
      { heading: 'Approval Workflow', body: 'Apply → Manager approves → Buddy notified → Tasks reassigned. One flow.' },
      { heading: 'History &amp; Analytics', body: 'Leave patterns per department. Plan hiring and shift adjustments with data.' },
    ],
    benefits: ['Zero Work Loss', 'Business Continuity', 'Better Planning'],
    cta: { text: 'Leave shouldn&rsquo;t mean lost work. Keep every task moving.', link: '/os/demo-booking/', label: 'See Leave Management' },
    dashboard: {
      cols: 3,
      rows: [
        { cols: ['QC — Batch #T-482', 'Ruchi Mehta', 'done'] },
        { cols: ['Checklist — shop floor', 'Ruchi Mehta', 'pending'] },
        { cols: ['Vendor follow-up — ABC', 'Ruchi Mehta', 'pending'] },
      ],
    },
    dashboardSide: 'left',
    layout: 'content-left',
  },
  {
    id: 'sop',
    label: 'SOPs',
    heading: 'Capture Knowledge. Scale Consistency.',
    lead: 'When your best operator leaves, does the process leave with them? The SOP Library captures institutional knowledge so every new hire operates at your best person&rsquo;s standard.',
    problem: '&ldquo;Only Rajesh knows how to set up Line 3.&rdquo; Rajesh takes a sick day. Line 3 runs at 60% capacity because no one else has the process documented.',
    cards: [
      { heading: 'SOP Library', body: 'Central repository searchable by department, keyword, or linked task. No more dusty binders.' },
      { heading: 'Version Control', body: 'Every edit is tracked. v1.0, v1.1, v2.0 — full history, no confusion about &ldquo;which version is current.&rdquo;' },
      { heading: 'Task-SOP Linking', body: 'Tasks auto-link to the SOP the doer needs to follow. Training happens at the moment of work.' },
      { heading: 'Acknowledgement Tracking', body: 'Track who has read and acknowledged each SOP version. Prove compliance.' },
    ],
    benefits: ['Knowledge Retention', 'Faster Training', 'Standardised Operations'],
    cta: { text: 'Don&rsquo;t lose decades of experience when your best people leave.', link: '/os/demo-booking/', label: 'Explore SOP Library' },
    dashboard: {
      metrics: [
        { val: '47', lbl: 'SOPs Published' },
        { val: '12', lbl: 'Departments' },
        { val: 'v2.4', lbl: 'Latest Version' },
      ],
      cols: 5,
      rows: [
        { cols: ['Machine startup — Line 1', 'Production', 'v2.4', 'ack:18/18', 'done'] },
        { cols: ['Dispatch quality gate', 'Logistics', 'v1.8', 'ack:12/12', 'done'] },
        { cols: ['Purchase approval flow', 'Admin', 'v3.1', 'ack:14/16', 'pending'] },
        { cols: ['New hire onboarding', 'HR', 'v2.0', 'ack:6/6', 'done'] },
      ],
    },
    dashboardSide: 'left',
    layout: 'content-left',
  },
  {
    id: 'training',
    label: 'Training',
    heading: 'Train Teams At Scale.',
    lead: 'Courses, quizzes, certifications, and progress tracking — built into the same platform your team already uses every day.',
    cards: [
      { heading: 'Courses', body: 'Create structured training modules with text, images, videos, and attachments. Assign to individuals or entire departments.' },
      { heading: 'Quizzes &amp; Certifications', body: 'Test understanding after each module. Certifications prove competency — essential for compliance-heavy industries.' },
      { heading: 'Progress Tracking', body: 'Who completed training? Who hasn&rsquo;t? Department-wise completion rates. Audit-ready reports.' },
    ],
    cta: { text: 'Build a learning culture — not just a training calendar.', link: '/os/demo-booking/', label: 'See Training Module' },
    layout: 'grid-only',
  },
  {
    id: 'helpdesk',
    label: 'Helpdesk',
    heading: 'No More Lost Requests.',
    lead: 'IT issues, facility repairs, purchase requests, HR queries — all in one ticketing system with department routing, priority levels, and resolution tracking.',
    cards: [
      { heading: 'Ticket Creation', body: 'Anyone can raise a ticket. Auto-routed to the right department. No more &ldquo;I told someone about this.&rdquo;' },
      { heading: 'Status Tracking', body: 'Open, In Progress, Resolved, Closed. Every ticket has an owner and an SLA. Nothing disappears into a WhatsApp group.' },
      { heading: 'Resolution Analytics', body: 'Average resolution time, tickets per department, recurring issues. Fix root causes, not just symptoms.' },
    ],
    cta: { text: 'Every request tracked. Every resolution measured.', link: '/os/demo-booking/', label: 'Explore Helpdesk' },
    layout: 'grid-only',
  },
  {
    id: 'reports',
    label: 'Reports',
    heading: 'Turn Activity Into Insight.',
    lead: 'Task completion rates, attendance trends, department performance, SOP adherence — every metric you need to run a data-driven MSME.',
    cards: [
      { heading: 'Daily Task Reports', body: 'What was assigned, completed, delayed, escalated — per person, per department. Exportable.' },
      { heading: 'Attendance &amp; Leave Analytics', body: 'Monthly attendance patterns, leave trends, overtime hours. Plan staffing with real data.' },
      { heading: 'Performance Dashboards', body: 'Compare departments, identify bottlenecks, celebrate top performers. Data-driven management, not gut feel.' },
    ],
    cta: { text: 'Stop guessing. Start measuring.', link: '/os/demo-booking/', label: 'See Reports Live' },
    dashboard: {
      metrics: [
        { val: '92%', lbl: 'Task Completion' },
        { val: '87%', lbl: 'On-Time Delivery' },
        { val: '100%', lbl: 'Audit Compliance' },
        { val: '₹3.2L', lbl: 'Cost Saved (Q2)' },
      ],
      cols: 4,
      rows: [],
    },
    layout: 'dashboard-top',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    heading: 'The Right Information At The Right Time.',
    lead: 'Task alerts, approval requests, checklist reminders, leave notifications — multi-channel delivery keeps everyone aligned without the noise.',
    cards: [
      { heading: 'Task Alerts', body: 'New task assigned, deadline approaching, task overdue — relevant alerts to the right person, not the whole company.' },
      { heading: 'Approval Requests', body: 'Manager gets an alert when a leave or purchase request needs sign-off. One tap to approve or reject.' },
      { heading: 'System Updates', body: 'SOP updated, training assigned, checklist auto-generated — automated notifications keep adoption high.' },
    ],
    cta: { text: 'Notifications that inform, not overwhelm.', link: '/os/demo-booking/', label: 'See Notification System' },
    layout: 'grid-only',
  },
  {
    id: 'mobile',
    label: 'Mobile',
    heading: 'Run Operations From Anywhere.',
    lead: 'Full-featured mobile experience built for owners, managers, and field staff who need to act on the go — not just a scaled-down web view.',
    cards: [
      { heading: 'Task Updates', body: 'Mark tasks done, upload evidence, comment — all from phone' },
      { heading: 'GPS Attendance', body: 'Field staff punch in from client sites with geo-tagging' },
      { heading: 'Approvals On-The-Go', body: 'Approve leave, verify tasks, check reports from anywhere' },
    ],
    benefits: ['On-The-Go Visibility', 'Remote Management', 'Faster Response'],
    cta: { text: 'Your operations, in your pocket. Cross-device, always synced.', link: '/os/demo-booking/', label: 'See Mobile Experience' },
    phoneFrames: [
      { title: 'My Tasks — Today', rows: [90, 95, 75, 100, 85, 65, 55], buttonColor: 'var(--accent)' },
      { title: 'Attendance', rows: [70, 60, 80], buttonColor: 'var(--green)', extra: 'Punched in at 8:52 AM' },
    ],
    layout: 'mobile',
  },
];

export default features;
