import { test, expect } from '@playwright/test';

// Herkese açık tanıtım sayfası (/) ve giriş sayfasıyla bağlantısı.

test.describe('oturum yok', () => {
	test.use({ storageState: { cookies: [], origins: [] } });

	test('tanıtım sayfası açılır; "Demoyu dene" girişe, girişteki "Ana sayfaya dön" geri götürür', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveURL(/\/$/);
		await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bir sonraki web uygulamanız için sağlam bir başlangıç');
		await expect(page.getByRole('region', { name: 'Neler hazır geliyor?' }).getByRole('listitem')).toHaveCount(6);

		await page
			.getByRole('main')
			.getByRole('link', { name: /Demoyu dene/ })
			.first()
			.click();
		await expect(page).toHaveURL(/\/login$/);
		await expect(page.getByRole('heading', { name: 'Giriş yap' })).toBeVisible();

		await page.getByRole('link', { name: 'Ana sayfaya dön' }).click();
		await expect(page).toHaveURL(/\/$/);
	});
});

test('oturum açıkken tanıtım sayfası "Uygulamaya git" gösterir', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('link', { name: /Demoyu dene/ })).toHaveCount(0);
	await page
		.getByRole('main')
		.getByRole('link', { name: /Uygulamaya git/ })
		.first()
		.click();
	await expect(page).toHaveURL(/\/app$/);
});
