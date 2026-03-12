import { test, expect } from '@playwright/test';
import { waitForApp, modeToggle } from './helpers';

test.describe('Header behavior', () => {
  test.beforeEach(async ({ page }) => {
    await waitForApp(page);
  });

  test('mode toggle communicates the next action and current mode', async ({ page }) => {
    await expect(modeToggle(page)).toHaveText('Switch to Panoramic');
    await expect(page.getByText('Individual').first()).toBeVisible();

    await modeToggle(page).click();

    await expect(modeToggle(page)).toHaveText('Switch to Individual');
    await expect(page.getByText('Panoramic').first()).toBeVisible();
  });

  test('AI mode is opt-in and reveals the agent overlay when enabled', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'AI Mode Off' })).toBeVisible();
    await expect(page.getByText('MCP Connected')).toHaveCount(0);

    await page.getByRole('button', { name: 'AI Mode Off' }).click();

    await expect(page.getByRole('button', { name: 'AI Mode On' })).toBeVisible();
    await expect(page.getByText('MCP Connected')).toBeVisible();
  });
});
