import { test, expect } from '@playwright/test';

const PAGES = [
  '/os/',
  '/os/features/',
  '/os/pricing/',
  '/os/why-optiflow/',
  '/os/problem-solutions/',
  '/os/product-overview/',
  '/os/newsletter/',
  '/os/faq/',
  '/os/contact/',
  '/os/demo-booking/',
  '/os/privacy-policy/',
  '/os/terms/',
];

test.describe('Core assets', () => {
  for (const path of PAGES) {
    test(`page renders: ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('#root')).not.toBeEmpty();
    });

    test(`footer present: ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('footer')).toBeVisible();
    });
  }

  test('logo image loads on homepage', async ({ page }) => {
    await page.goto('/os/');
    await page.waitForLoadState('networkidle');
    const logo = page.locator('.logo-img');
    await expect(logo).toBeVisible();
    const naturalWidth = await logo.evaluate((img) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });
});
