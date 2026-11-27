import { test, expect, type Locator, type Page } from '@playwright/test';
import { superuserLogin, list, remove, roleOf, createUser, loginAs } from './helpers/pb-admin.ts';

// Kaynak (menü) ve işlem düzenleme ekranı (Ayarlar → Sistem → Kaynaklar). Geçici bir yönetici (Admin rolü) ile yazılır;
// testin oluşturduğu kaynak ve işlemlerin anahtarı zz_e2e_ ile başlar ve test sonunda silinir.
const URL = '/app/settings/system/resources';
const stamp = Date.now().toString(36);
const KEY = `zz_e2e_${stamp}`; // özellik (kök) kaynağı
const ACTION = `zz_e2e_${stamp}`;
const admin = { email: `acl-res-${stamp}@test.slc`, id: '' };

test.beforeAll(async () => {
	await superuserLogin();
	admin.id = await createUser(admin.email, `Kaynak Yöneticisi ${stamp}`, await roleOf('admin'));
});

test.afterAll(async () => {
	for (const r of await list('acl_resources', `key ~ "zz_e2e_${stamp}"`)) await remove('acl_resources', r.id);
	for (const a of await list('acl_actions', `key ~ "zz_e2e_${stamp}"`)) await remove('acl_actions', a.id);
	if (admin.id) await remove('sys_users', admin.id);
});

const resources = (page: Page) => page.getByTestId('acl-resources');
const actionsTable = (page: Page) => page.getByTestId('acl-actions');
const rowOf = (table: Locator, text: string) => table.getByRole('row').filter({ has: table.page().getByRole('gridcell', { name: text, exact: true }) });
const drawer = (page: Page) => page.locator('dialog[open]');
async function pick(page: Page, form: Locator, label: string, option: string) {
	await form.getByRole('combobox', { name: label }).click();
	await page.getByRole('option', { name: option, exact: true }).click();
}

