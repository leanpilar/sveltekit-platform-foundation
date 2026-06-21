import { page } from 'vitest/browser';
import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import SearchFilters from '$lib/components/SearchFilters.svelte';

describe('SearchFilters', () => {
	it('reflects the current query and renders tag options', async () => {
		render(SearchFilters, {
			searchQuery: 'hello',
			selectedTag: '',
			currentSort: 'latest',
			allTags: ['design', 'performance'],
			currentLocale: 'en',
			onchange: vi.fn()
		});

		await expect.element(page.getByLabelText('Query')).toHaveValue('hello');
		await expect.element(page.getByRole('option', { name: '#design' })).toBeInTheDocument();
	});

	it('emits a change event when the query input changes', async () => {
		const onchange = vi.fn();
		render(SearchFilters, {
			searchQuery: '',
			selectedTag: '',
			currentSort: 'latest',
			allTags: [],
			currentLocale: 'en',
			onchange
		});

		await page.getByLabelText('Query').fill('edge');
		expect(onchange).toHaveBeenCalled();
	});
});
