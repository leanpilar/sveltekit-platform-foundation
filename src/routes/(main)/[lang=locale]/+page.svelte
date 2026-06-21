<script lang="ts">
	import { page } from '$app/state';
	import LandingPage from '$lib/components/LandingPage.svelte';
	import Seo from '$lib/seo/Seo.svelte';
	import { organizationLd } from '$lib/seo/jsonld';

	let { data } = $props();
	let locale = $derived(data.locale);
	let title = $derived(
		locale === 'de'
			? 'SvelteKit Platform Foundation – Schneller, produktionsreifer Web-Stack'
			: 'SvelteKit Platform Foundation – A faster, production-grade web stack'
	);
	let description = $derived(
		locale === 'de'
			? 'Das produktionsbereite Fundament für hochperformante SvelteKit-Plattformen.'
			: 'The production-ready foundation for high-performance SvelteKit platforms.'
	);
</script>

<Seo {title} {description} basePath="/" {locale} jsonLd={organizationLd(page.url.origin)} />

<LandingPage {locale} />
