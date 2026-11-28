/// <reference types="node" /> // Buffer (setInputFiles)
import { test, expect, type Page, type Locator } from '@playwright/test';

// form_inputs (ve altındaki inputs) uçtan uca: Simple CRUD çekmecesi tüm alan türlerini kullanır.
// Erişilebilir adlar, ilk açılış, doğrulama, kaydet → güncelleme formunda geri okuma, sıfırlama, değişiklik takibi,
// dosya ekle/sil/geri al. Testler kendi kayıtlarını ('seed-e2e-…') oluşturur ve siler.
const URL = '/app/grapes/crud/simple';
const grid = (page: Page) => page.getByRole('grid');
const rows = (page: Page) => grid(page).locator('[role="row"][aria-selected]');
const cell = (page: Page, row: number, col: number) => grid(page).locator(`[data-slc-table-datacell][data-row="${row}"][data-col="${col}"]`);
// Çekmece (Relation seçicisi de ayrı bir <dialog> açar)
const drawer = (page: Page) => page.locator('dialog[open]').filter({ has: page.getByLabel('Metin (Gerekli)', { exact: true }) });
const textFilter = (page: Page) => page.getByRole('textbox', { name: 'Metin (Gerekli)', exact: true });

const LABELS = [
	'Metin (Gerekli)',
	'Metin (İsteğe Bağlı)',
	'Seçim (Çoklu)',
	'Seçim (Tekli)',
	'İlişki (Çoklu)',
	'İlişki (Tekli)',
	'E-posta',
	'Sayı',
	'Uzun Metin',
	'Bağlantı (URL)',
	'Tarih',
	'Tarih-saat',
	'Dosya (Tekli)',
	'Dosya (Çoklu)',
	'Onay'
];

async function openCreate(page: Page) {
	await page.goto(URL);
	await expect(cell(page, 0, 3)).toBeVisible();
	await page.getByRole('button', { name: 'Oluştur' }).first().click();
	await expect(drawer(page).getByLabel('Metin (Gerekli)')).toBeVisible();
	return drawer(page);
}

async function pickOption(page: Page, combobox: Locator, name: string) {
	await combobox.click();
	await page.getByRole('option', { name, exact: true }).click();
}

const fileInput = (form: Locator, index: number) => form.locator('input[type=file]').nth(index); // 0: tekli, 1: çoklu
// Dosya listesindeki ad (gizli <select> seçenekleri hariç)
const fileName = (form: Locator, name: string | RegExp) => form.locator('output').getByText(name);
const file = (name: string, mimeType = 'text/plain') => ({ name, mimeType, buffer: Buffer.from(`içerik: ${name}`) });

async function searchStamp(page: Page, stamp: string, count: number) {
	await textFilter(page).fill(stamp);
	await textFilter(page).press('Enter');
	await expect(rows(page)).toHaveCount(count);
}

async function openUpdate(page: Page) {
	await cell(page, 0, 1).getByRole('button', { name: 'Güncelle' }).click(); // işlemler kolonu
	await expect(page).toHaveURL(/cmd=update/);
	const form = drawer(page);
	await expect(form.getByLabel('Metin (Gerekli)')).not.toHaveValue('', { timeout: 10000 });
	return form;
}

async function cleanup(page: Page, stamp: string) {
	await page.goto(URL);
	await searchStamp(page, stamp, 1);
	await cell(page, 0, 3).click();
	await page.keyboard.press('Delete');
	await page.locator('dialog[open]').getByRole('button', { name: 'Sil' }).click();
	await expect(rows(page)).toHaveCount(0);
}

test('her alanın erişilebilir adı etiketinden gelir; ilk açılışta hata gösterilmez', async ({ page }) => {
	const form = await openCreate(page);
	for (const label of LABELS) {
		await expect(form.getByLabel(label, { exact: true }), label).toHaveCount(1);
	}
	// Seçim kutuları (combobox) adını alan etiketinden alır, seçili değerden değil
	await expect(form.getByRole('combobox', { name: 'Seçim (Tekli)', exact: true })).toBeVisible();
	await expect(form.getByRole('combobox', { name: 'Seçim (Çoklu)', exact: true })).toBeVisible();
	// Yalnızca ikonlu kapat düğmesinin adı var
	await expect(form.getByRole('button', { name: 'Kapat' })).toHaveCount(2);
	// Açılışta hata yok; gönder düğmesi etkin, sıfırla pasif (değişiklik yok)
	await expect(form.getByText('Bu alan gereklidir.')).toHaveCount(0);
	await expect(form.locator('[aria-invalid="true"]')).toHaveCount(0);
	await expect(form.getByRole('button', { name: 'Sıfırla' })).toBeDisabled();
});

