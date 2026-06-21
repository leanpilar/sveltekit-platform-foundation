import { onLCP, onINP, onCLS, onTTFB, type Metric } from 'web-vitals';

interface RumConfig {
	sampleRate: number;
	locale: string;
}

/**
 * Initializes Core Web Vitals instrumentation with deterministic client sampling
 */
export function initRum(config: RumConfig): void {
	if (typeof window === 'undefined') return;

	const storageKey = 'rum_sampled';
	let isSampled = localStorage.getItem(storageKey);

	if (isSampled === null) {
		const chosen = Math.random() < config.sampleRate;
		isSampled = chosen ? 'true' : 'false';
		localStorage.setItem(storageKey, isSampled);
	}

	if (isSampled === 'false') return;

	const logMetricToConsole = (metric: Metric) => {
		const badgeColor =
			metric.rating === 'good'
				? '#22c55e'
				: metric.rating === 'needs-improvement'
					? '#eab308'
					: '#ef4444';

		console.groupCollapsed(
			`%c[RUM]%c ${metric.name} — %c${metric.rating.toUpperCase()}%c (${metric.value.toFixed(2)}ms)`,
			'color: #a855f7; font-weight: bold;',
			'color: inherit; font-weight: normal;',
			`color: ${badgeColor}; font-weight: bold;`,
			'color: inherit; font-weight: normal;'
		);

		console.table({
			ID: metric.id,
			Metric: metric.name,
			Value: metric.value,
			Rating: metric.rating,
			Path: window.location.pathname,
			Locale: config.locale,
			NavigationType: performance.getEntriesByType('navigation')[0]?.name || 'unknown'
		});

		console.groupEnd();
	};

	onLCP(logMetricToConsole);
	onINP(logMetricToConsole);
	onCLS(logMetricToConsole);
	onTTFB(logMetricToConsole);
}
