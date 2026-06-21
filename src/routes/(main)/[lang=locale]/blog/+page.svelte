<script lang="ts">
	import BlogList from '$lib/components/BlogList.svelte';

	let { data } = $props();

	$effect(() => {
		console.log({ data });
	});
	let locale = $derived(data.locale);
	let currentPage = $derived(data.currentPage);
	let nextPageExists = $derived(data.nextPageExists);
	let posts = $derived(data.posts);
</script>

<BlogList {locale} {posts} {currentPage} {nextPageExists} />
