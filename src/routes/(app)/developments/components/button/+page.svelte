<script lang="ts">
	import { tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let drawer: HTMLElement | null = $state(null);
	let firstFocusableElement: HTMLElement;
	let lastFocusableElement: HTMLElement;

	// Sadece drawer'ın açık/kapalı durumunu tutuyoruz.
	let open = $state(false);

	// Drawer'ı kapatmak için bir fonksiyon
	function close() {
		open = false;
	}

	// Drawer'ı açmak için bir fonksiyon
	function show() {
		open = true;
	}

	$effect(() => {
		if (!drawer) return;
		let focusableElements = Array.from(
			drawer.querySelectorAll(
				'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [contenteditable], [tabindex]:not([tabindex="-1"])'
			)
		).map((element) => element as HTMLElement);
		focusableElements = focusableElements.filter((element) => !element.hasAttribute('disabled'));
		firstFocusableElement = focusableElements[0];
		lastFocusableElement = focusableElements[focusableElements.length - 1];

		tick().then(() => {
			if (firstFocusableElement) {
				firstFocusableElement.focus();
			}
		});
	});

	function focusTrap(e: KeyboardEvent) {
		if (e.key === 'Tab') {
			if (e.shiftKey) {
				// shift + tab
				if (document.activeElement === firstFocusableElement) {
					lastFocusableElement.focus();
					e.preventDefault();
				}
			} else {
				// tab
				if (document.activeElement === lastFocusableElement) {
					firstFocusableElement.focus();
					e.preventDefault();
				}
			}
		}
	}

	// Portal Action: Drawer'ı body'ye taşır
	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				if (node.parentNode) {
					node.parentNode.removeChild(node);
				}
			}
		};
	}
</script>

<!-- #if bloğu, portal'ı da içine alarak DOM'a ekleme/kaldırma işini yönetir -->
{#if open}
	<!-- Portal action'ı ile drawer'ı body'ye ışınlıyoruz -->
	<div use:portal>
		<!-- Backdrop (Arka Plan) -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="bg-surface-300/50 fixed inset-0 z-55" onclick={close} transition:fade={{ duration: 150 }}></div>

		<!-- Drawer Panel -->
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<div
			bind:this={drawer}
			onkeydown={focusTrap}
			class="bg-surface-50 fixed top-0 right-0 z-56 h-full w-full max-w-2xl bg-white shadow-xl"
			role="dialog"
			aria-modal="true"
			aria-labelledby="drawer-title"
			in:fly={{ duration: 150, x: 50 }}
			out:fly={{ duration: 150, x: 50 }}
		>
			<div class="flex h-full flex-col">
				<!-- Header -->
				<header class="flex items-center justify-between border-b p-4">
					<div id="drawer-title">
						<h2 class="text-lg font-semibold">Panel</h2>
					</div>
				</header>

				<!-- İçerik -->
				<main class="flex-1 overflow-y-auto p-4">
					<p>Bu, sağdan kayarak açılan bir panel!</p>

					<input type="text" class="mt-4 w-full rounded border bg-transparent p-2" placeholder="Odaklanılabilir alan 1" />
					<button class="mt-4 rounded bg-blue-500 p-2 text-white">Buton</button>
					<textarea class="mt-4 w-full rounded border bg-transparent p-2" placeholder="Odaklanılabilir alan 2"></textarea>
				</main>

				<!-- Footer -->
				<footer class="border-t p-4">
					<div class="flex justify-end">
						<button onclick={close} class="rounded bg-gray-500 px-4 py-2 text-white"> Kapat </button>
					</div>
				</footer>
			</div>
		</div>
	</div>
{/if}

<!-- Sayfa içeriği -->
<main class="p-8">
	<h1 class="mb-4 text-2xl font-bold">Svelte 5 Drawer Örneği</h1>

	<div class="flex gap-4">
		<!-- Sadece bir tane açma butonu yeterli -->
		<button onclick={show} class="rounded bg-blue-500 px-4 py-2 text-white"> Paneli Aç </button>
	</div>
</main>
