import { test, expect } from "@playwright/test"

test.describe("test privacy page", () => {

    test.beforeEach(async ({ page }, testInfo) => {
        console.log(`Running ${testInfo.title}`)

        await page.goto("/privacy")
    })

    test("should have navbar", async ({ page }) => {
        const navbar = page.locator("nav")

        await expect(navbar).toBeVisible()
        await expect(navbar).toHaveClass(["navbar"])
    })

    test("should have nav links from navbar, footer, cookie banner", async ({ page }) => {
        await expect(page.getByRole("link", { name: "Home" })).toBeVisible()
        await expect(page.getByRole("link", { name: "About Me" })).toBeVisible()
        await expect(page.getByRole("link", { name: "Data privacy" })).toHaveCount(2)
        await expect(page.getByRole("link", { name: "Contact" })).toHaveCount(2)
        await expect(page.getByRole("link", { name: "Work" })).toBeVisible()
    });

    test("should have 0 active nav link", async ({ page }) => {
        const active = page.locator(".active")
    
        await expect(active).toHaveCount(0)
      })

    test("should have google and contact links", async ({ page }) => {
        await expect(page.locator("[href='https://policies.google.com/privacy?hl=en']")).toBeVisible()
        await page.getByLabel('Change language to german, DE').click();
        await expect(page.locator("[href='https://policies.google.com/privacy?hl=de']")).toBeVisible()
    })

    test("should have email contact link", async ({ page }) => {
        await expect(page.locator("[href='mailto:contact@tranmp.dev']")).toBeVisible()
    })

    test("should have cookie settings button", async ({ page }) => {
        await expect(page.getByRole("button", { name: "Open Cookie Settings", exact: true })).toBeVisible()
        await page.getByLabel('Change language to german, DE').click();
        await expect(page.getByRole("button", { name: "Öffne Cookie Einstellung", exact: true })).toBeVisible()
    })
})