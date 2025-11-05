<script lang="ts">
	import { tick, type Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { focustrap, portal } from '$lib/attachments';
	import { isInput } from '$lib/utils/common';
	import { watch } from 'runed';

	let {
		status = $bindable('close'),
		children,
		onOpen,
		onClose,
		onBeforeClose,
		escClose = true
	}: {
		status?: 'open' | 'close' | 'waiting';
		children?: Snippet<[() => void]>;
		onOpen?: () => void;
		onClose?: () => void;
		onBeforeClose?: () => Promise<boolean>;
		escClose?: boolean;
	} = $props();

	const id = $props.id();

	let drawer: HTMLElement | null = $state(null);
	let startingZindex = $state(1000);
	let waitingForClose = $state(false);

	export const show = () => {
		status = 'open';
		tick().then(() => {
			onOpen?.();
		});
	};

	export const hide = () => {
		if (onBeforeClose) {
			waitingForClose = true;
			onBeforeClose().then((shouldClose) => {
				waitingForClose = false;
				if (shouldClose) {
					performClose();
				}
			});
		} else {
			performClose();
		}
	};

	const performClose = () => {
		status = 'close';
		tick().then(() => {
			onClose?.();
		});
	};

	const length = () => {
		return document.querySelectorAll('.slc-app-drawer-panel').length;
	};

	const onkeydown = (e: KeyboardEvent) => {
		const target = e.target as HTMLElement;
		if (!drawer) return;
		const { index } = drawer.dataset;
		if (
			!waitingForClose &&
			status !== 'close' &&
			escClose &&
			e.code == 'Escape' &&
			!isInput(target) &&
			index === `${length() - 1}`
		) {
			e.preventDefault();
			hide();
		}
	};

	const zindex = $derived(startingZindex + length());

	watch(
		() => status,
		(curr, prev) => {
			console.log('open', curr);
			if (curr === 'open') {
				show();
			} else if (curr === 'close') {
				hide();
			}
		}
	);

	/* watch.pre(
		() => open,
		(curr, prev) => {
			console.log('pre open', curr);
		}
	); */

	/* let proxy = {
		set open(value) {
			open = value;
		},
		get open() {
			return open;
		}
	}; */
</script>

<svelte:window {onkeydown} />

<!-- Portal -->
<div {@attach portal} class:slc-app-drawer-wrapper={true} data-id={id}>
	{#if status === 'open' || status === 'waiting'}
		<!-- Backdrop -->
		<div
			role="presentation"
			onclick={() => (status = 'close')}
			class:slc-app-drawer-backdrop={true}
			class="bg-surface-300/50 fixed inset-0"
			style:z-index={zindex}
			transition:fade={{ duration: 150 }}
		></div>

		<!-- Drawer -->
		<div
			bind:this={drawer}
			{@attach focustrap}
			class:slc-app-drawer-panel={true}
			class="bg-surface-50 fixed top-0 right-0 h-full w-full max-w-2xl shadow-xl"
			style:z-index={zindex}
			data-index={zindex - startingZindex}
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
