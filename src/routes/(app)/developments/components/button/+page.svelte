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
		let focusableElements = Array.from(
			dialog.querySelectorAll(
				'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [contenteditable], [tabindex]:not([tabindex="-1"])'
			)
		).map((element) => element as HTMLElement);
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
		<h6>Dialog Header</h6>
	</div>
	<div class="relative flex-1 overflow-x-hidden overflow-y-auto p-1 pt-52">
		<dialog bind:this={dialog} onclose={handleClose} onclick={handleBackdropClick} onkeydown={focusTrap}>
			<!-- İçeriği saran div'e yeni bir class ekledik -->
			<div class="dialog-content">
				<button bind:this={closeButton} onclick={handleClose} class="bg-yellow-500">Close</button>
				<p>This modal dialog has a groovy backdrop!</p>

				<input type="text" class="bg-transparent" />
			</div>
		</dialog>
		<button bind:this={openButton} onclick={handleOpen}>Show the dialog</button>
	</div>
	<div class="bg-warning-100 p-1">
		<h6>Dialog Footer</h6>
	</div>
</div>

<style lang="postcss">
	::backdrop {
		background-color: var(--color-surface-300);
		opacity: 0.75;
	}

	dialog {
		/* Sihirli dokunuş: Dialog'u dikey ve yatayda ortalar */
		margin: auto;

		/* Estetik ve kontrol için eklemeler */
		width: 90%; /* Genişlik ekranın %90'ı olsun */
		max-width: 500px; /* Ama 500px'den fazla büyümesin */
		border: none; /* Tarayıcının varsayılan kenarlığını kaldır */
		border-radius: 0.5rem; /* Köşeleri yuvarlat */
		padding: 0; /* İçerideki div'in tam oturması için dialog'un kendi padding'ini sıfırla */
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); /* Güzel bir gölge ekle */
	}

	/* Dialog içindeki içeriğe biraz boşluk verelim */
	.dialog-content {
		padding: 1.5rem; /* 24px */
	}
</style>
