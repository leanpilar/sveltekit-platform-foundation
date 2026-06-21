<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { enhance } from '$app/forms';
	import type { ResolvedPathname } from '$app/types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Button from '$lib/components/primitives/Button.svelte';
	import Badge from '$lib/components/primitives/Badge.svelte';
	import Toaster from '$lib/components/Toaster.svelte';
	import { pushToast } from '$lib/stores/toasts.svelte';
	import { editBudgetSchema } from '$lib/dashboard/itemEdit';
	import { buildItemsQueryString, PAGE_SIZES } from '$lib/dashboard/itemsUrl';
	import type { ItemsQuery, SortColumn } from '$lib/dashboard/itemsQuery';
	import type { Item } from '$lib/server/dto';
	import { createTranslator, DEFAULT_LOCALE } from '$lib/i18n';

	let { data } = $props();

	// Dashboard is not locale-routed; use the default-locale dictionary.
	const t = createTranslator(DEFAULT_LOCALE);

	const PATH = '/dashboard/items';

	const COLUMNS: { key: SortColumn; label: string; numeric?: boolean }[] = [
		{ key: 'name', label: t('dashboard.items.column.name') },
		{ key: 'status', label: t('dashboard.items.column.status') },
		{ key: 'channel', label: t('dashboard.items.column.channel') },
		{ key: 'owner', label: t('dashboard.items.column.owner') },
		{ key: 'budget', label: t('dashboard.items.column.budget'), numeric: true },
		{ key: 'spent', label: t('dashboard.items.column.spent'), numeric: true },
		{ key: 'ctr', label: t('dashboard.items.column.ctr'), numeric: true },
		{ key: 'updatedAt', label: t('dashboard.items.column.updated') }
	];

	const currency = new Intl.NumberFormat('en', {
		style: 'currency',
		currency: 'EUR',
		maximumFractionDigits: 0
	});
	const currency2 = new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR' });
	const percent = new Intl.NumberFormat('en', { style: 'percent', minimumFractionDigits: 2 });
	const dateFmt = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });

	// --- optimistic edit state (overlay over the streamed rows) ---
	let budgetOverrides = $state<Record<string, number>>({});
	let pending = $state<Record<string, boolean>>({});
	let editingId = $state<string | null>(null);

	function displayBudget(item: Item): number {
		return budgetOverrides[item.id] ?? item.budget;
	}

	// --- URL-synced navigation ---
	function apply(patch: Partial<ItemsQuery>, replace = false): void {
		const qs = buildItemsQueryString(data.query, patch);
		void goto(`${PATH}${qs}` as ResolvedPathname, {
			keepFocus: true,
			noScroll: true,
			replaceState: replace
		});
	}

	function toggleSort(column: SortColumn): void {
		if (data.query.sort === column) {
			apply({ dir: data.query.dir === 'asc' ? 'desc' : 'asc' });
		} else {
			apply({ sort: column, dir: 'asc' });
		}
	}

	function ariaSort(column: SortColumn): 'ascending' | 'descending' | 'none' {
		if (data.query.sort !== column) return 'none';
		return data.query.dir === 'asc' ? 'ascending' : 'descending';
	}

	// debounced free-text search, kept in the URL (shareable + back/forward).
	// Writable $derived: reflects the URL value, but local typing overrides it
	// until the next navigation re-derives.
	let searchValue = $derived(data.query.q);
	let searchTimer: ReturnType<typeof setTimeout> | undefined;
	function onSearchInput(value: string): void {
		searchValue = value;
		clearTimeout(searchTimer);
		searchTimer = setTimeout(() => apply({ q: value }, true), 300);
	}

	function toggleFacet(kind: 'status' | 'channel', value: string, checked: boolean): void {
		const current = data.query[kind];
		const next = checked ? [...current, value] : current.filter((v) => v !== value);
		apply(kind === 'status' ? { status: next } : { channel: next });
	}

	let skeletonRows = $derived(Array.from({ length: data.query.pageSize }, (_, i) => i));

	function startEdit(item: Item): void {
		editingId = item.id;
	}
	function cancelEdit(): void {
		editingId = null;
	}

	function focusOnMount(node: HTMLInputElement): void {
		node.focus();
		node.select();
	}

	/** Optimistic budget update with rollback on validation/server/network failure. */
	function submitBudget(item: Item): SubmitFunction {
		return ({ formData, cancel }) => {
			const raw = formData.get('budget');
			const check = editBudgetSchema.safeParse({ id: item.id, budget: raw });
			if (!check.success) {
				pushToast('error', 'Budget must be a non-negative number.');
				cancel();
				return;
			}

			const previous = displayBudget(item);
			// optimistic: reflect the new value immediately
			budgetOverrides[item.id] = check.data.budget;
			pending[item.id] = true;
			editingId = null;

			return async ({ result, update }) => {
				pending[item.id] = false;
				if (result.type === 'success') {
					pushToast('success', `Budget updated for ${item.name}.`);
					// Keep optimistic state; don't blow away the streamed page.
					await update({ reset: false, invalidateAll: false });
					return;
				}

				// Failure / error: roll back locally. We deliberately do NOT call
				// update() — for an error result it would render the +error boundary
				// and tear down the table instead of surfacing an inline recovery.
				budgetOverrides[item.id] = previous;
				const message =
					result.type === 'failure'
						? ((result.data as { message?: string } | undefined)?.message ?? 'Update failed.')
						: 'Network error — changes reverted.';
				pushToast('error', message);
			};
		};
	}
