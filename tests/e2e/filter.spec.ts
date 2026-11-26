import { test, expect, type Page } from '@playwright/test';

// FilterBar + defineFilters: metin (satır içi), sayı aralığı ve evet/hayır (panel), birlikte (VE) uygulanma, Temizle.
// Test kendi kayıtlarını oluşturur ('seed-e2e-…') ve sonunda siler.
const URL = '/app/grapes/crud/simple';
const grid = (page: Page) => page.getByRole('grid');
const rows = (page: Page) => grid(page).locator('[role="row"][aria-selected]');
const cell = (page: Page, row: number, col: number) => grid(page).locator(`[data-slc-table-datacell][data-row="${row}"][data-col="${col}"]`);
const textFilter = (page: Page) => page.getByRole('textbox', { name: 'Metin (İsteğe Bağlı)', exact: true });
const panelButton = (page: Page) => page.getByRole('button', { name: /Filtreler|Uygulanan filtre/ });

async function createRecord(page: Page, text: string) {
	await page.getByRole('button', { name: 'Oluştur' }).first().click();
	const dialog = page.getByRole('dialog');
	await dialog.getByLabel('text_required').fill(text);
	await dialog.getByLabel('text_optional').fill(text);
	await dialog.getByRole('button', { name: 'Oluştur' }).click();
	await expect(page).not.toHaveURL(/cmd=create/);
	await expect(page.locator('dialog[open]')).toHaveCount(0);
}

async function searchStamp(page: Page, stamp: string, count: number) {
	await textFilter(page).fill(stamp);
	await textFilter(page).press('Enter');
	await expect(rows(page)).toHaveCount(count);
}

test('filtreler: metin, sayı aralığı, evet/hayır birlikte uygulanır; Temizle sıfırlar', async ({ page }) => {
	await page.goto(URL);
	await expect(cell(page, 0, 3)).toBeVisible();
	const stamp = `seed-e2e-${Date.now().toString(36)}`;
	await createRecord(page, `${stamp}-1`);
	await createRecord(page, `${stamp}-2`);
	await searchStamp(page, stamp, 2);

	// 1. kaydın sayısı 500 (tablo içinde düzenleme; kolon 5: number_optional)
	await cell(page, 0, 5).click();
	await page.keyboard.type('500');
	await page.keyboard.press('Enter');
	await expect(cell(page, 0, 5)).toHaveText('500');

	// Panel: sayı en az 100 → yalnızca 500'lük kayıt; butonda uygulanan filtre sayısı
	await panelButton(page).click();
	await page.getByRole('spinbutton', { name: 'Sayı · En az' }).fill('100');
	await page.getByRole('group', { name: 'Filtreler' }).getByRole('button', { name: 'Ara' }).click();
	await expect(rows(page)).toHaveCount(1);
	await expect(cell(page, 0, 4)).toHaveText(`${stamp}-1`);
	await expect(panelButton(page)).toContainText('1');

	// + evet/hayır: Evet → iki filtre birlikte (VE): 500'lük kaydın bool değeri false → sonuç yok
	await panelButton(page).click();
	await page.getByRole('combobox', { name: 'Onay' }).click();
	await page.getByRole('option', { name: 'Evet' }).click();
	await page.getByRole('spinbutton', { name: 'Sayı · En az' }).press('Enter');
	await expect(rows(page)).toHaveCount(0);
	await expect(panelButton(page)).toContainText('2');

	// Temizle: tüm filtreler (metin dahil) sıfırlanır
	await page.getByRole('button', { name: 'Temizle' }).first().click();
	await expect(textFilter(page)).toHaveValue('');
	await expect(panelButton(page)).not.toContainText(/\d/);
	await expect.poll(() => rows(page).count()).toBeGreaterThan(2);

	// Temizlik: oluşturulan kayıtlar
	await searchStamp(page, stamp, 2);
	await grid(page).locator('[data-slc-table-headerrow] input[type=checkbox]').check();
	await cell(page, 0, 3).click();
	await page.keyboard.press('Delete');
	await page.locator('dialog[open]').getByRole('button', { name: 'Sil' }).click();
	await expect(rows(page)).toHaveCount(0);
});

// input.Select filtre panelinin (Toggler) içinde açılır: iç içe popover
test('filtre paneli: iç içe Select seçimde, Esc ve dışarı tıklamada doğru kapanır', async ({ page }) => {
	await page.goto(URL);
	await expect(cell(page, 0, 3)).toBeVisible();
	const panel = page.getByRole('group', { name: 'Filtreler' });
	const onay = page.getByRole('combobox', { name: 'Onay' });
	const options = page.getByRole('listbox').filter({ has: page.getByRole('option', { name: 'Evet' }) });

	// Fareyle seçim: liste kapanır, panel açık kalır, değer görünür
	await panelButton(page).click();
	await onay.click();
	await expect(options).toBeVisible();
	await options.getByRole('option', { name: 'Evet' }).click();
	await expect(options).toBeHidden();
	await expect(panel).toBeVisible();
	await expect(onay).toHaveText('Evet');
	await expect(onay).toBeFocused();

	// Esc: önce yalnızca liste, sonra panel kapanır
	await onay.click();
	await expect(options).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(options).toBeHidden();
	await expect(panel).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(panel).toBeHidden();

	// Klavye: oklarla aç, seç (Enter); panel açık kalır
	await panelButton(page).click();
	await onay.focus();
	await page.keyboard.press('ArrowDown');
	await expect(options).toBeVisible();
	await page.keyboard.press('ArrowDown');
	await page.keyboard.press('Enter');
	await expect(options).toBeHidden();
	await expect(panel).toBeVisible();
	await expect(onay).toHaveText('Hayır');

	// Liste açıkken dışarı tıklama: ikisi birden kapanır
	await onay.click();
	await expect(options).toBeVisible();
	await page.mouse.click(5, 5);
	await expect(options).toBeHidden();
	await expect(panel).toBeHidden();

	// Seçimi kaldırma ("Tümü") ve uygulama: filtre sayısı yok
	await panelButton(page).click();
	await onay.click();
	await options.getByRole('option', { name: 'Tümü' }).click();
	await expect(onay).toHaveText('Tümü');
	await panel.getByRole('button', { name: 'Ara' }).click();
	await expect(panelButton(page)).not.toContainText(/\d/);
});
