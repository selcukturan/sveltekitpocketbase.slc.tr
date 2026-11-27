// Yetki çekirdeği (saf: Svelte, PocketBase ve tarayıcı gerektirmez; tests/e2e/acl-access.spec.ts tarayıcısız test eder).
//
// Girdi: PocketBase'den okunan kayıtlar (acl_actions, acl_resources, acl_permissions) ve kullanıcının rolleri.
// Çıktı: etkin izinler (kaynak anahtarı → izinli işlem anahtarları). Sunucu bunu bir kez hesaplar; hem remote
// fonksiyonlardaki kontrol (requirePermission) hem istemcideki menü ve düğmeler (can) aynı sonucu kullanır.
//
// Kural (her kaynak + işlem için, sırayla):
// 1. Kişisel satır (user = kullanıcı): allow ya da deny, rolleri ezer.
// 2. Aktif rollerinden biri allow → izinli. (Rollerde yalnızca allow anlamlıdır; rol satırındaki deny yok sayılır.)
// 3. Herkes satırı (role ve user boş).
// 4. Hiçbiri yoksa kapalı.
// Ek kurallar: yalnızca aktif kaynaklar ve kaynağın actions listesindeki işlemler; access yoksa diğer işlemler de yok;
// developer/system tipinde aktif rolü olan her şeye izinli (yetki ekranında kendini kilitlemeye karşı).

import { buildTree, hrefMatches, pruneTree, type MenuNode, type MenuRecord } from '../menu/tree.js';

export type AclAction = { id: string; key: string };
export type AclResource = {
	id: string;
	key: string;
	label: string;
	kind: 'module' | 'group' | 'page' | 'feature';
	parent: string; // '' = kök
	icon: string;
	href: string; // '' = sayfası yok (grup, alt menülü modül, özellik)
	match: 'exact' | 'prefix' | '';
	sort: number;
	active: boolean;
	hidden: boolean;
	actions: string[]; // acl_actions id'leri
};
export type AclPermission = { resource: string; action: string; role: string; user: string; effect: 'allow' | 'deny' };
export type AclRole = { id: string; type: string; status: string };
export type AclSubject = { id: string; roles: AclRole[] };

// Etkin izinler: kaynak anahtarı → izinli işlem anahtarları (JSON'a dönüşebilir: istemciye gönderilir)
export type Access = Record<string, string[]>;

export const ACCESS = 'access';
export const SUPER_ROLE_TYPES = ['developer', 'system'];

export function resolvePermissions(input: {
	subject: AclSubject;
	actions: readonly AclAction[];
	resources: readonly AclResource[];
	permissions: readonly AclPermission[];
}): Access {
	const { subject, actions, resources, permissions } = input;
	const actionKey = new Map(actions.map((a) => [a.id, a.key]));
	const activeRoles = subject.roles.filter((role) => role.status === 'active');
	const roleIds = new Set(activeRoles.map((role) => role.id));
	const isSuper = activeRoles.some((role) => SUPER_ROLE_TYPES.includes(role.type));

	// Hücre: kaynak id + işlem id → { kişisel, rol allow var mı, Herkes }
	type Cell = { personal?: 'allow' | 'deny'; roleAllow: boolean; everyone?: 'allow' | 'deny' };
	const cells = new Map<string, Cell>();
	const cellOf = (resource: string, action: string) => {
		const id = `${resource}|${action}`;
		let cell = cells.get(id);
		if (!cell) cells.set(id, (cell = { roleAllow: false }));
		return cell;
	};
	for (const p of permissions) {
		if (p.user) {
			if (p.user === subject.id) cellOf(p.resource, p.action).personal = p.effect;
		} else if (p.role) {
			if (roleIds.has(p.role) && p.effect === 'allow') cellOf(p.resource, p.action).roleAllow = true;
		} else {
			cellOf(p.resource, p.action).everyone = p.effect;
		}
	}
	const allowed = (cell: Cell | undefined) => {
		if (!cell) return false;
		if (cell.personal) return cell.personal === 'allow';
		if (cell.roleAllow) return true;
		return cell.everyone === 'allow';
	};

	const access: Access = {};
	for (const resource of resources) {
		if (!resource.active) continue;
		const keys: string[] = [];
		for (const actionId of resource.actions) {
			const key = actionKey.get(actionId);
			if (key && (isSuper || allowed(cells.get(`${resource.id}|${actionId}`)))) keys.push(key);
		}
		if (keys.includes(ACCESS)) access[resource.key] = keys; // access yoksa hiçbir işlem yok
	}
	return access;
}

