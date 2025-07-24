<script lang="ts">
	import { focustrap } from '$lib/client/attachments';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';

	let closeButton: HTMLButtonElement | null = $state(null);
	let openButton: HTMLButtonElement | null = $state(null);
	let dialog: HTMLDialogElement | null = $state(null);
	let open = $state(false);

	// let { open = false }: { open: boolean } = $props();

	const handleBackdropClick = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (target === dialog) {
			hide();
		}
	};

	const show = () => {
		open = true;
		tick().then(() => {
			dialog?.showModal();
		});
	};
	const hide = () => {
		dialog?.close();
		open = false;
	};
	const handleOpen = (e: MouseEvent) => {
		e.preventDefault();
		show();
	};

	const handleClose = (e: Event) => {
		e.preventDefault();
		hide();
	};
</script>

<button bind:this={openButton} onclick={handleOpen}>Open Dialog</button>

{#if open}
	<dialog bind:this={dialog} {@attach focustrap} out:fly={{ y: 100, duration: 150 }} onclose={handleClose} onclick={handleBackdropClick}>
		<div class="dialog-content">
			<button bind:this={closeButton} onclick={handleClose}>Close</button>
			<p>This modal dialog has a groovy backdrop!</p>
			<!-- svelte-ignore a11y_autofocus -->
			<input autofocus type="text" />
			<input type="text" />
		</div>
	</dialog>
{/if}

<style>
	/* NOTE: add the following styles to your global stylesheet. */
	dialog,
	dialog::backdrop {
		--anim-duration: 250ms;
		transition:
			display var(--anim-duration) allow-discrete,
			overlay var(--anim-duration) allow-discrete,
			opacity var(--anim-duration),
			transform 150ms;
		opacity: 0;
	}

	dialog {
		/* Sihirli dokunuş: Dialog'u dikey ve yatayda ortalar */
		margin: auto;

		transform: scale(1);

		/* Estetik ve kontrol için eklemeler */
		width: 90%; /* Genişlik ekranın %90'ı olsun */
		max-width: 500px; /* Ama 500px'den fazla büyümesin */
		border: none; /* Tarayıcının varsayılan kenarlığını kaldır */
		border-radius: 0.5rem; /* Köşeleri yuvarlat */
		padding: 0; /* İçerideki div'in tam oturması için dialog'un kendi padding'ini sıfırla */
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); /* Güzel bir gölge ekle */
	}

	dialog::backdrop {
		/* background-color: var(--color-surface-400); */
		background-image: linear-gradient(45deg, magenta, rebeccapurple, dodgerblue, green);
	}

	/* Animate In */
	dialog[open] {
		opacity: 1;
	}
	dialog[open]::backdrop {
		opacity: 0.5;
	}

	/* Animate Out */
	@starting-style {
		dialog[open] {
			transform: translateY(100px);
			opacity: 0;
		}

		dialog[open]::backdrop {
			opacity: 0;
		}
	}

	.dialog-content {
		padding: 1.5rem; /* 24px */
	}
</style>
