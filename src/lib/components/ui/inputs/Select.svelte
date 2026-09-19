<script lang="ts" generics="Tmultiple extends boolean = false">
	import { untrack } from 'svelte';
	import { on } from 'svelte/events';
	import { areEqual } from '#lib/utils/common.js';
	import { inputClasses } from './common.js';
	import type { SelectValueChangeArgs, SelectValueTypeChoice, SelectPropsType } from './type.js';
	import { Toggler } from '#lib/components/base/toggler/index.js';

	let {
		multiple = false as Tmultiple,
		placement = 'bottom-start',
		value = $bindable((multiple ? [] : '') as SelectValueTypeChoice<Tmultiple>),
		required = false,
		matchTriggerWidth = true,
		status = 'default',
		size = 'md',
		options,
		triggerClass = '',
		listboxClass = '',
		optionClass = '',
		escClose = true,
		disabled = false,
		readonly = false,
		inform = false,
		deSelectText = '-- Seçiniz --',
		onValueChange
	}: SelectPropsType<Tmultiple> = $props();

	// ########################### BEGIN Variables ##################################################################################################################

	const componentId = $props.id();

	const baseId = `slc-select-${componentId}`;
	const listboxId = `${baseId}-listbox`;
	const optionId = `${baseId}-option`;

	let toggl = $state<ReturnType<typeof Toggler> | null>(null);
	let triggerButtonElement: HTMLButtonElement | null = null;
	let listbox: HTMLUListElement | null = $state(null);
	let optionsLi: HTMLLIElement[] = $state([]);
	let isOpenPopup = $derived(toggl?.states.active === true ? true : false);
	let activeIndex = $state(0); // Klavye ile gezinilen aktif opsiyonun indeksi.
	let isKeyboardNav = $state(false); // true: kullanıcı klavye ile geziniyor, false: fare kullanılıyor. Outline sadece klavye modunda gösterilir.
	let canDeselect = $derived(!multiple && !required); // -- Seçiniz -- gözükecek mi? Tekli seçim ve zorunlu değilse, kullanıcı seçimi geri sıfırlayabilir.
	let canInteract = $derived(!disabled && !readonly);
	// ########################### END Variables ##################################################################################################################

	// ########################### BEGIN Export ##############################
	const toggler_id = $derived(toggl?.data.id || 'no_id');

	export const data = {
		get toggler_id() {
			return toggler_id;
		}
	};

	export const toggle = () => {
		if (!canInteract) return;
		toggl?.toggle();
	};
	export const open = () => {
		if (!canInteract) return;
		toggl?.open();
	};
	export const close = () => {
		if (!canInteract) return;
		toggl?.close();
	};
	// ########################### END Export ##############################

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

	let focusIndex = $derived.by(() => {
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
	const watchIsOpenPopup = () => {
		void isOpenPopup;
		return untrack(() => {
			activeIndex = focusIndex; // Açıldığında ve kapandığında klavye navigasyonu seçili olanla senkronize edilir.
			if (isOpenPopup) {
				// onOpenEvent Simulation

				// listbox?.focus({ preventScroll: true }); // focus scroll yapmasın, scroll işini scrollIntoView halleder.
				triggerButtonElement?.focus();

				optionsLi[activeIndex]?.scrollIntoView({
					behavior: 'auto', // 'smooth' yerine 'auto' kullanıldı, çünkü 'smooth' bazen performans sorunlarına yol açabilir.
					block: 'nearest'
				});
			} else {
				// onCloseEvent Simulation
				isKeyboardNav = false;
			}
		});
	};
	// ########################### END Open/Close ##################################################################################################################

	// ########################### BEGIN Value Logic ##################################################################################################################
	const triggerChange = (args: SelectValueChangeArgs<Tmultiple>) => {
		onValueChange?.(args);
	};

	function selectOption(index: number) {
		if (!canInteract) return;

		const newSelectedValue = displayOptions[index].value;

		if (multiple && Array.isArray(value)) {
			// listbox?.focus({ preventScroll: true }); // focus scroll yapmasın, scroll işini scrollIntoView halleder.
			optionsLi[index]?.scrollIntoView({
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
			toggl?.close();
			triggerButtonElement?.focus();
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

	// Trigger butonuna özel click davranışı.
	// Popover'ın açılıp kapanması bilinçli olarak `popovertarget`'ın native toggle davranışına
	// bırakılmıyor; her tıklamada tek noktadan `toggl.toggle()` ile JS tarafından yönetiliyor.
	// Sebep: dokunmatik ekranlarda native popover'ın "light-dismiss" davranışı `pointerdown`
	// anında, invoker butonun native toggle'ı ise `click` anında (yani pointerup'tan sonra)
	// tetikleniyor. Bu iki native mekanizmanın aynı dokunuşta farklı anlarda çakışması bazı
	// tarayıcılarda popover'ın bir kapanıp native toggle ile hemen tekrar açılmasına, dolayısıyla
	// trigger'a ilk dokunuşun popover'ı kapatmamış gibi görünmesine yol açıyordu (ikinci dokunuş
	// gerçekten kapatıyordu). `preventDefault` ile native davranışı iptal edip tek bir JS çağrısı
	// yapmak bu çakışmayı ortadan kaldırıyor.
	const triggerClickEvents = (node: HTMLElement) => {
		const destroyClick = on(node, 'click', (e: MouseEvent) => {
			e.preventDefault();

			if (!canInteract) {
				e.stopPropagation();
				return;
			}

			toggl?.toggle();
		});

		return () => {
			destroyClick();
		};
	};

	// Klavye navigasyonu, Toggler'ın hem trigger'ı hem popover'ı saran ortak `container` elemanına bağlanır.
	// Böylece odak; trigger butonunda, listbox'ta veya bir option'da olsa da (örn. multiple seçimde bir
	// option'a tıklandığında odak popoverEl'e kayar) klavye olayları her zaman yakalanır.
	const keyboardNavEvents = (node: HTMLElement) => {
		let searchTimeout: ReturnType<typeof setTimeout> | undefined = undefined;
		let searchString = '';
		const destroyKeydown = on(node, 'keydown', (e: KeyboardEvent) => {
			if (!canInteract) return;

			isKeyboardNav = true; // Klavye ile etkileşim başladı, outline gösterilebilir.

			// 1. Arama (Typeahead) Mantığı
			// Eğer basılan tuş boşluk hariç tek bir karakterse (Ctrl veya Alt basılı değilken)
			if (isOpenPopup && e.key !== ' ' && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
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
						if (isOpenPopup) {
							nextIndex = (activeIndex - 1 + displayOptions.length) % displayOptions.length;
						} else {
							toggl?.open();
						}
					} else if (e.code === 'ArrowDown') {
						if (isOpenPopup) {
							nextIndex = (activeIndex + 1) % displayOptions.length;
						} else {
							toggl?.open();
						}
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
					if (isOpenPopup) {
						selectOption(activeIndex);
					} else {
						toggl?.open();
					}

					break;
				}

				case 'Tab': {
					if (isOpenPopup) {
						e.preventDefault();
						toggl?.close();
						triggerButtonElement?.focus();
					}
					break;
				}

				case 'Escape': {
					if (!escClose) return;
					e.preventDefault();
					toggl?.close();
					triggerButtonElement?.focus();
					break;
				}

				// Diğer tuşlar için bir şey yapma
				default:
					return;
			}
		});

		// Fare (veya dokunma) ile herhangi bir etkileşim, klavye modunu kapatır.
		const destroyPointerdown = on(node, 'pointerdown', () => {
			isKeyboardNav = false;
		});

		return () => {
			destroyKeydown();
			destroyPointerdown();
		};
	};

	const keyboard = () => {
		const togglerContainerElement = toggl?.el.container;
		return untrack(() => {
			if (!togglerContainerElement) return;
			return keyboardNavEvents(togglerContainerElement);
		});
	};

	const optionEvents = (index: number) => {
		return (node: HTMLElement) => {
			// Opsiyonlar (li) odaklanabilir değil; bu yüzden tıklama/dokunma sırasında tarayıcı
			// varsayılan olarak trigger'daki DOM focus'unu düşürüp `null`/body'ye kaydırıyor.
			// Bu da Toggler'ın "focus widget'tan tamamen çıktı" sanıp popover'ı click olayından
			// ÖNCE (mousedown/pointerdown anında) kapatmasına yol açıyordu — özellikle çoklu
			// seçimde, seçim sonrası trigger'a ilk tıklamanın popover'ı kapatmak yerine (zaten
			// kapanmış olanı) yeniden açması gibi görünüyordu. `mousedown`/`pointerdown` varsayılanını
			// engelleyerek focus'un trigger'da kalmasını sağlıyoruz; kavramsal olarak seçim aslında
			// hep trigger'a odaklıyken (combobox + aria-activedescendant deseni) yapılıyor.
			const destroyPointerdown = on(node, 'pointerdown', (e: PointerEvent) => {
				e.preventDefault();
			});
			const destroyClick = on(node, 'click', (e: MouseEvent) => {
				e.preventDefault();
				selectOption(index);
			});
			return () => {
				destroyPointerdown();
				destroyClick();
			};
		};
	};

	// ########################### END Events ##################################################################################################################

	const textEllipsisClasses = 'overflow-hidden text-ellipsis whitespace-nowrap';
	const internalTriggerClasses = $derived(
		`slc-input inline-flex w-full touch-manipulation items-center justify-center text-start select-none ${canInteract ? 'cursor-pointer' : 'cursor-default'} 
		disabled:cursor-not-allowed disabled:opacity-50 ${isValid ? inputClasses.variants[status] : inputClasses.variants.error} ${inputClasses.sizes[size]}`
	);
	const internalListboxClasses = 'slc-input pointer-events-auto scroll-py-2 p-1.5! select-none';
	const internalOptionClasses = 'hover:bg-surface-200 flex cursor-pointer items-center px-3 py-1.5 rounded touch-manipulation';
</script>

<Toggler
	bind:this={toggl}
	{placement}
	{matchTriggerWidth}
	--border="{inform === true ? '3px solid var(--color-surface-300)' : '1px solid var(--color-surface-300)'} "
	--background-color="var(--color-surface-100)"
	--box-shadow="0px 8px 5px -5px var(--color-surface-50)"
	--gutter={inform === true ? '-3px' : '5px'}
	--min-height="100px"
	--max-height="320px"
	--border-radius="6px"
	class="{internalListboxClasses} {listboxClass}"
	escClose={false}
>
	{#snippet trigger({ active, attr })}
		<button
			bind:this={triggerButtonElement}
			{@attach watchValueChange}
			{@attach watchIsOpenPopup}
			{@attach keyboard}
			{@attach triggerClickEvents}
			id={attr.id}
			type={attr.type}
			style={attr.style}
			popovertarget={readonly ? undefined : attr.popovertarget}
			class:active
			role="combobox"
			aria-controls={listboxId}
			aria-expanded={isOpenPopup}
			aria-haspopup="listbox"
			aria-labelledby={attr.id}
			aria-activedescendant={activeOptionId}
			aria-invalid={!isValid}
			aria-readonly={readonly}
			aria-disabled={disabled || displayOptions.length === 0}
			class="{internalTriggerClasses} {triggerClass}"
			tabindex={disabled || displayOptions.length === 0 ? -1 : 0}
			disabled={disabled || displayOptions.length === 0}
		>
			<span class="flex-1 {textEllipsisClasses}">{selectedLabels}</span>
			{#if isOpenPopup}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"><path d="m18 15-6-6-6 6" /></svg
				>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg
				>
			{/if}
		</button>
	{/snippet}

	{#snippet children({ triggerId })}
		<ul
			bind:this={listbox}
			id={listboxId}
			role="listbox"
			aria-labelledby={triggerId}
			// tabindex={-1}
			style:outline="none"
			style:list-style-type="none"
			class="slc-input space-y-1"
		>
			{#each displayOptions as option, i (i)}
				{@const isSelected = selectedIndexes.includes(i)}
				{@const isActive = i === activeIndex}
				<li
					bind:this={optionsLi[i]}
					id="{optionId}-{i}"
					role="option"
					// tabindex={-1}
					aria-selected={isSelected}
					class:bg-secondary-100={isSelected}
					class:outline-2={isActive && isKeyboardNav}
					class:outline-primary-400={isActive && isKeyboardNav}
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
	{/snippet}
</Toggler>