test('doğrulama: zorunlu alan, e-posta ve url biçimi; hatalı form gönderilmez', async ({ page }) => {
	const form = await openCreate(page);
	await form.getByRole('button', { name: 'Oluştur' }).click();
	await expect(form.getByLabel('Metin (Gerekli)')).toHaveAttribute('aria-invalid', 'true');
	// Mesaj ekran okuyucuya duyurulan bölgede (role=status)
	await expect(form.getByRole('status').filter({ hasText: 'Bu alan gereklidir.' })).toHaveCount(1);
	await expect(page).toHaveURL(/cmd=create/); // çekmece açık kaldı

	await form.getByLabel('Metin (Gerekli)').fill('x');
	await expect(form.getByLabel('Metin (Gerekli)')).not.toHaveAttribute('aria-invalid', 'true');
	await form.getByLabel('E-posta').fill('gecersiz');
	await form.getByLabel('Bağlantı (URL)').fill('gecersiz');
	await form.getByRole('button', { name: 'Oluştur' }).click();
	await expect(form.getByLabel('E-posta')).toHaveAttribute('aria-invalid', 'true');
	await expect(form.getByLabel('Bağlantı (URL)')).toHaveAttribute('aria-invalid', 'true');
	await expect(page).toHaveURL(/cmd=create/);

	// Düzeltince hata kalkar
	await form.getByLabel('E-posta').fill('a@b.co');
	await form.getByLabel('Bağlantı (URL)').fill('https://example.com');
	await expect(form.getByLabel('E-posta')).not.toHaveAttribute('aria-invalid', 'true');
	await expect(form.getByLabel('Bağlantı (URL)')).not.toHaveAttribute('aria-invalid', 'true');
});

