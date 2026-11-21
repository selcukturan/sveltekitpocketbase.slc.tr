import { test, expect, type Page } from '@playwright/test';

// Simple CRUD sayfasındaki DataTable: hücre gezinmesi, seçim ve odak.
const URL = '/app/grapes/crud/simple';

const grid = (page: Page) => page.getByRole('grid');
const cell = (page: Page, row: number, col: number) => grid(page).locator(`[data-slc-table-datacell][data-row="${row}"][data-col="${col}"]`);
const activeCell = (page: Page) => grid(page).locator('[data-slc-table-datacell][data-active]');

async function openTable(page: Page) {
	await page.goto(URL);
	await expect(cell(page, 0, 2)).toBeVisible();
}

test('hücreye tıklama aktif yapar, oklar ve Home/End gezinir', async ({ page }) => {
	await openTable(page);
	await cell(page, 0, 2).click();
	await expect(grid(page)).toBeFocused();
	await expect(activeCell(page)).toHaveAttribute('data-row', '0');
	await expect(activeCell(page)).toHaveAttribute('data-col', '2');

	await page.keyboard.press('ArrowDown');
	await expect(activeCell(page)).toHaveAttribute('data-row', '1');

	await page.keyboard.press('ArrowRight');
	await expect(activeCell(page)).toHaveAttribute('data-col', '3');

	await page.keyboard.press('Home');
	await expect(activeCell(page)).toHaveAttribute('data-col', '0');

	await page.keyboard.press('End');
	const lastCol = await activeCell(page).getAttribute('data-col');
	expect(Number(lastCol)).toBeGreaterThan(3);

	// aria-activedescendant aktif hücreyi gösterir
	const id = await activeCell(page).getAttribute('id');
	await expect(grid(page)).toHaveAttribute('aria-activedescendant', id!);
});

test('Ctrl+End son satıra gider ve görünür alana kaydırır, Ctrl+Home başa döner', async ({ page }) => {
	await openTable(page);
	await cell(page, 0, 2).click();
	const rowCount = await grid(page).evaluate((el) => Number(el.getAttribute('aria-rowcount')));

	await page.keyboard.press('Control+End');
	const last = activeCell(page);
	await expect(last).toBeInViewport();
	const lastRow = Number(await last.getAttribute('data-row'));
	expect(lastRow).toBeGreaterThan(0);
	expect(lastRow).toBeLessThan(rowCount);

	await page.keyboard.press('Control+Home');
	await expect(activeCell(page)).toHaveAttribute('data-row', '0');
	await expect(activeCell(page)).toHaveAttribute('data-col', '0');
	await expect(activeCell(page)).toBeInViewport();
});

test('Space satırı seçer, Esc seçimi temizler', async ({ page }) => {
	await openTable(page);
	await cell(page, 1, 2).click();
	await page.keyboard.press('Space');
	await expect(grid(page).locator('[role="row"][aria-selected="true"]')).toHaveCount(1);
	await page.keyboard.press('Escape');
	await expect(grid(page).locator('[role="row"][aria-selected="true"]')).toHaveCount(0);
});

test('drawer kapanınca Tab odağı aktif hücreye döndürür', async ({ page }) => {
	await openTable(page);
	// İşlemler kolonundaki ilk buton: Düzenle
	const actions = cell(page, 0, 1);
	await actions.locator('button').first().click();
	await expect(page).toHaveURL(/cmd=update/);
	await expect(page.getByRole('dialog')).toBeVisible();
	await page.keyboard.press('Escape'); // drawer kapanır, tarayıcı odağı butona geri verir
	await expect(page).not.toHaveURL(/cmd=update/);
	await expect(actions.locator('button').first()).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(grid(page)).toBeFocused();
});

// Test kendi kayıtlarını oluşturur ('seed-e2e-…'; yarıda kalırsa sayfadaki "Testleri sil" temizler) ve sonunda siler.
async function createRecord(page: Page, text: string) {
	await page.getByRole('button', { name: 'Oluştur' }).first().click();
	const dialog = page.getByRole('dialog');
	await dialog.getByLabel('text_required').fill(text);
	await dialog.getByLabel('text_optional').fill(text);
	await dialog.getByRole('button', { name: 'Oluştur' }).click();
	await expect(page).not.toHaveURL(/cmd=create/);
}

async function deleteFirstRow(page: Page) {
	await cell(page, 0, 1).locator('button').nth(1).click(); // İşlemler: Düzenle, Sil, Görüntüle
	await page.locator('dialog[open]').getByRole('button', { name: 'Sil' }).click();
}

test('silinen satırla kaybolan odak gride geri verilir (toast sonrasında da)', async ({ page }) => {
	await openTable(page);
	const stamp = `seed-e2e-${Date.now().toString(36)}`;
	await createRecord(page, `${stamp}-1`);
	await createRecord(page, `${stamp}-2`);

	const search = page.getByPlaceholder('Ara: text_optional içerir...');
	await search.fill(stamp);
	await search.press('Enter');
	await expect(grid(page).locator('[role="row"][aria-selected]')).toHaveCount(2);
	await expect(cell(page, 0, 3)).toContainText(`${stamp}-1`);

	await cell(page, 0, 3).click(); // aktif hücre: 1. satır, text_optional kolonu
	await deleteFirstRow(page);

	await expect(page.getByText('Başarıyla silindi!').first()).toBeVisible();
	await expect(grid(page).getByText(`${stamp}-1`, { exact: true })).toHaveCount(0);
	await page.waitForTimeout(800); // toast animasyonu ve gecikmeli DOM değişiklikleri bitsin
	await expect(grid(page)).toBeFocused();
	await expect(activeCell(page)).toHaveAttribute('data-row', '0');

	// temizlik: kalan kayıt
	await deleteFirstRow(page);
	await expect(grid(page).getByText(`${stamp}-2`, { exact: true })).toHaveCount(0);
});
