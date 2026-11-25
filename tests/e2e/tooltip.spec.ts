import { test, expect, type Page } from '@playwright/test';

// tooltip attachment: belge düzeyinde tek dinleyici seti (olay delegasyonu) ile mouseenter/leave davranışı
const URL = '/app/grapes/crud/simple';
const grid = (page: Page) => page.getByRole('grid');
const actions = (page: Page, row: number) => grid(page).locator(`[data-slc-table-datacell][data-row="${row}"][data-col="1"] button`);
const tip = (page: Page) => page.locator('.slc-app-tooltip');

test('üzerine gelince görünür, içinde gezinince kalır, çıkınca gizlenir, elemanlar arası geçer', async ({ page }) => {
	await page.goto(URL);
	await expect(grid(page).locator('[data-slc-table-datacell][data-row="0"]').first()).toBeVisible();

	const remove = actions(page, 1).nth(1);
	await remove.hover();
	await expect(tip(page)).toHaveClass(/active/);
	await expect(tip(page)).toHaveText('Sil');

	// İkonun üzerine geçmek elemandan çıkmak değildir
	const box = (await remove.boundingBox())!;
	await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
	await expect(tip(page)).toHaveClass(/active/);

	await page.mouse.move(box.x - 200, box.y + 200);
	await expect(tip(page)).not.toHaveClass(/active/);

	await actions(page, 2).nth(2).hover();
	await expect(tip(page)).toHaveText('Görüntüle');
	await expect(tip(page)).toHaveClass(/active/);
});

test('tıklama gizler; fare içeride kaldıkça yeniden açılmaz', async ({ page }) => {
	await page.goto(URL);
	const toggle = page.getByRole('button', { name: 'Temayı Değiştir' });
	await toggle.hover();
	await expect(tip(page)).toHaveText('Temayı Değiştir');
	await expect(tip(page)).toHaveClass(/active/);

	await toggle.click();
	await expect(tip(page)).not.toHaveClass(/active/);
	const box = (await toggle.boundingBox())!;
	await page.mouse.move(box.x + 3, box.y + box.height / 2);
	await page.waitForTimeout(300);
	await expect(tip(page)).not.toHaveClass(/active/);

	await toggle.click(); // temayı geri al
});
