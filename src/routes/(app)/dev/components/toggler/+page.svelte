<script lang="ts">
	import { onMount } from 'svelte';

	let closeButton: HTMLButtonElement;
	let openButton: HTMLButtonElement;
	let dialog: HTMLDialogElement;

	let firstFocusableElement: HTMLElement;
	let lastFocusableElement: HTMLElement;

	let { open = false }: { open: boolean } = $props();

	$effect(() => {
		if (open) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	});

	onMount(() => {
		let focusableElements = Array.from(dialog.querySelectorAll('a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [contenteditable], [tabindex]:not([tabindex="-1"])')).map(
			(element) => element as HTMLElement
		);
		focusableElements = focusableElements.filter((element) => !element.hasAttribute('disabled'));
		firstFocusableElement = focusableElements[0];
		lastFocusableElement = focusableElements[focusableElements.length - 1];
	});

	function focusTrap(e: KeyboardEvent) {
		if (e.key === 'Tab') {
			if (e.shiftKey) {
				/* shift + tab */
				if (document.activeElement === firstFocusableElement) {
					lastFocusableElement.focus();
					e.preventDefault();
				}
			} else {
				/* tab */
				if (document.activeElement === lastFocusableElement) {
					firstFocusableElement.focus();
					e.preventDefault();
				}
			}
		}
	}

	const handleBackdropClick = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (target === dialog) {
			open = false;
		}
	};
	const handleOpen = (e: MouseEvent) => {
		open = true;
		e.preventDefault();
	};

	const handleClose = (e: Event) => {
		open = false;
		e.preventDefault();
	};
</script>

<div class="flex h-full w-full flex-col overflow-hidden">
	<div class="bg-success-100 p-1">
		<h6>Toggler</h6>
	</div>
	<div class="relative flex-1 overflow-y-auto overflow-x-hidden p-1 pt-52">
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<dialog bind:this={dialog} onclose={handleClose} onclick={handleBackdropClick} onkeydown={focusTrap} class="bg-red-500">
			<div class="h-full w-full bg-green-500">
				<button bind:this={closeButton} onclick={handleClose} class="bg-yellow-500">Close</button>
				<p>This modal dialog has a groovy backdrop!</p>
				<!-- svelte-ignore a11y_autofocus -->
				<input autofocus type="text" />
				<input type="text" />
			</div>
		</dialog>
		<button bind:this={openButton} onclick={handleOpen}>Show the dialog</button>
	</div>
	<div class="bg-warning-100 p-1">
		<h6>https://github.com/pocketbase/pocketbase/blob/master/ui/src/components/base/Toggler.svelte</h6>
	</div>
</div>

<style>
	::backdrop {
		background-image: linear-gradient(45deg, magenta, rebeccapurple, dodgerblue, green);
		opacity: 0.75;
	}
</style>
