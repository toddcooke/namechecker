// @ts-check

const { test, expect } = require('@playwright/test');

test('check domains', async ({ page }) => {
  let domain;
  await page.goto('http://localhost:3000');
  const search = await page.locator('#name-search');

  domain = 'sk.org';
  await search.type(domain);
  await page.locator('#search-button').click();
  await expect(page.getByText(`${domain} already exists`)).toBeVisible();

  domain = 'sfs-sdf-s.ai';
  await search.type(domain);
  await page.locator('#search-button').click();
  await expect(page.getByText(`${domain} is available`)).toBeVisible();
});
