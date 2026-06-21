<script lang="ts">
	import type { Snippet } from 'svelte';

	type Size = 'md' | 'lg' | 'xl';

	interface Props {
		size?: Size;
		class?: string;
		children: Snippet;
	}

	let { size = 'lg', class: extra = '', children }: Props = $props();

	const widths: Record<Size, string> = {
		md: 'max-w-3xl',
		lg: 'max-w-5xl',
		xl: 'max-w-7xl'
	};
</script>

<div class={`mx-auto px-4 sm:px-6 lg:px-8 ${widths[size]} ${extra}`}>
	{@render children()}
</div>
