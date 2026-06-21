<script lang="ts">
	import type { ResolvedPathname } from '$app/types';
	import Button from '$lib/components/primitives/Button.svelte';
	import Container from '$lib/components/primitives/Container.svelte';
	import Heading from '$lib/components/primitives/Heading.svelte';
	import Card from '$lib/components/primitives/Card.svelte';
</script>

<svelte:head>
	<title>Dashboard · SvelteKit Platform Foundation</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<Container size="xl" class="py-8">
	<Heading level={1}>Dashboard</Heading>
	<p class="text-muted mt-2 text-sm">Manage your campaigns and review performance.</p>

	<Card padding="lg" class="mt-6 max-w-md">
		<Heading level={3}>Campaigns</Heading>
		<p class="text-muted mt-1 text-sm">
			Browse, filter, sort and edit campaign budgets in the data table.
		</p>
		<div class="mt-4">
			<a href={'/dashboard/items' as ResolvedPathname}>
				<Button>Open items</Button>
			</a>
		</div>
	</Card>
</Container>
