<script lang="ts">
	import type { ResolvedPathname } from '$app/types';
	import { afterNavigate, goto } from '$app/navigation';
	import Blog from './Blog.svelte';

	interface BlogPost {
		id: string;
		slug: string;
		[key: string]: unknown;
	}

	interface Props {
		locale: string;
		posts: BlogPost[];
		currentPage: number;
		nextPageExists: boolean;
	}

	let { locale, posts, currentPage, nextPageExists }: Props = $props();

	let accumulatedPosts = $state<BlogPost[]>([]);
	let observerTarget: HTMLElement | null = $state(null);

	let isNavigationLocked = $state(false);
	let userHasScrolledDown = $state(true);
	let restoredScrollBaseline = 0;

	// Keep accumulation safe across component execution cycles
	$effect(() => {
		const existingIds = new Set(accumulatedPosts.map((p) => p.id));
		const uniqueNewPosts = posts.filter((p) => !existingIds.has(p.id));

		if (uniqueNewPosts.length > 0) {
			accumulatedPosts = [...accumulatedPosts, ...uniqueNewPosts];
		}
	});

	afterNavigate((navigation) => {
		if (navigation.type === 'popstate') {
			isNavigationLocked = true;
			userHasScrolledDown = false;

			// Yield to the macro-task queue until the browser completes its scroll restoration jump
			setTimeout(() => {
				restoredScrollBaseline = window.scrollY;
				isNavigationLocked = false;
			}, 200);
		} else {
			userHasScrolledDown = true;
			isNavigationLocked = false;
		}
	});

	/**
	 * Tracks window scroll changes to detect intentional downward user scrolling
	 */
	function handleWindowScroll(): void {
		if (userHasScrolledDown || isNavigationLocked) return;

		// Re-arm only if the user moves down past the point where the browser dropped them off
		if (window.scrollY > restoredScrollBaseline + 30) {
			userHasScrolledDown = true;
		}
	}

	$effect(() => {
		// Strict structural check: exit if locked or if no downward intent is validated
		if (!observerTarget || !nextPageExists || isNavigationLocked || !userHasScrolledDown) return;

		const observer = new IntersectionObserver(
			async (entries) => {
				if (entries[0].isIntersecting && !isNavigationLocked && userHasScrolledDown) {
					isNavigationLocked = true;
					const nextIdx = currentPage + 1;

					await goto(`/${locale}/blog/page/${nextIdx}` as ResolvedPathname, {
						noScroll: true,
						keepFocus: true
					});

					isNavigationLocked = false;
				}
			},
			{ rootMargin: '150px' }
		);

		observer.observe(observerTarget);
		return () => observer.disconnect();
	});
</script>

<svelte:window onscroll={handleWindowScroll} />

<div class="text-main min-h-screen py-12">
	{#each accumulatedPosts as post (post.id)}
		<div
			class="container hover:bg-muted-accent transition-colors duration-200 mb-5 py-3 rounded-2xl"
		>
			<a href={`/${locale}/blog/${post.slug}` as ResolvedPathname}>
				<Blog {locale} {post} />
			</a>
		</div>
	{/each}
</div>

<div class="mt-12 flex justify-center min-h-[64px]" bind:this={observerTarget}>
	{#if nextPageExists}
		<noscript>
			<a
				href={`/${locale}/blog/page/${currentPage + 1}` as ResolvedPathname}
				class="rounded-md bg-[--bg-surface] border border-[--border-muted] px-4 py-2 text-sm font-semibold hover:bg-[--border-muted]"
			>
				Next Page
			</a>
		</noscript>
	{:else}
		<p class="text-sm text-[--text-muted]" role="status">End of collection parsed.</p>
	{/if}
</div>
