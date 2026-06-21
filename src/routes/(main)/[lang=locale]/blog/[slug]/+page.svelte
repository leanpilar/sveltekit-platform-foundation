<script lang="ts">
	import type { ResolvedPathname } from '$app/types';
	import Blog from '$lib/components/Blog.svelte';

	let { data } = $props();

	let locale = $derived(data.locale);
	let post = $derived(data.post);
</script>

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
