import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const VALID_BASE_ROUTES = ['blog', 'search'];

/**
 * Resolves un-prefixed deep links to their default locale or terminates with a 404
 */
export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;
	const firstSegment = slug.split('/')[0];

	if (VALID_BASE_ROUTES.includes(firstSegment)) {
		throw redirect(308, `/en/${slug}`);
	}

	throw error(404, { message: 'Not Found' });
};
