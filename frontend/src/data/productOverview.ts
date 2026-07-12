// Module data — 12 OptiFlow OS modules (6 visible + 6 expandable)
export interface ModuleData {
  id: string;
  name: string;
  desc: string;
  benefit: string;
  icon: 'check' | 'clock' | 'doc' | 'chart' | 'list' | 'shield' | 'star' | 'mail' | 'sun' | 'checklist' | 'box' | 'verify';
}

export const primaryModules: ModuleData[] = [
  {
    id: 'tasks',
    name: 'Task Management',
    desc: 'Create, assign, track, and verify every task. Each task has an owner, deadline, priority, and verifier. No task falls through cracks.',
    benefit: 'Outcome: Zero missed deliverables. Every task tracked to completion.',
    icon: 'check',
  },
  {
    id: 'attendance',
    name: 'Attendance',
    desc: 'Digital check-in/check-out with location tagging and face verification. Real-time attendance dashboards for every department.',
    benefit: 'Outcome: Eliminate manual registers. Accurate payroll in one click.',
    icon: 'clock',
  },
  {
    id: 'sop',
    name: 'SOP Library',
    desc: 'Document every business process as a standard operating procedure. Version-controlled, searchable, with training records.',
    benefit: 'Outcome: Zero dependency on key employees. Processes survive people.',
    icon: 'doc',
  },
  {
    id: 'reports',
    name: 'Reports &amp; Analytics',
    desc: 'Executive dashboards with real-time metrics. Task completion rates, department performance, attendance trends, audit trails.',
    benefit: 'Outcome: Data-driven decisions. Know exactly what\'s happening across the business.',
    icon: 'chart',
  },
  {
    id: 'worklists',
    name: 'Worklists',
    desc: 'Pre-built task templates for recurring operations. Daily production checklists, shift handover lists, quality inspection workflows.',
    benefit: 'Outcome: Standardise recurring work. 80% fewer checklist errors.',
    icon: 'list',
  },
  {
    id: 'checklists',
    name: 'Checklist Management',
    desc: 'Create, assign, and verify checklists for production, quality, safety, and maintenance. Photo proof capture, timestamped verification.',
    benefit: 'Outcome: 98% checklist compliance. Audit-ready records always available.',
    icon: 'checklist',
  },
];

export const secondaryModules: ModuleData[] = [
  {
    id: 'leaves',
    name: 'Leave Management',
    desc: 'Apply, approve, and track leaves with balance visibility. Auto-deduct from attendance. Team calendar for planning.',
    benefit: 'Outcome: Zero leave disputes. Automated balance tracking.',
    icon: 'sun',
  },
  {
    id: 'training',
    name: 'Training',
    desc: 'Assign SOP-based training modules to employees. Track completion, quiz scores, and re-training schedules.',
    benefit: 'Outcome: Every employee trained on their role. Compliance records always current.',
    icon: 'star',
  },
  {
    id: 'inventory',
    name: 'Inventory',
    desc: 'Track raw materials, finished goods, and consumables. Low-stock alerts, consumption trends, supplier management.',
    benefit: 'Outcome: 15% lower inventory carrying costs. Never run out of critical stock.',
    icon: 'box',
  },
  {
    id: 'meetings',
    name: 'Meetings',
    desc: 'Schedule, track attendance, document minutes, and assign action items. Every meeting drives accountability.',
    benefit: 'Outcome: Meetings produce tasks, not just talk. 100% action-item follow-through.',
    icon: 'checklist',
  },
  {
    id: 'verification',
    name: 'Verification',
    desc: 'Multi-level task and checklist verification. Photo proof, timestamped sign-offs, escalation on rejection.',
    benefit: 'Outcome: Quality assurance built into every process. 90% fewer quality escapes.',
    icon: 'verify',
  },
  {
    id: 'notifications',
    name: 'Notifications',
    desc: 'In-app, email, and SMS alerts for assignments, deadlines, approvals, and escalations. Never miss a follow-up.',
    benefit: 'Outcome: Zero missed deadlines from forgotten tasks. Automated reminders for every stakeholder.',
    icon: 'mail',
  },
];

