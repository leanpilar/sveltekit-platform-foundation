<script lang="ts">
	import BlogList from '$lib/components/BlogList.svelte';

	let { data } = $props();

	let locale = $derived(data.locale);
	let posts = $derived(data.posts);
	let currentPage = $derived(data.currentPage);
	let nextPageExists = $derived(data.nextPageExists);
</script>

<BlogList {locale} {posts} {currentPage} {nextPageExists} />
