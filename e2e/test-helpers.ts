import type { Page } from 'playwright/test';

const translations = {
  ADD_ITEM: 'Add item',
  ADD_ITEM_TO_SERVICE: 'Add item to service',
  ALERT: 'Alert',
  ALERT_SUBMITTED: 'Alert submitted',
  ALERTS: 'Alerts',
  ENABLE_DARK_THEME: 'Enable dark theme',
  GLOBAL: 'Global',
  LOGIN: 'Login',
  NO_SERVICE_ITEMS: 'No service items',
  NO_SLIDE_ITEMS: 'No slide items',
  REQUESTED_PAGE_COULD_NOT_BE_FOUND: 'Requested page could not be found',
  SEARCH: 'Search',
  SEND: 'Send',
  SEND_AN_ALERT: 'Send an alert',
  SERVICE: 'Service',
  SETTINGS: 'Settings',
  SLIDES: 'Slides',
  SONG: 'Song',
  SONG_LEVEL_THEME_CHANGING_NOT_SUPPORTED: 'Song level theme changing not supported',
  THEME_LEVEL: 'Theme level',
  THEME_OPTIONS: 'Theme options',
  THEMES: 'Themes',
  USER_NAME: 'User Name'
};

export async function stubAppBootstrap(page: Page, loginRequired = true): Promise<void> {
  await page.addInitScript(() => {
    (window as Window & { appVersion?: string }).appVersion = '9.9.9';
  });

  await page.route('**/api/v2/core/system', async route => {
    await route.fulfill({
      json: {
        api_revision: 5,
        api_version: 2,
        login_required: loginRequired,
        websocket_port: 4316
      }
    });
  });

  await page.route('**/api/v2/core/language', async route => {
    await route.fulfill({
      json: {
        language: 'de'
      }
    });
  });

  await page.route('**/api/v2/core/shortcuts', async route => {
    await route.fulfill({ json: [] });
  });

  await page.route('**/assets/en.json', async route => {
    await route.fulfill({ json: translations });
  });

  await page.route('**/assets/i18n/*.json', async route => {
    await route.fulfill({ json: translations });
  });
}

export const tinyPngDataUrl =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9WnHCq0AAAAASUVORK5CYII=';