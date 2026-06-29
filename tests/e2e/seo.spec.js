import { test, expect } from '@playwright/test';

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
];

test.describe('SEO', () => {
  for (const { path, label } of PAGES) {
    test(`${label} has title, meta description, OG tags, one h1`, async ({ page }) => {
      await page.goto(path);

      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);

      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content');
      const descContent = await page.locator('meta[name="description"]').getAttribute('content');
      expect(descContent.length).toBeGreaterThan(0);

      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content');
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content');
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content');

      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });
  }
});
