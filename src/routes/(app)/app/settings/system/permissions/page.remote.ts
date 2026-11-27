import { getRequestEvent, query, command, requested } from '$app/server';
import { error } from '@sveltejs/kit';
import { ResultAsync } from 'neverthrow';
import { Collections } from '#lib/types/pocketbase-types.js';
import { requirePermission, getAcl } from '#lib/server/acl.js';
import { throwError, mapUnknownToError } from '#lib/server/error.js';
import { resolvePermissions, can, type AclAction, type AclPermission, type AclResource, type AclRole } from '#lib/app/acl/access.js';
import { buildTree, type MenuNode } from '#lib/app/menu/tree.js';
import { getMyAccess } from '#lib/remotes/acl.remote.js';
import { matrixParamsSchema, setPermissionsSchema, parseSubject, ACTION_FIELD, type MatrixRow, type Effect } from './page.shared';

// Yetki ekranı. Okuma ve yazma kullanıcının kendi oturumuyla: PocketBase kuralları ikinci katmandır (yönetici
// olmayan diğer kullanıcıları ve onların kişisel satırlarını göremez; hiçbir satırı yazamaz).
const RESOURCE = 'settings.system.permissions';
const BATCH_SIZE = 50; // PocketBase batch API'nin varsayılan istek sınırı

type Role = AclRole & { label: string };
type User = { id: string; label: string; email: string; role: string[] };
type PermissionRow = AclPermission & { id: string };

const read = async <T>(promise: Promise<T>): Promise<T> => {
	const result = await ResultAsync.fromPromise(promise, mapUnknownToError);
	if (result.isErr()) throwError(result.error);
	return result.value;
};

const pb = () => getRequestEvent().locals.pb;
const loadActions = () =>
	read(pb().collection(Collections.AclActions).getFullList({ fields: 'id,key,label,sort', sort: 'sort' })) as Promise<(AclAction & { label: string })[]>;
const loadRoles = () => read(pb().collection(Collections.AclRoles).getFullList({ fields: 'id,label,type,status', sort: 'order' })) as Promise<Role[]>;

/** Ekranın üst kısmı: özne seçimi (roller, kullanıcılar), kolonlar (işlemler) ve düzenleme izni. */
export const getPermissionSubjects = query(async () => {
	await requirePermission(RESOURCE, 'view'); // 🔒
	const [actions, roles, users, { access }] = await Promise.all([
		loadActions(),
		loadRoles(),
		read(pb().collection(Collections.SysUsers).getFullList({ fields: 'id,label,email,role', sort: 'label' })) as Promise<User[]>,
		getAcl()
	]);
	return { actions, roles, users, canEdit: can(access, RESOURCE, 'update') };
});

/**
 * Seçilen öznenin matrisi (DataTable'ın verisi): satır = kaynak (ağaç sırası, derinlik), hücre = öznenin kendi satırı,
 * effective = etkin izinler (rol ve Herkes satırları da hesaba katılarak, sunucudaki kuralla: resolvePermissions).
 */
