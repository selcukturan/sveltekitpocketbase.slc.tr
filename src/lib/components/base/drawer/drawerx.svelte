<script lang="ts">
	import { focustrap } from '$lib/client/attachments';
	import { tick } from 'svelte';

	let { message = 'Onaylıyor musunuz?', yes = 'Evet', no = 'Hayır' }: { message?: string; yes?: string; no?: string } = $props();

	let dialog: HTMLDialogElement | null = $state(null);
	let resolvePromise: ((value: boolean) => void) | null = null;
	let open = $state(false);
	let isClosing = $state(false); // Kapanma animasyonu durumunu tutmak için bir state
	let isBackdropMouseDown = false;

	// Animasyon süresini, JS ve CSS'te senkronize tut.
	export const ANIMATION_DURATION = 150;

	function handleBackdropMousedown(e: MouseEvent) {
		const target = e.target as HTMLElement;
		// dialog ve dialog backdrop aynı elementi temsil eder
		if (target === dialog) {
			isBackdropMouseDown = true;
		} else {
			isBackdropMouseDown = false;
		}
	}

	const handleBackdropClick = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (isBackdropMouseDown && target === dialog) {
			handleClose(e, false);
		}
	};

	export const show = () => {
		isClosing = false; // Dialog açılırken "closing" durumunu sıfırla
		open = true;

		tick().then(() => {
			dialog?.showModal();
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
</script>

<svelte:window onmousedown={handleBackdropMousedown} />

{#if open}
	<!-- Dialog bileşeni -->
	<dialog
		class="bg-surface-50 m-0 w-full max-w-2xl p-0 shadow-xl"
		bind:this={dialog}
		{@attach focustrap}
		onclose={(e) => handleClose(e, false)}
		onclick={handleBackdropClick}
		class:closing={isClosing}
	>
		<!-- Dialog içeriği -->
		<div class="h-full w-full">
			<p>{message}</p>
			<button onclick={(e) => handleClose(e, false)}>{no}</button>
			<button onclick={(e) => handleClose(e, true)}>{yes}</button>
		</div>
	</dialog>
{/if}

<style>
	dialog,
	dialog::backdrop {
		--anim-duration: 150ms;
		transition:
			display var(--anim-duration) allow-discrete,
			overlay var(--anim-duration) allow-discrete,
			opacity var(--anim-duration),
			transform var(--anim-duration) ease-in-out; /* Animasyonun daha yumuşak olması için transform süresini de ekleyelim */
		opacity: 0;
	}

	dialog {
		/* --- KONUM VE BOYUT --- */
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: auto;

		/* max-height bug fixed */
		max-height: none;
		max-height: 100vh;
		height: 100vh;
		/* 5. GÜNCELLENDİ: Açılış animasyonu ile simetrik olması için transform'u sıfırla */
		transform: translateX(0);
	}

	dialog::backdrop {
		background-image: linear-gradient(45deg, var(--color-surface-300));
	}

	/* Animate In */
	dialog[open] {
		opacity: 1;
		/* 6. GÜNCELLENDİ: Açılışta transform'un hedefini belirt. Artık scale değil, Y ekseninde hareket. */
		transform: translateX(0);
	}
	dialog[open]::backdrop {
		opacity: 0.5;
	}

	/* Starting style for entry animation */
	@starting-style {
		dialog[open] {
			transform: translateX(100%);
			opacity: 0;
		}

		dialog[open]::backdrop {
			opacity: 0;
		}
	}

	/* dialog[open].closing yazmak yerine sadece .closing yazmak daha güvenilirdir.
	   Çünkü animasyon bittiğinde [open] attribute'ü kalkacak. */
	dialog.closing {
		opacity: 0;
		transform: translateX(100%);
	}

	/* Kapanırken backdrop'ın da fade-out olması için */
	dialog.closing::backdrop {
		opacity: 0;
	}
</style>
