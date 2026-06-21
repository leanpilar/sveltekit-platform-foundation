<script lang="ts">
	import './main.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import { onMount } from 'svelte';
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
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<a
	href="#main-content"
	class="bg-primary text-canvas focus-visible:ring-primary sr-only rounded-md px-4 py-2 text-sm font-semibold focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus-visible:ring-2"
>
	{locale === 'de' ? 'Zum Inhalt springen' : 'Skip to main content'}
</a>

<Header {locale} />

<main id="main-content" class="main">
	{@render children()}
</main>
