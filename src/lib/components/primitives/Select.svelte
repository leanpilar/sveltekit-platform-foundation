<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	interface Props extends HTMLSelectAttributes {
		class?: string;
		children: Snippet;
	}

	let { class: extra = '', children, ...rest }: Props = $props();

	const base =
		'border-muted bg-canvas text-main focus-visible:ring-primary rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-hidden';
</script>

<select class={`${base} ${extra}`} {...rest}>
	{@render children()}
</select>
