import { describe, it, expect } from 'vitest';
import { parseItemsQuery, buildItemsQueryString } from '$lib/dashboard/itemsUrl';

const u = (qs: string) => new URL(`http://x/dashboard/items${qs}`);

describe('parseItemsQuery', () => {
	it('returns defaults for an empty URL', () => {
		expect(parseItemsQuery(u(''))).toEqual({
			q: '',
			status: [],
			channel: [],
			sort: 'updatedAt',
			dir: 'desc',
			page: 1,
			pageSize: 20
		});
	});

	it('parses all params, including repeated facets', () => {
		const q = parseItemsQuery(
			u('?q=beta&status=active&status=paused&channel=email&sort=budget&dir=asc&page=3&pageSize=50')
		);
		expect(q).toEqual({
			q: 'beta',
			status: ['active', 'paused'],
			channel: ['email'],
			sort: 'budget',
			dir: 'asc',
			page: 3,
			pageSize: 50
		});
	});

	it('drops invalid sort, pageSize and facet values', () => {
		const q = parseItemsQuery(u('?sort=bogus&pageSize=999&status=nope'));
		expect(q.sort).toBe('updatedAt');
		expect(q.pageSize).toBe(20);
		expect(q.status).toEqual([]);
	});
});

describe('buildItemsQueryString', () => {
	const current = parseItemsQuery(u(''));

	it('omits default values for clean URLs', () => {
		expect(buildItemsQueryString(current, {})).toBe('');
	});

	it('resets to page 1 when a filter changes', () => {
		const onPage5 = { ...current, page: 5 };
		expect(buildItemsQueryString(onPage5, { status: ['active'] })).toBe('?status=active');
	});

	it('preserves the page when the page itself is patched', () => {
		expect(buildItemsQueryString(current, { page: 4 })).toBe('?page=4');
	});

	it('round-trips through parseItemsQuery', () => {
		const qs = buildItemsQueryString(current, {
			q: 'edge',
			status: ['active', 'archived'],
			sort: 'spent',
			dir: 'asc',
			pageSize: 50,
			page: 2
		});
		const parsed = parseItemsQuery(u(qs));
		expect(parsed).toEqual({
			q: 'edge',
			status: ['active', 'archived'],
			channel: [],
			sort: 'spent',
			dir: 'asc',
			page: 2,
			pageSize: 50
		});
	});
});
