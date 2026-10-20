<script lang="ts">
	import { tick } from 'svelte';
	import { on } from 'svelte/events';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type RelationResolveData = { confirm: boolean };
	type HideFuncType = (confirm: boolean) => void;
	type AnimationDirectionType = 'right' | 'left' | 'top' | 'bottom' | 'none';

	type PropsType = Omit<SvelteHTMLElements['dialog'], 'children'> & {
		children: Snippet;
		animationDuration?: number;
		animationMove?: string;
		animationDirection?: AnimationDirectionType;
		onOpen?: () => void;
		onClose?: (confirm: boolean) => void;
	};

	let { children, animationDuration = 150, animationMove = '20px', animationDirection = 'none', onOpen, onClose, style, ...rest }: PropsType = $props();

	let dialog: HTMLDialogElement | null = $state(null);
	let isOpen = $state(false);
	let resolvePromise: ((data: RelationResolveData) => void) | null = null;
	let isClosing = $state(false);
	let closedby = $state<'any' | 'none' | 'closerequest' | null | undefined>('any');

	export const show = (): Promise<RelationResolveData> => {
		return new Promise<RelationResolveData>((resolve) => {
			resolvePromise = resolve;
			isOpen = true;
			tick().then(() => {
				dialog?.showModal();
				onOpen?.();
			});
		});
	};

	const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
	export const hide: HideFuncType = async (confirm) => {
		if (isClosing) return;
		isClosing = true;
		await sleep(animationDuration);
		isClosing = false;
		dialog?.close();
		isOpen = false;
		resolvePromise?.({ confirm });
		onClose?.(confirm);
		resolvePromise = null;
	};

	const dialogEvents = (dialogElement: HTMLElement) => {
		if (!(dialogElement instanceof HTMLDialogElement)) {
			throw new Error('Dialog element is not an HTMLDialogElement');
		}

		const destroyKeydown = on(dialogElement, 'keydown', (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				hide(false);
			}
		});
		const destroyCancel = on(dialogElement, 'cancel', (e: Event) => {
			e.preventDefault();
			if (e.target === dialogElement) {
				hide(false);
			}
		});

		return () => {
			destroyKeydown();
			destroyCancel();
		};
	};
</script>

<dialog
	style="--animation-duration: {animationDuration / 1000}s; --animation-move: {animationMove}; {style ?? ''}"
	{closedby}
	{@attach dialogEvents}
	class:slc-dialog={true}
	class:slc-dialog-right={animationDirection === 'right'}
	class:slc-dialog-left={animationDirection === 'left'}
	class:slc-dialog-top={animationDirection === 'top'}
	bind:this={dialog}
	class:closing={isClosing}
	{...rest}
>
	{#if isOpen}
		{@render children?.()}
	{/if}
</dialog>
