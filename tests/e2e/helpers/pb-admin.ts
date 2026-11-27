import { expect, type Browser, type Page } from '@playwright/test';

// Testler için PocketBase yönetimi: geliştirme superuser'ı (migration 1757071369) ile geçici kullanıcı oluşturma,
// kayıt okuma/silme ve tarayıcıda o kullanıcıyla giriş. Testler yalnızca kendi oluşturduklarını siler.
export const PB = process.env.PB_TEST_URL ?? 'http://localhost:8099';
export const PASSWORD = 'Test-1234567';

export type Item = Record<string, unknown> & { id: string };

let token = '';
export async function superuserLogin() {
	const auth = await fetch(`${PB}/api/collections/_superusers/auth-with-password`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ identity: 'demoadmin@slc.tr', password: 'SLc12345678' })
	});
	token = ((await auth.json()) as { token: string }).token;
}

export const api = async (path: string, init: RequestInit = {}) => {
	const res = await fetch(`${PB}/api/${path}`, { ...init, headers: { 'Content-Type': 'application/json', Authorization: token, ...init.headers } });
	expect(res.ok, `${path}: ${res.status}`).toBe(true);
	return res.status === 204 ? null : res.json();
};

export const list = async (collection: string, filter: string): Promise<Item[]> =>
	(await api(`collections/${collection}/records?perPage=500&filter=${encodeURIComponent(filter)}`)).items;

export const remove = (collection: string, id: string) => api(`collections/${collection}/records/${id}`, { method: 'DELETE' });

export const roleOf = async (type: string) => (await list('acl_roles', `type = "${type}"`))[0].id;

/** Geçici kullanıcı (tek rol); id döner. Silmek: remove('sys_users', id) (kişisel izinleri cascade ile silinir). */
export const createUser = async (email: string, label: string, role: string) =>
	(
		await api('collections/sys_users/records', {
			method: 'POST',
			body: JSON.stringify({ email, password: PASSWORD, passwordConfirm: PASSWORD, label, name: label, verified: true, role: [role] })
		})
	).id as string;

/** Yeni bir tarayıcı bağlamında (demo oturumu olmadan) giriş yapar. */
export async function loginAs(browser: Browser, email: string): Promise<Page> {
	const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
	const page = await context.newPage();
	await page.goto('/login');
	await page.getByLabel('E-posta').fill(email);
	await page.getByLabel('Şifre').fill(PASSWORD);
	await page.getByRole('button', { name: 'Giriş' }).click();
	await expect(page).toHaveURL(/\/app$/);
	return page;
}