export const allModules: ModuleData[] = [...primaryModules, ...secondaryModules];

// Architecture node metadata
export interface ArchNodeData {
  id: string;
  name: string;
  desc: string;
  benefit: string;
}

export const archNodes: Record<string, ArchNodeData> = {
  tasks:      { id: 'tasks', name: 'Task Management', desc: 'Create, assign, track, and verify every task across the organisation.', benefit: 'Zero missed deliverables. Every task traced to completion.' },
  worklists:  { id: 'worklists', name: 'Worklists', desc: 'Pre-built task templates for recurring daily, shift, and production operations.', benefit: 'Standardise recurring work. 80% fewer checklist errors.' },
  attendance: { id: 'attendance', name: 'Attendance', desc: 'Digital check-in/out with location tagging and face verification.', benefit: 'Eliminate manual registers. Payroll accuracy in one click.' },
  reports:    { id: 'reports', name: 'Reports &amp; Analytics', desc: 'Executive dashboards with real-time task, attendance, and performance data.', benefit: 'Data-driven decisions. Know exactly what is happening.' },
  analytics:  { id: 'analytics', name: 'Analytics', desc: 'Deep analysis: bottleneck detection, trend identification, predictive insights.', benefit: 'Spot problems before they become crises. 40% fewer escalations.' },
  sop:        { id: 'sop', name: 'SOP Library', desc: 'Version-controlled standard operating procedures with training records.', benefit: 'Zero dependency on key employees. Processes survive people.' },
  training:   { id: 'training', name: 'Training', desc: 'Assign SOP-based training modules. Track completion and quiz scores.', benefit: 'Every employee trained on their role. Compliance records current.' },
  notifications: { id: 'notifications', name: 'Notifications', desc: 'In-app, email, and SMS alerts for assignments, deadlines, and approvals.', benefit: 'Zero missed deadlines. Automated reminders for every stakeholder.' },
  leaves:     { id: 'leaves', name: 'Leave Management', desc: 'Apply, approve, track leaves with balance visibility and team calendar.', benefit: 'Zero leave disputes. Automated balance tracking.' },
  meetings:   { id: 'meetings', name: 'Meetings', desc: 'Schedule, track attendance, document minutes, assign action items.', benefit: 'Meetings produce tasks, not just talk. Action items auto-tracked.' },
  inventory:  { id: 'inventory', name: 'Inventory', desc: 'Track raw materials, finished goods, consumables. Low-stock alerts.', benefit: '15% lower carrying costs. Never run out of critical stock.' },
  verification: { id: 'verification', name: 'Verification', desc: 'Multi-level task and checklist verification with photo proof and timestamps.', benefit: 'Quality assurance in every process. 90% fewer quality escapes.' },
};

// Demo tab content
export interface DemoTabPanel {
  id: 'dashboard' | 'tasks' | 'attendance' | 'reports';
  label: string;
}

export const demoTabs: DemoTabPanel[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'reports', label: 'Reports' },
];

export interface TaskRow {
  name: string;
  owner: { initials: string; color?: string };
  due: string;
  status: 'pending' | 'done' | 'overdue';
}

export interface AttendanceRow {
  name: string;
  initials: string;
  color?: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  time?: string;
}

export const demoDashboardTasks: TaskRow[] = [
  { name: 'Finalise Q3 procurement plan', owner: { initials: 'AK', color: 'var(--accent)' }, due: '15 Jul', status: 'pending' },
  { name: 'Approve vendor payments batch', owner: { initials: 'RS', color: 'var(--teal)' }, due: '14 Jul', status: 'done' },
  { name: 'Monthly inventory reconciliation', owner: { initials: 'PD', color: 'var(--green)' }, due: '13 Jul', status: 'overdue' },
  { name: 'Update SOP for packing QC', owner: { initials: 'VK' }, due: '16 Jul', status: 'pending' },
];

