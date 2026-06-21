<script lang="ts">
	import './main.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';

	let { children, data } = $props();
	let locale = $derived(data.locale);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<main class="main">
	<Header {locale} />

	{@render children()}
</main>
