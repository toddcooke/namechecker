// @ts-check

const { test, expect } = require('@playwright/test');

test('domain taken', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const search = await page.locator('#name-search');
  await search.type('sk.org');
  await page.locator('#search-button').click();
  await expect(page.getByText(`sk.org already exists`)).toBeVisible();
});

test('domain available', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const search = await page.locator('#name-search');
  await search.type('some-long-unused-domain.com');
  await page.locator('#search-button').click();
  await expect(
    page.getByText(`some-long-unused-domain.com is available`),
  ).toBeVisible();
});
