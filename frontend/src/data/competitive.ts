export interface QuadrantEntry {
  label: string;
  title: string;
  weaknesses: string[];
  advantage: string;
}

export interface MatrixColumn {
  key: string;
  label: string;
  highlight?: boolean;
}

export interface MatrixCell {
  type: 'check' | 'cross' | 'text';
  value?: string;
}

export type MatrixRow = Record<string, MatrixCell>;

export interface CostCardEntry {
  title: string;
  cost: string;
  detail: string;
  bestValue?: boolean;
}

export interface StandoutEntry {
  heading: string;
  body: string;
}

export const quadrantEntries: QuadrantEntry[] = [
  {
    label: 'Category 1',
    title: 'WhatsApp & Excel Chaos',
    weaknesses: [
      'Messages get buried in group chats',
      'No single source of truth for tasks',
      'Zero accountability — "I told you" culture',
    ],
    advantage: 'OptiFlow replaces all chats and sheets with one structured platform.',
  },
  {
    label: 'Category 2',
    title: 'Generic SaaS Tools',
    weaknesses: [
      'Not built for Indian MSME workflows',
      'Per-user pricing kills adoption',
      'No SOP engine, no manufacturing context',
    ],
    advantage: 'OptiFlow is purpose-built for Indian operators with flat pricing.',
  },
  {
    label: 'Category 3',
    title: 'Traditional ERPs',
    weaknesses: [
      '6-12 month implementation timelines',
      '₹5-15L+ annual cost, complex to maintain',
      'Built for accountants, not floor operators',
    ],
    advantage: 'OptiFlow deploys in days, costs a fraction, and operators actually use it.',
  },
  {
    label: 'Category 4',
    title: 'Manual Paper Systems',
    weaknesses: [
      'Registers, whiteboards, sticky notes',
      'No reporting, no trend analysis',
      'Impossible to scale beyond one location',
    ],
    advantage: 'OptiFlow digitizes every register with real-time dashboards.',
  },
];

export const matrixColumns: MatrixColumn[] = [
  { key: 'feature', label: 'Feature' },
  { key: 'optiflow', label: 'OptiFlow OS', highlight: true },
  { key: 'whatsapp', label: 'WhatsApp / Excel' },
  { key: 'saas', label: 'Generic SaaS' },
  { key: 'erp', label: 'Traditional ERP' },
];

export const matrixRows: MatrixRow[] = [
  { feature: { type: 'text', value: 'Task Management' }, optiflow: { type: 'check' }, whatsapp: { type: 'text', value: 'Manual' }, saas: { type: 'check' }, erp: { type: 'check' } },
  { feature: { type: 'text', value: 'Attendance & Geo-tagging' }, optiflow: { type: 'check' }, whatsapp: { type: 'cross' }, saas: { type: 'text', value: 'Add-on' }, erp: { type: 'check' } },
  { feature: { type: 'text', value: 'SOP Builder & Execution' }, optiflow: { type: 'check' }, whatsapp: { type: 'cross' }, saas: { type: 'cross' }, erp: { type: 'text', value: 'Limited' } },
  { feature: { type: 'text', value: 'Real-Time Dashboards' }, optiflow: { type: 'check' }, whatsapp: { type: 'cross' }, saas: { type: 'check' }, erp: { type: 'check' } },
  { feature: { type: 'text', value: 'Mobile-First Access' }, optiflow: { type: 'check' }, whatsapp: { type: 'check' }, saas: { type: 'check' }, erp: { type: 'text', value: 'Desktop' } },
  { feature: { type: 'text', value: 'Checklists & Audits' }, optiflow: { type: 'check' }, whatsapp: { type: 'cross' }, saas: { type: 'text', value: 'Basic' }, erp: { type: 'text', value: 'Module' } },
  { feature: { type: 'text', value: 'Reports & Analytics' }, optiflow: { type: 'check' }, whatsapp: { type: 'cross' }, saas: { type: 'check' }, erp: { type: 'check' } },
  { feature: { type: 'text', value: 'Multi-Location Support' }, optiflow: { type: 'check' }, whatsapp: { type: 'cross' }, saas: { type: 'text', value: 'Add-on' }, erp: { type: 'check' } },
  { feature: { type: 'text', value: 'Role-Based Access' }, optiflow: { type: 'check' }, whatsapp: { type: 'cross' }, saas: { type: 'check' }, erp: { type: 'check' } },
  { feature: { type: 'text', value: 'Leave Management' }, optiflow: { type: 'check' }, whatsapp: { type: 'cross' }, saas: { type: 'text', value: 'Add-on' }, erp: { type: 'check' } },
  { feature: { type: 'text', value: 'Pricing Model' }, optiflow: { type: 'text', value: 'Flat annual' }, whatsapp: { type: 'text', value: 'Hidden cost' }, saas: { type: 'text', value: 'Per user / mo' }, erp: { type: 'text', value: '₹5-15L+ / yr' } },
  { feature: { type: 'text', value: 'Implementation Time' }, optiflow: { type: 'text', value: 'Days' }, whatsapp: { type: 'cross' }, saas: { type: 'text', value: 'Weeks' }, erp: { type: 'text', value: '6-12 months' } },
  { feature: { type: 'text', value: 'Built for Indian MSMEs' }, optiflow: { type: 'check' }, whatsapp: { type: 'text', value: 'Partially' }, saas: { type: 'cross' }, erp: { type: 'cross' } },
];

export const costCardEntries: CostCardEntry[] = [
  {
    title: 'OptiFlow OS',
    cost: '₹15,000 — 45,000',
    detail: 'Flat annual pricing. No per-user charges. Implementation and support included. All modules, unlimited users.',
    bestValue: true,
  },
  {
    title: 'WhatsApp / Excel',
    cost: '₹3 — 8 Lakhs',
    detail: 'Hidden cost of owner time, errors, rework, missed follow-ups. Estimated 60-100 hrs/month of management time lost.',
  },
  {
    title: 'Generic SaaS',
    cost: '₹1.5 — 4.5 Lakhs',
    detail: '₹500–1500/user/month × 25 users. Most tools charge per-user, discouraging full team adoption. Add-ons extra.',
  },
  {
    title: 'Traditional ERP',
    cost: '₹5 — 15 Lakhs',
    detail: 'Implementation + license + annual maintenance. 6-12 month deployment. Requires dedicated IT staff to maintain.',
  },
];

export const standoutEntries: StandoutEntry[] = [
  {
    heading: 'Built for Indian MSMEs',
    body: 'Designed for textile, manufacturing, trading, and logistics operations. Understands Indian workflows — multi-shift attendance, piece-rate tracking, WhatsApp-native communication patterns.',
  },
  {
    heading: 'Flat Pricing — No Per-User Tax',
    body: 'One annual fee covers all modules and all users. Add employees without cost anxiety. Most competitors charge per-user which blocks full adoption in MSMEs.',
  },
  {
    heading: 'Implementation + Support Included',
    body: 'Go live in days, not months. We configure SOPs, onboard your team, and provide ongoing support — all included. No hidden implementation fees, no consulting invoices.',
  },
];
