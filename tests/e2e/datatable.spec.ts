import { test, expect, type Page, type Locator } from '@playwright/test';

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

test('hücre tıklaması satırı seçmez; aktif satır renklenir, gezinince taşınır', async ({ page }) => {
	await openTable(page);
	const activeRowCells = grid(page).locator('[data-slc-table-datacell][data-active-row]');
	await cell(page, 1, 3).click();
	await expect(grid(page).locator('[role=row][aria-selected=true]')).toHaveCount(0);
	await expect(activeRowCells.first()).toHaveAttribute('data-row', '1');
	expect(await activeRowCells.evaluateAll((els) => new Set(els.map((el) => el.getAttribute('data-row'))).size)).toBe(1);
	// Rengi seçili satırdan farklı, boş arka plandan farklı
	const bg = (row: number) => cell(page, row, 3).evaluate((el) => getComputedStyle(el).backgroundColor);
	await page.mouse.move(0, 0); // hover rengi karışmasın
	expect(await bg(1)).not.toBe(await bg(2));

	await page.keyboard.press('ArrowDown');
	await expect(activeRowCells.first()).toHaveAttribute('data-row', '2');
	await expect(cell(page, 1, 3)).not.toHaveAttribute('data-active-row');
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

// Test kendi kayıtlarını oluşturur ('seed-e2e-…') ve sonunda siler. Yarıda kalırsa kayıtlar text_optional'da 'seed-e2e-' ile aranıp silinebilir.
async function createRecord(page: Page, text: string) {
	await page.getByRole('button', { name: 'Oluştur' }).first().click();
	const dialog = page.getByRole('dialog');
	await dialog.getByLabel('Metin (Gerekli)').fill(text);
	await dialog.getByLabel('Metin (İsteğe Bağlı)').fill(text);
	await dialog.getByRole('button', { name: 'Oluştur' }).click();
	await expect(page).not.toHaveURL(/cmd=create/);
	// URL önce değişir, çekmece kapanma animasyonu (~150 ms) boyunca modal kalır: sayfa inert, fill boşa gider
	await expect(page.locator('dialog[open]')).toHaveCount(0);
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

	const search = page.getByRole('textbox', { name: 'Metin (İsteğe Bağlı)', exact: true });
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
	// Bildirim tablonun içinde (sağ üst), sayfa toast'ı değil; birkaç saniye sonra kaybolur
	const notice = page.locator('.slc-table-container [role=status]').filter({ hasText: '4 hücre panoya kopyalandı.' });
	await expect(notice).toBeVisible();
	await expect(notice).toContainText('Kopyalandı');
	await expect(notice).toHaveCount(0, { timeout: 5000 });
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
	const search = page.getByRole('textbox', { name: 'Metin (İsteğe Bağlı)', exact: true });
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
	await cell(page, 0, 10).click();
	const before = await cell(page, 0, 10).locator('span').getAttribute('aria-label');
	await page.keyboard.press('Enter');
	await expect(editor).toHaveCount(0);
	await expect(cell(page, 0, 10).locator('span')).not.toHaveAttribute('aria-label', before!);

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
	const search = page.getByRole('textbox', { name: 'Metin (İsteğe Bağlı)', exact: true });
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
	await cell(page, 0, 10).click();
	await page.keyboard.press('Shift+ArrowDown');
	await clip('evet');
	await page.keyboard.press('Control+v');
	await expect(cell(page, 0, 10).locator('span')).toHaveAttribute('aria-label', 'true');
	await expect(cell(page, 1, 10).locator('span')).toHaveAttribute('aria-label', 'true');

	// Geçersiz değer kaydedilmez, bildirilir
	await cell(page, 0, 5).click();
	await clip('abc');
	await page.keyboard.press('Control+v');
	await expect(page.getByText('1 hücre yapıştırılamadı').first()).toBeVisible();
	await expect(cell(page, 0, 5)).toHaveText('10');

	// Düzenlenemeyen hücre (id) sessizce atlanır. Satır sırasına bakılmaz: varsayılan sıralama (-sayı) yukarıdaki
	// yapıştırmalardan sonra liste tazelenince satırların yerini değiştirebilir.
	const ids = await grid(page).locator('[data-slc-table-datacell][data-col="2"]').allTextContents();
	await cell(page, 0, 2).click();
	await clip('xyz');
	await page.keyboard.press('Control+v');
	await expect(grid(page).getByRole('gridcell', { name: 'xyz', exact: true })).toHaveCount(0);
	await expect.poll(async () => (await grid(page).locator('[data-slc-table-datacell][data-col="2"]').allTextContents()).sort()).toEqual(ids.sort());

	// temizlik
	await deleteFirstRow(page);
	await expect(grid(page).locator('[role="row"][aria-selected]')).toHaveCount(1);
	await deleteFirstRow(page);
	await expect(grid(page).locator('[role="row"][aria-selected]')).toHaveCount(0);
});

// ---------------------------------------------------------------- olaylar: onLoad, onKeyDown, onContextMenu, aralık özeti, rowClass
test('aralık özeti alt barda: hücre sayısı, toplam, ortalama', async ({ page }) => {
	await openTable(page);
	await cell(page, 0, 5).click(); // number_optional
	await page.keyboard.press('Shift+ArrowDown');
	await page.keyboard.press('Shift+ArrowDown');
	const summary = page.locator('.slc-table-range-info');
	await expect(summary).toContainText('3 hücre');
	await expect(summary).toContainText('Toplam:');
	await expect(summary).toContainText('Ort.:');
	await page.keyboard.press('Escape');
	await expect(summary).toHaveCount(0);
});

test('onLoad: yeni sorgu boş dönerse bilgi verilir', async ({ page }) => {
	await openTable(page);
	const search = page.getByRole('textbox', { name: 'Metin (İsteğe Bağlı)', exact: true });
	await search.fill(`yok-${Date.now()}`);
	await search.press('Enter');
	await expect(page.locator('h3', { hasText: 'Gösterilecek veri yok.' })).toBeVisible();
});

test('onKeyDown ile Delete toplu siler, sağ tık menüsü ve rowClass çalışır', async ({ page, context }) => {
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	await openTable(page);
	const stamp = `seed-e2e-${Date.now().toString(36)}`;
	for (const n of [1, 2, 3]) await createRecord(page, `${stamp}-${n}`);
	const search = page.getByRole('textbox', { name: 'Metin (İsteğe Bağlı)', exact: true });
	await search.fill(stamp);
	await search.press('Enter');
	const rows = grid(page).locator('[role="row"][aria-selected]');
	await expect(rows).toHaveCount(3);

	// rowClass: bool_optional işaretli satır kalın
	await cell(page, 0, 10).click();
	await page.keyboard.press('Enter');
	await expect(cell(page, 0, 3)).toHaveClass(/font-semibold/);
	await expect(cell(page, 1, 3)).not.toHaveClass(/font-semibold/);

	// Sağ tık menüsü → Kopyala
	await cell(page, 0, 3).click({ button: 'right' });
	const menu = page.getByRole('menu');
	await expect(menu).toBeVisible();
	await menu.getByRole('menuitem', { name: 'Kopyala' }).click();
	await expect(menu).toHaveCount(0);
	await expect(page.getByText('1 hücre panoya kopyalandı.')).toBeVisible();
	await expect(grid(page)).toBeFocused();

	// İki satırı seç, Delete → onay → ikisi silinir
	await cell(page, 0, 0).click();
	await cell(page, 1, 0).click();
	await cell(page, 0, 3).click();
	await page.keyboard.press('Delete');
	await expect(page.getByText('2 seçili')).toBeVisible();
	await page.locator('dialog[open]').getByRole('button', { name: 'Sil' }).click();
	await expect(page.getByText('2 kayıt silindi.')).toBeVisible();
	await expect(rows).toHaveCount(1);
	await expect(page.getByText(/\d+ seçili/)).toHaveCount(0); // silinenler seçimden çıkarıldı (table.helpers.deselect)

	// Kalan satır: sağ tık → Sil
	await cell(page, 0, 3).click({ button: 'right' });
	await page.getByRole('menu').getByRole('menuitem', { name: /Sil/ }).click();
	await page.locator('dialog[open]').getByRole('button', { name: 'Sil' }).click();
	await expect(rows).toHaveCount(0);
});

test('sağ tık menüsü: klavyeyle açılır, oklarla gezinilir, Esc ve kaydırma kapatır, odak tabloya döner', async ({ page }) => {
	await openTable(page);
	const menu = page.getByRole('menu');
	await cell(page, 2, 3).click();

	await page.keyboard.press('Shift+F10');
	await expect(menu).toBeVisible();
	const items = menu.getByRole('menuitem');
	await expect(items.first()).toBeFocused();
	await page.keyboard.press('ArrowDown');
	await expect(items.nth(1)).toBeFocused();
	await page.keyboard.press('ArrowUp');
	await page.keyboard.press('ArrowUp'); // baştan sona döner
	await expect(items.last()).toBeFocused();

	await page.keyboard.press('Escape');
	await expect(menu).toHaveCount(0);
	await expect(grid(page)).toBeFocused();
	await expect(activeCell(page)).toHaveAttribute('data-row', '2');

	// Sağ tık ile açılır, tablo kaydırılınca kapanır
	await cell(page, 1, 3).click({ button: 'right' });
	await expect(menu).toBeVisible();
	await grid(page).evaluate((el) => (el.scrollTop = 200));
	await expect(menu).toHaveCount(0);
});

// ---------------------------------------------------------------- çoklu seçim (Ctrl/⌘)
test('Ctrl + tıklama/sürükleme hücre ekler; özet, kopyalama ve satır seçimi', async ({ page, context }) => {
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	await openTable(page);
	const summary = page.locator('.slc-table-range-info');

	// Ctrl+tıklama: iki ayrı hücre seçili (önceki aktif hücre de seçime girer); satır seçimi değişmez
	await cell(page, 0, 5).click();
	await cell(page, 2, 5).click({ modifiers: ['Control'] });
	await expect(rangeCells(page)).toHaveCount(2);
	await expect(summary).toContainText('2 hücre');
	await expect(grid(page).locator('[role="row"][aria-selected="true"]')).toHaveCount(0);

	// Seçili hücreye Ctrl+tıklama: çıkarmaz, yalnızca aktif yapar
	await cell(page, 0, 5).click({ modifiers: ['Control'] });
	await expect(rangeCells(page)).toHaveCount(2);
	await expect(activeCell(page)).toHaveAttribute('data-row', '0');

	// Ctrl+sürükleme yeni alan ekler; Shift son alanı genişletir
	const from = await cell(page, 4, 5).boundingBox();
	const to = await cell(page, 5, 5).boundingBox();
	await page.keyboard.down('Control');
	await page.mouse.move(from!.x + 5, from!.y + 5);
	await page.mouse.down();
	await page.mouse.move(to!.x + 5, to!.y + 5, { steps: 4 });
	await page.mouse.up();
	await page.keyboard.up('Control');
	await expect(rangeCells(page)).toHaveCount(4);
	await page.keyboard.press('Shift+ArrowDown');
	await expect(rangeCells(page)).toHaveCount(5);

	// Aynı kolondaki alanlar alt alta kopyalanır (satır sırasıyla)
	await page.keyboard.press('Control+c');
	await expect(page.getByText('5 hücre panoya kopyalandı.')).toBeVisible();
	const lines = (await page.evaluate(() => navigator.clipboard.readText())).split('\n');
	expect(lines).toHaveLength(5);
	expect(lines[0]).toBe(((await cell(page, 0, 5).textContent()) ?? '').trim().replace('.', '').replace(',', '.'));

	// Farklı kolon ve satırlar: yalnızca son alan kopyalanır, uyarı verilir
	await cell(page, 0, 3).click();
	await cell(page, 2, 5).click({ modifiers: ['Control'] });
	await page.keyboard.press('Control+c');
	await expect(page.getByText('yalnızca son alan (1 hücre) kopyalandı', { exact: false })).toBeVisible();

	// Esc hepsini kapatır
	await page.keyboard.press('Escape');
	await expect(rangeCells(page)).toHaveCount(0);
});

// ---------------------------------------------------------------- satır geri dönüşümü
const nextFrames = (page: Page, n = 3) =>
	page.evaluate(
		(n) =>
			new Promise<void>((res) => {
				let i = 0;
				const f = () => (++i >= n ? res() : requestAnimationFrame(f));
				requestAnimationFrame(f);
			}),
		n
	);

async function openPerPage(page: Page, perPage: number) {
	await openTable(page);
	await page.getByRole('button', { name: /sayfa/i }).last().click();
	await page.getByRole('menuitemradio', { name: String(perPage) }).click();
	await expect.poll(() => grid(page).evaluate((el) => Number(el.getAttribute('aria-rowcount')))).toBeGreaterThan(100);
}

// Görünen hücreler: data-row → [metin|grid satırı] (sütun sırasıyla); satırın aria-rowindex'i grid satırıyla aynı olmalı
const renderedRows = (page: Page) =>
	grid(page).evaluate((el) => {
		const rows: Record<string, string[]> = {};
		for (const c of el.querySelectorAll<HTMLElement>('[data-slc-table-datacell]')) {
			const gridRow = c.style.gridRowStart;
			if (c.closest('[role=row]')!.getAttribute('aria-rowindex') !== gridRow) throw new Error(`aria-rowindex ≠ ${gridRow}`);
			(rows[c.dataset.row!] ??= [])[Number(c.dataset.col)] = `${(c.textContent ?? '').trim()}|${gridRow}`;
		}
		return rows;
	});

test('sanal kaydırma satırları yeniden kullanır: düğüm oluşturmaz, içerik doğru, aktif satır korunur', async ({ page }) => {
	await openPerPage(page, 500);
	await grid(page).evaluate((el) => {
		const w = window as unknown as { __added: number };
		w.__added = 0;
		new MutationObserver((ms) => {
			for (const m of ms) for (const n of m.addedNodes) if (n instanceof Element) w.__added += 1 + n.querySelectorAll('*').length;
		}).observe(el, { childList: true, subtree: true });
	});

	// Aktif hücre: kaydırınca pencereden çıkar (sabitlenir), dönünce aynı DOM düğümü olmalı
	await cell(page, 2, 3).click();
	await cell(page, 2, 3).evaluate((el) => el.setAttribute('data-mark', ''));

	const max = await grid(page).evaluate((el) => el.scrollHeight - el.clientHeight);
	for (let y = 0; y <= max; y += Math.ceil(max / 40)) {
		await grid(page).evaluate((el, y) => (el.scrollTop = y), y);
		await nextFrames(page, 2);
	}
	// Yalnızca aktif satır pencereden çıkarken, aynı yuvaya düşen satır bir kez ('spare') kurulur: en fazla bir satırlık düğüm
	const rowNodes = await grid(page).evaluate((el) => {
		const row = el.querySelector('[data-slc-table-datarow]')!;
		return row.querySelectorAll('*').length + 1;
	});
	expect(await page.evaluate(() => (window as unknown as { __added: number }).__added)).toBeLessThanOrEqual(rowNodes);

	// Kaydırarak gelinen içerik = doğrudan o konumda açılan içerik
	const mid = Math.floor(max / 2);
	await grid(page).evaluate((el, y) => (el.scrollTop = y), mid);
	await nextFrames(page);
	const viaScroll = await renderedRows(page);

	await grid(page).evaluate((el) => (el.scrollTop = 0));
	await nextFrames(page);
	await expect(cell(page, 2, 3)).toHaveAttribute('data-mark', '');
	await expect(grid(page)).toBeFocused();

	await openPerPage(page, 500);
	await grid(page).evaluate((el, y) => (el.scrollTop = y), mid);
	await nextFrames(page);
	const direct = await renderedRows(page);
	expect(Object.keys(direct).length).toBeGreaterThan(10);
	// Kaydırarak gelinen görünümde ayrıca sabitlenen aktif satır (2) vardır; ortak satırlar aynı olmalı
	expect(Object.fromEntries(Object.keys(direct).map((r) => [r, viaScroll[r]]))).toEqual(direct);
});

// ---------------------------------------------------------------- footer kısayolları ve fonksiyon
test('footer: sum(2), avg(2), max(), count() ve fonksiyon yüklü satırlardan hesaplanır', async ({ page, context }) => {
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	await openTable(page);
	const stamp = `seed-e2e-${Date.now().toString(36)}`;
	await createRecord(page, `${stamp}-1`);
	await createRecord(page, `${stamp}-2`);
	const search = page.getByRole('textbox', { name: 'Metin (İsteğe Bağlı)', exact: true });
	await search.fill(stamp);
	await search.press('Enter');
	const rows = grid(page).locator('[role="row"][aria-selected]');
	await expect(rows).toHaveCount(2);

	// Footer hücresi: satır × görünür kolon sırasıyla
	const colCount = Number(await grid(page).getAttribute('aria-colcount'));
	const footer = (row: number, col: number) =>
		grid(page)
			.locator('[data-slc-table-footercell]')
			.nth(row * colCount + col);

	// Sayıları yapıştır: 10 ve 20,5
	await cell(page, 0, 5).click();
	await page.evaluate(() => navigator.clipboard.writeText('10\n20,5'));
	await page.keyboard.press('Control+v');
	await expect(cell(page, 1, 5)).toHaveText('20,5');

	await expect(footer(0, 4)).toHaveText('Toplam'); // metin olduğu gibi
	await expect(footer(0, 5)).toHaveText('30,50'); // sum(2)
	await expect(footer(1, 5)).toHaveText('15,25'); // avg(2)
	await expect(footer(2, 5)).toHaveText('20,5'); // max(): en fazla 2 basamak, sondaki sıfır yok
	await expect(footer(0, 8)).toHaveText('0'); // count(): boş tarih sayılmaz
	await expect(footer(1, 10)).toHaveText('0 ✓'); // fonksiyon
	await expect(footer(0, 5)).toHaveAttribute('title', 'Bu sayfadaki 2 kayıttan hesaplandı');

	// Veri değişince footer güncellenir (bool işaretle → fonksiyon 1 ✓)
	await cell(page, 0, 10).click();
	await page.keyboard.press('Enter');
	await expect(footer(1, 10)).toHaveText('1 ✓');

	// temizlik
	await deleteFirstRow(page);
	await expect(rows).toHaveCount(1);
	await deleteFirstRow(page);
	await expect(rows).toHaveCount(0);
});

// ---------------------------------------------------------------- görünüm: dar kolonlar
test('dar kolon: ortalı başlık taşmaz, tutamak görünür kalır; footer metni … ile kısalır', async ({ page }) => {
	await openTable(page);
	await page.evaluate(() => localStorage.clear()); // önceki testlerin kayıtlı genişlikleri karışmasın
	await page.reload();
	await expect(cell(page, 0, 10)).toBeVisible();

	// bool_optional (ortalı, sıralanabilir) başlığını en dara sürükle
	const header = grid(page).locator('[role="columnheader"]').nth(10);
	const handle = header.locator('.slc-table-resizer');
	await header.hover();
	const box = (await handle.boundingBox())!;
	await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
	await page.mouse.down();
	await page.mouse.move(box.x - 300, box.y + box.height / 2, { steps: 8 });
	await page.mouse.up();

	const headerBox = (await header.boundingBox())!;
	const cellBox = (await cell(page, 0, 10).boundingBox())!;
	expect(Math.round(headerBox.width)).toBe(50); // en küçük genişlik
	expect(Math.abs(headerBox.width - cellBox.width)).toBeLessThan(1); // başlık kolonun dışına taşmıyor
	await header.hover();
	const handleBox = (await handle.boundingBox())!;
	expect(handleBox.x + handleBox.width).toBeLessThanOrEqual(headerBox.x + headerBox.width + 0.5); // tutamak hücrenin içinde
	await expect(handle).toBeInViewport();

	// Footer: 'Ortalama' dar text_optional kolonunda … ile kısalır
	const colCount = Number(await grid(page).getAttribute('aria-colcount'));
	const footerText = grid(page)
		.locator('[data-slc-table-footercell]')
		.nth(colCount + 4)
		.locator('.slc-table-footer-text');
	await expect(footerText).toHaveText('Ortalama');
	const truncated = await footerText.evaluate((el) => el.scrollWidth > el.clientWidth && getComputedStyle(el).textOverflow === 'ellipsis');
	expect(truncated).toBe(true);

	await page.evaluate(() => localStorage.clear()); // genişlik ayarını geri al
});

test.describe('dar ekran', () => {
	test.use({ viewport: { width: 1100, height: 720 } });
	test('alt bar: aralık özeti seçim bilgisinin arkasında kalmaz, … ile kısalır', async ({ page }) => {
		await openTable(page);
		await grid(page).locator('[role="columnheader"]').nth(0).locator('input').click(); // sayfadaki satırları seç
		await cell(page, 0, 3).click();
		await page.keyboard.press('Shift+End');
		await page.keyboard.press('Shift+PageDown');
		const info = page.locator('.slc-table-range-info');
		await expect(info).toBeVisible();
		await expect(page.locator('.slc-table-selected')).toContainText('seçili');

		const clear = (await page.locator('.slc-table-clear').boundingBox())!;
		const wrap = (await page.locator('.slc-table-range-info-wrap').boundingBox())!;
		expect(wrap.x).toBeGreaterThanOrEqual(clear.x + clear.width); // özet seçim bilgisinden sonra, üstüne binmiyor
		const truncated = await info.evaluate(
			(el) => el.scrollWidth > el.clientWidth && getComputedStyle(el).textOverflow === 'ellipsis' && getComputedStyle(el).display === 'block'
		);
		expect(truncated).toBe(true);
		await expect(info).toHaveAttribute('title', /hücre · Toplam:/); // tam metin title'da

		await page.keyboard.press('Escape');
		await page.keyboard.press('Escape');
	});
});

// ---------------------------------------------------------------- çoklu sıralama (Ctrl/⌘ + başlık)
// Düz tıklamayla kolonu tek başına (çoklu sıralama olmadan) istenen yöne getirir: varsayılan sıralamadan bağımsız.
// Düz tıklama yalnızca o kolona göre sıralar; döngü: yok → artan → azalan → yok. Çoklu sıralamada öncelik numaraları görünür.
async function sortOnly(header: Locator, dir: 'ascending' | 'descending', idle: () => Promise<void>) {
	const multi = header.page().getByRole('grid').locator('.slc-table-sort-index');
	for (let i = 0; i < 4 && ((await header.getAttribute('aria-sort')) !== dir || (await multi.count()) > 0); i++) {
		await header.click();
		await idle();
	}
	await expect(header).toHaveAttribute('aria-sort', dir);
	await expect(multi).toHaveCount(0);
}

test('başlıkta Ctrl + tıklama çoklu sıralar; PocketBase iki alana göre sıralar', async ({ page }) => {
	await openTable(page);
	const header = (col: number) => grid(page).locator('[role="columnheader"]').nth(col);
	const idle = () => expect(grid(page).locator('.slc-table-headercell-busy')).toHaveCount(0); // istek sürerken sıralama kilitli
	const sortIndex = (col: number) => header(col).locator('.slc-table-sort-index');

	// Varsayılan sıralama (TABLE.defaultSort, ne olursa olsun) başlıkta görünür: birincil kolonda aria-sort
	await expect(grid(page).locator('[role="columnheader"][aria-sort="ascending"], [role="columnheader"][aria-sort="descending"]')).toHaveCount(1);

	// Düz tıklama yalnızca o kolona göre sıralar (yok → artan → azalan): number_optional azalan olana kadar
	await sortOnly(header(5), 'descending', idle);
	await expect(header(3)).toHaveAttribute('aria-sort', 'none');
	await expect(sortIndex(5)).toHaveCount(0); // tek kolon → öncelik numarası yok

	// Ctrl + tıklama: text_required ikinci sıralama olarak eklenir
	await header(3).click({ modifiers: ['Control'] });
	await idle();
	await expect(sortIndex(5)).toHaveText('1');
	await expect(sortIndex(3)).toHaveText('2');
	await expect(header(3)).toHaveAttribute('title', '2. sıralama, artan');
	await expect(header(3)).not.toHaveAttribute('aria-sort'); // aria-sort yalnızca birincil kolonda
	await expect(header(5)).toHaveAttribute('aria-sort', 'descending');

	// Sunucu birincil alana göre sıraladı: number_optional azalan (boşlar sonda)
	const numbers = await grid(page)
		.locator('[data-slc-table-datacell][data-col="5"]')
		.evaluateAll((cells) =>
			cells
				.map((c) => ({ row: Number((c as HTMLElement).dataset.row), text: (c.textContent ?? '').trim() }))
				.sort((a, b) => a.row - b.row)
				.map((c) => c.text)
		);
	const values = numbers.filter((t) => t !== '—').map((t) => Number(t.replace(/\./g, '').replace(',', '.')));
	expect(values.length).toBeGreaterThan(3);
	expect(values).toEqual([...values].sort((a, b) => b - a));

	// Ctrl + tıklama: ikincil azalana döner, sonra sıralamadan çıkar
	await header(3).click({ modifiers: ['Control'] });
	await idle();
	await expect(header(3)).toHaveAttribute('title', '2. sıralama, azalan');
	await header(3).click({ modifiers: ['Control'] });
	await idle();
	await expect(sortIndex(5)).toHaveCount(0); // tek kolon kaldı
	await expect(header(3)).toHaveAttribute('aria-sort', 'none');

	// Düz tıklama diğerlerini bırakır
	await header(3).click({ modifiers: ['Control'] });
	await idle();
	await header(4).click();
	await idle();
	await expect(header(4)).toHaveAttribute('aria-sort', 'ascending');
	await expect(header(5)).toHaveAttribute('aria-sort', 'none');
	await expect(grid(page).locator('.slc-table-sort-index')).toHaveCount(0);
});
