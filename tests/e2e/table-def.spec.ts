import { test, expect, type Page } from '@playwright/test';

// defineTable + columnsFor: tanımdan gelen kolonlar ve izinleri, sayfanın eklediği/ezdiği kolonlar
const grid = (page: Page) => page.getByRole('grid');
const header = (page: Page, text: string) => grid(page).locator('[data-slc-table-headerrow] [role="columnheader"]').filter({ hasText: text });

test('Simple CRUD: tanımdaki sortable kolonlar sıralanır, sayfanın eklediği kolonlar sıralanmaz', async ({ page }) => {
	await page.goto('/app/grapes/crud/simple');
	await expect(grid(page).locator('[data-slc-table-datacell]').first()).toBeVisible();

	// Tanımdan: sıralama ikonu var, tıklayınca sıralanır
	const number = header(page, 'Sayı');
	await expect(number.locator('.slc-table-sort-icon')).toHaveCount(1);
	await number.click();
	await expect(number).toHaveAttribute('aria-sort', 'ascending');

	// prepend ile eklenen işlem kolonu: sıralama ikonu yok, tıklamak sıralamayı değiştirmez
	const actions = header(page, 'İşlemler');
	await expect(actions.locator('.slc-table-sort-icon')).toHaveCount(0);
	await actions.click();
	await expect(number).toHaveAttribute('aria-sort', 'ascending');
	await expect(actions).not.toHaveAttribute('aria-sort');
});

test('/app/data-table: override ile gizlenen kolonlar görünmez, Kolonlar menüsünden açılabilir', async ({ page }) => {
	await page.goto('/app/data-table');
	await expect(grid(page).locator('[data-slc-table-datacell]').first()).toBeVisible();
	await expect(header(page, 'Sayı')).toHaveCount(1);
	await expect(header(page, 'Seçim (Tekli)')).toHaveCount(0);

	await page.getByRole('button', { name: 'Kolon görünürlüğünü değiştir' }).click();
	const toggle = page.getByRole('checkbox', { name: 'Seçim (Tekli)' });
	await expect(toggle).not.toBeChecked();
	await toggle.check();
	await expect(header(page, 'Seçim (Tekli)')).toHaveCount(1);
	await toggle.uncheck(); // ayar persist edilmez (sayfada persist yok); yine de eski hâline döndür
});
