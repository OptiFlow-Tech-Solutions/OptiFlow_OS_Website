import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = [
  { path: '/os/', label: 'Home' },
  { path: '/os/features/', label: 'Features' },
  { path: '/os/pricing/', label: 'Pricing' },
  { path: '/os/why-optiflow/', label: 'Why OptiFlow' },
  { path: '/os/problem-solutions/', label: 'Problem Solutions' },
  { path: '/os/product-overview/', label: 'Product Overview' },
  { path: '/os/newsletter/', label: 'Newsletter' },
  { path: '/os/faq/', label: 'FAQ' },
  { path: '/os/contact/', label: 'Contact' },
  { path: '/os/demo-booking/', label: 'Demo Booking' },
  { path: '/os/privacy-policy/', label: 'Privacy Policy' },
  { path: '/os/terms/', label: 'Terms' },
  { path: '/os/feature-showcase/', label: 'Feature Showcase' },
  { path: '/os/competitive-positioning/', label: 'Competitive Positioning' },
];

test.describe('Accessibility (axe-core)', () => {
  for (const { path, label } of PAGES) {
    test(`${label} has zero critical/serious violations`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
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
