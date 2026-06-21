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
		initRum({
			sampleRate: dev ? 1 : 0.1,
			locale
		});
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<main class="main">
	<Header {locale} />

	{@render children()}
</main>
