import { SvelteMap } from 'svelte/reactivity';
import { getSelectedLang, t } from '#lib/app/localization/index.js';
import type { Column, Field, Row } from './types.js';
import type { CellPos } from './navigation.svelte.js';
import type { Attachment } from 'svelte/attachments';

/**
 * Hücre düzenleme.
 *
 * - Kolon `editable: true` ise ve DataTable'a `onCellEdit` verildiyse düzenlenir. Tablo veriyi kendisi yazmaz;
 *   değişikliği onCellEdit ile sayfaya bildirir, sayfa kaydeder (ve sorguyu tazeler).
 * - Başlatma: F2 / Enter (mevcut değerle, tamamı seçili), yazmaya başlamak (yazılan karakterle), Backspace (boş),
 *   çift tıklama. bool kolon düzenleyici açmaz, değeri anında tersine çevirir.
 * - Bitirme: Enter (alt satıra), Shift+Enter (üste), Tab / Shift+Tab (yana), ↑ ↓ (metin/sayı), dışarı tıklama
 *   (yerinde) kaydeder; Esc iptal eder. Her durumda odak grid'e (aktif hücreye) döner.
 * - Doğrulama (forms'taki preflight gibi): `validateCell` mesaj döndürürse kaydedilmez, düzenleyici açık kalır ve
 *   mesaj hücrenin altında gösterilir.
 * - Optimistik görünüm tablonun değil SvelteKit'in işidir: sayfa onCellEdit'te `query.withOverride` (bkz.
 *   ListState.updatesWith) ile yeni değeri hemen gösterir; istek hata verirse override kendiliğinden geri alınır.
 *   Tablo yalnızca istek sürerken hücreyi "kaydediliyor" olarak işaretler.
 */

export type EditorKind = 'text' | 'number' | 'bool' | 'date' | 'datetime' | 'select';

export type CellEditEvent<TData> = {
	row: TData;
	field: Field<TData>;
	value: unknown; // text: string | number: number | null | bool: boolean | date: 'YYYY-MM-DD' | null | datetime: ISO | null | select: string | null
	oldValue: unknown;
};

export interface EditorHost<TData extends Row> {
	items(): TData[];
	column(col: number): Column<TData> | undefined;
	canSave(): boolean; // onCellEdit verildi mi
	save(e: CellEditEvent<TData>): void | Promise<void>;
	validate(e: CellEditEvent<TData>): string | undefined; // mesaj → geçersiz
	focusGrid(): void;
	move(pos: CellPos): void; // kaydettikten sonra imleci taşı (görünür alana kaydırarak)
}

// Kolon tipine göre düzenleyici; bu tip düzenlenemiyorsa (list/json/actions/select) undefined.
// Düzenlenebilir olup olmadığı ayrıca kontrol edilir (bkz. CellEditor.kindAt).
export const editorOf = <TData>(col: Column<TData> | undefined): EditorKind | undefined => {
	if (!col) return undefined;
	if (col.options) return 'select';
	switch (col.type ?? 'text') {
		case 'text':
			return 'text';
		case 'number':
			return 'number';
		case 'bool':
			return 'bool';
		case 'date':
			return 'date';
		case 'datetime':
			return 'datetime';
		default:
			return undefined;
	}
};

const pad = (n: number) => String(n).padStart(2, '0');

