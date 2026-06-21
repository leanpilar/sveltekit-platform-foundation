<script lang="ts">
	import { getToasts, dismissToast } from '$lib/stores/toasts.svelte';
</script>

<div class="fixed right-4 bottom-4 z-50 flex flex-col gap-2" aria-live="polite" aria-atomic="false">
	{#each getToasts() as toast (toast.id)}
		<div
			role="status"
			class={`flex items-center gap-3 rounded-md border px-4 py-2 text-sm shadow-md ${
				toast.type === 'error'
					? 'border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200'
					: 'border-green-300 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200'
			}`}
		>
			<span>{toast.message}</span>
			<button
				type="button"
				onclick={() => dismissToast(toast.id)}
				aria-label="Dismiss notification"
				class="ml-auto rounded px-1 opacity-70 hover:opacity-100 focus-visible:ring-2 focus-visible:outline-hidden"
			>
				✕
			</button>
		</div>
	{/each}
</div>
