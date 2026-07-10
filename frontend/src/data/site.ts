export const site = {
  name: 'OptiFlow OS',
  company: 'OptiFlow Tech Solutions',
  phone: '+91 7874677836',
  phoneTel: '+917874677836',
  email: 'info@optiflow.co.in',
  whatsapp: '+917874677836',
  location: 'Surat, Gujarat, India',
  domain: 'optiflow.in',
  tagline: 'The Business Operating System for Indian MSMEs. Move from people-dependent operations to process-driven growth.',
  year: 2026,
  response: {
    sales: '1 Business Day',
    support: '4–8 Hours',
    critical: 'Priority Escalation',
    demo: 'Fast Scheduling',
  },
  stats: {
    businesses: '500+',
    users: '10,000+',
    tasks: '500,000+',
    departments: '1,200+',
  },
};

export interface NavLink {
  label: string;
  href: string;
}

export interface NavDropdown {
  label: string;
  items: NavLink[];
}

export interface NavCTA {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Solutions', href: '/problem-solutions' },
  { label: 'Product', href: '/product-overview' },
  { label: 'Features', href: '/features' },
  { label: 'Showcase', href: '/feature-showcase' },
  { label: 'Why OptiFlow', href: '/why-optiflow' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
];

export const navDropdown: NavDropdown = {
  label: 'Resources',
  items: [
    { label: 'Newsletter', href: '/newsletter' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Competitive Positioning', href: '/competitive-positioning' },
  ],
};

export const navCTA: NavCTA = { label: 'Book Demo', href: '/demo-booking' };

export interface FooterColumn {
  title: string;
  links: { label: string; href?: string }[];
}

export const footerColumns: FooterColumn[] = [
  { title: 'Product', links: [
    { label: 'Overview', href: '/product-overview' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Book Demo', href: '/demo-booking' },
  ]},
  { title: 'Solutions', links: [
    { label: 'Problem & Solutions', href: '/problem-solutions' },
    { label: 'Why OptiFlow', href: '/why-optiflow' },
  ]},
  { title: 'Resources', links: [
    { label: 'Newsletter', href: '/newsletter' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Competitive Positioning', href: '/competitive-positioning' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ]},
  { title: 'Contact', links: [
    { label: '+91 7874677836', href: 'tel:+917874677836' },
    { label: 'info@optiflow.co.in', href: 'mailto:info@optiflow.co.in' },
    { label: 'Surat, Gujarat, India' },
  ]},
];
