import { test, expect } from '@playwright/test';

test.describe("test contact page", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        console.log(`Running ${testInfo.title}`)

        await page.goto("/contact")
    })

    test("should have cookiebanner", async ({ page }) => {
        await expect(page.locator("div.cookiebanner")).toBeVisible()
    })

    test("should have navbar", async ({ page }) => {
        const navbar = page.locator("nav")

        await expect(navbar).toBeVisible()
        await expect(navbar).toHaveClass(["navbar"])
    })

    test("should have nav links from navbar and cookie banner", async ({ page }) => {
        await expect(page.getByRole("link", { name: "Home" })).toBeVisible()
        await expect(page.getByRole("link", { name: "Work" })).toBeVisible()
        await expect(page.getByRole("link", { name: "About Me" })).toBeVisible()
        await expect(page.getByRole("link", { name: "Contact" })).toBeVisible()
        await expect(page.getByRole("link", { name: "Data privacy" })).toHaveCount(2)
    });


    test("should have 1 active nav link", async ({ page }) => {
        const active = page.locator(".active")

        await expect(active).toHaveCount(1)
    })

    test("should have social links", async ({ page }) => {
        await expect(page.getByRole("link", { name: "Github" })).toHaveCount(2)
        await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveCount(2)
    });

    test("should email & form link", async ({ page }) => {
        await expect(page.getByRole("link", { name: "Write Email" })).toBeVisible()
        await expect(page.locator("[href='mailto:contact@tranmp.dev']")).toBeVisible()
        await expect(page.getByRole("button", { name: "Fill out contact form" })).toBeVisible()
    });

    test('should have contact form', async ({ page }) => {
        await page.getByRole('button', { name: 'Fill out contact form' }).click();
        await page.getByPlaceholder('Name').click();
        await page.getByPlaceholder('Name').fill('test-playwright');
        await page.getByPlaceholder('Name').press('Tab');
        await page.getByPlaceholder('E-mail').fill('playwright@test.com');
        await page.getByPlaceholder('E-mail').press('Tab');
        await page.getByPlaceholder('Leave me a message!').fill('playwright test');
        await page.getByRole('button', { name: 'Send' }).click();
        await page.getByText('Message Sent!').click();
    });

    test('should show error message on missing fields at contact form', async ({ page }) => {
        await page.getByRole('button', { name: 'Fill out contact form' }).click();
        await page.getByRole('button', { name: 'Send' }).click();

        await expect(page.getByText('Please enter your name', { exact: true })).toBeVisible();
        await expect(page.getByText('Invalid email', { exact: true })).toBeVisible();
        await expect(page.getByText('Message missing', { exact: true })).toBeVisible();
        await page.getByLabel('Close contact form').click();

        await page.getByLabel('Change language to german, DE').click();
        await page.getByRole('button', { name: 'Kontaktformular ausfüllen' }).click();
        await page.getByRole('button', { name: 'Abschicken' }).click();

        await expect(page.getByText('Bitte Name eintragen', { exact: true })).toBeVisible();
        await expect(page.getByText('Ungültige Email', { exact: true })).toBeVisible();
        await expect(page.getByText('Nachricht fehlt', { exact: true })).toBeVisible();
    });



    test("should have translate DE button", async ({ page }) => {
        const translate = page.locator("[href='/kontakt']")

        await expect(translate).toBeVisible()
    })

    test("should have translate EN button", async ({ page }) => {
        await page.goto("/kontakt")
        const translate = page.locator("[href='/contact']")

        await expect(translate).toBeVisible()
    })

    test("should have github & linkedIn links", async ({ page }) => {
        const linkedIn = page.locator("[href*='https://linkedin.com/']")
        const github = page.locator("[href*='https://github.com/']")

        await expect(linkedIn).toHaveCount(2)
        await expect(github).toHaveCount(2)
    })

    test('should have footer', async ({ page }) => {
        await expect(page.getByText("© 2023 - TMP")).toBeVisible()
        await expect(page.getByRole("link", { name: "Data privacy", exact: true })).toBeVisible()
    });
})
