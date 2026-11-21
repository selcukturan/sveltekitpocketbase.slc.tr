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
 */

export type CellPos = { row: number; col: number };

// Tablo bağlamının imlece verdiği bilgiler (getter'lar reaktif okunur)
export interface CursorHost {
	readonly el: HTMLElement | undefined;
	readonly rowCount: number;
	readonly colCount: number;
	readonly dataRowHeight: number;
	readonly headerHeight: number; // sticky başlık satırları toplamı
	readonly footerHeight: number; // sticky footer satırları toplamı
	readonly clientHeight: number;
	cellId(pos: CellPos): string;
	onChange(pos: CellPos | undefined): void;
	onActivate(pos: CellPos): void; // Enter
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

export class GridCursor {
	readonly #host: CursorHost;
	#active = $state<CellPos | undefined>(undefined);

	constructor(host: CursorHost) {
		this.#host = host;
	}

	get active() {
		return this.#active;
	}

	// Hücreler bu anahtarı kendi konumlarıyla karşılaştırır ("satır:kolon"); değişince yalnızca 2 hücrenin DOM'u değişir
	readonly key = $derived(this.#active ? `${this.#active.row}:${this.#active.col}` : '');

	// Tam görünen veri satırı sayısı (PageUp/PageDown adımı): başlık ve footer düşülür
	get pageSize() {
		const h = this.#host;
		return Math.max(1, Math.floor((h.clientHeight - h.headerHeight - h.footerHeight) / h.dataRowHeight));
	}

	// Görünen ilk satır (henüz aktif hücre yokken klavyeyle başlanacak yer)
	get firstVisibleRow() {
		const h = this.#host;
		return clamp(Math.ceil((h.el?.scrollTop ?? 0) / h.dataRowHeight), 0, Math.max(0, h.rowCount - 1));
	}

	/**
	 * Aktif hücreyi değiştirir. Konum tablo sınırlarına kırpılır; tablo boşsa imleç kalkar.
	 * scroll: true → hücre görünür alana getirilir (klavye). Farede kaydırılmaz: çift tıklamanın
	 * ikinci tıklaması kayan içeriğe denk gelmesin.
	 */
	readonly set = (pos: CellPos | undefined, { scroll = false }: { scroll?: boolean } = {}) => {
		const h = this.#host;
		const next = pos && h.rowCount > 0 && h.colCount > 0 ? { row: clamp(pos.row, 0, h.rowCount - 1), col: clamp(pos.col, 0, h.colCount - 1) } : undefined;
		const current = this.#active;
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
		if (h.rowCount === 0 || h.colCount === 0) return false;

		const lastRow = h.rowCount - 1;
		const lastCol = h.colCount - 1;
		const mod = e.ctrlKey || e.metaKey;
		const navKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'];

		const a = this.#active;
		if (!a) {
			// İlk tuş: imleç görünen ilk satırın ilk hücresinde başlar
			if (!navKeys.includes(e.key)) return false;
			this.set({ row: this.firstVisibleRow, col: 0 }, { scroll: true });
			return true;
		}

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

		this.set(next, { scroll: true });
		return true;
	};
}
