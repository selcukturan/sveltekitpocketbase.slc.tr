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

// ---------------------------------------------------------------- 3. aşama: hücre aralığı
const rangeCells = (page: Page) => grid(page).locator('[data-slc-table-datacell][data-in-range]');

test('Shift + oklar aralık seçer, Esc önce aralığı kapatır', async ({ page }) => {
	await openTable(page);
	await cell(page, 0, 2).click();
	await page.keyboard.press('Shift+ArrowDown');
	await page.keyboard.press('Shift+ArrowDown');
	await page.keyboard.press('Shift+ArrowRight');
	await expect(rangeCells(page)).toHaveCount(6); // 3 satır × 2 kolon
	await expect(activeCell(page)).toHaveAttribute('data-row', '2');
	await expect(activeCell(page)).toHaveAttribute('data-col', '3');

	await page.keyboard.press('ArrowDown'); // Shift'siz hareket aralığı kapatır
	await expect(rangeCells(page)).toHaveCount(0);

	await page.keyboard.press('Shift+ArrowUp');
	await expect(rangeCells(page)).toHaveCount(2);
	await page.keyboard.press('Escape');
	await expect(rangeCells(page)).toHaveCount(0);
});

test('Shift + tıklama aktif hücreden tıklanana aralık seçer', async ({ page }) => {
	await openTable(page);
	await cell(page, 1, 2).click();
	await cell(page, 3, 4).click({ modifiers: ['Shift'] });
	await expect(rangeCells(page)).toHaveCount(9); // 3 × 3
});

test('fareyle sürükleme aralık seçer, kenarda otomatik kaydırır', async ({ page }) => {
	await openTable(page);
	const from = await cell(page, 0, 2).boundingBox();
	const to = await cell(page, 2, 3).boundingBox();
	await page.mouse.move(from!.x + 5, from!.y + 5);
	await page.mouse.down();
	await page.mouse.move(to!.x + 5, to!.y + 5, { steps: 5 });
	await page.mouse.up();
	await expect(rangeCells(page)).toHaveCount(6);

	// Alt kenarın dışına sürükleyip beklemek tabloyu aşağı kaydırır
	const box = (await grid(page).boundingBox())!;
	const scrollBefore = await grid(page).evaluate((el) => el.scrollTop);
	await page.mouse.move(from!.x + 5, from!.y + 5);
	await page.mouse.down();
	await page.mouse.move(from!.x + 5, box.y + box.height + 40, { steps: 5 });
	await page.waitForTimeout(600);
	await page.mouse.up();
	expect(await grid(page).evaluate((el) => el.scrollTop)).toBeGreaterThan(scrollBefore);
	expect(Number(await activeCell(page).getAttribute('data-row'))).toBeGreaterThan(2);
});

test('Ctrl+C aralığı sekmeyle ayrılmış metin olarak kopyalar', async ({ page, context }) => {
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	await openTable(page);
	await cell(page, 0, 2).click();
	await page.keyboard.press('Shift+ArrowDown');
	await page.keyboard.press('Shift+ArrowRight');
	await page.keyboard.press('Control+c');

	const expected = [0, 1].map((r) => [2, 3].map((c) => cell(page, r, c)));
	const rows = await Promise.all(expected.map((cells) => Promise.all(cells.map(async (c) => ((await c.textContent()) ?? '').trim()))));
	await expect(page.getByText('4 hücre panoya kopyalandı.')).toBeVisible();
	const clip = await page.evaluate(() => navigator.clipboard.readText());
	const lines = clip.split('\n').map((line) => line.split('\t'));
	expect(lines).toHaveLength(2);
	expect(lines.map((l) => l.length)).toEqual([2, 2]);
	expect(lines[0][0]).toBe(rows[0][0]); // ID kolonu: ham değer = görünen metin
	expect(lines[1][0]).toBe(rows[1][0]);
});

