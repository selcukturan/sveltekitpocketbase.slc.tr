import { test, expect } from '@playwright/test';

// Üst çubuktaki kullanıcı menüsü: WAI menu deseni (klavye), örnek öğeler, dil, ayarlar bağlantısı.

test('kullanıcı menüsü klavyeyle gezilir; Esc kapatır ve odak düğmeye döner', async ({ page }) => {
	await page.goto('/app');
	const trigger = page.getByRole('banner').getByRole('button', { name: 'Kullanıcı menüsü' });
	await trigger.click();

	const menu = page.getByRole('menu');
	await expect(menu).toBeVisible();
	await expect(menu).toContainText('demo@slc.tr');
	const items = menu.getByRole('menuitem');
	await expect(items.first()).toBeFocused();

	await page.keyboard.press('ArrowDown');
	await expect(items.nth(1)).toBeFocused();
	await page.keyboard.press('ArrowUp');
	await page.keyboard.press('ArrowUp'); // baştan sona sarar
	await expect(items.last()).toBeFocused();
	await expect(items.last()).toHaveText(/Çıkış Yap/);
	await page.keyboard.press('Home');
	await expect(items.first()).toBeFocused();

	await page.keyboard.press('Escape');
	await expect(menu).toBeHidden();
	await expect(trigger).toBeFocused();
});

test('örnek öğe "Yakında" bildirimi gösterir; ayarlar bağlantısı ve dil seçimi çalışır', async ({ page }) => {
	await page.goto('/app');
	const trigger = page.getByRole('banner').getByRole('button', { name: 'Kullanıcı menüsü' });

	await trigger.click();
	await page.getByRole('menuitem', { name: 'Profilim' }).click();
	await expect(page.getByRole('menu')).toBeHidden();
	await expect(page.getByText('Bu bölüm henüz hazır değil.')).toBeVisible();

	await trigger.click();
	await page.getByRole('menuitem', { name: 'Ayarlar' }).click();
	await expect(page).toHaveURL(/\/app\/settings/);

	await trigger.click();
	await page.getByRole('menuitem', { name: 'Dil: Türkçe' }).click();
	await expect(page.getByRole('menuitem', { name: 'Language: English' })).toBeVisible();
	await page.getByRole('menuitem', { name: 'Language: English' }).click(); // geri al
	await expect(page.getByRole('menuitem', { name: 'Dil: Türkçe' })).toBeVisible();
});
