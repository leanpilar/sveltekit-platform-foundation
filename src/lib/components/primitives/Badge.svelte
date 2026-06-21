<script lang="ts">
	interface Props {
		status: string;
	}

	let { status }: Props = $props();

	// Categorical status indicator colors (data viz, not theme chrome). The chip
	// itself uses semantic tokens; only the dot carries the status color.
	const dotColors: Record<string, string> = {
		draft: '#94a3b8',
		scheduled: '#f59e0b',
		active: '#22c55e',
		paused: '#ef4444',
		completed: '#3b82f6',
		archived: '#6b7280'
	};

	let color = $derived(dotColors[status] ?? '#94a3b8');
</script>

<span
	class="border-muted bg-surface text-main inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium capitalize"
>
	<span class="h-1.5 w-1.5 rounded-full" style:background-color={color} aria-hidden="true"></span>
	{status}
</span>
