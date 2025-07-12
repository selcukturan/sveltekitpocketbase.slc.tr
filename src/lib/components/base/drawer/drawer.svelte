<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { tick, type Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { focustrap, portal } from '$lib/client/actions';
	import { isInput } from '$lib/client/utils';

	let {
		children,
		onOpen,
		onClose,
		escClose = true
	}: { children?: Snippet<[() => void]>; onOpen?: () => void; onClose?: () => void; escClose?: boolean } = $props();

	const id = $props.id();
	let openDrawer = $state(false);
	let drawer: HTMLElement | null = $state(null);
	let wrapper: HTMLElement | null = $state(null);
	let start = $state(1000);

	export const open = () => {
		openDrawer = true;
		tick().then(() => {
			onOpen?.();
		});
	};
	export const close = () => {
		openDrawer = false;
		tick().then(() => {
			onClose?.();
		});
	};

	const length = () => {
		return document.querySelectorAll('.slc-app-drawer-panel').length;
	};

	const backdropAttach: Attachment = (element) => {
		if (!(element instanceof HTMLDivElement)) {
			throw new Error('Backdrop element is not an HTMLDivElement');
		}

		const click = (event: MouseEvent) => {
			if (event.target === element) {
				close();
			}
		};

		element.addEventListener('click', click);

		return () => {
			element.removeEventListener('click', click);
		};
	};

	function handleEscPress(e: KeyboardEvent) {
		const target = e.target as HTMLElement;
		if (!drawer) return;
		const { index } = drawer.dataset;
		if (openDrawer && escClose && e.code == 'Escape' && !isInput(target) && index === `${length() - 1}`) {
			e.preventDefault();
			close();
		}
	}

	const zindex = $derived(start + length());
</script>

<svelte:window onkeydown={handleEscPress} />

<!-- Portal attach'ı ile drawer wrapper'ı body'ye ışınlıyoruz -->
<div bind:this={wrapper} data-id={id} class:slc-app-drawer-wrapper={true} {@attach portal}>
	{#if openDrawer}
		<!-- Backdrop -->
		<div
			class:slc-app-drawer-backdrop={true}
			class="bg-surface-300/50 fixed inset-0"
			style:z-index={zindex}
			{@attach backdropAttach}
			transition:fade={{ duration: 150 }}
		></div>

		<!-- Drawer Panel -->
		<div
			bind:this={drawer}
			{@attach focustrap}
			class:slc-app-drawer-panel={true}
			class="bg-surface-50 fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl"
			style:z-index={zindex}
			data-index={zindex - start}
			role="dialog"
			aria-modal="true"
			aria-labelledby="drawer-title"
			in:fly={{ duration: 150, x: 50 }}
			out:fly={{ duration: 150, x: 50 }}
		>
			{@render children?.(close)}
		</div>
	{/if}
</div>
