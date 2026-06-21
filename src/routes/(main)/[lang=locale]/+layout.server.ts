import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, url }) => {
	const { lang } = params;

	// 1. If on /en, redirect to the clean root /
	if (lang === 'en' && url.pathname === '/en') {
		throw redirect(308, '/');
	}

	// 2. If missing the param on sub-routes (e.g., /blog), force the redirect
	if (!lang && url.pathname !== '/') {
		throw redirect(308, `/en${url.pathname}${url.search}`);
	}
};
