<script lang="ts">
	import NavLink from './NavLink.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import type { ResolvedPathname } from '$app/types';
	import LocaleToggle from './LocaleToggle.svelte';

	interface Props {
		locale: string;
	}

	let { locale }: Props = $props();
	let homePath = $derived(locale === 'en' ? '/' : (`/${locale}` as ResolvedPathname));
</script>

<header class="border-b border-main bg-canvas transition-colors duration-200">
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
		<div class="flex items-center gap-8">
			<nav aria-label="Main Navigation" class="flex items-center gap-2">
				<NavLink href={homePath} class="text-primary text-lg!">Home</NavLink>
				<NavLink href="/{locale}/blog" class="text-primary">Blog</NavLink>
				<NavLink href="/{locale}/search" class="text-primary">Search</NavLink>
			</nav>
		</div>
		<div class="flex items-center gap-4">
			<LocaleToggle />
			<ThemeToggle />
		</div>
	</div>
</header>
