// @ts-check

import { test, expect } from '@playwright/test';

test('domain taken', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const search = await page.locator('#name-search');
  await search.fill('asdf');
  await page.locator('#search-button').click();
  await expect(page.getByText(`Apt name is available`)).toBeVisible();
  await expect(page.getByText(`PyPI name already exists`)).toBeVisible();
});
