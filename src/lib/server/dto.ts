import { z } from 'zod';

const hexColorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/);

const postTranslationSchema = z.object({
	title: z.string().min(1),
	excerpt: z.string().min(1),
	body: z.string().min(1)
});

export const blogPostSchema = z.object({
	id: z.string().min(1),
	slug: z.string().min(1),
	translations: z.object({
		en: postTranslationSchema,
		de: postTranslationSchema
	}),
	tags: z.array(z.string().min(1)),
	author: z.object({
		id: z.string().min(1),
		name: z.string().min(1),
		avatarColor: hexColorSchema
	}),
	publishedAt: z.string().datetime(),
	readingTimeMinutes: z.number().int().positive(),
	coverColor: hexColorSchema
});

export type BlogPost = z.infer<typeof blogPostSchema>;
export type PostTranslation = z.infer<typeof postTranslationSchema>;

const dateIsoSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
	message: 'Invalid date format. Expected YYYY-MM-DD'
});

export const itemSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	status: z.string().min(1),
	channel: z.string().min(1),
	owner: z.object({
		id: z.string().min(1),
		name: z.string().min(1)
	}),
	budget: z.number().nonnegative(),
	spent: z.number().nonnegative(),
	impressions: z.number().int().nonnegative(),
	clicks: z.number().int().nonnegative(),
	ctr: z.number().nonnegative(),
	startDate: dateIsoSchema,
	endDate: dateIsoSchema,
	updatedAt: z.string().datetime(),
	tags: z.array(z.string().min(1))
});

export type Item = z.infer<typeof itemSchema>;
