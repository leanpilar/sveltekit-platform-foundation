import { describe, it, expect } from 'vitest';
import { isPromoEnabled } from '$lib/featureFlags';

describe('isPromoEnabled', () => {
	it('is on when the cookie holds "1"', () => {
		expect(isPromoEnabled('1', undefined)).toBe(true);
	});

	it('is on when the env var is "true"', () => {
		expect(isPromoEnabled(undefined, 'true')).toBe(true);
	});

	it('is off by default and for non-truthy values', () => {
		expect(isPromoEnabled(undefined, undefined)).toBe(false);
		expect(isPromoEnabled('0', 'false')).toBe(false);
	});
});