</script>

<svelte:head>
	<title>Items · SvelteKit Platform Foundation</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<Toaster />

<section class="bg-canvas text-main mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<header class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-extrabold tracking-tight">{t('dashboard.items.title')}</h1>
			{#await data.summary}
				<p class="text-muted text-sm">{t('common.loading')}</p>
			{:then summary}
				<p class="text-muted text-sm">
					{summary.count} campaigns · {currency.format(summary.totalBudget)} budget · {currency.format(
						summary.totalSpent
					)} spent
				</p>
			{:catch}
				<p class="text-sm text-amber-600 dark:text-amber-400" role="status">
					Summary unavailable — table is unaffected.
				</p>
			{/await}
		</div>
	</header>

	<!-- Controls: all state round-trips through the URL -->
	<div class="border-muted bg-surface mb-4 flex flex-col gap-4 rounded-lg border p-4">
		<div class="flex flex-wrap items-end gap-4">
			<div class="flex min-w-55 flex-col gap-1">
				<label for="item-search" class="text-muted text-xs font-semibold uppercase">Search</label>
				<input
					id="item-search"
					type="search"
					value={searchValue}
					oninput={(e) => onSearchInput(e.currentTarget.value)}
					placeholder="Filter by name…"
					class="border-muted bg-canvas focus-visible:ring-primary rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-hidden"
				/>
			</div>

			<div class="flex flex-col gap-1">
				<span class="text-muted text-xs font-semibold uppercase" id="status-label">Status</span>
				<div class="flex flex-wrap gap-2" role="group" aria-labelledby="status-label">
					{#each data.facets.statuses as status (status)}
						<label class="flex items-center gap-1.5 text-sm capitalize">
							<input
								type="checkbox"
								checked={data.query.status.includes(status)}
								onchange={(e) => toggleFacet('status', status, e.currentTarget.checked)}
							/>
							{status}
						</label>
					{/each}
				</div>
			</div>

			<div class="flex flex-col gap-1">
				<span class="text-muted text-xs font-semibold uppercase" id="channel-label">Channel</span>
				<div class="flex flex-wrap gap-2" role="group" aria-labelledby="channel-label">
					{#each data.facets.channels as channel (channel)}
						<label class="flex items-center gap-1.5 text-sm capitalize">
							<input
								type="checkbox"
								checked={data.query.channel.includes(channel)}
								onchange={(e) => toggleFacet('channel', channel, e.currentTarget.checked)}
							/>
							{channel}
						</label>
					{/each}
				</div>
			</div>

			<div class="ml-auto flex flex-col gap-1">
				<label for="page-size" class="text-muted text-xs font-semibold uppercase">Per page</label>
				<select
					id="page-size"
					value={data.query.pageSize}
					onchange={(e) => apply({ pageSize: Number(e.currentTarget.value) })}
					class="border-muted bg-canvas focus-visible:ring-primary rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-hidden"
				>
					{#each PAGE_SIZES as size (size)}
						<option value={size}>{size}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Streamed rows: skeleton renders immediately, data fills in -->
	<div class="border-muted overflow-x-auto rounded-lg border">
		<table class="w-full border-collapse text-sm">
			<caption class="sr-only">Campaign items, sortable and filterable</caption>
			<thead>
				<tr class="bg-surface">
					{#each COLUMNS as col (col.key)}
						<th
							scope="col"
							aria-sort={ariaSort(col.key)}
							class="border-muted text-muted border-b px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase {col.numeric
								? 'text-right'
								: ''}"
						>
							<button
								type="button"
								onclick={() => toggleSort(col.key)}
								class="hover:text-main focus-visible:ring-primary inline-flex items-center gap-1 rounded focus-visible:ring-2 focus-visible:outline-hidden {col.numeric
									? 'flex-row-reverse'
									: ''}"
							>
								{col.label}
								<span aria-hidden="true" class="text-primary">
									{#if data.query.sort === col.key}{data.query.dir === 'asc' ? '▲' : '▼'}{/if}
								</span>
							</button>
						</th>
					{/each}
					<th scope="col" class="border-muted border-b px-3 py-2 text-right">
						<span class="sr-only">Actions</span>
					</th>
				</tr>
			</thead>

			<tbody>
				{#await data.page}
					{#each skeletonRows as i (i)}
						<tr class="border-muted border-b last:border-0">
							{#each COLUMNS as col (col.key)}
								<td class="px-3 py-3">
									<div class="bg-muted-accent h-4 w-full animate-pulse rounded"></div>
								</td>
							{/each}
							<td class="px-3 py-3"></td>
						</tr>
					{/each}
				{:then result}
					{#if result.rows.length === 0}
						<tr>
							<td colspan={COLUMNS.length + 1} class="px-3 py-12 text-center">
								<p class="text-muted">No campaigns match your filters.</p>
								<div class="mt-3">
									<Button
										variant="outline"
										size="sm"
										onclick={() => goto(PATH as ResolvedPathname)}
									>
										Clear filters
									</Button>
								</div>
							</td>
						</tr>
					{:else}
						{#each result.rows as item (item.id)}
							<tr class="border-muted hover:bg-surface border-b transition-colors last:border-0">
								<td class="text-main px-3 py-2 font-medium">{item.name}</td>
								<td class="px-3 py-2"><Badge status={item.status} /></td>
								<td class="px-3 py-2 capitalize">{item.channel}</td>
								<td class="px-3 py-2">{item.owner.name}</td>
								<td class="px-3 py-2 text-right tabular-nums">
									{#if editingId === item.id}
										<form
											method="POST"
											action="?/updateBudget"
											use:enhance={submitBudget(item)}
											class="flex items-center justify-end gap-1"
										>
											<input type="hidden" name="id" value={item.id} />
											<input
												name="budget"
												type="number"
												min="0"
												step="1"
												value={displayBudget(item)}
												use:focusOnMount
												onkeydown={(e) => {
													if (e.key === 'Escape') cancelEdit();
												}}
												aria-label={`Budget for ${item.name}`}
												class="border-muted bg-canvas focus-visible:ring-primary w-24 rounded-md border px-2 py-1 text-right text-sm focus-visible:ring-2 focus-visible:outline-hidden"
											/>
											<Button type="submit" size="sm">{t('common.save')}</Button>
											<Button type="button" variant="ghost" size="sm" onclick={cancelEdit}>
												{t('common.cancel')}
											</Button>
										</form>
									{:else}
										<span class:opacity-50={pending[item.id]}>
											{currency.format(displayBudget(item))}
										</span>
									{/if}
								</td>
								<td class="px-3 py-2 text-right tabular-nums">{currency2.format(item.spent)}</td>
								<td class="px-3 py-2 text-right tabular-nums">{percent.format(item.ctr)}</td>
								<td class="text-muted px-3 py-2">{dateFmt.format(new Date(item.updatedAt))}</td>
								<td class="px-3 py-2 text-right">
									{#if editingId !== item.id}
										<Button
											variant="outline"
											size="sm"
											onclick={() => startEdit(item)}
											disabled={pending[item.id]}
										>
											{pending[item.id] ? 'Saving…' : 'Edit budget'}
										</Button>
									{/if}
								</td>
							</tr>
						{/each}
					{/if}
				{:catch}
					<tr>
						<td colspan={COLUMNS.length + 1} class="px-3 py-12 text-center">
							<p class="font-medium text-red-600 dark:text-red-400">Failed to load campaigns.</p>
							<div class="mt-3">
								<Button variant="outline" size="sm" onclick={() => invalidate('dashboard:items')}>
									{t('common.retry')}
								</Button>
							</div>
						</td>
					</tr>
				{/await}
			</tbody>
		</table>
	</div>

	<!-- Pagination -->
	{#await data.page then result}
		<nav class="mt-4 flex items-center justify-between gap-4" aria-label="Pagination">
			<p class="text-muted text-sm">
				Page {result.page} of {result.totalPages} · {result.total} total
			</p>
			<div class="flex gap-2">
				<Button
					variant="outline"
					size="sm"
					disabled={result.page <= 1}
					onclick={() => apply({ page: result.page - 1 })}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={result.page >= result.totalPages}
					onclick={() => apply({ page: result.page + 1 })}
				>
					Next
				</Button>
			</div>
		</nav>
	{/await}
</section>
