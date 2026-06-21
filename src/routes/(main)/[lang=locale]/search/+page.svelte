<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import type { ResolvedPathname } from '$app/types';
	import SearchFilters from '$lib/components/SearchFilters.svelte';
	import Seo from '$lib/seo/Seo.svelte';
	import { toLocale } from '$lib/i18n';
	import { parseSearchURL, serializeSearchURL } from '$lib/utils/searchCodec';

	interface SimplifiedPost {
		id: string;
		slug: string;
		title: string;
		excerpt: string;
		tags: string[];
		publishedAt: string;
	}

	interface Props {
		data: {
			posts: SimplifiedPost[];
		};
	}

	let { data }: Props = $props();

	let currentLocale = $derived(toLocale(page.params.lang));
	let searchState = $derived(parseSearchURL(page.url));
	let allTags = $derived([...new Set(data.posts.flatMap((post) => post.tags))]);

	let filteredAndSortedPosts = $derived(
		data.posts
			.filter((post) => {
				const matchesQuery =
					!searchState.q ||
					post.title.toLowerCase().includes(searchState.q.toLowerCase()) ||
					post.excerpt.toLowerCase().includes(searchState.q.toLowerCase());
				const matchesTag = !searchState.tag || post.tags.includes(searchState.tag);
				return matchesQuery && matchesTag;
			})
			.sort((a, b) => {
				if (searchState.sort === 'oldest') {
					return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
				}
				return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
			})
	);

	/**
	 * Processes custom filter updates and synchronizes history state
	 */
	function handleFilterChange(
		event: CustomEvent<{ q?: string; tag?: string; sort?: 'latest' | 'oldest' }>
	): void {
		const nextState = { ...searchState, ...event.detail };
		const targetDestination = serializeSearchURL(page.url.pathname, nextState);

		goto(targetDestination as ResolvedPathname, {
			keepFocus: true,
			noScroll: true
		});
	}
</script>

<Seo
	title={currentLocale === 'de' ? 'Suche – Blog' : 'Search – Blog'}
	description={currentLocale === 'de'
		? 'Durchsuche alle Blogbeiträge nach Stichwort, Tag und Datum.'
		: 'Search all blog posts by keyword, tag and date.'}
	basePath="/search"
	locale={currentLocale}
	noindex={Boolean(searchState.q || searchState.tag)}
/>

<div class="bg-canvas text-main min-h-screen py-12 transition-colors duration-200">
	<div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
		<header class="border-b border-[--border-muted] pb-8 mb-8">
			<h1 class="text-4xl font-extrabold tracking-tight">
				{currentLocale === 'de' ? 'Suche' : 'Search Blogs'}
			</h1>
		</header>

		<SearchFilters
			searchQuery={searchState.q}
			selectedTag={searchState.tag}
			currentSort={searchState.sort}
			{allTags}
			{currentLocale}
			onchange={handleFilterChange}
		/>

		<div role="region" aria-live="polite" aria-label="Search Results">
			{#if filteredAndSortedPosts.length > 0}
				<ul role="list" class="divide-y divide-[--border-muted]">
					{#each filteredAndSortedPosts as post (post.id)}
						<li class="py-6">
							<article>
								<h2 class="text-2xl font-bold tracking-tight hover:text-[--brand-primary]">
									<a href={`/${currentLocale}/blog/${post.slug}` as ResolvedPathname}>
										{post.title}
									</a>
								</h2>
								<p class="mt-2 text-base text-[--text-muted] line-clamp-2">
									{post.excerpt}
								</p>
								<div class="mt-3 flex flex-wrap gap-1">
									{#each post.tags as tag (tag)}
										<span
											class="inline-flex items-center rounded-md bg-canvas px-2 py-0.5 text-xs font-medium text-[--text-muted] border border-[--border-muted]"
										>
											#{tag}
										</span>
									{/each}
								</div>
							</article>
						</li>
					{/each}
				</ul>
			{:else}
				<div class="text-center py-12 border border-dashed border-[--border-muted] rounded-lg">
					<p class="text-muted">
						{currentLocale === 'de'
							? 'Keine Ergebnisse gefunden.'
							: 'No items matched your filtering options.'}
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
