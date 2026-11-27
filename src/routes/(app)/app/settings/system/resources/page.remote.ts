import { getRequestEvent, query, form, command, requested } from '$app/server';
import { error, invalid } from '@sveltejs/kit';
import { ResultAsync } from 'neverthrow';
import { Collections } from '#lib/types/pocketbase-types.js';
import { requirePermission } from '#lib/server/acl.js';
import { pageExists } from '#lib/server/routes.js';
import { throwError, throwFormError, mapUnknownToError } from '#lib/server/error.js';
import { buildTree, type MenuNode } from '#lib/app/menu/tree.js';
import { getMyAccess } from '#lib/remotes/acl.remote.js';
import {
	RESOURCES,
	ACTIONS,
	resourceCreateSchema,
	resourceUpdateSchema,
	actionCreateSchema,
	deleteManySchema,
	checkResource,
	type ResourceRow,
	type ActionRow,
	type ResourceDraft,
	type Kind
} from './page.shared';

// Kaynak (menü) ve işlem düzenleme. Okuma ve yazma kullanıcının kendi oturumuyla (PocketBase kuralları ikinci katman:
// yazma yönetici rolleri). Kurallar page.shared.ts → checkResource; href gerçek bir sayfa olmalı (server/routes.ts).
const RESOURCE = 'settings.system.resources';
const BATCH_SIZE = 50; // PocketBase batch API'nin varsayılan istek sınırı

type DbResource = Omit<ResourceRow, 'depth' | 'actions' | 'actionIds'> & { actions: string[] };
type DbAction = { id: string; key: string; label: string; sort: number };

const pb = () => getRequestEvent().locals.pb;
const read = async <T>(promise: Promise<T>): Promise<T> => {
	const result = await ResultAsync.fromPromise(promise, mapUnknownToError);
	if (result.isErr()) throwError(result.error);
	return result.value;
};
const loadResources = () => read(pb().collection(Collections.AclResources).getFullList({ sort: 'sort' })) as unknown as Promise<DbResource[]>;
const loadActions = () => read(pb().collection(Collections.AclActions).getFullList({ fields: 'id,key,label,sort', sort: 'sort' })) as Promise<DbAction[]>;

// Kurallar için bağlam (tüm kaynaklar, erişim işleminin id'si, sayfa denetimi)
async function context() {
	const [resources, actions] = await Promise.all([loadResources(), loadActions()]);
	return { resources, actions, ctx: { resources, accessActionId: actions.find((a) => a.key === 'access')?.id ?? '', pageExists } };
}

// Yazmalardan sonra: istemcinin istediği tablolar ve kullanıcının menüsü (kaynaklar menüdür) aynı yanıtta tazelenir
async function refresh() {
	await Promise.all([requested(getResources, 1).refreshAll(), requested(getActions, 1).refreshAll()]);
	void getMyAccess().refresh();
}

// ------------------------------------------------------------------------------------------------------------------------------
// Okuma (sayfalamasız; PocketBase liste biçiminde: hücre düzenleme ve optimistik güncelleme items üzerinden çalışır)
const asList = <T>(items: T[]) => ({ page: 1, perPage: items.length, totalItems: items.length, totalPages: 1, items });

export const getResources = query(RESOURCES.listParamsSchema, async () => {
	await requirePermission(RESOURCE, 'view'); // 🔒
	const [resources, actions] = await Promise.all([loadResources(), loadActions()]);
	const keyOf = new Map(actions.map((a) => [a.id, a.key]));
	const byId = new Map(resources.map((r) => [r.id, r]));
	const rows: ResourceRow[] = [];
	const walk = (nodes: MenuNode[], depth: number) => {
		for (const node of nodes) {
			const r = byId.get(node.id)!;
			rows.push({
				id: r.id,
				key: r.key,
				label: r.label,
				kind: r.kind,
				parent: r.parent,
				depth,
				icon: r.icon,
				href: r.href,
				match: r.match,
				sort: r.sort,
				active: r.active,
				hidden: r.hidden,
				actions: r.actions.map((id) => keyOf.get(id) ?? id),
				actionIds: r.actions
			});
			walk(node.children, depth + 1);
		}
	};
	walk(buildTree(resources.map((r) => ({ id: r.id, parent_id: r.parent || null, title: r.label, sort: r.sort }))), 0);
	return asList(rows);
});

export const getActions = query(ACTIONS.listParamsSchema, async () => {
	await requirePermission(RESOURCE, 'view'); // 🔒
	const [actions, resources] = await Promise.all([loadActions(), loadResources()]);
	return asList(actions.map((a): ActionRow => ({ ...a, used: resources.filter((r) => r.actions.includes(a.id)).length })));
});

// ------------------------------------------------------------------------------------------------------------------------------
// Kaynaklar

const toIssues = (issues: Record<string, string>) => Object.entries(issues).map(([field, message]) => ({ message, path: [field] }));

export const createResource = form(resourceCreateSchema, async (p) => {
	await requirePermission(RESOURCE, 'create'); // 🔒
	const { ctx } = await context();
	const draft: ResourceDraft = { key: p.key, kind: p.kind as Kind, parent: p.parent, icon: p.icon, href: p.href, match: p.match, actions: p.actions };
	const issues = checkResource(draft, ctx);
	if (Object.keys(issues).length) invalid(...toIssues(issues));

	const created = await ResultAsync.fromPromise(
		pb()
			.collection(Collections.AclResources)
			.create({ ...p, match: p.href ? p.match : '' }),
		mapUnknownToError
	);
	if (created.isErr()) throwFormError(created.error, p);
	await refresh();
	return created.value;
});

