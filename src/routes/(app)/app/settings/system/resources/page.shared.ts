import * as v from 'valibot';
import * as input from '#lib/app/schemas/inputs/index.js';
import { Collections } from '#lib/types/pocketbase-types.js';
import { defineTable } from '#lib/components/ui/datatable/utils/table.js'; // saf: sunucuda da kullanılır
import { icons } from '#lib/components/icons/icons.svelte.js';
import { errorKeys, inputMeta } from '#lib/app/schemas/inputs/meta.js';

// Kaynak (menü) ve işlem düzenleme ekranının istemci ve sunucuda ortak tanımları.

export const KINDS = ['module', 'group', 'page', 'feature'] as const;
export const MATCHES = ['exact', 'prefix'] as const;
export const ICONS = Object.keys(icons);
export type Kind = (typeof KINDS)[number];

// Adres: uygulama içi yol (/app/...). input.Text'in karakter kısıtı '/' kabul etmediği için ayrı şema; sayfanın
// gerçekten var olduğu sunucuda denetlenir (checkResource → pageExists).
const HREF = /^(\/[A-Za-z0-9_\-.[\]/]*)?$/;
const hrefSchema = v.pipe(
	v.optional(v.string(), ''),
	v.trim(),
	v.regex(HREF, 'acl_href_format'),
	v.maxLength(300, errorKeys.maxLength),
	inputMeta({ required: false, min: 0, max: 300 })
);

// ------------------------------------------------------------------------------------------------------------------------------
// Kaynaklar tablosu. Satırlar ağaç sırasıyla gelir (sıralama yok). Anahtar (key) ve tür oluşturulduktan sonra değişmez
// (kod requirePermission('anahtar') ile kullanır); üst kaynak ve işlemler drawer formundan.
export const RESOURCES = defineTable({
	defaultSort: '',
	perPage: 1000,
	columns: {
		label: { label: 'acl_res_label', width: 'minmax(220px,2fr)', edit: v.pipe(v.string(), v.trim(), v.nonEmpty('err_required')) },
		key: { label: 'acl_res_key', width: 'minmax(200px,1.5fr)' },
		kind: { label: 'acl_res_kind', width: '100px' },
		icon: { label: 'acl_res_icon', width: '140px', options: ICONS, edit: true },
		href: { label: 'acl_res_href', width: 'minmax(200px,1.5fr)', edit: v.pipe(v.string(), v.trim(), v.regex(HREF, 'acl_href_format')) },
		match: { label: 'acl_res_match', width: '100px', options: MATCHES, edit: true },
		sort: { label: 'acl_res_sort', type: 'number', width: '80px', edit: v.nullable(v.pipe(v.number(), v.integer())) },
		active: { label: 'acl_res_active', type: 'bool', width: '80px', edit: true },
		hidden: { label: 'acl_res_hidden', type: 'bool', width: '80px', edit: true },
		actions: { label: 'acl_res_actions', type: 'list', width: 'minmax(200px,1.5fr)' }
	}
});

// Satır: kaynak + ağaçtaki derinlik; actions işlem anahtarları (görünüm), actionIds formda
export type ResourceRow = {
	id: string;
	key: string;
	label: string;
	kind: Kind;
	parent: string;
	depth: number;
	icon: string;
	href: string;
	match: string;
	sort: number;
	active: boolean;
	hidden: boolean;
	actions: string[];
	actionIds: string[];
};

// Formlar: üst kaynak ve işlemler veritabanından gelen seçeneklerle (Select'e options sayfada verilir)
const resourceFields = {
	...input.Text('label', { max: 200 }),
	...input.Relation('parent', { collection: Collections.AclResources, required: false }),
	...input.Text('icon', { required: false, max: 50 }),
	href: hrefSchema,
	...input.Select('match', { required: false, values: MATCHES }),
	...input.Number('sort', { required: false, onlyInt: true }),
	...input.Relation('actions', { collection: Collections.AclActions, required: false, multiple: true }),
	...input.Bool('active'),
	...input.Bool('hidden')
};
export const resourceCreateSchema = v.object({
	...input.Text('key', { max: 100 }),
	...input.Select('kind', { values: KINDS }),
	...resourceFields
});
export const resourceUpdateSchema = v.object({ ...input.Hidden('id'), ...resourceFields });

