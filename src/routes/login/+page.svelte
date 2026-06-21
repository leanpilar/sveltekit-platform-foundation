<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Sign in · SvelteKit Platform Foundation</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<form method="POST" action="?/login" class="auth-form" use:enhance>
	<label>
		<span>Email</span>
		<input type="email" name="email" required />
	</label>
	{#if form?.errors?.email}
		<span class="error">{form.errors.email[0]}</span>
	{/if}

	<label>
		<span>Password</span>
		<input type="password" name="password" required />
	</label>
	{#if form?.errors?.password}
		<span class="error">{form.errors.password[0]}</span>
	{/if}

	{#if form?.message}
		<div class="error-banner">{form.message}</div>
	{/if}

	<button type="submit">Log In</button>
</form>
