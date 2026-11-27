import * as v from 'valibot';

// Yetki ekranının istemci ve sunucuda ortak tanımları.

// Özne: 'everyone' (Herkes), 'role:<id>', 'user:<id>'. Select'in değeri ve matris sorgusunun filtresi.
export const subjectSchema = v.pipe(v.string(), v.regex(/^(everyone|role:[a-z0-9]{15}|user:[a-z0-9]{15})$/));
export type Subject = { kind: 'everyone' | 'role' | 'user'; role: string; user: string };
export const parseSubject = (value: string): Subject => {
	const [kind, id = ''] = value.split(':');
	if (kind === 'role') return { kind, role: id, user: '' };
	if (kind === 'user') return { kind, role: '', user: id };
	return { kind: 'everyone', role: '', user: '' };
};

// Matris sorgusu (DataTable createList): sayfalama ve sıralama yok; filtre yalnızca özne
export const matrixParamsSchema = v.object({
	page: v.optional(v.number(), 1),
	perPage: v.optional(v.number(), 1000),
	options: v.optional(v.object({ sort: v.optional(v.string()) }), {}),
	filterData: v.object({ subject: v.optional(subjectSchema, 'everyone') }),
	timestamp: v.optional(v.number(), 0)
});

// Hücre kolonları işlem anahtarıyla adlandırılır: act_<acl_actions.key> (satırın diğer alanlarıyla çakışmasın)
export const ACTION_FIELD = 'act_';
export type Effect = 'allow' | 'deny';

// Satır = kaynak. Hücre değerleri: öznenin kendi satırı (allow / deny) ya da null (belirtilmemiş).
export type MatrixRow = {
	id: string; // kaynak id
	key: string;
	label: string;
	kind: 'module' | 'group' | 'page' | 'feature';
	depth: number;
	active: boolean;
	defined: string[]; // bu kaynakta tanımlı işlem anahtarları
	effective: string[]; // öznenin etkin izinli işlem anahtarları (önizleme)
	[cell: `${typeof ACTION_FIELD}${string}`]: Effect | null;
};

// Toplu kayıt (hücre düzenleme ve yapıştırma): özne + hücreler. effect null → satır silinir (belirtilmemiş).
export const setPermissionsSchema = v.pipe(
	v.object({
		subject: subjectSchema,
		edits: v.pipe(
			v.array(
				v.object({
					resource: v.pipe(v.string(), v.nonEmpty()),
					action: v.pipe(v.string(), v.nonEmpty()),
					effect: v.nullable(v.picklist(['allow', 'deny']))
				})
			),
			v.minLength(1),
			v.maxLength(1000)
		)
	}),
	// Engel yalnızca kişisel: rol ve Herkes satırlarında yalnızca izin
	v.check((p) => p.subject.startsWith('user:') || p.edits.every((e) => e.effect !== 'deny'), 'acl_role_deny')
);
