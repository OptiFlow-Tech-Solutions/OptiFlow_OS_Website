import { test, expect } from '@playwright/test';

const PAGES = [
  '/',
  '/features/',
  '/pricing/',
  '/why-optiflow/',
  '/problem-solutions/',
  '/product-overview/',
  '/newsletter/',
  '/faq/',
  '/contact/',
  '/demo-booking/',
  '/privacy-policy/',
  '/terms/',
];

test.describe('Core assets', () => {
  for (const path of PAGES) {
    test(`core.css loads: ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(
        page.locator('link[rel="stylesheet"][href="/assets/css/core.css"]')
      ).toHaveAttribute('href', '/assets/css/core.css');
    });

    test(`core.js loads: ${path}`, async ({ page }) => {
      await page.goto(path);
      const script = page.locator('script[src="/assets/js/core.js"]');
      await expect(script).toHaveAttribute('src', '/assets/js/core.js');
    });

    test(`footer present: ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('.pagefoot')).toBeVisible();
    });
  }

  test('logo image loads on homepage', async ({ page }) => {
    await page.goto('/');
    const logo = page.locator('.logo-img');
    await expect(logo).toBeVisible();
    const naturalWidth = await logo.evaluate((img) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });
});
