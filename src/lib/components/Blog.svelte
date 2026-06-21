<script>
	let { locale, post } = $props();
	let currentLocale = $derived(locale);
	let dateFormatter = $derived(new Intl.DateTimeFormat(currentLocale, { dateStyle: 'long' }));
</script>

<article>
	<header class="flex flex-col gap-4">
		<div class="flex flex-wrap gap-2">
			{#each post.tags as tag (tag)}
				<span
					class="inline-flex items-center rounded-md bg-surface px-2.5 py-0.5 text-xs font-semibold text-muted border border-muted"
				>
					#{tag}
				</span>
			{/each}
		</div>

		<h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl text-main">
			{post.title}
		</h1>

		<div class="flex items-center gap-4 border-b border-muted pb-6 text-sm text-muted">
			<div
				class="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs"
				style:background-color={post.author.avatarColor}
				aria-hidden="true"
			>
				{post.author.name.charAt(0)}
			</div>
			<div class="flex flex-col sm:flex-row sm:items-center sm:gap-x-4 gap-y-1">
				<span class="font-medium text-main">{post.author.name}</span>
				<span class="hidden sm:inline" aria-hidden="true">•</span>
				<time datetime={post.publishedAt}>{dateFormatter.format(new Date(post.publishedAt))}</time>
				<span aria-hidden="true">•</span>
				<span
					>{post.readingTimeMinutes} {currentLocale === 'de' ? 'Min. Lesezeit' : 'min read'}</span
				>
			</div>
		</div>
	</header>

	<div class="mt-8 prose max-w-none text-main leading-relaxed space-y-6">
		<p class="text-base sm:text-lg text-muted">
			{post.body}
		</p>
	</div>
</article>
