import { test, expect } from '@playwright/test';

test("should display error page", async ({ page }) => {
  await page.goto('http://localhost:4321/error');
  await expect(page.getByText('Oops!Error icon404 Error |')).toBeVisible();
  await expect(page.getByText('Error | Page not found!')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
});