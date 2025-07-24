<script lang="ts">
	import { focustrap } from '$lib/client/attachments';
	import { tick } from 'svelte';

	let closeButton: HTMLButtonElement | null = $state(null);
	let openButton: HTMLButtonElement | null = $state(null);
	let dialog: HTMLDialogElement | null = $state(null);
	let open = $state(false);
	let isClosing = $state(false); // 1. YENİ: Kapanma animasyonu durumunu tutmak için yeni bir state

	// Animasyon süresini bir değişkende tutmak, JS ve CSS'i senkronize tutmayı kolaylaştırır.
	const ANIMATION_DURATION = 150;

	const handleBackdropClick = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (target === dialog) {
			// hide();
		}
	};

	const show = () => {
		isClosing = false; // Dialog açılırken "closing" durumunu sıfırla
		open = true;
		tick().then(() => {
			dialog?.showModal();
		});
	};

	// 2. GÜNCELLENDİ: hide fonksiyonu artık animasyonu yönetecek
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

	const handleOpen = (e: MouseEvent) => {
		e.preventDefault();
		show();
	};

	// 3. GÜNCELLENDİ: Hem buton tıklaması hem de dialog'un kendi close olayı (ESC tuşu) aynı fonksiyonu çağırmalı
	const handleInitiateClose = (e: Event) => {
		e.preventDefault();
		// Zaten kapanma sürecindeyse tekrar başlatma
		if (isClosing) return;
		hide();
	};
</script>

<button bind:this={openButton} onclick={handleOpen}>Open Dialog</button>

{#if open}
	<!-- 4. GÜNCELLENDİ: Kapanma animasyonu için `closing` sınıfını dinamik olarak ekle -->
	<dialog
		class="bg-surface-300 m-auto w-11/12 max-w-lg rounded-lg p-0 shadow-lg"
		bind:this={dialog}
		{@attach focustrap}
		onclose={handleInitiateClose}
		onclick={handleBackdropClick}
		class:closing={isClosing}
	>
		<div class="dialog-content">
			<button bind:this={closeButton} onclick={handleInitiateClose}>Close</button>
			<p>This modal dialog has a groovy backdrop!</p>
			<!-- svelte-ignore a11y_autofocus -->
			<input type="text" />
			<input type="text" />
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
		/* 5. GÜNCELLENDİ: Açılış animasyonu ile simetrik olması için transform'u sıfırla */
		transform: translateY(0);
	}

	dialog::backdrop {
		background-image: linear-gradient(45deg, var(--color-surface-300));
	}

	/* Animate In */
	dialog[open] {
		opacity: 1;
		/* 6. GÜNCELLENDİ: Açılışta transform'un hedefini belirt. Artık scale değil, Y ekseninde hareket. */
		transform: translateY(0);
	}
	dialog[open]::backdrop {
		opacity: 0.5;
	}

	/* Starting style for entry animation */
	@starting-style {
		dialog[open] {
			transform: translateY(20px);
			opacity: 0;
		}

		dialog[open]::backdrop {
			opacity: 0;
		}
	}

	/* 7. YENİ: Kapanma animasyonu için yeni kural */
	/* dialog[open].closing yazmak yerine sadece .closing yazmak daha güvenilirdir.
	   Çünkü animasyon bittiğinde [open] attribute'ü kalkacak. */
	dialog.closing {
		opacity: 0;
		transform: translateY(20px);
	}

	/* Kapanırken backdrop'ın da fade-out olması için */
	dialog.closing::backdrop {
		opacity: 0;
	}

	.dialog-content {
		padding: 1.5rem; /* 24px */
	}
</style>
