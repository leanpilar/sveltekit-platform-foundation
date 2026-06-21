import { describe, it, expect } from 'vitest';
import { blogPostSchema } from '$lib/server/dto';

function validPost() {
	return {
		id: 'post_000',
		slug: 'a-post',
		translations: {
			en: { title: 'Title', excerpt: 'Excerpt', body: 'Body' },
			de: { title: 'Titel', excerpt: 'Auszug', body: 'Inhalt' }
		},
		tags: ['performance'],
		author: { id: 'u_1', name: 'Author', avatarColor: '#a855f7' },
		publishedAt: '2026-05-31T00:00:00Z',
		readingTimeMinutes: 3,
		coverColor: '#1e293b'
	};
}

describe('blogPostSchema (boundary validation)', () => {
	it('accepts a well-formed post', () => {
		expect(blogPostSchema.safeParse(validPost()).success).toBe(true);
	});

	it('rejects an invalid hex color', () => {
		const bad = { ...validPost(), coverColor: 'not-a-color' };
		expect(blogPostSchema.safeParse(bad).success).toBe(false);
	});

	it('rejects a post missing a required locale translation', () => {
		const post = validPost();
		const bad = { ...post, translations: { en: post.translations.en } };
		expect(blogPostSchema.safeParse(bad).success).toBe(false);
	});
});
