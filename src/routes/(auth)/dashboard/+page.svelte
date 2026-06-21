<script lang="ts">
	import type { ResolvedPathname } from '$app/types';
	import Button from '$lib/components/primitives/Button.svelte';
</script>

<svelte:head>
	<title>Dashboard · SvelteKit Platform Foundation</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<h1 class="text-2xl font-extrabold tracking-tight">Dashboard</h1>
	<p class="text-muted mt-2 text-sm">Manage your campaigns and review performance.</p>

	<div class="border-muted bg-surface mt-6 max-w-md rounded-lg border p-6">
		<h2 class="text-main text-lg font-semibold">Campaigns</h2>
		<p class="text-muted mt-1 text-sm">
			Browse, filter, sort and edit campaign budgets in the data table.
		</p>
		<div class="mt-4">
			<a href={'/dashboard/items' as ResolvedPathname}>
				<Button>Open items</Button>
			</a>
		</div>
	</div>
</section>
