import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const config = {
	runtime: 'nodejs22.x'
};

/** Clears the session cookie and returns to the public surface. */
export const POST: RequestHandler = async ({ cookies }) => {
	cookies.delete('session', { path: '/' });
	redirect(303, '/');
};
