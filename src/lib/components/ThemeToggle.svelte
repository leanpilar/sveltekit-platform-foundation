<script lang="ts">
	import { browser } from '$app/environment';

	type Theme = 'light' | 'dark';
	let currentTheme = $state<Theme>('dark');

	/**
	 * Toggles the theme attribute context and serializes the user choice
	 */
	function toggleTheme(): void {
		currentTheme = currentTheme === 'light' ? 'dark' : 'light';
		if (browser) {
			document.documentElement.setAttribute('data-theme', currentTheme);
			localStorage.setItem('theme', currentTheme);
		}
	}

	$effect(() => {
		if (!browser) return;

		const saved = localStorage.getItem('theme') as Theme | null;
		if (saved) {
			currentTheme = saved;
		} else {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			currentTheme = prefersDark ? 'dark' : 'light';
		}

		document.documentElement.setAttribute('data-theme', currentTheme);
	});
</script>

<button
	type="button"
	onclick={toggleTheme}
	aria-label={currentTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
	class="rounded-md cursor-pointer p-2 text-muted hover:text-main transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
>
	{#if currentTheme === 'dark'}
		<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.344l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"
			/>
		</svg>
	{:else}
		<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
			/>
		</svg>
	{/if}
</button>
