import type { Config } from '@sveltejs/adapter-vercel';
import type { LayoutServerLoad } from './$types';

export const config: Config = {
	runtime: 'edge',
	split: true
};
const SUPPORTED_LOCALES = ['en', 'de'];

export const load: LayoutServerLoad = async ({ url }) => {
	const segment = url.pathname.split('/')[1];
	const locale: 'en' | 'de' = SUPPORTED_LOCALES.includes(segment) ? (segment as 'en' | 'de') : 'en';
	return { locale };
};
