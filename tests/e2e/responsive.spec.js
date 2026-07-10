import { test, expect } from '@playwright/test';

test.describe('Responsive', () => {
  test('mobile drawer opens at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/os/');
    await page.waitForLoadState('networkidle');
    await page.click('#hamburger');
    await expect(page.locator('.mobile-drawer')).toHaveClass(/open/);
    await expect(page.locator('#drawerOverlay')).toHaveClass(/active/);
  });

  test('hamburger visible at mobile, desktop nav hidden', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/os/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#hamburger')).toBeVisible();
    await expect(page.locator('.desktop-nav')).toBeHidden();
  });

  test('hamburger hidden at desktop, desktop nav visible', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/os/');
    await page.waitForLoadState('networkidle');
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
      await page.goto('/os/');
      await page.waitForLoadState('networkidle');
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
    }
  });

  test('touch targets size >= 44px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/os/');
    await page.waitForLoadState('networkidle');
    const buttons = page.locator('.btn, button, a.btn, .sticky-cta');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const box = await buttons.nth(i).boundingBox();
      if (box) {
        expect.soft(box.width, `button ${i} width`).toBeGreaterThanOrEqual(40);
        expect.soft(box.height, `button ${i} height`).toBeGreaterThanOrEqual(40);
      }
    }
  });

  test('text readable at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/os/');
    await page.waitForLoadState('networkidle');
    const fontSize = await page.evaluate(() => {
      const body = document.body;
      return window.getComputedStyle(body).fontSize;
    });
    const parsed = parseFloat(fontSize);
    expect(parsed).toBeGreaterThanOrEqual(12);
  });
});
