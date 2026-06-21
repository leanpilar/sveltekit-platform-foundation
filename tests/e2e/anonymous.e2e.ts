import { test, expect } from '@playwright/test';

test.describe('Anonymous discovery flow', () => {
	/**
	 * Search → click a result → land on the post. Exercises URL-as-state search
	 * and the public reading surface end to end.
	 */
	test('search → click result → read post', async ({ page }) => {
		await page.goto('/en/search');

		// "Accessible combobox from scratch" is one of the seeded posts.
		await page.getByLabel('Query').fill('combobox');

		const result = page.getByRole('link', { name: /combobox/i }).first();
		await expect(result).toBeVisible();
		await result.click();

		await expect(page).toHaveURL(/\/en\/blog\/[\w-]+$/);
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	});

	/** Visual regression on the marketing hero. */
	test('landing hero visual regression', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('region', { name: 'Hero' })).toHaveScreenshot('landing-hero.png');
	});
});
