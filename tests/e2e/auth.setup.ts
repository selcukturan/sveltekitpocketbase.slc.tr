import { test as setup, expect } from '@playwright/test';

// Login sayfasında demo kullanıcı bilgileri hazır gelir; yalnızca "Giriş"e tıklanır ve oturum kaydedilir.
setup('giriş yap', async ({ page }) => {
	await page.goto('/login');
	await page.getByRole('button', { name: 'Giriş' }).click();
	await expect(page).not.toHaveURL(/\/login/);
	await page.context().storageState({ path: 'tests/e2e/.auth/user.json' });
});
