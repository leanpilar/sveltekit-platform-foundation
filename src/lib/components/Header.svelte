<script lang="ts">
	import NavLink from './NavLink.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import type { ResolvedPathname } from '$app/types';
	import LocaleToggle from './LocaleToggle.svelte';
	import { createTranslator, toLocale } from '$lib/i18n';

	interface Props {
		locale: string;
	}

	let { locale }: Props = $props();
	let homePath = $derived(locale === 'en' ? '/' : (`/${locale}` as ResolvedPathname));
	let t = $derived(createTranslator(toLocale(locale)));
</script>

<header class="border-b border-main bg-canvas transition-colors duration-200">
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
		<div class="flex items-center gap-8">
			<nav aria-label="Main Navigation" class="flex items-center gap-2">
				<NavLink href={homePath} class="text-primary text-lg!">{t('nav.home')}</NavLink>
				<NavLink href="/{locale}/blog" class="text-primary">{t('nav.blog')}</NavLink>
				<NavLink href="/{locale}/search" class="text-primary">{t('nav.search')}</NavLink>
			</nav>
		</div>
		<div class="flex items-center gap-4">
			<LocaleToggle />
			<ThemeToggle />
		</div>
	</div>
</header>
