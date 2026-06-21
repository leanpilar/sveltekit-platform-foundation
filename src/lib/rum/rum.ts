import { onLCP, onINP, onCLS, onTTFB, type Metric } from 'web-vitals';

interface RumConfig {
	sampleRate: number;
	locale: string;
	/** Endpoint that receives web-vitals and error beacons. */
	beaconUrl?: string;
}

/**
 * Initializes Core Web Vitals instrumentation and client error reporting with
 * deterministic per-client sampling. Metrics and errors are shipped to the
 * beacon endpoint via navigator.sendBeacon (with a keepalive fetch fallback).
 */
export function initRum(config: RumConfig): void {
	if (typeof window === 'undefined') return;

	const beaconUrl = config.beaconUrl ?? '/api/rum';
	const storageKey = 'rum_sampled';
	let isSampled = localStorage.getItem(storageKey);

	if (isSampled === null) {
		const chosen = Math.random() < config.sampleRate;
		isSampled = chosen ? 'true' : 'false';
		localStorage.setItem(storageKey, isSampled);
	}

	if (isSampled === 'false') return;

	const send = (body: Record<string, unknown>): void => {
		try {
			const payload = JSON.stringify({
				...body,
				path: window.location.pathname,
				locale: config.locale
			});

			if (typeof navigator.sendBeacon === 'function') {
				navigator.sendBeacon(beaconUrl, new Blob([payload], { type: 'application/json' }));
			} else {
				void fetch(beaconUrl, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: payload,
					keepalive: true
				});
			}
		} catch {
			// Never let observability break the page.
		}
	};

	const reportMetric = (metric: Metric): void => {
		send({
			kind: 'web-vital',
			name: metric.name,
			value: metric.value,
			rating: metric.rating,
			id: metric.id
		});

		if (import.meta.env.DEV) {
			console.debug(`[RUM] ${metric.name} ${metric.value.toFixed(2)} (${metric.rating})`);
		}
	};

	onLCP(reportMetric);
	onINP(reportMetric);
	onCLS(reportMetric);
	onTTFB(reportMetric);

	// Client-side error reporting to the same beacon (Sentry-stub equivalent).
	window.addEventListener('error', (event) => {
		send({
			kind: 'error',
			message: event.message,
			source: event.filename,
			line: event.lineno,
			column: event.colno
		});
	});

	window.addEventListener('unhandledrejection', (event) => {
		send({ kind: 'unhandledrejection', reason: String(event.reason) });
	});
}
