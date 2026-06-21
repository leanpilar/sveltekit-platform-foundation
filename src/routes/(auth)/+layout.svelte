<script lang="ts">
	import './dashboard.css';
	import type { ResolvedPathname } from '$app/types';

	let { children, data } = $props();
</script>

<div class="bg-canvas text-main min-h-screen">
	<header class="border-muted bg-surface border-b">
		<div
			class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
		>
			<nav class="flex items-center gap-4" aria-label="Dashboard navigation">
				<a href={'/dashboard' as ResolvedPathname} class="text-main font-bold">Platform</a>
				<a
					href={'/dashboard/items' as ResolvedPathname}
					class="text-muted hover:text-main text-sm font-medium"
				>
					Items
				</a>
			</nav>
			<div class="flex items-center gap-3 text-sm">
				<span class="text-muted hidden sm:inline">Signed in as {String(data.user.id)}</span>
				<form method="POST" action="/logout">
					<button
						type="submit"
						class="border-muted text-main hover:bg-canvas focus-visible:ring-primary rounded-md border px-3 py-1.5 text-sm font-semibold focus-visible:ring-2 focus-visible:outline-hidden"
					>
						Sign out
					</button>
				</form>
			</div>
		</div>
	</header>

	{@render children()}
</div>
