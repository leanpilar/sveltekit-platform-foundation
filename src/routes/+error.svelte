<script lang="ts">
	import { page } from '$app/state';
	import type { ResolvedPathname } from '$app/types';
	import { toLocale } from '$lib/i18n';

	let status = $derived(page.status);
	let locale = $derived(toLocale(page.url.pathname.split('/')[1]));
	let isNotFound = $derived(status === 404);

	const copy = {
		en: {
			notFoundTitle: 'Page not found',
			notFoundBody: 'The page you are looking for does not exist or may have moved.',
			errorTitle: 'Something went wrong',
			errorBody: 'An unexpected error occurred. Please try again.',
			home: 'Go to home',
			blog: 'Browse the blog'
		},
		de: {
			notFoundTitle: 'Seite nicht gefunden',
			notFoundBody: 'Die gesuchte Seite existiert nicht oder wurde verschoben.',
			errorTitle: 'Etwas ist schiefgelaufen',
			errorBody: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.',
			home: 'Zur Startseite',
			blog: 'Zum Blog'
		}
	};

	let t = $derived(copy[locale]);
	let homeHref = $derived((locale === 'en' ? '/' : '/de') as ResolvedPathname);
	let blogHref = $derived(`/${locale}/blog` as ResolvedPathname);
</script>

<svelte:head>
	<title>{status} · {isNotFound ? t.notFoundTitle : t.errorTitle}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="bg-canvas text-main flex min-h-screen items-center justify-center px-4 py-16">
	<div class="mx-auto max-w-md text-center">
		<p class="text-primary text-sm font-bold tracking-widest uppercase">Error {status}</p>
		<h1 class="text-main mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
			{isNotFound ? t.notFoundTitle : t.errorTitle}
		</h1>
		<p class="text-muted mt-4 text-base">
			{isNotFound ? t.notFoundBody : t.errorBody}
		</p>
		{#if page.error?.message && !isNotFound}
			<p class="text-muted mt-2 text-sm italic">{page.error.message}</p>
		{/if}

		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<a
				href={homeHref}
				class="bg-primary text-canvas focus-visible:ring-primary rounded-md px-5 py-2.5 text-sm font-semibold hover:opacity-90 focus-visible:ring-2 focus-visible:outline-hidden"
			>
				{t.home}
			</a>
			<a
				href={blogHref}
				class="border-muted text-main focus-visible:ring-primary rounded-md border px-5 py-2.5 text-sm font-semibold hover:opacity-90 focus-visible:ring-2 focus-visible:outline-hidden"
			>
				{t.blog}
			</a>
		</div>
	</div>
</main>
