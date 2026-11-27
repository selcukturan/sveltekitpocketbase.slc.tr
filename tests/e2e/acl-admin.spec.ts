import { test, expect, type Browser, type Page, type Request } from '@playwright/test';

// Yetki ekranı (Ayarlar → Sistem → Yetkiler) ve izinlerin gerçekten uygulanması.
// Geliştirme superuser'ı (migration 1757071369) ile iki geçici kullanıcı oluşturulur: yönetici (Admin rolü) ve hedef
// (User rolü). Test sonunda silinirler; kişisel izin satırları da onlarla silinir (cascade). Rol satırına dokunan test
// hücreyi eski hâline döndürür ve yine de bir şey kalırsa temizler.
const PB = process.env.PB_TEST_URL ?? 'http://localhost:8099';
const URL = '/app/settings/system/permissions';
const PASSWORD = 'Test-1234567';

type Item = Record<string, unknown> & { id: string };
let su = '';
const api = async (path: string, init: RequestInit = {}) => {
	const res = await fetch(`${PB}/api/${path}`, { ...init, headers: { 'Content-Type': 'application/json', Authorization: su, ...init.headers } });
	expect(res.ok, `${path}: ${res.status}`).toBe(true);
	return res.status === 204 ? null : res.json();
};
const list = async (collection: string, filter: string): Promise<Item[]> =>
	(await api(`collections/${collection}/records?perPage=500&filter=${encodeURIComponent(filter)}`)).items;

const stamp = Date.now();
const admin = { email: `acl-admin-${stamp}@test.slc`, id: '' };
const target = { email: `acl-target-${stamp}@test.slc`, id: '', label: `Hedef ${stamp}` };
const ids: Record<string, string> = {}; // kaynak/işlem anahtarı → id

test.beforeAll(async () => {
	const auth = await fetch(`${PB}/api/collections/_superusers/auth-with-password`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ identity: 'demoadmin@slc.tr', password: 'SLc12345678' })
	});
	su = ((await auth.json()) as { token: string }).token;
	const roleOf = async (type: string) => (await list('acl_roles', `type = "${type}"`))[0].id;
	const create = async (email: string, label: string, role: string) =>
		(
			await api('collections/sys_users/records', {
				method: 'POST',
				body: JSON.stringify({ email, password: PASSWORD, passwordConfirm: PASSWORD, label, name: label, verified: true, role: [role] })
			})
		).id as string;
	admin.id = await create(admin.email, `Yönetici ${stamp}`, await roleOf('admin'));
	target.id = await create(target.email, target.label, await roleOf('user'));
	for (const r of await list('acl_resources', 'key = "grapes.crud.simple"')) ids['simple'] = r.id;
	for (const a of await list('acl_actions', 'key != ""')) ids[String(a.key)] = a.id;
	ids['userRole'] = await roleOf('user');
});

test.afterAll(async () => {
	for (const u of [admin, target]) if (u.id) await api(`collections/sys_users/records/${u.id}`, { method: 'DELETE' });
	// Rol testi hücreyi geri alır; yarıda kaldıysa satır burada silinir
	for (const p of await list('acl_permissions', `role = "${ids['userRole']}" && resource = "${ids['simple']}" && action = "${ids['export']}"`)) {
		await api(`collections/acl_permissions/records/${p.id}`, { method: 'DELETE' });
	}
});

async function loginAs(browser: Browser, email: string): Promise<Page> {
	const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
	const page = await context.newPage();
	await page.goto('/login');
	await page.getByLabel('E-posta').fill(email);
	await page.getByLabel('Şifre').fill(PASSWORD);
	await page.getByRole('button', { name: 'Giriş' }).click();
	await expect(page).toHaveURL(/\/app$/);
	return page;
}

// Matris (DataTable): satır = kaynak, kolon = işlem (kolon başlık adından bulunur: işlem listesi veritabanından gelir).
// Hücredeki işaretin data-state'i: allow | deny | inherit-allow | inherit-off
const cell = async (page: Page, resource: string, action: string) => {
	const headers = (await page.getByRole('columnheader').allTextContents()).map((h) => h.trim());
	const index = headers.indexOf(action);
	expect(index, `${action} kolonu`).toBeGreaterThan(0);
	return page
		.getByRole('row')
		.filter({ has: page.getByRole('gridcell', { name: resource, exact: true }) })
		.getByRole('gridcell')
		.nth(index);
};
const stateOf = async (page: Page, resource: string, action: string) => (await cell(page, resource, action)).locator('[data-state]');
const chooseSubject = async (page: Page, label: string) => {
	await page.getByRole('combobox', { name: 'Kime' }).click();
	await page.getByRole('option', { name: label, exact: true }).click();
};
// Hücrede Enter → açılır liste → değer ('' = belirtilmemiş) → Enter ile kaydet
const setCell = async (page: Page, resource: string, action: string, value: '' | 'allow' | 'deny') => {
	await (await cell(page, resource, action)).click();
	await page.keyboard.press('Enter');
	const editor = page.locator('select.slc-table-editor');
	await editor.selectOption(value);
	await editor.press('Enter');
};

