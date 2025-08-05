<script lang="ts">
	import { focustrap } from '$lib/client/attachments';
	import { tick, type Snippet } from 'svelte';
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
	let openDrawer = $state(false);
	let isClosing = $state(false); // Kapanma animasyonu durumunu tutmak için bir state

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

	// Animasyon süresini, JS ve CSS'te senkronize tut.
	export const ANIMATION_DURATION = 150;

	export const open = () => {
		show();
	};

	export const close = async () => {
		// await performClose(undefined);
		xxxxClose('close');
	};

	const show = () => {
		dialog?.showModal();
		/* isClosing = false; // Dialog açılırken "closing" durumunu sıfırla
		openDrawer = true;
		// dialog?.showModal();
		tick().then(() => {
			// dialog?.showModal();
			onOpen?.(); // onOpen callback'ini çağır
		}); */
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
	const performClose = async (e: Event | undefined) => {
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

	const xxxxClose = (log: string) => {
		/* if (onBeforeClose) {
			closedby = 'none';
			const canClose = onBeforeClose();
			closedby = 'any';
			if (!canClose) {
				return; // Kapatmayı iptal et
			}
		} */
		console.log('xxxxClose - ' + log);
		if (onBeforeClose) {
			onBeforeClose().then((canClose) => {
				if (canClose) {
					dialog?.close();
				}
			});
		} else {
			dialog?.close();
		}

		/* const confirmed = confirm('Are you sure you want to close?');
		if (confirmed) {
			dialog?.close();
		} */
	};

	const dialogAttach: Attachment = (element) => {
		if (!(element instanceof HTMLDialogElement)) {
			throw new Error('Dialog element is not an HTMLDialogElement');
		}
		const handleKeydown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && escClose) {
				// console.log('handleKeydown');
				e.preventDefault();
				xxxxClose('handleKeydown - Esc key pressed');
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
			xxxxClose('handleCancel - Backdrop click');
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
		const handleClose = (e: Event) => {
			//console.log('handleClose');
		};

		element.addEventListener('cancel', handleCancel);
		// element.addEventListener('close', handleClose);
		element.addEventListener('keydown', handleKeydown);
		return () => {
			element.removeEventListener('cancel', handleCancel);
			// element.removeEventListener('close', handleClose);
			element.removeEventListener('keydown', handleKeydown);
		};
	};
</script>

<!-- {#if openDrawer} -->
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

<!-- {/if} -->

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
