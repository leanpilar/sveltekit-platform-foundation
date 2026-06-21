<script lang="ts">
	import type { Snippet } from 'svelte';

	type Pad = 'sm' | 'md' | 'lg';

	interface Props {
		padding?: Pad;
		class?: string;
		children: Snippet;
	}

	let { padding = 'md', class: extra = '', children }: Props = $props();

	const pads: Record<Pad, string> = {
		sm: 'p-3',
		md: 'p-4',
		lg: 'p-6'
	};
</script>

<div class={`border-muted bg-surface rounded-lg border ${pads[padding]} ${extra}`}>
	{@render children()}
</div>
