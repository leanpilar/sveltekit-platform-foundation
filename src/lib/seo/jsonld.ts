import { localizedPath } from './urls';
import type { Locale } from '$lib/i18n';

export type JsonLd = Record<string, unknown>;

const SITE_NAME = 'SvelteKit Platform Foundation';

/**
 * Organization structured data for the marketing home page.
 */
export function organizationLd(origin: string): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: SITE_NAME,
		url: origin,
		logo: `${origin}/favicon.svg`
	};
}

interface ArticleInput {
	origin: string;
	locale: Locale;
	slug: string;
	title: string;
	description: string;
	authorName: string;
	publishedAt: string;
}

/**
 * Article structured data for an individual blog post.
 */
export function articleLd(input: ArticleInput): JsonLd {
	const url = input.origin + localizedPath(input.locale, `/blog/${input.slug}`);
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: input.title,
		description: input.description,
		datePublished: input.publishedAt,
		inLanguage: input.locale,
		author: { '@type': 'Person', name: input.authorName },
		publisher: { '@type': 'Organization', name: SITE_NAME },
		mainEntityOfPage: { '@type': 'WebPage', '@id': url }
	};
}

/**
 * BreadcrumbList structured data: Home > Blog > Post.
 */
export function breadcrumbLd(input: {
	origin: string;
	locale: Locale;
	slug: string;
	title: string;
}): JsonLd {
	const { origin, locale, slug, title } = input;
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Home',
				item: origin + localizedPath(locale, '/')
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: 'Blog',
				item: origin + localizedPath(locale, '/blog')
			},
			{
				'@type': 'ListItem',
				position: 3,
				name: title,
				item: origin + localizedPath(locale, `/blog/${slug}`)
			}
		]
	};
}
