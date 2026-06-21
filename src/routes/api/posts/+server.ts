import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAll } from '$lib';

export const config = {
	runtime: 'nodejs20.x'
};

export const GET: RequestHandler = async () => {
	const posts = await getAll('posts');
	return json(posts);
};