// Değer → düzenleyicideki metin (input value)
const toDraft = (kind: EditorKind, value: unknown): string => {
	if (value === null || value === undefined || value === '') return '';
	// Sayı tabloda nasıl görünüyorsa öyle (tr: 747,44); gruplama yok. fromDraft virgülü de noktayı da kabul eder.
	if (kind === 'number' && typeof value === 'number') return new Intl.NumberFormat(getSelectedLang(), { useGrouping: false, maximumFractionDigits: 20 }).format(value);
	if (kind === 'date') return String(value).slice(0, 10); // PocketBase '2026-11-17 00:00:00.000Z' → '2026-11-17'
	if (kind === 'datetime') {
		const d = new Date(String(value).replace(' ', 'T'));
		if (Number.isNaN(d.getTime())) return '';
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`; // datetime-local (yerel saat)
	}
	return String(value);
};

// Düzenleyicideki metin → değer. Geçersizse { ok: false } (düzenleyici açık kalır)
const fromDraft = (kind: EditorKind, draft: string): { ok: true; value: unknown } | { ok: false } => {
	const text = draft.trim();
	switch (kind) {
		case 'number': {
			if (text === '') return { ok: true, value: null };
			const n = Number(text.replace(',', '.'));
			return Number.isFinite(n) ? { ok: true, value: n } : { ok: false };
		}
		case 'date':
		case 'select':
			return { ok: true, value: text === '' ? null : text };
		case 'datetime': {
			if (text === '') return { ok: true, value: null };
			const d = new Date(text); // yerel saat
			return Number.isNaN(d.getTime()) ? { ok: false } : { ok: true, value: d.toISOString() };
		}
		default:
			return { ok: true, value: draft };
	}
};

type Editing = { row: number; col: number; kind: EditorKind; draft: string; initial: string; selectAll: boolean; error?: string };

export class CellEditor<TData extends Row> {
	readonly #host: EditorHost<TData>;
	#editing = $state<Editing | undefined>(undefined);
	// Kaydedilen hücreler (`${id}\u0000${field}` → süren istek sayısı): yalnızca görünüm için ("kaydediliyor")
	readonly #saving = new SvelteMap<string, number>();
	// DataCell'den gelen hücre bazında düzenlenebilirlik (kayıt id + alan → boolean); kolondaki editable'ı geçersiz kılar.
	// Anahtar satır sırası değil id: veri yenilenip başka kayıt aynı sıraya gelince eski hücrenin temizliği karışmasın.
	readonly #overrides = new SvelteMap<string, boolean>();

	constructor(host: EditorHost<TData>) {
		this.#host = host;
	}

	get editing() {
		return this.#editing;
	}

	readonly isEditing = (row: number, col: number) => this.#editing?.row === row && this.#editing.col === col;

	/**
	 * DataCell'e bağlanır: o hücrenin düzenlenebilirliğini bildirir, hücre DOM'dan kalkınca kayıt silinir.
	 * <DataCell {dr} {dc} editable={row.status === 'draft'} />
	 */
	readonly override =
		(id: Row['id'], field: string, editable: boolean): Attachment =>
		() => {
			const key = this.#key(id, field);
			this.#overrides.set(key, editable);
			return () => {
				if (this.#overrides.get(key) === editable) this.#overrides.delete(key);
			};
		};

	// Hücre düzenlenebilir mi: DataCell'deki editable > kolondaki editable (boolean ya da (row) => boolean)
	readonly isEditable = (pos: CellPos): boolean => {
		const row = this.#host.items()[pos.row];
		const col = this.#host.column(pos.col);
		if (!row || !col) return false;
		const override = this.#overrides.get(this.#key(row.id, col.field));
		if (override !== undefined) return override;
		return typeof col.editable === 'function' ? col.editable(row) : col.editable === true;
	};

	readonly kindAt = (pos: CellPos) => (this.#host.canSave() && this.isEditable(pos) ? editorOf(this.#host.column(pos.col)) : undefined);

	readonly setDraft = (draft: string) => {
		if (!this.#editing) return;
		this.#editing.draft = draft;
		this.#editing.error = undefined; // yazdıkça hata mesajı kalkar
	};

	#valueOf = (row: TData, field: string): unknown => (row as Record<string, unknown>)[field];

	/** Düzenlemeyi başlatır. typed: yazmaya başlarken ilk karakter ('' → boş başlar); verilmezse mevcut değer, tamamı seçili. */
	readonly start = (pos: CellPos, typed?: string): boolean => {
		const kind = this.kindAt(pos);
		const row = this.#host.items()[pos.row];
		const field = this.#host.column(pos.col)?.field;
		if (!kind || !row || !field) return false;
		const current = this.#valueOf(row, field);

		if (kind === 'bool') {
			const e = { row, field, value: !current, oldValue: current };
			if (this.#host.validate(e) === undefined) this.#save(e);
			return true;
		}
		const initial = toDraft(kind, current);
		// Tarih ve liste yazılan karakteri kabul etmez: yalnızca açılır
		const draft = typed !== undefined && (kind === 'text' || kind === 'number') ? typed : initial;
		this.#editing = { row: pos.row, col: pos.col, kind, draft, initial, selectAll: typed === undefined };
		return true;
	};

	readonly cancel = () => {
		if (!this.#editing) return;
		this.#editing = undefined;
		this.#host.focusGrid();
	};

	/**
	 * Doğrular, kaydeder ve kapatır; move verilirse imleç oraya gider. Geçersizse açık kalır, mesajı gösterir, false döner.
	 * refocus: false → odak grid'e çekilmez (blur: kullanıcı başka bir alana geçiyor olabilir).
	 */
	readonly commit = (move?: { dr: number; dc: number }, refocus = true): boolean => {
		const editing = this.#editing;
		if (!editing) return true;
		const row = this.#host.items()[editing.row];
		const field = this.#host.column(editing.col)?.field;
		if (row && field && editing.draft !== editing.initial) {
			const parsed = fromDraft(editing.kind, editing.draft);
			if (!parsed.ok) {
				editing.error = t('dt_invalid_value');
				return false;
			}
			const e = { row, field, value: parsed.value, oldValue: this.#valueOf(row, field) };
			const error = this.#host.validate(e);
			if (error !== undefined) {
				editing.error = error;
				return false;
			}
			this.#save(e);
		}
		this.#editing = undefined;
		if (refocus) this.#host.focusGrid();
		if (move) this.#host.move({ row: editing.row + move.dr, col: editing.col + move.dc });
		return true;
	};

	#key = (id: Row['id'], field: string) => `${id}\u0000${field}`;

	readonly isSaving = (id: Row['id'], field: string) => (this.#saving.get(this.#key(id, field)) ?? 0) > 0;

	// onCellEdit eşzamanlı çağrılır: sayfanın withOverride'ı düzenleyici kapanmadan uygulanır (eski değer bir an görünmez)
	#save = (e: CellEditEvent<TData>) => {
		const key = this.#key(e.row.id, e.field);
		this.#saving.set(key, (this.#saving.get(key) ?? 0) + 1);
		const done = () => {
			const n = (this.#saving.get(key) ?? 1) - 1;
			if (n > 0) this.#saving.set(key, n);
			else this.#saving.delete(key);
		};
		try {
			Promise.resolve(this.#host.save(e)).then(done, done); // hata: sayfa gösterir, override SvelteKit'çe geri alınır
		} catch {
			done();
		}
	};

	/** Grid tuşları (düzenleme kapalıyken). İşlenirse true. */
	readonly handleKey = (e: KeyboardEvent, active: CellPos | undefined): boolean => {
		if (!active || this.#editing || e.ctrlKey || e.metaKey || e.altKey) return false;
		const kind = this.kindAt(active);
		if (!kind) return false;
		if (e.key === 'F2' || e.key === 'Enter') return this.start(active);
		if (kind === 'bool') return false; // bool yalnızca F2/Enter/çift tıklama ile değişir (yanlışlıkla yazılan harf değiştirmesin)
		if (e.key === 'Backspace') return this.start(active, '');
		if (e.key.length === 1 && e.key !== ' ') return this.start(active, e.key); // yazılabilir karakter
		return false;
	};
}
