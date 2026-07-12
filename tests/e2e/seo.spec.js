import { test, expect } from '@playwright/test';

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
];

test.describe('SEO', () => {
  for (const { path, label } of PAGES) {
    test(`${label} has title, meta description, h1`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);

      const descMeta = page.locator('meta[name="description"]');
      const descContent = await descMeta.getAttribute('content');
      expect(descContent?.length).toBeGreaterThan(0);

      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });
  }
});
