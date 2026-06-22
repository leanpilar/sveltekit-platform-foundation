<script lang="ts">
	import './main.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { initRum } from '$lib/rum/rum';
	import { dev } from '$app/environment';

	let { children, data } = $props();
	let locale = $derived(data.locale);

	onMount(() => {
		void initRum({
			sampleRate: dev ? 1 : 0.1,
			locale
		});
	});

	// Cross-document view transitions — progressive enhancement. Skipped when the
	// browser lacks support or the user prefers reduced motion.
	onNavigate((navigation) => {
		if (typeof document === 'undefined' || !document.startViewTransition) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<a
	href="#main-content"
	class="bg-primary text-canvas focus-visible:ring-primary sr-only rounded-md px-4 py-2 text-sm font-semibold focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus-visible:ring-2"
>
	{locale === 'de' ? 'Zum Inhalt springen' : 'Skip to main content'}
</a>

{#if data.flags?.promo}
	<div
		class="bg-primary text-canvas px-4 py-2 text-center text-sm font-medium"
		role="region"
		aria-label="Announcement"
	>
		{locale === 'de'
			? '🎉 Sommer-Launch — 20 % Rabatt auf den Enterprise-Tarif.'
			: '🎉 Summer launch — 20% off the Enterprise tier.'}
	</div>
{/if}

<Header {locale} />

<main id="main-content" class="main">
	{@render children()}
</main>
