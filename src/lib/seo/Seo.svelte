<script lang="ts">
	import { page } from '$app/state';
	import type { Locale } from '$lib/i18n';
	import { localizedPath, alternateLinks } from './urls';
	import type { JsonLd } from './jsonld';

	interface Props {
		title: string;
		description: string;
		/** Locale-independent path, e.g. '/', '/blog', '/blog/my-post', '/search'. */
		basePath: string;
		locale: Locale;
		type?: 'website' | 'article';
		/** Absolute URL or root-relative path to a social share image. */
		image?: string;
		jsonLd?: JsonLd | JsonLd[];
		noindex?: boolean;
	}

	let {
		title,
		description,
		basePath,
		locale,
		type = 'website',
		image,
		jsonLd,
		noindex = false
	}: Props = $props();

	let origin = $derived(page.url.origin);
	let canonical = $derived(origin + localizedPath(locale, basePath));
	let alternates = $derived(alternateLinks(origin, basePath));
	let ogLocale = $derived(locale === 'de' ? 'de_DE' : 'en_US');
	let ogImage = $derived(image ? (image.startsWith('http') ? image : origin + image) : undefined);
	let ldList = $derived(jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []);
	// Split the closing tag so the Svelte/HTML parser does not end the head early.
	const closeScript = '<' + '/script>';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	{#each alternates as alt (alt.hreflang)}
		<link rel="alternate" hreflang={alt.hreflang} href={alt.href} />
	{/each}

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content="SvelteKit Platform Foundation" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:locale" content={ogLocale} />
	{#if ogImage}
		<meta property="og:image" content={ogImage} />
	{/if}

	<meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if ogImage}
		<meta name="twitter:image" content={ogImage} />
	{/if}

	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}

	{#each ldList as ld, i (i)}
		<!-- JSON-LD is our own data; "<" is escaped to prevent a "</script>" breakout. -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}${closeScript}`}
	{/each}
</svelte:head>
