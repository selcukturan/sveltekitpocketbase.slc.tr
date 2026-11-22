import { tick } from 'svelte';

/**
 * Aktif hücre (klavye imleci) ve hücre gezinmesi.
 *
 * - Konum indeks uzayındadır: row = yüklü verideki satır sırası (0…rowCount-1), col = görünür kolon sırası.
 *   "Gidilecek satır var mı?" sorusu DOM'a sorulmaz; satırlar `items` içinde hep vardır, yalnızca DOM sanaldır.
 *   Hedef sınırlara kırpılır (clamp), sonra görünür alana kaydırılır.
 * - Odak hep grid kapsayıcısındadır (tabindex=0); aktif hücre aria-activedescendant ile gösterilir.
 *   Aktif satır, görünür aralığın dışında kalsa da sanal listeye eklenir (context.virtualData); böylece
 *   hücresi DOM'da hep vardır ve scrollIntoView ile kaydırılabilir.
 * - Kaydırma tamamen CSS'e bırakılır: grid'deki scroll-padding (başlık, footer, sabit kolonlar) ile
 *   scrollIntoView({ block/inline: 'nearest' }) hücreyi sticky alanların altında bırakmaz.
 * - Aralık seçimi: Shift ile hareket (ya da Shift+tıklama, sürükleme) sabit ucu (anchor) yerinde bırakıp aktif
 *   hücreyi taşır; aralık ikisinin dikdörtgenidir. Shiftsiz her hareket aralığı kapatır.
 * - Çoklu seçim (Ctrl/⌘ + tıklama/sürükleme): mevcut seçim listeye (#extra) eklenir, tıklanan hücreden yeni aralık
 *   başlar. Shift son aralığı genişletir. Seçili bir hücreye Ctrl+tıklama onu çıkarmaz, yalnızca aktif yapar.
 */

export type CellPos = { row: number; col: number };
// Hücre aralığı (dahil sınırlar): sabit uç (anchor) ile aktif hücrenin oluşturduğu dikdörtgen
export type CellRange = { top: number; bottom: number; left: number; right: number };

// Tablo bağlamının imlece verdiği bilgiler (fonksiyonlar çağrıldıkları yerde reaktif okunur)
export interface CursorHost {
	el(): HTMLElement | undefined;
	rowCount(): number;
	colCount(): number;
	dataRowHeight(): number;
	headerHeight(): number; // sticky başlık satırları toplamı
	footerHeight(): number; // sticky footer satırları toplamı
	clientHeight(): number;
	cellId(pos: CellPos): string;
	onChange(pos: CellPos | undefined): void;
	onActivate(pos: CellPos): void; // Enter
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

export class GridCursor {
	readonly #host: CursorHost;
	#active = $state<CellPos | undefined>(undefined);
	#anchor = $state<CellPos | undefined>(undefined);
	#extra = $state<CellRange[]>([]); // Ctrl ile eklenmiş önceki aralıklar

	constructor(host: CursorHost) {
		this.#host = host;
	}

	get active() {
		return this.#active;
	}

