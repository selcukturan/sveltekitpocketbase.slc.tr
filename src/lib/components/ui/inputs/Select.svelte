<script lang="ts" generics="Tmultiple extends boolean = false">
	import { tick, untrack } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { on } from 'svelte/events';
	import { areEqual } from '$lib/utils/common';
	import { inputClasses } from './common';
	import type { SelectValueChangeArgs, SelectValueTypeChoice, SelectPropsType } from './type';

	let {
		multiple = false as Tmultiple,
		placement = 'bottom',
		value = $bindable((multiple ? [] : '') as SelectValueTypeChoice<Tmultiple>),
		required = false,
		options,
		id,
		name,
		class: classes = '',
		triggerClass = '',
		listboxClass = '',
		optionClass = '',
		disabled = false,
		readonly = false,
		escClose = true,
		deSelectText = '-- Seçiniz --',
		onValueChange
	}: SelectPropsType<Tmultiple> = $props();

	// ########################### BEGIN Variables ##################################################################################################################

	const componentId = $props.id();

	const baseId = `slc-select-${componentId}`;
	const triggerId = `${baseId}-trigger`;
	const listboxId = `${baseId}-listbox`;
	const optionId = `${baseId}-option`;

	let container: HTMLDivElement | null = null;
	let trigger: HTMLButtonElement | null = null;
	let listbox: HTMLUListElement | null = $state(null);
	let optionsLi: HTMLLIElement[] = $state([]);
	let isOpenPopup = $state(false);
	let activeIndex = $state(0); // Klavye ile gezinilen aktif opsiyonun indeksi.
	let canDeselect = $derived(!multiple && !required); // -- Seçiniz -- gözükecek mi? Tekli seçim ve zorunlu değilse, kullanıcı seçimi geri sıfırlayabilir.

	const labelFor = $derived(`slc_${componentId}${name || ''}${id || ''}_select`);
	// ########################### END Variables ##################################################################################################################

	// ########################### BEGIN Derived ##################################################################################################################
	let displayOptions = $derived.by(() => {
		// Seçimi geri alma imkanı var mı? (Tekli seçim ve zorunlu değil)
		if (canDeselect) {
			// Listenin başına "-- Seçiniz --" seçeneğini ekle
			// orjinal indexi bir kaydırır. Orijinal options[0] artık displayOptions[1] olur
			return [{ value: '', label: deSelectText }, ...options];
		}

		// Diğer tüm durumlarda orijinal seçenekleri kullan
		return options;
	});

	let isValid = $derived.by(() => {
		// Zorunlu değilse her zaman geçerlidir.
		if (!required) return true;

		// Zorunluysa, seçim durumuna göre geçerlilik belirlenir.
		if (multiple) {
			return Array.isArray(value) && value.length > 0;
		} else {
			return typeof value === 'string' && value !== '';
		}
	});

	let selectedIndexes = $derived.by(() => {
		if (multiple && Array.isArray(value) && value.length > 0) {
			return value
				.map((v) => displayOptions.findIndex((opt) => opt.value === v)) // bulduğu ilk öğenin indeksini döndürür, yoksa -1 döndürür.
				.filter((i) => i !== -1) // -1 olanları çıkar
				.sort((a, b) => a - b);
		}
		const idx = displayOptions.findIndex((opt) => opt.value === value);
		return idx !== -1 ? [idx] : [];
	});

	let selectedLabels = $derived.by(() => {
		const labels = selectedIndexes.map((i) => displayOptions[i]?.label).filter(Boolean);

		const selectedCount = multiple ? `(${labels.length}) ` : '';

		return labels.length > 0 ? `${selectedCount}${labels.join(', ')}` : deSelectText;
	});

	let activeOptionId = $derived.by(() => {
		return isOpenPopup ? `${optionId}-${activeIndex}` : undefined;
	});

	let initialFocusIndex = $derived.by(() => {
		const firstIndex = selectedIndexes.at(0);

		// 1. Önce en özel durumu kontrol et: "-- Seçiniz --" mi seçili?
		// Eğer `canDeselect` true ise ve seçili index 0 ise, bu durum odur.
		if (canDeselect && firstIndex === 0) {
			// İlk gerçek seçeneğe odaklan.
			return 1;
		}

		// 2. Şimdi diğer geçerli seçimleri kontrol et:
		// Eğer bir seçim varsa (ve yukarıdaki özel duruma girmediyse), o seçime odaklan.
		if (firstIndex !== undefined && firstIndex > 0) {
			return firstIndex;
		}

		// 3. Geriye kalan tüm "boş" durumlar için en başa odaklan.
		// (Örn: çoklu seçim ve value=[], zorunlu tekli seçim ve value='')
		return 0;
	});

	// ########################### END Derived ##################################################################################################################

	// ########################### BEGIN Open/Close ##################################################################################################################
	const open = async () => {
		if (disabled || readonly) return;

		// Açıldığında klavye navigasyonunu seçili olanla senkronize edilir.
		activeIndex = initialFocusIndex;

		isOpenPopup = true;

		await tick(); // Bekle, DOM güncelleniyor.

		// clickListboxOutside.start();

		listbox?.focus({ preventScroll: true }); // focus scroll yapmasın, scroll işini scrollIntoView halleder.

		optionsLi[activeIndex]?.scrollIntoView({
			behavior: 'auto', // 'smooth' yerine 'auto' kullanıldı, çünkü 'smooth' bazen performans sorunlarına yol açabilir.
			block: 'nearest'
		});
	};

	const close = async () => {
		isOpenPopup = false;
		// await tick(); // Bekle, DOM güncelleniyor.
		// clickListboxOutside.stop();
	};

	const toggle = () => (isOpenPopup ? close() : open());
	// ########################### END Open/Close ##################################################################################################################

	// ########################### BEGIN Value Logic ##################################################################################################################
	const triggerChange = (args: SelectValueChangeArgs<Tmultiple>) => {
		onValueChange?.(args);
	};

	function selectOption(index: number) {
		activeIndex = index;

		const newSelectedValue = displayOptions[activeIndex].value;

		if (multiple && Array.isArray(value)) {
			listbox?.focus({ preventScroll: true }); // focus scroll yapmasın, scroll işini scrollIntoView halleder.
			optionsLi[activeIndex]?.scrollIntoView({
				behavior: 'auto',
				block: 'nearest'
			});

			if (value.includes(newSelectedValue)) {
				// REMOVE
				value = value.filter((v) => v !== newSelectedValue) as SelectValueTypeChoice<Tmultiple>;
			} else {
				// ADD
				value = [...value, newSelectedValue] as SelectValueTypeChoice<Tmultiple>;
			}
		} else {
			value = newSelectedValue as SelectValueTypeChoice<Tmultiple>;
			close();
			trigger?.focus();
		}
	}

	// `value` her değiştiğinde `untrack` içindeki kod çalışır.
	let initial = true;
	let beforeValue = (Array.isArray(value) ? [...value] : value) as SelectValueTypeChoice<Tmultiple>;
	const watchValueChange = () => {
		void value;
		return untrack(() => {
			if (initial || !areEqual(value, beforeValue)) {
				triggerChange({ value, beforeValue, initial }); // `onValueChange` eventini tetikler.
			}
			beforeValue = (Array.isArray(value) ? [...value] : value) as SelectValueTypeChoice<Tmultiple>; // `beforeValue`, `value`'nun bir önceki değerini tutar.
			if (initial) initial = false; // `initial` sadece ilk renderda false yapılır.
		});
	};

	// ########################### END Value Logic ##################################################################################################################

	// ########################### BEGIN Events ##################################################################################################################
	const outsideclick = () => {
		return on(window, 'click', (e: MouseEvent) => container && !container.contains(e.target as HTMLElement) && close());
	};

	const triggerEvents = (node: HTMLElement) => {
		const destroyClick = on(node, 'click', (e: MouseEvent) => {
			e.preventDefault();
			toggle();
		});

		const destroyKeydown = on(node, 'keydown', (e: KeyboardEvent) => {
			switch (e.code) {
				case 'ArrowDown':
				case 'ArrowUp': {
					e.preventDefault();
					toggle();
					break;
				}
			}
		});

		return () => {
			destroyClick();
			destroyKeydown();
		};
	};

	const listboxEvents = (node: HTMLElement) => {
		let searchTimeout: ReturnType<typeof setTimeout> | undefined = undefined;
		let searchString = '';
		const destroyKeydown = on(node, 'keydown', (e: KeyboardEvent) => {
			// 1. Arama (Typeahead) Mantığı
			// Eğer basılan tuş boşluk hariç tek bir karakterse (Ctrl veya Alt basılı değilken)
			if (e.key !== ' ' && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
				e.preventDefault();

				// Önceki zamanlayıcıyı temizle
				clearTimeout(searchTimeout);

				// Yeni basılan karakteri arama metnine ekle
				searchString += e.key.toLocaleLowerCase('tr-TR'); // Türkçe'ye uygun küçük harf çevrimi

				// Arama metnine uyan ilk opsiyonu bul
				const matchIndex = displayOptions.findIndex(
					(opt) => opt.label.toLocaleLowerCase('tr-TR').startsWith(searchString) // findIndex() bulamazsa -1 döndürür.
				);

				// Eğer bir eşleşme bulunursa
				if (matchIndex !== -1) {
					activeIndex = matchIndex;
					optionsLi[activeIndex]?.scrollIntoView({
						behavior: 'auto',
						block: 'nearest'
					});
				}

				// Kullanıcı yazmayı bırakırsa arama metnini sıfırla
				searchTimeout = setTimeout(() => {
					searchString = '';
				}, 500);

				return; // Arama yapıldı, fonksiyonun geri kalanına gerek yok.
			}

			// 2. Navigasyon ve Seçim Mantığı
			switch (e.code) {
				case 'ArrowUp':
				case 'ArrowDown':
				case 'Home':
				case 'End': {
					e.preventDefault();
					let nextIndex = activeIndex;

					if (e.code === 'ArrowUp') {
						nextIndex = (activeIndex - 1 + displayOptions.length) % displayOptions.length;
					} else if (e.code === 'ArrowDown') {
						nextIndex = (activeIndex + 1) % displayOptions.length;
					} else if (e.code === 'Home') {
						nextIndex = 0;
					} else if (e.code === 'End') {
						nextIndex = displayOptions.length - 1;
					}

					if (nextIndex !== activeIndex) {
						activeIndex = nextIndex;
						optionsLi[activeIndex]?.scrollIntoView({
							behavior: 'auto',
							block: 'nearest'
						});
					}
					break;
				}

				case 'Enter':
				case 'Space': {
					e.preventDefault();
					selectOption(activeIndex);
					break;
				}

				case 'Tab': {
					e.preventDefault();
					close();
					trigger?.focus();
					break;
				}

				case 'Escape': {
					if (!escClose) return;
					e.preventDefault();
					close();
					trigger?.focus();
					break;
				}

				// Diğer tuşlar için bir şey yapma
				default:
					return;
			}
		});
		return () => {
			destroyKeydown();
		};
	};

	const optionEvents = (index: number) => {
		return (node: HTMLElement) => {
			const destroyClick = on(node, 'click', (e: MouseEvent) => {
				e.preventDefault();
				selectOption(index);
			});
			return () => {
				destroyClick();
			};
		};
	};

	// ########################### END Events ##################################################################################################################

	const textEllipsisClasses = 'overflow-hidden text-ellipsis whitespace-nowrap';
	const internalContainerClasses = 'relative block max-w-full min-w-52 select-none';
	const internalTriggerClasses = $derived(
		`slc-input inline-flex w-full cursor-pointer touch-manipulation items-center justify-center text-start select-none disabled:cursor-not-allowed disabled:opacity-50 ${isValid ? inputClasses.variants.default : inputClasses.variants.error} ${inputClasses.sizes.md}`
	);
	const internalListboxClasses =
		'slc-input bg-surface-100 border border-surface-300 shadow-lg pointer-events-auto absolute isolate z-1 max-h-80 w-full min-w-52 scroll-py-2 list-none overflow-y-auto p-1.5 select-none rounded-md space-y-1';
	const internalOptionClasses = 'hover:bg-surface-200 flex cursor-pointer items-center px-3 py-1.5 rounded touch-manipulation';

	// Animasyon parametrelerini yöne göre hesapla
	// Menü nereden açılıyorsa, o yönden hafifçe "süzülerek" gelmesini sağlar
	let transitionParams = $derived.by(() => {
		const base = { duration: 150, easing: cubicOut, start: 0.95 };
		if (placement === 'bottom') return { ...base, y: -5 };
		if (placement === 'top') return { ...base, y: 5 };
		return base;
	});