// ---------------------------------------------------------------- 4. aşama: hücre düzenleme
// Kendi kayıtlarını oluşturur ('seed-e2e-…'), yalnızca onları düzenler ve sonunda siler.
// Görünür kolonlar: 0 seçim, 1 işlemler, 2 id, 3 text_required, 4 text_optional, 5 number, 6 select_single, 7 select_multiple, 8 date, 9 bool
test('hücre düzenleme: yazma/F2/Enter/Esc, sayı, liste, tarih, bool ve doğrulama', async ({ page }) => {
	await openTable(page);
	const stamp = `seed-e2e-${Date.now().toString(36)}`;
	await createRecord(page, `${stamp}-1`);
	await createRecord(page, `${stamp}-2`);
	const search = page.getByPlaceholder('Ara: text_optional içerir...');
	await search.fill(stamp);
	await search.press('Enter');
	await expect(grid(page).locator('[role="row"][aria-selected]')).toHaveCount(2);
	const editor = grid(page).locator('.slc-table-editor');

	// Yazmaya başlamak düzenler, Enter kaydedip alt satıra geçer (sıralama text_required: 'aaa…' başta kalır)
	await cell(page, 0, 3).click();
	await page.keyboard.type('aaa yeni');
	await expect(editor).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(editor).toHaveCount(0);
	await expect(grid(page)).toBeFocused();
	await expect(activeCell(page)).toHaveAttribute('data-row', '1');
	await expect(cell(page, 0, 3)).toHaveText('aaa yeni');

	// Esc iptal eder
	await page.keyboard.press('F2');
	await page.keyboard.type('xyz');
	await page.keyboard.press('Escape');
	await expect(editor).toHaveCount(0);
	await expect(cell(page, 1, 3)).not.toContainText('xyz');

	// Sayı (virgüllü ondalık), Tab sağa geçer. withOverride: yeni değer sunucu yanıtından önce görünür
	// (getList'te 300 ms gecikme var), istek sürerken hücre "kaydediliyor" işaretli, bitince işaret kalkar.
	await cell(page, 0, 5).click();
	await page.keyboard.type('12,5');
	await page.keyboard.press('Tab');
	await expect(activeCell(page)).toHaveAttribute('data-col', '6');
	await expect(cell(page, 0, 5)).toHaveAttribute('data-saving', 'true', { timeout: 200 });
	await expect(cell(page, 0, 5)).toHaveText('12,5', { timeout: 200 });
	await expect(cell(page, 0, 5)).not.toHaveAttribute('data-saving');
	await expect(cell(page, 0, 5)).toHaveText('12,5');

	// Liste: Enter açar, seçenek seçilip Enter kaydeder
	await page.keyboard.press('Enter');
	await grid(page).locator('select.slc-table-editor').selectOption('linux');
	await page.keyboard.press('Enter');
	await expect(cell(page, 0, 6)).toHaveText('linux');

	// Tarih
	await cell(page, 0, 8).dblclick();
	await grid(page).locator('input.slc-table-editor[type="date"]').fill('2026-03-15');
	await page.keyboard.press('Enter');
	await expect(cell(page, 0, 8)).toHaveText('15.03.2026');

	// Bool: Enter düzenleyici açmadan tersine çevirir
	await cell(page, 0, 9).click();
	const before = await cell(page, 0, 9).locator('span').getAttribute('aria-label');
	await page.keyboard.press('Enter');
	await expect(editor).toHaveCount(0);
	await expect(cell(page, 0, 9).locator('span')).not.toHaveAttribute('aria-label', before!);

	// Doğrulama (validateCell): zorunlu alan boşaltılamaz → kaydedilmez, düzenleyici açık kalır ve mesaj görünür
	await cell(page, 0, 3).click();
	await page.keyboard.press('Backspace');
	await page.keyboard.press('Enter');
	await expect(editor).toBeVisible();
	await expect(editor).toHaveAttribute('aria-invalid', 'true');
	await expect(page.getByRole('alert').filter({ hasText: 'Bu alan zorunludur.' })).toBeVisible();
	await page.keyboard.type('b'); // yazınca mesaj kalkar
	await expect(page.getByRole('alert').filter({ hasText: 'Bu alan zorunludur.' })).toHaveCount(0);
	await page.keyboard.press('Escape');
	await expect(editor).toHaveCount(0);
	await expect(cell(page, 0, 3)).toHaveText('aaa yeni');

	// temizlik
	await deleteFirstRow(page);
	await expect(grid(page).locator('[role="row"][aria-selected]')).toHaveCount(1);
	await deleteFirstRow(page);
	await expect(grid(page).locator('[role="row"][aria-selected]')).toHaveCount(0);
});

test('Ctrl+V: blok yapıştırır, tek değerle aralığı doldurur, geçersizleri bildirir', async ({ page, context }) => {
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	const clip = (text: string) => page.evaluate((t) => navigator.clipboard.writeText(t), text);
	await openTable(page);
	const stamp = `seed-e2e-${Date.now().toString(36)}`;
	await createRecord(page, `${stamp}-1`);
	await createRecord(page, `${stamp}-2`);
	const search = page.getByPlaceholder('Ara: text_optional içerir...');
	await search.fill(stamp);
	await search.press('Enter');
	await expect(grid(page).locator('[role="row"][aria-selected]')).toHaveCount(2);

	// 2×2 blok: sayı + liste (Excel'den kopyalanmış gibi, sondaki satır sonu dahil)
	await cell(page, 0, 5).click();
	await clip('10\tlinux\r\n20,5\twindows\r\n');
	await page.keyboard.press('Control+v');
	await expect(rangeCells(page)).toHaveCount(4); // yapıştırılan alan seçili
	await expect(cell(page, 0, 5)).toHaveText('10');
	await expect(cell(page, 0, 6)).toHaveText('linux');
	await expect(cell(page, 1, 5)).toHaveText('20,5');
	await expect(cell(page, 1, 6)).toHaveText('windows');

	// Tek değer + aralık: aralığı doldurur (bool)
	await cell(page, 0, 9).click();
	await page.keyboard.press('Shift+ArrowDown');
	await clip('evet');
	await page.keyboard.press('Control+v');
	await expect(cell(page, 0, 9).locator('span')).toHaveAttribute('aria-label', 'true');
	await expect(cell(page, 1, 9).locator('span')).toHaveAttribute('aria-label', 'true');

	// Geçersiz değer kaydedilmez, bildirilir
	await cell(page, 0, 5).click();
	await clip('abc');
	await page.keyboard.press('Control+v');
	await expect(page.getByText('1 hücre yapıştırılamadı').first()).toBeVisible();
	await expect(cell(page, 0, 5)).toHaveText('10');

	// Düzenlenemeyen hücre (id) sessizce atlanır
	const id = await cell(page, 0, 2).textContent();
	await cell(page, 0, 2).click();
	await clip('xyz');
	await page.keyboard.press('Control+v');
	await expect(cell(page, 0, 2)).toHaveText(id!);

	// temizlik
	await deleteFirstRow(page);
	await expect(grid(page).locator('[role="row"][aria-selected]')).toHaveCount(1);
	await deleteFirstRow(page);
	await expect(grid(page).locator('[role="row"][aria-selected]')).toHaveCount(0);
});
