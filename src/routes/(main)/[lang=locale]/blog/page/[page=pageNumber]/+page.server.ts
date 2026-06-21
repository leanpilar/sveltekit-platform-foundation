import type { PageServerLoad } from './$types';
import { getAll } from '$lib/server/data-model';
import type { BlogPost } from '$lib/server/dto';

export const load: PageServerLoad = async ({ parent, params }) => {
	const posts: BlogPost[] = await getAll<BlogPost>('posts');
	const parentDate = await parent();
	const currentPage = Number(params.page);
	const preparedPostsForLocale = posts.map((post) => ({
		...post,
		translations: undefined,
		...post.translations[parentDate.locale]
	}));
	const nextPageExists: boolean = preparedPostsForLocale.length > 5 * currentPage;
	return {
		posts: preparedPostsForLocale.splice(0, 5 * currentPage),
		currentPage,
		nextPageExists
	};
};
