import { test, expect } from '@playwright/test';

test.describe("test home page", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Running ${testInfo.title}`)

    await page.goto("/")
  })

  test("should have navbar", async ({ page }) => {
    const navbar = page.locator("nav")

    await expect(navbar).toBeVisible()
    await expect(navbar).toHaveClass(["navbar"])
  })

  test("should have nav links from navbar, introduction, footer, cookie banner", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible()
    await expect(page.getByRole("link", { name: "About Me" })).toBeVisible()
    await expect(page.getByRole("link", { name: "Data privacy" })).toHaveCount(2)
    await expect(page.getByRole("link", { name: "Contact" })).toHaveCount(2)
    await expect(page.getByRole("link", { name: "Work" })).toHaveCount(2)
  });

  test("should have 1 active nav link", async ({ page }) => {
    const active = page.locator(".active")

    await expect(active).toHaveCount(1)
  })

  test("should have canvas", async ({ page }) => {
    const canvas = page.locator("canvas")

    await expect(canvas).toBeInViewport()
  })

  test("should have cookiebanner", async ({ page }) => {
    await expect(page.locator("div.cookiebanner")).toBeVisible()
  })

  test("should have translate DE button", async ({ page }) => {
    const translate = page.locator("[href='/de']")

    await expect(translate).toBeVisible()
  })

  test("should have translate EN button", async ({ page }) => {
    await page.goto("/de")
    const translate = page.locator("[href='/']")

    await expect(translate).toBeVisible()
  })

  test("should have github & linkedIn links", async ({ page }) => {
    const linkedIn = page.locator("[href*='https://linkedin.com/']")
    const github = page.locator("[href*='https://github.com/']")

    await expect(linkedIn).toBeVisible()
    await expect(github).toBeVisible()
  })

  test('should have footer', async ({ page }) => {
    await expect(page.getByText("© 2023 - TMP")).toBeVisible()
    await expect(page.getByRole("link", { name: "Data privacy", exact: true })).toBeVisible()
  });
})


