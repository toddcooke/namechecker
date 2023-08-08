// @ts-check

const { test, expect } = require('@playwright/test');

test('asdf not available', async ({ page }) => {
  test.setTimeout(10000);
  await page.goto('http://localhost:3000');
  const search = await page.locator('#name-search');
  await search.type('asdf');
  await page.locator('#search-button').click();
  await expect(page.locator('#loading-icon')).toBeVisible;
  await expect(page.locator('#loading-icon')).toBeHidden;
  await expect(page.getByText('asdf.xyz already exists')).toBeVisible;
  expect(await page.getByText('already exists').count()).toEqual(16);
});
