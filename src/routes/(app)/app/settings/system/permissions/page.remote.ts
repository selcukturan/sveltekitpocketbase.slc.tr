import { getRequestEvent, query, command } from '$app/server';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import { ResultAsync } from 'neverthrow';
import { ClientResponseError } from 'pocketbase';
import { Collections } from '#lib/types/pocketbase-types.js';
import { requirePermission, getAcl } from '#lib/server/acl.js';
import { throwError, mapUnknownToError } from '#lib/server/error.js';
import { can } from '#lib/app/acl/access.js';
import type { AclAction, AclPermission, AclResource, AclRole } from '#lib/app/acl/access.js';
import { getMyAccess } from '#lib/remotes/acl.remote.js';

// Yetki ekranı. Okuma ve yazma kullanıcının kendi oturumuyla: PocketBase kuralları ikinci katmandır (yönetici
// olmayan diğer kullanıcıları ve onların kişisel satırlarını göremez; hiçbir satırı yazamaz).
const RESOURCE = 'settings.system.permissions';

export type PermissionRow = AclPermission & { id: string };
export type PermissionUser = { id: string; label: string; email: string; role: string[] };

export const getPermissionData = query(async () => {
	await requirePermission(RESOURCE, 'view'); // 🔒

	const { locals } = getRequestEvent();
	const pb = locals.pb;
	const result = await ResultAsync.fromPromise(
		Promise.all([
			pb.collection(Collections.AclActions).getFullList({ fields: 'id,key,label,sort', sort: 'sort' }),
			pb.collection(Collections.AclResources).getFullList({ sort: 'sort' }),
			pb.collection(Collections.AclRoles).getFullList({ fields: 'id,label,type,status,order', sort: 'order' }),
			pb.collection(Collections.SysUsers).getFullList({ fields: 'id,label,email,role', sort: 'label' }),
			pb.collection(Collections.AclPermissions).getFullList({ fields: 'id,resource,action,role,user,effect' })
		]),
		mapUnknownToError
	);
	if (result.isErr()) throwError(result.error);

	const [actions, resources, roles, users, permissions] = result.value;
	const { access } = await getAcl();
	return {
		actions: actions as unknown as (AclAction & { label: string })[],
		resources: resources as unknown as AclResource[],
		roles: roles as unknown as (AclRole & { label: string })[],
		users: users as unknown as PermissionUser[],
		permissions: permissions as unknown as PermissionRow[],
		canEdit: can(access, RESOURCE, 'update')
	};
});

// Bir hücre: kaynak + işlem + özne (rol, kullanıcı ya da ikisi boş = Herkes). effect '' → satır silinir (belirtilmemiş).
const setPermissionSchema = v.pipe(
	v.object({
		resource: v.pipe(v.string(), v.nonEmpty()),
		action: v.pipe(v.string(), v.nonEmpty()),
		role: v.string(),
		user: v.string(),
		effect: v.picklist(['allow', 'deny', ''])
	}),
	v.check((p) => !(p.role && p.user), 'acl_invalid_subject'),
	v.check((p) => !(!p.user && p.effect === 'deny'), 'acl_role_deny') // rol ve Herkes satırlarında yalnızca allow
);

export const setPermission = command(setPermissionSchema, async (p) => {
	await requirePermission(RESOURCE, 'update'); // 🔒

	const { locals } = getRequestEvent();
	const pb = locals.pb;
	const collection = pb.collection(Collections.AclPermissions);

	// İşlem bu kaynakta tanımlı olmalı (tanımsız işlemin satırı etkisizdir; karışıklık yaratmasın)
	const resource = await ResultAsync.fromPromise(pb.collection(Collections.AclResources).getOne(p.resource, { fields: 'actions' }), mapUnknownToError);
	if (resource.isErr()) throwError(resource.error);
	if (!(resource.value.actions as string[]).includes(p.action)) error(400, 'acl_action_not_defined', { type: 'general', errorId: 'acl' });

	const filter = pb.filter('resource = {:resource} && action = {:action} && role = {:role} && user = {:user}', p);
	const existing = await collection.getFirstListItem(filter, { fields: 'id' }).catch((err: unknown) => {
		if (err instanceof ClientResponseError && err.status === 404) return null;
		throwError(err);
	});

	const write: Promise<unknown> = !p.effect
		? existing
			? collection.delete(existing.id)
			: Promise.resolve()
		: existing
			? collection.update(existing.id, { effect: p.effect })
			: collection.create({ resource: p.resource, action: p.action, role: p.role, user: p.user, effect: p.effect });
	const result = await ResultAsync.fromPromise(write, mapUnknownToError);
	if (result.isErr()) throwError(result.error);

	// Ekran ve (kendi izinleri değişmiş olabilir) menü aynı yanıtta tazelenir
	void getPermissionData().refresh();
	void getMyAccess().refresh();
});
