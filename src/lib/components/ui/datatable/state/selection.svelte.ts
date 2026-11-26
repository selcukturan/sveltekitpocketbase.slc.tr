import type { Row } from '../types.js';

/**
 * Satır seçimi.
 *
 * - Seçim satır `id`'leriyle tutulur (index değil): tazeleme, sıralama ve sayfa değişiminde doğru kayıtlar seçili kalır.
 *   Sayfalar arası korunur; başlıktaki onay kutusu yalnızca yüklü sayfayı etkiler.
 * - Doğruluk kaynağı DataTable'ın `bind:selected` prop'udur (dizi). Hücreler hızlı arama için türetilmiş Set'i okur.
 *   Sayfa bağlamazsa prop yerel olarak yazılır (Svelte'te bağlanmamış prop'a yazmak yerel değer olur).
 *
 * Fare: seçim kolonunda tıklama değiştirir, Shift+tıklama aralık seçer. single modda satıra tıklamak seçer.
 * multiple modda Ctrl/⌘+tıklama değiştirir; düz tıklama yalnızca hücreyi aktif yapar (seçim bozulmasın).
 * Klavye: Space değiştirir, Shift+Space aralık, Ctrl/⌘+A sayfayı seçer, Esc temizler.
 */

export type SelectionMode = 'none' | 'single' | 'multiple';
export type RowId = Row['id'];

export interface SelectionHost<TData extends Row> {
	mode(): SelectionMode;
	items(): TData[];
	value(): RowId[]; // bind:selected (okuma)
	setValue(ids: RowId[]): void; // bind:selected (yazma)
	onChange(ids: RowId[]): void;
}

// Hızlı arama için salt okunur id kümesi. Reaktif state değil: her değişiklikte yeni dizi commit edilir,
// küme ondan türetilir; bu yüzden SvelteSet gerekmez.
const idSet = (ids: Iterable<RowId>): ReadonlySet<RowId> => new Set(ids);

export class RowSelection<TData extends Row> {
	readonly #host: SelectionHost<TData>;
	#anchor: RowId | undefined = undefined; // Shift ile aralık seçiminin sabit ucu (son değiştirilen satır)

	constructor(host: SelectionHost<TData>) {
		this.#host = host;
	}

	readonly mode = $derived.by(() => this.#host.mode());
	readonly enabled = $derived.by(() => this.#host.mode() !== 'none');
	readonly #set = $derived.by(() => idSet(this.#host.value() ?? []));
	readonly count = $derived.by(() => this.#set.size);
	readonly ids = $derived.by((): RowId[] => this.#host.value() ?? []);

	readonly has = (id: RowId) => this.#set.has(id);

	// Yüklü sayfaya göre başlık onay kutusu durumu
	readonly pageState = $derived.by((): 'none' | 'some' | 'all' => {
		const items = this.#host.items();
		let selected = 0;
		for (const row of items) if (this.#set.has(row.id)) selected++;
		if (selected === 0) return 'none';
		return selected === items.length ? 'all' : 'some';
	});

	#commit = (ids: RowId[]) => {
		this.#host.setValue(ids);
		this.#host.onChange(ids);
	};

	// Yalnızca bu satır (single modda tıklama). Zaten tek seçiliyse değişmez: çift tıklamada iki kez çalışabilir.
	readonly select = (id: RowId) => {
		this.#anchor = id;
		if (this.#set.size === 1 && this.#set.has(id)) return;
		this.#commit([id]);
	};

	readonly toggle = (id: RowId) => {
		if (!this.enabled) return;
		this.#anchor = id;
		if (this.mode === 'single') return this.#commit(this.#set.has(id) ? [] : [id]);
		this.#commit(this.#set.has(id) ? [...this.#set].filter((x) => x !== id) : [...this.#set, id]);
	};

	// Sabit uçtan bu satıra kadar olan satırları seçime ekler (yüklü sayfa içinde). Sabit uç bu sayfada yoksa değiştirir.
	readonly selectRange = (id: RowId) => {
		if (this.mode !== 'multiple') return this.toggle(id);
		const items = this.#host.items();
		const from = items.findIndex((row) => row.id === this.#anchor);
		const to = items.findIndex((row) => row.id === id);
		if (from < 0 || to < 0) return this.toggle(id);
		const range = items.slice(Math.min(from, to), Math.max(from, to) + 1).map((row) => row.id);
		this.#commit([...this.#set, ...range.filter((id) => !this.#set.has(id))]);
	};

	// Başlık onay kutusu: sayfanın tamamı seçiliyse sayfadakileri çıkarır, değilse ekler (diğer sayfalardaki seçim kalır)
	readonly toggleAll = () => {
		if (this.mode !== 'multiple') return;
		const pageIds = this.#host.items().map((row) => row.id);
		if (this.pageState === 'all') {
			const page = idSet(pageIds);
			this.#commit([...this.#set].filter((id) => !page.has(id)));
		} else {
			this.#commit([...this.#set, ...pageIds.filter((id) => !this.#set.has(id))]);
		}
	};

	readonly clear = () => {
		this.#anchor = undefined;
		if (this.#set.size > 0) this.#commit([]);
	};

	/** Seçim tuşları; işlenirse true döner. activeRow: aktif hücrenin satır sırası. */
	readonly handleKey = (e: KeyboardEvent, activeRow: number | undefined): boolean => {
		if (!this.enabled) return false;
		const mod = e.ctrlKey || e.metaKey;
		const row = activeRow !== undefined ? this.#host.items()[activeRow] : undefined;

		if (e.key === ' ' && row) {
			if (e.shiftKey) this.selectRange(row.id);
			else this.toggle(row.id);
			return true;
		}
		if (mod && (e.key === 'a' || e.key === 'A') && this.mode === 'multiple') {
			if (this.pageState !== 'all') this.toggleAll();
			return true;
		}
		if (e.key === 'Escape' && this.#set.size > 0) {
			this.clear();
			return true;
		}
		return false;
	};
}
