<script lang="ts" generics="TData extends Row">
	import type { Row, Footer, Sources } from './types';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { getTable } from './tables.svelte';

	type Props = HTMLAttributes<HTMLDivElement> & {
		src: Sources<TData>;
		toolbar?: Snippet;
		thead: Snippet;
		tbody: Snippet<[TData, number]>;
		tfoot?: Snippet<[Footer<TData>, number]>;
		statusbar?: Snippet;
		class?: string;
		tableContainerClass?: string;
		containerClass?: string;
	};
	const { src, toolbar, thead, tbody, tfoot, statusbar, class: tableClass, tableContainerClass, containerClass, ...attributes }: Props = $props();

	const table = getTable<TData>(src.id);

	/**
	 * Belirtilen süre içinde bir fonksiyonun en fazla bir kez çağrılmasını sağlar.
	 * Hem ilk çağrıyı (leading edge) hem de süre sonunda son çağrıyı (trailing edge)
	 * garanti eden bir throttle implementasyonudur.
	 *
	 * @template This Fonksiyonun çalıştırılacağı 'this' bağlamının türü.
	 * @template Args Fonksiyonun kabul ettiği argümanların türü (tuple).
	 * @template Return Fonksiyonun dönüş türü (Not: Bu throttle fonksiyonu doğrudan değer döndürmez).
	 * @param func Kısıtlanacak olan orijinal fonksiyon.
	 * @param delay Milisaniye cinsinden kısıtlama süresi.
	 * @returns Orijinal fonksiyonla aynı argümanları kabul eden, ancak kısıtlanmış çağrı
	 *          davranışına sahip yeni bir fonksiyon. Ayrıca bir 'cancel' metodu içerir.
	 */
	function throttle<This, Args extends unknown[], Return>(func: (this: This, ...args: Args) => Return, delay: number): ((this: This, ...args: Args) => void) & { cancel: () => void } {
		let timeoutId: ReturnType<typeof setTimeout> | null = null; // setTimeout'un dönüş türünü kullan
		let lastExecTime = 0;
		// Trailing çağrı için son argümanları ve 'this'i saklamak gerekebilir (opsiyonel iyileştirme)
		// let lastArgs: Args | null = null;
		// let lastThis: This | null = null;

		const throttled = function (this: This, ...args: Args): void {
			const context = this; // 'this' bağlamını setTimeout içinde kullanmak için sakla
			const currentTime = Date.now();
			// Son gerçek çalıştırma zamanına göre kalan süre
			const elapsedTime = currentTime - lastExecTime;

			// Çalıştırma fonksiyonu (hem leading hem trailing için)
			const execute = () => {
				lastExecTime = currentTime; // Çalıştırma zamanını GÜNCELLE
				timeoutId = null; // Zamanlayıcı ID'sini temizle
				func.apply(context, args); // Orijinal fonksiyonu ÇALIŞTIR
			};

			// Önceki (bekleyen) trailing zamanlayıcısını temizle
			// Bu, her zaman en son çağrının zamanlayıcısının aktif kalmasını sağlar.
			if (timeoutId) {
				clearTimeout(timeoutId);
				// timeoutId = null; // Henüz null yapma, sadece execute içinde veya leading çalışırsa
			}

			if (elapsedTime >= delay) {
				// Leading edge (ilk kenar) durumu
				// Eğer bir trailing zamanlayıcı bekliyorduysa onu iptal et, çünkü şimdi çalıştırıyoruz.
				// Bu genellikle olmaz çünkü timeoutId zaten yukarıda temizlendi ama garanti olsun.
				// if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
				execute(); // Hemen çalıştır
			} else {
				// Trailing edge (sondaki kenar) durumu - yeniden zamanla
				timeoutId = setTimeout(execute, delay - elapsedTime);
			}
		};

		/**
		 * Bekleyen throttle çağrısını iptal eder.
		 */
		throttled.cancel = (): void => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = null;
			lastExecTime = 0; // Durumu sıfırla
			// lastArgs = null; // Eğer saklanıyorsa bunları da temizle
			// lastThis = null;
		};

		return throttled;
	}

	const virtualScrollAction = (tableNode: HTMLDivElement) => {
		if (table.get.enableVirtualization === false) return;

		const setScrollTop = async () => {
			const { scrollTop, clientHeight } = tableNode;
			if (clientHeight === 0) return;
			await table.setVirtualDataDerivedTrigger(`scroll_${scrollTop}`);
		};

		const throttledScrollHandler = throttle(setScrollTop, 60);

		tableNode.addEventListener('scroll', throttledScrollHandler, { passive: true });

		return {
			destroy() {
				tableNode.removeEventListener('scroll', throttledScrollHandler);
			}
		};
	};

	onMount(() => {
		if (table.get.enableVirtualization === true) {
			const observer = new ResizeObserver(async (entries) => {
				for (let entry of entries) {
					const clientHeight = entry.contentRect.height;
					if (clientHeight === 0) return;
					await table.setVirtualDataDerivedTrigger(`height_${clientHeight}`);
				}
			});

			if (table.element) observer.observe(table.element);

			return () => {
				if (table.element) observer.unobserve(table.element);
			};
		}
	});
