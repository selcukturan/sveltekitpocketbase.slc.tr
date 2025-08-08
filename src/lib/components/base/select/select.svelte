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
	import { is } from 'valibot';

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
	const baseId = `slc-select-${id}`;
	const triggerId = `${baseId}-trigger`;
	const listboxId = `${baseId}-listbox`;
	const optionId = `${baseId}-option`;

	let container: HTMLDivElement | null = null;
	let trigger: HTMLButtonElement | null = null;
	let listbox: HTMLUListElement | null = $state(null);
	let optionsLi: HTMLLIElement[] = $state([]);
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
		optionsLi[activeIndex]?.scrollIntoView({ block: 'center' });
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
				optionsLi[activeIndex]?.scrollIntoView({ block: 'nearest' });
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
					optionsLi[activeIndex]?.scrollIntoView({ block: 'nearest' });
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

	// const optionButtonFocusOverrideClasses = 'focus-override focus-visible:outline-error-400 focus-visible:outline-2 focus-visible:-outline-offset-2';

	let activeOptionId = $derived(active ? `${optionId}-${activeIndex}` : undefined);
</script>

<svelte:window onclick={handleOutsideClick} onmousedown={handleOutsideMousedown} onkeydown={handleEscPress} onfocusin={handleFocusChange} />

<!-- Select Container -->
<div bind:this={container} class="relative select-none">
	<!-- Select Trigger -->
	<button
		bind:this={trigger}
		id={triggerId}
		role="combobox"
		type="button"
		aria-controls={listboxId}
		aria-expanded={active}
		aria-haspopup="listbox"
		aria-labelledby={triggerId}
		aria-activedescendant={activeOptionId}
		tabindex={disabled || readonly ? -1 : 0}
		class="bg-error-300 inline-flex w-full min-w-52 cursor-pointer items-center justify-center px-4 py-1 text-start select-none"
		onclick={() => toggle()}
		onkeydown={handleTriggerKeyDown}
	>
		<span class="flex-1 p-1">{selectedIndex === -1 ? '--Seçiniz--' : options[selectedIndex].label}</span>
		<svg
			stroke="currentColor"
			fill="currentColor"
			stroke-width="0"
			viewBox="0 0 1024 1024"
			height="1em"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path>
		</svg>
	</button>
	<!-- Select Listbox -->
	{#if active && options.length > 0 && !disabled && !readonly}
		<ul
			bind:this={listbox}
			id={listboxId}
			role="listbox"
			aria-labelledby={triggerId}
			tabindex={-1}
			onkeydown={handleListboxKeydown}
			class=" bg-warning-300 pointer-events-auto absolute isolate mt-1 max-h-80 w-full min-w-52 scroll-py-2 list-none overflow-y-auto p-2 select-none"
			transition:fly={{ y: 5, duration: 300 }}
		>
			<!-- Select Options -->
			{#each options as option, i (i)}
				{@const isSelected = i === selectedIndex}
				{@const isActive = i === activeIndex}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<li
					bind:this={optionsLi[i]}
					id="{optionId}-{i}"
					role="option"
					tabindex={-1}
					aria-selected={isSelected}
					class:bg-success-200={isSelected}
					class:bg-success-400={isActive}
					class="hover:bg-success-100 flex cursor-pointer items-center px-2 py-1"
					onclick={() => selectOption(i, option.value)}
				>
					<span class="flex-1">
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
							<path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
						</svg>
					</span>
				</li>
			{/each}
		</ul>
	{/if}
</div>
