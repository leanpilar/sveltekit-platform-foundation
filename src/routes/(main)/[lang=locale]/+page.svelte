<script>
	import LandingPage from '$lib/components/LandingPage.svelte';
	let { data } = $props();
	let locale = $derived(data.locale);
</script>

<LandingPage {locale} />
