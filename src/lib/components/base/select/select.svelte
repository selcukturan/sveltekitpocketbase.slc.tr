<script module>
	type PropsType = {
		multiple?: boolean;
		value?: string | string[];
		options: {
			value: string;
			label: string;
			extras?: Record<string, unknown>;
		}[];
		class?: string;
		triggerClass?: string;
		listboxClass?: string;
		optionClass?: string;
		disabled?: boolean;
		readonly?: boolean;
		required?: boolean;
		escClose?: boolean;
		deSelectText?: string;
	};
</script>

<script lang="ts">
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';

	let {
		multiple = false,
		value = $bindable(multiple ? [] : ''),
		options,
		class: classes = '',
		triggerClass = '',
		listboxClass = '',
		optionClass = '',
		disabled,
		readonly,
		required = false,
		escClose = true,
		deSelectText = '-- Seçiniz --'
	}: PropsType = $props();

	const id = $props.id();
	const baseId = `slc-select-${id}`;
	const triggerId = `${baseId}-trigger`;
	const listboxId = `${baseId}-listbox`;
	const optionId = `${baseId}-option`;

	let container: HTMLDivElement | null = null;
	let trigger: HTMLButtonElement | null = null;
	let listbox: HTMLUListElement | null = $state(null);
	let optionsLi: HTMLLIElement[] = $state([]);
	let isOpenPopup = $state(false);
	let isOutsideMouseDown = false;
	let activeIndex = $state(0); // Klavye ile gezinilen aktif opsiyonun indeksi.

	let canDeselect = $derived(!multiple && !required); // -- Seçiniz -- gözükecek mi? Tekli seçim ve zorunlu değilse, kullanıcı seçimi geri sıfırlayabilir.

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
		const labels = selectedIndexes
			.map((i) => displayOptions[i]?.label)
			.filter(Boolean);

		const selectedCount = multiple ? `(${labels.length}) ` : '';

		return labels.length > 0
			? `${selectedCount}${labels.join(', ')}`
			: deSelectText;
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

	const open = async () => {
		if (disabled || readonly) return;

		// Açıldığında klavye navigasyonunu seçili olanla senkronize edilir.
		activeIndex = initialFocusIndex;

		isOpenPopup = true;

		await tick(); // Bekle, DOM güncelleniyor.

		listbox?.focus({ preventScroll: true }); // focus scroll yapmasın, scroll işini scrollIntoView halleder.

		optionsLi[activeIndex]?.scrollIntoView({
			behavior: 'auto', // 'smooth' yerine 'auto' kullanıldı, çünkü 'smooth' bazen performans sorunlarına yol açabilir.
			block: 'nearest'
		});
	};

	const close = () => {
		isOpenPopup = false;

		// await tick(); // Bekle, DOM güncelleniyor.

		trigger?.focus();
	};

	const toggle = () => (isOpenPopup ? close() : open());

	function handleWindowOutsideMousedown(e: MouseEvent) {
		if (!isOpenPopup) return;
		const target = e.target as HTMLElement;
		isOutsideMouseDown = !container?.contains(target);
	}
	function handleWindowOutsideClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (isOpenPopup && isOutsideMouseDown && !container?.contains(target)) {
			close();
		}
	}
	function handleWindowEscPress(e: KeyboardEvent) {
		if (isOpenPopup && escClose && e.code === 'Escape') {
			e.preventDefault();
			close();
		}
	}
	function handleWindowFocusChange(e: FocusEvent) {
		const target = e.target as HTMLElement;
		if (
			isOpenPopup &&
			!trigger?.contains(target) &&
			!container?.contains(target)
		) {
			toggle();
		}
	}

	const handleTriggerKeyDown = (e: KeyboardEvent) => {
		switch (e.code) {
			case 'ArrowDown':
			case 'ArrowUp': {
				e.preventDefault();
				toggle();
				break;
			}
		}
	};

	let searchTimeout: ReturnType<typeof setTimeout> | undefined = undefined;
	let searchString = '';
	const handleListboxKeydown = (e: KeyboardEvent) => {
		// 1. Arama (Typeahead) Mantığı
		// Eğer basılan tuş boşluk hariç tek bir karakterse (Ctrl veya Alt basılı değilken)
		if (
			e.key !== ' ' &&
			e.key.length === 1 &&
			!e.ctrlKey &&
			!e.altKey &&
			!e.metaKey
		) {
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
					nextIndex =
						(activeIndex - 1 + displayOptions.length) % displayOptions.length;
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
				/* if (activeIndex !== -1) { */
				selectOption(activeIndex);
				/* } */
				break;
			}

			case 'Tab':
			case 'Escape': {
				e.preventDefault();
				close();
				break;
			}

			// Diğer tuşlar için bir şey yapma
			default:
				return;
		}
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
				value = value.filter((v) => v !== newSelectedValue);
			} else {
				// ADD
				value = [...value, newSelectedValue];
			}
		} else {
			value = newSelectedValue;
			close();
		}
	}

	const textEllipsisClasses = 'overflow-hidden text-ellipsis whitespace-nowrap';
	const internalContainerClasses =
		'relative inline-block max-w-full min-w-52 select-none';
	const internalTriggerClasses =
		'bg-surface-300 inline-flex w-full cursor-pointer touch-manipulation items-center justify-center px-4 py-1 text-start select-none';
	const internalListboxClasses =
		'bg-warning-300 pointer-events-auto absolute isolate z-1 mt-1 max-h-80 w-full min-w-52 scroll-py-2 list-none overflow-y-auto p-2 select-none';
	const internalOptionClasses =
		'hover:bg-success-100 flex cursor-pointer items-center px-2 py-1 touch-manipulation';
	const internalInvalidTriggerClasses = ' !bg-error-400';