export const getPermissionMatrix = query(matrixParamsSchema, async ({ filterData }) => {
	await requirePermission(RESOURCE, 'view'); // 🔒
	const subject = parseSubject(filterData.subject);
	const [actions, roles, resources, permissions, user] = await Promise.all([
		loadActions(),
		loadRoles(),
		read(pb().collection(Collections.AclResources).getFullList({ sort: 'sort' })) as unknown as Promise<AclResource[]>,
		read(pb().collection(Collections.AclPermissions).getFullList({ fields: 'id,resource,action,role,user,effect' })) as Promise<PermissionRow[]>,
		subject.user ? (read(pb().collection(Collections.SysUsers).getOne(subject.user, { fields: 'id,role' })) as Promise<{ role: string[] }>) : undefined
	]);

	const subjectRoles = subject.role ? roles.filter((r) => r.id === subject.role) : user ? roles.filter((r) => user.role.includes(r.id)) : [];
	const access = resolvePermissions({ subject: { id: subject.user, roles: subjectRoles }, actions, resources, permissions });
	const keyOf = new Map(actions.map((a) => [a.id, a.key]));
	const own = new Map(permissions.filter((p) => p.role === subject.role && p.user === subject.user).map((p) => [`${p.resource}|${p.action}`, p.effect as Effect]));

	const byId = new Map(resources.map((r) => [r.id, r]));
	const rows: MatrixRow[] = [];
	const walk = (nodes: MenuNode[], depth: number) => {
		for (const node of nodes) {
			const r = byId.get(node.id)!;
			const row: MatrixRow = {
				id: r.id,
				key: r.key,
				label: r.label,
				kind: r.kind,
				depth,
				active: r.active,
				defined: r.actions.map((id) => keyOf.get(id)).filter((k) => k !== undefined),
				effective: access[r.key] ?? []
			};
			for (const a of actions) row[`${ACTION_FIELD}${a.key}`] = own.get(`${r.id}|${a.id}`) ?? null;
			rows.push(row);
			walk(node.children, depth + 1);
		}
	};
	walk(buildTree(resources.map((r) => ({ id: r.id, parent_id: r.parent || null, title: r.label, sort: r.sort }))), 0);
	return rows;
});

/**
 * Hücreler (tek düzenleme ya da yapıştırma): öznenin satırları oluşturulur, güncellenir ya da silinir (effect null).
 * İşlem kaynakta tanımlı olmalı; engel yalnızca kişisel (şema). Matris ve kullanıcının menüsü aynı yanıtta tazelenir.
 */
export const setPermissions = command(setPermissionsSchema, async ({ subject: value, edits }) => {
	await requirePermission(RESOURCE, 'update'); // 🔒
	const subject = parseSubject(value);
	const collection = pb().collection(Collections.AclPermissions);

	const [resources, existing] = await Promise.all([
		read(pb().collection(Collections.AclResources).getFullList({ fields: 'id,actions' })) as Promise<{ id: string; actions: string[] }[]>,
		read(collection.getFullList({ fields: 'id,resource,action', filter: pb().filter('role = {:role} && user = {:user}', subject) })) as Promise<PermissionRow[]>
	]);
	const defined = new Map(resources.map((r) => [r.id, new Set(r.actions)]));
	if (edits.some((e) => !defined.get(e.resource)?.has(e.action))) error(400, 'acl_action_not_defined', { type: 'general', errorId: 'acl' });

	// PocketBase batch API: paralel tekil istekler SDK'nın otomatik iptaline takılır (aynı adrese giden create'ler).
	// Her parça atomiktir (kurallar ve hook'lar satır satır uygulanır); PocketBase'in varsayılan sınırı 50 istek.
	const rowOf = new Map(existing.map((p) => [`${p.resource}|${p.action}`, p.id]));
	type Op = { id?: string; data?: { resource: string; action: string; role: string; user: string; effect: Effect } }; // data yoksa silme
	const ops = edits.flatMap((e): Op[] => {
		const id = rowOf.get(`${e.resource}|${e.action}`);
		if (e.effect === null) return id ? [{ id }] : []; // silinecek satır yoksa iş yok
		return [{ id, data: { resource: e.resource, action: e.action, role: subject.role, user: subject.user, effect: e.effect } }];
	});
	let failure: unknown;
	for (let i = 0; i < ops.length && !failure; i += BATCH_SIZE) {
		const batch = pb().createBatch();
		for (const op of ops.slice(i, i + BATCH_SIZE)) {
			const target = batch.collection(Collections.AclPermissions);
			if (!op.data) target.delete(op.id!);
			else if (op.id) target.update(op.id, { effect: op.data.effect });
			else target.create(op.data);
		}
		const sent = await ResultAsync.fromPromise(batch.send(), mapUnknownToError);
		if (sent.isErr()) failure = sent.error;
	}

	// Hata olsa da tazelenir: önceki parçalar kaydedilmiş olabilir, tablo gerçek durumu göstersin
	await requested(getPermissionMatrix, 1).refreshAll();
	void getMyAccess().refresh();
	if (failure) throwError(failure);
	return { saved: edits.length };
});
