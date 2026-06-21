<script lang="ts">
	import type { Snippet } from 'svelte';

	type Level = 1 | 2 | 3 | 4 | 5 | 6;

	interface Props {
		level?: Level;
		id?: string;
		class?: string;
		children: Snippet;
	}

	let { level = 2, id, class: extra = '', children }: Props = $props();

	const sizes: Record<Level, string> = {
		1: 'text-4xl font-extrabold tracking-tight',
		2: 'text-2xl font-bold tracking-tight',
		3: 'text-lg font-semibold',
		4: 'text-base font-semibold',
		5: 'text-sm font-semibold',
		6: 'text-xs font-semibold tracking-wide uppercase'
	};
</script>

<svelte:element this={`h${level}`} {id} class={`text-main ${sizes[level]} ${extra}`}>
	{@render children()}
</svelte:element>
