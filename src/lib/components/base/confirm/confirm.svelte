<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { fade, fly } from 'svelte/transition';
	import { focustrap } from '$lib/client/attachments';

	let { message = 'Onaylıyor musunuz?', yes = 'Evet', no = 'Hayır' }: { message?: string; yes?: string; no?: string } = $props();

	let resolvePromise: ((value: boolean) => void) | null = null;
	export const promise: Promise<boolean> = new Promise((resolve) => {
		resolvePromise = resolve;
	});

	let open = true;
	let startingZindex = $state(2000);

	const close = (value: boolean) => {
		if (resolvePromise != null) {
			open = false;
			resolvePromise(value); // Promise'i true veya false ile çöz
			resolvePromise = null; // Promise'i sıfırla, böylece tekrar kullanılabilir
		}
	};

	const length = () => {
		return document.querySelectorAll('.slc-app-confirm-dialog').length;
	};

	const zindex = $derived(startingZindex + length());
	const centerPositionClassess = 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-2xl';

	const confirmAttach: Attachment = (element) => {
		if (!(element instanceof HTMLDivElement)) {
			throw new Error('Confirm element is not an HTMLDivElement');
		}

		const handleWindowKeydown = (e: KeyboardEvent) => {
			const { index } = element.dataset;

			if (open && e.code == 'Escape' && index === `${length() - 1}`) {
				e.preventDefault();
				close(false);
			}
		};

		window.addEventListener('keydown', handleWindowKeydown);

		return () => {
			resolvePromise = null;
			window.removeEventListener('keydown', handleWindowKeydown);
		};
	};
</script>

<div transition:fade={{ duration: 150 }}>
	<!-- Backdrop -->
	<div class="bg-surface-300/40 fixed inset-0" style:z-index={zindex}></div>

	<!-- Confirm -->
	<div
		{@attach focustrap}
		{@attach confirmAttach}
		class:slc-app-confirm-dialog={true}
		class="bg-surface-50 fixed w-11/12 max-w-lg rounded-lg shadow-xl {centerPositionClassess}"
		style:z-index={zindex}
		data-index={zindex - startingZindex}
		role="dialog"
		aria-modal="true"
		aria-labelledby="confirm-title"
		in:fly={{ duration: 150, y: 20 }}
		out:fly={{ duration: 150, y: 20 }}
	>
		<div class="dialog-content">
			<p>{message}</p>
			<button onclick={() => close(false)}>{no}</button>
			<button onclick={() => close(true)}>{yes}</button>
		</div>
	</div>
</div>
