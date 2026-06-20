import { env } from '$env/dynamic/public';

/**
 * Simple logger that respects the PUBLIC_DEBUG environment variable.
 */
class Logger {
	#enabled;

	constructor() {
		this.#enabled = env.PUBLIC_DEBUG === 'true' || env.PUBLIC_DEBUG === '1';
	}

	/**
	 * Logs standard informational messages.
	 * @param {...unknown} args
	 */
	log(...args: unknown[]) {
		if (this.#enabled) {
			console.log('[LOG]', ...args);
		}
	}

	/**
	 * Logs info-level messages.
	 * @param {...unknown} args
	 */
	info(...args: unknown[]) {
		if (this.#enabled) {
			console.info('[INFO]', ...args);
		}
	}

	/**
	 * Logs warnings (always visible unless you want to gate it).
	 * @param {...unknown} args
	 */
	warn(...args: unknown[]) {
		console.warn('[WARN]', ...args);
	}

	/**
	 * Logs errors (always visible).
	 * @param {...unknown} args
	 */
	error(...args: unknown[]) {
		console.error('[ERROR]', ...args);
	}
}

export const logger = new Logger();
