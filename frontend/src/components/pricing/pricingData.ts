export interface PlanData {
  name: string;
  annual: number;
  setupFee: number;
  teamRange: string;
  teamSlug: string;
  features: string[];
  businessValue: string[];
  featured: boolean;
}

export const PLANS: PlanData[] = [
  {
    name: 'Starter',
    annual: 49000,
    setupFee: 25000,
    teamRange: 'Up to 25 team members',
    teamSlug: '≤25 users',
    features: [
      'Task Management, Worklists, Checklists',
      'Attendance, Leave Management',
      'SOP Management, Training, Helpdesk',
      'Reports, Cloud Hosting, Standard Support',
    ],
    businessValue: [
      'Bring operations into one system',
      'Reduce follow-ups by 60-80%',
      'Standardize work processes',
      'Better attendance tracking',
      'Save 15-20 management hrs/month',
    ],
    featured: false,
  },
  {
    name: 'Growth',
    annual: 79000,
    setupFee: 40000,
    teamRange: '26 to 100 team members',
    teamSlug: '26-100 users',
    features: [
      'Advanced Reporting, Approval Management',
      'Multi-Department Workflows',
      'Process Automation, Priority Support',
    ],
    businessValue: [
      'Cross-team coordination',
      'Reduce owner dependency by 70%',
      'Multi-department visibility',
      'Automated approval workflows',
      'Save 40-60 management hrs/month',
    ],
    featured: true,
  },
  {
    name: 'Scale',
    annual: 149000,
    setupFee: 75000,
    teamRange: '100+ team members',
    teamSlug: '100+ users',
    features: [
      'Multi-Location Operations',
      'Advanced Analytics, Dedicated Success Support',
      'Priority Implementation, Business Process Optimization',
    ],
    businessValue: [
      'Complete organizational visibility',
      'Multi-location standardization',
      'Data-driven decision making',
      'Reduced operational risk',
      'Save 80-120 management hrs/month',
    ],
    featured: false,
  },
];

export type CellState = 'yes' | 'limited' | 'no';

export interface ComparisonRow {
  label: string;
  starter: CellState;
  starterText?: string;
  growth: CellState;
  growthText?: string;
  scale: CellState;
  scaleText?: string;
}

export interface ComparisonSection {
  label: string;
  rows: ComparisonRow[];
}

export const COMPARISON_MATRIX: ComparisonSection[] = [
  {
    label: 'Core Platform',
    rows: [
      { label: 'Task Management', starter: 'yes', growth: 'yes', scale: 'yes' },
      { label: 'Worklists', starter: 'yes', growth: 'yes', scale: 'yes' },
      { label: 'Checklist Management', starter: 'yes', growth: 'yes', scale: 'yes' },
      { label: 'Attendance', starter: 'yes', growth: 'yes', scale: 'yes' },
      { label: 'Leave Management', starter: 'yes', growth: 'yes', scale: 'yes' },
      { label: 'SOP Management', starter: 'yes', growth: 'yes', scale: 'yes' },
      { label: 'Training', starter: 'yes', growth: 'yes', scale: 'yes' },
      { label: 'Helpdesk', starter: 'yes', growth: 'yes', scale: 'yes' },
      { label: 'Reports', starter: 'limited', starterText: 'Basic', growth: 'yes', scale: 'yes' },
    ],
  },
  {
    label: 'Automation & Scale',
    rows: [
      { label: 'Approval Workflows', starter: 'no', growth: 'yes', scale: 'yes' },
      { label: 'Process Automation', starter: 'no', growth: 'yes', scale: 'yes' },
      { label: 'Multi-Location', starter: 'no', growth: 'no', scale: 'yes' },
      { label: 'Advanced Analytics', starter: 'no', growth: 'no', scale: 'yes' },
    ],
  },
  {
    label: 'Support',
    rows: [
      { label: 'Priority Support', starter: 'no', growth: 'yes', scale: 'yes' },
      { label: 'Dedicated Success Manager', starter: 'no', growth: 'no', scale: 'yes' },
    ],
  },
];

export interface TimelineStep {
  num: number;
  title: string;
  description: string;
}

export const TIMELINE_STEPS: TimelineStep[] = [
  { num: 1, title: 'Discovery', description: 'Understand your operations, workflows, and pain points' },
  { num: 2, title: 'Setup', description: 'System configuration, user profiles, department structure' },
  { num: 3, title: 'Configuration', description: 'Custom workflows, SOPs, checklists, approval chains' },
  { num: 4, title: 'Training', description: 'Role-based training for admins, managers, and team members' },
  { num: 5, title: 'Go Live', description: 'Launch with on-ground support and post-go-live check-ins' },
];

export const TIMELINE_METRICS = [
  { value: '2-4', label: 'Weeks to go live', color: 'var(--accent)' },
  { value: '90%+', label: 'Adoption within first month', color: 'var(--teal)' },
  { value: 'Dedicated', label: 'Implementation support throughout', color: 'var(--green)' },
];

export interface DashboardRow {
  team: number;
  tradValue: number;
  tradLabel: string;
  optiValue: number;
  optiLabel: string;
  saveLabel: string;
  savePct: string;
}

