import { test, expect, type Page } from '@playwright/test';

// inputs/Relation: değer dışarıdan atanınca (başka kayda geçiş gibi) seçili kayıtların etiketleri sunucudan okunur.
// Önceden yalnızca ilk değerin etiketleri okunuyordu; sonradan gelen id'ler "veri yok" görünürdü.
const URL = '/app/developments/components/select';
const section = (page: Page, kind: 'Single' | 'Multiple') =>
	page.locator('div.flex.flex-col.gap-4').filter({ has: page.getByRole('heading', { name: `Relation.svelte [${kind}] Component Test` }) });

for (const kind of ['Single', 'Multiple'] as const) {
	test(`${kind}: dışarıdan atanan değerin etiketleri yüklenir`, async ({ page }) => {
		await page.goto(URL);
		const box = section(page, kind);
		const list = box.locator('output');
		const removeButtons = list.getByRole('button', { name: / kaldır$/ });
		await expect(removeButtons).toHaveCount(0);

		await box.getByRole('button', { name: 'Varsayılanları Yükle' }).click();
		await expect(removeButtons).toHaveCount(kind === 'Single' ? 1 : 2, { timeout: 10000 });
		await expect(removeButtons.first()).toBeEnabled({ timeout: 10000 }); // yükleme bitti
		await expect(list.getByText('veri yok')).toHaveCount(0);
		// Etiket id değil, kaydın etiketi
		const value = JSON.parse((await box.locator('code').first().textContent())!);
		for (const id of [value].flat()) await expect(list.getByText(id, { exact: true })).toHaveCount(0);

		// Temizle → tekrar yükle: önbellekten gelir, yine etiketli
		await box.getByRole('button', { name: 'Temizle' }).click();
		await expect(removeButtons).toHaveCount(0);
		await box.getByRole('button', { name: 'Varsayılanları Yükle' }).click();
		await expect(removeButtons).toHaveCount(kind === 'Single' ? 1 : 2);
		await expect(list.getByText('veri yok')).toHaveCount(0);
	});
}
