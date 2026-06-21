import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { z } from 'zod';
import { createSessionToken, getAll, verifySessionToken } from '$lib';
import { userSchema } from '$lib/server/dto';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6)
});

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('session');
	if (token) {
		const session = verifySessionToken(token);
		if (session) {
			redirect(302, '/dashboard');
		}
	}

	return {};
};

export const actions: Actions = {
	/**
	 * Validates runtime form payloads and provisions HttpOnly session identification tokens
	 */
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		const result = loginSchema.safeParse(data);
		if (!result.success) {
			return fail(400, { errors: result.error.flatten().fieldErrors });
		}

		// Validate the user store at the boundary instead of trusting the JSON.
		const users = userSchema.array().parse(await getAll('users'));
		const user = users.find((u) => u.email === result.data.email);

		if (!user || user.password !== result.data.password) {
			return fail(401, { message: 'Invalid credentials' });
		}

		const token = createSessionToken(user.id);
		cookies.set('session', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: !dev,
			maxAge: 60 * 60 * 24
		});

		redirect(303, '/dashboard');
	}
};