export const DASHBOARD_DATA: DashboardRow[] = [
  { team: 10, tradValue: 144000, tradLabel: '₹1.44L', optiValue: 49000, optiLabel: '₹49K', saveLabel: 'Save ₹95K', savePct: '66%' },
  { team: 25, tradValue: 360000, tradLabel: '₹3.60L', optiValue: 49000, optiLabel: '₹49K', saveLabel: 'Save ₹3.11L', savePct: '86%' },
  { team: 50, tradValue: 720000, tradLabel: '₹7.20L', optiValue: 79000, optiLabel: '₹79K', saveLabel: 'Save ₹6.41L', savePct: '89%' },
  { team: 100, tradValue: 1440000, tradLabel: '₹14.4L', optiValue: 149000, optiLabel: '₹1.49L', saveLabel: 'Save ₹12.9L', savePct: '90%' },
  { team: 200, tradValue: 2880000, tradLabel: '₹28.8L', optiValue: 149000, optiLabel: '₹1.49L', saveLabel: 'Save ₹27.3L', savePct: '95%' },
];

export interface FAQItem {
  q: string;
  a: string;
}

export const PRICING_FAQS: FAQItem[] = [
  { q: 'Are there any hidden charges?', a: 'No hidden charges. The annual subscription, one-time implementation, and any add-on modules are clearly communicated before you sign up. What you see is what you pay.' },
  { q: 'Do you charge per user?', a: 'No. OptiFlow charges by plan tier (team size range), not per individual user. You can add team members within your plan\'s capacity at no extra cost.' },
  { q: 'What is included in implementation?', a: 'Implementation includes system setup, data migration assistance, department configuration, role-based training, workflow setup, and go-live support with post-launch check-ins.' },
  { q: 'Can we upgrade plans later?', a: 'Yes. You can upgrade (or downgrade) at any time. When upgrading mid-year, you only pay the difference. Your data, workflows, and history stay intact.' },
  { q: 'How long does implementation take?', a: 'Implementation typically takes 2—4 weeks depending on team size and process complexity. We follow a structured 5-phase rollout: Discovery → Setup → Configuration → Training → Go Live.' },
  { q: 'Is cloud hosting included?', a: 'Yes. Cloud hosting, product updates, security patches, and standard support are all included in your annual subscription. No separate infrastructure costs.' },
  { q: 'Can multiple branches use the system?', a: 'Yes. The Scale plan supports multi-location operations with centralized visibility. The Growth plan supports multiple departments. Each branch or department can have its own structure, users, and reports — all visible to leadership.' },
];

export interface PhilosophyCard {
  icon: 'users' | 'calendar' | 'cloud' | 'refresh';
  title: string;
  description: string;
}

export const PHILOSOPHY_CARDS: PhilosophyCard[] = [
  { icon: 'users', title: 'Unlimited Users', description: 'No per-user fees. Grow your team without growing your bill.' },
  { icon: 'calendar', title: 'Predictable Budgeting', description: 'One annual payment. Zero surprises. Plan with confidence.' },
  { icon: 'cloud', title: 'Cloud Hosting Included', description: 'No separate infrastructure costs. Always up to date.' },
  { icon: 'refresh', title: 'Updates Included', description: 'Every product update is automatically available.' },
];

export interface SecurityCard {
  icon: 'lock' | 'audit' | 'shield';
  title: string;
  description: string;
}

export const SECURITY_CARDS: SecurityCard[] = [
  { icon: 'lock', title: 'Role-Based Access', description: 'Admin, Captain, Doer — each role sees only what they need.' },
  { icon: 'audit', title: 'Complete Audit Logs', description: 'Every action tracked, timestamped, and attributable — audit-ready always.' },
  { icon: 'shield', title: 'Secure Infrastructure', description: 'Encrypted data, secure authentication, cloud infrastructure with enterprise-grade protection.' },
];

export const TRUST_BADGES_PRICING = [
  'No Per-User Charges', 'Cloud Hosting Included', 'Support Included', 'Fixed Annual Pricing',
];

export const CALCULATOR = {
  teamSize: { min: 5, max: 200, default: 50, step: 1 },
  perUserCost: { min: 199, max: 5000, default: 999, step: 50 },
} as const;

export function selectPlan(teamSize: number): PlanData {
  if (teamSize <= 25) return PLANS[0];
  if (teamSize <= 100) return PLANS[1];
  return PLANS[2];
}

export function calcSavings(teamSize: number, perUserCost: number) {
  const tradAnnual = teamSize * perUserCost * 12;
  const plan = selectPlan(teamSize);
  const optiTotal = plan.annual + plan.setupFee;
  const savings = Math.max(0, tradAnnual - optiTotal);
  const pct = tradAnnual > 0 ? Math.round((savings / tradAnnual) * 100) : 0;
  const effectivePerUser = Math.round(optiTotal / teamSize / 12);
  return { tradAnnual, optiTotal, savings, pct, effectivePerUser, plan };
}

export function fmtINR(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}

export function fmtINRLakhs(n: number): string {
  return '₹' + (n / 100000).toFixed(1) + 'L';
}
