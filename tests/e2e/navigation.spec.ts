import { test, expect, type Page } from '@playwright/test';

// Uygulama iskeleti: modül rayı (menü kökleri), aktif modülün menü ağacı (split pane), tek <main>.
const rail = (page: Page) => page.getByRole('navigation', { name: 'Modüller' });
const tree = (page: Page, module: string) => page.getByRole('navigation', { name: module, exact: true });

test('aktif modül rayda, aktif sayfa ağaçta işaretli; sayfada tek <main>', async ({ page }) => {
	await page.goto('/app/grapes/crud/simple');
	await expect(rail(page).getByRole('link', { name: 'Grapes' })).toHaveAttribute('aria-current', 'page');
	await expect(rail(page).locator('[aria-current]')).toHaveCount(1);
	const grapes = tree(page, 'Grapes');
	await expect(grapes.getByRole('link', { name: 'Basit CRUD' })).toHaveAttribute('aria-current', 'page');
	await expect(grapes.locator('[aria-current]')).toHaveCount(1);
	await expect(page.locator('main')).toHaveCount(1);

	// Modülün kendi adresi: "Giriş" yaprağı işaretli
	await rail(page).getByRole('link', { name: 'Ayarlar' }).click();
	await expect(page).toHaveURL(/\/app\/settings$/);
	await expect(tree(page, 'Ayarlar').getByRole('link', { name: 'Giriş' }).first()).toHaveAttribute('aria-current', 'page');
	await expect(rail(page).getByRole('link', { name: 'Ayarlar' })).toHaveAttribute('aria-current', 'page');
});

test('alt menüsü olmayan modülde ağaç yok, içerik tüm alanı alır', async ({ page }) => {
	await page.goto('/app');
	await expect(rail(page).getByRole('link', { name: 'Ana Sayfa' })).toHaveAttribute('aria-current', 'page');
	await expect(page.getByRole('navigation')).toHaveCount(1); // yalnızca modül rayı
	await expect(page.locator('main')).toHaveCount(1);
});

test('grup açılıp kapanır; tercih modül değişince korunur', async ({ page }) => {
	await page.goto('/app/developments');
	const dev = tree(page, 'Geliştirme');
	const group = dev.getByRole('button', { name: 'Bileşenler' });
	await expect(group).toHaveAttribute('aria-expanded', 'true');
	await expect(dev.getByRole('link', { name: 'Bildirimler' })).toBeVisible();

	await group.click();
	await expect(group).toHaveAttribute('aria-expanded', 'false');
	await expect(dev.getByRole('link', { name: 'Bildirimler' })).toHaveCount(0);

	await rail(page).getByRole('link', { name: 'Grapes' }).click();
	await expect(tree(page, 'Grapes')).toBeVisible();
	await rail(page).getByRole('link', { name: 'Geliştirme' }).click();
	await expect(tree(page, 'Geliştirme').getByRole('button', { name: 'Bileşenler' })).toHaveAttribute('aria-expanded', 'false');
});

test('menüyü gizle modül değişince korunur; odak modu rayı gizler, menü tercihine dokunmaz', async ({ page }) => {
	await page.goto('/app/grapes');
	const toggle = page.getByRole('button', { name: 'Menüyü Gizle' });
	await toggle.click();
	const show = page.getByRole('button', { name: 'Menüyü Göster' });
	await expect(show).toHaveAttribute('aria-expanded', 'false');

	await rail(page).getByRole('link', { name: 'Ayarlar' }).click();
	await expect(page).toHaveURL(/\/app\/settings$/);
	await expect(page.getByRole('button', { name: 'Menüyü Göster' })).toBeVisible(); // modül değişti, ağaç kapalı kaldı

	// Odak modu: ray gizlenir; geri açınca ağaç hâlâ kendi tercihinde (kapalı)
	await page.getByRole('button', { name: 'Paneli Gizle' }).click();
	await expect(rail(page)).toBeHidden();
	await page.getByRole('button', { name: 'Paneli Göster' }).click();
	await expect(rail(page)).toBeVisible();
	await expect(page.getByRole('button', { name: 'Menüyü Göster' })).toBeVisible();
	await page.getByRole('button', { name: 'Menüyü Göster' }).click();
	await expect(page.getByRole('button', { name: 'Menüyü Gizle' })).toHaveAttribute('aria-expanded', 'true');
});
