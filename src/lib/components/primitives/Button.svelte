<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'outline' | 'ghost';
	type Size = 'sm' | 'md';

	interface Props extends HTMLButtonAttributes {
		variant?: Variant;
		size?: Size;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		type = 'button',
		class: extra = '',
		children,
		...rest
	}: Props = $props();

	const base =
		'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50';

	const variants: Record<Variant, string> = {
		primary: 'bg-primary text-canvas hover:opacity-90',
		outline: 'border border-muted text-main hover:bg-surface',
		ghost: 'text-main hover:bg-surface'
	};

	const sizes: Record<Size, string> = {
		sm: 'px-2.5 py-1 text-xs',
		md: 'px-4 py-2 text-sm'
	};
</script>

<button {type} class={`${base} ${variants[variant]} ${sizes[size]} ${extra}`} {...rest}>
	{@render children()}
</button>
