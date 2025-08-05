<script lang="ts">
	import { focustrap } from '$lib/client/attachments';
	import { tick } from 'svelte';
	import type { Attachment } from 'svelte/attachments';

	let { message = 'Onaylıyor musunuz?', yes = 'Evet', no = 'Hayır' }: { message?: string; yes?: string; no?: string } = $props();

	let dialog: HTMLDialogElement | null = $state(null);
	let resolvePromise: ((value: boolean) => void) | null = null;
	let open = $state(false);
	let isClosing = $state(false); // Kapanma animasyonu durumunu tutmak için bir state

	// Animasyon süresini, JS ve CSS'te senkronize tut.
	export const ANIMATION_DURATION = 150;
	/**
	 * closedby="none" | Yalnızca "Kapat" düğmesine basmak gerekir.
	 * closedby="closerequest" | "Kapat" düğmesi veya "Esc" tuşu ile kapatılabilir.
	 * closedby="any" | "Kapat" düğmesi, Esc tuşu veya iletişim kutusunun dışına tıklayarak kapatılabilir.
	 */
	let closedby = $state<'any' | 'none' | 'closerequest' | null | undefined>('closerequest');

	export const show = () => {
		isClosing = false; // Dialog açılırken "closing" durumunu sıfırla
		open = true;

		// Yeni bir Promise oluşturup döndürüyoruz.
		return new Promise((resolve) => {
			// Bu Promise'in resolve fonksiyonunu dışarıdaki değişkene atıyoruz.
			// Böylece butonlar bu fonksiyona erişebilir.
			resolvePromise = resolve;

			// DOM'un güncellenmesini bekleyip sonra dialog'u gösteriyoruz.
			tick().then(() => {
				dialog?.showModal();
			});
		});
	};

	// hide fonksiyonu animasyonu da yönetir
	const hide = () => {
		if (!dialog) return;

		isClosing = true; // Kapanma animasyonunu tetikle

		// Animasyonun bitmesini bekle
		setTimeout(() => {
			dialog?.close(); // Gerçek kapatma işlemi
			open = false; // #if bloğu ile DOM'dan kaldırma
			isClosing = false; // Durumu sıfırla
		}, ANIMATION_DURATION);
	};

	// Hem buton tıklamaları hem de dialog'un kendi close olayı (ESC tuşu) aynı fonksiyonu çağırır
	const handleClose = (e: Event, value: boolean) => {
		e.preventDefault();
		if (isClosing) return; // Zaten kapanma sürecindeyse tekrar başlatma
		hide();
		resolvePromise?.(value); // Promise'i true veya false ile çöz
		resolvePromise = null; // Promise'i sıfırla, böylece tekrar kullanılabilir
	};

	const dialogAttach: Attachment = (element) => {
		if (!(element instanceof HTMLDialogElement)) {
			throw new Error('Dialog element is not an HTMLDialogElement');
		}

		const handleCancel = (e: Event) => {
			e.preventDefault();
			handleClose(e, false); // Kapanma işlemini kendi animasyonlu fonksiyonumuzla yapıyoruz
		};

		element.addEventListener('cancel', handleCancel);
		return () => {
			element.removeEventListener('cancel', handleCancel);
		};
	};
</script>

{#if open}
	<dialog
		{closedby}
		class="bg-surface-300 m-auto w-11/12 max-w-lg rounded-lg p-0 shadow-lg"
		bind:this={dialog}
		{@attach focustrap}
		{@attach dialogAttach}
		class:closing={isClosing}
	>
		<div class="dialog-content">
			<p>{message}</p>
			<button onclick={(e) => handleClose(e, false)}>{no}</button>
			<button onclick={(e) => handleClose(e, true)}>{yes}</button>
		</div>
	</dialog>
{/if}

<style>
	dialog {
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
		animation: dialog-enter-from-bottom 0.15s ease-out forwards;
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
		animation: dialog-exit-to-bottom 0.15s ease-in forwards;
	}

	dialog.closing::backdrop {
		animation: backdrop-fade-out 0.15s ease-in forwards;
	}

	@keyframes dialog-enter-from-bottom {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes dialog-exit-to-bottom {
		from {
			opacity: 1;
			transform: translateY(0);
		}
		to {
			opacity: 0;
			transform: translateY(20px);
		}
	}

	@keyframes backdrop-fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 0.4;
		}
	}

	@keyframes backdrop-fade-out {
		from {
			opacity: 0.4;
		}
		to {
			opacity: 0;
		}
	}

	.dialog-content {
		padding: 1.5rem; /* 24px */
	}
</style>
