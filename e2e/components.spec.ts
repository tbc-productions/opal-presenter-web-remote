import { expect, test } from 'playwright/test';

import { stubAppBootstrap, tinyPngDataUrl } from './test-helpers';

test('toggles dark theme from settings', async ({ page }) => {
  await stubAppBootstrap(page, false);

  await page.goto('/settings');

  const appShell = page.locator('app-root > div').first();
  const darkThemeSwitch = page.getByRole('switch', { name: 'Enable dark theme' });

  await expect(appShell).toHaveClass(/light-theme/);
  await darkThemeSwitch.click();
  await expect(appShell).toHaveClass(/dark-theme/);
});

test('opens slides when a service item is selected and sends live slide selection', async ({ page }) => {
  await stubAppBootstrap(page, false);

  let selectedServiceItemId: number | null = null;
  let selectedSlideId: number | null = null;

  await page.route('**/api/v2/service/items', async route => {
    await route.fulfill({
      json: [
        {
          id: 42,
          is_valid: true,
          plugin: 'songs',
          selected: false,
          title: 'Amazing Grace'
        }
      ]
    });
  });

  await page.route('**/api/v2/service/show', async route => {
    selectedServiceItemId = route.request().postDataJSON().id as number;
    await route.fulfill({ json: {} });
  });

  await page.route('**/api/v2/controller/live-items', async route => {
    await route.fulfill({
      json: {
        slides: [
          { selected: true, tag: 'V1', text: 'Verse 1' },
          { selected: false, tag: 'C', text: 'Chorus' }
        ]
      }
    });
  });

  await page.route('**/api/v2/controller/show', async route => {
    selectedSlideId = route.request().postDataJSON().id as number;
    await route.fulfill({ json: {} });
  });

  await page.goto('/service');
  await page.getByText('Amazing Grace').click();

  await expect(page).toHaveURL(/\/slides$/);
  await expect(page.getByText('Verse 1')).toBeVisible();
  expect(selectedServiceItemId).toBe(42);

  await page.getByText('Chorus').click();
  expect(selectedSlideId).toBe(1);
});

test('submits an alert message', async ({ page }) => {
  await stubAppBootstrap(page, false);

  let submittedAlertText: string | null = null;

  await page.route('**/api/v2/plugins/alerts', async route => {
    submittedAlertText = route.request().postDataJSON().text as string;
    await route.fulfill({ json: {} });
  });

  await page.goto('/alerts');
  await page.locator('input[name="alert"]').fill('Test alert');
  await page.locator('#sendButton').click();

  await expect(page.getByText('Alert submitted')).toBeVisible();
  expect(submittedAlertText).toBe('Test alert');
});

test('renders theme cards and updates the selected theme', async ({ page }) => {
  await stubAppBootstrap(page, false);

  let currentTheme = 'Theme B';
  let requestedTheme: string | null = null;

  await page.route('**/api/v2/controller/theme-level', async route => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ json: {} });
      return;
    }

    await route.fulfill({ json: 'service' });
  });

  await page.route('**/api/v2/controller/themes', async route => {
    await route.fulfill({
      json: [
        { name: 'Theme A', selected: currentTheme === 'Theme A', thumbnail: tinyPngDataUrl },
        { name: 'Theme B', selected: currentTheme === 'Theme B', thumbnail: tinyPngDataUrl }
      ]
    });
  });

  await page.route('**/api/v2/controller/theme', async route => {
    if (route.request().method() === 'POST') {
      currentTheme = route.request().postDataJSON().theme as string;
      requestedTheme = currentTheme;
      await route.fulfill({ json: {} });
      return;
    }

    await route.fulfill({ json: currentTheme });
  });

  await page.goto('/themes');

  await expect(page.locator('.theme-card')).toHaveCount(2);
  await expect(page.locator('.theme-card.selected .theme-title')).toHaveText('Theme B');

  await page.getByText('Theme A').click();

  expect(requestedTheme).toBe('Theme A');
});

test('renders the main view overlay image', async ({ page }) => {
  await stubAppBootstrap(page, false);

  await page.route('**/api/v2/core/live-image', async route => {
    await route.fulfill({
      json: {
        binary_image: tinyPngDataUrl
      }
    });
  });

  await page.goto('/main');

  await expect(page.getByAltText('Overlay Image')).toBeVisible();
});

test('shows the not-found route message', async ({ page }) => {
  await stubAppBootstrap(page, false);

  await page.goto('/missing-route');

  await expect(page.locator('.error-message')).toHaveText('Requested page could not be found');
});