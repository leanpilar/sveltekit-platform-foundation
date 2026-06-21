import { describe, it, expect } from 'vitest';
import { queryItems, type ItemsQuery } from '$lib/dashboard/itemsQuery';
import type { Item } from '$lib/server/dto';

function mk(overrides: Partial<Item> & { id: string }): Item {
	return {
		id: overrides.id,
		name: overrides.name ?? 'Campaign',
		status: overrides.status ?? 'active',
		channel: overrides.channel ?? 'email',
		owner: overrides.owner ?? { id: 'u_1', name: 'Owner One' },
		budget: overrides.budget ?? 1000,
		spent: overrides.spent ?? 100,
		impressions: overrides.impressions ?? 0,
		clicks: overrides.clicks ?? 0,
		ctr: overrides.ctr ?? 0.01,
		startDate: overrides.startDate ?? '2026-01-01',
		endDate: overrides.endDate ?? '2026-02-01',
		updatedAt: overrides.updatedAt ?? '2026-01-15T00:00:00Z',
		tags: overrides.tags ?? []
	};
}

const base: ItemsQuery = {
	q: '',
	status: [],
	channel: [],
	sort: 'name',
	dir: 'asc',
	page: 1,
	pageSize: 20
};

const items: Item[] = [
	mk({ id: 'a', name: 'Alpha launch', status: 'active', channel: 'email', budget: 300 }),
	mk({ id: 'b', name: 'Beta push', status: 'paused', channel: 'push', budget: 100 }),
	mk({ id: 'c', name: 'Gamma social', status: 'active', channel: 'social', budget: 200 }),
	mk({ id: 'd', name: 'Delta email', status: 'archived', channel: 'email', budget: 400 })
];

describe('queryItems', () => {
	it('filters by case-insensitive name substring', () => {
		const result = queryItems(items, { ...base, q: 'ALPHA' });
		expect(result.rows.map((r) => r.id)).toEqual(['a']);
		expect(result.total).toBe(1);
	});

	it('filters by multiple statuses (OR within facet)', () => {
		const result = queryItems(items, { ...base, status: ['active', 'archived'] });
		expect(result.rows.map((r) => r.id).sort()).toEqual(['a', 'c', 'd']);
	});

	it('combines facets with AND across facets', () => {
		const result = queryItems(items, { ...base, status: ['active'], channel: ['email'] });
		expect(result.rows.map((r) => r.id)).toEqual(['a']);
	});

	it('sorts numerically by budget, respecting direction', () => {
		const asc = queryItems(items, { ...base, sort: 'budget', dir: 'asc' });
		expect(asc.rows.map((r) => r.budget)).toEqual([100, 200, 300, 400]);
		const desc = queryItems(items, { ...base, sort: 'budget', dir: 'desc' });
		expect(desc.rows.map((r) => r.budget)).toEqual([400, 300, 200, 100]);
	});

	it('paginates and reports totalPages', () => {
		const result = queryItems(items, { ...base, sort: 'budget', dir: 'asc', pageSize: 2, page: 2 });
		expect(result.rows.map((r) => r.budget)).toEqual([300, 400]);
		expect(result.totalPages).toBe(2);
		expect(result.page).toBe(2);
	});

	it('clamps an out-of-range page to the last page', () => {
		const result = queryItems(items, { ...base, pageSize: 2, page: 99 });
		expect(result.page).toBe(2);
		expect(result.rows).toHaveLength(2);
	});
});