/** İzin var mı: can(access, 'grapes.crud.simple', 'update'). İşlem verilmezse erişim (access). */
export const can = (access: Access, resourceKey: string, action: string = ACCESS) => access[resourceKey]?.includes(action) ?? false;

/**
 * Adrese karşılık gelen sayfa kaynağı (gizli sayfalar dahil). Önce birebir eşleşme (href = adres); yoksa match: 'prefix'
 * olan kaynaklardan en uzun href (alt adresler: /app/x/[id]). Eşleşme yoksa undefined: sayfa hiçbir kaynakla
 * temsil edilmiyor (sıkı koruma: erişim yok).
 */
export function findPageResource<R extends Pick<AclResource, 'href' | 'match' | 'active'>>(resources: readonly R[], pathname: string): R | undefined {
	const path = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
	const pages = resources.filter((r) => r.active && r.href);
	const exact = pages.find((r) => r.href === path);
	if (exact) return exact;
	return pages.filter((r) => r.match === 'prefix' && hrefMatches(r.href, path)).sort((a, b) => b.href.length - a.href.length)[0];
}

/** Sayfaya erişebilir mi: adres bir kaynakla eşleşmeli ve o kaynakta access izni olmalı. */
export function canAccessPage(resources: readonly AclResource[], access: Access, pathname: string): boolean {
	const resource = findPageResource(resources, pathname);
	return resource !== undefined && can(access, resource.key);
}

/**
 * Adresin kaynak yolu (breadcrumb): kökten sayfaya [modül, …, sayfa]. Sayfa kaynağından (findPageResource) üst
 * kaynaklara çıkılır; menüde gizli ya da menüde olmayan sayfalar da doğru yolu verir. Kaynak yoksa [].
 */
export function resourceTrail<R extends Pick<AclResource, 'id' | 'parent' | 'href' | 'match' | 'active'>>(resources: readonly R[], pathname: string): R[] {
	const byId = new Map(resources.map((r) => [r.id, r]));
	const trail: R[] = [];
	for (let r = findPageResource(resources, pathname); r && trail.length < 50; r = r.parent ? byId.get(r.parent) : undefined) trail.unshift(r);
	return trail;
}

/**
 * Kullanıcının menüsü: aktif ve gizli olmayan menü kaynakları (modül, grup, sayfa) ağaç olarak; erişemediği sayfalar
 * ve altında sayfa kalmayan başlıklar budanır. Düğüm id'si kaynak anahtarıdır (key), başlık label (arayüz çeviriyi
 * t('acl.' + key, undefined, label) ile yapar). Alt menüsü olan modülün href'i yoktur: ray firstHref ile bağlanır.
 */
export function buildAccessMenu(resources: readonly AclResource[], access: Access): MenuNode[] {
	const keyOf = new Map(resources.map((r) => [r.id, r.key]));
	const records: MenuRecord[] = resources
		.filter((r) => r.active && !r.hidden && r.kind !== 'feature')
		.map((r) => ({
			id: r.key,
			parent_id: r.parent ? (keyOf.get(r.parent) ?? `?${r.parent}`) : null, // ebeveyni listede yoksa yetim kalır
			title: r.label,
			icon: r.icon || undefined,
			href: r.href || undefined,
			sort: r.sort
		}));
	return pruneTree(buildTree(records), (node) => can(access, node.id));
}
