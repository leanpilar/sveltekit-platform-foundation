import type { PageServerLoad } from './$types';
import type { BlogPost } from '$lib/server/dto';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent, params }) => {
	const posts: BlogPost[] = await fetch('/api/posts').then((res) => res.json());
	const parentDate = await parent();
	const preparedPostsForLocale = posts.map((post) => ({
		...post,
		translations: undefined,
		...post.translations[parentDate.locale]
	}));
	const post = preparedPostsForLocale.find((post) => post.slug === params.slug);
	if (!post) {
		error(404);
	}
	return { post };
};
