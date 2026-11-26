import { test, expect, type Page } from '@playwright/test';

// Uygulama ayarları: sayfada açık kalan form (drawer yok). createFormSave + Form'un markClean'i (form.result) birlikte:
// kayıttan sonra form "değişiklik yok" durumuna döner. Test sonunda eski ad geri yazılır.
const URL = '/app/settings/system/application';

const nameInput = (page: Page) => page.getByLabel('Uygulama adı');
const updateButton = (page: Page) => page.getByRole('button', { name: 'Güncelle' });
const resetButton = (page: Page) => page.getByRole('button', { name: 'Sıfırla' });

async function save(page: Page, value: string) {
	await nameInput(page).fill(value);
	await expect(updateButton(page)).toBeEnabled();
	await updateButton(page).click();
	await expect(page.getByText('Başarıyla kaydedildi!').last()).toBeVisible();
}

test('ayarlar: değişince düğmeler açılır, Sıfırla geri alır; kayıttan sonra form temiz, yenilemede değer kalıcı', async ({ page }) => {
	await page.goto(URL);
	await expect(nameInput(page)).toBeVisible();
	const original = await nameInput(page).inputValue();

	// Başlangıç: değişiklik yok
	await expect(updateButton(page)).toBeDisabled();
	await expect(resetButton(page)).toBeDisabled();

	// Sıfırla: ilk değere döner
	await nameInput(page).fill(`${original} x`);
	await expect(resetButton(page)).toBeEnabled();
	await resetButton(page).click();
	await expect(nameInput(page)).toHaveValue(original);
	await expect(updateButton(page)).toBeDisabled();

	const changed = `seed-e2e-${Date.now().toString(36)}`;
	try {
		await save(page, changed);
		// markClean: form açık kalır, kaydedilen değer yeni ilk değerdir
		await expect(nameInput(page)).toHaveValue(changed);
		await expect(updateButton(page)).toBeDisabled();
		await expect(resetButton(page)).toBeDisabled();

		// Kalıcı ve yenilemede değişiklik uyarısı yok
		await page.reload();
		await expect(nameInput(page)).toHaveValue(changed);
		await expect(updateButton(page)).toBeDisabled();
	} finally {
		if ((await nameInput(page).inputValue()) !== original) await save(page, original);
	}
	await expect(nameInput(page)).toHaveValue(original);
});
