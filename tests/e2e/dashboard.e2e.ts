import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function login(page: Page): Promise<void> {
	await page.goto('/login');
	await page.getByLabel('Email').fill('admin@demo.test');
	await page.getByLabel('Password').fill('demo1234');
	await page.getByRole('button', { name: 'Log In' }).click();
	await page.waitForURL(/\/dashboard/);
}

test.describe.configure({ mode: 'serial' });

test.describe('Dashboard items', () => {
	test('inline budget edit updates optimistically and persists on success', async ({ page }) => {
		await login(page);
		await page.goto('/dashboard/items');

		const row = page.getByRole('row').nth(1);
		await expect(row.getByRole('button', { name: 'Edit budget' })).toBeVisible();

		await row.getByRole('button', { name: 'Edit budget' }).click();
		await row.getByRole('spinbutton').fill('4321');
		await row.getByRole('button', { name: 'Save' }).click();

		await expect(page.getByText(/Budget updated/)).toBeVisible();
		await expect(row.getByRole('cell').nth(4)).toContainText('4,321');
	});

	test('rolls back the optimistic edit when the server fails', async ({ page }) => {
		await login(page);
		await page.goto('/dashboard/items');

		const row = page.getByRole('row').nth(2);
		const budgetCell = row.getByRole('cell').nth(4);
		await expect(row.getByRole('button', { name: 'Edit budget' })).toBeVisible();
		const original = (await budgetCell.innerText()).trim();

		// Force the update action to fail; the client must revert the optimistic value.
		await page.route('**/dashboard/items**', async (route) => {
			if (route.request().method() === 'POST') {
				await route.fulfill({ status: 500, body: '' });
			} else {
				await route.continue();
			}
		});

		await row.getByRole('button', { name: 'Edit budget' }).click();
		await row.getByRole('spinbutton').fill('99999');
		await row.getByRole('button', { name: 'Save' }).click();

		await expect(page.getByText(/reverted|failed/i)).toBeVisible();
		await expect(budgetCell).toHaveText(original);
	});

	test('has no serious or critical accessibility violations', async ({ page }) => {
		await login(page);
		await page.goto('/dashboard/items');
		await expect(page.getByRole('button', { name: 'Edit budget' }).first()).toBeVisible();

		const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
		const blocking = report.violations.filter(
			(v) => v.impact === 'serious' || v.impact === 'critical'
		);
		expect(blocking).toEqual([]);
	});
});
