/**
 * Pure feature-flag resolution, kept side-effect-free so it can be unit-tested.
 * A flag is on when its cookie holds '1' or the public env var is 'true'.
 */
export function isPromoEnabled(
	cookieValue: string | undefined,
	envValue: string | undefined
): boolean {
	return cookieValue === '1' || envValue === 'true';
}
