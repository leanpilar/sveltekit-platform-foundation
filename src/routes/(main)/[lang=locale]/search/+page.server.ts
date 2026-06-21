import type { PageServerLoad } from './$types';
import type { BlogPost } from '$lib/server/dto';

export const load: PageServerLoad = async ({ parent }) => {
	const posts: BlogPost[] = await fetch('/api/posts').then((res) => res.json());
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