test('tüm alanlar kaydedilir ve güncelleme formunda geri okunur; sıfırla ve değişiklik takibi', async ({ page }) => {
	const stamp = `seed-e2e-${Date.now().toString(36)}`;
	const form = await openCreate(page);

	await form.getByLabel('Metin (Gerekli)').fill(stamp);
	await form.getByLabel('Metin (İsteğe Bağlı)').fill('isteğe bağlı');
	await form.getByLabel('Uzun Metin').fill('satır 1\nsatır 2');
	await form.getByLabel('E-posta').fill('test@example.com');
	await form.getByLabel('Bağlantı (URL)').fill('https://example.com/a');
	await form.getByLabel('Sayı').fill('12.5');
	await form.getByLabel('Tarih', { exact: true }).fill('2026-03-04');
	await form.getByLabel('Tarih-saat').fill('2026-03-04T05:06');
	await form.getByLabel('Onay').click();
	await expect(form.getByLabel('Onay')).toHaveAttribute('aria-checked', 'true');

	const single = form.getByRole('combobox', { name: 'Seçim (Tekli)' });
	const multiple = form.getByRole('combobox', { name: 'Seçim (Çoklu)' });
	const singleValue = (await single.click(), await page.getByRole('option').nth(1).textContent())!.trim();
	await page.getByRole('option').nth(1).click();
	await expect(single).toHaveText(singleValue);
	await multiple.click();
	const multiValues = [(await page.getByRole('option').nth(0).textContent())!.trim(), (await page.getByRole('option').nth(1).textContent())!.trim()];
	await page.getByRole('option').nth(0).click();
	await page.getByRole('option').nth(1).click();
	await page.keyboard.press('Escape');
	await expect(multiple).toContainText('(2)');

	await fileInput(form, 0).setInputFiles(file('tekli.txt'));
	await fileInput(form, 1).setInputFiles([file('coklu-1.txt'), file('coklu-2.txt')]);
	await expect(fileName(form, 'tekli.txt')).toBeVisible();
	await expect(fileName(form, 'coklu-2.txt')).toBeVisible();

	await form.getByRole('button', { name: 'Oluştur' }).click();
	await expect(page).not.toHaveURL(/cmd=create/);

	// Güncelleme formu: değerler geri okunur
	await searchStamp(page, stamp, 1);
	const upd = await openUpdate(page);
	await expect(upd.getByLabel('Metin (Gerekli)')).toHaveValue(stamp);
	await expect(upd.getByLabel('Metin (İsteğe Bağlı)')).toHaveValue('isteğe bağlı');
	await expect(upd.getByLabel('Uzun Metin')).toHaveValue('satır 1\nsatır 2');
	await expect(upd.getByLabel('E-posta')).toHaveValue('test@example.com');
	await expect(upd.getByLabel('Bağlantı (URL)')).toHaveValue('https://example.com/a');
	await expect(upd.getByLabel('Sayı')).toHaveValue('12.5');
	await expect(upd.getByLabel('Tarih', { exact: true })).toHaveValue('2026-03-04');
	await expect(upd.getByLabel('Tarih-saat')).toHaveValue('2026-03-04T05:06');
	await expect(upd.getByLabel('Onay')).toHaveAttribute('aria-checked', 'true');
	await expect(upd.getByRole('combobox', { name: 'Seçim (Tekli)' })).toHaveText(singleValue);
	await expect(upd.getByRole('combobox', { name: 'Seçim (Çoklu)' })).toHaveText(`(2) ${multiValues.join(', ')}`);
	// PocketBase dosya adına sonek ekler: tekli_abc123.txt
	await expect(fileName(upd, /^tekli.*\.txt$/)).toBeVisible();
	await expect(fileName(upd, /^coklu_1_.*\.txt$/)).toBeVisible();
	await expect(fileName(upd, /^coklu_2_.*\.txt$/)).toBeVisible();

	// Değişiklik yok → Güncelle ve Sıfırla pasif
	const updateButton = upd.getByRole('button', { name: 'Güncelle' });
	const resetButton = upd.getByRole('button', { name: 'Sıfırla' });
	await expect(updateButton).toBeDisabled();
	await expect(resetButton).toBeDisabled();

	// Değiştir → etkin; ilk değere geri yazınca tekrar pasif
	await upd.getByLabel('Metin (İsteğe Bağlı)').fill('değişti');
	await expect(updateButton).toBeEnabled();
	await upd.getByLabel('Metin (İsteğe Bağlı)').fill('isteğe bağlı');
	await expect(updateButton).toBeDisabled();

	// Sıfırla: özel bileşenler dahil ilk değerlere döner
	await upd.getByLabel('Metin (İsteğe Bağlı)').fill('değişti');
	await upd.getByLabel('Onay').click();
	await pickOption(page, upd.getByRole('combobox', { name: 'Seçim (Tekli)' }), '-- Seçiniz --');
	await upd.getByRole('button', { name: /tekli.*\.txt dosyasını kaldır/i }).click();
	await expect(resetButton).toBeEnabled();
	await resetButton.click();
	await expect(upd.getByLabel('Metin (İsteğe Bağlı)')).toHaveValue('isteğe bağlı');
	await expect(upd.getByLabel('Onay')).toHaveAttribute('aria-checked', 'true');
	await expect(upd.getByRole('combobox', { name: 'Seçim (Tekli)' })).toHaveText(singleValue);
	await expect(upd.getByRole('button', { name: /tekli.*\.txt dosyasını kaldır/i })).toBeVisible();
	await expect(updateButton).toBeDisabled();

	// Dosya: kaldır → geri al; kaldır + kaydet → silinir
	await upd.getByRole('button', { name: /coklu_1_.*\.txt dosyasını kaldır/i }).click();
	await expect(upd.getByRole('button', { name: /coklu_1_.*\.txt dosyasını geri al/i })).toBeVisible();
	await upd.getByRole('button', { name: /coklu_1_.*\.txt dosyasını geri al/i }).click();
	await expect(updateButton).toBeDisabled();
	await upd.getByRole('button', { name: /coklu_1_.*\.txt dosyasını kaldır/i }).click();
	await upd.getByLabel('Onay').click();
	await updateButton.click();
	await expect(page).not.toHaveURL(/cmd=update/);

	const again = await openUpdate(page);
	await expect(fileName(again, /^coklu_1_.*\.txt$/)).toHaveCount(0);
	await expect(fileName(again, /^coklu_2_.*\.txt$/)).toBeVisible();
	await expect(again.getByLabel('Onay')).toHaveAttribute('aria-checked', 'false');
	await again.getByRole('button', { name: 'Kapat' }).first().click();
	await expect(page).not.toHaveURL(/cmd=update/);

	await cleanup(page, stamp);
});

