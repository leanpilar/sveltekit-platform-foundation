import { describe, it, expect } from 'vitest';
import { parseSearchURL, serializeSearchURL } from '$lib/utils/searchCodec';

describe('Search URL Codec (Business Logic)', () => {
	it('should parse fallback default configurations when search query parameters are absent', () => {
		const url = new URL('https://platform.com/en/search');
		const state = parseSearchURL(url);

		expect(state).toEqual({
			q: '',
			tag: '',
			sort: 'latest'
		});
	});

	it('should parse fully-populated parameters validating type-safe sort values', () => {
		const url = new URL('https://platform.com/en/search?q=crdt&tag=engineering&sort=oldest');
		const state = parseSearchURL(url);

		expect(state).toEqual({
			q: 'crdt',
			tag: 'engineering',
			sort: 'oldest'
		});
	});

	it('should serialize active filters omitting empty strings and default sort keys from output', () => {
		const output = serializeSearchURL('/en/search', {
			q: 'performance',
			tag: '',
			sort: 'latest'
		});

		expect(output).toBe('/en/search?q=performance');
	});
});
