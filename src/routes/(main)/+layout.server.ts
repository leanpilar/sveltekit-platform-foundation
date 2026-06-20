import type { Config } from '@sveltejs/adapter-vercel';
import type { LayoutServerLoad } from './$types';

export const config: Config = {
	runtime: 'edge',
	split: true
};

export const load: LayoutServerLoad = async () => {
	return {};
};
