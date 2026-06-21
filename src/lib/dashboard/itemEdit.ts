import { z } from 'zod';

/**
 * Single source of truth for the inline budget edit, imported by BOTH the client
 * form (optimistic pre-validation) and the server action (authoritative
 * validation). Lives outside $lib/server so the client bundle may import it.
 * Coerces the form string and rejects negatives / absurd values.
 */
export const editBudgetSchema = z.object({
	id: z.string().min(1),
	budget: z.coerce.number().nonnegative().max(100_000_000)
});

export type EditBudget = z.infer<typeof editBudgetSchema>;