// Çekmece: odak bir alandayken (input, textarea, .slc-input) Esc çekmeceyi kapatmaz (yazarken veri kaybı olmasın);
// alan dışındayken kapatır.
test('Select: klavyeyle açılır/seçilir; Esc listeyi kapatır, çekmeceyi kapatmaz', async ({ page }) => {
	const form = await openCreate(page);
	const single = form.getByRole('combobox', { name: 'Seçim (Tekli)' });
	const listbox = page.getByRole('listbox');

	await single.focus();
	await page.keyboard.press('ArrowDown'); // açar
	await expect(single).toHaveAttribute('aria-expanded', 'true');
	await page.keyboard.press('Enter'); // aktif (ilk gerçek) seçenek
	await expect(single).toHaveAttribute('aria-expanded', 'false');
	await expect(single).not.toHaveText('-- Seçiniz --');
	await expect(single).toBeFocused();

	// Seçimi kaldır: değişiklik kalmaz (çekmece sorusuz kapanabilsin)
	await pickOption(page, single, '-- Seçiniz --');
	await expect(single).toHaveText('-- Seçiniz --');

	await single.click();
	await expect(listbox).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(listbox).toBeHidden();
	await expect(page).toHaveURL(/cmd=create/); // çekmece açık
	await expect(single).toBeFocused();
	await page.keyboard.press('Escape'); // odak hâlâ seçimde: çekmece kapanmaz
	await expect(page).toHaveURL(/cmd=create/);
	await form.getByRole('heading', { name: 'Oluştur' }).click(); // odak alan dışında
	await page.keyboard.press('Escape');
	await expect(page).not.toHaveURL(/cmd=create/); // değişiklik yok: sorusuz kapanır
});

test('Bool: tıklama, metne tıklama ve Space ile değişir', async ({ page }) => {
	const form = await openCreate(page);
	const bool = form.getByLabel('Onay');
	await expect(bool).toHaveAttribute('aria-checked', 'false');
	await bool.click();
	await expect(bool).toHaveAttribute('aria-checked', 'true');
	await form.getByText('Rahatsız etme').click(); // yanındaki metin
	await expect(bool).toHaveAttribute('aria-checked', 'false');
	await bool.focus();
	await page.keyboard.press('Space');
	await expect(bool).toHaveAttribute('aria-checked', 'true');
});

test('kaydedilmemiş değişiklik: çekmece kapatılırken sorulur, Hayır açık bırakır', async ({ page }) => {
	const form = await openCreate(page);
	await form.getByLabel('Metin (İsteğe Bağlı)').fill('değişiklik');
	await page.keyboard.press('Escape'); // odak alanda: hiçbir şey olmaz
	await expect(page).toHaveURL(/cmd=create/);
	await form.getByRole('heading', { name: 'Oluştur' }).click();
	await page.keyboard.press('Escape');
	const ask = page.getByText('Kaydedilmemiş değişiklikleriniz var. Çıkmak istediğinize emin misiniz?');
	await expect(ask).toBeVisible();
	await page.getByRole('button', { name: 'Hayır' }).click();
	await expect(page).toHaveURL(/cmd=create/);
	await expect(form.getByLabel('Metin (İsteğe Bağlı)')).toHaveValue('değişiklik');
	await form.getByRole('button', { name: 'Kapat' }).first().click();
	await page.getByRole('button', { name: 'Evet' }).click();
	await expect(page).not.toHaveURL(/cmd=create/);
});

test('Relation: seçici adlandırılmış, çoklu seçim eklenir/kaldırılır, Vazgeç değeri korur', async ({ page }) => {
	const form = await openCreate(page);
	await form.getByLabel('İlişki (Çoklu)').click();
	const picker = page.locator('dialog[open]').filter({ has: page.getByRole('button', { name: 'Seçimi kaydet' }) });
	const items = picker.getByRole('checkbox');
	await expect.poll(() => items.count(), { timeout: 10000 }).toBeGreaterThan(1);
	await expect(picker.getByRole('textbox', { name: 'Kayıt ara' })).toBeVisible();

	const first = (await items.nth(0).textContent())!.trim();
	const second = (await items.nth(1).textContent())!.trim();
	await items.nth(0).click();
	await items.nth(1).click();
	await expect(items.nth(0)).toHaveAttribute('aria-checked', 'true');
	// Seçilenler şeridinde kaldırma düğmesi adlandırılmış
	await picker.getByRole('button', { name: `${second} kaldır` }).click();
	await expect(items.nth(1)).toHaveAttribute('aria-checked', 'false');
	await picker.getByRole('button', { name: 'Seçimi kaydet' }).click();
	await expect(form.getByText(first, { exact: true })).toBeVisible();
	await expect(form.getByText(second, { exact: true })).toHaveCount(0);

	// Vazgeç: değişiklik uygulanmaz
	await form.getByLabel('İlişki (Çoklu)').click();
	await expect.poll(() => items.count(), { timeout: 10000 }).toBeGreaterThan(1);
	await items.nth(1).click();
	await picker.getByRole('button', { name: 'Vazgeç' }).click();
	await expect(form.getByText(second, { exact: true })).toHaveCount(0);

	// Formdaki listeden kaldırma
	await form.getByRole('button', { name: `${first} kaldır` }).click();
	await expect(form.getByText(first, { exact: true })).toHaveCount(0);
});

