import { getRequestEvent } from '$app/server';
import { error, redirect } from '@sveltejs/kit';
import { ResultAsync } from 'neverthrow';
import { Collections } from '#lib/types/pocketbase-types.js';
import { mapUnknownToError, throwError } from '#lib/server/error.js';
import { resolvePermissions, can, ACCESS, type Access, type AclAction, type AclPermission, type AclResource, type AclRole } from '#lib/app/acl/access.js';

// Yetki: sunucu tarafı (remote fonksiyonlar). Kayıtlar kullanıcının kendi PocketBase oturumuyla okunur; okuma kuralları
// zaten yalnızca kendi satırlarını, rollerinin satırlarını ve Herkes satırlarını döndürür. Etkin izin app/acl/access.ts'te
// hesaplanır. Sonuç istek başına bir kez hesaplanır (aynı istekte birden çok kontrol tek okuma yapar).

export type Acl = { resources: AclResource[]; access: Access };

const cache = new WeakMap<App.Locals, Promise<Acl>>();

const RESOURCE_FIELDS = 'id,key,label,kind,parent,icon,href,match,sort,active,hidden,actions';

async function load(locals: App.Locals): Promise<Acl> {
	const user = locals.user;
	if (!user?.id) return { resources: [], access: {} };

	const pb = locals.pb;
	const result = await ResultAsync.fromPromise(
		Promise.all([
			pb.collection(Collections.AclActions).getFullList({ fields: 'id,key' }),
			pb.collection(Collections.AclResources).getFullList({ fields: RESOURCE_FIELDS, sort: 'sort' }),
			pb.collection(Collections.AclPermissions).getFullList({ fields: 'resource,action,role,user,effect' }),
			pb.collection(Collections.SysUsers).getOne(user.id, { expand: 'role', fields: 'expand.role.id,expand.role.type,expand.role.status' })
		]),
		mapUnknownToError
	);
	if (result.isErr()) throwError(result.error);

	const [actions, resources, permissions, me] = result.value;
	const roles = ((me.expand as { role?: AclRole[] } | undefined)?.role ?? []).map(({ id, type, status }) => ({ id, type, status }));
	const list = resources as unknown as AclResource[];
	const access = resolvePermissions({
		subject: { id: user.id, roles },
		actions: actions as AclAction[],
		resources: list,
		permissions: permissions as unknown as AclPermission[]
	});
	return { resources: list, access };
}

/** Oturumdaki kullanıcının kaynakları ve etkin izinleri (istek başına bir kez okunur). Oturum yoksa boş. */
export function getAcl(): Promise<Acl> {
	const { locals } = getRequestEvent();
	let acl = cache.get(locals);
	if (!acl) cache.set(locals, (acl = load(locals)));
	return acl;
}

/**
 * Remote fonksiyonun başında (checkAuthenticated yerine): oturum yoksa girişe yönlendirir, izin yoksa 403 fırlatır.
 * `await requirePermission('grapes.crud.simple', 'update')`. İşlem verilmezse erişim (access).
 */
export async function requirePermission(resourceKey: string, action: string = ACCESS): Promise<void> {
	const { locals } = getRequestEvent();
	if (!locals.user?.id) redirect(307, '/login');
	const { access } = await getAcl();
	if (!can(access, resourceKey, action)) error(403, 'error_forbidden', { type: 'general', errorId: 'forbidden' });
}
