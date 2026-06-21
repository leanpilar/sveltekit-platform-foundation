import type { PageServerLoad } from './$types';
import type { BlogPost } from '$lib/server/dto';

const PAGE_SIZE = 5;

export const load: PageServerLoad = async ({ parent, fetch }) => {
	const posts: BlogPost[] = await fetch('/api/posts').then((res) => res.json());
	const { locale } = await parent();
	const preparedPostsForLocale = posts.map((post) => ({
		...post,
		translations: undefined,
		...post.translations[locale]
	}));
	return {
		posts: preparedPostsForLocale.slice(0, PAGE_SIZE),
		currentPage: 1,
		nextPageExists: preparedPostsForLocale.length > PAGE_SIZE
	};
};
