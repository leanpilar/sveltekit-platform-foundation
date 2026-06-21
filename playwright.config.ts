import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.develop') });

const isDevMode = process.env.PLAYWRIGHT_DEV === 'true';
const currentPort = isDevMode ? 5173 : 4173;

export default defineConfig({
	webServer: {
		// Bind preview to 127.0.0.1 so Playwright's port probe (IPv4) detects it —
		// vite's default "localhost" bind is IPv6-only on some runners.
		command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${currentPort}`,
		reuseExistingServer: !process.env.CI,
		port: currentPort,
		// Production build + preview can exceed the 60s default on CI/cold runners.
		timeout: 180_000
	},
	testDir: './tests/e2e',
	testMatch: '**/*.e2e.ts',
	expect: {
		// Tolerance absorbs sub-pixel font/AA differences between the Docker image
		// used to generate the committed Linux baseline and the bare CI runner.
		toHaveScreenshot: { maxDiffPixelRatio: 0.05, threshold: 0.2 }
	},
	use: {
		baseURL: `http://localhost:${currentPort}`,
		trace: 'on-first-retry'
	}
});
