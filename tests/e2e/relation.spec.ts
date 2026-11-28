import { test, expect } from '@playwright/test';

// Kayıt seçici (Relation input → relations.remote.ts): arama, filtre enjeksiyonuna karşı yer tutucu, seçimin gösterilmesi.
// Kayıt oluşturulmaz: "Oluştur" çekmecesi açılır, seçim yapılır, çekmece kaydedilmeden kapatılır.
test('kayıt seçici arar, enjeksiyon denemesi sonuç döndürmez, seçilen kayıt gösterilir', async ({ page }) => {
	await page.goto('/app/grapes/crud/simple');
	await expect(page.getByRole('grid').locator('[data-slc-table-datacell]').first()).toBeVisible();
	await page.getByRole('button', { name: 'Oluştur' }).first().click();
	const form = page.getByRole('dialog').first();
	await form.getByLabel('İlişki (Tekli)').click();

	const search = page.getByPlaceholder('Ara...');
	const items = page.getByRole('radio');
	await expect.poll(() => items.count(), { timeout: 10000 }).toBeGreaterThan(0);

	// Tırnakla filtreden çıkma denemesi: değer yer tutucuya gittiği için düz metin olarak aranır, eşleşme yok
	await search.fill('" || id != "');
	await search.press('Enter');
	await expect(items).toHaveCount(0, { timeout: 10000 });

	await search.fill('');
	await search.press('Enter');
	await expect.poll(() => items.count(), { timeout: 10000 }).toBeGreaterThan(0);
	const label = (await items.first().textContent())!.trim();

	// Türkçe arama: büyük harfle ve aksanlı yazılan terim normalize edilir (search_label ile aynı biçim)
	await search.fill(label.toLocaleUpperCase('tr-TR'));
	await search.press('Enter');
	await expect(items.filter({ hasText: label }).first()).toBeVisible({ timeout: 10000 });
	await search.fill('');
	await search.press('Enter');
	await expect.poll(() => items.count(), { timeout: 10000 }).toBeGreaterThan(0);

	await items.first().click();
	await page.getByRole('button', { name: 'Seçimi kaydet' }).click();
	// Seçilen kayıt id ile yeniden okunup etiketiyle gösterilir (getSingleRelationSelectedList)
	await expect(form.getByText(label, { exact: true }).first()).toBeVisible({ timeout: 10000 });
});
