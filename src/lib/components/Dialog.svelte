<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		title: string;
		trigger: Snippet;
		content: Snippet;
	}

	let { isOpen, onClose, title, trigger, content }: Props = $props();
	let dialogRef = $state<HTMLDialogElement | null>(null);

	$effect(() => {
		if (!dialogRef) return;
		if (isOpen) {
			dialogRef.showModal();
			document.body.style.overflow = 'hidden';
		} else {
			dialogRef.close();
			document.body.style.overflow = '';
		}
	});

	/**
	 * Intercepts keyboard events to manage the focus trap and escape containment native hooks
	 */
	function handleKeyDown(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			event.preventDefault();
			onClose();
		}
	}

	/**
	 * Handles clicks on the dialog backdrop
	 */
	function handleBackdropClick(event: MouseEvent): void {
		if (event.target === dialogRef) {
			onClose();
		}
	}
</script>

{@render trigger()}

<dialog
	bind:this={dialogRef}
	onkeydown={handleKeyDown}
	onclick={handleBackdropClick}
	aria-labelledby="modal-title"
	class="fixed inset-0 m-auto max-w-lg rounded-lg border border-muted bg-canvas p-6 shadow-xl backdrop:bg-black/50 backdrop:backdrop-blur-sm focus:outline-hidden"
>
	<div role="document" class="flex flex-col gap-4">
		<header class="flex items-center justify-between">
			<h2 id="modal-title" class="text-xl font-bold text-main">{title}</h2>
			<button
				onclick={onClose}
				aria-label="Close dialog"
				type="button"
				class="rounded p-1 focus-visible:ring-2 focus-visible:ring-primary focus:outline-hidden"
			>
				✕
			</button>
		</header>
		<main class="text-muted">
			{@render content()}
		</main>
	</div>
</dialog>
