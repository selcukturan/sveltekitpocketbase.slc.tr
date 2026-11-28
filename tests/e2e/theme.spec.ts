import { test, expect } from '@playwright/test';

// Tema: koyu temada tarayıcının kendi bileşenleri (native tarih seçici, <dialog>, popover) de koyu olmalı.
// Önceki hata: :root { color-scheme: light } kuralı .dark'tan sonra yüklendiği için koyu temayı eziyordu; diyalog ve
// popover metni CanvasText (siyah) kalıyor, koyu zeminde görünmüyordu.

test('koyu temada color-scheme dark; diyalog metni açık renk', async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem('slc:theme', JSON.stringify({ preference: 'dark', current: 'dark' })));
	await page.goto('/app/grapes/crud/simple');
	// Geliştirme sunucusunda CSS sayfadan sonra yüklenir: değer gelene kadar beklenir
	await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('dark');

	await page.getByRole('button', { name: 'Oluştur' }).click();
	const heading = page.getByRole('dialog').getByRole('heading', { name: 'Oluştur' });
	await expect(heading).toBeVisible();
	// Başlık rengi açık olmalı (koyu zeminde okunur): göreli parlaklık > 0.5
	const luminance = await heading.evaluate((el) => {
		const c = document.createElement('canvas').getContext('2d')!;
		c.fillStyle = getComputedStyle(el).color;
		c.fillRect(0, 0, 1, 1);
		const [r, g, b] = c.getImageData(0, 0, 1, 1).data;
		return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
	});
	expect(luminance).toBeGreaterThan(0.5);
});

test('açık temada color-scheme light', async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem('slc:theme', JSON.stringify({ preference: 'light', current: 'light' })));
	await page.goto('/app');
	await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
});
