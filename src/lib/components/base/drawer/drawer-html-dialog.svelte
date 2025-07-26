<script lang="ts">
	import { focustrap } from '$lib/client/attachments';
	import { tick, type Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { isInput } from '$lib/client/utils';

	let {
		children,
		onOpen,
		onClose,
		onBeforeClose,
		escClose = true
	}: {
		children?: Snippet;
		onOpen?: () => void;
		onClose?: () => void;
		onBeforeClose?: () => Promise<boolean>;
		escClose?: boolean;
	} = $props();

	let dialog: HTMLDialogElement | null = $state(null);
	let openDrawer = $state(false);
	let isClosing = $state(false); // Kapanma animasyonu durumunu tutmak için bir state

	/**
	 * closedby="none" | Yalnızca "Kapat" düğmesine basmak gerekir.
	 * closedby="closerequest" | "Kapat" düğmesi veya "Esc" tuşu ile kapatılabilir.
	 * closedby="any" | "Kapat" düğmesi, Esc tuşu veya iletişim kutusunun dışına tıklayarak kapatılabilir.
	 */
	let closedby = $state<'any' | 'none' | 'closerequest' | null | undefined>('any');

	// Animasyon süresini, JS ve CSS'te senkronize tut.
	export const ANIMATION_DURATION = 150;

	export const open = () => {
		show();
	};

	export const close = async () => {
		await handleClose(undefined);
	};

	const show = () => {
		isClosing = false; // Dialog açılırken "closing" durumunu sıfırla
		openDrawer = true;

		tick().then(() => {
			dialog?.showModal();
			onOpen?.(); // onOpen callback'ini çağır
		});
	};

	// hide fonksiyonu animasyonu da yönetir
	const hide = () => {
		if (!dialog) return;

		isClosing = true; // Kapanma animasyonunu tetikle

		// Animasyonun bitmesini bekle
		setTimeout(() => {
			dialog?.close(); // Gerçek kapatma işlemi
			openDrawer = false; // #if bloğu ile DOM'dan kaldırma
			isClosing = false; // Durumu sıfırla
			onClose?.(); // onClose callback'ini animasyon bittikten sonra çağır
		}, ANIMATION_DURATION);
	};

	// Hem buton tıklamaları hem de dialog'un kendi close olayı (ESC tuşu) aynı fonksiyonu çağırır
	const handleClose = async (e: Event | undefined) => {
		if (isClosing) return;
		// onBeforeClose kontrolü
		if (onBeforeClose) {
			closedby = 'none';
			const canClose = await onBeforeClose();
			closedby = 'any';
			if (!canClose) {
				return; // Kapatmayı iptal et
			}
		}

		e?.preventDefault(); // Olası form gönderimlerini vb. engelle
		hide();
	};

	const dialogAttach: Attachment = (element) => {
		if (!(element instanceof HTMLDialogElement)) {
			throw new Error('Dialog element is not an HTMLDialogElement');
		}

		const handleCancel = (e: Event) => {
			e.preventDefault();
			handleClose(e); // Kapanma işlemini kendi animasyonlu fonksiyonumuzla yapıyoruz
		};

		element.addEventListener('cancel', handleCancel);
		return () => {
			element.removeEventListener('cancel', handleCancel);
		};
	};
</script>

{#if openDrawer}
	<!-- Dialog bileşeni -->
	<dialog
		{closedby}
		class="bg-surface-50 m-0 w-full max-w-2xl p-0 shadow-xl"
		bind:this={dialog}
		{@attach focustrap}
		{@attach dialogAttach}
		class:closing={isClosing}
	>
		<!-- Dialog içeriği -->
		<div class="h-full w-full">
			{@render children?.()}
		</div>
	</dialog>
{/if}

<style>
	dialog {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: auto;

		/* max-height bug fixed */
		max-height: none;
		max-height: 100vh;
		height: 100vh;
		/* Başlangıçta dialog görünmez ve animasyona hazır */
		opacity: 0;
	}

	dialog::backdrop {
		background-color: var(--color-surface-300);
		/* Başlangıçta backdrop görünmez ve animasyona hazır */
		opacity: 0;
	}

	/* Animate In */
	dialog[open] {
		animation: dialog-enter-from-right 0.15s ease-out forwards;
	}
	dialog[open]::backdrop {
		animation: backdrop-fade-in 0.15s ease-out forwards;
	}

	/* Starting style for entry animation */
	@starting-style {
		dialog[open] {
			/* Başlangıçta dialog görünmez ve animasyona hazır */
			opacity: 0;
		}

		dialog[open]::backdrop {
			/* Başlangıçta backdrop görünmez ve animasyona hazır */
			opacity: 0;
		}
	}

	/* dialog[open].closing yazmak yerine sadece .closing yazmak daha güvenilirdir. Çünkü animasyon bittiğinde [open] attribute'ü kalkacak. */
	dialog.closing {
		animation: dialog-exit-to-right 0.15s ease-in forwards;
	}

	dialog.closing::backdrop {
		animation: backdrop-fade-out 0.15s ease-in forwards;
	}

	@keyframes dialog-enter-from-right {
		from {
			opacity: 0;
			transform: translateX(200px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes dialog-exit-to-right {
		from {
			opacity: 1;
			transform: translateX(0);
		}
		to {
			opacity: 0;
			transform: translateX(200px);
		}
	}

	@keyframes backdrop-fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 0.5;
		}
	}

	@keyframes backdrop-fade-out {
		from {
			opacity: 0.5;
		}
		to {
			opacity: 0;
		}
	}
</style>