test('demo kullanıcı ekranı görür ama değiştiremez (yalnızca görüntüleme)', async ({ page }) => {
	await page.goto(URL);
	await expect(page.getByTestId('acl-matrix')).toBeVisible();
	await expect(page.getByText('Yetkileri değiştirme izniniz yok')).toBeVisible();
	await expect(await stateOf(page, 'Basit CRUD', 'Silme')).toHaveAttribute('data-state', 'allow'); // Herkes'in kendi satırı
	await (await cell(page, 'Basit CRUD', 'Silme')).click();
	await page.keyboard.press('Enter');
	await expect(page.locator('select.slc-table-editor')).toHaveCount(0); // düzenleyici açılmaz
	await expect(page.getByRole('navigation', { name: 'Ayarlar' }).getByRole('link', { name: 'Yetkiler' })).toBeVisible();
});

test('yönetici kişisel engel verir: satır yazılır, hedef kullanıcının isteği sunucuda reddedilir; kaldırınca açılır', async ({ browser }) => {
	const page = await loginAs(browser, admin.email);

	// Sunucu kontrolünü doğrudan denemek için getList isteğinin adresi (yöneticinin oturumunda yakalanır)
	const listRequest = page.waitForRequest(/\/_app\/remote\/[^?]*getList/);
	await page.goto('/app/grapes/crud/simple');
	const listUrl = (await listRequest).url();

	await page.goto(URL);
	await expect(page.getByText('Yetkileri değiştirme izniniz yok')).toHaveCount(0);
	await chooseSubject(page, `Kullanıcı: ${target.label}`);

	await expect(await stateOf(page, 'Basit CRUD', 'Listeleme')).toHaveAttribute('data-state', 'inherit-allow'); // Herkes'ten
	await setCell(page, 'Basit CRUD', 'Listeleme', 'deny');
	await expect(await stateOf(page, 'Basit CRUD', 'Listeleme')).toHaveAttribute('data-state', 'deny');
	await expect.poll(async () => (await simpleRows(target.id)).map((r) => r.effect)).toEqual(['deny']);

	const targetPage = await loginAs(browser, target.email);
	const body = (await (await targetPage.request.get(listUrl)).json()) as { type: string; error?: { status: number; message: string } };
	expect(body.type).toBe('error');
	expect(body.error).toMatchObject({ status: 403, message: 'error_forbidden' });

	// Belirtilmemiş: satır silinir, hedef tekrar okuyabilir
	await setCell(page, 'Basit CRUD', 'Listeleme', '');
	await expect(await stateOf(page, 'Basit CRUD', 'Listeleme')).toHaveAttribute('data-state', 'inherit-allow');
	await expect.poll(() => simpleRows(target.id)).toEqual([]);
	expect(((await (await targetPage.request.get(listUrl)).json()) as { type: string }).type).toBe('result');

	await targetPage.context().close();
	await page.context().close();
});

test('yapıştırma: bir hücre birden çok hücreye tek istekte yazılır; geçersiz değer kaydedilmez', async ({ browser }) => {
	const page = await loginAs(browser, admin.email);
	await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
	await page.goto(URL);
	await chooseSubject(page, `Kullanıcı: ${target.label}`);
	await expect(await stateOf(page, 'Basit CRUD', 'Oluşturma')).toHaveAttribute('data-state', 'inherit-allow');

	// Oluşturma … Silme (3 hücre) seçilir, panodaki tek değer hepsine yazılır
	let saves = 0;
	page.on('request', (r) => r.url().includes('setPermissions') && saves++);
	await page.evaluate(() => navigator.clipboard.writeText('deny'));
	await (await cell(page, 'Basit CRUD', 'Oluşturma')).click();
	await page.keyboard.press('Shift+ArrowRight');
	await page.keyboard.press('Shift+ArrowRight');
	await page.keyboard.press('Control+v');
	for (const action of ['Oluşturma', 'Güncelleme', 'Silme']) await expect(await stateOf(page, 'Basit CRUD', action)).toHaveAttribute('data-state', 'deny');
	await expect.poll(async () => (await simpleRows(target.id)).length).toBe(3);
	expect(saves).toBe(1);

	// Geçersiz metin: kaydedilmez, uyarı
	await page.evaluate(() => navigator.clipboard.writeText('evet'));
	await (await cell(page, 'Basit CRUD', 'Dışa aktarma')).click();
	await page.keyboard.press('Control+v');
	await expect(page.getByText(/geçersiz/i).last()).toBeVisible();
	await expect(await stateOf(page, 'Basit CRUD', 'Dışa aktarma')).toHaveAttribute('data-state', 'inherit-allow');
	expect((await simpleRows(target.id)).length).toBe(3);

	await page.context().close();
});

