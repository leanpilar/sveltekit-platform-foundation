<script lang="ts">
	import { page } from '$app/state';
	import type { ResolvedPathname } from '$app/types';
	import Blog from '$lib/components/Blog.svelte';
	import Seo from '$lib/seo/Seo.svelte';
	import { articleLd, breadcrumbLd } from '$lib/seo/jsonld';

	let { data } = $props();

	let locale = $derived(data.locale);
	let post = $derived(data.post);

	let structuredData = $derived([
		articleLd({
			origin: page.url.origin,
			locale,
			slug: post.slug,
			title: post.title,
			description: post.excerpt,
			authorName: post.author.name,
			publishedAt: post.publishedAt
		}),
		breadcrumbLd({ origin: page.url.origin, locale, slug: post.slug, title: post.title })
	]);
</script>

<Seo
	title={post.title}
	description={post.excerpt}
	basePath={`/blog/${post.slug}`}
	{locale}
	type="article"
	jsonLd={structuredData}
/>

<div class="bg--canvas text-main transition-colors duration-200 min-h-screen py-12">
	<nav class="container mb-5" aria-label="Breadcrumb">
		<a
			href={`/${locale}/blog` as ResolvedPathname}
			class="text-sm font-medium text-primary hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
		>
			{locale === 'de' ? '← Zurück zum Blog' : '← Back to blog'}
		</a>
	</nav>

	<div class="container">
		<Blog {locale} {post} />
	</div>
</div>
