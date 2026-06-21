import type { PageServerLoad } from './$types';
import { getAll } from '$lib';
import type { BlogPost } from '$lib/server/dto';

export const load: PageServerLoad = async ({ parent }) => {
	const posts: BlogPost[] = await getAll<BlogPost>('posts');
	const parentDate = await parent();
	const preparedPostsForLocale = posts.map((post) => ({
		...post,
		translations: undefined,
		...post.translations[parentDate.locale]
	}));
	return {
		posts: preparedPostsForLocale
	};
};
