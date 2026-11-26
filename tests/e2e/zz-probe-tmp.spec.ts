import { test, expect } from '@playwright/test';
test.use({ locale: 'tr-TR' });
test('probe', async ({ page }) => {
	await page.goto('/app/grapes/crud/simple');
	await expect(page.getByRole('grid').locator('[data-slc-table-datacell]').first()).toBeVisible();
	await page.getByRole('button', { name: 'Oluştur' }).first().click();
	const num = page.locator('dialog[open]').getByLabel('number_optional');
	await expect(num).toBeVisible();
	const cdp = await page.context().newCDPSession(page);
	await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
	const results: string[] = [];
	for (let i = 0; i < 15; i++) {
		await num.fill('');
		await num.click();
		await page.keyboard.type('12.5');
		await page.waitForTimeout(150);
		results.push(await num.inputValue());
	}
	console.log('SONUC', results.join(' '));
});
