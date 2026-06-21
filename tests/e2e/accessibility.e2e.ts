import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Public Routing Automated Accessibility Check', () => {
	/**
	 * Inspects the localized landing page surface for WCAG 2.2 AA non-compliance instances
	 */
	test('landing page should not contain serious or critical accessibility violations', async ({
		page
	}) => {
		await page.goto('/');
		await page.waitForSelector('main');

		const accessibilityReport = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
			.analyze();

		const seriousOrCriticalViolations = accessibilityReport.violations.filter(
			(v) => v.impact === 'serious' || v.impact === 'critical'
		);

		expect(seriousOrCriticalViolations).toEqual([]);
	});
});
