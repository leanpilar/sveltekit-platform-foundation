import { page } from 'vitest/browser';
import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Dialog from '$lib/components/Dialog.svelte';

const bodySnippet = createRawSnippet(() => ({
	render: () => `<p>Body content here</p>`
}));

describe('Dialog', () => {
	it('renders title and content when open', async () => {
		render(Dialog, {
			isOpen: true,
			onClose: vi.fn(),
			title: 'Item details',
			content: bodySnippet
		});

		await expect.element(page.getByRole('heading', { name: 'Item details' })).toBeVisible();
		await expect.element(page.getByText('Body content here')).toBeVisible();
	});

	it('fires onClose from the close button', async () => {
		const onClose = vi.fn();
		render(Dialog, { isOpen: true, onClose, title: 'Item details', content: bodySnippet });

		await page.getByRole('button', { name: 'Close dialog' }).click();
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
