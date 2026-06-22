import { test, expect } from '@playwright/test';

test.describe('SSR feature flag', () => {
	test('promo banner is server-rendered and toggles via the flag', async ({ page }) => {
		await page.goto('/?promo=on');
		await expect(page.getByText(/Summer launch/)).toBeVisible();

		await page.goto('/?promo=off');
		await expect(page.getByText(/Summer launch/)).toHaveCount(0);
	});
});
