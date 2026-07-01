import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = [
  { path: '/', label: 'Home' },
  { path: '/features/', label: 'Features' },
  { path: '/pricing/', label: 'Pricing' },
  { path: '/why-optiflow/', label: 'Why OptiFlow' },
  { path: '/problem-solutions/', label: 'Problem Solutions' },
  { path: '/product-overview/', label: 'Product Overview' },
  { path: '/newsletter/', label: 'Newsletter' },
  { path: '/faq/', label: 'FAQ' },
  { path: '/contact/', label: 'Contact' },
  { path: '/demo-booking/', label: 'Demo Booking' },
  { path: '/privacy-policy/', label: 'Privacy Policy' },
  { path: '/terms/', label: 'Terms' },
  { path: '/feature-showcase/', label: 'Feature Showcase' },
  { path: '/competitive-positioning/', label: 'Competitive Positioning' },
];

test.describe('Accessibility (axe-core)', () => {
  for (const { path, label } of PAGES) {
    test(`${label} has zero critical/serious violations`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const violations = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );

      expect.soft(violations, `Axe violations on ${path}`).toHaveLength(0);
    });
  }
});
