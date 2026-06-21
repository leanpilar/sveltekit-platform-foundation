import type { RequestHandler } from './$types';

export const config = {
	runtime: 'nodejs24.x'
};

/**
 * RUM / error beacon sink. In a real deployment this would forward to a metrics
 * pipeline (e.g. Sentry, a TSDB, or an analytics warehouse). Here it console-logs
 * so the wiring is real and verifiable end-to-end.
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const payload = await request.json();
		console.log('[beacon]', JSON.stringify(payload));
	} catch {
		// Ignore malformed beacons — never fail a fire-and-forget request.
	}

	// 204: nothing to return; keeps sendBeacon happy and cheap.
	return new Response(null, { status: 204 });
};
