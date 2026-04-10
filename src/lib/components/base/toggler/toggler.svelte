<script lang="ts">
	import type { Snippet } from 'svelte';
	import { on } from 'svelte/events';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	type TogglerProps = {
		active?: boolean;
		placement?: string;

		minWidth?: string;
		maxWidth?: string;
		maxHeight?: string;
		matchTriggerWidth?: boolean;

		class?: string;
		contentClasses?: string;
		trigger: Snippet<[{ active: boolean; toggle: () => void; close: () => void }]>; // trigger fonksiyonuna toggle ve close fonksiyonlarını içeren bir parametre veriyoruz
		children: Snippet<[{ close: () => void }]>;
	};

	let {
		active = $bindable(false),
		placement = 'bottom-start',
		minWidth = '100%', // Varsayılan: En az buton kadar geniş
		maxWidth = '300px',
		maxHeight = '400px',
		matchTriggerWidth = false, // Buton genişliğiyle birebir aynı olsun mu?
		class: className = '',
		contentClasses = '',
		trigger,
		children,
		...rest
	}: TogglerProps = $props();

	let container: HTMLDivElement | null = $state(null);
	let triggerWidth = $state(0); // Tetikleyicinin genişliğini takip edeceğiz

	const toggle = () => (active = !active);
	const close = () => (active = false);

	// Dinamik Stil Hesaplama
	let contentStyle = $derived.by(() => {
		let styles = [];

		// Genişlik ayarları
		if (matchTriggerWidth) {
			styles.push(`width: ${triggerWidth}px`);
		} else {
			styles.push(`min-width: ${minWidth}`);
			styles.push(`max-width: ${maxWidth}`);
		}

		// Yükseklik ayarları
		styles.push(`max-height: ${maxHeight}`);

		return styles.join('; ');
	});

	// Animasyon parametrelerini yöne göre hesapla
	// Menü nereden açılıyorsa, o yönden hafifçe "süzülerek" gelmesini sağlar
	let transitionParams = $derived.by(() => {
		const base = { duration: 150, easing: cubicOut, start: 0.95 };
		if (placement.startsWith('bottom')) return { ...base, y: -8 };
		if (placement.startsWith('top')) return { ...base, y: 8 };
		if (placement.startsWith('left')) return { ...base, x: 8 };
		if (placement.startsWith('right')) return { ...base, x: -8 };
		return base;
	});

	// outside click ve esc key event
	const out = () => on(window, 'click', (e: MouseEvent) => container && !container.contains(e.target as HTMLElement) && close());
	const esc = () => on(window, 'keydown', (e: KeyboardEvent) => e.key === 'Escape' && close());
</script>

<div bind:this={container} bind:clientWidth={triggerWidth} class="toggler {className}" {@attach out} {@attach esc} {...rest}>
	<div class="trigger-wrapper">
		{@render trigger?.({ active, toggle, close })}
	</div>

	{#if active}
		<!-- 
			transition:fly ile hem opaklık hem hareket ekliyoruz.
			Aynı zamanda CSS ile transform-origin belirleyerek 
			büyüme efektinin tetikleyiciden dışarı doğru olmasını sağlıyoruz.
			{@attach myAttachment}
			use:myaction
		-->
		<div transition:fly={transitionParams} class="toggler-content {placement} {contentClasses}" style={contentStyle}>
			<div class="scroll-container">
				{@render children?.({ close })}
			</div>
		</div>
	{/if}
</div>

<style>
	.toggler {
		position: relative;
		display: inline-block;
	}

	.trigger-wrapper {
		display: inline-block;
	}

	.toggler-content {
		/* filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1)); */
		position: absolute;
		/* z-index: 100; */
		display: flex;
		flex-direction: column;
		overflow: hidden; /* Köşelerin taşmasını engeller */
	}

	.scroll-container {
		overflow-y: auto; /* İçerik max-height'ı aşarsa scroll çıkar */
		overflow-x: hidden;
		width: 100%;
		height: 100%;
	}

	/* --- Transform Origin Ayarları --- */
	/* Bu ayar, animasyonun (scale) hangi noktadan başlayacağını belirler */
	.bottom-start,
	.bottom-center,
	.bottom-end {
		transform-origin: top;
	}
	.top-start,
	.top-center,
	.top-end {
		transform-origin: bottom;
	}
	.left-start,
	.left-center,
	.left-end {
		transform-origin: right;
	}
	.right-start,
	.right-center,
	.right-end {
		transform-origin: left;
	}

	/* --- YÖNLENDİRME MANTIĞI (CSS) --- */

	/* Alt Yönler */
	.bottom-start {
		top: 100%;
		left: 0;
		margin-top: 5px;
	}
	.bottom-center {
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		margin-top: 5px;
	}
	.bottom-end {
		top: 100%;
		right: 0;
		margin-top: 5px;
	}

	/* Üst Yönler */
	.top-start {
		bottom: 100%;
		left: 0;
		margin-bottom: 5px;
	}
	.top-center {
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		margin-bottom: 5px;
	}
	.top-end {
		bottom: 100%;
		right: 0;
		margin-bottom: 5px;
	}

	/* Sol Yönler */
	.left-start {
		right: 100%;
		top: 0;
		margin-right: 5px;
	}
	.left-center {
		right: 100%;
		top: 50%;
		transform: translateY(-50%);
		margin-right: 5px;
	}
	.left-end {
		right: 100%;
		bottom: 0;
		margin-right: 5px;
	}

	/* Sağ Yönler */
	.right-start {
		left: 100%;
		top: 0;
		margin-left: 5px;
	}
	.right-center {
		left: 100%;
		top: 50%;
		transform: translateY(-50%);
		margin-left: 5px;
	}
	.right-end {
		left: 100%;
		bottom: 0;
		margin-left: 5px;
	}
</style>
