import type { Config } from '@sveltejs/adapter-vercel';
import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/public';
import { isPromoEnabled } from '$lib/featureFlags';

export const config: Config = {
	runtime: 'edge',
	split: true
};
const SUPPORTED_LOCALES = ['en', 'de'];

export const load: LayoutServerLoad = async ({ url, cookies }) => {
	const segment = url.pathname.split('/')[1];
	const locale: 'en' | 'de' = SUPPORTED_LOCALES.includes(segment) ? (segment as 'en' | 'de') : 'en';

	// Feature flag resolved on the server, so the correct variant ships in the SSR
	// HTML — no client-side flicker. `?promo=on|off` flips the cookie for demos.
	const toggle = url.searchParams.get('promo');
	let promo: boolean;
	if (toggle === 'on') {
		cookies.set('ff_promo', '1', { path: '/', sameSite: 'lax' });
		promo = true;
	} else if (toggle === 'off') {
		cookies.delete('ff_promo', { path: '/' });
		promo = false;
	} else {
		promo = isPromoEnabled(cookies.get('ff_promo'), env.PUBLIC_FEATURE_PROMO);
	}

	return { locale, flags: { promo } };
};
