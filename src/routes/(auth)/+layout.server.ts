import { redirect } from '@sveltejs/kit';
import type { Config } from '@sveltejs/adapter-vercel';
import type { LayoutServerLoad } from './$types';

export const config: Config = {
	runtime: 'nodejs22.x',
	regions: ['fra1'],
	split: true
};

export const load: LayoutServerLoad = async ({ cookies }) => {
	const session = cookies.get('session_id');
	if (!session) {
		throw redirect(302, '/login');
	}
	return { userSession: 'valid' };
};
