import { test, expect } from '@playwright/test';

test.describe('Responsive', () => {
  test('mobile drawer opens at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.click('#hamburger');
    await expect(page.locator('.mobile-drawer')).toHaveClass(/open/);
    await expect(page.locator('#drawerOverlay')).toHaveClass(/active/);
  });

  test('hamburger visible at mobile, hidden at desktop', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('#hamburger')).toBeVisible();
    await expect(page.locator('.desktop-nav')).toBeHidden();
  });

  test('hamburger hidden at desktop, desktop nav visible', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await expect(page.locator('#hamburger')).toBeHidden();
    await expect(page.locator('.desktop-nav')).toBeVisible();
  });

  test('no horizontal overflow at any breakpoint', async ({ page }) => {
    const breakpoints = [
      { width: 375, height: 812 },
      { width: 480, height: 896 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1280, height: 720 },
      { width: 1440, height: 900 },
    ];

    for (const { width, height } of breakpoints) {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
    }
  });
});
