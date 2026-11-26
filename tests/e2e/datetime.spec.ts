import { test, expect, type Page } from '@playwright/test';

// Tarih-saat: gerçek an, uygulama saat diliminde (config.timezone = Europe/Istanbul, UTC+3) girilir ve gösterilir.
// Tarayıcı bilerek New York saatinde: sonuçlar tarayıcıya değil uygulama saat dilimine göre olmalı.
// Tarih (date): takvim günü, her yerde aynı gün.
test.use({ timezoneId: 'America/New_York' });

const URL = '/app/grapes/crud/simple';
const grid = (page: Page) => page.getByRole('grid');
const rows = (page: Page) => grid(page).locator('[role="row"][aria-selected]');
const cell = (page: Page, row: number, col: number) => grid(page).locator(`[data-slc-table-datacell][data-row="${row}"][data-col="${col}"]`);
const drawer = (page: Page) => page.locator('dialog[open]').filter({ has: page.getByLabel('text_required', { exact: true }) });
const COL = { date: 8, datetime: 9 };

async function search(page: Page, stamp: string, count: number) {
	const box = page.getByRole('textbox', { name: 'Metin (Gerekli)', exact: true });
	await box.fill(stamp);
	await box.press('Enter');
	await expect(rows(page)).toHaveCount(count);
}

// Tarih-saat filtresi: uygulama saat diliminde 'YYYY-MM-DDTHH:mm' (bitiş dakikası dahil)
async function applyRange(page: Page, from: string, to: string) {
	await page.getByRole('button', { name: /Filtreler|Uygulanan filtre/ }).click();
	const panel = page.getByRole('group', { name: 'Filtreler' });
	await panel.getByLabel('Tarih-saat · Başlangıç').fill(from);
	await panel.getByLabel('Tarih-saat · Bitiş').fill(to);
	await panel.getByRole('button', { name: 'Ara' }).click();
}
const applyDay = (page: Page, day: string) => applyRange(page, `${day}T00:00`, `${day}T23:59`);

test('tarih-saat uygulama saat diliminde; tarih her yerde aynı gün; filtre uygulama saat diliminde (gün ve saat)', async ({ page }) => {
	const stamp = `seed-e2e-${Date.now().toString(36)}`;
	await page.goto(URL);
	await expect(cell(page, 0, 3)).toBeVisible();

	// İstanbul 2 Eylül 02:00 = UTC 1 Eylül 23:00 = New York 1 Eylül 19:00
	await page.getByRole('button', { name: 'Oluştur' }).first().click();
	const form = drawer(page);
	await form.getByLabel('text_required').fill(stamp);
	await form.getByLabel('date_optional').fill('2026-09-09');
	await form.getByLabel('datetime_optional').fill('2026-09-02T02:00');
	await form.getByRole('button', { name: 'Oluştur' }).click();
	await expect(page).not.toHaveURL(/cmd=create/);

	await search(page, stamp, 1);
	await expect(cell(page, 0, COL.datetime)).toHaveText('2.09.2026 02:00');
	await expect(cell(page, 0, COL.date)).toHaveText('09.09.2026');

	// Güncelleme formu aynı duvar saatini gösterir
	await cell(page, 0, 1).getByRole('button', { name: 'Güncelle' }).click();
	await expect(drawer(page).getByLabel('datetime_optional')).toHaveValue('2026-09-02T02:00');
	await expect(drawer(page).getByLabel('date_optional')).toHaveValue('2026-09-09');
	// Ham değer: kayıt görünümünde değil, PocketBase'de UTC; görüntüleme çekmecesi biçimlenmiş gösterir
	await drawer(page).getByRole('button', { name: 'Kapat' }).first().click();
	await expect(page).not.toHaveURL(/cmd=update/);

	// Gün filtresi: İstanbul'da 2 Eylül → bulunur; 1 Eylül (UTC günü) → bulunmaz
	await applyDay(page, '2026-09-01');
	await expect(rows(page)).toHaveCount(0);
	await applyDay(page, '2026-09-02');
	await expect(rows(page)).toHaveCount(1);
	// Saat sınırları: başlangıç dakikası dahil, bitiş dakikası dahil
	await applyRange(page, '2026-09-02T02:00', '2026-09-02T02:00');
	await expect(rows(page)).toHaveCount(1);
	await applyRange(page, '2026-09-02T02:01', '2026-09-02T03:00');
	await expect(rows(page)).toHaveCount(0);
	await applyRange(page, '2026-09-02T01:00', '2026-09-02T01:59');
	await expect(rows(page)).toHaveCount(0);
	await page.getByRole('button', { name: 'Temizle' }).first().click();

	// Hücre düzenleme de uygulama saat diliminde: 23:30 → aynı gün 23:30 görünür, filtre 2 Eylül'de bulur
	await search(page, stamp, 1);
	await cell(page, 0, COL.datetime).click();
	await page.keyboard.press('F2');
	const editor = grid(page).locator('input[type="datetime-local"]');
	await expect(editor).toHaveValue('2026-09-02T02:00');
	await editor.fill('2026-09-02T23:30');
	await page.keyboard.press('Enter');
	await expect(cell(page, 0, COL.datetime)).toHaveText('2.09.2026 23:30');
	await page.reload();
	await search(page, stamp, 1);
	await expect(cell(page, 0, COL.datetime)).toHaveText('2.09.2026 23:30');
	await applyDay(page, '2026-09-02');
	await expect(rows(page)).toHaveCount(1);
	await applyDay(page, '2026-09-03'); // UTC'de 2 Eylül 20:30 → 3 Eylül'de yok
	await expect(rows(page)).toHaveCount(0);
	await page.getByRole('button', { name: 'Temizle' }).first().click();

	// Temizlik
	await search(page, stamp, 1);
	await cell(page, 0, 3).click();
	await page.keyboard.press('Delete');
	await page.locator('dialog[open]').getByRole('button', { name: 'Sil' }).click();
	await expect(rows(page)).toHaveCount(0);
});