</script>

<div class:slc-table-main={true} class={containerClass} style:width={table.get.width} style:height={table.get.height}>
	{@render toolbar?.()}
	<div class:slc-table-container={true} class={tableContainerClass}>
		<div style:display={'none'} class:slc-table-action-content={true}>Gösterilecek veri yok</div>
		<div style:display={table.get.data.length > 0 ? 'none' : 'flex'} class:slc-table-no-data={true}>Gösterilecek veri yok</div>
		<div
			role="grid"
			bind:this={table.element}
			use:virtualScrollAction
			data-id={src.id}
			class={tableClass}
			data-scope="table"
			style:grid-template-rows={table.gridTemplateRows}
			style:grid-template-columns={table.gridTemplateColumns}
			style:scroll-padding-block-start={table.headerRowsCount > 0 ? table.headerRowsCount * table.get.theadRowHeight + 'px' : undefined}
			style:scroll-padding-block-end={table.get.footers.length > 0 ? table.get.footers.length * table.get.tfootRowHeight + 'px' : undefined}
			style:scroll-padding-inline-start={table.getFocusedCell?.colIndex === -1 || table.get.rowSelection === 'none' ? undefined : table.get.rowSelectionColumnWidth + 'px'}
			style:scroll-padding-inline-end={table.getFocusedCell?.colIndex === table.visibleColumns.length || table.get.rowAction === false ? undefined : table.get.rowActionColumnWidth + 'px'}
			aria-colcount={table.visibleColumns.length}
			aria-rowcount={table.get.data.length + table.get.footers.length + table.headerRowsCount}
			{...attributes}
		>
			{@render thead?.()}

			{#if table.get.enableVirtualization === true}
				{#each table.virtualData as row, rowindex (row.oi)}
					{@render tbody?.(row, rowindex)}
				{/each}
			{:else}
				{#each table.get.data as row, rowindex (rowindex)}
					{@render tbody?.(row, rowindex)}
				{/each}
			{/if}

			{#if table.get.data.length > 0}
				{#each table.get.footers as foot, footerindex (footerindex)}
					{@render tfoot?.(foot, footerindex)}
				{/each}
			{/if}
		</div>
	</div>
	{@render statusbar?.()}
</div>

<style>
	.slc-table-main {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.slc-table-container {
		position: relative;
		flex: 1 1 0%;
		overflow: hidden;
	}
	[data-scope='table'] {
		display: grid;
		width: 100%;
		height: 100%;
		contain: content; /* contain özelliği, bir elementin içeriksel sınırlarını belirler ve tarayıcıların bu sınırlar içinde optimizasyon yapmasına olanak tanır. content: Elementin içeriği, boyut, düzen ve stil açısından izole edilir. */
		content-visibility: auto; /* auto: Tarayıcı, elementin içeriğini yalnızca görünür olduğunda render eder. Bu, performans optimizasyonları yapmasına olanak tanır. */
		box-sizing: border-box;
		overflow: auto;
		overscroll-behavior: none;
	}
	.slc-table-no-data {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		height: 100%;
		width: 100%;
		pointer-events: none;
		position: absolute;
		z-index: 50;
	}
</style>
