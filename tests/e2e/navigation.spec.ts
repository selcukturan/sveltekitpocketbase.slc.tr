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

test('tercihler yenilemede korunur: açık gruplar, gizli ağaç, genişlik (klavyeyle; çift tık varsayılana döner)', async ({ page }) => {
	await page.goto('/app/developments');
	await tree(page, 'Geliştirme').getByRole('button', { name: 'Bileşenler' }).click();

	const divider = page.getByRole('separator', { name: 'Menü genişliği' });
	await divider.focus();
	const before = Number(await divider.getAttribute('aria-valuenow'));
	for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight');
	await expect(divider).toHaveAttribute('aria-valuenow', String(before + 30));
	await page.keyboard.press('Shift+ArrowLeft');
	await expect(divider).toHaveAttribute('aria-valuenow', String(before - 20));

	await page.reload();
	await expect(tree(page, 'Geliştirme').getByRole('button', { name: 'Bileşenler' })).toHaveAttribute('aria-expanded', 'false');
	await expect(page.getByRole('separator', { name: 'Menü genişliği' })).toHaveAttribute('aria-valuenow', String(before - 20));
	await page.getByRole('separator', { name: 'Menü genişliği' }).dblclick({ position: { x: 4, y: 40 } }); // ortada aç/kapat düğmesi var
	await expect(page.getByRole('separator', { name: 'Menü genişliği' })).toHaveAttribute('aria-valuenow', '330');

	await page.getByRole('button', { name: 'Menüyü Gizle' }).click();
	await page.reload();
	await expect(page.getByRole('button', { name: 'Menüyü Göster' })).toHaveAttribute('aria-expanded', 'false');
	await expect(page.getByRole('separator')).toHaveCount(0);
});

test.describe('tablet (800 px)', () => {
	test.use({ viewport: { width: 800, height: 900 } });
	test('ray görünür; ağaç içeriğin üstünde panel: varsayılan kapalı, sayfaya gidince ve Esc ile kapanır', async ({ page }) => {
		await page.goto('/app/grapes');
		await expect(rail(page)).toBeVisible();
		await expect(tree(page, 'Grapes')).toHaveCount(0);

		await page.getByRole('button', { name: 'Menüyü Göster' }).click();
		await tree(page, 'Grapes').getByRole('link', { name: 'Basit CRUD' }).click();
		await expect(page).toHaveURL(/\/crud\/simple$/);
		await expect(tree(page, 'Grapes')).toHaveCount(0);

		await page.getByRole('button', { name: 'Menüyü Göster' }).click();
		await expect(tree(page, 'Grapes').getByRole('link', { name: 'Basit CRUD' })).toHaveAttribute('aria-current', 'page');
		await page.keyboard.press('Escape');
		await expect(tree(page, 'Grapes')).toHaveCount(0);
		await expect(page.locator('main')).toHaveCount(1);
	});
});

test.describe('mobil (390 px)', () => {
	test.use({ viewport: { width: 390, height: 800 } });
	test('ray gizli; menü düğmesi drawer açar: modül ağacını gösterir, sayfaya gidince ve Esc ile kapanır', async ({ page }) => {
		await page.goto('/app/grapes');
		await expect(rail(page)).toBeHidden();
		const drawer = page.getByRole('dialog', { name: 'Menü' });
		await expect(drawer).toBeHidden();

		await page.getByRole('button', { name: 'Menü', exact: true }).click();
		await expect(drawer).toBeVisible();
		await expect(drawer.getByRole('navigation', { name: 'Grapes' })).toBeVisible(); // açılışta aktif modül

		// Alt menüsü olan modül: sayfa değişmez, ağacı gösterilir
		await drawer.getByRole('button', { name: 'Ayarlar' }).click();
		await expect(page).toHaveURL(/\/app\/grapes$/);
		await drawer.getByRole('navigation', { name: 'Ayarlar' }).getByRole('link', { name: 'Uygulama' }).click();
		await expect(page).toHaveURL(/\/settings\/system\/application$/);
		await expect(drawer).toBeHidden();

		// Esc kapatır; alt menüsü olmayan modül doğrudan açılır
		await page.getByRole('button', { name: 'Menü', exact: true }).click();
		await page.keyboard.press('Escape');
		await expect(drawer).toBeHidden();
		await page.getByRole('button', { name: 'Menü', exact: true }).click();
		await drawer.getByRole('link', { name: 'Ana Sayfa' }).click();
		await expect(page).toHaveURL(/\/app$/);
		await expect(drawer).toBeHidden();
		await expect(page.locator('main')).toHaveCount(1);
	});
});

test('ekran boyutu değişince sayfa yeniden kurulmaz (girilen değer kalır)', async ({ page }) => {
	await page.goto('/app/settings/system/application');
	const name = page.getByLabel('Uygulama adı');
	await name.fill('yazılan-değer');
	for (const width of [800, 390, 1280]) {
		await page.setViewportSize({ width, height: 800 });
		await expect(page.getByLabel('Uygulama adı')).toHaveValue('yazılan-değer');
	}
});
