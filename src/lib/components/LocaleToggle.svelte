<script lang="ts">
	import { page } from '$app/state';
	import type { ResolvedPathname } from '$app/types';

	let currentLocale = $derived(page.url.pathname.split('/')[1] === 'de' ? 'de' : 'en');
	let targetLocale: 'en' | 'de' = $derived(currentLocale === 'en' ? 'de' : 'en');
	let targetHref = $derived(computeTargetHref(targetLocale));

	/**
	 * Computes the localized destination pathname by mutating the URL culture segment
	 */
	function computeTargetHref(target: 'en' | 'de'): ResolvedPathname {
		const { pathname, search } = page.url;

		if (pathname === '/' || pathname === '/de') {
			const base = target === 'en' ? '/' : '/de';
			return `${base}${search}` as ResolvedPathname;
		}

		const segments = pathname.split('/');
		if (['en', 'de'].includes(segments[1])) {
			segments[1] = target;
		} else {
			segments.splice(1, 0, target);
		}

		return `${segments.join('/')}${search}` as ResolvedPathname;
	}
</script>

<a
	href={targetHref}
	data-sveltekit-reload
	hreflang={targetLocale}
	aria-label="Switch language to {targetLocale === 'de' ? 'German' : 'English'}"
	class="rounded-md px-3 py-2 text-sm font-semibold uppercase tracking-wider transition-colors duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary text-muted hover:text-main"
>
	{targetLocale}
</a>
