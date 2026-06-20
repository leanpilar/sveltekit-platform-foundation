import { redirect } from '@sveltejs/kit';
import type { Config } from '@sveltejs/adapter-vercel';
import type { LayoutServerLoad } from './$types';
import { verifySessionToken } from '$lib';

export const config: Config = {
	runtime: 'nodejs22.x',
	regions: ['fra1'],
	split: true
};

export const load: LayoutServerLoad = async ({ cookies }) => {
	const token = cookies.get('session');
	if (!token) {
		redirect(302, '/login');
	}

	const session = verifySessionToken(token);
	if (!session) {
		redirect(302, '/login');
	}

	return {
		user: {
			id: session.userId
		}
	};
};