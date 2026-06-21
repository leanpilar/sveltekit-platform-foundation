<script lang="ts">
	import BlogList from '$lib/components/BlogList.svelte';
	import Seo from '$lib/seo/Seo.svelte';

	let { data } = $props();

	let locale = $derived(data.locale);
	let posts = $derived(data.posts);
	let currentPage = $derived(data.currentPage);
	let nextPageExists = $derived(data.nextPageExists);

	let title = $derived(
		locale === 'de' ? `Blog – Seite ${currentPage}` : `Blog – Page ${currentPage}`
	);
	let description = $derived(
		locale === 'de'
			? 'Beiträge zu Performance, Architektur, Barrierefreiheit und mehr.'
			: 'Posts on performance, architecture, accessibility and more.'
	);
</script>

<Seo {title} {description} basePath="/blog" {locale} noindex={currentPage > 1} />

<BlogList {locale} {posts} {currentPage} {nextPageExists} />
