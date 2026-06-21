import { createClient } from 'redis';
import { env } from '$env/dynamic/private';
import { logger as myLogger } from '../utility/logger';
import items from '$lib/mocks/items.json';
import posts from '$lib/mocks/posts.json';
import tags from '$lib/mocks/tags.json';
import users from '$lib/mocks/users.json';
import { dev } from '$app/environment';

interface MemoryClient {
	get(key: string): Promise<string | null>;
	set(key: string, value: string): Promise<unknown>;
}

class Client {
	LOCAL_MEMORY_DB: Record<string, string | null> = {
		item: 'Mock Local Cache Integrity Item'
	};
	redisClient: ReturnType<typeof createClient> | null = null;

	memoryClient: MemoryClient = {
		get: async (key: string): Promise<string | null> => this.LOCAL_MEMORY_DB[key] || null,
		set: async (key: string, value: string | null) => {
			this.LOCAL_MEMORY_DB[key] = value;
		}
	};

	/**
	 * @param logger - Application utility logger instance
	 * @param PROVIDER - Active infrastructure driver selection target
	 */
	constructor(
		private logger = myLogger,
		private PROVIDER = env.DATABASE_PROVIDER || 'memory'
	) {
		if (PROVIDER === 'redis' && env.SV_KIT_PF_REDIS_VERCEL_REDIS_URL) {
			this.redisClient = createClient({ url: env.SV_KIT_PF_REDIS_VERCEL_REDIS_URL });
			this.redisClient.connect().catch((err) => console.error('Redis Connection Error', err));
			this.logger.log('redisClient initialized');
			return;
		}

		this.logger.log('memoryClient initialized');
		if (process.env.CI || dev) {
			this.seedInitialState();
		}
	}
	/**
	 * Resolves active connection states and reconnects dead sockets during serverless lifecycles
	 */
	private async ensureConnected(): Promise<void> {
		if (!this.redisClient) return;

		if (!this.redisClient.isOpen) {
			await this.redisClient.connect();
			return;
		}

		// Ping the socket to verify the frozen connection is still alive
		try {
			await this.redisClient.ping();
		} catch {
			this.logger.warn('Redis socket dead on container wakeup, executing reconnect');
			await this.redisClient.disconnect().catch(() => {});
			await this.redisClient.connect();
		}
	}
	/**
	 * Resolves the operational client instance based on the active provider strategy
	 */
	getClient(): MemoryClient {
		if (this.PROVIDER === 'memory' || !this.redisClient) {
			return this.memoryClient;
		}

		return {
			get: async (key) => {
				await this.ensureConnected();
				return this.redisClient!.get(key);
			},
			set: async (key, value) => {
				await this.ensureConnected();
				return this.redisClient!.set(key, value);
			}
		};
	}

	/**
	 * Hydrates the database state with base dataset allocations from local mocks
	 */
	private async seedInitialState(): Promise<void> {
		this.clearAllData();
		this.setValue('items', JSON.stringify(items));
		this.setValue('posts', JSON.stringify(posts));
		this.setValue('tags', JSON.stringify(tags));
		this.setValue('users', JSON.stringify(users));
	}

	clearAllData() {
		if (this.PROVIDER === 'memory' || !this.redisClient) {
			this.LOCAL_MEMORY_DB = {};
			return;
		}
		this.redisClient.flushDb();
	}
	/**
	 * Fetches string payloads by their unique key identification coordinates
	 */
	private async getValue(key: string): Promise<string | null> {
		const client = this.getClient();
		return client.get(key);
	}
	/**
	 * Commits primitive string values to the designated storage client boundary
	 */
	private async setValue(key: string, value: string): Promise<unknown> {
		const client = this.getClient();
		return client.set(key, value);
	}
	/**
	 * Alias wrapper for retrieving item values
	 */
	get(key: string) {
		return this.getValue(key);
	}
	/**
	 * Alias wrapper for committing item values
	 */
	set(key: string, value: string) {
		return this.setValue(key, value);
	}
	seedData() {
		this.seedInitialState();
	}
}

export const persistence = new Client();
