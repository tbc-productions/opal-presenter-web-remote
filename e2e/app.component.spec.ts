import { expect, test } from 'playwright/test';
import { stubAppBootstrap } from './test-helpers';

test('shows login button and app version when login is required', async ({ page }) => {
  await stubAppBootstrap(page, true);

  await page.goto('/settings');

  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await expect(page.locator('.app-version')).toHaveText('v9.9.9');
});

test('hides login button when login is not required', async ({ page }) => {
  await stubAppBootstrap(page, false);

  await page.goto('/settings');

  await expect(page.getByRole('button', { name: 'Login' })).toHaveCount(0);
});

test('opens the login dialog from the toolbar', async ({ page }) => {
  await stubAppBootstrap(page, true);

  await page.goto('/settings');
  await page.getByRole('button', { name: 'Login' }).click();

  const dialog = page.getByRole('dialog', { name: 'Login' });

  await expect(dialog.getByRole('heading', { name: 'Login' })).toBeVisible();
  await expect(dialog.locator('input[name="username"]')).toBeVisible();
});