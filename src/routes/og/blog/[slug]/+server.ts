import { error } from '@sveltejs/kit';
import { read } from '$app/server';
import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import interRegular from '@fontsource/inter/files/inter-latin-400-normal.woff';
import interBold from '@fontsource/inter/files/inter-latin-700-normal.woff';
import type { RequestHandler } from './$types';
import { getAll } from '$lib';
import { blogPostSchema } from '$lib/server/dto';

// resvg is a native Node module — this route can't run on the edge.
export const config = {
	runtime: 'nodejs22.x'
};

const postsSchema = blogPostSchema.array();

function escapeHtml(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Per-post Open Graph image (1200×630 PNG), generated on demand with satori
 * (HTML → SVG) + resvg (SVG → PNG). Cached at the edge via s-maxage.
 */
export const GET: RequestHandler = async ({ params }) => {
	const posts = postsSchema.parse(await getAll('posts'));
	const post = posts.find((entry) => entry.slug === params.slug);
	if (!post) error(404, 'Post not found');

	const title = escapeHtml(post.translations.en.title);
	const author = escapeHtml(post.author.name);
	const accent = post.coverColor;

	const [regular, bold] = await Promise.all([
		read(interRegular).arrayBuffer(),
		read(interBold).arrayBuffer()
	]);

	const markup = html`
		<div
			style="display:flex;flex-direction:column;justify-content:space-between;width:1200px;height:630px;padding:80px;background:#0f172a;color:#f8fafc;font-family:Inter,serif"
		>
			<div
				style="display:flex;align-items:center;gap:18px;font-size:30px;font-weight:700;color:${accent}"
			>
				<div
					style="display:flex;width:22px;height:22px;border-radius:9999px;background:${accent}"
				></div>
				SvelteKit Platform Foundation
			</div>
			<div
				style="display:flex;font-size:68px;font-weight:700;line-height:1.1;letter-spacing:-0.02em"
			>
				${title}
			</div>
			<div style="display:flex;font-size:30px;color:#94a3b8">By ${author}</div>
		</div>
	`;

	const svg = await satori(markup, {
		width: 1200,
		height: 630,
		fonts: [
			{ name: 'Inter', data: regular, weight: 400, style: 'normal' },
			{ name: 'Inter', data: bold, weight: 700, style: 'normal' }
		]
	});

	const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

	return new Response(new Uint8Array(png), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
};
