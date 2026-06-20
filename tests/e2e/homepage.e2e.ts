import { expect, test } from '@playwright/test';

test.describe('Public Homepage Integration', () => {
	test('should display the correct primary platform hero heading', async ({ page }) => {
		// Navigate to the public surface root boundary
		await page.goto('/');

		// Assert the exact target H1 node exists and displays correctly
		const heading = page.locator('h1');
		await expect(heading).toBeVisible();
		await expect(heading).toHaveText('Welcome to SvelteKit Platform Foundation');
	});
});
