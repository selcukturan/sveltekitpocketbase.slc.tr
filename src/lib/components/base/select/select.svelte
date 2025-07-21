<script lang="ts">
	import { fly } from 'svelte/transition';

	let container: HTMLDivElement | null = null;
	let trigger: HTMLButtonElement | null = null;
	let active = $state(false);
	let isOutsideMouseDown = $state(false);
	let escClose = $state(true);
	let disabled = $state(false);
	let readonly = $state(false);

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
</script>

<svelte:window onclick={handleOutsideClick} onmousedown={handleOutsideMousedown} onkeydown={handleEscPress} onfocusin={handleFocusChange} />

<!-- Select Container -->
<div bind:this={container} class="relative select-none">
	<!-- Select Trigger -->
	<button
		bind:this={trigger}
		role="combobox"
		aria-controls="popup-1"
		aria-haspopup="listbox"
		aria-expanded={active}
		tabindex={disabled || readonly ? -1 : 0}
		class="bg-error-300 w-full select-none"
		onclick={() => (active = !active)}>Trigger</button
	>
	<!-- Select Popup -->
	{#if active}
		<ul role="listbox" id="popup-1" class="bg-warning-300 absolute w-full select-none" transition:fly={{ y: 3, duration: 150 }}>
			<li role="option" aria-selected={true} class="cursor-pointer p-2 hover:bg-gray-100">Option 1</li>
			<li role="option" aria-selected={false} class="cursor-pointer p-2 hover:bg-gray-100">Option 2</li>
			<li role="option" aria-selected={false} class="cursor-pointer p-2 hover:bg-gray-100">Option 3</li>
		</ul>
	{/if}
</div>