</script>

<svelte:window
	onclick={handleWindowOutsideClick}
	onmousedown={handleWindowOutsideMousedown}
	onkeydown={handleWindowEscPress}
	onfocusin={handleWindowFocusChange}
/>

<!-- Select Container -->
<div bind:this={container} class="{internalContainerClasses} {classes}">
	<!-- Select Trigger -->
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
		class="{internalTriggerClasses} {triggerClass} {!isValid
			? internalInvalidTriggerClasses
			: ''}"
		onclick={() => toggle()}
		onkeydown={handleTriggerKeyDown}
		tabindex={disabled || readonly || displayOptions.length === 0 ? -1 : 0}
		disabled={disabled || displayOptions.length === 0}
	>
		<span class="flex-1 p-1 {textEllipsisClasses}">{selectedLabels}</span>
		<svg
			stroke="currentColor"
			fill="currentColor"
			stroke-width="0"
			viewBox="0 0 1024 1024"
			height="1em"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"
			></path>
		</svg>
	</button>
	<!-- Select Listbox -->
	{#if isOpenPopup && displayOptions.length > 0 && !disabled && !readonly}
		<ul
			bind:this={listbox}
			id={listboxId}
			role="listbox"
			aria-labelledby={triggerId}
			tabindex={-1}
			onkeydown={handleListboxKeydown}
			class="{internalListboxClasses} {listboxClass}"
			transition:fly={{ y: 5, duration: 300 }}
		>
			<!-- Select Options -->
			{#each displayOptions as option, i (i)}
				{@const isSelected = selectedIndexes.includes(i)}
				{@const isActive = i === activeIndex}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<li
					bind:this={optionsLi[i]}
					id="{optionId}-{i}"
					role="option"
					tabindex={-1}
					aria-selected={isSelected}
					class:bg-success-200={isSelected}
					class:outline-2={isActive}
					class="{internalOptionClasses} {optionClass}"
					onclick={() => selectOption(i)}
				>
					<span class="flex-1 {textEllipsisClasses}">
						{option.label}
					</span>
					<span aria-hidden={true} hidden={!isSelected}>
						<svg
							stroke="currentColor"
							fill="currentColor"
							stroke-width="0"
							viewBox="0 0 24 24"
							height="1em"
							width="1em"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path fill="none" d="M0 0h24v24H0z"></path>
							<path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
							></path>
						</svg>
					</span>
				</li>
			{/each}
		</ul>
	{/if}
</div>
