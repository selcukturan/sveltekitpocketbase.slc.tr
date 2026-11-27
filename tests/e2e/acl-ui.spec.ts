import { test, expect, type Page } from '@playwright/test';
import * as devalue from 'devalue';

// Yetkinin arayüze yansıması: menü veritabanından, erişilemeyen sayfada 403 görünümü, izne göre düğmeler.
// Demo kullanıcı yetki satırı yazamadığı için (yalnızca yöneticiler) getMyAccess yanıtı tarayıcıda değiştirilir:
// gerçek yanıt alınır, yalnızca etkin izinler (access) daraltılır. Sunucudaki kontrol (requirePermission) bundan
// etkilenmez; kuralları acl-access.spec.ts denetler.
type Access = Record<string, string[]>;

async function withAccess(page: Page, change: (access: Access) => void) {
	await page.route(/\/_app\/remote\/[^?]*getMyAccess/, async (route) => {
		const response = await route.fetch();
		const body = (await response.json()) as { type: string; data: string };
		const data = devalue.parse(body.data) as { _: { access: Access } };
		change(data._.access);
		await route.fulfill({ response, json: { ...body, data: devalue.stringify(data) } });
	});
}

const rail = (page: Page) => page.getByRole('navigation', { name: 'Modüller' });
const tree = (page: Page, module: string) => page.getByRole('navigation', { name: module, exact: true });
const forbidden = (page: Page) => page.getByTestId('forbidden');

test('menü veritabanından: tüm modüller; başlıklar çeviri dosyasından', async ({ page }) => {
	await page.goto('/app/grapes/crud/simple');
	for (const name of ['Ana Sayfa', 'Grapes', 'Veri Tablosu', 'Kayıtlar', 'Geliştirme', 'Ayarlar']) {
		await expect(rail(page).getByRole('link', { name, exact: true })).toBeVisible();
	}
	await expect(tree(page, 'Grapes').getByRole('link', { name: 'Basit CRUD' })).toHaveAttribute('aria-current', 'page');
	await expect(forbidden(page)).toHaveCount(0);
});

test('erişilemeyen sayfa menüden budanır, adresine gidilirse 403 görünümü (sayfa kurulmaz)', async ({ page }) => {
	await withAccess(page, (access) => {
		delete access['grapes.crud.full'];
		delete access['logs'];
	});
	await page.goto('/app/grapes/crud/simple');
	const grapes = tree(page, 'Grapes');
	await expect(grapes.getByRole('link', { name: 'Basit CRUD' })).toBeVisible();
	await expect(grapes.getByRole('link', { name: 'Oluştur, Oku, Güncelle, Sil' })).toHaveCount(0);
	await expect(rail(page).getByRole('link', { name: 'Kayıtlar' })).toHaveCount(0); // tek sayfalı modül

	await page.goto('/app/grapes/crud/create-read-update-delete');
	await expect(forbidden(page)).toBeVisible();
	await expect(page.locator('main table')).toHaveCount(0);
	await forbidden(page).getByRole('link', { name: 'Ana sayfaya dön' }).click();
	await expect(page).toHaveURL(/\/app$/);
	await expect(forbidden(page)).toHaveCount(0);
});

test('modülde erişilebilen tek sayfa kalınca ray doğrudan ona gider', async ({ page }) => {
	await withAccess(page, (access) => {
		for (const key of Object.keys(access)) if (key.startsWith('grapes.') && key !== 'grapes.crud.simple') delete access[key];
	});
	await page.goto('/app');
	await expect(rail(page).getByRole('link', { name: 'Grapes' })).toHaveAttribute('href', '/app/grapes/crud/simple');
	await page.goto('/app/grapes');
	await expect(forbidden(page)).toBeVisible(); // Giriş sayfası artık kapalı
});

test('Simple CRUD: yalnızca listeleme izni varsa oluştur, güncelle, sil düğmeleri yok; hücreler düzenlenemez', async ({ page }) => {
	await withAccess(page, (access) => {
		access['grapes.crud.simple'] = ['access', 'list'];
	});
	await page.goto('/app/grapes/crud/simple');
	const table = page.getByRole('grid');
	await expect(table.getByRole('row').nth(1)).toBeVisible();
	await expect(page.getByRole('button', { name: 'Oluştur' })).toHaveCount(0);
	await expect(table.getByRole('button', { name: 'Güncelle' })).toHaveCount(0);
	await expect(table.getByRole('button', { name: 'Sil' })).toHaveCount(0);
	await expect(table.getByRole('button', { name: 'Görüntüle' })).toHaveCount(0);

	// Hücre düzenleme kapalı: Enter düzenleyici açmaz
	await table.getByRole('gridcell').filter({ hasText: /\S/ }).nth(2).click();
	await page.keyboard.press('Enter');
	await expect(table.locator('input:not([type=checkbox]), textarea')).toHaveCount(0);
});

test('Simple CRUD: tüm izinlerle düğmeler görünür', async ({ page }) => {
	await page.goto('/app/grapes/crud/simple');
	const table = page.getByRole('grid');
	await expect(page.getByRole('button', { name: 'Oluştur' })).toBeVisible();
	await expect(table.getByRole('button', { name: 'Güncelle' }).first()).toBeVisible();
	await expect(table.getByRole('button', { name: 'Sil' }).first()).toBeVisible();
});

test('sunucu reddederse (403) hata yalnızca drawer içinde görünür, sayfa ayakta kalır; Tekrar dene yeniden ister', async ({ page }) => {
	// requirePermission'ın yanıtı (gerçek sunucuda doğrulandı: {"type":"error","error":{"status":403,"message":"error_forbidden",…}})
	let deny = true;
	await page.route(/\/_app\/remote\/[^?]*getOne/, (route) =>
		deny
			? route.fulfill({ status: 403, json: { type: 'error', error: { type: 'general', errorId: 'forbidden', status: 403, message: 'error_forbidden' } } })
			: route.continue()
	);
	await page.goto('/app/grapes/crud/simple');
	const table = page.getByRole('grid');
	await table.getByRole('button', { name: 'Görüntüle' }).first().click();
	const alert = page.getByRole('alert').filter({ hasText: 'Erişim engellendi!' });
	await expect(alert).toBeVisible();
	await expect(table).toBeVisible(); // kök hata sayfasına düşmedi

	deny = false;
	await alert.getByRole('button', { name: 'Tekrar dene' }).click();
	await expect(alert).toHaveCount(0);
	await expect(page.getByText('text_required').last()).toBeVisible();
});
