import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getAll, patchItem } from '$lib';
import { itemSchema } from '$lib/server/dto';
import { editBudgetSchema } from '$lib/dashboard/itemEdit';
import { parseItemsQuery } from '$lib/dashboard/itemsUrl';
import { queryItems, ITEM_STATUSES, ITEM_CHANNELS } from '$lib/dashboard/itemsQuery';

export const config = {
	runtime: 'nodejs22.x'
};

const itemsSchema = itemSchema.array();

export interface ItemsSummary {
	count: number;
	totalBudget: number;
	totalSpent: number;
}

export const load: PageServerLoad = async ({ url, depends }) => {
	// Targeted invalidation key — only this loader re-runs on a mutation refresh.
	depends('dashboard:items');

	const query = parseItemsQuery(url);
	const forceSummaryFailure = url.searchParams.get('failSummary') === '1';

	// Validate the mock data once at the boundary; share across both streams.
	const itemsPromise = getAll('items').then((raw) => itemsSchema.parse(raw));

	// Heavy row data streams as a promise: the shell + controls render instantly,
	// rows fill in when ready (skeleton -> table).
	const page = itemsPromise.then((items) => queryItems(items, query));

	// Summary streams independently so its failure degrades gracefully without
	// taking down the table (partial-failure state).
	const summary = itemsPromise.then((items): ItemsSummary => {
		if (forceSummaryFailure) throw new Error('Summary service unavailable');
		const all = queryItems(items, { ...query, page: 1, pageSize: Number.MAX_SAFE_INTEGER });
		return {
			count: all.total,
			totalBudget: all.rows.reduce((sum, item) => sum + item.budget, 0),
			totalSpent: all.rows.reduce((sum, item) => sum + item.spent, 0)
		};
	});

	return {
		query,
		facets: { statuses: ITEM_STATUSES, channels: ITEM_CHANNELS },
		// Returned unawaited -> SvelteKit streams them to the client.
		page,
		summary
	};
};

export const actions: Actions = {
	updateBudget: async ({ request }) => {
		const formData = await request.formData();
		const parsed = editBudgetSchema.safeParse({
			id: formData.get('id'),
			budget: formData.get('budget')
		});

		if (!parsed.success) {
			return fail(400, {
				id: String(formData.get('id') ?? ''),
				message: parsed.error.flatten().fieldErrors.budget?.[0] ?? 'Invalid budget'
			});
		}

		const updated = await patchItem(parsed.data.id, { budget: parsed.data.budget });
		if (!updated) {
			return fail(404, { id: parsed.data.id, message: 'Item not found' });
		}

		return { success: true, id: updated.id, budget: updated.budget };
	}
};
