import type { PageServerLoad } from './$types';
import type { BlogPost } from '$lib/server/dto';

export const load: PageServerLoad = async ({ parent, fetch }) => {
	const posts: BlogPost[] = await fetch('/api/posts').then((res) => res.json());
	const { locale } = await parent();

	// Project to only the fields the search UI needs — keeps the payload small.
	const searchablePosts = posts.map((post) => ({
		id: post.id,
		slug: post.slug,
		title: post.translations[locale].title,
		excerpt: post.translations[locale].excerpt,
		tags: post.tags,
		publishedAt: post.publishedAt
	}));

	return { posts: searchablePosts };
};
