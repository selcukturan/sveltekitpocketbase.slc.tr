import { defineConfig, devices } from '@playwright/test';

/**
 * Uçtan uca testler (tests/e2e). Çalıştırma: `npm run test:e2e`
 * - Geliştirme sunucusu açıksa (5173) onu kullanır, değilse `npm run dev` ile açar.
 * - PocketBase ayakta olmalı (`npm run pb`).
 * - "setup" projesi bir kez giriş yapar (login sayfasında demo bilgileri hazır gelir) ve oturumu kaydeder;
 *   diğer testler bu oturumla başlar.
 */
export default defineConfig({
	testDir: 'tests/e2e',
	fullyParallel: false,
	retries: 0,
	reporter: [['list']],
	use: {
		baseURL: 'http://localhost:5173',
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure'
	},
	webServer: {
		command: 'npm run dev',
		url: 'http://localhost:5173',
		reuseExistingServer: true,
		timeout: 120_000
	},
	projects: [
		{ name: 'setup', testMatch: /auth\.setup\.ts/ },
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'], storageState: 'tests/e2e/.auth/user.json' },
			dependencies: ['setup']
		}
	]
});
