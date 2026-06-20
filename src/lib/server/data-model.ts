import { persistance } from '$lib';

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
