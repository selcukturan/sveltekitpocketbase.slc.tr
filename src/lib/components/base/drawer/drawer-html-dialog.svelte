<script lang="ts">
	import { focustrap } from '$lib/client/attachments';
	import { type Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';

	/**
	 * KISIT TARAYICI UYUMLULUĞU:
	 * https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#browser_compatibility
	 * https://caniuse.com/dialog
	 */
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
	let isClosing = $state(false); // Kapanma animasyonu durumunu tutmak için bir state
	const ANIMATION_DURATION = 150; // Animasyon süresini, JS ve CSS'te senkronize tut.
	/**
	 * KISIT TARAYICI UYUMLULUĞU:
	 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy#browser_compatibility
	 * https://caniuse.com/mdn-html_elements_dialog_closedby
	 *
	 * closedby="none" | Yalnızca "Kapat" düğmesine basmak gerekir.
	 * closedby="closerequest" | "Kapat" düğmesi veya "Esc" tuşu ile kapatılabilir.
	 * closedby="any" | "Kapat" düğmesi, Esc tuşu veya iletişim kutusunun dışına tıklayarak kapatılabilir.
	 */
	let closedby = $state<'any' | 'none' | 'closerequest' | null | undefined>('any');

	export const open = () => {
		show();
	};

	export const close = async () => {
		hide('close');
	};

	const show = () => {
		dialog?.showModal();
		onOpen?.();
	};

	const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
	const hide = async (log: string) => {
		if (isClosing) return; // Kapatma işlemi zaten başladıysa tekrar çalıştırma

		// console.log('hide - ' + log);

		let canClose = true; // Varsayılan olarak kapatılabileceği kabul edilir.

		if (onBeforeClose) {
			canClose = await onBeforeClose(); // "await" ile onBeforeClose fonksiyonunun tamamlanmasını beklenir.
		}

		if (!canClose) return; // Kapatma izni yoksa fonksiyondan erken çık

		isClosing = true; // Artık kapatma işlemi başlayabilir. Kapatma işlemi CSS `.closing` animasyonu başlar.

		await sleep(ANIMATION_DURATION); // CSS animasyonu için bekleniyor. Kod burada duraklar.

		// Bekleme bittikten sonraki işlemler. Kapatma işlemi CSS `.closing` animasyonu bitti. Diyalog kapatılıyor.
		isClosing = false;
		dialog?.close();
		onClose?.();
	};

	const dialogAttach: Attachment = (element) => {
		if (!(element instanceof HTMLDialogElement)) {
			throw new Error('Dialog element is not an HTMLDialogElement');
		}

		const handleKeydown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && escClose) {
				e.preventDefault();
				hide('drawer - handleKeydown - Esc key pressed');
			}
		};

		/**
		 * oncancel olayı, bir diyalogun kapatılma niyetinin bir "iptal" eylemi olduğunu belirtir.
		 * oncancel: Diyalog sadece kullanıcı tarafından "iptal edildiğinde" tetiklenir. Bu genellikle Esc tuşuna basılmasıdır.
		 *
		 * Ne zaman tetiklenir?
		 * Kullanıcı klavyeden Esc tuşuna bastığında.
		 *
		 * En Önemli Özelliği Nedir?
		 * oncancel olayının en güçlü yanı, event.preventDefault() metodu ile diyalogun kapanmasını engelleyebilmenizdir.
		 * Bu, özellikle kullanıcıya "Değişiklikleri kaydetmeden çıkmak istediğinize emin misiniz?" gibi bir soru sormak için idealdir.
		 *
		 * Kullanım Amacı:
		 * Kullanıcının yaptığı bir işlemi (örneğin bir formu doldurmayı) yarıda bırakıp Esc ile çıkmaya çalıştığı durumları yönetmek için kullanılır.
		 */
		const handleCancel = (e: Event) => {
			e.preventDefault();
			hide('handleCancel - Backdrop click');
		};

		/**
		 * onclose: Diyalog, sebebi ne olursa olsun, her kapandığında tetiklenir.
		 * onclose olayı, diyalog penceresi kapandığında her zaman tetiklenir. Kapanma sebebinin bir önemi yoktur.
		 *
		 * Ne zaman tetiklenir?
		 * Kullanıcı Esc tuşuna bastığında (eğer oncancel ile engellenmediyse).
		 * JavaScript ile dialog.close() metodu çağrıldığında.
		 * Diyalog içindeki bir formda method="dialog" olan bir buton tıklandığında.
		 *
		 * En Önemli Özelliği Nedir?
		 * onclose olayı engellenemez. Sadece diyalog kapandıktan sonra ne yapılacağını belirlemek için kullanılır.
		 * Genellikle temizlik işlemleri (örneğin form alanlarını sıfırlamak) için idealdir.
		 *
		 * Kullanım Amacı:
		 * Diyalog kapatıldıktan sonra arayüzü veya verileri sıfırlamak, temizlemek veya son bir işlem yapmak için kullanılır.
		 */
		/* const handleClose = (e: Event) => {
			// console.log('handleClose');
		}; */

		element.addEventListener('cancel', handleCancel);
		// element.addEventListener('close', handleClose);
		element.addEventListener('keydown', handleKeydown);
		return () => {
			element.removeEventListener('cancel', handleCancel);
			// element.removeEventListener('close', handleClose);
			element.removeEventListener('keydown', handleKeydown);
		};
	};

	const dialogClasses = 'bg-surface-50 m-0 w-full max-w-2xl p-0 shadow-xl';
	const dialogFocusOverrideClasses = 'focus-override focus-visible:outline-primary-400 focus-visible:outline-2 focus-visible:-outline-offset-3';
</script>

<dialog
	{closedby}
	class:closing={isClosing}
	class="{dialogClasses} {dialogFocusOverrideClasses}"
	bind:this={dialog}
	{@attach focustrap}
	{@attach dialogAttach}
>
	<div class="h-full w-full">
		{@render children?.()}
	</div>
</dialog>

<style>
	dialog {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: auto;

		/* max-height bug fixed */
		max-height: none;
		max-height: 100%;
		height: 100%;
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

	dialog[open].closing {
		animation: dialog-exit-to-right 0.15s ease-out forwards;
	}

	dialog[open].closing::backdrop {
		animation: backdrop-fade-out 0.15s ease-out forwards;
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