test('demo kullanıcı kaynakları ve işlemleri görür, değiştiremez', async ({ page }) => {
	await page.goto(URL);
	await expect(rowOf(resources(page), 'grapes.crud.simple')).toBeVisible();
	await expect(rowOf(actionsTable(page), 'access')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Kaynak oluştur' })).toHaveCount(0);
	await expect(resources(page).getByRole('button', { name: 'Güncelle' })).toHaveCount(0);
	await rowOf(resources(page), 'grapes.crud.simple').getByRole('gridcell').nth(1).click(); // Ad
	await page.keyboard.press('Enter');
	await expect(page.locator('.slc-table-editor')).toHaveCount(0);
});

test('kaynak oluşturma: kurallar alanın altında (sayfa adresi yoksa), geçerli özellik kaydedilir; hücrede ad ve sıra düzenlenir; silinir', async ({ browser }) => {
	const page = await loginAs(browser, admin.email);
	await page.goto(URL);

	// Olmayan bir adrese sayfa: sunucu reddeder, hata Adres alanında
	await page.getByRole('button', { name: 'Kaynak oluştur' }).click();
	let form = drawer(page);
	await form.getByLabel('Anahtar', { exact: true }).fill(`${KEY}.yok`);
	await form.getByLabel('Ad', { exact: true }).fill('E2E sayfa');
	await pick(page, form, 'Üst kaynak', 'Grapes');
	await form.getByLabel('Adres', { exact: true }).fill('/app/boyle-bir-sayfa-yok');
	await form.getByRole('button', { name: 'Oluştur' }).click();
	await expect(form.getByText('Bu adreste bir sayfa yok')).toBeVisible();
	expect(await list('acl_resources', `key ~ "${KEY}"`)).toEqual([]);

	// Var olan bir sayfa (/ içeren adres metin şemasından geçer, sunucu sayfayı bulur) kabul edilir. Kaynak pasif ve en
	// sonda: aynı adresteki gerçek kaynağın yerine geçmez (paralel testler etkilenmez)
	await form.getByLabel('Adres', { exact: true }).fill('/app/developments/components/empty');
	await form.getByLabel('Sıra', { exact: true }).fill('9999');
	await form.getByLabel('Aktif', { exact: true }).uncheck();
	await form.getByRole('button', { name: 'Oluştur' }).click();
	await expect(page).not.toHaveURL(/cmd=/);
	expect(await list('acl_resources', `key = "${KEY}.yok"`)).toEqual([
		expect.objectContaining({ kind: 'page', href: '/app/developments/components/empty', active: false })
	]);

	// Geçerli: özellik (kökte, adressiz; erişim işlemi varsayılan seçili)
	await page.getByRole('button', { name: 'Kaynak oluştur' }).click();
	form = drawer(page);
	await form.getByLabel('Anahtar', { exact: true }).fill(KEY);
	await pick(page, form, 'Tür', 'Özellik');
	await form.getByLabel('Ad', { exact: true }).fill('E2E özellik');
	await form.getByRole('button', { name: 'Oluştur' }).click();
	await expect(rowOf(resources(page), KEY)).toBeVisible();
	const [created] = await list('acl_resources', `key = "${KEY}"`);
	expect(created).toMatchObject({ kind: 'feature', label: 'E2E özellik', active: true });

	// Hücrede ad: Enter, yaz, Enter
	await rowOf(resources(page), KEY).getByRole('gridcell').nth(1).click();
	await page.keyboard.press('Enter');
	await page.keyboard.press('Control+a');
	await page.keyboard.type('E2E özellik 2');
	await page.keyboard.press('Enter');
	await expect.poll(async () => (await list('acl_resources', `key = "${KEY}"`))[0].label).toBe('E2E özellik 2');

	// Sil (onaylı)
	await rowOf(resources(page), KEY).getByRole('button', { name: 'Sil' }).click();
	await page.locator('dialog[open]').getByRole('button', { name: 'Sil' }).click();
	await expect(rowOf(resources(page), KEY)).toHaveCount(0);
	expect(await list('acl_resources', `key = "${KEY}"`)).toEqual([]);
	await page.context().close();
});

test('alt kaynağı olan silinemez; hücrede kural ihlali (gruba adres) reddedilir', async ({ browser }) => {
	const page = await loginAs(browser, admin.email);
	await page.goto(URL);
	await rowOf(resources(page), 'grapes').getByRole('button', { name: 'Sil' }).click();
	await page.locator('dialog[open]').getByRole('button', { name: 'Sil' }).click();
	await expect(page.getByText('Alt kaynağı olan kaynak silinemez').last()).toBeVisible();
	expect(await list('acl_resources', 'key = "grapes"')).toHaveLength(1);

	// Grubun adres hücresi düzenlenemez (istemci); eşleşme de (adresi yok)
	const group = rowOf(resources(page), 'grapes.crud');
	const headers = (await resources(page).getByRole('columnheader').allTextContents()).map((h) => h.trim());
	await group.getByRole('gridcell').nth(headers.indexOf('Adres')).click();
	await page.keyboard.press('Enter');
	await expect(page.locator('.slc-table-editor')).toHaveCount(0);
	await page.context().close();
});

test('işlem: oluşturulur, hücrede ad düzenlenir; erişim ve kullanılan işlem silinemez; kullanılmayan silinir', async ({ browser }) => {
	const page = await loginAs(browser, admin.email);
	await page.goto(URL);
	await page.getByRole('button', { name: 'İşlem oluştur' }).click();
	const form = drawer(page);
	await form.getByLabel('Anahtar', { exact: true }).fill(ACTION);
	await form.getByLabel('Ad', { exact: true }).fill('E2E işlem');
	await form.getByLabel('Sıra', { exact: true }).fill('9999'); // en sonda: paralel çalışan yetki testlerinin kolon sırası kaymasın
	await form.getByRole('button', { name: 'Oluştur' }).click();
	await expect(rowOf(actionsTable(page), ACTION)).toBeVisible();

	await rowOf(actionsTable(page), 'access').getByRole('button', { name: 'Sil' }).click();
	await page.locator('dialog[open]').getByRole('button', { name: 'Sil' }).click();
	await expect(page.getByText('Erişim işlemi silinemez').last()).toBeVisible();

	await rowOf(actionsTable(page), 'list').getByRole('button', { name: 'Sil' }).click();
	await page.locator('dialog[open]').getByRole('button', { name: 'Sil' }).click();
	await expect(page.getByText('Bir kaynakta kullanılan işlem silinemez').last()).toBeVisible();

	await rowOf(actionsTable(page), ACTION).getByRole('button', { name: 'Sil' }).click();
	await page.locator('dialog[open]').getByRole('button', { name: 'Sil' }).click();
	await expect(rowOf(actionsTable(page), ACTION)).toHaveCount(0);
	expect(await list('acl_actions', `key = "${ACTION}"`)).toEqual([]);
	await page.context().close();
});
