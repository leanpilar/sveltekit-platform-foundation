<script lang="ts">
	interface Props {
		searchQuery: string;
		selectedTag: string;
		currentSort: 'latest' | 'oldest';
		allTags: string[];
		currentLocale: string;
		onchange: (
			event: CustomEvent<{ q?: string; tag?: string; sort?: 'latest' | 'oldest' }>
		) => void;
	}

	let { searchQuery, selectedTag, currentSort, allTags, currentLocale, onchange }: Props = $props();
</script>

<section class="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-10" aria-label="Filters">
	<div class="flex flex-col gap-2">
		<label for="search-input" class="text-sm font-semibold text-[--text-muted]">
			{currentLocale === 'de' ? 'Stichwort' : 'Query'}
		</label>
		<input
			id="search-input"
			type="search"
			value={searchQuery}
			oninput={(e) => onchange(new CustomEvent('change', { detail: { q: e.currentTarget.value } }))}
			placeholder={currentLocale === 'de' ? 'Suchen...' : 'Search posts...'}
			class="w-full rounded-md border border-muted bg-canvas px-4 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
		/>
	</div>

	<div class="flex flex-col gap-2">
		<label for="tag-select" class="text-sm font-semibold text-muted">Tag</label>
		<select
			id="tag-select"
			value={selectedTag}
			onchange={(e) =>
				onchange(new CustomEvent('change', { detail: { tag: e.currentTarget.value } }))}
			class="w-full rounded-md border border-muted bg-canvas px-4 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
		>
			<option value="">{currentLocale === 'de' ? 'Alle Tags' : 'All Tags'}</option>
			{#each allTags as tag (tag)}
				<option value={tag}>#{tag}</option>
			{/each}
		</select>
	</div>

	<div class="flex flex-col gap-2">
		<label for="sort-select" class="text-sm font-semibold text-muted">
			{currentLocale === 'de' ? 'Sortierung' : 'Sort Order'}
		</label>
		<select
			id="sort-select"
			value={currentSort}
			onchange={(e) =>
				onchange(
					new CustomEvent('change', {
						detail: { sort: e.currentTarget.value as 'latest' | 'oldest' }
					})
				)}
			class="w-full rounded-md border border-muted bg-canvas px-4 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
		>
			<option value="latest">{currentLocale === 'de' ? 'Neueste zuerst' : 'Latest'}</option>
			<option value="oldest">{currentLocale === 'de' ? 'Älteste zuerst' : 'Oldest'}</option>
		</select>
	</div>
</section>
