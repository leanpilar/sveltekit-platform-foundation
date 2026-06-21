import type { Item } from '$lib/server/dto';

export const ITEM_STATUSES = [
	'draft',
	'scheduled',
	'active',
	'paused',
	'completed',
	'archived'
] as const;
export const ITEM_CHANNELS = ['email', 'sms', 'web', 'social', 'push'] as const;

export type ItemStatus = (typeof ITEM_STATUSES)[number];
export type ItemChannel = (typeof ITEM_CHANNELS)[number];

export const SORTABLE_COLUMNS = [
	'name',
	'status',
	'channel',
	'owner',
	'budget',
	'spent',
	'ctr',
	'updatedAt'
] as const;
export type SortColumn = (typeof SORTABLE_COLUMNS)[number];
export type SortDir = 'asc' | 'desc';

export interface ItemsQuery {
	q: string;
	status: string[];
	channel: string[];
	sort: SortColumn;
	dir: SortDir;
	page: number;
	pageSize: number;
}

export interface ItemsResult {
	rows: Item[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

function compare(a: Item, b: Item, col: SortColumn): number {
	switch (col) {
		case 'owner':
			return a.owner.name.localeCompare(b.owner.name);
		case 'name':
		case 'status':
		case 'channel':
			return a[col].localeCompare(b[col]);
		case 'updatedAt':
			return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
		case 'budget':
		case 'spent':
		case 'ctr':
			return a[col] - b[col];
	}
}

/**
 * Pure filter → sort → paginate over the full item set. This is the "API" the
 * dashboard treats items.json as; it is deliberately side-effect free so it can
 * be unit-tested in isolation and reused by the streamed loader.
 */
export function queryItems(items: Item[], query: ItemsQuery): ItemsResult {
	const needle = query.q.trim().toLowerCase();

	const filtered = items.filter((item) => {
		if (needle && !item.name.toLowerCase().includes(needle)) return false;
		if (query.status.length > 0 && !query.status.includes(item.status)) return false;
		if (query.channel.length > 0 && !query.channel.includes(item.channel)) return false;
		return true;
	});

	const direction = query.dir === 'asc' ? 1 : -1;
	const sorted = [...filtered].sort((a, b) => direction * compare(a, b, query.sort));

	const total = sorted.length;
	const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
	const page = Math.min(Math.max(1, query.page), totalPages);
	const start = (page - 1) * query.pageSize;
	const rows = sorted.slice(start, start + query.pageSize);

	return { rows, total, page, pageSize: query.pageSize, totalPages };
}