</script>

<div bind:this={container} class="{internalContainerClasses} {classes}" {@attach outsideclick} {@attach watchValueChange}>
	<button
		bind:this={trigger}
		id={triggerId}
		role="combobox"
		type="button"
		aria-controls={listboxId}
		aria-expanded={isOpenPopup}
		aria-haspopup="listbox"
		aria-labelledby={triggerId}
		aria-activedescendant={activeOptionId}
		aria-invalid={!isValid}
		class="{internalTriggerClasses} {triggerClass}"
		{@attach triggerEvents}
		tabindex={disabled || readonly || displayOptions.length === 0 ? -1 : 0}
		disabled={disabled || displayOptions.length === 0}
	>
		<span class="flex-1 {textEllipsisClasses}">{selectedLabels}</span>
		<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
			<path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path>
		</svg>
	</button>
	{#if isOpenPopup && displayOptions.length > 0 && !disabled && !readonly}
		<ul
			bind:this={listbox}
			id={listboxId}
			role="listbox"
			aria-labelledby={triggerId}
			tabindex={-1}
			{@attach listboxEvents}
			class="{internalListboxClasses} {listboxClass} {placement}"
			transition:fly={transitionParams}
		>
			{#each displayOptions as option, i (i)}
				{@const isSelected = selectedIndexes.includes(i)}
				{@const isActive = i === activeIndex}
				<li
					bind:this={optionsLi[i]}
					id="{optionId}-{i}"
					role="option"
					tabindex={-1}
					aria-selected={isSelected}
					class:bg-secondary-100={isSelected}
					class:outline-2={isActive}
					class:outline-primary-400={isActive}
					class="{internalOptionClasses} {optionClass}"
					{@attach optionEvents(i)}
				>
					<span class="flex-1 {textEllipsisClasses}">
						{option.label}
					</span>
					<span aria-hidden={!isSelected} hidden={!isSelected}>
						<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
							<path fill="none" d="M0 0h24v24H0z"></path>
							<path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
						</svg>
					</span>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	/* --- Transform Origin & Konumlandırma Ayarları --- */
	.bottom {
		transform-origin: top;
		top: 100%;
		left: 0;
		margin-top: 5px;
	}
	.top {
		transform-origin: bottom;
		bottom: 100%;
		left: 0;
		margin-bottom: 5px;
	}
</style>
