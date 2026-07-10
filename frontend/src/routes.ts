import { lazy, type ComponentType } from 'react';

export interface RouteConfig {
  path: string;
  title: string;
  description: string;
  component: ComponentType;
}

const routes: RouteConfig[] = [
  {
    path: '/',
    title: 'OptiFlow OS — Business Operating System for Indian MSMEs',
    description: 'OptiFlow OS is the Business Operating System for Indian MSMEs — replace WhatsApp and Excel with one platform. Book a free demo.',
    component: lazy(() => import('./pages/Home')),
  },
  {
    path: '/problem-solutions',
    title: 'Problems & Solutions — OptiFlow OS',
    description: 'See how OptiFlow OS solves the 6 biggest operational challenges Indian MSMEs face daily — from WhatsApp chaos to zero accountability.',
    component: lazy(() => import('./pages/ProblemSolutions')),
  },
  {
    path: '/product-overview',
    title: 'Product Overview — OptiFlow OS',
    description: 'Explore every module of OptiFlow OS — the complete Business Execution platform for MSMEs. Task management, attendance, SOPs, reporting, and more.',
    component: lazy(() => import('./pages/ProductOverview')),
  },
  {
    path: '/features',
    title: 'Features — OptiFlow OS',
    description: 'Detailed feature breakdown of OptiFlow OS — task management, attendance tracking, SOPs, checklists, reports, dashboards, and mobile access.',
    component: lazy(() => import('./pages/Features')),
  },
  {
    path: '/feature-showcase',
    title: 'Feature Showcase — OptiFlow OS',
    description: 'See OptiFlow OS in action — real feature transformations with before/after comparisons and quantified business outcomes for Indian MSMEs.',
    component: lazy(() => import('./pages/FeatureShowcase')),
  },
  {
    path: '/why-optiflow',
    title: 'Why OptiFlow — OptiFlow OS',
    description: 'Why Indian MSMEs choose OptiFlow OS over WhatsApp, Excel, and generic tools. Built for operators with fast ROI, full visibility, and real accountability.',
    component: lazy(() => import('./pages/WhyOptiFlow')),
  },
  {
    path: '/pricing',
    title: 'Pricing & Plans — OptiFlow OS',
    description: 'Simple, transparent pricing for OptiFlow OS. No per-user charges. Starter, Growth, and Scale plans with predictable annual pricing. See how much you save.',
    component: lazy(() => import('./pages/Pricing')),
  },
  {
    path: '/newsletter',
    title: 'Newsletter — OptiFlow OS',
    description: 'Practical strategies, operational frameworks, and business systems designed to help Indian MSMEs scale with accountability and operational excellence.',
    component: lazy(() => import('./pages/Newsletter')),
  },
  {
    path: '/newsletter/:slug',
    title: 'Article — OptiFlow OS',
    description: 'Read the full article from the OptiFlow OS newsletter.',
    component: lazy(() => import('./pages/ArticleDetail')),
  },
  {
    path: '/faq',
    title: 'FAQ & Self-Service — OptiFlow OS',
    description: 'Find answers about OptiFlow OS or use self-service tools — video tutorials, troubleshooting guide, and guided setup. Help yourself, fast.',
    component: lazy(() => import('./pages/FAQ')),
  },
  {
    path: '/contact',
    title: 'Contact — OptiFlow OS',
    description: 'Get in touch with the OptiFlow OS team for demos, sales inquiries, support, or partnership discussions. We respond within one business day.',
    component: lazy(() => import('./pages/Contact')),
  },
  {
    path: '/demo-booking',
    title: 'Book a Demo — OptiFlow OS',
    description: 'Book a free personalized demo of OptiFlow OS and see how our Business Operating System transforms your MSME operations with better accountability.',
    component: lazy(() => import('./pages/DemoBooking')),
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy — OptiFlow OS',
    description: 'OptiFlow OS privacy policy — learn how we collect, use, store, and protect your business and employee data. GDPR and Indian DPDP Act 2023 compliant.',
    component: lazy(() => import('./pages/PrivacyPolicy')),
  },
  {
    path: '/terms',
    title: 'Terms & Conditions — OptiFlow OS',
    description: 'Terms and conditions for using OptiFlow OS — platform usage rules, customer responsibilities, payment terms, data ownership, and governing law.',
    component: lazy(() => import('./pages/Terms')),
  },
  {
    path: '/competitive-positioning',
    title: 'Competitive Positioning — OptiFlow OS',
    description: 'See how OptiFlow OS compares against WhatsApp chaos, generic SaaS tools, traditional ERPs, and manual systems. Feature-by-feature comparison for Indian MSMEs.',
    component: lazy(() => import('./pages/CompetitivePositioning')),
  },
  {
    path: '/500',
    title: 'Server Error — OptiFlow OS',
    description: 'We are experiencing a temporary technical issue. Our team has been notified and is working to resolve it. Contact OptiFlow OS support for help.',
    component: lazy(() => import('./pages/ServerError')),
  },
  {
    path: '*',
    title: 'Page Not Found — OptiFlow OS',
    description: 'The page you\'re looking for doesn\'t exist. Navigate back to explore OptiFlow OS — the Business Execution Operating System for Indian MSMEs.',
    component: lazy(() => import('./pages/NotFound')),
  },
];

export default routes;
