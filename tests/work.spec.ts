import { test, expect } from '@playwright/test';

test.describe("test work page", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        console.log(`Running ${testInfo.title}`)

        await page.goto("/work")
    })

    test("should have canvas", async ({ page }) => {
        const canvas = page.locator("canvas")

        await expect(canvas).toBeInViewport()
    })

    test("should have navbar", async ({ page }) => {
        const navbar = page.locator("nav")

        await expect(navbar).toBeVisible()
        await expect(navbar).toHaveClass(["navbar"])
    })

    test("should have nav links from navbar, cookie banner", async ({ page }) => {
        await expect(page.getByRole("link", { name: "Home" })).toBeVisible()
        await expect(page.getByRole("link", { name: "Work" })).toBeVisible()
        await expect(page.getByRole("link", { name: "About Me" })).toBeVisible()
        await expect(page.getByRole("link", { name: "Contact" })).toBeVisible()
        await expect(page.getByRole("link", { name: "Data privacy" })).toHaveCount(1)
    });

    test("should have 1 active nav link", async ({ page }) => {
        const active = page.locator(".active")

        await expect(active).toHaveCount(1)
    })

    test("should have cookiebanner", async ({ page }) => {
        await expect(page.locator("div.cookiebanner")).toBeVisible()
    })

    test("should have translate DE button", async ({ page }) => {
        const translate = page.locator("[href='/projekte']")

        await expect(translate).toBeVisible()
    })

    test("should have translate EN button", async ({ page }) => {
        await page.goto("/projekte")
        const translate = page.locator("[href='/work']")

        await expect(translate).toBeVisible()
    })

    test("should have github & linkedIn links", async ({ page }) => {
        const linkedIn = page.locator("[href*='https://linkedin.com/']")
        const github = page.locator("[href*='https://github.com/']")

        await expect(linkedIn).toBeVisible()
        await expect(github).toBeVisible()
    })


})