export const demoAttendanceRows: AttendanceRow[] = [
  { name: 'Amit Kumar', initials: 'AK', color: 'var(--accent)', status: 'present' },
  { name: 'Ravi Sharma', initials: 'RS', color: 'var(--teal)', status: 'present' },
  { name: 'Priya Desai', initials: 'PD', color: 'var(--green)', status: 'late', time: '9:45 AM' },
  { name: 'Vikas Kadam', initials: 'VK', status: 'absent' },
  { name: 'Meena Kaur', initials: 'MK', color: 'var(--lime)', status: 'leave' },
  { name: 'Suresh Kumar', initials: 'SK', color: 'var(--accent)', status: 'present' },
];

export const kpiCycleData = {
  completion: [
    { val: '92%', label: 'Completion' },
    { val: '88%', label: 'This Week' },
    { val: '95%', label: 'Last Month' },
  ],
  tasks: [
    { val: '8.2K', label: 'Tasks / Mo' },
    { val: '12.4K', label: 'Peak Month' },
    { val: '6.1K', label: 'Avg Month' },
  ],
  attendance: [
    { val: '47', label: 'Present' },
    { val: '52', label: 'Total Headcount' },
    { val: '90%', label: 'Attendance %' },
  ],
};

// Panel data
export interface PanelFeature {
  text: string;
}

export interface DashboardRow {
  label: string;
  value: string;
}

export interface PanelBenefit {
  icon: string;
  title: string;
  desc: string;
}

export interface PanelData {
  heading: string;
  lead: string;
  features: PanelFeature[];
  dashboardRows: DashboardRow[];
  benefits: PanelBenefit[];
  badge?: { text: string; color: string }[];
  reverse?: boolean;
}

export const adminPanel: PanelData = {
  heading: 'Complete Business Visibility For Owners &amp; Admins',
  lead: 'See everything. Control everything. Measure everything &mdash; from one dashboard built for business owners.',
  features: [
    { text: 'User Management &mdash; Add, remove, and manage every employee.' },
    { text: 'Role Management &mdash; Define Admin, Captain, and Doer access levels.' },
    { text: 'Branch &amp; Department Structure &mdash; Multi-location, multi-department.' },
    { text: 'Attendance Monitoring &mdash; Real-time presence across all locations.' },
    { text: 'Executive Reports &mdash; Task, attendance, and performance reports.' },
    { text: 'Audit Trails &mdash; Every action logged, timestamped, searchable.' },
    { text: 'System Configuration &mdash; Customise workflows to your business.' },
  ],
  dashboardRows: [
    { label: 'Total Employees', value: '52' },
    { label: 'Active Today', value: '47' },
    { label: 'Pending Tasks', value: '142' },
    { label: 'Completed Today', value: '28' },
    { label: 'Overdue Tasks', value: '9' },
    { label: 'Pending Approvals', value: '12' },
    { label: 'Checklist Compliance', value: '98%' },
  ],
  benefits: [
    { icon: '\u25B2', title: 'See Everything', desc: 'Real-time visibility across all departments, branches, and teams from a single dashboard.' },
    { icon: '\u2699', title: 'Control Everything', desc: 'Define roles, permissions, and workflows. The system enforces your business rules &mdash; not the other way around.' },
    { icon: '\u2630', title: 'Measure Everything', desc: 'Task completion, attendance trends, department performance, audit trails &mdash; every metric in one place.' },
  ],
};