export const updateResource = form(resourceUpdateSchema, async (p) => {
	await requirePermission(RESOURCE, 'update'); // 🔒
	const { resources, ctx } = await context();
	const current = resources.find((r) => r.id === p.id);
	if (!current) error(404, 'error_not_found', { type: 'general', errorId: 'acl' });
	// Anahtar ve tür değişmez (formda yok); diğerleri formdan
	const draft: ResourceDraft = { id: p.id, key: current.key, kind: current.kind, parent: p.parent, icon: p.icon, href: p.href, match: p.match, actions: p.actions };
	const issues = checkResource(draft, ctx);
	if (Object.keys(issues).length) invalid(...toIssues(issues));

	const { id, ...data } = p;
	const updated = await ResultAsync.fromPromise(
		pb()
			.collection(Collections.AclResources)
			.update(id, { ...data, match: p.href ? p.match : '' }),
		mapUnknownToError
	);
	if (updated.isErr()) throwFormError(updated.error, p);
	await refresh();
	return updated.value;
});

// Hücre düzenleme: kayıt bazında birleştirilir, her kayıt kurallardan geçer (ilk ihlal 400 ile döner, hiçbiri yazılmaz)
export const updateResourceCells = command(RESOURCES.cellsEditSchema, async (edits) => {
	await requirePermission(RESOURCE, 'update'); // 🔒
	const { resources, ctx } = await context();
	const patches: Record<string, Record<string, unknown>> = {};
	for (const { id, field, value } of edits) patches[id] = { ...patches[id], [field]: value ?? (field === 'sort' ? 0 : '') };

	for (const [id, patch] of Object.entries(patches)) {
		const current = resources.find((r) => r.id === id);
		if (!current) error(404, 'error_not_found', { type: 'general', errorId: 'acl' });
		const next = { ...current, ...patch } as DbResource;
		const issues = Object.values(checkResource({ ...next, id }, ctx));
		if (issues.length) error(400, issues[0], { type: 'general', errorId: 'acl' });
	}
	await sendBatch(
		Object.entries(patches).map(
			([id, patch]) =>
				(b) =>
					b.collection(Collections.AclResources).update(id, patch)
		)
	);
	await refresh();
});

// Silme: alt kaynağı olan silinemez (PocketBase ilişkiyi sessizce boşaltır, çocuklar köke düşerdi). İzinleri cascade ile silinir.
export const deleteResources = command(deleteManySchema, async ({ ids }) => {
	await requirePermission(RESOURCE, 'delete'); // 🔒
	const resources = await loadResources();
	const deleting = new Set(ids);
	if (resources.some((r) => r.parent && deleting.has(r.parent) && !deleting.has(r.id))) error(400, 'acl_has_children', { type: 'general', errorId: 'acl' });
	// Çocuklar önce (aynı istekte üst ve alt birlikte silinebilir)
	const depth = (id: string): number => {
		const parent = resources.find((r) => r.id === id)?.parent;
		return parent ? 1 + depth(parent) : 0;
	};
	const ordered = [...ids].sort((a, b) => depth(b) - depth(a));
	await sendBatch(ordered.map((id) => (b) => b.collection(Collections.AclResources).delete(id)));
	await refresh();
	return { deleted: ids.length };
});

// ------------------------------------------------------------------------------------------------------------------------------
// İşlemler

export const createAction = form(actionCreateSchema, async (p) => {
	await requirePermission(RESOURCE, 'create'); // 🔒
	if (!/^[a-z0-9_]+$/.test(p.key)) invalid({ message: 'acl_action_key_pattern', path: ['key'] });
	const created = await ResultAsync.fromPromise(pb().collection(Collections.AclActions).create(p), mapUnknownToError);
	if (created.isErr()) throwFormError(created.error, p);
	await refresh();
	return created.value;
});

export const updateActionCells = command(ACTIONS.cellsEditSchema, async (edits) => {
	await requirePermission(RESOURCE, 'update'); // 🔒
	const patches: Record<string, Record<string, unknown>> = {};
	for (const { id, field, value } of edits) patches[id] = { ...patches[id], [field]: value ?? (field === 'sort' ? 0 : '') };
	await sendBatch(
		Object.entries(patches).map(
			([id, patch]) =>
				(b) =>
					b.collection(Collections.AclActions).update(id, patch)
		)
	);
	await refresh();
});

// `access` silinemez (sayfa erişiminin kendisi); bir kaynakta kullanılan işlem silinemez (önce kaynaklardan çıkarılır)
export const deleteActions = command(deleteManySchema, async ({ ids }) => {
	await requirePermission(RESOURCE, 'delete'); // 🔒
	const [actions, resources] = await Promise.all([loadActions(), loadResources()]);
	if (actions.some((a) => ids.includes(a.id) && a.key === 'access')) error(400, 'acl_action_access_fixed', { type: 'general', errorId: 'acl' });
	if (resources.some((r) => r.actions.some((id) => ids.includes(id)))) error(400, 'acl_action_in_use', { type: 'general', errorId: 'acl' });
	await sendBatch(ids.map((id) => (b) => b.collection(Collections.AclActions).delete(id)));
	await refresh();
	return { deleted: ids.length };
});

// ------------------------------------------------------------------------------------------------------------------------------
// PocketBase batch API: paralel tekil istekler SDK'nın otomatik iptaline takılabilir; her parça atomik.
type Batch = ReturnType<ReturnType<typeof pb>['createBatch']>;
async function sendBatch(ops: ((batch: Batch) => void)[]) {
	for (let i = 0; i < ops.length; i += BATCH_SIZE) {
		const batch = pb().createBatch();
		for (const op of ops.slice(i, i + BATCH_SIZE)) op(batch);
		const sent = await ResultAsync.fromPromise(batch.send(), mapUnknownToError);
		if (sent.isErr()) throwError(sent.error);
	}
}
