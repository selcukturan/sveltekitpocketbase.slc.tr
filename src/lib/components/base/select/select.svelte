<script lang="ts">
	// https://github.com/pocketbase/pocketbase/blob/master/ui/src/components/base/Toggler.svelte
	import { fly } from 'svelte/transition';

	const id = $props.id();
	let container: HTMLDivElement | null = null;

	let trigger: HTMLButtonElement | null = null;
	let active = $state(false);
	let isOutsideMouseDown = $state(false);
	let escClose = $state(true);
	let disabled = $state(false);
	let readonly = $state(false);
	let options = $state([
		{ label: 'Option 1', value: 'option1', selected: true },
		{ label: 'Option 2', value: 'option2' },
		{ label: 'Option 3', value: 'option3' },
		{ label: 'Option 4', value: 'option4' }
	]);
	let initialSelectedOption = $state(options[0]); // Başlangıçta seçili olan
	let selectedOptionIndex = $state(0); // Başlangıçta seçili olan
	let activeOptionIndex = $state(0); // Klavye ile gezinilen aktif opsiyonun indeksi

	function handleOutsideMousedown(e: MouseEvent) {
		if (!active) return;
		const target = e.target as HTMLElement;
		isOutsideMouseDown = !container?.contains(target);
	}

	function handleOutsideClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (active && isOutsideMouseDown && !container?.contains(target)) {
			active = false;
		}
	}

	function handleEscPress(e: KeyboardEvent) {
		if (active && escClose && e.code === 'Escape') {
			e.preventDefault();
			active = false;
		}
	}

	function handleFocusChange(e: FocusEvent) {
		const target = e.target as HTMLElement;
		if (active && !trigger?.contains(target) && !container?.contains(target)) {
			// toggle();
			active = !active;
		}
	}

	function selectOption(index: number) {
		selectedOptionIndex = index;
		active = false;
	}
</script>

<svelte:window onclick={handleOutsideClick} onmousedown={handleOutsideMousedown} onkeydown={handleEscPress} onfocusin={handleFocusChange} />

<!-- Select Container -->
<div bind:this={container} tabindex="-1" class="relative select-none">
	<!-- Select Trigger -->
	<button
		bind:this={trigger}
		role="combobox"
		id={`slc-combobox-button-${id}`}
		aria-controls={`slc-listbox-popup-${id}`}
		aria-haspopup="listbox"
		aria-expanded={active}
		aria-activedescendant={active ? `slc-option-${id}-${activeOptionIndex}` : undefined}
		tabindex={disabled || readonly ? -1 : 0}
		class="bg-error-300 w-full select-none"
		onclick={() => (active = !active)}>Trigger</button
	>
	<!-- Select Popup -->
	{#if active}
		<div
			role="listbox"
			aria-labelledby={`slc-combobox-button-${id}`}
			id={`slc-listbox-popup-${id}`}
			tabindex="-1"
			class="bg-warning-300 absolute flex w-full flex-col select-none"
			transition:fly={{ y: 3, duration: 150 }}
		>
			{#each options as option, i}
				<button
					id={`slc-option-${id}-${i}`}
					role="option"
					aria-selected={i === selectedOptionIndex}
					class:bg-success-200={i === selectedOptionIndex}
					class="hover:bg-success-100 cursor-pointer p-2"
					onclick={() => selectOption(i)}
				>
					{option.label}
				</button>
			{/each}
		</div>
	{/if}
</div>
