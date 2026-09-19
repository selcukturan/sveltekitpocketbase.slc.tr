<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { on } from 'svelte/events';

	type Placement = `${'top' | 'bottom'}-${'start' | 'center' | 'end'}` | `${'left' | 'right'}-${'start' | 'center' | 'end'}`;

	type Props = Omit<SvelteHTMLElements['div'], 'children'> & {
		placement?: Placement;
		matchTriggerWidth?: boolean;
		escClose?: boolean;
		trigger?: Snippet<
			[
				{
					active: boolean;
					toggle: () => void;
					open: () => void;
					close: () => void;
					attr: {
						type: 'button';
						id: string;
						popovertarget: string;
						style: string;
					};
				}
			]
		>;
		children?: Snippet<[{ close: () => void; triggerId: string }]>;
	};

	let { placement = 'bottom-start', matchTriggerWidth = false, escClose = true, class: classes = '', trigger, children, ...rest }: Props = $props();

	const id = $props.id();

	let active = $state(false);
	let popoverEl = $state<HTMLDivElement | null>(null);
	let container = $state<HTMLDivElement | null>(null);
	const popovertarget = $derived(`${id}-popover`);
	const anchorname = $derived(`--${id}-anchor`);
	const attr = $derived({
		type: 'button' as const,
		style: 'anchor-name:var(--anchor)',
		id,
		popovertarget,
		'aria-expanded': active,
		'aria-haspopup': 'true' as const
	});

	export const toggle = () => popoverEl?.togglePopover();
	export const open = () => !active && popoverEl?.showPopover();
	export const close = () => active && popoverEl?.hidePopover();
	export const states = {
		get active() {
			return active;
		}
	};
	export const data = {
		get id() {
			return id;
		}
	};
	export const el = {
		get popoverEl() {
			return popoverEl;
		},
		get container() {
			return container;
		}
	};

	const popoverEvents = (node: HTMLElement) => {
		const destroyClick = on(node, 'click', (e: MouseEvent) => {
			e.stopPropagation();
		});

		// ESC tuşunu yakalayıp tarayıcı davranışını engelliyoruz
		const destroyKeydown = on(document, 'keydown', (e: KeyboardEvent) => {
			if (!escClose && active && e.key === 'Escape') {
				e.preventDefault(); // Tarayıcının otomatik kapatma tetiklemesini engeller.
			}
		});

		const destroyToggle = on(node, 'toggle', (e: ToggleEvent) => {
			active = e.newState === 'open';
		});

		/* const destroyBlur = on(node, 'blur', (e: FocusEvent) => {
			if (!e.relatedTarget || !popoverEl?.contains(e.relatedTarget as Node)) {
				close();
			}
		}); */

		return () => {
			destroyClick();
			destroyKeydown();
			destroyToggle();
			/* destroyBlur(); */
		};
	};
</script>

<div
	bind:this={container}
	class="container"
	style:--anchor={anchorname}
	onfocusout={(e: FocusEvent) => {
		if (!e.relatedTarget || !container?.contains(e.relatedTarget as Node)) {
			close();
		}
	}}
>
	<!-- Trigger -->
	{@render trigger?.({ active, toggle, open, close, attr })}

	<!-- Popover -->
	<div
		bind:this={popoverEl}
		id={popovertarget}
		tabindex="-1"
		popover="auto"
		{@attach popoverEvents}
		class="popover {placement} {classes}"
		class:match-width={matchTriggerWidth}
		{...rest}
	>
		{@render children?.({ close, triggerId: id })}
	</div>
</div>

<style>
	.container {
		--default-background-color: var(--slc-system-bg-surface);
		--default-box-shadow: 0px 0px 16px -1px var(--slc-system-color-shadow);
		--default-border: solid 1px var(--slc-system-border);
		--default-border-radius: 10px;
		display: inline-block;
	}

	.popover {
		position-anchor: var(--anchor);

		/* reset */
		inset: auto;
		position: fixed;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		background: transparent;
		border: none;
		outline: none;

		/* size */
		min-width: min(var(--min-width, anchor-size(width)), 100%);
		width: max-content;
		max-width: min(calc(100% - var(--gutter, 5px) * 2), var(--max-width, 100vw));

		min-height: var(--min-height, auto);
		height: max-content;
		max-height: min(calc(100% - var(--gutter, 5px) * 2), var(--max-height, 100dvh));

		overflow: auto;

		border: var(--border, var(--default-border));
		border-radius: var(--border-radius, var(--default-border-radius));
		background-color: var(--background-color, var(--default-background-color));
		box-shadow: var(--box-shadow, var(--default-box-shadow));

		/* Animasyon başlangıç ve kapanış geçiş ayarları */
		/*  */
		opacity: 0;
		transform: translateY(3px);
		display: none;
		transition:
			opacity 0.15s ease-out,
			transform 0.15s ease-out,
			overlay 0.15s allow-discrete,
			display 0.15s allow-discrete;
	}

	/* Animasyon Bitiş Durumu (Açık) */
	/*  */
	.popover:popover-open {
		opacity: 1;
		display: block;
		transform: translateY(0px);
	}

	/* Animasyon Başlangıç Durumu (Açık) */
	/*  */
	@starting-style {
		.popover:popover-open {
			opacity: 0;
			transform: translateY(3px);
		}
	}

	.popover.match-width {
		width: min(anchor-size(width), 100%);
		min-width: 0;
	}

	/* --- CSS Anchor Positioning --- */

	/* Alt/üst yönler */
	.bottom-start,
	.bottom-center,
	.bottom-end,
	.top-start,
	.top-center,
	.top-end {
		position-try-fallbacks:
			flip-block,
			flip-block flip-inline;
		/* position-try-order: most-block-size; */
	}

	/* Sol/sağ yönler — bunlarda flip-inline gerekir */
	.left-start,
	.left-center,
	.left-end,
	.right-start,
	.right-center,
	.right-end {
		position-try-fallbacks:
			flip-inline,
			flip-inline flip-block;
		/* position-try-order: most-inline-size; */
	}

	/* Alt yönler: anchor'ın altında, üstünde boşluk */
	.bottom-start {
		position-area: block-end span-inline-end;
		margin-block: var(--gutter, 5px);
	}
	.bottom-center {
		position-area: block-end span-all;
		margin-block: var(--gutter, 5px);
	}
	.bottom-end {
		position-area: block-end span-inline-start;
		margin-block: var(--gutter, 5px);
	}

	/* Üst yönler: anchor'ın üstünde, altında boşluk */
	.top-start {
		position-area: block-start span-inline-end;
		margin-block: var(--gutter, 5px);
	}
	.top-center {
		position-area: block-start span-all;
		margin-block: var(--gutter, 5px);
	}
	.top-end {
		position-area: block-start span-inline-start;
		margin-block: var(--gutter, 5px);
	}

	/* Sol yönler: anchor'ın solunda, sağında boşluk */
	.left-start {
		position-area: inline-start span-block-end;
		margin-inline: var(--gutter, 5px);
	}
	.left-center {
		position-area: inline-start span-all;
		margin-inline: var(--gutter, 5px);
	}
	.left-end {
		position-area: inline-start span-block-start;
		margin-inline: var(--gutter, 5px);
	}

	/* Sağ yönler: anchor'ın sağında, solunda boşluk */
	.right-start {
		position-area: inline-end span-block-end;
		margin-inline: var(--gutter, 5px);
	}
	.right-center {
		position-area: inline-end span-all;
		margin-inline: var(--gutter, 5px);
	}
	.right-end {
		position-area: inline-end span-block-start;
		margin-inline: var(--gutter, 5px);
	}
</style>
