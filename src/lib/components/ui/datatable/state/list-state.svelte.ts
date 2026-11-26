import type { RemoteQuery, RemoteQueryOverride } from '$app/server';
import * as v from 'valibot';

/**
 * Liste sayfasının tek kontrol noktası: filtre, sayfalama, sıralama ve sorgu burada yaşar.
 *
 * - `filter`  : inputların bağlandığı taslak filtre (bind:value). `search()` çağrılana kadar sorguya gitmez.
 * - `params`  : sorguya giden, uygulanmış parametreler (filterData + page + perPage + sort).
 * - `query`   : `autoLoad: false` ise ilk `search()`/`refresh()` çağrısına kadar `undefined` (istek atılmaz).
 *
 * DataTable'a `list={list}` verildiğinde query, sort, sayfalama ve sıralama olayları buradan okunur.
 *
 * @example
 * const list = createList(getList, listParamsSchema, { autoLoad: false });
 * <input.Text bind:value={list.filter.filter_text} onkeydown={list.searchOnEnter} />
 * <dt.DataTable {list} {columns} />
 */

// Liste şemasının çıktısında bulunması gereken alanlar
export type ListParams = {
	page: number;
	perPage: number;
	options: { sort?: string };
	filterData: Record<string, unknown>;
	timestamp: number;
};

export type ListOptions = {
	autoLoad?: boolean; // sayfa açılınca veri çekilsin mi (varsayılan: true)
};

export class ListState<TParams extends ListParams, TResult> {
	readonly #fetch: (params: TParams) => RemoteQuery<TResult>;
	readonly #defaults: TParams;

	params = $state() as TParams;
	filter = $state() as TParams['filterData'];
	loaded = $state(false);
	// Seçili satır id'leri (DataTable'da bind:selected={list.selected}); sayfalar arası korunur
	selected = $state<string[]>([]);

	readonly query: RemoteQuery<TResult> | undefined = $derived.by(() => (this.loaded ? this.#fetch(this.params) : undefined));
	readonly sort = $derived(this.params.options.sort ?? '');
	readonly loading = $derived(this.query?.loading ?? false);
	// Mutasyonlarda tazelenecek sorgular: submit().updates(...list.updates). Liste henüz yüklenmediyse boş.
	readonly updates = $derived(this.query ? [this.query] : []);

	/**
	 * Optimistik güncelleme (SvelteKit withOverride): istek sürerken liste `update` ile değiştirilmiş gösterilir,
	 * sunucunun tazelediği veri gelince override kalkar; istek hata verirse kendiliğinden geri alınır.
	 * @example await updateCell(args).updates(...list.updatesWith((r) => ({ ...r, items: r.items.map(...) })))
	 */
	readonly updatesWith = (update: (current: TResult) => TResult): RemoteQueryOverride[] => (this.query ? [this.query.withOverride(update)] : []);

	constructor(fetch: (params: TParams) => RemoteQuery<TResult>, defaults: TParams, { autoLoad = true }: ListOptions = {}) {
		this.#fetch = fetch;
		this.#defaults = defaults;
		this.params = { ...defaults, timestamp: Date.now() };
		this.filter = { ...defaults.filterData };
		this.loaded = autoLoad;
	}

	// Parametreleri günceller; timestamp her seferinde yeni bir sorgu örneği (önbelleksiz istek) üretir
	#apply = (patch: Partial<TParams>) => {
		this.params = { ...this.params, ...patch, timestamp: Date.now() };
		this.loaded = true;
	};

	// Taslak filtreyi uygular; sonuç sayısı değişeceği için ilk sayfaya döner
	readonly search = () => this.#apply({ filterData: { ...this.filter }, page: 1 } as Partial<TParams>);

	readonly searchOnEnter = (e: KeyboardEvent) => {
		if (e.key === 'Enter') this.search();
	};

	// Filtreyi varsayılana döndürüp arar
	readonly clear = () => {
		this.filter = { ...this.#defaults.filterData };
		this.search();
	};

	// Aynı parametrelerle yeniden çeker; henüz yüklenmediyse ilk yüklemeyi yapar
	readonly refresh = () => (this.query ? this.query.refresh() : this.#apply({}));

	// Sayfalama/sıralama, önceki istek bitmeden yeni istek başlatmaz. Her çağrı yeni bir sorgu örneği üretir ve
	// öncekiler iptal edilmeden sürer; art arda tıklamada N istek gidiyordu. (Arama ve refresh serbest.)
	readonly paginate = ({ page, perPage }: { page: number; perPage: number }) => {
		if (!this.loading) this.#apply({ page, perPage } as Partial<TParams>);
	};

	readonly setSort = (sort: string) => {
		if (!this.loading) this.#apply({ options: { ...this.params.options, sort }, page: 1 } as Partial<TParams>);
	};
}

/**
 * Remote `query` fonksiyonu ve valibot liste şemasından ListState oluşturur.
 * Varsayılan parametreler şemadan (`v.getDefaults`) alınır.
 */
export function createList<TSchema extends v.GenericSchema<unknown, ListParams>, TResult>(
	fetch: (params: v.InferInput<TSchema>) => RemoteQuery<TResult>,
	schema: TSchema,
	options?: ListOptions
) {
	type TParams = v.InferOutput<TSchema>;
	const defaults = v.getDefaults(schema) as TParams;
	return new ListState<TParams, TResult>((params) => fetch(params as v.InferInput<TSchema>), defaults, options);
}

// DataTable'ın ListState'ten okuduğu kısım (farklı TParams'lar için ortak tip)
export type ListSource<TResult> = {
	readonly query: RemoteQuery<TResult> | undefined;
	readonly sort: string;
	readonly paginate: (p: { page: number; perPage: number }) => void;
	readonly setSort: (sort: string) => void;
};