export const captainPanel: PanelData = {
  heading: 'Manage Teams With Clarity',
  lead: 'Built for managers, supervisors, and team leads who need to delegate, verify, and report &mdash; without chasing people.',
  features: [
    { text: 'Task Delegation &mdash; Assign work with one click. Set priority, deadline, verifier.' },
    { text: 'Verification Queue &mdash; Review and approve completed work with photo proof.' },
    { text: 'Team Reports &mdash; See who\'s performing, who\'s struggling, what\'s stuck.' },
    { text: 'Checklist Monitoring &mdash; Track daily checklist completion across your team.' },
    { text: 'Leave Approvals &mdash; Approve or reject leave requests. Auto-deduct from attendance.' },
    { text: 'Performance Visibility &mdash; Task completion rates and attendance patterns per employee.' },
  ],
  dashboardRows: [
    { label: 'Team Size', value: '14' },
    { label: 'Tasks Assigned Today', value: '31' },
    { label: 'Pending Verification', value: '8' },
    { label: 'Completed (Verified)', value: '19' },
    { label: 'Leave Requests Pending', value: '2' },
    { label: 'Checklist Compliance', value: '96%' },
    { label: 'Top Performer', value: 'Rajesh K.' },
  ],
  benefits: [
    { icon: '\u21C9', title: 'Less Follow-Up', desc: 'The system auto-reminds, auto-escalates, and auto-tracks. Managers verify outcomes &mdash; not chase status.' },
    { icon: '\u25B2', title: 'More Accountability', desc: 'Every task has an owner and deadline. Every completion needs verification. No ambiguity.' },
    { icon: '\u26A1', title: 'Faster Execution', desc: 'Assign work in seconds. Track progress in real-time. Remove bottlenecks before they become delays.' },
  ],
  reverse: true,
};

export const doerPanel: PanelData = {
  heading: 'One Place For Every Task',
  lead: 'Employees open one app and see exactly what they need to do today. No confusion. No missed work. Clear priorities.',
  features: [
    { text: 'My Task Center &mdash; Today\'s tasks, upcoming deadlines, overdue items.' },
    { text: 'Attendance &mdash; Check in/out with location. View monthly summary.' },
    { text: 'Checklists &mdash; Complete daily production, quality, and safety checklists.' },
    { text: 'Leave Requests &mdash; Apply for leave. Track balance and approval status.' },
    { text: 'Training &mdash; Complete assigned SOP training modules and quizzes.' },
    { text: 'Meetings &mdash; View schedule, confirm attendance, access meeting notes.' },
  ],
  dashboardRows: [
    { label: 'Today\'s Tasks', value: '8' },
    { label: 'Completed', value: '3' },
    { label: 'Pending', value: '5' },
    { label: 'Overdue', value: '1' },
    { label: 'Attendance Status', value: 'Present' },
    { label: 'Leave Balance', value: '12 days' },
  ],
  badge: [
    { text: 'Desktop', color: 'var(--accent)' },
    { text: 'Mobile', color: 'var(--teal)' },
  ],
  benefits: [
    { icon: '\u2603', title: 'Clear Priorities', desc: 'Open the app. See today\'s tasks. No searching WhatsApp. No asking the manager. Everything is right there.' },
    { icon: '\u2713', title: 'No Confusion', desc: 'Every task has instructions, deadlines, and checklists. Employees know exactly what "done" looks like.' },
    { icon: '\u25B2', title: 'Better Productivity', desc: 'Less time figuring out what to do. More time doing it. Daily task completion rates improve within the first week.' },
  ],
};

// Workflow steps
export interface WorkflowStep {
  num: number;
  title: string;
  desc: string;
  example: string;
}

export const workflowSteps: WorkflowStep[] = [
  { num: 1, title: 'Create Workflow', desc: 'Define the process: tasks, sequence, checklists, verifiers, and deadlines.', example: 'e.g. Daily Production QC' },
  { num: 2, title: 'Assign Doer', desc: 'Assign to individuals or roles. Auto-rotate shifts. Set backup assignees.', example: 'e.g. Shift Supervisor A' },
  { num: 3, title: 'Execute Work', desc: 'Doer completes checklist items with photo proof. System timestamps every action.', example: 'e.g. 14 checklist items completed' },
  { num: 4, title: 'Verify Completion', desc: 'Captain or admin verifies work. Approve, reject with reason, or request re-work.', example: 'e.g. QC Manager approval' },
  { num: 5, title: 'Generate Reports', desc: 'Auto-generated reports: completion rates, compliance %, bottleneck analysis.', example: 'e.g. Weekly QC Dashboard' },
];

