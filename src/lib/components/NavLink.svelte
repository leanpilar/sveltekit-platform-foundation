<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';
	import type { ResolvedPathname } from '$app/types';

	interface Props {
		href: ResolvedPathname;
		children: Snippet;
		class?: string;
	}

	let { href, children, class: className }: Props = $props();
	let isActive = $derived(page.url.pathname === href);
</script>

<a
	{href}
	aria-current={isActive ? 'page' : undefined}
	class="rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-secondary text-text-secondary hover:text-secondary {className}"
	class:text-secondary={isActive}
>
	{@render children()}
</a>
