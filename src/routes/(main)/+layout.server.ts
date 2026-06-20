import type { Config } from '@sveltejs/adapter-vercel';
import type { LayoutServerLoad } from '../../../.svelte-kit/types/src/routes/(auth)/$types';
import { persistance } from '$lib';
import { getAll } from '$lib/server/data-model';

export const config: Config = {
	runtime: 'edge',
	split: true
};

export const load: LayoutServerLoad = async () => {
	persistance.seedData();
	console.log(await getAll('posts'));
	return {}
}