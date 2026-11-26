/// <reference types="node" /> // Buffer (setInputFiles)
import { test, expect, type Page } from '@playwright/test';

// inputs/File: tür (accept), boyut (maxSize), adet (maxCount) kısıtları, hata mesajı, tekli modda değiştirme,
// dışarıdan value ataması. Demo sayfası: tekli (accept .png,.jpg,.jpeg,.pdf, en fazla 2 MB), çoklu (en fazla 3, 5 MB).
const URL = '/app/developments/components/select';
const file = (name: string, mimeType: string, size = 10) => ({ name, mimeType, buffer: Buffer.alloc(size, 1) });

const section = (page: Page, kind: 'Single' | 'Multiple') =>
	page.locator('div.flex.flex-col.gap-4').filter({ has: page.getByRole('heading', { name: `File.svelte [${kind}] Component Test` }) });

test('tekli: izin verilmeyen tür ve büyük dosya reddedilir; yeni dosya öncekinin yerini alır', async ({ page }) => {
	await page.goto(URL);
	const box = section(page, 'Single');
	const input = box.locator('input[type=file]');
	const error = box.getByRole('alert');

	await input.setInputFiles(file('notlar.txt', 'text/plain'));
	await expect(error).toHaveText('Bazı dosyalar izin verilmeyen türde olduğu için eklenmedi.');
	await expect(box.getByText('notlar.txt')).toHaveCount(0);

	await input.setInputFiles(file('buyuk.pdf', 'application/pdf', 3 * 1024 * 1024));
	await expect(error).toContainText('"buyuk.pdf" çok büyük');

	await input.setInputFiles(file('a.png', 'image/png'));
	await expect(box.locator('output').getByText('a.png')).toBeVisible();
	await expect(box.getByRole('button', { name: 'Dosyayı değiştir veya sürükleyip bırak' })).toBeVisible();
	await input.setInputFiles(file('b.pdf', 'application/pdf'));
	await expect(box.locator('output').getByText('b.pdf')).toBeVisible();
	await expect(box.locator('output').getByText('a.png')).toHaveCount(0);
	await expect(box.getByText('"b.pdf"')).toBeVisible(); // bağlı value

	// Dışarıdan value: kayıtlı dosya olarak gösterilir, yerel seçim temizlenir
	await box.getByRole('button', { name: /Varsayılan Yükle/ }).click();
	await expect(box.locator('output').getByText('ornek-dosya-1.pdf')).toBeVisible();
	await expect(box.locator('output').getByText('b.pdf')).toHaveCount(0);
	await expect(box.getByText('Hiç yeni dosya seçilmedi.')).toBeVisible();
});

test('çoklu: adet sınırı aşılınca fazlası eklenmez; kaldırılan yerine yenisi eklenebilir', async ({ page }) => {
	await page.goto(URL);
	const box = section(page, 'Multiple');
	const input = box.locator('input[type=file]');
	const list = box.locator('output');

	await input.setInputFiles(['1', '2', '3', '4'].map((n) => file(`d${n}.txt`, 'text/plain')));
	await expect(box.getByRole('alert')).toHaveText('En fazla 3 dosya ekleyebilirsiniz. Sınırı aşan dosyalar eklenmedi.');
	await expect(list.getByText(/^d[123]\.txt$/)).toHaveCount(3);
	await expect(list.getByText('d4.txt')).toHaveCount(0);

	await input.setInputFiles(file('d5.txt', 'text/plain'));
	await expect(box.getByRole('alert')).toHaveText('En fazla dosya sayısına ulaşıldı (3).');

	await box.getByRole('button', { name: 'd2.txt dosyasını kaldır' }).click();
	await expect(list.getByText('d2.txt')).toHaveCount(0); // yeni dosya: geri alınamaz, listeden çıkar
	await input.setInputFiles(file('d5.txt', 'text/plain'));
	await expect(list.getByText('d5.txt')).toBeVisible();
});

test('hata mesajı: arka arkaya iki hatada ikincisi tam süre görünür kalır', async ({ page }) => {
	await page.goto(URL);
	const box = section(page, 'Single');
	const input = box.locator('input[type=file]');
	const error = box.getByRole('alert');

	await input.setInputFiles(file('x.txt', 'text/plain'));
	await expect(error).toBeVisible();
	await page.waitForTimeout(3000);
	await input.setInputFiles(file('buyuk.pdf', 'application/pdf', 3 * 1024 * 1024));
	await expect(error).toContainText('çok büyük');
	await page.waitForTimeout(2000); // ilk hatanın 4 sn'lik süresi doldu; ikincisinin dolmadı
	await expect(error).toContainText('çok büyük');
	await expect(error).toBeHidden({ timeout: 4000 });
});
