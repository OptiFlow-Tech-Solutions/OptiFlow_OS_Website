import { test, expect } from '@playwright/test';

const PAGES = [
  { path: '/os/', title: 'OptiFlow OS' },
  { path: '/os/features/', title: 'Features' },
  { path: '/os/pricing/', title: 'Pricing' },
  { path: '/os/why-optiflow/', title: 'Why OptiFlow' },
  { path: '/os/problem-solutions/', title: 'Problems & Solutions' },
  { path: '/os/product-overview/', title: 'Product Overview' },
  { path: '/os/newsletter/', title: 'Newsletter' },
  { path: '/os/faq/', title: 'FAQ' },
  { path: '/os/contact/', title: 'Contact' },
  { path: '/os/demo-booking/', title: 'Book a Demo' },
  { path: '/os/privacy-policy/', title: 'Privacy Policy' },
  { path: '/os/terms/', title: 'Terms' },
];

test.describe('Navigation', () => {
  for (const { path } of PAGES) {
    test(`page loads: ${path} (200, title, nav)`, async ({ page }) => {
      const res = await page.goto(path);
      await page.waitForLoadState('networkidle');
      expect(res?.status()).toBe(200);
      await expect(page).not.toHaveTitle('');
      await expect(page.locator('nav')).toBeVisible();
    });
  }

  test.describe('Desktop nav links', () => {
    test('click each nav link from homepage', async ({ page }) => {
      await page.goto('/os/');
      await page.waitForLoadState('networkidle');
      const links = page.locator('.desktop-nav .nav-link, nav .nav-link');
      const count = await links.count();
      const hrefs = [];
      for (let i = 0; i < count; i++) {
        const href = await links.nth(i).getAttribute('href');
        if (href) hrefs.push(href);
      }
      for (const href of hrefs) {
        await page.click(`a[href="${href}"]`);
        await page.waitForURL(`**${href}`);
        await expect(page.locator('nav')).toBeVisible();
      }
    });

    test('dropdown menu opens on hover', async ({ page }) => {
      await page.goto('/os/');
      await page.waitForLoadState('networkidle');
      const dropdown = page.locator('.nav-dropdown');
      await dropdown.hover();
      await expect(page.locator('.nav-dropdown-menu')).toBeVisible();
    });
  });

  test.describe('Mobile nav drawer', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('all nav links present in mobile drawer', async ({ page }) => {
      await page.goto('/os/');
      await page.waitForLoadState('networkidle');
      await page.click('#hamburger');
      await expect(page.locator('.mobile-drawer')).toHaveClass(/open/);
      const links = page.locator('.mobile-drawer a');
      const count = await links.count();
      expect(count).toBeGreaterThanOrEqual(7);
    });
  });

  test.describe('Theme toggle', () => {
    test('toggles dark/light and persists across reload', async ({ page }) => {
      await page.goto('/os/');
      await page.waitForLoadState('networkidle');
      const html = page.locator('html');

      await page.click('.theme-toggle');
      await expect(html).toHaveAttribute('data-theme', 'dark');

      await page.reload();
      await page.waitForLoadState('networkidle');
      await expect(html).toHaveAttribute('data-theme', 'dark');

      await page.click('.theme-toggle');
      await expect(html).toHaveAttribute('data-theme', 'light');

      await page.reload();
      await page.waitForLoadState('networkidle');
      await expect(html).toHaveAttribute('data-theme', 'light');
    });
  });

  test.describe('FAQ accordion', () => {
    test('click opens/closes FAQ item', async ({ page }) => {
      await page.goto('/os/faq/');
      await page.waitForLoadState('networkidle');
      const firstBtn = page.locator('.faq-question').first();
      const firstItem = page.locator('.faq-item').first();

      await firstBtn.click();
      await expect(firstItem).toHaveClass(/open/);
      await expect(firstBtn).toHaveAttribute('aria-expanded', 'true');

      await firstBtn.click();
      await expect(firstItem).not.toHaveClass(/open/);
      await expect(firstBtn).toHaveAttribute('aria-expanded', 'false');
    });
  });
});
