import type { ParamMatcher } from '@sveltejs/kit';

/**
 * Validates route locale segments against supported application cultures
 */
export const match: ParamMatcher = (param) => {
	return ['en', 'de'].includes(param);
};