// ------------------------------------------------------------------------------------------------------------------------------
// İşlemler tablosu ve formu. Anahtar değişmez; `access` silinemez; bir kaynakta kullanılan işlem silinemez.
export const ACTIONS = defineTable({
	defaultSort: '',
	perPage: 1000,
	columns: {
		label: { label: 'acl_res_label', width: 'minmax(160px,2fr)', edit: v.pipe(v.string(), v.trim(), v.nonEmpty('err_required')) },
		key: { label: 'acl_res_key', width: 'minmax(120px,1fr)' },
		sort: { label: 'acl_res_sort', type: 'number', width: '80px', edit: v.nullable(v.pipe(v.number(), v.integer())) },
		used: { label: 'acl_act_used', type: 'number', width: '90px' }
	}
});
export type ActionRow = { id: string; key: string; label: string; sort: number; used: number };
export const actionCreateSchema = v.object({
	...input.Text('key', { max: 50 }),
	...input.Text('label', { max: 200 }),
	...input.Number('sort', { required: false, onlyInt: true })
});

export const deleteManySchema = v.object({ ids: v.pipe(v.array(v.pipe(v.string(), v.nonEmpty())), v.minLength(1), v.maxLength(1000)) });

// ------------------------------------------------------------------------------------------------------------------------------
// Kaynak kuralları (saf): form ve hücre düzenlemede sunucuda denetlenir. Sonuç: alan → çeviri anahtarı.
export type ResourceDraft = {
	id?: string;
	key: string;
	kind: Kind;
	parent: string;
	icon: string;
	href: string;
	match: string;
	actions: string[]; // işlem id'leri
};
export type ResourceContext = {
	resources: { id: string; kind: Kind; parent: string }[];
	accessActionId: string;
	pageExists: (href: string) => boolean;
};

export function checkResource(r: ResourceDraft, ctx: ResourceContext): Record<string, string> {
	const issues: Record<string, string> = {};
	if (!/^[a-z0-9_]+(\.[a-z0-9_]+)*$/.test(r.key)) issues.key = 'acl_key_pattern';

	// Ağaç: modül ve özellik kökte; grup ve sayfa bir modül ya da grubun altında; döngü yok
	const byId = new Map(ctx.resources.map((x) => [x.id, x]));
	if (r.kind === 'module' || r.kind === 'feature') {
		if (r.parent) issues.parent = 'acl_parent_root';
	} else if (!r.parent) issues.parent = 'acl_parent_required';
	else {
		const parent = byId.get(r.parent);
		if (!parent || (parent.kind !== 'module' && parent.kind !== 'group')) issues.parent = 'acl_parent_kind';
		for (let p = parent, guard = 0; p && guard < 100; p = byId.get(p.parent), guard++) if (p.id === r.id) issues.parent = 'acl_parent_cycle';
	}

	// Adres: sayfada zorunlu, grup ve özellikte yok, modülde isteğe bağlı (alt menüsü yoksa). Gerçek bir sayfa olmalı.
	if (r.kind === 'page' && !r.href) issues.href = 'acl_href_required';
	if ((r.kind === 'group' || r.kind === 'feature') && r.href) issues.href = 'acl_href_none';
	if (r.href && !ctx.pageExists(r.href)) issues.href = 'acl_href_no_page';
	if (r.href && !r.match) issues.match = 'acl_match_required';

	// Modül rayda ikonla görünür; ikon listede olmalı
	if (r.kind === 'module' && !r.icon) issues.icon = 'acl_icon_required';
	if (r.icon && !ICONS.includes(r.icon)) issues.icon = 'acl_icon_unknown';

	// Sayfası olan ya da özellik: erişim işlemi olmadan kimse açamaz
	if ((r.href || r.kind === 'feature') && !r.actions.includes(ctx.accessActionId)) issues.actions = 'acl_actions_access';
	return issues;
}
