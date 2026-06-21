import {
	ITEM_STATUSES,
	ITEM_CHANNELS,
	SORTABLE_COLUMNS,
	type ItemsQuery,
	type SortColumn,
	type SortDir
} from './itemsQuery';

export const DEFAULT_SORT: SortColumn = 'updatedAt';
export const DEFAULT_DIR: SortDir = 'desc';
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZES = [10, 20, 50] as const;

function includes<T extends string>(allowed: readonly T[], value: string): value is T {
	return (allowed as readonly string[]).includes(value);
}

/**
 * Reads the canonical, shareable table state out of the URL. Unknown/invalid
 * values fall back to defaults so a hand-edited URL can never break the loader.
 */
export function parseItemsQuery(url: URL): ItemsQuery {
	const p = url.searchParams;

	const status = p.getAll('status').filter((s) => includes(ITEM_STATUSES, s));
	const channel = p.getAll('channel').filter((c) => includes(ITEM_CHANNELS, c));

	const sortRaw = p.get('sort') ?? '';
	const sort: SortColumn = includes(SORTABLE_COLUMNS, sortRaw) ? sortRaw : DEFAULT_SORT;
	const dir: SortDir = p.get('dir') === 'asc' ? 'asc' : DEFAULT_DIR;

	const page = Math.max(1, Math.floor(Number(p.get('page'))) || 1);
	const sizeRaw = Number(p.get('pageSize'));
	const pageSize = (PAGE_SIZES as readonly number[]).includes(sizeRaw)
		? sizeRaw
		: DEFAULT_PAGE_SIZE;

	return { q: p.get('q') ?? '', status, channel, sort, dir, page, pageSize };
}

/**
 * Builds a query string from the current state plus a patch. Any change other
 * than an explicit page change resets to page 1 (so filtering never strands the
 * user on an out-of-range page). Default values are omitted for clean URLs.
 */
export function buildItemsQueryString(current: ItemsQuery, patch: Partial<ItemsQuery>): string {
	const next = { ...current, ...patch };
	const page = 'page' in patch ? next.page : 1;

	const sp = new URLSearchParams();
	if (next.q.trim()) sp.set('q', next.q.trim());
	for (const s of next.status) sp.append('status', s);
	for (const c of next.channel) sp.append('channel', c);
	if (next.sort !== DEFAULT_SORT) sp.set('sort', next.sort);
	if (next.dir !== DEFAULT_DIR) sp.set('dir', next.dir);
	if (next.pageSize !== DEFAULT_PAGE_SIZE) sp.set('pageSize', String(next.pageSize));
	if (page > 1) sp.set('page', String(page));

	const qs = sp.toString();
	return qs ? `?${qs}` : '';
}