// Report types
export interface ReportType {
  label: string;
  icon: 'calendar' | 'users' | 'grid' | 'chart-line' | 'doc-text' | 'bar-chart';
}

export const reportTypes: ReportType[] = [
  { label: 'Task Reports', icon: 'calendar' },
  { label: 'Attendance Reports', icon: 'users' },
  { label: 'Department Reports', icon: 'grid' },
  { label: 'Performance Reports', icon: 'chart-line' },
  { label: 'Audit Reports', icon: 'doc-text' },
  { label: 'Analytics Reports', icon: 'bar-chart' },
];

// Vision cards
export interface VisionCard {
  icon: string;
  title: string;
  desc: string;
}

export const visionCards: VisionCard[] = [
  { icon: '\u25CF', title: 'Single Source of Truth', desc: 'No more scattered data across WhatsApp, Excel, and employee memory. Every task, report, and approval lives in one place.' },
  { icon: '\u25B2', title: 'Operational Excellence', desc: 'Standardise how work gets done. SOPs, checklists, and workflows ensure consistency &mdash; even when key people are absent.' },
  { icon: '\u2191', title: 'Business Scalability', desc: 'Growing from 20 to 200 employees without adding management layers. The system scales &mdash; not the chaos.' },
  { icon: '\u2699', title: 'Process-Driven Culture', desc: 'Shift from "who do I ask?" to "what does the system say?" Build a culture where processes &mdash; not people &mdash; run operations.' },
  { icon: '\u2630', title: 'Visibility &amp; Accountability', desc: 'Every task has an owner, deadline, and status. Owners see what\'s pending. Managers see who\'s accountable. Zero ambiguity.' },
  { icon: '\u2605', title: 'Owner Independence', desc: 'The business runs on systems, not on the owner\'s availability. Take a day off without 47 WhatsApp messages.' },
];

// Permission matrix
export interface PermissionRow {
  module: string;
  employee: { text: string; access: 'limited' | 'none' };
  manager: { text: string; access: 'full' | 'limited' | 'none' };
  admin: { text: string; access: 'full' };
}

export const permissionRows: PermissionRow[] = [
  { module: 'Task Management', employee: { text: 'My Tasks', access: 'limited' }, manager: { text: 'Team + Assign', access: 'full' }, admin: { text: 'Full Access', access: 'full' } },
  { module: 'Attendance', employee: { text: 'Check In/Out', access: 'limited' }, manager: { text: 'Team View', access: 'full' }, admin: { text: 'Full Access', access: 'full' } },
  { module: 'Reports', employee: { text: '\u2014', access: 'none' }, manager: { text: 'Team Only', access: 'limited' }, admin: { text: 'All Reports', access: 'full' } },
  { module: 'SOP Library', employee: { text: 'View', access: 'limited' }, manager: { text: 'View + Assign', access: 'limited' }, admin: { text: 'Create + Edit', access: 'full' } },
  { module: 'Leave Management', employee: { text: 'Apply', access: 'limited' }, manager: { text: 'Approve', access: 'full' }, admin: { text: 'Full Access', access: 'full' } },
  { module: 'Checklists', employee: { text: 'Complete', access: 'limited' }, manager: { text: 'Assign + Verify', access: 'full' }, admin: { text: 'Full Access', access: 'full' } },
  { module: 'Audit Logs', employee: { text: '\u2014', access: 'none' }, manager: { text: '\u2014', access: 'none' }, admin: { text: 'Full Access', access: 'full' } },
  { module: 'System Config', employee: { text: '\u2014', access: 'none' }, manager: { text: '\u2014', access: 'none' }, admin: { text: 'Full Access', access: 'full' } },
];
