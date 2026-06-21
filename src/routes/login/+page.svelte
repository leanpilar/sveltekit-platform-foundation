<script lang="ts">
	import '../../app.css';
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/primitives/Button.svelte';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Sign in · SvelteKit Platform Foundation</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="bg-canvas text-main flex min-h-screen items-center justify-center px-4 py-12">
	<div class="w-full max-w-sm">
		<div class="mb-6 text-center">
			<h1 class="text-2xl font-extrabold tracking-tight">Sign in</h1>
			<p class="text-muted mt-1 text-sm">Access the campaigns dashboard.</p>
		</div>

		<form
			method="POST"
			action="?/login"
			use:enhance
			class="border-muted bg-surface flex flex-col gap-4 rounded-xl border p-6 shadow-sm"
		>
			<label class="flex flex-col gap-1.5">
				<span class="text-main text-sm font-semibold">Email</span>
				<input
					type="email"
					name="email"
					required
					autocomplete="email"
					class="border-muted bg-canvas text-main focus-visible:ring-primary rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-hidden"
				/>
			</label>
			{#if form?.errors?.email}
				<span class="text-sm text-red-600 dark:text-red-400">{form.errors.email[0]}</span>
			{/if}

			<label class="flex flex-col gap-1.5">
				<span class="text-main text-sm font-semibold">Password</span>
				<input
					type="password"
					name="password"
					required
					autocomplete="current-password"
					class="border-muted bg-canvas text-main focus-visible:ring-primary rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-hidden"
				/>
			</label>
			{#if form?.errors?.password}
				<span class="text-sm text-red-600 dark:text-red-400">{form.errors.password[0]}</span>
			{/if}

			{#if form?.message}
				<div
					class="error-banner rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
					role="alert"
				>
					{form.message}
				</div>
			{/if}

			<Button type="submit" class="mt-2 w-full">Log In</Button>
		</form>
	</div>
</main>
