import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.develop') });

const isDevMode = process.env.PLAYWRIGHT_DEV === 'true';
const currentPort = isDevMode ? 5173 : 4173;

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		reuseExistingServer: !process.env.CI,
		port: currentPort
	},
	testDir: './tests/e2e',
	testMatch: '**/*.e2e.ts',
	use: {
		baseURL: `http://localhost:${currentPort}`,
		trace: 'on-first-retry'
	}
});
