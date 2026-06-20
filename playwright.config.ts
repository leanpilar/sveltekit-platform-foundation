import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		reuseExistingServer: !process.env.CI,
		port: 5173
	},
	testDir: './tests/e2e',
	testMatch: '**/*.e2e.ts',
	use: {
		baseURL: 'http://localhost:5173',
		trace: 'on-first-retry'
	}
});
