<script lang="ts">
	import { createTranslator, toLocale } from '$lib/i18n';
	import Input from '$lib/components/primitives/Input.svelte';
	import Select from '$lib/components/primitives/Select.svelte';

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
	let t = $derived(createTranslator(toLocale(currentLocale)));
</script>

<section class="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Filters">
	<div class="flex flex-col gap-2">
		<label for="search-input" class="text-muted text-sm font-semibold">
			{currentLocale === 'de' ? 'Stichwort' : 'Query'}
		</label>
		<Input
			id="search-input"
			type="search"
			value={searchQuery}
			oninput={(e) => onchange(new CustomEvent('change', { detail: { q: e.currentTarget.value } }))}
			placeholder={t('search.placeholder')}
		/>
	</div>

	<div class="flex flex-col gap-2">
		<label for="tag-select" class="text-muted text-sm font-semibold">Tag</label>
		<Select
			id="tag-select"
			class="w-full"
			value={selectedTag}
			onchange={(e) =>
				onchange(new CustomEvent('change', { detail: { tag: e.currentTarget.value } }))}
		>
			<option value="">{currentLocale === 'de' ? 'Alle Tags' : 'All Tags'}</option>
			{#each allTags as tag (tag)}
				<option value={tag}>#{tag}</option>
			{/each}
		</Select>
	</div>

	<div class="flex flex-col gap-2">
		<label for="sort-select" class="text-muted text-sm font-semibold">
			{currentLocale === 'de' ? 'Sortierung' : 'Sort Order'}
		</label>
		<Select
			id="sort-select"
			class="w-full"
			value={currentSort}
			onchange={(e) =>
				onchange(
					new CustomEvent('change', {
						detail: { sort: e.currentTarget.value as 'latest' | 'oldest' }
					})
				)}
		>
			<option value="latest">{currentLocale === 'de' ? 'Neueste zuerst' : 'Latest'}</option>
			<option value="oldest">{currentLocale === 'de' ? 'Älteste zuerst' : 'Oldest'}</option>
		</Select>
	</div>
</section>