test.describe('Türkçe yerel ayar', () => {
	test.use({ locale: 'tr-TR' });
	// Ondalık ayracını tarayıcı yönetir (bileşen tuşları değiştirmez): nokta da virgül de ondalık kabul edilir
	test('Number: nokta ve virgül ondalık olarak girilir, değer sayı olarak tutulur', async ({ page }) => {
		const form = await openCreate(page);
		const number = form.getByLabel('Sayı');
		await number.click();
		await page.keyboard.type('12.5');
		await expect(number).toHaveJSProperty('valueAsNumber', 12.5);
		await number.fill('');
		await number.click();
		await page.keyboard.type('7,25');
		await expect(number).toHaveJSProperty('valueAsNumber', 7.25);
		await number.fill('');
		await expect(number).toHaveValue(''); // boş bırakılabilir (değer 0 kabul edilir)
		await expect(form.getByRole('button', { name: 'Sıfırla' })).toBeDisabled(); // 0 = ilk değer
	});
});

test('Number: geçersiz metin sessizce 0 olarak gönderilmez; negatif ve ondalık girilir', async ({ page }) => {
	const form = await openCreate(page);
	const num = form.getByLabel('Sayı');
	const error = form.getByRole('status').filter({ hasText: 'Lütfen geçerli bir sayı girin.' });
	await form.getByLabel('Metin (Gerekli)').fill('seed-e2e-gonderilmemeli');

	// Yazarken yarım metin ('123.') hata göstermez; bir sonraki tuşla geçerli olur
	await num.click();
	await page.keyboard.type('123.', { delay: 30 });
	await expect(num).toHaveValue(''); // tarayıcı için şu an geçersiz (badInput)
	await expect(error).toHaveCount(0);
	await page.keyboard.type('2');
	await expect(num).toHaveJSProperty('valueAsNumber', 123.2);
	await expect(error).toHaveCount(0);

	// Tarayıcı '1-2' için değeri '' verir (badInput): yazarken sessiz, alandan çıkınca hatalı görünür, form gönderilmez
	await num.fill('');
	await num.click();
	await page.keyboard.type('1-2', { delay: 30 });
	await expect(error).toHaveCount(0);
	await page.keyboard.press('Tab');
	await expect(error).toHaveCount(1);
	await expect(num).toHaveAttribute('aria-invalid', 'true');
	await form.getByRole('button', { name: 'Oluştur' }).click();
	await expect(page).toHaveURL(/cmd=create/);
	await expect(error).toHaveCount(1);

	// Tümü silinince (değer 0 → 0 değişmese de) hata kalkar
	await num.fill('');
	await expect(error).toHaveCount(0);
	await expect(num).not.toHaveAttribute('aria-invalid', 'true');

	// Negatif ve ondalık: ara durumlar ('-', '-0.') geçersizdir ama yazılan silinmez
	for (const [text, expected] of [
		['-5', -5],
		['-0.5', -0.5],
		['1e3', 1000]
	] as const) {
		await num.fill('');
		await num.click();
		await page.keyboard.type(text, { delay: 30 });
		await expect(num).toHaveJSProperty('valueAsNumber', expected);
		await expect(error).toHaveCount(0);
	}
	// Değişiklik vardı; kapatırken sorulur → Evet (kayıt oluşturulmadı)
	await form.getByRole('button', { name: 'Kapat' }).first().click();
	await page.getByRole('button', { name: 'Evet' }).click();
	await expect(page).not.toHaveURL(/cmd=create/);
});
