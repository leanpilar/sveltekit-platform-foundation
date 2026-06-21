export interface SearchState {
	q: string;
	tag: string;
	sort: 'latest' | 'oldest';
}

/**
 * Parses search parameters from a URL instance into a structured, type-safe state
 */
export function parseSearchURL(url: URL): SearchState {
	const q = url.searchParams.get('q') ?? '';
	const tag = url.searchParams.get('tag') ?? '';
	const rawSort = url.searchParams.get('sort');
	const sort = rawSort === 'oldest' ? 'oldest' : 'latest';

	return { q, tag, sort };
}

/**
 * Serializes a structured search state configuration into a clean destination pathname
 */
export function serializeSearchURL(basePath: string, state: Partial<SearchState>): string {
	const url = new URL(basePath, 'http://localhost');

	if (state.q?.trim()) url.searchParams.set('q', state.q.trim());
	if (state.tag?.trim()) url.searchParams.set('tag', state.tag.trim());
	if (state.sort && state.sort !== 'latest') url.searchParams.set('sort', state.sort);

	return url.pathname + url.search;
}
