import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
	/**
	 * Verifies that valid user credentials trigger a successful session provision
	 * and redirect the client context to the protected dashboard zone.
	 */
	test('should authenticate successfully and redirect to dashboard', async ({ page }) => {
		await page.goto('/login');

		await page.getByLabel('Email').fill('admin@demo.test');
		await page.getByLabel('Password').fill('demo1234');
		await page.getByRole('button', { name: 'Sign in' }).click();

		await expect(page).toHaveURL(/\/dashboard/);
	});

	/**
	 * Verifies that invalid credentials fail authentication cleanly,
	 * presenting an error message without mutating the current route.
	 */
	test('should display an error message and reject invalid credentials', async ({ page }) => {
		await page.goto('/login');

		await page.getByLabel('Email').fill('admin@demo.test');
		await page.getByLabel('Password').fill('wrong_password_attempt');
		await page.getByRole('button', { name: 'Sign in' }).click();

		await expect(page.locator('.error-banner')).toHaveText('Invalid credentials');
		await expect(page).not.toHaveURL(/\/dashboard/);
	});
});
