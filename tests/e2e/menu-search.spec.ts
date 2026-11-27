import { test, expect, type Page } from '@playwright/test';
import { buildTree, type MenuRecord } from '../../src/lib/app/menu/tree.ts';
import { menuEntries, searchMenu } from '../../src/lib/app/menu/search.ts';

// app/menu/search.ts (saf): tarayıcı açılmaz.
const rec = (id: string, parent_id: string | null, sort: number, title: string, href?: string): MenuRecord => ({ id, parent_id, title, sort, href });
const menu = buildTree([
	rec('home', null, 10, 'Ana Sayfa', '/app'),
	rec('grapes', null, 20, 'Grapes'),
	rec('grapes.intro', 'grapes', 10, 'Giriş', '/app/grapes'),
	rec('grapes.crud', 'grapes', 20, 'CRUD'),
	rec('grapes.crud.simple', 'grapes.crud', 20, 'Basit CRUD', '/app/grapes/crud/simple'),
	rec('settings', null, 30, 'Ayarlar'),
	rec('settings.system', 'settings', 10, 'Sistem'),
	rec('settings.system.permissions', 'settings.system', 30, 'Yetkiler', '/app/settings/system/permissions'),
	rec('settings.system.app', 'settings.system', 20, 'Uygulama Öğrenci Işıkları', '/app/settings/system/application')
]);
const entries = menuEntries(menu, (n) => n.title);
const ids = (q: string) => searchMenu(entries, q).map((e) => e.id);

test('liste: yalnızca sayfası olanlar (grup ve alt menülü modül yok), yol üst başlıklardan', () => {
	expect(entries.map((e) => e.id)).toEqual(['home', 'grapes.intro', 'grapes.crud.simple', 'settings.system.app', 'settings.system.permissions']);
	expect(entries.find((e) => e.id === 'grapes.crud.simple')?.path).toEqual(['Grapes', 'CRUD']);
	expect(ids('')).toHaveLength(5); // boş sorgu: hepsi, menü sırasıyla
});

test('arama: Türkçe normalizasyon, başlık önce, yol ve anahtarda da arar, tüm kelimeler gerekli', () => {
	expect(ids('yetki')).toEqual(['settings.system.permissions']);
	expect(ids('OGRENCI isik')).toEqual(['settings.system.app']); // aksan ve ı farkı yok
	expect(ids('crud')).toEqual(['grapes.crud.simple']); // başlıkta (Basit CRUD) ve yolda
	expect(ids('sistem')).toEqual(['settings.system.app', 'settings.system.permissions']); // yalnızca yolda: menü sırası
	expect(ids('permissions')).toEqual(['settings.system.permissions']); // anahtar
	expect(ids('basit yok')).toEqual([]);
	expect(ids('gir')).toEqual(['grapes.intro']); // başlık sorguyla başlıyor
	expect(searchMenu(entries, 'a', 2)).toHaveLength(2); // sınır
});

// Tarayıcıda: üst çubuktaki "Ara" düğmesiyle (geliştirme sunucusunda Ctrl+K'yı Vite DevTools yakalar; üretimde Ctrl+K / ⌘K)
const palette = (page: Page) => page.getByRole('dialog', { name: 'Ara' });
const openPalette = async (page: Page) => {
	await page.getByRole('banner').getByRole('button', { name: 'Ara' }).click();
	await expect(palette(page).getByRole('combobox')).toBeFocused();
};

test('arama penceresi: yazınca süzer (başlık ve yol), Enter sayfayı açar; konum çubuğu ve menü güncellenir', async ({ page }) => {
	await page.goto('/app');
	await openPalette(page);
	await palette(page).getByRole('combobox').fill('yetki');
	const option = palette(page).getByRole('option');
	await expect(option).toHaveCount(1);
	await expect(option.first()).toContainText('Yetkiler');
	await expect(option.first()).toContainText('Ayarlar › Sistem');
	await expect(option.first()).toHaveAttribute('aria-selected', 'true');
	await page.keyboard.press('Enter');
	await expect(page).toHaveURL(/\/app\/settings\/system\/permissions$/);
	await expect(palette(page)).toBeHidden();
	await expect(page.getByRole('navigation', { name: 'Konum' }).getByText('Yetkiler')).toHaveAttribute('aria-current', 'page');
});

test('arama penceresi: ↑ ↓ ile gezinir (aria-activedescendant), Türkçe karakterler, sonuç yoksa mesaj, Esc kapatır ve odak döner', async ({ page }) => {
	await page.goto('/app');
	await openPalette(page);
	const box = palette(page).getByRole('combobox');
	await box.fill('GIRIS'); // "Giriş" sayfaları (ı/i, ş/s farkı yok)
	const options = palette(page).getByRole('option');
	expect(await options.count()).toBeGreaterThan(1);
	await page.keyboard.press('ArrowDown');
	await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
	await expect(box).toHaveAttribute('aria-activedescendant', (await options.nth(1).getAttribute('id'))!);
	await page.keyboard.press('ArrowUp');
	await page.keyboard.press('ArrowUp'); // baştan sona döner
	await expect(options.last()).toHaveAttribute('aria-selected', 'true');

	await box.fill('böyle bir sayfa yok');
	await expect(palette(page).getByText('Sonuç yok')).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(palette(page)).toBeHidden();
	await expect(page.getByRole('banner').getByRole('button', { name: 'Ara' })).toBeFocused();
});
