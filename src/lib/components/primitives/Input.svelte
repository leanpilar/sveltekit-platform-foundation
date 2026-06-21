<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		class?: string;
	}

	let { class: extra = '', ...rest }: Props = $props();

	const base =
		'border-muted bg-canvas text-main focus-visible:ring-primary w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-hidden';
</script>

<input class={`${base} ${extra}`} {...rest} />
