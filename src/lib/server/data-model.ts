import { persistance } from '$lib';
import type { Item } from './dto';

type AllDataTypes = 'items' | 'posts' | 'tags' | 'users';

/**
 * Retrieves and parses a collection model array from the persistence layer
 */
export async function getAll<T extends { id: string }>(model: AllDataTypes): Promise<T[]> {
	const data = await persistance.get(model);
	return data ? JSON.parse(data) : [];
}
/**
 * Replaces an entire item within a collection model by its unique identifier
 */
export async function edit(
	model: Exclude<AllDataTypes, 'tags'>,
	id: string,
	updatedItem: Record<string, unknown>
): Promise<void> {
	const items = await getAll(model);
	const index = items.findIndex((item) => item.id === id);

	if (index !== -1) {
		items[index] = { ...updatedItem, id };
		await persistance.set(model, JSON.stringify(items));
	}
}

/**
 * Merges a partial patch into a single item by id and persists. Returns the
 * updated item, or null if it does not exist. Unlike `edit`, this preserves the
 * fields not present in the patch (correct semantics for an inline cell edit).
 */
export async function patchItem(id: string, patch: Partial<Item>): Promise<Item | null> {
	const items = await getAll<Item>('items');
	const index = items.findIndex((item) => item.id === id);
	if (index === -1) return null;

	const updated: Item = { ...items[index], ...patch, id };
	items[index] = updated;
	await persistance.set('items', JSON.stringify(items));
	return updated;
}
