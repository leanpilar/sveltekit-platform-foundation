import { LOCALES, type Locale } from '$lib/i18n';

/**
 * Maps a locale-independent base path (e.g. '/', '/blog', '/blog/my-post') to the
 * canonical URL path for a given locale.
 *
 * The English home lives at '/' (the '/en' segment is redirected away in the
 * layout guard), while every other English page keeps its '/en' prefix so the
 * served URL and the canonical URL agree.
 */
export function localizedPath(locale: Locale, basePath: string): string {
	const normalized = basePath === '' ? '/' : basePath;
	if (normalized === '/') {
		return locale === 'en' ? '/' : '/de';
	}
	return `/${locale}${normalized}`;
}

export interface AlternateLink {
	hreflang: string;
	href: string;
}

/**
 * Produces the full set of hreflang alternates (one per locale plus x-default)
 * as absolute URLs for the given origin and base path.
 */
export function alternateLinks(origin: string, basePath: string): AlternateLink[] {
	const links: AlternateLink[] = LOCALES.map((locale) => ({
		hreflang: locale,
		href: origin + localizedPath(locale, basePath)
	}));
	links.push({ hreflang: 'x-default', href: origin + localizedPath('en', basePath) });
	return links;
}
