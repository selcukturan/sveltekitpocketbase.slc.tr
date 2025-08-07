<script lang="ts" module>
	type Option = {
		value: unknown;
		label: string;
		extras?: Record<string, unknown>;
	};
</script>

<script lang="ts" generics="T extends Option">
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';

	let {
		value = $bindable(undefined),
		selectedIndex = $bindable(-1),
		options,
		disabled,
		readonly,
		escClose = true
	}: { value?: T['value']; selectedIndex?: number; options: T[]; disabled?: boolean; readonly?: boolean; escClose?: boolean } = $props();

	// öneri (value ve selectedIndex senkronizasyonu), bileşeninizin API'sini (yani nasıl kullanılacağını)
	// ciddi anlamda basitleştireceği için en önemli iyileştirme olabilir.

	const id = $props.id();
	let container: HTMLDivElement | null = null;
	let trigger: HTMLButtonElement | null = null;
	let listbox: HTMLDivElement | null = $state(null);
	let optionButtons: HTMLButtonElement[] = $state([]);
	let active = $state(false);
	let isOutsideMouseDown = $state(false);
	let activeIndex = $state(0); // Klavye ile gezinilen aktif opsiyonun indeksi

	const open = async () => {
		if (disabled || readonly) return;

		// Açıldığında klavye navigasyonunu seçili olanla senkronize et
		activeIndex = selectedIndex !== -1 ? selectedIndex : 0;

		active = true;

		await tick(); // Bekle, DOM güncellensin

		// ODAĞI LİSTBOX'A VER
		listbox?.focus();

		// optionButtons[activeIndex]?.focus();
		// VE SEÇİLİ ELEMANI GÖRÜNÜR KIL
		optionButtons[activeIndex]?.scrollIntoView({ block: 'nearest' });
	};
	const close = async () => {
		active = false;
		await tick(); // Bekle, DOM güncellensin
		trigger?.focus();
	};
	const toggle = () => {
		if (active) {
			close();
		} else {
			open();
		}
	};

	function handleOutsideMousedown(e: MouseEvent) {
		if (!active) return;
		const target = e.target as HTMLElement;
		isOutsideMouseDown = !container?.contains(target);
	}
	function handleOutsideClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (active && isOutsideMouseDown && !container?.contains(target)) {
			console.log('handleOutsideClick');
			close();
		}
	}
	function handleEscPress(e: KeyboardEvent) {
		if (active && escClose && e.code === 'Escape') {
			e.preventDefault();
			close();
		}
	}
	function handleFocusChange(e: FocusEvent) {
		const target = e.target as HTMLElement;
		if (active && !trigger?.contains(target) && !container?.contains(target)) {
			console.log('handleFocusChange');
			toggle();
		}
	}

	let searchTimeout: ReturnType<typeof setTimeout> | undefined = undefined;
	let searchString = ''; // Arama metni
	const handleListboxKeydown = (e: KeyboardEvent) => {
		// 1. Arama (Typeahead) Mantığı
		//----------------------------------------------------
		// Eğer basılan tuş boşluk hariç tek bir karakterse (Ctrl veya Alt basılı değilken)
		if (e.key !== ' ' && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
			e.preventDefault();

			// Önceki zamanlayıcıyı temizle
			clearTimeout(searchTimeout);

			// Yeni basılan karakteri arama metnine ekle
			searchString += e.key.toLocaleLowerCase('tr-TR'); // Türkçe'ye uygun küçük harf çevrimi

			// Arama metnine uyan ilk opsiyonu bul
			const matchIndex = options.findIndex((opt) => opt.label.toLocaleLowerCase('tr-TR').startsWith(searchString));

			// Eğer bir eşleşme bulunursa
			if (matchIndex !== -1) {
				activeIndex = matchIndex;
				// optionButtons[activeIndex]?.focus();
				optionButtons[activeIndex]?.scrollIntoView({ block: 'nearest' });
			}

			// Kullanıcı yazmayı bırakırsa arama metnini sıfırla (örn: 500ms sonra)
			searchTimeout = setTimeout(() => {
				searchString = '';
			}, 500); // Yarım saniye bekleme süresi iyi bir başlangıçtır.

			return; // Arama yapıldı, fonksiyonun geri kalanına gerek yok.
		}

		// 2. Navigasyon ve Seçim Mantığı
		//----------------------------------------------------
		switch (e.code) {
			case 'ArrowUp':
			case 'ArrowDown':
			case 'Home':
			case 'End': {
				e.preventDefault();
				let nextIndex = activeIndex;

				if (e.code === 'ArrowUp') {
					nextIndex = (activeIndex - 1 + options.length) % options.length;
				} else if (e.code === 'ArrowDown') {
					nextIndex = (activeIndex + 1) % options.length;
				} else if (e.code === 'Home') {
					nextIndex = 0;
				} else if (e.code === 'End') {
					nextIndex = options.length - 1;
				}

				if (nextIndex !== activeIndex) {
					activeIndex = nextIndex;
					// optionButtons[activeIndex]?.focus();
					optionButtons[activeIndex]?.scrollIntoView({ block: 'nearest' });
				}
				break;
			}

			case 'Enter':
			case 'Space': {
				e.preventDefault();
				if (activeIndex !== -1) {
					selectOption(activeIndex, options[activeIndex].value);
				}
				break;
			}

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

	function selectOption(index: number, val: T['value']) {
		value = val;
		selectedIndex = index;
		close();
	}

	const optionButtonFocusOverrideClasses = 'focus-override focus-visible:outline-error-400 focus-visible:outline-2 focus-visible:-outline-offset-2';
</script>

<svelte:window onclick={handleOutsideClick} onmousedown={handleOutsideMousedown} onkeydown={handleEscPress} onfocusin={handleFocusChange} />

<!-- Select Container -->
<div bind:this={container} class="relative select-none">
	<!-- Select Trigger -->
	<button
		bind:this={trigger}
		role="combobox"
		id={`slc-combobox-button-${id}`}
		aria-controls={`slc-listbox-popup-${id}`}
		aria-haspopup="listbox"
		aria-expanded={active}
		aria-activedescendant={active ? `slc-option-${id}-${activeIndex}` : undefined}
		tabindex={disabled || readonly ? -1 : 0}
		class="bg-error-300 w-full select-none"
		onclick={() => toggle()}>{selectedIndex === -1 ? '--Seçiniz--' : options[selectedIndex].label}</button
	>
	<!-- Select Listbox -->
	{#if active && options.length > 0 && !disabled && !readonly}
		<div
			bind:this={listbox}
			role="listbox"
			aria-labelledby={`slc-combobox-button-${id}`}
			id={`slc-listbox-popup-${id}`}
			tabindex={-1}
			onkeydown={handleListboxKeydown}
			class="bg-warning-300 absolute flex max-h-80 w-full flex-col overflow-y-auto select-none"
			transition:fly={{ y: 5, duration: 300 }}
		>
			<!-- Select Options -->
			{#each options as option, i (i)}
				<button
					id={`slc-option-${id}-${i}`}
					bind:this={optionButtons[i]}
					role="option"
					tabindex={-1}
					aria-selected={i === selectedIndex}
					class:bg-success-200={i === selectedIndex}
					class:bg-success-400={i === activeIndex}
					class="hover:bg-success-100 cursor-pointer p-2 {optionButtonFocusOverrideClasses}"
					onclick={() => selectOption(i, option.value)}
				>
					{option.label}
				</button>
			{/each}
		</div>
	{/if}
</div>
