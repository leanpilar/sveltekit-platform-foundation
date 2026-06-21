<script lang="ts">
	import { createTranslator } from '$lib/i18n';

	interface Props {
		locale: 'en' | 'de';
	}

	let { locale }: Props = $props();
	let tr = $derived(createTranslator(locale));

	const content = {
		en: {
			hero: {
				title: 'Architect the Future of Web Apps',
				sub: 'The production-ready foundation for high-performance SvelteKit platforms.',
				cta: 'Get Started'
			},
			features: {
				title: 'Engineered for Performance',
				items: [
					{
						title: 'Local-First Sync',
						desc: 'Real-time collaborative states driven by highly optimized conflict-free data types.'
					},
					{
						title: 'Edge Native',
						desc: 'Deploy globally with serverless execution boundaries on Vercel Node and Edge networks.'
					},
					{
						title: 'Strictly Accessible',
						desc: 'End-to-end screen reader compliance meeting strict WCAG AA interface guidelines.'
					}
				]
			},
			pricing: {
				title: 'Transparent Scaling Plans',
				tier: 'Enterprise Tier',
				price: 149,
				per: 'month',
				cta: 'Provision Node'
			},
			social: {
				title: 'Validated by Teams Everywhere',
				items: [
					{
						quote:
							'The architectural design pattern completely solved our distributed state synchronization problems overnight.',
						author: 'Lead Frontend Architect'
					}
				]
			}
		},
		de: {
			hero: {
				title: 'Architektur der nächsten Web-Generation',
				sub: 'Das produktionsbereite Fundament für hochperformante SvelteKit-Plattformen.',
				cta: 'Jetzt Starten'
			},
			features: {
				title: 'Auf Performance Ausgerichtet',
				items: [
					{
						title: 'Local-First Synchronisation',
						desc: 'Echtzeit-Kollaborationsstatus durch hochoptimierte CRDT-Datentypen.'
					},
					{
						title: 'Edge Native Architektur',
						desc: 'Globale Bereitstellung mit Serverless-Ausführungsgrenzen in Vercel Edge-Netzwerken.'
					},
					{
						title: 'Barrierefrei nach Standard',
						desc: 'Vollständige Einhaltung von Screenreadern gemäß den strengen WCAG AA-Richtlinien.'
					}
				]
			},
			pricing: {
				title: 'Transparente Preisskalierung',
				tier: 'Enterprise-Stufe',
				price: 149,
				per: 'Monat',
				cta: 'Knoten Bereitstellen'
			},
			social: {
				title: 'Von Entwicklerteams Validiert',
				items: [
					{
						quote:
							'Dieses Architekturmuster hat unsere Probleme mit der verteilten Statussynchronisation sofort gelöst.',
						author: 'Leitender Frontend-Architekt'
					}
				]
			}
		}
	};

	let t = $derived(content[locale]);
	let currencyFormatter = $derived(
		new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' })
	);
</script>

<div class="bg-[--bg-canvas] text-[--text-main] transition-colors duration-200">
	<section class="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center" aria-label="Hero">
		<h1 class="text-5xl font-extrabold tracking-tight sm:text-6xl text-[--text-main]">
			{tr('home.hero.title')}
		</h1>
		<p class="mx-auto mt-6 max-w-2xl text-xl text-[--text-muted]">
			{tr('home.hero.subtitle')}
		</p>
		<div class="mt-10">
			<button
				type="button"
				class="rounded-md bg-[--brand-primary] px-6 py-3 text-base font-medium text-[--bg-canvas] hover:opacity-90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[--brand-primary] focus-visible:ring-offset-2"
			>
				{tr('home.hero.cta')}
			</button>
		</div>
	</section>

	<section
		class="border-t border-[--border-muted] bg-[--bg-surface] py-20"
		aria-labelledby="features-heading"
	>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<h2 id="features-heading" class="text-center text-3xl font-bold tracking-tight">
				{tr('home.features.title')}
			</h2>
			<div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{#each t.features.items as item (item.title)}
					<article class="rounded-lg border border-[--border-muted] bg-[--bg-canvas] p-6 shadow-xs">
						<h3 class="text-lg font-semibold text-[--text-main]">{item.title}</h3>
						<p class="mt-2 text-sm text-[--text-muted]">{item.desc}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="border-t border-[--border-muted] py-20" aria-labelledby="pricing-heading">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
			<h2 id="pricing-heading" class="text-3xl font-bold tracking-tight">{t.pricing.title}</h2>
			<div
				class="mx-auto mt-12 max-w-md rounded-lg border border-[--border-muted] bg-[--bg-surface] p-8 shadow-sm"
			>
				<h3 class="text-xl font-bold uppercase tracking-wider text-[--brand-primary]">
					{t.pricing.tier}
				</h3>
				<p class="mt-4 flex items-baseline justify-center text-5xl font-extrabold">
					{currencyFormatter.format(t.pricing.price)}
					<span class="ml-1 text-xl font-normal text-[--text-muted]">/{t.pricing.per}</span>
				</p>
				<button
					type="button"
					class="mt-8 w-full rounded-md bg-[--brand-primary] py-3 text-sm font-semibold text-[--bg-canvas] hover:opacity-90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[--brand-primary]"
				>
					{t.pricing.cta}
				</button>
			</div>
		</div>
	</section>

	<section
		class="border-t border-[--border-muted] bg-[--bg-surface] py-20"
		aria-labelledby="social-heading"
	>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<h2 id="social-heading" class="text-center text-3xl font-bold tracking-tight">
				{t.social.title}
			</h2>
			<div class="mt-12 grid grid-cols-1 gap-8 max-w-3xl mx-auto">
				{#each t.social.items as item (item.quote)}
					<figure
						class="rounded-xl border border-[--border-muted] bg-[--bg-canvas] p-8 text-center italic shadow-xs"
					>
						<blockquote class="text-lg text-[--text-main]">
							<p>“{item.quote}”</p>
						</blockquote>
						<figcaption class="mt-4 text-sm font-semibold not-italic text-[--brand-primary]">
							— {item.author}
						</figcaption>
					</figure>
				{/each}
			</div>
		</div>
	</section>
</div>
