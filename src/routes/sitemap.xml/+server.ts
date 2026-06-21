import type { RequestHandler } from './$types';
import type { BlogPost } from '$lib/server/dto';
import { LOCALES } from '$lib/i18n';
import { localizedPath, alternateLinks } from '$lib/seo/urls';

export const config = {
	runtime: 'nodejs24.x'
};

/** Static, locale-independent base paths that always exist. */
const STATIC_PATHS = ['/', '/blog', '/search'];

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

/**
 * Emits one <url> entry per (locale, basePath) pair, each carrying the full set
 * of xhtml:link hreflang alternates so crawlers can map locale variants.
 */
function urlEntries(origin: string, basePath: string): string {
	const alternates = alternateLinks(origin, basePath);
	const alternateTags = alternates
		.map(
			(alt) =>
				`<xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${escapeXml(alt.href)}"/>`
		)
		.join('');

	return LOCALES.map((locale) => {
		const loc = escapeXml(origin + localizedPath(locale, basePath));
		return `<url><loc>${loc}</loc>${alternateTags}</url>`;
	}).join('');
}

export const GET: RequestHandler = async ({ url, fetch }) => {
	const origin = url.origin;

	let postPaths: string[];
	try {
		const posts: BlogPost[] = await fetch('/api/posts').then((res) => res.json());
		postPaths = posts.map((post) => `/blog/${post.slug}`);
	} catch {
		// Sitemap still serves static routes if the post API is unavailable.
		postPaths = [];
	}

	const allPaths = [...STATIC_PATHS, ...postPaths];
	const body =
		`<?xml version="1.0" encoding="UTF-8"?>` +
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">` +
		allPaths.map((path) => urlEntries(origin, path)).join('') +
		`</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
