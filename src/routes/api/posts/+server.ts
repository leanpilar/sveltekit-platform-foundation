import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAll } from '$lib';
import { blogPostSchema } from '$lib/server/dto';

export const config = {
	runtime: 'nodejs24.x'
};

const postsSchema = blogPostSchema.array();

export const GET: RequestHandler = async () => {
	const raw = await getAll('posts');
	// Validate the mock data at the boundary — never trust the JSON blindly.
	const posts = postsSchema.parse(raw);
	return json(posts);
};