// Hedef kullanıcının Basit CRUD satırları
const simpleRows = (userId: string) => list('acl_permissions', `user = "${userId}" && resource = "${ids['simple']}"`);

test('rol satırında engel yok (seçenek de yapıştırma da); erişim yoksa sayfa ve menü kapanır', async ({ browser }) => {
	const page = await loginAs(browser, admin.email);
	await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
	await page.goto(URL);
	await chooseSubject(page, 'Rol: User 1');
	await expect(await stateOf(page, 'Basit CRUD', 'Dışa aktarma')).toHaveAttribute('data-state', /^inherit/);

	await (await cell(page, 'Basit CRUD', 'Dışa aktarma')).click();
	await page.keyboard.press('Enter');
	await expect(page.locator('select.slc-table-editor option')).toHaveText(['—', 'İzin']); // Engel yok
	await page.keyboard.press('Escape');

	await setCell(page, 'Basit CRUD', 'Dışa aktarma', 'allow');
	await expect(await stateOf(page, 'Basit CRUD', 'Dışa aktarma')).toHaveAttribute('data-state', 'allow');
	await expect
		.poll(async () => (await list('acl_permissions', `role = "${ids['userRole']}" && resource = "${ids['simple']}" && action = "${ids['export']}"`)).length)
		.toBe(1);
	await setCell(page, 'Basit CRUD', 'Dışa aktarma', '');
	await expect.poll(() => list('acl_permissions', `role = "${ids['userRole']}" && resource = "${ids['simple']}" && action = "${ids['export']}"`)).toEqual([]);

	// Hızlı art arda (İzin → boş, birincinin yanıtı beklenmeden): kayıtlar sırayla gider, sonda satır kalmaz
	// (yalnızca bu adımda gönderilen isteklerin yanıtları beklenir; önceki adımın geç gelen yanıtı sayılmaz)
	const sent: Request[] = [];
	page.on('request', (r) => r.url().includes('setPermissions') && sent.push(r));
	await setCell(page, 'Basit CRUD', 'Dışa aktarma', 'allow');
	await setCell(page, 'Basit CRUD', 'Dışa aktarma', '');
	await expect.poll(() => sent.length).toBe(2);
	await Promise.all(sent.map((r) => r.response()));
	expect(await list('acl_permissions', `role = "${ids['userRole']}" && resource = "${ids['simple']}" && action = "${ids['export']}"`)).toEqual([]);

	await page.evaluate(() => navigator.clipboard.writeText('deny'));
	await (await cell(page, 'Basit CRUD', 'Dışa aktarma')).click();
	await page.keyboard.press('Control+v');
	await expect(page.getByText(/geçersiz/i).last()).toBeVisible();
	await expect(await stateOf(page, 'Basit CRUD', 'Dışa aktarma')).not.toHaveAttribute('data-state', 'deny');

	// Kişisel erişim engeli: hedefin menüsünde Basit CRUD yok, adresinde 403 görünümü
	await chooseSubject(page, `Kullanıcı: ${target.label}`);
	await setCell(page, 'Basit CRUD', 'Erişim', 'deny');
	await expect(await stateOf(page, 'Basit CRUD', 'Erişim')).toHaveAttribute('data-state', 'deny');
	// Önizleme: erişim yoksa diğer işlemler de kapalı
	await expect(await stateOf(page, 'Basit CRUD', 'Dışa aktarma')).toHaveAttribute('data-state', 'inherit-off');

	const targetPage = await loginAs(browser, target.email);
	await targetPage.goto('/app/grapes/crud/simple');
	await expect(targetPage.getByTestId('forbidden')).toBeVisible();
	await expect(targetPage.getByRole('navigation', { name: 'Grapes' }).getByRole('link', { name: 'Basit CRUD' })).toHaveCount(0);

	await targetPage.context().close();
	await page.context().close();
});
