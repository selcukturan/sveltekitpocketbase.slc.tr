import { test, expect, type Browser, type Page } from '@playwright/test';

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

const cell = (page: Page, resource: string, action: string) => page.getByRole('button', { name: new RegExp(`^${resource} · ${action}: `) });

test('demo kullanıcı ekranı görür ama değiştiremez (yalnızca görüntüleme)', async ({ page }) => {
	await page.goto(URL);
	await expect(page.getByTestId('acl-matrix')).toBeVisible();
	await expect(page.getByText('Yetkileri değiştirme izniniz yok')).toBeVisible();
	await expect(cell(page, 'Basit CRUD', 'Silme')).toBeDisabled();
	await expect(page.getByRole('navigation', { name: 'Ayarlar' }).getByRole('link', { name: 'Yetkiler' })).toBeVisible();
});

test('yönetici kişisel engel verir: satır yazılır, önizleme ve hedef kullanıcının arayüzü ile sunucusu reddeder', async ({ browser }) => {
	const page = await loginAs(browser, admin.email);

	// Sunucu kontrolünü doğrudan denemek için getList isteğinin adresi (yöneticinin oturumunda yakalanır)
	const listRequest = page.waitForRequest(/\/_app\/remote\/[^?]*getList/);
	await page.goto('/app/grapes/crud/simple');
	const listUrl = (await listRequest).url();

	await page.goto(URL);
	await expect(page.getByText('Yetkileri değiştirme izniniz yok')).toHaveCount(0);
	await page.getByLabel('Kime').selectOption({ label: target.label });

	// Belirtilmemiş (Herkes'ten izinli) → İzin → Engel
	const listCell = cell(page, 'Basit CRUD', 'Listeleme');
	await expect(listCell).toHaveAttribute('aria-label', /Belirtilmemiş \(Başka yerden izinli\)$/);
	await listCell.click();
	await expect(listCell).toHaveAttribute('aria-label', /: İzin$/);
	await listCell.click();
	await expect(listCell).toHaveAttribute('aria-label', /: Engel$/);
	const rows = await simpleRows(target.id);
	expect(rows.map((r) => r.effect)).toEqual(['deny']);

	// Hedef kullanıcı: tablo verisi sunucuda reddedilir (403), arayüzde düğmeler kalır ama liste gelmez
	const targetPage = await loginAs(browser, target.email);
	const res = await targetPage.request.get(listUrl);
	const body = (await res.json()) as { type: string; error?: { status: number; message: string } };
	expect(body.type).toBe('error');
	expect(body.error).toMatchObject({ status: 403, message: 'error_forbidden' });

	// Engel kaldırılır (Engel → Belirtilmemiş): satır silinir, hedef tekrar okuyabilir
	await listCell.click();
	await expect(listCell).toHaveAttribute('aria-label', /Belirtilmemiş/);
	expect(await simpleRows(target.id)).toEqual([]);
	expect(((await (await targetPage.request.get(listUrl)).json()) as { type: string }).type).toBe('result');

	await targetPage.context().close();
	await page.context().close();
});

// Hedef kullanıcının Basit CRUD satırları
const simpleRows = (userId: string) => list('acl_permissions', `user = "${userId}" && resource = "${ids['simple']}"`);

test('rol satırında engel yok: Belirtilmemiş ↔ İzin; erişim yoksa sayfa ve menü kapanır', async ({ browser }) => {
	const page = await loginAs(browser, admin.email);
	await page.goto(URL);
	await page.getByLabel('Kime').selectOption({ label: 'User 1' });
	const exp = cell(page, 'Basit CRUD', 'Dışa aktarma');
	await expect(exp).toHaveAttribute('aria-label', /Belirtilmemiş/);
	await exp.click();
	await expect(exp).toHaveAttribute('aria-label', /: İzin$/);
	await exp.click(); // rolde Engel yok: doğrudan Belirtilmemiş
	await expect(exp).toHaveAttribute('aria-label', /Belirtilmemiş/);
	expect(await list('acl_permissions', `role = "${ids['userRole']}" && resource = "${ids['simple']}" && action = "${ids['export']}"`)).toEqual([]);

	// Kişisel erişim engeli: hedefin menüsünde Basit CRUD yok, adresinde 403 görünümü
	await page.getByLabel('Kime').selectOption({ label: target.label });
	const access = cell(page, 'Basit CRUD', 'Erişim');
	await access.click();
	await access.click();
	await expect(access).toHaveAttribute('aria-label', /: Engel$/);
	// Önizleme: erişim yoksa diğer işlemler de kapalı
	await expect(cell(page, 'Basit CRUD', 'Listeleme')).toHaveAttribute('aria-label', /\(Kapalı\)$/);

	const targetPage = await loginAs(browser, target.email);
	await targetPage.goto('/app/grapes/crud/simple');
	await expect(targetPage.getByTestId('forbidden')).toBeVisible();
	await expect(targetPage.getByRole('navigation', { name: 'Grapes' }).getByRole('link', { name: 'Basit CRUD' })).toHaveCount(0);

	await targetPage.context().close();
	await page.context().close();
});