	// Hücreler bu anahtarı kendi konumlarıyla karşılaştırır ("satır:kolon"); değişince yalnızca 2 hücrenin DOM'u değişir
	readonly key = $derived(this.#active ? `${this.#active.row}:${this.#active.col}` : '');

	// Aktif hücre ile sabit uç farklıysa aralık; tek hücrede aralık yoktur (yalnızca aktif hücre)
	readonly range = $derived.by((): CellRange | undefined => {
		const a = this.#active;
		const b = this.#anchor;
		if (!a || !b || (a.row === b.row && a.col === b.col)) return undefined;
		return { top: Math.min(a.row, b.row), bottom: Math.max(a.row, b.row), left: Math.min(a.col, b.col), right: Math.max(a.col, b.col) };
	});

	// Tüm seçili alanlar: Ctrl ile eklenenler + şu anki. Ek alan varken tek hücrelik aktif hücre de seçime dahildir.
	readonly ranges = $derived.by((): CellRange[] => {
		const extra = this.#extra;
		const a = this.#active;
		const current = this.range ?? (extra.length > 0 && a ? { top: a.row, bottom: a.row, left: a.col, right: a.col } : undefined);
		return current ? [...extra, current] : extra;
	});

	readonly inRange = (row: number, col: number) => this.ranges.some((r) => row >= r.top && row <= r.bottom && col >= r.left && col <= r.right);

	/** Ctrl/⌘ + tıklama: mevcut seçimi koruyup bu hücreden yeni aralık başlatır. */
	readonly addRange = (pos: CellPos) => {
		const current =
			this.ranges.at(-1) ?? (this.#active ? { top: this.#active.row, bottom: this.#active.row, left: this.#active.col, right: this.#active.col } : undefined);
		const extra = current ? [...this.#extra.filter((r) => r !== current), current] : this.#extra;
		this.set(pos); // aralığı ve ek alanları kapatır
		this.#extra = extra;
	};

	// Alanı seçili yapar (örn. yapıştırılan blok): aktif hücre sol üstte kalır, sabit uç sağ altta
	readonly selectRange = (range: CellRange) => {
		this.set({ row: range.top, col: range.left });
		if (range.bottom !== range.top || range.right !== range.left) this.#anchor = { row: range.bottom, col: range.right };
	};

	readonly clearRange = () => {
		if (!this.#anchor && this.#extra.length === 0) return false;
		this.#anchor = undefined;
		this.#extra = [];
		return true;
	};

	// Tam görünen veri satırı sayısı (PageUp/PageDown adımı): başlık ve footer düşülür
	get pageSize() {
		const h = this.#host;
		return Math.max(1, Math.floor((h.clientHeight() - h.headerHeight() - h.footerHeight()) / h.dataRowHeight()));
	}

	// Görünen ilk satır (henüz aktif hücre yokken klavyeyle başlanacak yer)
	get firstVisibleRow() {
		const h = this.#host;
		return clamp(Math.ceil((h.el()?.scrollTop ?? 0) / h.dataRowHeight()), 0, Math.max(0, h.rowCount() - 1));
	}

	/**
	 * Aktif hücreyi değiştirir. Konum tablo sınırlarına kırpılır; tablo boşsa imleç kalkar.
	 * scroll: true → hücre görünür alana getirilir (klavye). Farede kaydırılmaz: çift tıklamanın
	 * ikinci tıklaması kayan içeriğe denk gelmesin.
	 * extend: true → aralık genişletilir (sabit uç yoksa şimdiki aktif hücre sabit uç olur); false → aralık kapanır.
	 */
	readonly set = (pos: CellPos | undefined, { scroll = false, extend = false }: { scroll?: boolean; extend?: boolean } = {}) => {
		const h = this.#host;
		const next = pos && h.rowCount() > 0 && h.colCount() > 0 ? { row: clamp(pos.row, 0, h.rowCount() - 1), col: clamp(pos.col, 0, h.colCount() - 1) } : undefined;
		const current = this.#active;
		if (extend && next) {
			if (!this.#anchor && current) this.#anchor = current; // Shift: son aralık genişler, ek alanlar kalır
		} else {
			if (this.#anchor) this.#anchor = undefined;
			if (this.#extra.length > 0) this.#extra = [];
		}
		if (current?.row !== next?.row || current?.col !== next?.col) {
			this.#active = next;
			h.onChange(next);
		}
		if (next && scroll) this.#scrollIntoView(next);
	};

	// Hücre DOM'a gelince (aktif satır sanal listeye eklendiği için tick sonrası vardır) kaydırılır.
	// Art arda tuşlarda önceki istekler eskimiş olur; yalnızca son aktif hücre kaydırılır.
	#scrollIntoView = async (pos: CellPos) => {
		await tick();
		const active = this.#active;
		if (!active || active.row !== pos.row || active.col !== pos.col) return;
		document.getElementById(this.#host.cellId(active))?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
	};

	/**
	 * Gezinme tuşları. İşlenirse true döner (çağıran preventDefault yapar).
	 * Tab satır sonunda alt satıra geçer; tablonun son hücresinde false döner ve odak tablodan çıkar.
	 */
	readonly handleKey = (e: KeyboardEvent): boolean => {
		const h = this.#host;
		if (h.rowCount() === 0 || h.colCount() === 0) return false;

		const lastRow = h.rowCount() - 1;
		const lastCol = h.colCount() - 1;
		const mod = e.ctrlKey || e.metaKey;
		const navKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'];

		const a = this.#active;
		if (!a) {
			// İlk tuş: imleç görünen ilk satırın ilk hücresinde başlar
			if (!navKeys.includes(e.key)) return false;
			this.set({ row: this.firstVisibleRow, col: 0 }, { scroll: true });
			return true;
		}

		if (e.key === 'Escape') return this.clearRange(); // aralık yoksa false: Esc satır seçimine geçer

		let next: CellPos;
		switch (e.key) {
			case 'ArrowUp':
				next = { row: a.row - 1, col: a.col };
				break;
			case 'ArrowDown':
				next = { row: a.row + 1, col: a.col };
				break;
			case 'ArrowLeft':
				next = { row: a.row, col: a.col - 1 };
				break;
			case 'ArrowRight':
				next = { row: a.row, col: a.col + 1 };
				break;
			case 'Home':
				next = mod ? { row: 0, col: 0 } : { row: a.row, col: 0 };
				break;
			case 'End':
				next = mod ? { row: lastRow, col: lastCol } : { row: a.row, col: lastCol };
				break;
			case 'PageUp':
				next = { row: a.row - this.pageSize, col: a.col };
				break;
			case 'PageDown':
				next = { row: a.row + this.pageSize, col: a.col };
				break;
			case 'Tab': {
				let { row, col } = a;
				col += e.shiftKey ? -1 : 1;
				if (col > lastCol) {
					if (row >= lastRow) return false; // tablonun sonu: odak sonraki elemana
					row += 1;
					col = 0;
				} else if (col < 0) {
					if (row <= 0) return false; // tablonun başı: odak önceki elemana
					row -= 1;
					col = lastCol;
				}
				next = { row, col };
				break;
			}
			case 'Enter':
				h.onActivate(a);
				return true;
			default:
				return false;
		}

		// Shift + yön/Home/End/PageUp/PageDown aralığı genişletir; Shift+Tab geri gider (aralık kapanır)
		this.set(next, { scroll: true, extend: e.shiftKey && e.key !== 'Tab' });
		return true;
	};
}
